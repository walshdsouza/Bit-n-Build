const B = __dirname + "/.build/lib";
const { glossByRules, generateGloss } = require(B + "/gloss-engine.js");
const { getProfile } = require(B + "/sign-languages.js");
const { buildSignPlan, signAt } = require(B + "/sign-plan.js");
const { encodeHamNoSys, estimateSignDuration } = require(B + "/hamnosys.js");
const { analyzeProsody } = require(B + "/prosody.js");
const { buildFingerspelling, dictionaryStats } = require(B + "/dictionaries/index.js");
const { solvePose, lerpPose, restPose } = require(B + "/avatar/pose-solver.js");

let pass = 0, fail = 0;
const fails = [];
function check(name, cond, detail) {
  if (cond) { pass++; }
  else { fail++; fails.push(`${name}${detail ? " :: " + detail : ""}`); }
}
const ASL = getProfile("ASL"), ISL = getProfile("ISL");
const g = (t, p) => glossByRules(t, p).join(" ");

console.log("=".repeat(70));
console.log("1. CONTRACTIONS / NEGATION");
console.log("=".repeat(70));
for (const [txt, label] of [
  ["I don't want pizza.", "don't"],
  ["I do not want pizza.", "do not"],
  ["She can't go.", "can't"],
  ["They won't eat.", "won't"],
  ["He doesn't know.", "doesn't"],
  ["It isn't food.", "isn't"],
]) {
  const a = g(txt, ASL), i = g(txt, ISL);
  console.log(`  ${label.padEnd(9)} ASL="${a}"  ISL="${i}"`);
  check(`negation preserved (${label})`, a.includes("NOT"), `got "${a}"`);
}

console.log("\n" + "=".repeat(70));
console.log("2. FALSE PAST-TENSE DETECTION (words ending in -ED)");
console.log("=".repeat(70));
for (const [txt, word] of [
  ["I need water.", "need"],
  ["I want the bed.", "bed"],
  ["The seed is good.", "seed"],
  ["I feed the friend.", "feed"],
]) {
  const a = g(txt, ASL);
  const bogus = a.includes("BEFORE");
  console.log(`  ${word.padEnd(6)} -> "${a}"${bogus ? "   <-- spurious BEFORE" : ""}`);
  check(`no spurious past marker (${word})`, !bogus, `got "${a}"`);
}
// True past should still work
for (const [txt, word] of [["I walked home.", "walked"], ["I went home.", "went"]]) {
  const a = g(txt, ASL);
  console.log(`  ${word.padEnd(6)} -> "${a}"`);
  check(`real past detected (${word})`, a.includes("BEFORE"), `got "${a}"`);
}

console.log("\n" + "=".repeat(70));
console.log("3. ISL GRAMMAR INVARIANTS");
console.log("=".repeat(70));
const VERBS_T = ["DRINK", "GO", "EAT", "WANT", "CALL", "LEARN"];
for (const txt of [
  "I drink water.",
  "Yesterday I went to school.",
  "I eat food.",
  "She calls her friend.",
]) {
  const toks = glossByRules(txt, ISL);
  const last = toks[toks.length - 1];
  const verbInSentence = toks.filter(t => VERBS_T.includes(t));
  console.log(`  "${txt}" -> ${toks.join(" ")}`);
  if (verbInSentence.length) {
    check(`ISL SOV verb-final (${txt})`, VERBS_T.includes(last), `last token "${last}"`);
  }
}
// Time marker must be first
for (const txt of ["Yesterday I went to school.", "Tomorrow I eat food."]) {
  const toks = glossByRules(txt, ISL);
  check(`ISL time marker first (${txt})`, ["YESTERDAY","TOMORROW","BEFORE","FUTURE","NOW","TODAY"].includes(toks[0]), `got ${toks.join(" ")}`);
}
// Question word must be last
for (const txt of ["What is your name?", "Where do you go?"]) {
  const toks = glossByRules(txt, ISL);
  console.log(`  "${txt}" -> ${toks.join(" ")}`);
  check(`ISL question-final (${txt})`, ["WHAT","WHO","WHERE","WHEN","WHY","HOW"].includes(toks[toks.length-1]), `got ${toks.join(" ")}`);
}
// Negation after verb
{
  const toks = glossByRules("I do not want pizza.", ISL);
  const ni = toks.indexOf("NOT"), vi = toks.indexOf("WANT");
  console.log(`  negation order -> ${toks.join(" ")}`);
  check("ISL negation after verb", ni > vi && vi !== -1, `got ${toks.join(" ")}`);
}

console.log("\n" + "=".repeat(70));
console.log("4. FINGERSPELLING HANDEDNESS");
console.log("=".repeat(70));
const fsA = buildFingerspelling("ASL", "ZXQV"), fsI = buildFingerspelling("ISL", "ZXQV");
console.log(`  ASL: ${fsA.length} letters, twoHanded=${fsA[0].twoHanded}, loc=${fsA[0].dominant.location}`);
console.log(`  ISL: ${fsI.length} letters, twoHanded=${fsI[0].twoHanded}, loc=${fsI[0].dominant.location}, nonDom=${!!fsI[0].nonDominant}`);
check("ASL fingerspelling one-handed", fsA.every(e => !e.twoHanded));
check("ISL fingerspelling two-handed", fsI.every(e => e.twoHanded && e.nonDominant));
check("ISL letters anchored at weak palm", fsI.every(e => e.dominant.location === "palm_weak"));
check("fingerspelling length matches", fsA.length === 4 && fsI.length === 4);
// O'Brien-2! -> OBRIEN2 = 7 letters (apostrophe, hyphen, bang stripped)
check("fingerspelling strips punctuation", buildFingerspelling("ASL", "O'Brien-2!").length === 7, `got ${buildFingerspelling("ASL","O'Brien-2!").length}`);
check("fingerspelling empty string safe", buildFingerspelling("ASL", "").length === 0);
check("fingerspelling all-punct safe", buildFingerspelling("ASL", "!!!").length === 0);

console.log("\n" + "=".repeat(70));
console.log("5. HAMNOSYS ENCODING");
console.log("=".repeat(70));
const dictA = dictionaryStats("ASL"), dictI = dictionaryStats("ISL");
console.log(`  ASL dict: ${dictA.entries} (2H:${dictA.twoHanded})   ISL dict: ${dictI.entries} (2H:${dictI.twoHanded})`);
let emptyHam = 0, badChars = 0;
for (const code of ["ASL", "ISL"]) {
  const { getDictionary } = require(B + "/dictionaries/index.js");
  for (const [gloss, entry] of getDictionary(code)) {
    const h = encodeHamNoSys(entry);
    if (!h || h.length === 0) { emptyHam++; console.log(`    EMPTY hamnosys: ${code} ${gloss}`); }
    for (const ch of h) {
      const cp = ch.codePointAt(0);
      if (cp < 0xE000 || cp > 0xF8FF) { badChars++; console.log(`    NON-PUA char in ${code} ${gloss}: U+${cp.toString(16)}`); }
    }
    const d = estimateSignDuration(entry, 0.55);
    if (!(d > 0) || !isFinite(d)) console.log(`    BAD duration ${code} ${gloss}: ${d}`);
  }
}
check("all dictionary entries encode to HamNoSys", emptyHam === 0, `${emptyHam} empty`);
check("all HamNoSys chars in PUA range", badChars === 0, `${badChars} bad`);

console.log("\n" + "=".repeat(70));
console.log("6. SIGML WELL-FORMEDNESS");
console.log("=".repeat(70));
function xmlWellFormed(xml) {
  const stack = [];
  const re = /<(\/?)([A-Za-z_][\w.-]*)([^>]*?)(\/?)>/g;
  let m;
  const body = xml.replace(/<\?[^?]*\?>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  while ((m = re.exec(body))) {
    const [, close, name, attrs, selfClose] = m;
    if (close) {
      if (stack.pop() !== name) return `mismatched close </${name}>`;
    } else if (!selfClose) stack.push(name);
    // unescaped & or < inside attrs
    if (/&(?!(amp|lt|gt|quot|apos|#\d+);)/.test(attrs)) return `unescaped & in attrs of <${name}>`;
  }
  return stack.length ? `unclosed: ${stack.join(",")}` : null;
}
async function sigmlTest(lang, text) {
  const segs = [{ start: 0, end: 5, text }];
  const { rows } = await generateGloss(segs, { lang, rulesOnly: true });
  const plan = buildSignPlan(rows, { lang, prosody: analyzeProsody(segs) });
  const err = xmlWellFormed(plan.sigml);
  console.log(`  ${lang} "${text.slice(0,40)}" items=${plan.items.length} sigml=${plan.sigml.length}B ${err ? "INVALID: " + err : "well-formed"}`);
  check(`SiGML well-formed (${lang}: ${text.slice(0,20)})`, !err, err || "");
  return plan;
}

(async () => {
  await sigmlTest("ASL", "The woman thinks about food.");
  await sigmlTest("ISL", "Yesterday I went to school.");
  // Adversarial: XML-injection via an unknown lemma
  await sigmlTest("ASL", 'Say <script>alert("x")</script> & more.');
  await sigmlTest("ISL", "Mr. O'Brien & Sons — \"quoted\".");

  console.log("\n" + "=".repeat(70));
  console.log("7. EDGE CASES / EMPTY INPUT");
  console.log("=".repeat(70));
  const cases = [
    ["empty text", ""],
    ["only punctuation", "..."],
    ["only stopwords", "the a an of to"],
    ["single word", "Hello"],
    ["very long", "word ".repeat(200)],
    ["unicode", "café naïve 日本語"],
    ["numbers", "I have 42 books in 2026."],
  ];
  for (const [label, text] of cases) {
    try {
      const segs = [{ start: 0, end: 3, text }];
      const { rows } = await generateGloss(segs, { lang: "ISL", rulesOnly: true });
      const plan = buildSignPlan(rows, { lang: "ISL" });
      const err = xmlWellFormed(plan.sigml);
      const badTiming = plan.items.some(i => !(i.endTime > i.startTime) || !isFinite(i.startTime) || !isFinite(i.endTime));
      console.log(`  ${label.padEnd(18)} gloss="${rows[0].gloss.slice(0,45)}" items=${plan.items.length} ${err ? "XML-ERR" : "ok"}${badTiming ? " BAD-TIMING" : ""}`);
      check(`no crash (${label})`, true);
      check(`valid XML (${label})`, !err, err || "");
      check(`monotonic timing (${label})`, !badTiming);
    } catch (e) {
      check(`no crash (${label})`, false, e.message);
      console.log(`  ${label.padEnd(18)} THREW: ${e.message}`);
    }
  }
  // empty segment array
  try {
    const { rows } = await generateGloss([], { lang: "ASL", rulesOnly: true });
    const plan = buildSignPlan(rows, { lang: "ASL" });
    console.log(`  empty segments     rows=${rows.length} items=${plan.items.length} duration=${plan.duration}`);
    check("empty segments no crash", rows.length === 0 && plan.items.length === 0);
  } catch (e) { check("empty segments no crash", false, e.message); }

  console.log("\n" + "=".repeat(70));
  console.log("8. TIMING / PLAN INTEGRITY");
  console.log("=".repeat(70));
  {
    const segs = [
      { start: 0, end: 4.2, text: "The woman thinks about food." },
      { start: 4.2, end: 8.0, text: "She wants pizza but is on a diet." },
      { start: 8.0, end: 13.1, text: "She calls her friend for advice." },
    ];
    const { rows } = await generateGloss(segs, { lang: "ASL", rulesOnly: true });
    const plan = buildSignPlan(rows, { lang: "ASL", prosody: analyzeProsody(segs), duration: 13.1 });
    let overlaps = 0, gaps = 0;
    for (let i = 1; i < plan.items.length; i++) {
      const prev = plan.items[i-1], cur = plan.items[i];
      if (cur.startTime < prev.endTime - 1e-6) overlaps++;
      if (cur.startTime > prev.endTime + 0.05) gaps++;
    }
    const first = plan.items[0], last = plan.items[plan.items.length-1];
    console.log(`  items=${plan.items.length} span=${first.startTime.toFixed(2)}..${last.endTime.toFixed(2)} overlaps=${overlaps} gaps=${gaps}`);
    check("plan items non-overlapping", overlaps === 0, `${overlaps} overlaps`);
    check("plan starts at 0", Math.abs(first.startTime) < 1e-6, `${first.startTime}`);
    check("plan ends at segment end", Math.abs(last.endTime - 13.1) < 0.05, `${last.endTime}`);
    check("every item has an NMM", plan.items.every(i => i.nmm.length > 0));
    // signAt coverage
    let uncovered = 0;
    for (let t = 0; t < 13.0; t += 0.05) if (!signAt(plan, t)) uncovered++;
    console.log(`  signAt uncovered samples: ${uncovered}/260`);
    check("signAt covers timeline", uncovered === 0, `${uncovered} uncovered`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("9. POSE SOLVER NUMERIC SAFETY");
  console.log("=".repeat(70));
  {
    const { getDictionary } = require(B + "/dictionaries/index.js");
    let nan = 0, oob = 0, checked = 0;
    const finite = v => isFinite(v.x) && isFinite(v.y) && isFinite(v.z);
    for (const code of ["ASL", "ISL"]) {
      for (const [gloss, entry] of getDictionary(code)) {
        for (let t = 0; t <= 1.0001; t += 0.1) {
          const item = { gloss, startTime: 0, endTime: 1, entry, nmm: [{ time: 0, emotion: entry.nmm || "neutral", intensity: 0.7 }], emphasis: 0.5 };
          const p = solvePose(item, t);
          checked++;
          for (const h of [p.right, p.left]) {
            if (!finite(h.pos) || !finite(h.rot)) { nan++; if (nan < 4) console.log(`    NaN: ${code} ${gloss} t=${t.toFixed(1)}`); }
            if (h.curl.some(c => !isFinite(c) || c < -0.01 || c > 1.01)) { oob++; if (oob<4) console.log(`    curl OOB: ${code} ${gloss}`); }
            // hand should stay in a plausible box around the body
            if (Math.abs(h.pos.x) > 1.2 || h.pos.y < -0.5 || h.pos.y > 2.6 || Math.abs(h.pos.z) > 1.2) {
              oob++; if (oob<4) console.log(`    pos OOB: ${code} ${gloss} (${h.pos.x.toFixed(2)},${h.pos.y.toFixed(2)},${h.pos.z.toFixed(2)})`);
            }
          }
          const f = p.face;
          if (![f.brow,f.mouth,f.headPitch,f.headYaw,f.headRoll].every(isFinite)) { nan++; }
        }
      }
    }
    console.log(`  solved ${checked} poses across both dictionaries`);
    check("no NaN in solved poses", nan === 0, `${nan} NaN`);
    check("no out-of-range values", oob === 0, `${oob} OOB`);
    // null item
    const rest = solvePose(null, 0);
    check("null item -> rest pose", isFinite(rest.right.pos.x));
    // entry-less item
    const fsItem = { gloss: "X", startTime: 0, endTime: 1, entry: null, nmm: [], emphasis: 0.5 };
    check("null entry -> rest pose", isFinite(solvePose(fsItem, 0.5).right.pos.y));
    // lerp
    const l = lerpPose(restPose(), solvePose({ gloss:"A",startTime:0,endTime:1,entry:getDictionary("ISL").get("WATER"),nmm:[],emphasis:0.5 }, 0.5), 0.5);
    check("lerpPose finite", isFinite(l.right.pos.x) && l.right.curl.every(isFinite));
    check("lerpPose k=0 identity", Math.abs(lerpPose(restPose(), restPose(), 0).right.pos.x - restPose().right.pos.x) < 1e-9);
    // Arm reach: verify hands are reachable from shoulder (UPPER_ARM+FOREARM = 0.56)
    let unreachable = 0;
    for (const code of ["ASL","ISL"]) {
      for (const [gloss, entry] of getDictionary(code)) {
        const p = solvePose({gloss,startTime:0,endTime:1,entry,nmm:[],emphasis:1}, 0.5);
        const d = Math.hypot(p.right.pos.x - 0.175, p.right.pos.y - 1.33, p.right.pos.z);
        if (d > 0.56) { unreachable++; if (unreachable<5) console.log(`    out of reach: ${code} ${gloss} dist=${d.toFixed(3)} (max 0.56)`); }
      }
    }
    console.log(`  signs requiring arm clamp: ${unreachable}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("10. PROSODY");
  console.log("=".repeat(70));
  {
    const segs = [
      { start: 0, end: 3, text: "What is happening?" },
      { start: 3, end: 6, text: "That is absolutely wonderful!" },
      { start: 6, end: 9, text: "Unfortunately she was very sad." },
      { start: 9, end: 12, text: "The table is brown." },
    ];
    const pf = analyzeProsody(segs);
    for (const f of pf) console.log(`    t=${f.time} emotion=${f.emotion.padEnd(11)} conf=${f.confidence.toFixed(2)} energy=${f.energy.toFixed(2)} rate=${f.rate}`);
    check("prosody frame per segment", pf.length === segs.length);
    check("question detected", pf[0].emotion === "questioning", pf[0].emotion);
    check("emphatic detected", pf[1].emotion === "emphatic", pf[1].emotion);
    check("energy in range", pf.every(f => f.energy >= 0 && f.energy <= 1));
    check("prosody empty input safe", analyzeProsody([]).length === 0);
  }

  console.log("\n" + "=".repeat(70));
  console.log(`RESULT: ${pass} passed, ${fail} failed`);
  if (fails.length) { console.log("\nFAILURES:"); fails.forEach(f => console.log("  ✗ " + f)); }
  console.log("=".repeat(70));
  if (fail) process.exitCode = 1;
})();
