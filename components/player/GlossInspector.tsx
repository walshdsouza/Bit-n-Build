"use client";
import { useState, useRef } from "react";

const glossRows = [
  { time: "0:00", end: "0:04", source: "The woman thinks about food.", gloss: "WOMAN THINK FOOD", emotion: "wh-question_browDown", status: "synced" },
  { time: "0:04", end: "0:08", source: "She wants pizza but is on a diet.", gloss: "IX WANT PIZZA BUT IX DIET", emotion: "negative_headshake", status: "synced" },
  { time: "0:08", end: "0:13", source: "She calls her friend for advice.", gloss: "IX CALL FRIEND ADVICE ASK", emotion: "topic_eyebrow", status: "active" },
  { time: "0:13", end: "0:18", source: "They plan to go to a salad bar.", gloss: "PLAN GO SALAD-BAR", emotion: "neutral", status: "buffered" },
  { time: "0:18", end: "0:23", source: "But the friend suggests tacos instead.", gloss: "FRIEND SUGGEST TACO IX-ARC", emotion: "raised_brow", status: "queued" },
  { time: "0:23", end: "0:28", source: "They both laugh at the situation.", gloss: "TWO-OF-US LAUGH", emotion: "positive_headnod", status: "queued" },
];

const statusColors: Record<string, string> = {
  synced: "text-on-surface-variant bg-surface-container-low",
  active: "text-primary bg-primary/10 border border-primary/30",
  buffered: "text-tertiary bg-tertiary-container/20",
  queued: "text-outline bg-transparent",
};

export default function GlossInspector() {
  const [search, setSearch] = useState("");
  const filtered = glossRows.filter(
    (r) => r.gloss.toLowerCase().includes(search.toLowerCase()) || r.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest border-l border-outline-variant/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant/30 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Gloss Inspector</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary">Live Sync</span>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[16px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gloss or source…"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs border border-outline-variant/40 focus:border-primary/50 focus:outline-none placeholder:text-outline transition-all"
          />
        </div>
      </div>

      {/* Gloss rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((row, i) => (
          <div
            key={i}
            className={`px-4 py-3 border-b border-outline-variant/15 cursor-pointer hover:bg-surface-container-high/20 transition-colors ${
              row.status === "active" ? "bg-primary/5" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-outline w-10 shrink-0">{row.time}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${statusColors[row.status]}`}>
                {row.status}
              </span>
              <span className="text-[9px] text-outline font-mono truncate">{row.emotion.split("_")[0]}</span>
            </div>
            <p className={`text-xs font-mono font-bold mb-0.5 ${row.status === "active" ? "text-primary" : "text-on-surface"}`}>
              {row.gloss}
            </p>
            <p className="text-[11px] text-on-surface-variant italic leading-tight">{row.source}</p>
          </div>
        ))}
      </div>

      {/* SOV preview */}
      <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest/80 flex-shrink-0">
        <p className="text-[10px] text-on-surface-variant font-mono mb-1">NMM Tag Stream</p>
        <div className="flex flex-wrap gap-1">
          {["wh-question_browDown", "negative_headshake", "topic_eyebrow"].map((tag) => (
            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
