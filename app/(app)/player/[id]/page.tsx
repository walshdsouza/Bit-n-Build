"use client";
import { useState } from "react";
import Link from "next/link";
import SplitViewport from "@/components/player/SplitViewport";
import Timeline from "@/components/player/Timeline";
import GlossInspector from "@/components/player/GlossInspector";

export default function PlayerPage({ params }: { params: { id: string } }) {
  const [playing, setPlaying] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#060a0f]">
      {/* Player nav */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-outline-variant/30 bg-surface-container-lowest flex-shrink-0">
        <Link href="/dashboard" className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface truncate">
            {params.id === "demo" ? "Demo Translation — TED Talk on Accessibility" : `Translation #${params.id}`}
          </p>
          <p className="text-xs text-on-surface-variant">0:28 · English → ASL · 6 gloss rows</p>
        </div>
        {/* Toggle gloss inspector */}
        <button
          onClick={() => setInspectorOpen(!inspectorOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            inspectorOpen ? "bg-primary/15 text-primary" : "bg-surface-container text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
          Gloss
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-on-surface-variant bg-surface-container hover:text-on-surface transition-all">
          <span className="material-symbols-outlined text-[14px]">download</span>
          Export
        </button>
      </div>

      {/* Main split area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Player area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <SplitViewport />
          <Timeline playing={playing} onPlayPause={() => setPlaying(!playing)} />
        </div>

        {/* Gloss inspector panel */}
        {inspectorOpen && (
          <div className="w-[280px] flex-shrink-0 hidden md:flex">
            <GlossInspector />
          </div>
        )}
      </div>
    </div>
  );
}
