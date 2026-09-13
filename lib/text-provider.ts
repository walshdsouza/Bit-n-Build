import { RequestError } from './request-validation';

// Verified against Groq's models API and structured-output support. Qwen is a
// preview fallback: removal/unavailability advances to the normal retry result.
export const GROQ_TEXT_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'] as const;

export function providerRetryAfterMs(response: Response, now = Date.now()): number {
  const value = response.headers.get('retry-after')?.trim();
  const seconds = value ? Number(value) : NaN;
  const parsed = Number.isFinite(seconds) ? seconds * 1000 : value ? Date.parse(value) - now : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? Math.max(1000, parsed) : 5000;
}

interface TextProviderOptions {
  groqKey?: string | null;
  openaiKey?: string | null;
  signal: AbortSignal;
}

/** One pool per operation, shared by caption workers. A limited model stays out
 * of later batches until Retry-After, and each request tries each model once.
 * Waiting belongs to the resumable job/client, never an unbounded model loop. */
export function createTextProvider(options: TextProviderOptions) {
  const useGroq = !!options.groqKey?.trim();
  const key = (useGroq ? options.groqKey : options.openaiKey)?.trim();
  const models: readonly string[] = useGroq ? GROQ_TEXT_MODELS : ['gpt-4o'];
  const endpoint = useGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
  const cooldown = new Map<string, { until: number; rateLimited: boolean }>();

  return async (body: Record<string, unknown>): Promise<Response> => {
    for (const model of models) {
      options.signal.throwIfAborted();
      if ((cooldown.get(model)?.until ?? 0) > Date.now()) continue;
      const response = await fetch(endpoint, {
        method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        signal: options.signal,
        body: JSON.stringify({ ...body, model,
          ...(useGroq ? { reasoning_effort: model.startsWith('qwen/') ? 'none' : 'low' } : {}),
        }),
      });
      options.signal.throwIfAborted();
      if (response.status === 429 || response.status >= 500 || response.status === 404 || response.status === 403) {
        // Auth failures (401) and malformed requests (400) are not model quota
        // failures. Return those to the caller without repeating its request.
        cooldown.set(model, {
          until: Date.now() + (response.status === 403 || response.status === 404 ? 300_000 : providerRetryAfterMs(response)),
          rateLimited: response.status === 429,
        });
        await response.body?.cancel();
        continue;
      }
      return response;
    }
    const blocked = [...cooldown.values()];
    const rateLimited = blocked.some(item => item.rateLimited);
    throw Object.assign(new RequestError(rateLimited
      ? 'Speech translation has reached its request limit. Please retry shortly.'
      : 'Speech translation is unavailable. Please retry or contact the site owner.',
    rateLimited ? 429 : 502, 'TRANSLATION_UNAVAILABLE'), {
      retryAfterMs: Math.max(1000, Math.min(...blocked.map(item => item.until)) - Date.now()),
    });
  };
}
