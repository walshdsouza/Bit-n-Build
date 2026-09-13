"use client";
import type { DashboardProject } from "./project";

interface ProcessingQueueProps {
  jobs: DashboardProject[];
}

export default function ProcessingQueue({ jobs = [] }: ProcessingQueueProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Processing Queue</p>
            <p className="text-on-surface font-semibold mt-0.5">Active Jobs</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono">
            0 running
          </span>
        </div>
        <div className="p-6 text-center text-on-surface-variant text-sm">
          No active processing jobs. Upload a video to get started.
        </div>
      </div>
    );
  }
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
                <p className="text-sm font-medium text-on-surface truncate">{job.title}</p>
                <p className={`text-xs mt-0.5 text-secondary`}>
                  Processing
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            </div>
            <div className="h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-secondary-container to-primary`}
                style={{ width: `50%` }}
              />
            </div>
            <p className="text-[10px] text-outline font-mono mt-1 text-right">In Progress</p>
          </div>
        ))}
      </div>
    </div>
  );
}
