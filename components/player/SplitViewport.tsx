"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import SignAvatar from "./SignAvatar";
import NexaAvatar from "./NexaAvatar";
import CwasaAvatar, { GlossTimelineEntry, CwasaAvatarHandle } from "./CwasaAvatar";
import { SignPlan } from "@/lib/types";
import { NMMTag } from "@/lib/sigmlEngine";

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
  /** Timed motion plan driving the 3D avatar. */
  plan?: SignPlan | null;
  /** Target sign language label for the source badges. */
  lang?: string;
  /** Use the CWASA WebGL avatar (requires internet for allcsa.js). Falls back to procedural. */
  useCwasa?: boolean;
  /**
   * Saved project row, when the player was opened from the database. Takes
   * precedence over the sessionStorage handoff, which is still used by the
   * demo and by a freshly-ingested video that has not been saved yet.
   */
  project?: { source_url?: string | null; source_type?: string | null } | null;
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
  plan = null,
  lang = "ASL",
  useCwasa = false,
  project = null,
}: SplitViewportProps) {
  const [splitPos, setSplitPos] = useState(50);
  const [sourceVideoUrl, setSourceVideoUrl] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<"youtube" | "file" | null>(null);
  const [currentGloss, setCurrentGloss] = useState<string>("—");
  // Falls back to the procedural rig if the NEXA model cannot be loaded.
  const [nexaFailed, setNexaFailed] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const isSeekingRef = useRef<boolean>(false);
  const cwasaRef = useRef<CwasaAvatarHandle>(null);

  // Derive a GlossTimelineEntry[] from the SignPlan so CwasaAvatar knows when
  // to trigger each sign segment.  We do this with useMemo-equivalent logic
  // (recomputed only when plan changes) using a ref + effect.
  const [glossTimeline, setGlossTimeline] = useState<GlossTimelineEntry[]>([]);

  useEffect(() => {
    if (!plan?.items.length) {
      setGlossTimeline([]);
      return;
    }
    const tl: GlossTimelineEntry[] = plan.items.map((item) => {
      // Determine NMM from the first NMM tag in the item.
      let nmm: NMMTag = "neutral";
      if (item.nmm?.length) {
        const raw = item.nmm[0].emotion.toLowerCase();
        if (raw.includes("question") || raw.includes("wh")) nmm = "wh-question";
        else if (raw.includes("happy") || raw.includes("smile")) nmm = "smile";
        else if (raw.includes("negat") || raw.includes("headshake")) nmm = "negation";
        else if (raw.includes("topic")) nmm = "topic";
      }
      const gloss = item.fingerspell
        ? item.fingerspell
        : item.gloss;
      return { startTime: item.startTime, gloss, nmm };
    });
    setGlossTimeline(tl);
  }, [plan]);

  // Resolve the media source: a saved project row wins, otherwise fall back to
  // the sessionStorage handoff from ingestion.
  useEffect(() => {
    const url = project?.source_url ?? sessionStorage.getItem("sourceVideoUrl");
    const type = (project?.source_type ??
      sessionStorage.getItem("sourceType")) as "youtube" | "file" | null;
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
  }, [project]);

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
            {["Whisper V3", `en → ${lang}`, sourceType === "youtube" ? "YouTube" : "Local File"].map((tag) => (
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

      {/* Right pane — signing avatar */}
      <div className="flex-1 bg-[#060a0f] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-cyan opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex-1 min-h-0">
          {useCwasa ? (
            /* ── CWASA WebGL avatar ─────────────────────────────────────── */
            <CwasaAvatar
              ref={cwasaRef}
              glossTimeline={glossTimeline}
              currentTime={currentTime}
              playing={playing}
              className="w-full h-full"
            />
          ) : nexaFailed ? (
            /* ── Procedural avatar: offline fallback if the GLB won't load ─ */
            <SignAvatar
              plan={plan}
              currentTime={currentTime}
              playing={playing}
              label={plan ? undefined : currentGloss}
            />
          ) : (
            /* ── NEXA rigged model, driven by the same pose solver ───────── */
            <NexaAvatar
              plan={plan}
              currentTime={currentTime}
              playing={playing}
              label={plan ? undefined : currentGloss}
              onError={(msg) => {
                console.warn("[avatar] NEXA unavailable, using procedural rig:", msg);
                setNexaFailed(true);
              }}
            />
          )}
        </div>

        {!plan && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-surface-container/80 backdrop-blur-md text-[10px] font-mono text-on-surface-variant border border-outline-variant/30">
            Idle — run a translation to drive the avatar
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-primary font-mono z-20 pointer-events-none">
          <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
          {lang} Avatar
        </div>
      </div>
    </div>
  );
}
