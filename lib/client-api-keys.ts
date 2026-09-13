/** Browser-owned provider credentials, read only when making a pipeline request. */
export interface ClientApiKeys {
  groq: string;
  openai: string;
  supadata?: string;
}

const STORAGE_KEY = "gesturesync.apiKeys";
const CHANGE_EVENT = "gesturesync:api-keys-changed";

export function getApiKeysSnapshot(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseApiKeys(snapshot: string): ClientApiKeys {
  try {
    const stored: unknown = JSON.parse(snapshot);
    if (stored && typeof stored === "object") {
      const values = stored as Record<string, unknown>;
      return {
        groq: typeof values.groq === "string" ? values.groq.trim() : "",
        openai: typeof values.openai === "string" ? values.openai.trim() : "",
        supadata: typeof values.supadata === "string" ? values.supadata.trim() : "",
      };
    }
  } catch {
    // Missing or malformed storage must not prevent using the demo.
  }
  return { groq: "", openai: "", supadata: "" };
}

export function subscribeToApiKeys(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Storage errors are surfaced by the settings form instead of claiming success. */
export function saveApiKeys(keys: ClientApiKeys): void {
  const values = { groq: keys.groq.trim(), openai: keys.openai.trim(), supadata: keys.supadata?.trim() || "" };
  if (Object.values(values).some((value) => /\s/.test(value))) {
    throw new Error("API keys cannot contain spaces or line breaks. Paste only the key, then save again.");
  }
  if (values.groq || values.openai || values.supadata) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Attach only to the app's own API requests, never external resource requests. */
export function getApiKeyHeaders(): Record<string, string> {
  const values = parseApiKeys(getApiKeysSnapshot());
  const headers: Record<string, string> = {};
  if (values.groq && !/\s/.test(values.groq)) headers["x-groq-api-key"] = values.groq;
  if (values.openai && !/\s/.test(values.openai)) headers["x-openai-api-key"] = values.openai;
  if (values.supadata && !/\s/.test(values.supadata)) headers["x-supadata-api-key"] = values.supadata;
  return headers;
}
