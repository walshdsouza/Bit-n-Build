"use client";
import { useState } from "react";

export default function SplitViewport() {
  const [splitPos, setSplitPos] = useState(50); // percentage

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Left pane — Source video */}
      <div className="bg-[#070709] flex flex-col items-center justify-center relative overflow-hidden" style={{ width: `${splitPos}%` }}>
        <div className="absolute inset-0 bg-blueprint opacity-30" />
        <div className="relative z-10 text-center p-8 flex flex-col items-center gap-4">
          {/* Placeholder video frame */}
          <div className="w-full max-w-xs aspect-video rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center relative overflow-hidden">
            {/* Simulated still frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container opacity-80" />
            <div className="relative z-10 flex flex-col items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px]">smart_display</span>
              <span className="text-xs font-mono">Source Video</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {["Whisper V3", "97.3%", "en-US"].map((tag) => (
              <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Label */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
          <span className="material-symbols-outlined text-[14px]">videocam</span>
          Source
        </div>
      </div>

      {/* Divider handle */}
      <div
        className="w-[3px] bg-outline-variant/50 hover:bg-primary/60 transition-colors cursor-col-resize relative flex items-center justify-center z-20 flex-shrink-0"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startSplit = splitPos;
          const parent = (e.target as HTMLElement).closest(".flex-1.flex") as HTMLElement;
          const onMove = (me: MouseEvent) => {
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const pct = Math.min(80, Math.max(20, ((me.clientX - rect.left) / rect.width) * 100));
            setSplitPos(pct);
          };
          const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      >
        <div className="w-5 h-8 rounded-full bg-surface-container-high border border-outline-variant/50 flex flex-col items-center justify-center gap-0.5">
          <span className="w-0.5 h-3 bg-outline-variant rounded-full" />
        </div>
      </div>

      {/* Right pane — CWASA Avatar */}
      <div className="flex-1 bg-[#060a0f] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-cyan opacity-40" />
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* CWASA canvas placeholder */}
          <div
            id="cwasa-viewport"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-b from-primary/20 to-secondary-container/20 border-2 border-primary/30 shadow-[0_0_60px_rgba(76,215,246,0.3)] flex items-center justify-center relative overflow-hidden"
          >
            {/* 
              TODO: Replace this div with the CWASA WebGL canvas:
              <canvas ref={cwasaCanvasRef} id="cwasa-canvas" />
              Initialize with: new CWASAAvatar(canvasRef.current, { sigml: currentSigml })
              Drive NMMs with: avatar.setBlendshape(nmmTag.emotion, nmmTag.intensity)
            */}
            <span className="material-symbols-outlined text-primary text-[80px] opacity-60">sign_language</span>
            {/* Scan line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
          </div>

          {/* Current gloss */}
          <div className="text-center">
            <p className="font-mono text-primary font-bold text-sm">WOMAN THINK FOOD</p>
            <p className="text-xs text-on-surface-variant mt-0.5">SOV Gloss · wh-question_browDown</p>
          </div>

          {/* Avatar telemetry */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-on-surface-variant">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">60fps</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">SiGML ✓</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">NMM live</span>
          </div>
        </div>

        {/* Label */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-primary font-mono">
          <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
          CWASA Avatar
        </div>
      </div>
    </div>
  );
}
