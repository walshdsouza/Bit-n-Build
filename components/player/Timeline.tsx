"use client";

interface TimelineProps {
  playing: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function Timeline({ playing, onPlayPause, currentTime, duration, onSeek }: TimelineProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 33;
  const bufferedPct = Math.min(100, progress + 20);

  return (
    <div className="bg-surface-container-lowest border-t border-outline-variant/30 px-6 py-3 flex-shrink-0">
      {/* Scrubber */}
      <div className="relative mb-2 flex items-center gap-3">
        <span className="text-xs font-mono text-outline w-10 text-right shrink-0">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 relative h-1.5 bg-surface-container rounded-full overflow-hidden cursor-pointer">
          {/* Buffered */}
          <div
            className="absolute inset-y-0 left-0 bg-primary/20 rounded-full transition-all"
            style={{ width: `${bufferedPct}%` }}
          />
          {/* Played */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary-container to-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-mono text-outline w-10 shrink-0">
          {duration > 0 ? formatTime(duration) : "0:28"}
        </span>
        {/* Draggable thumb */}
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 100}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Transport */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 5))}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">skip_previous</span>
          </button>
          <button
            onClick={onPlayPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_16px_rgba(76,215,246,0.4)] hover:shadow-[0_0_24px_rgba(76,215,246,0.6)] hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">{playing ? "pause" : "play_arrow"}</span>
          </button>
          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 5))}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">skip_next</span>
          </button>
        </div>

        {/* Speed */}
        <button className="text-xs text-on-surface-variant hover:text-on-surface px-2 py-1 rounded bg-surface-container transition-colors font-mono">
          1×
        </button>

        {/* Volume */}
        <div className="flex items-center gap-1.5 ml-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">volume_up</span>
          <div className="w-20 relative h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-primary/70 rounded-full" style={{ width: "80%" }} />
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <button className="text-xs text-on-surface-variant hover:text-primary px-2 py-1 rounded bg-surface-container transition-colors font-mono">CC</button>
          <button className="text-xs text-on-surface-variant hover:text-primary px-2 py-1 rounded bg-surface-container transition-colors font-mono">NMM</button>
          <button className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[18px]">fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
