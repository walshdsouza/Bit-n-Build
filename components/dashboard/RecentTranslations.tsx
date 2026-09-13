"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { formatDistanceToNow } from 'date-fns';
import type { DashboardProject } from "./project";
import { listLocalProjects, watchLocalProjects, type LocalProjectSummary } from "@/lib/local-projects";

interface RecentTranslationsProps {
  translations: DashboardProject[];
}

export default function RecentTranslations({ translations = [] }: RecentTranslationsProps) {
  const [saved, setSaved] = useState<LocalProjectSummary[]>([]);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      listLocalProjects().then((projects) => {
        if (!cancelled) { setSaved(projects); setLibraryError(null); }
      }).catch(() => { if (!cancelled) setLibraryError("Saved tracks could not be read in this browser."); });
    };
    refresh();
    const unwatch = watchLocalProjects(refresh);
    return () => { cancelled = true; unwatch(); };
  }, []);
  const items = [
    ...saved.map(item => ({ id: item.id, title: item.title, created_at: item.updatedAt, source_duration: item.duration, local: true })),
    ...translations.map(item => ({ ...item, local: false })),
  ].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <p className="text-on-surface font-semibold">Recent Translations</p>
        </div>
        <div className="p-6 text-center text-on-surface-variant text-sm">
          {libraryError ?? "Saved tracks will appear here. Open a translation and choose Save to keep it on this device."}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
        <p className="text-on-surface font-semibold">Recent Translations</p>
        <span className="text-xs text-on-surface-variant">{items.length} {items.length === 1 ? "track" : "tracks"}</span>
      </div>

      <div className="divide-y divide-outline-variant/20">
        {items.map((item) => {
          const dateStr = item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : 'Just now';
          const durationStr = item.source_duration ? `${Math.round(item.source_duration)}s` : 'Unknown';
          
          return (
            <Link
              key={item.id}
              href={`/player/${item.id}`}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-high/30 transition-colors group"
            >
              <div className="w-9 h-9 shrink-0 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[18px]">sign_language</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{item.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{dateStr} · {durationStr}</p>
                <p className="mt-1 text-xs text-primary">{item.local ? "Saved on this device" : "Ready"}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
