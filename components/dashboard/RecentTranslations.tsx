import Link from "next/link";

import { formatDistanceToNow } from 'date-fns';

interface RecentTranslationsProps {
  translations: any[];
}

export default function RecentTranslations({ translations = [] }: RecentTranslationsProps) {
  if (translations.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <p className="text-on-surface font-semibold">Recent Translations</p>
        </div>
        <div className="p-6 text-center text-on-surface-variant text-sm">
          No recent translations found.
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
        <p className="text-on-surface font-semibold">Recent Translations</p>
        <Link href="/dashboard" className="text-xs text-primary hover:text-primary/80 transition-colors">View All</Link>
      </div>

      <div className="divide-y divide-outline-variant/20">
        {translations.map((item) => {
          const dateStr = item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : 'Just now';
          const durationStr = item.source_duration ? `${Math.round(item.source_duration)}s` : 'Unknown';
          
          return (
            <Link
              key={item.id}
              href={`/player/${item.id}`}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-high/30 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[18px]">sign_language</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{item.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{dateStr} · {durationStr}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono text-primary">Ready</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
