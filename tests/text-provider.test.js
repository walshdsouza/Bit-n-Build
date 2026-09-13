const assert = require('node:assert/strict');
const { createTextProvider, GROQ_TEXT_MODELS, providerRetryAfterMs } = require('./.build/lib/text-provider.js');
const { generateGloss } = require('./.build/lib/gloss-engine.js');
const { translateTranscriptToEnglish } = require('./.build/lib/transcript-translation.js');

(async () => {
  const originalFetch = global.fetch;
  let checks = 0;
  const equal = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
  const controller = new AbortController();
  const pool = () => createTextProvider({ groqKey: 'fake-key', signal: controller.signal });
  const models = [];
  try {
    equal(providerRetryAfterMs(new Response('', { headers: { 'retry-after': '30' } })), 30000);
    equal(providerRetryAfterMs(new Response('', { headers: { 'retry-after': 'Sun, 13 Sep 2026 01:01:00 GMT' } }), Date.parse('2026-09-13T01:00:00Z')), 60000);
    for (const value of ['', 'nonsense', '-5', '0']) equal(providerRetryAfterMs(new Response('', { headers: { 'retry-after': value } })), 5000);
    global.fetch = async (_url, options) => {
      const body = JSON.parse(options.body); models.push(body.model);
      if (body.model !== 'qwen/qwen3.8-27b') return new Response('', { status: 429, headers: { 'retry-after': '120' } });
      equal(body.reasoning_effort, 'none');
      equal(body.response_format.json_schema.strict, true);
      return Response.json({ choices: [{ message: { content: '{"translations":{"0":"I do not want water."}}' } }] });
    };
    const hindi = [{ start: 1, end: 4, text: 'मुझे पानी नहीं चाहिए।' }];
    equal(await translateTranscriptToEnglish(hindi, { groqKey: 'fake-key' }), [{ ...hindi[0], text: 'I do not want water.' }]);
    equal(models, [...GROQ_TEXT_MODELS]);

    models.length = 0;
    global.fetch = async (_url, options) => {
      const model = JSON.parse(options.body).model; models.push(model);
      return model === GROQ_TEXT_MODELS[2]
        ? Response.json({ choices: [{ message: { content: '{"gloss":["IX-1 WATER WANT NOT"]}' } }] })
        : new Response('', { status: 429, headers: { 'retry-after': '900' } });
    };
    const gloss = await generateGloss([{ start: 0, end: 4, text: 'I do not want water.' }], { lang: 'ASL', groqKey: 'fake-key' });
    equal(gloss.engine, 'llm'); equal(gloss.rows[0].gloss.includes('NOT'), true);
    equal(models, [...GROQ_TEXT_MODELS]);

    models.length = 0;
    global.fetch = async (_url, options) => {
      const model = JSON.parse(options.body).model; models.push(model);
      return new Response('', { status: 429, headers: { 'retry-after': model === GROQ_TEXT_MODELS[2] ? '30' : '120' } });
    };
    const limited = pool();
    const isLimited = error => error.status === 429 && error.retryAfterMs > 28000 && error.retryAfterMs <= 30000;
    await assert.rejects(limited({}), isLimited); checks++;
    await assert.rejects(limited({}), isLimited); checks++;
    equal(models, [...GROQ_TEXT_MODELS]); // Second worker/batch does not hit exhausted models again.

    for (const status of [401, 400]) {
      models.length = 0;
      global.fetch = async (_url, options) => { models.push(JSON.parse(options.body).model); return new Response('', { status }); };
      equal((await pool()({})).status, status); equal(models.length, 1);
    }
    models.length = 0;
    global.fetch = async (_url, options) => { models.push(JSON.parse(options.body).model); return new Response('', { status: 404 }); };
    await assert.rejects(pool()({}), error => error.status === 502); checks++;
    equal(models.length, 3); // Preview removal exits; never cycles back to primary.

    let called = false;
    global.fetch = async () => { called = true; throw new Error('Must not request after abort'); };
    controller.abort();
    await assert.rejects(pool()({}), error => error.name === 'AbortError'); checks++;
    equal(called, false);
    const cancel = new AbortController();
    global.fetch = async (_url, options) => {
      equal(options.signal, cancel.signal);
      cancel.abort();
      return new Response('', { status: 429 });
    };
    await assert.rejects(createTextProvider({ groqKey: 'fake-key', signal: cancel.signal })({}), error => error.name === 'AbortError'); checks++;
  } finally { global.fetch = originalFetch; }
  console.log(`Text-provider fallback, shared quota cooldown and cancellation: ${checks} passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
