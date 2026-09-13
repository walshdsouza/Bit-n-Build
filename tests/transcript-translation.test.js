const assert = require('node:assert/strict');
const { translateTranscriptToEnglish, needsEnglishTranslation } = require('./.build/lib/transcript-translation.js');
const { generateGloss } = require('./.build/lib/gloss-engine.js');
const { buildSignPlan } = require('./.build/lib/sign-plan.js');

(async () => {
  const originalFetch = global.fetch;
  let checks = 0;
  const equal = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
  const rejectCode = async (promise, code) => { await assert.rejects(promise, error => error.code === code); checks++; };
  const hindi = [{ start: 1.25, end: 3.75, text: 'मुझे पानी चाहिए।' }, { start: 4.5, end: 6, text: 'मुझे पानी नहीं चाहिए।' }];
  const english = [{ ...hindi[0], text: 'I want water.' }, { ...hindi[1], text: 'I do not want water.' }];
  const keys = { groqKey: 'test-groq-key', sourceLanguage: 'hi' };
  const reply = translations => Response.json({ choices: [{ message: { content: JSON.stringify({ translations: Object.fromEntries(translations.map(item => [item.id, item.text])) }) } }] });
  try {
    let calls = 0;
    global.fetch = async () => { calls++; throw new Error('Unexpected provider request'); };
    equal(needsEnglishTranslation(hindi), true);
    equal(needsEnglishTranslation([{ start: 0, end: 1, text: 'Mujhe paani chahiye.' }], 'hi'), true);
    equal(needsEnglishTranslation(english, 'en-US'), false);
    equal(needsEnglishTranslation([{ start: 0, end: 1, text: 'Hello — I’m here! 😀' }], 'en'), false);
    equal(await translateTranscriptToEnglish(english, {}), english);
    equal(await translateTranscriptToEnglish([], keys), []);
    await rejectCode(translateTranscriptToEnglish(hindi, {}), 'TRANSLATION_NOT_CONFIGURED');
    await rejectCode(generateGloss(hindi, { lang: 'ASL', rulesOnly: true }), 'TRANSLATION_NOT_CONFIGURED');
    await rejectCode(generateGloss([{ start: 0, end: 3, text: 'café naïve 日本語' }], { lang: 'ASL', rulesOnly: true }), 'TRANSLATION_NOT_CONFIGURED');
    equal(calls, 0);

    global.fetch = async (url, options) => {
      equal(url, 'https://api.groq.com/openai/v1/chat/completions');
      equal(options.headers.Authorization, 'Bearer test-groq-key');
      const request = JSON.parse(options.body);
      equal(JSON.parse(request.messages[1].content).captions, hindi.map((segment, id) => ({ id, text: segment.text })));
      equal(request.response_format.type, 'json_schema');
      equal(request.response_format.json_schema.strict, true);
      equal(request.response_format.json_schema.schema.properties.translations.required, ['0', '1']);
      // A provider may reorder JSON entries: IDs, not array position, bind text.
      return reply([{ id: 1, text: english[1].text }, { id: 0, text: english[0].text }]);
    };
    equal(await translateTranscriptToEnglish(hindi, keys), english);
    equal(hindi[0].text, 'मुझे पानी चाहिए।');
    const retriedIds = [];
    global.fetch = async (_url, options) => {
      const captions = JSON.parse(JSON.parse(options.body).messages[1].content).captions;
      retriedIds.push(captions.map(caption => caption.id));
      if (retriedIds.length === 1) return Response.json({ error: {
        code: 'json_validate_failed', failed_generation: JSON.stringify({ translations: { '0': english[0].text } }),
      } }, { status: 400 });
      return reply([{ id: 1, text: english[1].text }]);
    };
    equal(await translateTranscriptToEnglish(hindi, keys), english);
    equal(retriedIds, [[0, 1], [1]]);
    const models = [];
    global.fetch = async (_url, options) => {
      models.push(JSON.parse(options.body).model);
      return models.length === 1 ? new Response('Limited', { status: 429, headers: { 'retry-after': '120' } }) : reply(english.map((segment, id) => ({ id, text: segment.text })));
    };
    equal(await translateTranscriptToEnglish(hindi, keys), english);
    equal(models, ['openai/gpt-oss-120b', 'openai/gpt-oss-20b']);
    for (const translations of [
      [{ id: 0, text: 'I want water.' }],
      [{ id: 0, text: 'Water.' }, { id: 0, text: 'Water.' }],
      [{ id: 0, text: 'Water.' }, { id: 2, text: 'Water.' }],
      [{ id: 0, text: 'Water.' }, { id: 1, text: '' }],
      [{ id: 0, text: 'Water.' }, { id: 1, text: 'पानी' }],
    ]) {
      global.fetch = async () => reply(translations);
      await rejectCode(translateTranscriptToEnglish(hindi, keys), 'TRANSLATION_RESPONSE_INVALID');
    }
    for (const body of [null, { choices: [] }, { choices: [{ message: { content: 'invalid JSON' } }] }]) {
      global.fetch = async () => Response.json(body);
      await rejectCode(translateTranscriptToEnglish(hindi, keys), 'TRANSLATION_RESPONSE_INVALID');
    }
    for (const status of [401, 429, 503]) {
      global.fetch = async () => new Response('Private account details', { status });
      await rejectCode(translateTranscriptToEnglish(hindi, keys), 'TRANSLATION_UNAVAILABLE');
    }

    global.fetch = async (url, options) => {
      equal(url, 'https://api.openai.com/v1/chat/completions');
      equal(JSON.parse(options.body).model, 'gpt-4o');
      return reply(english.map((segment, id) => ({ id, text: segment.text })));
    };
    equal(await translateTranscriptToEnglish(hindi, { openaiKey: 'test-openai-key', sourceLanguage: 'hi' }), english);

    const many = Array.from({ length: 70 }, (_, i) => ({ start: i * 2, end: i * 2 + 1, text: 'नमस्ते' }));
    let active = 0;
    let peak = 0;
    const batchSizes = [];
    global.fetch = async (_url, options) => {
      active++; peak = Math.max(peak, active);
      const captions = JSON.parse(JSON.parse(options.body).messages[1].content).captions;
      batchSizes.push(captions.length);
      await new Promise(resolve => setTimeout(resolve, 5));
      active--;
      return reply(captions.map(caption => ({ id: caption.id, text: `Hello ${caption.id}.` })));
    };
    const translated = await translateTranscriptToEnglish(many, keys);
    equal(batchSizes, [32, 32, 6]);
    equal(peak, 2);
    equal(translated.map(segment => [segment.start, segment.end]), many.map(segment => [segment.start, segment.end]));
    equal(translated[69].text, 'Hello 69.');

    // Complete Hindi → English → local ASL → avatar plan regression. If the
    // optional gloss model fails, translated negation and timing still survive.
    calls = 0;
    global.fetch = async () => ++calls === 1 ? reply(english.map((segment, id) => ({ id, text: segment.text }))) : new Response('Unavailable', { status: 503 });
    const gloss = await generateGloss(hindi, { lang: 'ASL', groqKey: 'test-groq-key' });
    equal(gloss.engine, 'rules');
    equal(gloss.rows[0].sourceText, hindi[0].text);
    equal(gloss.rows[1].gloss.includes('NOT'), true);
    equal(gloss.rows.map(row => [row.startTime, row.endTime]), hindi.map(segment => [segment.start, segment.end]));
    const plan = buildSignPlan(gloss.rows, { lang: 'ASL', duration: 6 });
    equal(plan.items.length > 0, true);
    equal(plan.lang, 'ASL');
  } finally {
    global.fetch = originalFetch;
  }
  console.log(`Multilingual caption translation and Hindi signing: ${checks} passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
