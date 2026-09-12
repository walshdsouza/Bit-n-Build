"use client";
import { motion, Variants } from "framer-motion";

const glossRows = [
  { gloss: "WELCOME MEETING", time: "0:00", emotion: "smile", status: "active" },
  { gloss: "STATUS WHAT", time: "0:04", emotion: "wh-question", status: "synced" },
  { gloss: "TODAY DEPLOY WILL", time: "0:07", emotion: "neutral", status: "synced" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

export default function ShowcaseTriad() {
  return (
    <section className="pb-space-xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-space-md"
      >
        {/* Panel 1 — Ingestion */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative rounded-xl bg-surface-container-low border border-outline-variant/40 overflow-hidden p-6 flex flex-col shadow-sm"
        >
          <div className="absolute inset-0 bg-blueprint pointer-events-none opacity-50" />
          <div className="flex items-center gap-space-sm mb-4 relative z-10">
            <span className="w-7 h-7 bg-secondary-container/20 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">cloud_upload</span>
            </span>
            <span className="font-extrabold text-label-tech text-on-surface-variant uppercase tracking-tight">01 — Ingest</span>
          </div>

          <div className="rounded-lg border-2 border-dashed border-outline-variant/50 hover:border-primary/30 transition-colors bg-surface-container-lowest/50 p-8 flex flex-col items-center justify-center gap-4 relative z-10 flex-1 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center shadow-[0_0_20px_rgba(76,215,246,0.1)]">
              <span className="material-symbols-outlined text-primary text-[32px]">video_file</span>
            </div>
            <div className="text-center">
              <p className="font-extrabold text-headline-sm tracking-tight text-on-surface mb-1 text-[16px]">Drop video or paste URL</p>
              <p className="text-on-surface-variant text-xs font-medium">YouTube, MP4, WebM, MOV · up to 2GB</p>
            </div>
            <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
              <input
                type="text"
                placeholder="youtube.com/watch?v=..."
                className="flex-1 bg-surface-container text-on-surface text-sm rounded-lg px-3 py-2 border border-outline-variant/40 focus:border-primary/40 focus:outline-none placeholder:text-outline/70"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant relative z-10 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Whisper V3 Large · 97.3% WER accuracy
          </div>
        </motion.div>

        {/* Panel 2 — Avatar (center highlight) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative rounded-xl bg-gradient-to-b from-surface-container-high to-surface-container-low overflow-hidden border border-primary/10 shadow-lg flex flex-col"
        >
          <div className="absolute inset-0 bg-blueprint-cyan pointer-events-none opacity-30" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />

          <div className="p-6 relative z-10 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-extrabold text-label-tech text-primary uppercase tracking-tight">02 — Avatar</span>
              <span className="ml-auto text-xs text-on-surface-variant font-mono bg-surface-container px-2 py-0.5 rounded-full font-bold">LIVE</span>
            </div>

            {/* Avatar display */}
            <div className="relative flex-1 flex items-center justify-center rounded-lg bg-[#0a1a1e] overflow-hidden border border-primary/5 min-h-[220px]">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-blueprint-cyan opacity-20" />
              {/* Simulated avatar glow - softened */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              {/* Avatar silhouette */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-primary/20 to-secondary-container/20 border-2 border-primary/20 shadow-[0_0_20px_rgba(76,215,246,0.2)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[40px] opacity-90">sign_language</span>
                </div>
                <div className="text-center">
                  <p className="text-primary font-mono text-xs font-bold tracking-tight">WELCOME MEETING</p>
                  <p className="text-on-surface-variant text-[10px] font-medium">SOV Gloss · smile</p>
                </div>
              </div>
              {/* Scan line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-[scanline_3s_linear_infinite]" />
            </div>

            {/* NMM tags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["wh-question_browDown", "headNod", "smile"].map((tag) => (
                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary/10 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Panel 3 — Live Gloss Inspector */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative rounded-xl bg-surface-container-low border border-outline-variant/40 overflow-hidden p-6 flex flex-col shadow-sm"
        >
          <div className="absolute inset-0 bg-blueprint pointer-events-none opacity-50" />
          <div className="flex items-center gap-space-sm mb-4 relative z-10">
            <span className="w-7 h-7 bg-tertiary-container/20 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-[18px]">format_list_bulleted</span>
            </span>
            <span className="font-extrabold text-label-tech text-on-surface-variant uppercase tracking-tight">03 — Gloss</span>
          </div>

          <div className="flex-1 flex flex-col gap-2 relative z-10">
            {glossRows.map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  row.status === "active"
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-surface-container/50 border border-transparent"
                }`}
              >
                <span className="font-mono text-[10px] text-outline/80 w-8 shrink-0">{row.time}</span>
                <span className={`font-mono font-bold text-xs flex-1 ${row.status === "active" ? "text-primary" : "text-on-surface"}`}>
                  {row.gloss}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                  row.status === "active" ? "bg-primary/10 text-primary" : "bg-outline/10 text-outline/80"
                }`}>
                  {row.emotion.split("_")[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-[10px] text-on-surface-variant font-mono bg-surface-container-lowest/60 rounded-lg px-3 py-2 relative z-10 border border-outline-variant/10">
            <span className="text-tertiary font-bold">SOV:</span> WELCOME MEETING{" "}
            <span className="text-outline/70">// STATUS WHAT, TODAY…</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
