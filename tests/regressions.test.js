const assert = require("node:assert/strict");
const B = __dirname + "/.build/lib";
const { normalizeSegments } = require(B + "/segments.js");
const { getProfile, isSupported } = require(B + "/sign-languages.js");
const { analyzeProsody } = require(B + "/prosody.js");
const { extractYouTubeVideoId } = require(B + "/youtube-url.js");
const { decodeCaptionText } = require(B + "/youtube-captions.js");
const { readJsonObject, readDuration, readLanguage, readGlossRows, readProsody, RequestError } = require(B + "/request-validation.js");
const { buildSignPlan } = require(B + "/sign-plan.js");
const { generateGloss } = require(B + "/gloss-engine.js");

(async () => {
  let assertions = 0;
  const equal = (actual, expected) => { assert.deepEqual(actual, expected); assertions++; };
  const bad = (fn) => { assert.throws(fn, RequestError); assertions++; };
  for (const value of [null, [], true, 42, "string"]) {
    await assert.rejects(readJsonObject(new Request("http://localhost", { method: "POST", body: JSON.stringify(value) })), RequestError);
    assertions++;
  }
  equal(await readJsonObject(new Request("http://localhost", { method: "POST", body: '{"segments":[]}' })), { segments: [] });
  for (const value of [{}, [], true, 42]) {
    equal(isSupported(value), false);
    equal(getProfile(value).code, "ASL");
    bad(() => readLanguage(value));
  }
  equal(readLanguage(null), undefined);
  equal(getProfile("isl").code, "ISL");
  for (const value of [NaN, Infinity, -1, "oops", [], {}]) bad(() => readDuration(value));
  equal(readDuration(3.5), 3.5);

  const normalized = normalizeSegments([
    { start: 0, end: 3, text: "First." },
    { start: null, end: null, text: "Second." },
    { start: { valueOf: "invalid" }, end: [], text: "Third." },
  ]);
  equal(normalized.map(({ start, end }) => [start, end]), [[0, 3], [3, 5], [5, 7]]);
  equal(normalizeSegments([null, { text: "  " }, { text: null }]), []);

  const row = { startTime: 0, endTime: 2, gloss: "GO WATER" };
  for (const value of [[null], [{}], [{ ...row, gloss: 2 }], [{ ...row, endTime: -1 }], [{ ...row, nmm: [null] }]]) {
    bad(() => readGlossRows(value));
  }
  const validRows = readGlossRows([row]);
  equal(validRows[0].nmm, []);
  const plan = buildSignPlan(validRows, { lang: "ASL" });
  equal(plan.items.length, 2);
  equal(plan.duration, 2);
  bad(() => readProsody({}));
  bad(() => readProsody([null]));
  const frame = { time: 0, energy: 0.5, pitch: 0.5, rate: 2, confidence: 0.5, emotion: "neutral" };
  bad(() => readProsody([{ ...frame, energy: 99 }]));
  bad(() => readProsody([{ ...frame, rate: NaN }]));
  equal(readProsody([{ ...frame, time: 5 }, frame]).map((f) => f.time), [0, 5]);

  for (const text of ["I know another person.", "That is a normal notebook.", "This flower blooms."]) {
    equal(analyzeProsody([{ start: 0, end: 3, text }])[0].emotion, "neutral");
  }
  equal(analyzeProsody([{ start: 0, end: 3, text: "They laugh together." }])[0].emotion, "happy");
  equal(analyzeProsody([{ start: 0, end: 3, text: "No, I refuse." }])[0].emotion, "angry");

  const id = "dQw4w9WgXcQ";
  for (const url of [id, `https://www.youtube.com/watch?v=${id}&t=3`, `https://youtu.be/${id}`, `youtube.com/shorts/${id}`, `https://www.youtube.com/live/${id}`, `https://www.youtube-nocookie.com/embed/${id}`]) {
    equal(extractYouTubeVideoId(url), id);
  }
  for (const url of [null, 3, {}, "https://evil.test/youtube.com/watch?v=" + id, "https://notyoutube.com/watch?v=" + id, "https://youtube.com.evil.test/watch?v=" + id, "https://youtube.com/watch?v=" + id + "extra", "javascript:alert(1)"]) {
    equal(extractYouTubeVideoId(url), null);
  }
  equal(decodeCaptionText("that&#39;s\ncool &amp; helpful"), "that's cool & helpful");
  equal(decodeCaptionText("&amp;#39;hello&amp;#39;"), "'hello'");
  equal(decodeCaptionText("&#x1f44b; &#1114112;"), "👋 &#1114112;");
  const originalFetch = global.fetch;
  try {
    const segments = [{ start: 0, end: 2, text: "I drink water." }];
    for (const gloss of [[null], [{}], [""], []]) {
      global.fetch = async () => Response.json({ choices: [{ message: { content: JSON.stringify({ gloss }) } }] });
      const result = await generateGloss(segments, { lang: "ISL", groqKey: "test-provider-key" });
      equal(result.engine, "rules");
      equal(result.rows[0].gloss, "IX-1 WATER DRINK");
    }
    global.fetch = async (_url, options) => {
      assert.ok(options.signal instanceof AbortSignal); assertions++;
      return Response.json({ choices: [{ message: { content: '{"gloss":["IX-1 WATER DRINK"]}' } }] });
    };
    equal((await generateGloss(segments, { lang: "ISL", groqKey: "test-provider-key" })).engine, "llm");
    const fromModel = async (text, gloss, lang = "ASL") => {
      global.fetch = async () => Response.json({ choices: [{ message: { content: JSON.stringify({ gloss: [gloss] }) } }] });
      return generateGloss([{ start: 0, end: 4, text }], { lang, groqKey: "test-provider-key" });
    };
    for (const lang of ["ASL", "ISL"]) {
      const time = await fromModel("Yesterday I went to school.", "IX-1 YESTERDAY SCHOOL GO", lang);
      equal(time.engine, "llm");
      equal(time.rows[0].gloss, "YESTERDAY IX-1 SCHOOL GO");
      for (const text of ["I dont want pizza.", "I don't want pizza.", "I don’t want pizza.", "I cannot want pizza."]) {
        const negative = await fromModel(text, "IX-1 WANT PIZZA", lang);
        equal(negative.engine, "rules");
        equal(negative.rows[0].gloss.split(" ").includes("NOT"), true);
        equal(negative.rows[0].nmm.some((tag) => tag.emotion === "negative_headshake"), true);
      }
      const missingTime = await fromModel("Yesterday I went to school.", "IX-1 SCHOOL GO", lang);
      equal(missingTime.engine, "rules");
      equal(missingTime.rows[0].gloss.startsWith("YESTERDAY "), true);
      const correct = await fromModel("I don't want pizza.", "IX-1 PIZZA WANT NOT", lang);
      equal(correct.engine, "llm");
      equal(correct.rows[0].gloss, "IX-1 PIZZA WANT NOT");
      equal(correct.rows[0].nmm.some((tag) => tag.emotion === "negative_headshake"), true);
    }
    const affirmative = await fromModel("I want pizza.", "PIZZA IX-1 WANT");
    equal(affirmative.engine, "llm");
    equal(affirmative.rows[0].gloss, "PIZZA IX-1 WANT");
    equal(affirmative.rows[0].nmm.some((tag) => tag.emotion === "negative_headshake"), false);
    equal((await fromModel("I will go home.", "IX-1 FUTURE HOME GO")).rows[0].gloss, "FUTURE IX-1 HOME GO");
    equal((await fromModel("Yesterday I went to school.", "I YESTERDAY SCHOOL WENT")).rows[0].gloss, "YESTERDAY IX-1 SCHOOL GO");
    equal((await fromModel("Hello.", "!!!")).engine, "rules");
  } finally {
    global.fetch = originalFetch;
  }
  console.log(`Input and pipeline regressions: ${assertions} passed`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
