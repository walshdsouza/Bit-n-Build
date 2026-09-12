const metrics = [
  { value: "< 85ms", label: "End-to-End Latency", icon: "speed" },
  { value: "97.3%", label: "Whisper WER Accuracy", icon: "verified" },
  { value: "8,400+", label: "ASL Gloss Lemmas", icon: "sign_language" },
  { value: "10k+", label: "Deaf/HoH Users", icon: "group" },
];

export default function TrustMetrics() {
  return (
    <section className="pb-space-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex flex-col items-center text-center gap-space-sm rounded-xl p-6 bg-surface-container-low/60 border border-outline-variant/30 hover:border-primary/25 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[28px]">{m.icon}</span>
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight">{m.value}</span>
            <span className="text-on-surface-variant text-xs font-medium">{m.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
