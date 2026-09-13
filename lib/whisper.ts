import type { TranscriptSegment } from './types';
import { normalizeSegments } from './segments';
import { isRecord, RequestError } from './request-validation';

export interface TranscriptionResult {
  text: string;
  segments: TranscriptSegment[];
  duration: number;
  provider: 'groq-whisper' | 'openai-whisper';
}

export interface TranscriptionOptions {
  /** Callers such as live captions can use a shorter deadline than uploads. */
  timeoutMs?: number;
  /** Cancel an abandoned live chunk at the upstream provider. */
  signal?: AbortSignal;
}

export function requireTranscriptionKey(groqKey?: string | null, openaiKey?: string | null): void {
  if (!groqKey?.trim() && !openaiKey?.trim()) {
    throw new RequestError('Audio transcription is not configured on this server. Please contact the site owner, or open the demo player.', 422);
  }
}

/**
 * Sends audio to Whisper's speech-to-English endpoint. ASL/ISL/BSL gloss
 * dictionaries consume English lemmas; ordinary transcription would return
 * Hindi/other source scripts that the local rule glosser cannot interpret.
 * Prioritizes Groq for speed if both keys are present.
 */
export async function transcribeAudioFile(audioBlob: Blob, filename: string, groqKey?: string | null, openaiKey?: string | null, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
  requireTranscriptionKey(groqKey, openaiKey);
  if (!audioBlob.size) throw new RequestError('The audio file is empty.');
  if (audioBlob.size > 25 * 1024 * 1024) {
    throw new RequestError('The extracted audio exceeds 25 MB. Upload a shorter recording.', 413);
  }
  const useGroq = !!groqKey?.trim();
  const endpoint = useGroq 
    ? 'https://api.groq.com/openai/v1/audio/translations'
    : 'https://api.openai.com/v1/audio/translations';
  
  const apiKey = useGroq ? groqKey : openaiKey;
  const model = useGroq ? 'whisper-large-v3' : 'whisper-1';
  const provider = useGroq ? 'groq-whisper' : 'openai-whisper';

  const formData = new FormData();
  formData.append('file', audioBlob, filename || 'audio.mp3');
  formData.append('model', model);
  formData.append('response_format', 'verbose_json');
  // verbose_json includes translated segment timestamps on both providers.

  // This helper also runs in the standalone extension, without Node globals.
  const defaultTimeout = typeof process !== 'undefined' && process.env.VERCEL ? 40_000 : 120_000;
  const deadline = AbortSignal.timeout(options.timeoutMs ?? defaultTimeout);
  const signal = options.signal ? AbortSignal.any([options.signal, deadline]) : deadline;
  const throwIfCancelled = () => {
    if (!signal.aborted) return;
    if (options.signal?.aborted && signal.reason === options.signal.reason) {
      throw new RequestError('Transcription was cancelled.', 499, 'TRANSCRIPTION_CANCELLED');
    }
    if (options.timeoutMs !== undefined && deadline.aborted) {
      throw new RequestError('The transcription provider took too long to respond. Please retry.', 504, 'TRANSCRIPTION_TIMEOUT');
    }
  };
  throwIfCancelled();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey?.trim()}` },
      body: formData,
      signal,
    });
  } catch {
    throwIfCancelled();
    throw new RequestError('The transcription provider could not be reached. Please retry.', 502);
  }

  if (!response.ok) {
    const message = response.status === 401 || response.status === 403
      ? 'The transcription service is unavailable. Please contact the site owner.'
      : response.status === 429
        ? 'The transcription provider is rate limited or out of credits. Check your account and retry.'
        : `The transcription provider could not process this audio (HTTP ${response.status}).`;
    throw new RequestError(message, response.status === 429 ? 429 : 502);
  }

  const data: unknown = await response.json().catch(() => null);
  // The deadline/cancellation also covers a stalled JSON response body.
  throwIfCancelled();
  if (!isRecord(data)) throw new RequestError('The transcription provider returned an invalid response.', 502);
  const text = typeof data.text === 'string' ? data.text.trim() : '';
  const providedDuration = typeof data.duration === 'number' && Number.isFinite(data.duration) && data.duration >= 0
    ? data.duration : 0;
  const rawSegments = Array.isArray(data.segments) ? data.segments : [];
  // Use the provider's confidence metadata before creating signs. This app
  // requires reliable speech: very high silence probability or low decoding
  // confidence must not turn background noise into an invented transcript.
  // Never reject quiet speech using audio volume alone.
  const speechSegments = rawSegments.filter((segment: unknown) => !(
    isRecord(segment) && (
      (typeof segment.no_speech_prob === 'number' && segment.no_speech_prob > 0.8) ||
      (typeof segment.avg_logprob === 'number' && segment.avg_logprob < -1)
    )
  ));
  // A mostly non-speech recording can end with a weak hallucinated fragment
  // that passes a per-segment filter. Require one confidently voiced segment
  // in that case; a genuine short utterance in a long quiet clip still passes.
  const evidence = rawSegments.filter((segment: unknown): segment is Record<string, unknown> =>
    isRecord(segment) && typeof segment.start === 'number' && typeof segment.end === 'number' &&
    Number.isFinite(segment.start) && Number.isFinite(segment.end) && segment.end > segment.start &&
    typeof segment.no_speech_prob === 'number' && Number.isFinite(segment.no_speech_prob)
  );
  const coveredSeconds = (items: Record<string, unknown>[]) => {
    let total = 0;
    let previousEnd = 0;
    for (const segment of [...items].sort((a, b) => Number(a.start) - Number(b.start))) {
      const start = Math.max(previousEnd, 0, Number(segment.start));
      const end = Math.min(providedDuration, Number(segment.end));
      total += Math.max(0, end - start);
      previousEnd = Math.max(previousEnd, end);
    }
    return total;
  };
  const predominantlyNonSpeech = providedDuration >= 30 &&
    coveredSeconds(evidence) >= providedDuration * 0.8 &&
    coveredSeconds(evidence.filter((segment) => Number(segment.no_speech_prob) > 0.8)) >= providedDuration * 0.8;
  const hasConfidentSpeech = speechSegments.some((segment: unknown) =>
    isRecord(segment) && (typeof segment.no_speech_prob !== 'number' || !Number.isFinite(segment.no_speech_prob) || segment.no_speech_prob <= 0.35)
  );
  if (predominantlyNonSpeech && !hasConfidentSpeech) {
    throw new RequestError('No reliable speech was detected in this recording. It contains mostly silence or background sounds. This app translates speech or captions into signs; it cannot recognize hand movements in videos.', 422, 'NO_SPEECH');
  }
  const removedSilence = speechSegments.length !== rawSegments.length;
  let segments = normalizeSegments(speechSegments);
  // Preserve the actual transcript when a provider omits segment timestamps.
  if (!segments.length && text && !removedSilence) {
    segments = [{ start: 0, end: providedDuration || Math.max(2, text.split(/\s+/).length / 2.5), text }];
  }
  if (!segments.length) throw new RequestError('No clear speech was detected. This app translates spoken audio or captions into signs; it cannot recognize hand movements in a video. Use a source with clear speech or captions.', 422, 'NO_SPEECH');
  return {
    text: removedSilence ? segments.map((s) => s.text).join(' ') : text || segments.map((s) => s.text).join(' '),
    segments,
    duration: segments.reduce((duration, segment) => Math.max(duration, segment.end), providedDuration),
    provider
  };
}

export interface KeyValidationResult {
  valid: boolean;
  provider: 'groq' | 'openai';
  error?: string;
}

/**
 * Confirms a key actually authenticates, without spending transcription
 * credits or requiring an audio file. Hits each provider's models-list
 * endpoint, which is free and only checks auth — a 200 means the key is
 * real, a 401/403 means it isn't. A truthy, non-empty string is not the same
 * thing as a working key (revoked, mistyped, or wrong-provider keys all
 * still pass a presence check), so this is the check that actually matters
 * before telling a user transcription is ready to go.
 */
export async function validateApiKey(
  provider: 'groq' | 'openai',
  key: string
): Promise<KeyValidationResult> {
  const endpoint =
    provider === 'groq'
      ? 'https://api.groq.com/openai/v1/models'
      : 'https://api.openai.com/v1/models';

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (response.ok) return { valid: true, provider };
    if (response.status === 401 || response.status === 403) {
      return { valid: false, provider, error: 'Key was rejected by the provider.' };
    }
    return { valid: false, provider, error: `Unexpected response: ${response.status}` };
  } catch (err) {
    return { valid: false, provider, error: `Could not reach ${provider}: ${String(err)}` };
  }
}
