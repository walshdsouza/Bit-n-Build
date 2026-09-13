const assert = require('node:assert/strict');
const { handleLiveRequest, LIVE_TRANSCRIPTION_TIMEOUT_MS, isAllowedLiveOrigin } = require('./.build/lib/live-api.js');
const { encodeMonoWav } = require('./.build/lib/live-audio.js');
const { transcribeAudioFile } = require('./.build/lib/whisper.js');

(async () => {
  const originalFetch = global.fetch;
  const originalTimeout = AbortSignal.timeout;
  const originalGroq = process.env.GROQ_API_KEY;
  const originalOpenAI = process.env.OPENAI_API_KEY;
  let checks = 0;
  let calls = 0;
  let accelerate = false;
  const timeouts = [];
  const keepAlive = setInterval(() => {}, 1000); // AbortSignal timers alone are unref'ed in Node.
  const equal = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
  const source = (amplitude = 0.1) => new Blob([encodeMonoWav(new Float32Array(80000).fill(amplitude), 16000)], { type: 'audio/wav' });
  const send = (audio = source(), signal) => {
    const form = new FormData();
    form.append('audio', audio, 'meeting.wav');
    return handleLiveRequest(new Request('https://example.test/api/live', {
      method: 'POST', headers: { Origin: 'https://example.test' }, body: form, signal,
    }));
  };
  const providerTranscript = { text: 'Hello my friend.', duration: 7, segments: [
    { start: 0, end: 7, text: 'Hello my friend.', no_speech_prob: 0.01, avg_logprob: -0.1 },
  ] };
  const normalProvider = async (url, options) => {
    calls++;
    equal(url, 'https://api.groq.com/openai/v1/audio/translations');
    equal(options.headers.Authorization, 'Bearer test-live-groq-key');
    equal(options.body.get('model'), 'whisper-large-v3');
    return Response.json(providerTranscript);
  };
  try {
    const extensionOrigin = 'moz-extension://b2b893cd-8a8a-45e3-963d-8c4fbf51a102';
    equal(isAllowedLiveOrigin(extensionOrigin, 'https://example.test/api/live'), true);
    equal(isAllowedLiveOrigin(null, 'https://example.test/api/live'), true);
    for (const origin of ['null', 'https://meet.google.com', 'https://evil.test', `${extensionOrigin}.evil.test`, `${extensionOrigin}/path`, 'moz-extension://fake', 'moz-extension://user@b2b893cd-8a8a-45e3-963d-8c4fbf51a102', 'chrome-extension://abcdefghijklmnopabcdefghijklmnop']) {
      equal(isAllowedLiveOrigin(origin, 'https://example.test/api/live'), false);
      const form = new FormData(); form.append('audio', source(), 'meeting.wav');
      const forbidden = await handleLiveRequest(new Request('https://example.test/api/live', { method: 'POST', headers: { Origin: origin }, body: form }));
      equal(forbidden.status, 403);
    }
    equal(calls, 0);
    const form = new FormData(); form.append('audio', source(0), 'meeting.wav');
    const fromExtension = await handleLiveRequest(new Request('https://example.test/api/live', { method: 'POST', headers: { Origin: extensionOrigin }, body: form }));
    equal(fromExtension.status, 200);
    equal(await fromExtension.json(), { speech: false });
    equal(fromExtension.headers.get('access-control-allow-origin'), null);
    process.env.GROQ_API_KEY = 'test-live-groq-key';
    delete process.env.OPENAI_API_KEY;
    AbortSignal.timeout = (duration) => {
      timeouts.push(duration);
      return originalTimeout(accelerate && duration === LIVE_TRANSCRIPTION_TIMEOUT_MS ? 15 : duration);
    };
    global.fetch = normalProvider;
    let response = await send();
    let data = await response.json();
    equal(response.status, 200);
    equal(data.speech, true);
    equal(data.text, providerTranscript.text);
    equal(data.provider, 'groq-whisper');
    equal(data.plan.lang, 'ASL');
    equal(data.segments[0].end, 5);
    equal(data.plan.items.length > 0, true);
    equal(calls, 1); // No secondary LLM/chat request can stall a live chunk.
    equal(timeouts.at(-1), 20000);

    // Very quiet PCM that is still nonzero must reach ASR, not disappear.
    response = await send(source(0.0001));
    equal((await response.json()).speech, true);
    equal(calls, 2);
    response = await send(source(0));
    equal(await response.json(), { speech: false });
    equal(calls, 2);

    delete process.env.GROQ_API_KEY;
    response = await send();
    data = await response.json();
    equal(response.status, 503);
    equal(data.code, 'LIVE_NOT_CONFIGURED');
    equal(calls, 2);
    process.env.GROQ_API_KEY = 'test-live-groq-key';
    response = await handleLiveRequest(new Request('https://example.test/api/live', { method: 'POST', body: '{}' }));
    data = await response.json();
    equal(response.status, 400);
    equal(data.stage, 'validation');

    global.fetch = async () => Response.json({ text: '', segments: [] });
    response = await send();
    equal(response.status, 200);
    equal(await response.json(), { speech: false });
    global.fetch = async () => new Response('private provider diagnostics', { status: 401 });
    response = await send();
    data = await response.json();
    equal(response.status, 502);
    equal(data.stage, 'transcription');
    equal(data.error.includes('private provider'), false);
    equal(data.error.includes('test-live-groq-key'), false);

    // Cancellation must be forwarded upstream, with no retry of the same audio.
    const cancel = new AbortController();
    let started;
    const providerStarted = new Promise((resolve) => { started = resolve; });
    let upstreamCancelled = false;
    calls = 0;
    global.fetch = async (_url, options) => {
      calls++;
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => { upstreamCancelled = true; reject(options.signal.reason); }, { once: true });
        started();
      });
    };
    const abandoned = send(source(), cancel.signal);
    await providerStarted;
    cancel.abort();
    response = await abandoned;
    data = await response.json();
    equal(response.status, 499);
    equal(data.code, 'TRANSCRIPTION_CANCELLED');
    equal(data.stage, 'transcription');
    equal(upstreamCancelled, true);
    equal(calls, 1);
    response = await send(source(), AbortSignal.abort());
    equal(response.status, 499);
    equal(calls, 1);

    accelerate = true;
    global.fetch = async (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
    });
    response = await send();
    data = await response.json();
    equal(response.status, 504);
    equal(data.code, 'LIVE_TIMEOUT');
    equal(data.stage, 'transcription');
    equal(data.error.includes('20 seconds'), true);

    // Headers arriving on time must not bypass the deadline for the JSON body.
    global.fetch = async (_url, options) => new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"text":'));
        options.signal.addEventListener('abort', () => controller.error(options.signal.reason), { once: true });
      },
    }), { headers: { 'Content-Type': 'application/json' } });
    response = await send();
    data = await response.json();
    equal(response.status, 504);
    equal(data.code, 'LIVE_TIMEOUT');
    equal(data.stage, 'transcription');

    // Ordinary upload transcription retains its existing model and deadline.
    accelerate = false;
    global.fetch = normalProvider;
    await transcribeAudioFile(source(), 'upload.wav', 'test-live-groq-key');
    equal(timeouts.at(-1), process.env.VERCEL ? 40000 : 120000);
  } finally {
    global.fetch = originalFetch;
    AbortSignal.timeout = originalTimeout;
    if (originalGroq === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = originalGroq;
    if (originalOpenAI === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalOpenAI;
    clearInterval(keepAlive);
  }
  console.log(`Live server contracts, cancellation and provider/body deadlines: ${checks} passed`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
