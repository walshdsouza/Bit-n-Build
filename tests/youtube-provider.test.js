const assert = require('node:assert/strict');
const { readProviderYouTube, parseProviderTranscript } = require('./.build/lib/youtube-provider.js');

(async () => {
  const originalFetch = global.fetch;
  const originalTimeout = AbortSignal.timeout;
  const timeouts = [];
  let checks = 0;
  const equal = (a, b) => { assert.deepEqual(a, b); checks++; };
  const rejects = async (fn, code) => { await assert.rejects(fn, error => error.code === code); checks++; };
  const video = 'jNQXAC9IVRw';
  const content = [{ text: 'Hello &amp; welcome.', offset: 1250, duration: 1750 }];
  try {
    AbortSignal.timeout = (duration) => { timeouts.push(duration); return originalTimeout(duration); };
    equal(parseProviderTranscript({ content }), [{ text: 'Hello & welcome.', start: 1.25, end: 3 }]);
    await rejects(async () => parseProviderTranscript({ content: [] }), 'NO_SPEECH');
    await rejects(async () => parseProviderTranscript({ content: 'untimed words' }), 'YOUTUBE_RESPONSE_INVALID');
    await rejects(async () => parseProviderTranscript({ content: [{ text: 'bad timing', offset: -1, duration: 20 }] }), 'YOUTUBE_RESPONSE_INVALID');
    let calls = 0;
    global.fetch = async (url, options) => {
      calls++;
      const parsed = new URL(url);
      equal(parsed.origin, 'https://api.supadata.ai');
      equal(parsed.searchParams.get('mode'), 'auto');
      equal(parsed.searchParams.get('text'), 'false');
      equal(parsed.searchParams.get('url'), `https://www.youtube.com/watch?v=${video}`);
      equal(options.headers['x-api-key'], 'provider-test-key');
      equal(options.redirect, 'error');
      return Response.json({ content, lang: 'en' });
    };
    equal((await readProviderYouTube(video, 'provider-test-key')).segments.length, 1);
    equal(timeouts.at(-1), 130000);
    equal(calls, 1);
    global.fetch = async () => Response.json({ jobId: 'job_123' }, { status: 202 });
    const pending = await readProviderYouTube(video, 'provider-test-key');
    assert.ok(pending.jobToken && !pending.jobToken.includes('provider-test-key')); checks++;
    global.fetch = async (url) => {
      equal(url, 'https://api.supadata.ai/v1/transcript/job_123');
      return Response.json({ status: 'active' });
    };
    equal((await readProviderYouTube(video, 'provider-test-key', pending.jobToken)).jobToken, pending.jobToken);
    equal(timeouts.at(-1), 25000);
    global.fetch = async () => Response.json({ status: 'queued' });
    equal((await readProviderYouTube(video, 'provider-test-key', pending.jobToken)).jobToken, pending.jobToken);
    global.fetch = async () => Response.json({ status: 'completed', content, lang: 'en' });
    equal((await readProviderYouTube(video, 'provider-test-key', pending.jobToken)).segments.length, 1);
    global.fetch = async () => Response.json({ status: 'completed', result: { content, lang: 'en' } });
    equal((await readProviderYouTube(video, 'provider-test-key', pending.jobToken)).segments.length, 1);
    global.fetch = async () => Response.json({ status: 'completed', result: { content: 'untimed result', lang: 'en' } });
    await rejects(() => readProviderYouTube(video, 'provider-test-key', pending.jobToken), 'YOUTUBE_RESPONSE_INVALID');
    global.fetch = async () => Response.json({ content, lang: 'es' });
    equal((await readProviderYouTube(video, 'provider-test-key')).language, 'es');
    const hindiContent = [{ text: 'मुझे पानी चाहिए।', offset: 1250, duration: 1750 }];
    global.fetch = async () => Response.json({ status: 'completed', result: { content: hindiContent, lang: 'hi' } });
    const hindi = await readProviderYouTube(video, 'provider-test-key', pending.jobToken);
    equal(hindi.language, 'hi');
    equal(hindi.segments, [{ text: 'मुझे पानी चाहिए।', start: 1.25, end: 3 }]);
    global.fetch = async () => Response.json({ content, lang: 'en-US' });
    equal((await readProviderYouTube(video, 'provider-test-key')).language, 'en-US');
    global.fetch = async () => { throw new Error('A tampered token must never fetch'); };
    await rejects(() => readProviderYouTube(video, 'wrong-key', pending.jobToken), 'YOUTUBE_JOB_INVALID');
    await rejects(() => readProviderYouTube('N0A4UzekAaI', 'provider-test-key', pending.jobToken), 'YOUTUBE_JOB_INVALID');
    await rejects(() => readProviderYouTube(video, 'provider-test-key', 'invalid.token'), 'YOUTUBE_JOB_INVALID');
    await rejects(() => readProviderYouTube(video, ''), 'YOUTUBE_NOT_CONFIGURED');
    for (const [status, code] of [[401, 'YOUTUBE_KEY_REJECTED'], [402, 'YOUTUBE_PLAN_REQUIRED'], [429, 'YOUTUBE_PROVIDER_LIMIT'], [403, 'YOUTUBE_VIDEO_UNAVAILABLE'], [404, 'YOUTUBE_VIDEO_UNAVAILABLE'], [502, 'YOUTUBE_PROVIDER_UNAVAILABLE']]) {
      global.fetch = async () => Response.json({ details: 'Private provider account diagnostics' }, { status });
      await rejects(() => readProviderYouTube(video, 'provider-test-key'), code);
    }
    global.fetch = async () => Response.json({ status: 'failed', error: { error: 'transcript-unavailable' } });
    await rejects(() => readProviderYouTube(video, 'provider-test-key', pending.jobToken), 'NO_SPEECH');
    global.fetch = async () => Response.json({ error: 'transcript-unavailable' }, { status: 206 });
    await rejects(() => readProviderYouTube(video, 'provider-test-key'), 'NO_SPEECH');
    for (const [providerCode, code] of [['unauthorized', 'YOUTUBE_KEY_REJECTED'], ['upgrade-required', 'YOUTUBE_PLAN_REQUIRED'], ['limit-exceeded', 'YOUTUBE_PROVIDER_LIMIT'], ['forbidden', 'YOUTUBE_VIDEO_UNAVAILABLE'], ['not-found', 'YOUTUBE_VIDEO_UNAVAILABLE']]) {
      global.fetch = async () => Response.json({ status: 'failed', error: { error: providerCode } });
      await rejects(() => readProviderYouTube(video, 'provider-test-key', pending.jobToken), code);
    }
    global.fetch = async () => { throw new Error('offline'); };
    await rejects(() => readProviderYouTube(video, 'provider-test-key'), 'YOUTUBE_PROVIDER_UNAVAILABLE');
  } finally { global.fetch = originalFetch; AbortSignal.timeout = originalTimeout; }
  console.log(`Hosted YouTube transcript contracts: ${checks} passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
