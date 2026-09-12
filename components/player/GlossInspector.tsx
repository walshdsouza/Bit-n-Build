"use client";
import { useState, useEffect, useRef } from "react";

interface Segment {
  start: number;
  end: number;
  text: string;
}

interface GlossInspectorProps {
  currentTime: number;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const FALLBACK_ROWS = [
  { start: 0, end: 4, text: "WOMAN THINK FOOD" },
  { start: 4, end: 8, text: "IX WANT PIZZA BUT IX DIET" },
  { start: 8, end: 13, text: "IX CALL FRIEND ADVICE ASK" },
  { start: 13, end: 18, text: "PLAN GO SALAD-BAR" },
  { start: 18, end: 23, text: "FRIEND SUGGEST TACO IX-ARC" },
  { start: 23, end: 28, text: "TWO-OF-US LAUGH" },
];

export default function GlossInspector({ currentTime }: GlossInspectorProps) {
  const [search, setSearch] = useState("");
  const [segments, setSegments] = useState<Segment[]>(FALLBACK_ROWS);
  const activeRef = useRef<HTMLDivElement>(null);

  // Load real segments from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem("processedTranscript");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.segments?.length) {
          setSegments(data.segments);
        }
      } catch {}
    }
  }, []);

  // Scroll active segment into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentTime]);

  const filtered = segments.filter((s) =>
    s.text.toLowerCase().includes(search.toLowerCase())
  );

  // NMM tags based on active segment index
  const activeIndex = segments.findIndex(
    (s) => currentTime >= s.start && currentTime <= s.end
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

      {/* Segment rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] opacity-40">subtitles_off</span>
            <p className="text-xs">No segments match</p>
          </div>
        ) : (
          filtered.map((seg, i) => {
            const isActive = currentTime >= seg.start && currentTime <= seg.end;
            return (
              <div
                key={i}
                ref={isActive ? activeRef : null}
                className={`px-4 py-3 border-b border-outline-variant/15 cursor-pointer transition-colors duration-200 ${
                  isActive
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-surface-container-high/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-outline w-10 shrink-0">{formatTime(seg.start)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive
                        ? "text-primary bg-primary/10 border border-primary/30"
                        : i < activeIndex
                        ? "text-on-surface-variant bg-surface-container-low"
                        : "text-outline bg-transparent"
                    }`}
                  >
                    {isActive ? "active" : i < activeIndex ? "synced" : "queued"}
                  </span>
                </div>
                <p
                  className={`text-xs font-mono font-bold mb-0.5 leading-tight ${
                    isActive ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {seg.text}
                </p>
                <p className="text-[11px] text-on-surface-variant italic leading-tight">
                  {formatTime(seg.start)} → {formatTime(seg.end)}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* NMM tag stream */}
      <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest/80 flex-shrink-0">
        <p className="text-[10px] text-on-surface-variant font-mono mb-1">NMM Tag Stream</p>
        <div className="flex flex-wrap gap-1">
          {["wh-question_browDown", "negative_headshake", "topic_eyebrow"].map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
