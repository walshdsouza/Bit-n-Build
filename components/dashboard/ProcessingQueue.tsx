"use client";
import Link from "next/link";

const jobs = [
  { id: "j1", name: "TED Talk — Sign Language Panel", progress: 87, stage: "CWASA Render", status: "processing", duration: "18:42" },
  { id: "j2", name: "ASL Basics Episode 12", progress: 54, stage: "Gloss Bridge", status: "processing", duration: "24:15" },
  { id: "j3", name: "City Council Hearing", progress: 100, stage: "Complete", status: "done", duration: "1:02:07" },
  { id: "j4", name: "Zoom Call Recording", progress: 12, stage: "Whisper STT", status: "processing", duration: "45:33" },
];

const stageColors: Record<string, string> = {
  "CWASA Render": "text-primary",
  "Gloss Bridge": "text-tertiary",
  "Whisper STT": "text-secondary",
  "Complete": "text-on-surface-variant",
};

export default function ProcessingQueue() {
  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
      <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
        <div>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Processing Queue</p>
          <p className="text-on-surface font-semibold mt-0.5">Active Jobs</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
          {jobs.filter((j) => j.status === "processing").length} running
        </span>
      </div>

      <div className="divide-y divide-outline-variant/20">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 hover:bg-surface-container-high/40 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-on-surface truncate">{job.name}</p>
                <p className={`text-xs mt-0.5 ${stageColors[job.stage] ?? "text-on-surface-variant"}`}>
                  {job.stage}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-outline font-mono">{job.duration}</span>
                {job.status === "done" ? (
                  <Link
                    href={`/player/${job.id}`}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    View
                  </Link>
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                )}
              </div>
            </div>
            <div className="h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  job.status === "done"
                    ? "bg-primary/60"
                    : "bg-gradient-to-r from-secondary-container to-primary"
                }`}
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-outline font-mono mt-1 text-right">{job.progress}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
