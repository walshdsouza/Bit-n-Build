import { createHmac, timingSafeEqual } from 'node:crypto';
import { isRecord, RequestError } from './request-validation';
import { decodeCaptionText } from './youtube-captions';
import type { TranscriptSegment } from './types';

const ENDPOINT = 'https://api.supadata.ai/v1/transcript';
const JOB_LIFETIME = 60 * 60 * 1000;

export interface YouTubeProviderResult {
  segments?: TranscriptSegment[];
  language?: string;
  jobToken?: string;
}

function signature(payload: string, key: string) {
  return createHmac('sha256', key).update(payload).digest();
}

function sealJob(jobId: string, videoId: string, key: string) {
  const payload = Buffer.from(JSON.stringify({ jobId, videoId, expires: Date.now() + JOB_LIFETIME })).toString('base64url');
  return `${payload}.${signature(payload, key).toString('base64url')}`;
}

function openJob(token: string, videoId: string, key: string) {
  try {
    if (token.length > 2048) throw new Error();
    const [payload, digest, extra] = token.split('.');
    if (!payload || !digest || extra) throw new Error();
    const actual = Buffer.from(digest, 'base64url');
    const expected = signature(payload, key);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error();
    const job: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!isRecord(job) || job.videoId !== videoId || typeof job.expires !== 'number' || job.expires <= Date.now() ||
      typeof job.jobId !== 'string' || !/^[a-zA-Z0-9_-]{1,200}$/.test(job.jobId)) throw new Error();
    return job.jobId;
  } catch {
    throw new RequestError('This YouTube import session expired or its key changed. Start the import again.', 400, 'YOUTUBE_JOB_INVALID');
  }
}

function providerError(status: number, data?: Record<string, unknown>): RequestError {
  const code = data?.error;
  if (status === 401 || code === 'unauthorized') return new RequestError('The YouTube import API key was rejected. Update the Supadata key in Settings.', 422, 'YOUTUBE_KEY_REJECTED');
  if (status === 402 || code === 'upgrade-required') return new RequestError('This YouTube import requires a feature unavailable on your Supadata plan. Check your plan or choose a video with existing captions.', 422, 'YOUTUBE_PLAN_REQUIRED');
  if (status === 429 || code === 'limit-exceeded') return new RequestError('The YouTube import service has reached its request or credit limit. Check your Supadata account and retry.', 429, 'YOUTUBE_PROVIDER_LIMIT');
  if (status === 403 || status === 404 || code === 'forbidden' || code === 'not-found' || code === 'video-unavailable') return new RequestError('This video is unavailable or requires sign-in. Choose a public video you can play.', 422, 'YOUTUBE_VIDEO_UNAVAILABLE');
  if (status === 206 || code === 'transcript-unavailable') return new RequestError('No usable transcript could be obtained for this video. Choose a source with spoken audio or captions.', 422, 'NO_SPEECH');
  return new RequestError('The YouTube import service could not process this video. Retry the import or capture its tab audio.', 502, 'YOUTUBE_PROVIDER_UNAVAILABLE');
}

/** Supadata timestamps are milliseconds. Reject missing timing rather than
 * inventing synchronization for a text-only response. */
export function parseProviderTranscript(data: Record<string, unknown>): TranscriptSegment[] {
  if (!Array.isArray(data.content)) throw new RequestError('The YouTube import service returned no timed transcript.', 502, 'YOUTUBE_RESPONSE_INVALID');
  const segments: TranscriptSegment[] = [];
  for (const item of data.content) {
    if (!isRecord(item) || typeof item.text !== 'string' || !item.text.trim()) continue;
    if (typeof item.offset !== 'number' || !Number.isFinite(item.offset) || item.offset < 0 ||
      typeof item.duration !== 'number' || !Number.isFinite(item.duration) || item.duration <= 0) {
      throw new RequestError('The YouTube import service returned invalid transcript timing.', 502, 'YOUTUBE_RESPONSE_INVALID');
    }
    segments.push({ text: decodeCaptionText(item.text), start: item.offset / 1000, end: (item.offset + item.duration) / 1000 });
  }
  if (!segments.length) throw new RequestError('No speech or captions were found for this video.', 422, 'NO_SPEECH');
  return segments.sort((a, b) => a.start - b.start);
}

/** Each call is bounded. Long ASR jobs return a signed continuation token;
 * subsequent requests poll that job without starting/billing another import. */
export async function readProviderYouTube(videoId: string, rawKey: string, jobToken?: string): Promise<YouTubeProviderResult> {
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) throw new RequestError('Provide a valid YouTube URL.');
  const key = rawKey.trim();
  if (!key || /\s/.test(key)) throw new RequestError('Configure the YouTube import key in Settings.', 422, 'YOUTUBE_NOT_CONFIGURED');
  const jobId = jobToken ? openJob(jobToken, videoId, key) : null;
  const endpoint = jobId ? `${ENDPOINT}/${encodeURIComponent(jobId)}` : `${ENDPOINT}?${new URLSearchParams({
    url: `https://www.youtube.com/watch?v=${videoId}`, lang: 'en', text: 'false', mode: 'auto',
  })}`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      // Generation can run synchronously for two minutes before returning
      // content or a job ID. Do not discard a billed initial request early.
      headers: { 'x-api-key': key }, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(jobId ? 25_000 : 130_000),
    });
  } catch {
    throw new RequestError('The YouTube import service could not be reached. Please retry.', 502, 'YOUTUBE_PROVIDER_UNAVAILABLE');
  }
  const raw: unknown = await response.json().catch(() => null);
  const data = isRecord(raw) ? raw : undefined;
  // Supadata uses HTTP206 for transcript-unavailable despite Response.ok.
  if (response.status === 206 || !response.ok) throw providerError(response.status, data);
  if (!data) throw new RequestError('The YouTube import service returned an invalid response.', 502, 'YOUTUBE_RESPONSE_INVALID');
  if (data.status === 'failed') throw providerError(502, isRecord(data.error) ? data.error : data);
  if (jobId && (data.status === 'queued' || data.status === 'active')) return { jobToken };
  if (!jobId && typeof data.jobId === 'string' && /^[a-zA-Z0-9_-]{1,200}$/.test(data.jobId)) {
    return { jobToken: sealJob(data.jobId, videoId, key) };
  }
  // The endpoint reference shows flat job content; the official SDK's
  // JobResult<Transcript> also supports a completed result envelope.
  const transcript = jobId && data.status === 'completed' && isRecord(data.result) ? data.result : data;
  const language = typeof transcript.lang === 'string' ? transcript.lang : undefined;
  // lang=en is a preference, not translation: Supadata can return the first
  // available language, and generated transcripts retain the spoken language.
  if (language && !/^en(?:[-_]|$)/i.test(language)) {
    throw new RequestError('This video has no English transcript available. Choose English captions or upload English audio for ASL translation.', 422, 'YOUTUBE_LANGUAGE_UNSUPPORTED');
  }
  return { segments: parseProviderTranscript(transcript), language };
}
