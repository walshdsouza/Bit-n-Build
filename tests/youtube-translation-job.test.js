const assert = require('node:assert/strict');
const { translateYouTubeTranscript, isTranslationJob } = require('./.build/lib/youtube-translation-job.js');

(async () => {
  const originalFetch = global.fetch;
  const originalNow = Date.now;
  let checks = 0;
  const equal = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
  const rejects = async (promise, code) => { await assert.rejects(promise, error => error.code === code); checks++; };
  const source = Array.from({ length: 40 }, (_, i) => ({ start: i * 2, end: i * 2 + 1, text: `नमस्ते ${i}` }));
  const options = { videoId: 'OIipC9LicMU', signingKey: 'test-server-signing-key', groqKey: 'test-groq-key' };
  const reply = captions => Response.json({ choices: [{ message: { content: JSON.stringify({ translations: Object.fromEntries(captions.map(caption => [caption.id, `Hello ${caption.text.split(' ').at(-1)}.`])) }) } }] });
  try {
    const english = [{ start: 0, end: 2, text: 'Hello.' }];
    global.fetch = async () => { throw new Error('English captions must not request translation'); };
    equal(await translateYouTubeTranscript({ segments: english, language: 'en' }, options), { segments: english });
    await rejects(translateYouTubeTranscript({ segments: source, language: 'hi' }, { ...options, signingKey: '' }), 'TRANSLATION_NOT_CONFIGURED');

    global.fetch = async (_url, request) => {
      const captions = JSON.parse(JSON.parse(request.body).messages[1].content).captions;
      if (captions[0].id === 0) return reply(captions);
      await new Promise(resolve => setTimeout(resolve, 5));
      return new Response('Quota details must remain private', { status: 429 });
    };
    const pending = await translateYouTubeTranscript({ segments: source, language: 'hi' }, options);
    equal(isTranslationJob(pending.jobToken), true);
    equal(pending.jobToken.includes(options.signingKey), false);
    equal(pending.jobToken.includes(options.groqKey), false);
    equal(pending.pollAfterMs, 5000);
    equal(pending.segments, undefined);

    global.fetch = async () => { throw new Error('Polling before the provider reset must not send requests'); };
    equal((await translateYouTubeTranscript(pending.jobToken, options)).jobToken, pending.jobToken);
    Date.now = () => originalNow() + 6000;

    let calls = 0;
    global.fetch = async (_url, request) => {
      calls++;
      const captions = JSON.parse(JSON.parse(request.body).messages[1].content).captions;
      // The first request already completed 32 captions; resume must not bill
      // them again, even though this call has no in-memory state from that run.
      equal(captions.length, 8);
      equal(captions[0].text, source[32].text);
      return reply(captions);
    };
    const result = await translateYouTubeTranscript(pending.jobToken, options);
    equal(calls, 1);
    equal(result.jobToken, undefined);
    equal(result.segments.length, 40);
    equal(result.segments.map(segment => [segment.start, segment.end]), source.map(segment => [segment.start, segment.end]));
    equal(result.segments[0].text, 'Hello 0.');
    equal(result.segments[39].text, 'Hello 39.');
    global.fetch = async () => { throw new Error('Invalid tokens must never reach a provider'); };
    await rejects(translateYouTubeTranscript(pending.jobToken, { ...options, videoId: 'jNQXAC9IVRw' }), 'YOUTUBE_JOB_INVALID');
    await rejects(translateYouTubeTranscript(pending.jobToken, { ...options, signingKey: 'wrong-key' }), 'YOUTUBE_JOB_INVALID');
    await rejects(translateYouTubeTranscript(pending.jobToken + 'tampered', options), 'YOUTUBE_JOB_INVALID');
    Date.now = () => originalNow() + 61 * 60 * 1000;
    await rejects(translateYouTubeTranscript(pending.jobToken, options), 'YOUTUBE_JOB_INVALID');
    Date.now = originalNow;

    const cancelled = new AbortController(); cancelled.abort();
    global.fetch = async (_url, request) => { if (request.signal.aborted) throw request.signal.reason; throw new Error('Expected cancellation'); };
    await rejects(translateYouTubeTranscript({ segments: source, language: 'hi' }, { ...options, signal: cancelled.signal }), 'TRANSLATION_UNAVAILABLE');
  } finally {
    global.fetch = originalFetch;
    Date.now = originalNow;
  }
  console.log(`YouTube translation continuation, rate limits and token integrity: ${checks} passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
