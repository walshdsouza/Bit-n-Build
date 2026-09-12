"use client";
import { useState } from "react";

const avatarStyles = [
  { id: "holographic", label: "Holographic", desc: "Cyan wireframe glow" },
  { id: "realistic", label: "Realistic 3D", desc: "Photorealistic skin mesh" },
  { id: "minimal", label: "Minimal", desc: "Clean line-art skeleton" },
];

export default function AvatarSection() {
  const [style, setStyle] = useState("holographic");
  const [speed, setSpeed] = useState(1.0);
  const [handedness, setHandedness] = useState<"right" | "left">("right");

  return (
    <section id="avatar" className="space-y-6">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Avatar Configuration</h2>
        <p className="text-sm text-on-surface-variant">Configure the CWASA 3D signing avatar appearance and behavior.</p>
      </div>

      {/* Style picker */}
      <div>
        <p className="text-xs font-medium text-on-surface-variant mb-3">Avatar Style</p>
        <div className="grid grid-cols-3 gap-3">
          {avatarStyles.map((a) => (
            <button
              key={a.id}
              onClick={() => setStyle(a.id)}
              className={`rounded-xl p-4 flex flex-col items-center gap-2 border transition-all ${
                style === a.id
                  ? "border-primary bg-primary/5 shadow-[0_0_16px_rgba(76,215,246,0.15)]"
                  : "border-outline-variant/40 bg-surface-container-low hover:border-primary/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style === a.id ? "bg-primary/20" : "bg-surface-container"}`}>
                <span className={`material-symbols-outlined text-[22px] ${style === a.id ? "text-primary" : "text-on-surface-variant"}`}>view_in_ar</span>
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${style === a.id ? "text-primary" : "text-on-surface"}`}>{a.label}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Signing speed */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-on-surface-variant">Signing Speed</p>
          <span className="text-xs text-primary font-mono">{speed.toFixed(1)}×</span>
        </div>
        <input
          type="range" min={0.5} max={2.0} step={0.1}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-outline mt-1">
          <span>0.5× Slow</span>
          <span>1.0× Normal</span>
          <span>2.0× Fast</span>
        </div>
      </div>

      {/* Handedness */}
      <div>
        <p className="text-xs font-medium text-on-surface-variant mb-2">Dominant Hand</p>
        <div className="flex gap-2">
          {(["right", "left"] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHandedness(h)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                handedness === h
                  ? "bg-primary/10 text-primary border border-primary/40"
                  : "bg-surface-container text-on-surface-variant border border-outline-variant/40 hover:border-primary/25"
              }`}
            >
              {h.charAt(0).toUpperCase() + h.slice(1)}-handed
            </button>
          ))}
        </div>
      </div>

      <button className="px-5 py-2 rounded-full bg-gradient-to-r from-secondary-container to-primary-container text-on-primary text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.01] transition-all">
        Apply Avatar Settings
      </button>
    </section>
  );
}
