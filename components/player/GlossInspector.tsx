"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { GlossRow, SignPlan } from "@/lib/types";
import { describeHamNoSys } from "@/lib/hamnosys";

interface GlossInspectorProps {
  currentTime: number;
  rows?: GlossRow[];
  plan?: SignPlan | null;
  lang?: string;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function GlossInspector({ currentTime, rows, plan, lang = "ASL" }: GlossInspectorProps) {
  const [search, setSearch] = useState("");
  const [fallbackRows, setFallbackRows] = useState<GlossRow[]>([]);
  const activeRef = useRef<HTMLDivElement>(null);

  // Before a translation exists, show the raw transcript so the panel isn't
  // empty. sessionStorage is client-only, so this is deferred off the render
  // pass rather than read synchronously during the effect.
  useEffect(() => {
    if (rows?.length) return;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const raw = sessionStorage.getItem("processedTranscript");
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        if (!data.segments?.length) return;
        setFallbackRows(
          data.segments.map((s: { start: number; end: number; text: string }) => ({
            startTime: s.start,
            endTime: s.end,
            sourceText: s.text,
            gloss: "",
            nmm: [],
            status: "queued" as const,
          })),
        );
      } catch {
        /* transcript not yet available */
      }
    });

    return () => {
      cancelled = true;
    };
  }, [rows]);

  const data = rows?.length ? rows : fallbackRows;

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentTime]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return data;
    return data.filter(
      (r) => r.gloss.toLowerCase().includes(q) || r.sourceText.toLowerCase().includes(q),
    );
  }, [data, search]);

  const activeIndex = data.findIndex(
    (r) => currentTime >= r.startTime && currentTime <= r.endTime,
  );

  // The sign currently being articulated, straight off the motion plan.
  const activeSign = useMemo(() => {
    if (!plan?.items.length) return null;
    return plan.items.find((i) => currentTime >= i.startTime && currentTime < i.endTime) ?? null;
  }, [plan, currentTime]);

  const activeNmm = activeIndex >= 0 ? data[activeIndex]?.nmm ?? [] : [];

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest border-l border-outline-variant/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant/30 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
            Gloss Inspector
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary font-mono">{lang}</span>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[16px]">
            search
          </span>
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
          filtered.map((row, i) => {
            const isActive = currentTime >= row.startTime && currentTime <= row.endTime;
            return (
              <div
                key={`${row.startTime}-${i}`}
                ref={isActive ? activeRef : null}
                className={`px-4 py-3 border-b border-outline-variant/15 transition-colors duration-200 ${
                  isActive
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-surface-container-high/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-outline w-10 shrink-0">
                    {formatTime(row.startTime)}
                  </span>
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

                {/* Target-language gloss */}
                {row.gloss ? (
                  <p
                    className={`text-xs font-mono font-bold mb-1 leading-tight ${
                      isActive ? "text-primary" : "text-on-surface"
                    }`}
                  >
                    {row.gloss}
                  </p>
                ) : (
                  <p className="text-[11px] font-mono text-outline mb-1 italic">not yet glossed</p>
                )}

                {/* English source */}
                <p className="text-[11px] text-on-surface-variant italic leading-tight">
                  {row.sourceText}
                </p>

                {/* Per-row NMMs */}
                {row.nmm?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {row.nmm.map((n, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary/20"
                      >
                        {n.emotion}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Live notation readout for the sign being articulated right now */}
      <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest/80 flex-shrink-0 space-y-2">
        <div>
          <p className="text-[10px] text-on-surface-variant font-mono mb-1">Active sign</p>
          {activeSign ? (
            <>
              <p className="text-xs font-mono font-bold text-primary truncate">
                {activeSign.fingerspell
                  ? `${activeSign.fingerspell} (fingerspelled)`
                  : activeSign.gloss}
              </p>
              {activeSign.entry && (
                <p className="text-[10px] font-mono text-on-surface-variant mt-0.5 leading-snug break-words">
                  {describeHamNoSys(activeSign.entry)}
                </p>
              )}
            </>
          ) : (
            <p className="text-[11px] font-mono text-outline italic">—</p>
          )}
        </div>

        <div>
          <p className="text-[10px] text-on-surface-variant font-mono mb-1">NMM tag stream</p>
          <div className="flex flex-wrap gap-1">
            {(activeNmm.length ? activeNmm.map((n) => n.emotion) : ["neutral"]).map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
