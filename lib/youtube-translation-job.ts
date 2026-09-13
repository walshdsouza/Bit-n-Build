import { createHmac, timingSafeEqual } from 'node:crypto';
import { deflateSync, inflateSync } from 'node:zlib';
import { isRecord, RequestError } from './request-validation';
import { needsEnglishTranslation, translateTranscriptToEnglish } from './transcript-translation';
import type { TranscriptSegment } from './types';

const PREFIX = 'translation-v1.';
interface TranslationJob {
  videoId: string;
  expires: number;
  language?: string;
  segments: TranscriptSegment[];
  translated: Record<string, string>;
  retryAt?: number;
}
interface JobOptions {
  videoId: string;
  signingKey: string;
  groqKey?: string | null;
  openaiKey?: string | null;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export function isTranslationJob(token?: string): boolean { return !!token?.startsWith(PREFIX); }

function seal(job: TranslationJob, key: string): string {
  const payload = deflateSync(Buffer.from(JSON.stringify(job))).toString('base64url');
  return `${PREFIX}${payload}.${createHmac('sha256', key).update(payload).digest('base64url')}`;
}

function open(token: string, options: JobOptions): TranslationJob {
  try {
    if (!isTranslationJob(token) || token.length > 1_000_000) throw new Error();
    const [payload, signature, extra] = token.slice(PREFIX.length).split('.');
    if (!payload || !signature || extra) throw new Error();
    const actual = Buffer.from(signature, 'base64url');
    const expected = createHmac('sha256', options.signingKey).update(payload).digest();
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error();
    const job: unknown = JSON.parse(inflateSync(Buffer.from(payload, 'base64url'), { maxOutputLength: 4_000_000 }).toString('utf8'));
    if (!isRecord(job) || job.videoId !== options.videoId || typeof job.expires !== 'number' || job.expires <= Date.now() || !Array.isArray(job.segments) || !isRecord(job.translated)) throw new Error();
    return job as unknown as TranslationJob;
  } catch {
    throw new RequestError('This video translation session expired. Start the import again.', 400, 'YOUTUBE_JOB_INVALID');
  }
}

/** Keep progress in a signed continuation rather than server memory. Vercel
 * may execute each poll on a different instance. The token contains captions,
 * never provider keys, and cannot be reused for another video. */
export async function translateYouTubeTranscript(
  input: { segments: TranscriptSegment[]; language?: string } | string,
  options: JobOptions,
): Promise<{ segments?: TranscriptSegment[]; jobToken?: string; pollAfterMs?: number }> {
  if (typeof input !== 'string' && !needsEnglishTranslation(input.segments, input.language)) return { segments: input.segments };
  if (!options.signingKey.trim()) throw new RequestError('Video translation is not configured on this server. Please contact the site owner.', 503, 'TRANSLATION_NOT_CONFIGURED');
  const job: TranslationJob = typeof input === 'string' ? open(input, options) : {
    videoId: options.videoId, expires: Date.now() + 60 * 60 * 1000,
    language: input.language, segments: input.segments, translated: {},
  };
  if (job.retryAt && job.retryAt > Date.now()) return { jobToken: seal(job, options.signingKey), pollAfterMs: job.retryAt - Date.now() };
  delete job.retryAt;
  const remaining = job.segments.map((segment, index) => ({ segment, index })).filter(item => job.translated[String(item.index)] === undefined);
  try {
    const translated = await translateTranscriptToEnglish(remaining.map(item => item.segment), {
      sourceLanguage: job.language, groqKey: options.groqKey, openaiKey: options.openaiKey,
      signal: options.signal, timeoutMs: Math.min(45_000, options.timeoutMs ?? 45_000),
      onProgress: (index, text) => { job.translated[String(remaining[index].index)] = text; },
    });
    translated.forEach((segment, index) => { job.translated[String(remaining[index].index)] = segment.text; });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    if (!(error instanceof RequestError) || error.code !== 'TRANSLATION_UNAVAILABLE' || ![429, 504].includes(error.status)) throw error;
    const retryAfterMs = 'retryAfterMs' in error && typeof error.retryAfterMs === 'number' && Number.isFinite(error.retryAfterMs) ? error.retryAfterMs : 5000;
    const pollAfterMs = error.status === 429 ? Math.min(10 * 60 * 1000, retryAfterMs) : 1000;
    job.retryAt = Date.now() + pollAfterMs;
    return { jobToken: seal(job, options.signingKey), pollAfterMs };
  }
  if (job.segments.some((_, index) => job.translated[String(index)] === undefined)) {
    throw new RequestError('Speech translation returned incomplete captions. Retry this video.', 502, 'TRANSLATION_RESPONSE_INVALID');
  }
  return { segments: job.segments.map((segment, index) => ({ ...segment, text: job.translated[String(index)] })) };
}
