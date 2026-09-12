const engines = [
  { name: "Whisper STT", status: "online", latency: "38ms", icon: "mic", color: "text-primary" },
  { name: "GPT-4o Gloss", status: "online", latency: "61ms", icon: "psychology", color: "text-tertiary" },
  { name: "SiGML Bridge", status: "online", latency: "8ms", icon: "account_tree", color: "text-secondary" },
  { name: "CWASA Avatar", status: "online", latency: "60fps", icon: "view_in_ar", color: "text-primary" },
];

export default function EngineStatus() {
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-on-surface font-semibold">Engine Status</p>
        <span className="flex items-center gap-1.5 text-xs text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          All Online
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {engines.map(({ name, latency, icon, color }) => (
          <div key={name} className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-surface-container-low border border-outline-variant/25">
            <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
            <span className="flex-1 text-sm text-on-surface">{name}</span>
            <span className="text-xs font-mono text-on-surface-variant">{latency}</span>
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(76,215,246,0.7)]" />
          </div>
        ))}
      </div>

      <div className="mt-4 px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-[11px] font-mono text-on-surface-variant flex items-center justify-between">
        <span>Total E2E Latency</span>
        <span className="text-primary font-bold">~167ms</span>
      </div>
    </div>
  );
}
