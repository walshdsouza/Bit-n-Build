"use client";

const glossRows = [
  { gloss: "WOMAN THINK", time: "0:00", emotion: "wh-question", status: "active" },
  { gloss: "IX WANT PIZZA", time: "0:04", emotion: "neutral", status: "synced" },
  { gloss: "BUT IX DIET", time: "0:07", emotion: "negative_headshake", status: "synced" },
  { gloss: "IX CALL FRIEND", time: "0:11", emotion: "topic_eyebrow", status: "buffered" },
];

export default function ShowcaseTriad() {
  return (
    <section className="pb-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Panel 1 — Ingestion */}
        <div className="relative rounded-xl bg-surface-container-low border border-outline-variant/40 overflow-hidden p-6 flex flex-col">
          <div className="absolute inset-0 bg-blueprint pointer-events-none" />
          <div className="flex items-center gap-space-sm mb-4 relative z-10">
            <span className="w-7 h-7 bg-secondary-container/20 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">cloud_upload</span>
            </span>
            <span className="font-label-tech text-label-tech text-on-surface-variant uppercase tracking-wider">01 — Ingest</span>
          </div>

          <div className="rounded-lg border-2 border-dashed border-outline-variant/60 hover:border-primary/40 transition-colors bg-surface-container-lowest/60 p-8 flex flex-col items-center justify-center gap-4 relative z-10 flex-1 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_30px_rgba(76,215,246,0.2)]">
              <span className="material-symbols-outlined text-primary text-[32px]">video_file</span>
            </div>
            <div className="text-center">
              <p className="font-headline-sm text-headline-sm text-on-surface mb-1 text-[16px]">Drop video or paste URL</p>
              <p className="text-on-surface-variant text-xs">YouTube, MP4, WebM, MOV · up to 2GB</p>
            </div>
            <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
              <input
                type="text"
                placeholder="youtube.com/watch?v=..."
                className="flex-1 bg-surface-container text-on-surface text-sm rounded-lg px-3 py-2 border border-outline-variant/50 focus:border-primary/50 focus:outline-none placeholder:text-outline"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant relative z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Whisper V3 Large · 97.3% WER accuracy
          </div>
        </div>

        {/* Panel 2 — Avatar (center highlight) */}
        <div className="relative rounded-xl bg-gradient-to-b from-surface-container-high to-surface-container-low overflow-hidden border border-primary/20 shadow-[0_0_40px_rgba(76,215,246,0.08)] flex flex-col">
          <div className="absolute inset-0 bg-blueprint-cyan pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

          <div className="p-6 relative z-10 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-label-tech text-label-tech text-primary uppercase tracking-wider">02 — Avatar</span>
              <span className="ml-auto text-xs text-on-surface-variant font-mono bg-surface-container px-2 py-0.5 rounded-full">LIVE</span>
            </div>

            {/* Avatar display */}
            <div className="relative flex-1 flex items-center justify-center rounded-lg bg-[#0a1a1e] overflow-hidden border border-primary/10 min-h-[220px]">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-blueprint-cyan opacity-40" />
              {/* Simulated avatar glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              {/* Avatar silhouette */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-primary/30 to-secondary-container/30 border-2 border-primary/40 shadow-[0_0_30px_rgba(76,215,246,0.4)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[40px]">sign_language</span>
                </div>
                <div className="text-center">
                  <p className="text-primary font-mono text-xs font-bold">WOMAN THINK</p>
                  <p className="text-on-surface-variant text-[10px]">SOV Gloss · wh-question</p>
                </div>
              </div>
              {/* Scan line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-[scanline_3s_linear_infinite]" />
            </div>

            {/* NMM tags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["wh-question_browDown", "topic_eyebrow", "puffedCheeks"].map((tag) => (
                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 3 — Live Gloss Inspector */}
        <div className="relative rounded-xl bg-surface-container-low border border-outline-variant/40 overflow-hidden p-6 flex flex-col">
          <div className="absolute inset-0 bg-blueprint pointer-events-none" />
          <div className="flex items-center gap-space-sm mb-4 relative z-10">
            <span className="w-7 h-7 bg-tertiary-container/20 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-[18px]">format_list_bulleted</span>
            </span>
            <span className="font-label-tech text-label-tech text-on-surface-variant uppercase tracking-wider">03 — Gloss</span>
          </div>

          <div className="flex-1 flex flex-col gap-2 relative z-10">
            {glossRows.map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  row.status === "active"
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-surface-container/60 border border-transparent"
                }`}
              >
                <span className="font-mono text-[10px] text-outline w-8 shrink-0">{row.time}</span>
                <span className={`font-mono font-bold text-xs flex-1 ${row.status === "active" ? "text-primary" : "text-on-surface"}`}>
                  {row.gloss}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                  row.status === "active" ? "bg-primary/20 text-primary" : "bg-outline/10 text-outline"
                }`}>
                  {row.emotion.split("_")[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-[10px] text-on-surface-variant font-mono bg-surface-container-lowest/80 rounded-lg px-3 py-2 relative z-10 border border-outline-variant/20">
            <span className="text-tertiary">SOV:</span> WOMAN THINK{" "}
            <span className="text-outline">// IX WANT PIZZA, BUT…</span>
          </div>
        </div>
      </div>
    </section>
  );
}
