"use client";

import { useEffect, useRef, useState } from "react";
import { SignLanguageCode } from "@/lib/types";

export interface LanguageOption {
  code: SignLanguageCode;
  name: string;
  nativeName?: string;
  region: string;
  wordOrder: string;
  fingerspellingHands: 1 | 2;
  ready: boolean;
  dictionary: { entries: number; twoHanded: number; oneHanded: number };
}

interface Props {
  value: SignLanguageCode;
  onChange: (code: SignLanguageCode) => void;
  disabled?: boolean;
}

export default function LanguageSelector({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sign-languages")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d.languages)) setLanguages(d.languages);
      })
      .catch(() => {
        /* picker falls back to the current value only */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const active = languages.find((l) => l.code === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant hover:text-on-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={active ? `Target sign language: ${active.name}` : "Select target sign language"}
        title={active?.name ?? "Select target sign language"}
      >
        <span className="material-symbols-outlined text-[14px]">translate</span>
        <span className="font-mono">{value}</span>
        <span className="material-symbols-outlined text-[14px]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-[260px] rounded-xl bg-surface-container-high border border-outline-variant/40 shadow-2xl z-50 overflow-hidden"
        >
          <p className="px-3 pt-2.5 pb-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
            Target sign language
          </p>
          {languages.length === 0 && (
            <p className="px-3 py-3 text-xs text-on-surface-variant">Loading…</p>
          )}
          {languages.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === value}
              onClick={() => {
                onChange(l.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 transition-colors border-l-2 ${
                l.code === value
                  ? "bg-primary/10 border-primary"
                  : "border-transparent hover:bg-surface-container-highest"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-on-surface">{l.code}</span>
                <span className="text-xs text-on-surface-variant truncate flex-1">{l.name}</span>
                {!l.ready && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    beta
                  </span>
                )}
              </div>
              {l.nativeName && (
                <p className="text-[11px] text-on-surface-variant mt-0.5">{l.nativeName}</p>
              )}
              <p className="text-[10px] text-on-surface-variant/80 mt-1 font-mono">
                {l.wordOrder.replace(/_/g, "-")} · {l.fingerspellingHands}-handed alphabet ·{" "}
                {l.dictionary.entries} signs
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
