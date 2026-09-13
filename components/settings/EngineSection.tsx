"use client";

export default function EngineSection({ onConfigureKeys }: { onConfigureKeys: () => void }) {
  return (
    <section id="engine" className="space-y-6">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Neural Engine</h2>
        <p className="text-sm text-on-surface-variant">The app selects a provider from the available API keys. Groq takes priority when both providers are configured.</p>
      </div>
      <dl className="space-y-4 rounded-xl border border-outline-variant/40 bg-surface-container-low p-4">
        <div><dt className="text-xs text-on-surface-variant">Groq</dt><dd className="mt-1 text-sm text-on-surface">Whisper Large V3 transcription · Llama 3.1 8B Instant gloss translation</dd></div>
        <div><dt className="text-xs text-on-surface-variant">OpenAI</dt><dd className="mt-1 text-sm text-on-surface">Whisper-1 transcription · GPT-4o gloss translation</dd></div>
        <div><dt className="text-xs text-on-surface-variant">Without an API key</dt><dd className="mt-1 text-sm text-on-surface">Demo playback and rule-based text translation are available. Audio transcription requires a key.</dd></div>
        <div><dt className="text-xs text-on-surface-variant">Expressions</dt><dd className="mt-1 text-sm text-on-surface">Facial and head movement follow the generated signing plan.</dd></div>
      </dl>
      <p className="text-sm text-on-surface-variant">Model, temperature, and expression overrides are not available in this version.</p>
      <button onClick={onConfigureKeys} className="min-h-11 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-primary">Configure API Keys</button>
    </section>
  );
}
