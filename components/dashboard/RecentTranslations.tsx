import Link from "next/link";

const recent = [
  { id: "j3", name: "City Council Hearing", date: "2h ago", duration: "1:02:07", glossCount: 2840 },
  { id: "r1", name: "TED Talk — Accessibility Design", date: "Yesterday", duration: "18:14", glossCount: 742 },
  { id: "r2", name: "ASL Basics Ep 11", date: "2 days ago", duration: "22:58", glossCount: 1021 },
];

export default function RecentTranslations() {
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
        <p className="text-on-surface font-semibold">Recent Translations</p>
        <Link href="/dashboard" className="text-xs text-primary hover:text-primary/80 transition-colors">View All</Link>
      </div>

      <div className="divide-y divide-outline-variant/20">
        {recent.map((item) => (
          <Link
            key={item.id}
            href={`/player/${item.id}`}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-high/30 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-[18px]">sign_language</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">{item.name}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{item.date} · {item.duration}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-mono text-primary">{item.glossCount.toLocaleString()}</p>
              <p className="text-[10px] text-outline">glosses</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
