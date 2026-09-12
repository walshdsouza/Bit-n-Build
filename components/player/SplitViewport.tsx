"use client";
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface SplitViewportProps {
  playing: boolean;
  currentTime: number;
  onTimeUpdate: (t: number) => void;
  onDurationChange: (d: number) => void;
  onPlayPause: () => void;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function SplitViewport({
  playing,
  currentTime,
  onTimeUpdate,
  onDurationChange,
  onPlayPause,
}: SplitViewportProps) {
  const [splitPos, setSplitPos] = useState(50);
  const [sourceVideoUrl, setSourceVideoUrl] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<"youtube" | "file" | null>(null);
  const [currentGloss, setCurrentGloss] = useState<string>("—");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const isSeekingRef = useRef<boolean>(false);

  // Read source from sessionStorage
  useEffect(() => {
    const url = sessionStorage.getItem("sourceVideoUrl");
    const type = sessionStorage.getItem("sourceType") as "youtube" | "file" | null;
    setSourceVideoUrl(url);
    setSourceType(type);

    // Also pull current gloss from transcript
    const raw = sessionStorage.getItem("processedTranscript");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.segments?.length) {
          setCurrentGloss(data.segments[0].text);
        }
      } catch {}
    }
  }, []);

  // Sync currentGloss with currentTime from transcript
  useEffect(() => {
    const raw = sessionStorage.getItem("processedTranscript");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      const active = data.segments?.find(
        (s: { start: number; end: number; text: string }) =>
          currentTime >= s.start && currentTime <= s.end
      );
      if (active) setCurrentGloss(active.text);
    } catch {}
  }, [currentTime]);

  const youtubeId = sourceType === "youtube" && sourceVideoUrl ? getYouTubeId(sourceVideoUrl) : null;

  // Initialize YouTube API
  useEffect(() => {
    if (sourceType !== "youtube" || !youtubeId) return;

    const initYT = () => {
      if (!document.getElementById("youtube-player-container")) return;
      ytPlayerRef.current = new window.YT.Player("youtube-player-container", {
        videoId: youtubeId,
        playerVars: { 
          autoplay: playing ? 1 : 0, 
          controls: 0, 
          modestbranding: 1, 
          rel: 0,
          disablekb: 1
        },
        events: {
          onReady: (e: any) => {
            onDurationChange(e.target.getDuration());
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initYT;
    } else {
      // Re-init if script is already there
      setTimeout(initYT, 500);
    }

    return () => {
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        ytPlayerRef.current.destroy();
        ytPlayerRef.current = null;
      }
    };
  }, [youtubeId, sourceType]);

  // Sync HTML video / YT video with playing state
  useEffect(() => {
    if (sourceType === "file" && videoRef.current) {
      if (playing) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    } else if (sourceType === "youtube" && ytPlayerRef.current?.playVideo) {
      if (playing) ytPlayerRef.current.playVideo();
      else ytPlayerRef.current.pauseVideo();
    }
  }, [playing, sourceType]);

  // Sync HTML / YT video seek with external currentTime
  useEffect(() => {
    if (isSeekingRef.current) return;
    
    if (sourceType === "file" && videoRef.current) {
      if (Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
        videoRef.current.currentTime = currentTime;
      }
    } else if (sourceType === "youtube" && ytPlayerRef.current?.seekTo) {
      const ytTime = ytPlayerRef.current.getCurrentTime() || 0;
      if (Math.abs(ytTime - currentTime) > 0.5) {
        ytPlayerRef.current.seekTo(currentTime, true);
      }
    }
  }, [currentTime, sourceType]);

  // Polling loop for sending currentTime updates back to parent when playing
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      isSeekingRef.current = true; // Tell the external seek effect to ignore this
      if (sourceType === "file" && videoRef.current) {
        onTimeUpdate(videoRef.current.currentTime);
      } else if (sourceType === "youtube" && ytPlayerRef.current?.getCurrentTime) {
        onTimeUpdate(ytPlayerRef.current.getCurrentTime());
      }
      setTimeout(() => isSeekingRef.current = false, 50);
    }, 100);
    return () => clearInterval(interval);
  }, [playing, sourceType, onTimeUpdate]);

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Left pane — Source video */}
      <div
        className="bg-[#070709] flex flex-col items-center justify-center relative overflow-hidden"
        style={{ width: `${splitPos}%` }}
      >
        <div className="absolute inset-0 bg-blueprint opacity-30" />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-3 p-4">
          {youtubeId ? (
            <div 
              className="w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-outline-variant/30 shadow-lg shadow-primary/10 relative"
              onClick={onPlayPause}
            >
              {/* Wrapping the container to protect it from React reconciliation when YT replaces it with an iframe */}
              <div dangerouslySetInnerHTML={{ __html: '<div id="youtube-player-container" style="width: 100%; height: 100%; pointer-events: none;"></div>' }} className="w-full h-full" />
            </div>
          ) : sourceType === "file" && sourceVideoUrl ? (
            <div className="w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-outline-variant/30 shadow-lg shadow-primary/10">
              <video
                ref={videoRef}
                src={sourceVideoUrl}
                className="w-full h-full object-contain bg-black"
                onDurationChange={(e) => onDurationChange(e.currentTarget.duration)}
                onClick={onPlayPause}
              />
            </div>
          ) : (
            <div className="w-full max-w-xs aspect-video rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container opacity-80" />
              <div className="relative z-10 flex flex-col items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px]">smart_display</span>
                <span className="text-xs font-mono">Source Video</span>
              </div>
            </div>
          )}

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-1 justify-center">
            {["Whisper V3", "en-US", sourceType === "youtube" ? "YouTube" : "Local File"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Label */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
          <span className="material-symbols-outlined text-[14px]">videocam</span>
          Source
        </div>
      </div>

      {/* Divider handle */}
      <div
        className="w-[3px] bg-outline-variant/50 hover:bg-primary/60 transition-colors cursor-col-resize relative flex items-center justify-center z-20 flex-shrink-0"
        onMouseDown={(e) => {
          const parent = (e.target as HTMLElement).closest(".flex-1.flex") as HTMLElement;
          const onMove = (me: MouseEvent) => {
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const pct = Math.min(80, Math.max(20, ((me.clientX - rect.left) / rect.width) * 100));
            setSplitPos(pct);
          };
          const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      >
        <div className="w-5 h-8 rounded-full bg-surface-container-high border border-outline-variant/50 flex flex-col items-center justify-center gap-0.5">
          <span className="w-0.5 h-3 bg-outline-variant rounded-full" />
        </div>
      </div>

      {/* Right pane — CWASA Avatar */}
      <div className="flex-1 bg-[#060a0f] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-cyan opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            id="cwasa-viewport"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-b from-primary/20 to-secondary-container/20 border-2 border-primary/30 shadow-[0_0_60px_rgba(76,215,246,0.3)] flex items-center justify-center relative overflow-hidden"
          >
            <span className="material-symbols-outlined text-primary text-[80px] opacity-60">sign_language</span>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
          </div>

          <div className="text-center max-w-xs px-4">
            <p className="font-mono text-primary font-bold text-sm truncate">{currentGloss}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">SOV Gloss · wh-question_browDown</p>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono text-on-surface-variant">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">60fps</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">SiGML ✓</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">NMM live</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-primary font-mono">
          <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
          CWASA Avatar
        </div>
      </div>
    </div>
  );
}
