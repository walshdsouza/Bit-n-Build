"use client";

import { useSyncExternalStore } from "react";
import { getApiKeysSnapshot, parseApiKeys, subscribeToApiKeys } from "@/lib/client-api-keys";

interface EngineStatusProps {
  serverTranscriptionProvider?: "groq" | "openai" | null;
}

export default function EngineStatus({ serverTranscriptionProvider = null }: EngineStatusProps) {
  const snapshot = useSyncExternalStore(subscribeToApiKeys, getApiKeysSnapshot, () => "");
  const savedKeys = parseApiKeys(snapshot);
  const provider = savedKeys.groq || serverTranscriptionProvider === "groq"
    ? "Groq"
    : savedKeys.openai || serverTranscriptionProvider === "openai" ? "OpenAI" : null;
  const engines = [
    {
      name: "Audio transcription",
      detail: serverTranscriptionProvider
        ? `${serverTranscriptionProvider === "groq" ? "Groq" : "OpenAI"} configured on this deployment; no personal key needed`
        : provider ? `${provider} API key saved in this browser` : "Add a Groq or OpenAI API key in Settings to transcribe audio",
      icon: "mic", color: "text-primary",
    },
    { name: "Gloss translation", detail: provider ? `${provider} with rule-based fallback` : "Rule-based translation available without an API key", icon: "psychology", color: "text-tertiary" },
    { name: "SiGML export", detail: "Generated from the signing plan", icon: "account_tree", color: "text-secondary" },
    { name: "NEXA avatar", detail: "3D signing playback in your browser", icon: "view_in_ar", color: "text-primary" },
  ];
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 p-5">
      <p className="text-on-surface font-semibold mb-4">Translation Tools</p>
      <div className="flex flex-col gap-3">
        {engines.map(({ name, detail, icon, color }) => (
          <div key={name} className="flex items-start gap-3 rounded-lg px-3 py-2.5 bg-surface-container-low border border-outline-variant/25">
            <span aria-hidden="true" className={`material-symbols-outlined text-[18px] mt-0.5 ${color}`}>{icon}</span>
            <div className="min-w-0">
              <p className="text-sm text-on-surface">{name}</p>
              <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
