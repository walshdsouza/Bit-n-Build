export default function UsageChart() {
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 p-5">
      <p className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">Usage Reports</p>
      <p className="text-on-surface font-semibold mt-1">No usage report available</p>
      <div className="mt-4 rounded-lg bg-surface-container-low border border-outline-variant/25 p-4">
        <span aria-hidden="true" className="material-symbols-outlined text-primary">bar_chart</span>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Usage analytics are not available in this version. Your saved projects appear in Recent Translations when you are signed in and project history is configured.
        </p>
      </div>
    </div>
  );
}
