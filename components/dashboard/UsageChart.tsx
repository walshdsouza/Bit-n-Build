const weekData = [
  { day: "Mon", mins: 120 },
  { day: "Tue", mins: 75 },
  { day: "Wed", mins: 210 },
  { day: "Thu", mins: 165 },
  { day: "Fri", mins: 290 },
  { day: "Sat", mins: 50 },
  { day: "Sun", mins: 185 },
];

const maxMins = Math.max(...weekData.map((d) => d.mins));

export default function UsageChart() {
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">Weekly Usage</p>
          <p className="text-on-surface font-semibold mt-0.5">Translation Minutes</p>
        </div>
        <span className="text-2xl font-bold font-mono text-on-surface">
          1,095 <span className="text-sm text-on-surface-variant font-normal">min</span>
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-28">
        {weekData.map(({ day, mins }) => {
          const pct = (mins / maxMins) * 100;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full relative rounded-t-sm overflow-hidden" style={{ height: `${pct}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-container to-primary opacity-80 rounded-t-sm" />
                {day === "Fri" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-container to-primary rounded-t-sm shadow-[0_-4px_20px_rgba(76,215,246,0.5)]" />
                )}
              </div>
              <span className="text-[10px] text-outline">{day}</span>
            </div>
          );
        })}
      </div>

      {/* Metrics row */}
      <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-outline-variant/30">
        {[
          { label: "Avg/Day", value: "156m" },
          { label: "Sessions", value: "24" },
          { label: "Gloss Rate", value: "97.3%" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-on-surface font-bold font-mono text-sm">{value}</p>
            <p className="text-[10px] text-outline">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
