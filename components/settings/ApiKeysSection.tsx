"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import {
  getApiKeysSnapshot,
  parseApiKeys,
  saveApiKeys,
  subscribeToApiKeys,
  type ClientApiKeys,
} from "@/lib/client-api-keys";

const keys = [
  { id: "groq", label: "Groq API Key", hint: "Preferred provider for transcription and gloss translation", placeholder: "gsk_…" },
  { id: "openai", label: "OpenAI API Key", hint: "Used when no Groq key is configured", placeholder: "sk-…" },
  { id: "supadata", label: "Supadata API Key", hint: "Optional provider for YouTube imports", placeholder: "Your Supadata key" },
] as const;

export default function ApiKeysSection() {
  const snapshot = useSyncExternalStore(subscribeToApiKeys, getApiKeysSnapshot, () => "");
  const saved = parseApiKeys(snapshot);
  const [draft, setDraft] = useState<ClientApiKeys | null>(null);
  const values = draft ?? saved;
  const [revealed, setRevealed] = useState<Partial<Record<keyof ClientApiKeys, boolean>>>({});
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      saveApiKeys(values);
      setDraft(null);
      setRevealed({});
      setFeedback({ text: values.groq.trim() || values.openai.trim() || values.supadata?.trim() ? "API keys saved in this browser." : "Saved API keys removed from this browser.", error: false });
    } catch (error) {
      const text = error instanceof Error && error.message.startsWith("API keys cannot")
        ? error.message
        : "Your browser could not save these keys. Allow local storage for this site, then try again.";
      setFeedback({ text, error: true });
    }
  }

  return (
    <section id="apikeys" className="space-y-6">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">API Keys</h2>
        <p className="text-sm text-on-surface-variant">
          Optional personal keys for transcription, translation and YouTube imports. The app uses a configured server key when a personal key is not supplied. The demo works without keys.
        </p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <div className="flex flex-col gap-4">
          {keys.map(({ id, label, hint, placeholder }) => (
            <div key={id} className="rounded-xl bg-surface-container-low border border-outline-variant/40 p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <label htmlFor={`api-key-${id}`} className="text-sm font-medium text-on-surface">{label}</label>
                  <p id={`api-key-${id}-hint`} className="text-xs text-on-surface-variant mt-0.5">{hint}</p>
                </div>
                {saved[id] && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Saved</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  id={`api-key-${id}`}
                  aria-describedby={`api-key-${id}-hint`}
                  type={revealed[id] ? "text" : "password"}
                  value={values[id] ?? ""}
                  onChange={(event) => {
                    setDraft({ ...values, [id]: event.target.value });
                    setFeedback(null);
                  }}
                  placeholder={placeholder}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="min-w-0 w-full px-3 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-outline transition-colors font-mono"
                />
                <button
                  type="button"
                  aria-label={`${revealed[id] ? "Hide" : "Show"} ${label}`}
                  aria-pressed={!!revealed[id]}
                  onClick={() => setRevealed({ ...revealed, [id]: !revealed[id] })}
                  className="w-11 h-11 shrink-0 flex items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-primary transition-colors"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    {revealed[id] ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {id === "supadata" && <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">A Supadata key can enable YouTube transcript retrieval when direct access is unavailable. <a href="https://dash.supadata.ai/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">Open Supadata dashboard<span className="sr-only"> (opens in a new tab)</span></a>.</p>}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary-container/10 border border-secondary/20">
          <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">info</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Keys are saved in this browser&apos;s local storage. When you transcribe or translate, they are sent through this app&apos;s server to the selected AI provider. Clear a field and save to remove that key. Database access is configured by the app&apos;s host.
          </p>
        </div>

        <button type="submit" className="min-h-11 px-5 py-2 rounded-full bg-gradient-to-r from-secondary-container to-primary-container text-on-primary text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary transition-shadow">
          Save API Keys
        </button>
        {feedback && (
          <p role={feedback.error ? "alert" : "status"} className={`text-sm ${feedback.error ? "text-error" : "text-primary"}`}>
            {feedback.text}
          </p>
        )}
      </form>
    </section>
  );
}
