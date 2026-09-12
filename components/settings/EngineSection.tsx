"use client";
import { useState } from "react";

export default function EngineSection() {
  const [model, setModel] = useState("gpt-4o");
  const [whisperModel, setWhisperModel] = useState("whisper-1");
  const [temperature, setTemperature] = useState(0.3);
  const [nmmDetail, setNmmDetail] = useState<"full" | "lite" | "off">("full");

  return (
    <section id="engine" className="space-y-6">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Neural Engine</h2>
        <p className="text-sm text-on-surface-variant">Configure the AI models powering the translation pipeline.</p>
      </div>

      {/* LLM Model */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant">Gloss LLM</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="bg-surface-container-lowest text-on-surface text-sm rounded-lg px-3 py-2.5 border border-outline-variant/50 focus:border-primary/50 focus:outline-none appearance-none cursor-pointer transition-all"
        >
          <option value="gpt-4o">GPT-4o (Recommended)</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </div>

      {/* Whisper */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant">STT Model</label>
        <select
          value={whisperModel}
          onChange={(e) => setWhisperModel(e.target.value)}
          className="bg-surface-container-lowest text-on-surface text-sm rounded-lg px-3 py-2.5 border border-outline-variant/50 focus:border-primary/50 focus:outline-none appearance-none cursor-pointer transition-all"
        >
          <option value="whisper-1">Whisper V3 (OpenAI)</option>
          <option value="whisper-large-v3">Whisper Large V3 (Local)</option>
        </select>
      </div>

      {/* Temperature */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-on-surface-variant">LLM Temperature</label>
          <span className="text-xs text-primary font-mono">{temperature.toFixed(2)}</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.05}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-outline mt-1">
          <span>Deterministic</span>
          <span>Creative</span>
        </div>
      </div>

      {/* NMM Detail */}
      <div>
        <p className="text-xs font-medium text-on-surface-variant mb-2">NMM Expression Detail</p>
        <div className="flex gap-2">
          {(["full", "lite", "off"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setNmmDetail(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                nmmDetail === d
                  ? "bg-primary/10 text-primary border border-primary/40"
                  : "bg-surface-container text-on-surface-variant border border-outline-variant/40 hover:border-primary/25"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-outline mt-2">
          Full: all brow/mouth/head NMMs · Lite: essential only · Off: skeleton only
        </p>
      </div>

      <button className="px-5 py-2 rounded-full bg-gradient-to-r from-secondary-container to-primary-container text-on-primary text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.01] transition-all">
        Save Engine Config
      </button>
    </section>
  );
}
