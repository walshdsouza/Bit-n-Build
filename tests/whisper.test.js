const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

(async () => {
  const filename = path.join(__dirname, '.build/lib/whisper.js');
  const source = fs.readFileSync(filename, 'utf8');
  const timeouts = [];
  const requests = [];
  let checks = 0;
  const equal = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
  const transcript = { text: 'Hello my friend.', duration: 3, segments: [{ start: 0, end: 3, text: 'Hello my friend.' }] };
  let providerResponse = async () => Response.json(transcript);
  const exports = {};
  // Load the real compiled helper in an isolated browser-like global. Removing
  // process from Node itself would also break unrelated platform internals.
  const browser = vm.createContext({
    exports, module: { exports }, require: createRequire(filename), Blob, FormData,
    AbortSignal: {
      timeout(ms) { timeouts.push(ms); return AbortSignal.timeout(ms); },
      any: (signals) => AbortSignal.any(signals),
    },
    fetch: async (url, options) => {
      requests.push({ url, options });
      return providerResponse();
    },
  });
  new vm.Script(source, { filename }).runInContext(browser);
  const { transcribeAudioFile, validateApiKey } = exports;
  const audio = new Blob([new Uint8Array([1, 2, 3])], { type: 'audio/wav' });
  equal(vm.runInContext('typeof process', browser), 'undefined');
  equal(typeof validateApiKey, 'function');

  const browserResult = await transcribeAudioFile(audio, 'browser.wav', 'test-groq-key');
  equal(browserResult.text, transcript.text);
  equal(browserResult.provider, 'groq-whisper');
  equal(timeouts.at(-1), 120000);
  equal(requests.at(-1).url, 'https://api.groq.com/openai/v1/audio/transcriptions');
  equal(requests.at(-1).options.body.get('model'), 'whisper-large-v3');
  equal(requests.at(-1).options.body.get('file').name, 'browser.wav');
  equal(requests.at(-1).options.signal instanceof AbortSignal, true);

  // The browser guard must preserve both server defaults and live's explicit
  // shorter deadline; neither environment may silently change provider choice.
  browser.process = { env: {} };
  await transcribeAudioFile(audio, 'local.wav', null, 'test-openai-key');
  equal(timeouts.at(-1), 120000);
  equal(requests.at(-1).url, 'https://api.openai.com/v1/audio/transcriptions');
  equal(requests.at(-1).options.body.get('model'), 'whisper-1');
  browser.process.env.VERCEL = '1';
  await transcribeAudioFile(audio, 'cloud.wav', 'test-groq-key');
  equal(timeouts.at(-1), 40000);
  await transcribeAudioFile(audio, 'live.wav', 'test-groq-key', null, { timeoutMs: 20000 });
  equal(timeouts.at(-1), 20000);
  delete browser.process;

  // Remote main added this export for extension settings and sidebar checks.
  // Validate authentication through models GETs, never audio/chat requests.
  for (const provider of ['groq', 'openai']) {
    providerResponse = async () => Response.json({ data: [] });
    let result = await validateApiKey(provider, `test-${provider}-key`);
    equal(result.valid, true);
    equal(result.provider, provider);
    equal(result.error, undefined);
    const request = requests.at(-1);
    equal(request.url, provider === 'groq' ? 'https://api.groq.com/openai/v1/models' : 'https://api.openai.com/v1/models');
    equal(request.options.headers.Authorization, `Bearer test-${provider}-key`);
    equal(request.options.method ?? 'GET', 'GET');
    equal(request.options.body, undefined);

    for (const status of [401, 403]) {
      providerResponse = async () => new Response('Private provider details', { status });
      result = await validateApiKey(provider, 'test-rejected-key');
      equal(result.valid, false);
      equal(result.provider, provider);
      equal(result.error, 'Key was rejected by the provider.');
    }
    for (const status of [429, 503]) {
      providerResponse = async () => new Response('Private provider details', { status });
      result = await validateApiKey(provider, 'test-unavailable-key');
      equal(result.valid, false);
      equal(result.error, `Unexpected response: ${status}`);
    }
    providerResponse = async () => { throw new Error('Network unavailable'); };
    result = await validateApiKey(provider, 'test-network-key');
    equal(result.valid, false);
    equal(result.provider, provider);
    equal(result.error.includes(`Could not reach ${provider}`), true);
  }
  console.log(`Browser transcription, server deadlines and merged API-key validation: ${checks} passed`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
