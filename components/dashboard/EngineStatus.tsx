"use client";


interface EngineStatusProps {
  serverTranscriptionProvider?: "groq" | "openai" | null;
}

export default function EngineStatus({ serverTranscriptionProvider = null }: EngineStatusProps) {
  const provider = serverTranscriptionProvider;
  const engines = [
    {
      name: "Audio transcription",
      detail: provider ? "Converts speech into English captions" : "Currently unavailable",
      icon: "mic", color: "text-primary",
    },
    { name: "Gloss translation", detail: provider ? "AI-assisted ASL translation" : "Rule-based text translation", icon: "psychology", color: "text-tertiary" },
    { name: "SiGML export", detail: "Generated from the signing plan", icon: "account_tree", color: "text-secondary" },
    { name: "NEXA avatar", detail: "3D signing playback in your browser", icon: "view_in_ar", color: "text-primary" },
  ];
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 p-5">
      <p className="text-on-surface font-semibold mb-4">Translation Tools</p>
      <div className="flex flex-col gap-3">
        {engines.map(({ name, detail, icon, color }) => (
          <div key={name} className="flex items-start gap-3 rounded-lg px-3 py-2.5 bg-surface-container-low border border-outline-variant/25">
            <span aria-hidden="true" className={`material-symbols-outlined text-[18px] mt-0.5 ${color}`}>{icon}</span>
            <div className="min-w-0">
              <p className="text-sm text-on-surface">{name}</p>
              <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
