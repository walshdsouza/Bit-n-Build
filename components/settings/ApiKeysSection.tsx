"use client";
import { useState } from "react";

const keys = [
  { id: "openai", label: "OpenAI API Key", hint: "For Whisper STT + GPT-4o gloss", prefix: "sk-" },
  { id: "supabase_url", label: "Supabase URL", hint: "Project URL for SiGML cache", prefix: "https://" },
  { id: "supabase_anon", label: "Supabase Anon Key", hint: "Public anon key for client", prefix: "eyJ..." },
];

export default function ApiKeysSection() {
  const [values, setValues] = useState<Record<string, string>>({
    openai: "",
    supabase_url: "",
    supabase_anon: "",
  });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <section id="apikeys" className="space-y-6">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">API Keys</h2>
        <p className="text-sm text-on-surface-variant">
          Configure credentials for the AI pipeline. Keys are stored locally in{" "}
          <code className="text-xs text-primary font-mono bg-surface-container px-1.5 py-0.5 rounded">.env.local</code>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {keys.map(({ id, label, hint, prefix }) => (
          <div key={id} className="rounded-xl bg-surface-container-low border border-outline-variant/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-on-surface">{label}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{hint}</p>
              </div>
              {values[id] && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Set
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-outline font-mono">{prefix}</span>
                <input
                  type={revealed[id] ? "text" : "password"}
                  value={values[id]}
                  onChange={(e) => setValues({ ...values, [id]: e.target.value })}
                  placeholder="Paste your key here"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-outline transition-all font-mono"
                />
              </div>
              <button
                onClick={() => setRevealed({ ...revealed, [id]: !revealed[id] })}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {revealed[id] ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary-container/10 border border-secondary/20">
        <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">info</span>
        <p className="text-xs text-on-surface-variant">
          API keys are never sent to our servers. They are stored in your browser&apos;s local storage and
          passed directly from your machine to the respective AI providers.
        </p>
      </div>

      <button className="px-5 py-2 rounded-full bg-gradient-to-r from-secondary-container to-primary-container text-on-primary text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.01] transition-all">
        Save API Keys
      </button>
    </section>
  );
}
