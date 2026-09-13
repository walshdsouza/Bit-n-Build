"use client";

interface TimelineProps {
  playing: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  disabled?: boolean;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  onFullscreen: () => void;
}

function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  return `${Math.floor(safe / 60)}:${Math.floor(safe % 60).toString().padStart(2, "0")}`;
}

export default function Timeline({ playing, onPlayPause, currentTime, duration, onSeek, disabled, playbackRate, onPlaybackRateChange, onFullscreen }: TimelineProps) {
  const buttonClass = "w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40";
  return (
    <div className="bg-surface-container-lowest border-t border-outline-variant/30 px-3 sm:px-6 py-3 flex-shrink-0">
      <div className="mb-2 flex items-center gap-3">
        <output data-testid="playback-time" className="text-xs font-mono text-on-surface-variant w-10 text-right shrink-0">{formatTime(currentTime)}</output>
        <input aria-label="Playback position" type="range" min={0} max={duration || 0} step={0.1}
          value={Math.min(currentTime, duration || 0)} disabled={disabled || !duration}
          onChange={(event) => onSeek(Number(event.target.value))}
          className="flex-1 min-w-0 h-6 accent-primary cursor-pointer" />
        <span className="text-xs font-mono text-on-surface-variant w-10 shrink-0">{formatTime(duration)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <button aria-label="Back 5 seconds" disabled={disabled} onClick={() => onSeek(Math.max(0, currentTime - 5))} className={buttonClass}>
            <span className="material-symbols-outlined" aria-hidden="true">replay_5</span>
          </button>
          <button aria-label={playing ? "Pause" : currentTime >= duration && duration > 0 ? "Replay" : "Play"} disabled={disabled} onClick={onPlayPause}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-lg disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <span className="material-symbols-outlined" aria-hidden="true">{playing ? "pause" : "play_arrow"}</span>
          </button>
          <button aria-label="Forward 5 seconds" disabled={disabled} onClick={() => onSeek(Math.min(duration, currentTime + 5))} className={buttonClass}>
            <span className="material-symbols-outlined" aria-hidden="true">forward_5</span>
          </button>
        </div>
        <select aria-label="Playback speed" value={playbackRate} onChange={(event) => onPlaybackRateChange(Number(event.target.value))}
          className="h-10 text-xs text-on-surface bg-surface-container px-2 rounded-lg font-mono">
          {[0.5, 1, 1.5, 2].map((rate) => <option key={rate} value={rate}>{rate}×</option>)}
        </select>
        <div className="flex items-center gap-1 ml-auto">
          <button aria-label="Toggle fullscreen" onClick={onFullscreen} className={buttonClass}>
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
