"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import SignAvatar from "./SignAvatar";
import NexaAvatar from "./NexaAvatar";
import CwasaAvatar, { GlossTimelineEntry } from "./CwasaAvatar";
import { SignPlan, TranscriptSegment } from "@/lib/types";

interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(time: number, allowSeekAhead: boolean): void;
  setPlaybackRate(rate: number): void;
  getPlaybackRate(): number;
  getAvailablePlaybackRates(): number[];
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
}
interface YouTubeAPI {
  Player: new (element: HTMLElement, options: {
    videoId: string;
    playerVars: Record<string, number>;
    events: {
      onReady: (event: { target: YouTubePlayer }) => void;
      onError: () => void;
      onAutoplayBlocked: () => void;
      onStateChange: (event: { data: number }) => void;
      onPlaybackRateChange: (event: { data: number }) => void;
    };
  }) => YouTubePlayer;
}
declare global {
  interface Window { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void; }
}
let youtubeReady: Promise<YouTubeAPI> | null = null;
function loadYouTube(): Promise<YouTubeAPI> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubeReady) youtubeReady = new Promise<YouTubeAPI>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const timer = window.setTimeout(() => reject(new Error("YouTube could not be loaded.")), 15000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => { clearTimeout(timer); reject(new Error("YouTube could not be loaded.")); };
    document.head.appendChild(script);
  }).catch((error) => { youtubeReady = null; throw error; });
  return youtubeReady;
}

interface SplitViewportProps {
  playing: boolean;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayingChange: (playing: boolean) => void;
  onMediaAvailability: (available: boolean) => void;
  onEnded: () => void;
  playbackRate: number;
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
  onAudioAvailability: (available: boolean) => void;
  onPlaybackRateChange: (rate: number) => void;
  seekRequest: { time: number; revision: number };
  segments: TranscriptSegment[];
  plan?: SignPlan | null;
  lang?: string;
  useCwasa?: boolean;
  project?: { source_url?: string | null; source_type?: string | null } | null;
}
function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).match(/^[\w-]{11}$/)?.[0] ?? null;
    if (!/(^|\.)youtube\.com$/.test(parsed.hostname)) return null;
    const id = parsed.searchParams.get("v") ?? parsed.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/)?.[1];
    return id?.match(/^[\w-]{11}$/)?.[0] ?? null;
  } catch { return null; }
}

export default function SplitViewport({ playing, currentTime, onTimeUpdate, onDurationChange, onPlayingChange, onMediaAvailability, onEnded, playbackRate, muted, onMutedChange, onAudioAvailability, onPlaybackRateChange, seekRequest, segments, plan = null, lang = "ASL", useCwasa = false, project = null }: SplitViewportProps) {
  const [splitPos, setSplitPos] = useState(project?.source_url ? 55 : 42);
  const [nexaFailed, setNexaFailed] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [clockEnabled, setClockEnabled] = useState(false);
  const sourceClock = useRef(false);
  const sourceEnded = useRef(false);
  const sourceDuration = useRef(0);
  const playbackBlocked = useRef(false);
  const playAttempt = useRef(0);
  const appliedSeek = useRef(seekRequest.revision);
  const [rateNotice, setRateNotice] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const programmaticVideoSeek = useRef<number | null>(null);
  const youtubeMount = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const ytPlayer = useRef<YouTubePlayer | null>(null);
  const pendingYouTubeMute = useRef<{ value: boolean; until: number } | null>(null);
  const audioState = useRef({ muted, onMutedChange, onAudioAvailability });
  useEffect(() => { audioState.current = { muted, onMutedChange, onAudioAvailability }; }, [muted, onMutedChange, onAudioAvailability]);
  const live = useRef({ playing, currentTime, playbackRate, onPlaybackRateChange, seekRequest, onTimeUpdate, onDurationChange, onMediaAvailability, onEnded });
  useEffect(() => { live.current = { playing, currentTime, playbackRate, onPlaybackRateChange, seekRequest, onTimeUpdate, onDurationChange, onMediaAvailability, onEnded }; }, [playing, currentTime, playbackRate, onPlaybackRateChange, seekRequest, onTimeUpdate, onDurationChange, onMediaAvailability, onEnded]);
  const sourceUrl = project?.source_url ?? null;
  const sourceType = project?.source_type === "upload" ? "file" : project?.source_type ?? null;
  const youtubeId = sourceType === "youtube" && sourceUrl ? getYouTubeId(sourceUrl) : null;
  const setSourceClock = useCallback((enabled: boolean) => {
    sourceClock.current = enabled;
    setClockEnabled(enabled);
    live.current.onMediaAvailability(enabled);
  }, []);
  const applyYouTubeRate = useCallback((player: YouTubePlayer, rate: number) => {
    const available = player.getAvailablePlaybackRates();
    if (available.length && !available.includes(rate)) {
      const actual = player.getPlaybackRate();
      live.current.onPlaybackRateChange(actual);
      setRateNotice(`This YouTube video does not support ${rate}×. Playing at ${actual}×.`);
      return;
    }
    if (player.getPlaybackRate() === rate) return;
    setRateNotice(null);
    player.setPlaybackRate(rate);
  }, []);
  const applyYouTubeMute = useCallback((player: YouTubePlayer, next: boolean) => {
    const pending = pendingYouTubeMute.current;
    if (pending?.value === next && performance.now() < pending.until) return;
    if (!pending && player.isMuted() === next) return;
    // Commands cross the iframe boundary. Its cached isMuted() can briefly
    // describe the previous state, including during quick repeated clicks.
    pendingYouTubeMute.current = { value: next, until: performance.now() + 2000 };
    if (next) player.mute();
    else player.unMute();
  }, []);
  const finishSource = useCallback(() => {
    sourceEnded.current = true;
    setSourceClock(false);
    live.current.onEnded();
  }, [setSourceClock]);
  const activeSegment = segments.find((segment) => currentTime >= segment.start && currentTime < segment.end);
  const glossTimeline = useMemo<GlossTimelineEntry[]>(() => (plan?.items ?? []).map((item) => ({ startTime: item.startTime, gloss: item.fingerspell ?? item.gloss, nmm: "neutral" })), [plan]);

  useEffect(() => {
    if (!youtubeId) return;
    let cancelled = false;
    loadYouTube().then((api) => {
      if (cancelled || !youtubeMount.current) return;
      const element = document.createElement("div");
      youtubeMount.current.replaceChildren(element);
      ytPlayer.current = new api.Player(element, {
        videoId: youtubeId,
        playerVars: { controls: 0, rel: 0, playsinline: 1 },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return;
            const duration = target.getDuration();
            sourceDuration.current = Number.isFinite(duration) ? duration : 0;
            sourceEnded.current = duration > 0 && live.current.currentTime >= duration;
            appliedSeek.current = live.current.seekRequest.revision;
            setMediaReady(true);
            // Respect provider mute state, and retain an existing user mute.
            if (audioState.current.muted) applyYouTubeMute(target, true);
            else audioState.current.onMutedChange(target.isMuted());
            audioState.current.onAudioAvailability(true);
            live.current.onDurationChange(sourceDuration.current);
            setSourceClock(!sourceEnded.current);
            target.seekTo(Math.min(live.current.currentTime, duration || live.current.currentTime), true);
            applyYouTubeRate(target, live.current.playbackRate);
            if (live.current.playing && !sourceEnded.current) target.playVideo();
          },
          onError: () => {
            if (cancelled) return;
            setMediaError("Source video unavailable. You can still play the translation.");
            setMediaReady(false);
            audioState.current.onAudioAvailability(false);
            setSourceClock(false);
          },
          onAutoplayBlocked: () => {
            if (cancelled) return;
            playbackBlocked.current = true;
            setSourceClock(false);
            setMediaError("Source playback was blocked. The translation continues without the video; pause and play to retry.");
          },
          onPlaybackRateChange: ({ data }) => {
            if (cancelled || !Number.isFinite(data) || data <= 0) return;
            if (data !== live.current.playbackRate) {
              live.current.onPlaybackRateChange(data);
              setRateNotice(`YouTube is playing at ${data}×.`);
            }
          },
          onStateChange: ({ data }) => {
            if (cancelled) return;
            if (data === 0) finishSource();
            if (data === 2 && !live.current.playing && sourceClock.current) {
              const time = ytPlayer.current?.getCurrentTime();
              if (typeof time === "number" && Number.isFinite(time)) live.current.onTimeUpdate(time);
            }
            if (data === 1 && !sourceEnded.current) {
              playbackBlocked.current = false;
              setMediaError(null);
              setSourceClock(true);
            }
          },
        },
      });
    }).catch(() => {
      if (cancelled) return;
      setMediaError("YouTube is unavailable. You can still play the translation.");
      setSourceClock(false);
    });
    return () => { cancelled = true; ytPlayer.current?.destroy(); ytPlayer.current = null; };
  }, [youtubeId, setSourceClock, finishSource, applyYouTubeRate, applyYouTubeMute]);

  useEffect(() => {
    if (!mediaReady) return;
    if (videoRef.current) videoRef.current.muted = muted;
    const player = ytPlayer.current;
    if (player) applyYouTubeMute(player, muted);
  }, [muted, mediaReady, applyYouTubeMute]);

  useEffect(() => {
    if (!youtubeId || !mediaReady) return;
    // YouTube keyboard controls can change mute state independently of us.
    const timer = window.setInterval(() => {
      const player = ytPlayer.current;
      if (!player) return;
      const actual = player.isMuted();
      const pending = pendingYouTubeMute.current;
      if (pending && actual !== pending.value && performance.now() < pending.until) return;
      pendingYouTubeMute.current = null;
      audioState.current.onMutedChange(actual);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [youtubeId, mediaReady]);

  // Explicit seeks transfer clock ownership. Seeking into a signing tail
  // holds the source at its endpoint; seeking back restores source playback.
  // Readiness itself must not replay a stale seekRequest from earlier loading.
  useEffect(() => {
    if (!mediaReady || appliedSeek.current === seekRequest.revision) return;
    appliedSeek.current = seekRequest.revision;
    const duration = sourceDuration.current;
    sourceEnded.current = duration > 0 && seekRequest.time >= duration - 0.001;
    if (videoRef.current) {
      if (sourceEnded.current) videoRef.current.pause();
      programmaticVideoSeek.current = Math.min(seekRequest.time, duration || seekRequest.time);
      videoRef.current.currentTime = programmaticVideoSeek.current;
    }
    if (ytPlayer.current) {
      if (sourceEnded.current) ytPlayer.current.pauseVideo();
      ytPlayer.current.seekTo(Math.min(seekRequest.time, duration || seekRequest.time), true);
    }
    setSourceClock(!sourceEnded.current && !playbackBlocked.current);
  }, [seekRequest, mediaReady, setSourceClock]);

  useEffect(() => {
    const attempt = ++playAttempt.current;
    if (sourceDuration.current > 0 && live.current.currentTime >= sourceDuration.current - 0.001) {
      sourceEnded.current = true;
      setSourceClock(false);
    }
    const video = videoRef.current;
    if (video) {
      video.playbackRate = playbackRate;
      if (playing && mediaReady && !sourceEnded.current) {
        if (!sourceClock.current) {
          programmaticVideoSeek.current = Math.min(live.current.currentTime, sourceDuration.current);
          video.currentTime = programmaticVideoSeek.current;
        }
        video.play().then(() => {
          if (attempt !== playAttempt.current || !live.current.playing || sourceEnded.current) return;
          playbackBlocked.current = false;
          setMediaError(null);
          setSourceClock(true);
        }).catch((error: unknown) => {
          if (attempt !== playAttempt.current || (error instanceof DOMException && error.name === "AbortError")) return;
          playbackBlocked.current = true;
          setSourceClock(false);
          setMediaError("Source playback was blocked. The translation continues without the video; pause and play to retry.");
        });
      } else {
        video.pause();
        if (!playing && sourceClock.current && !sourceEnded.current) live.current.onTimeUpdate(video.currentTime);
      }
    }
    const yt = ytPlayer.current;
    if (yt && mediaReady) {
      applyYouTubeRate(yt, playbackRate);
      if (playing && !sourceEnded.current) {
        if (!sourceClock.current) yt.seekTo(live.current.currentTime, true);
        yt.playVideo();
      } else yt.pauseVideo();
    }
    return () => { playAttempt.current = attempt + 1; };
  }, [playing, playbackRate, mediaReady, seekRequest, setSourceClock, applyYouTubeRate]);

  useEffect(() => {
    if (!playing || !clockEnabled) return;
    let frame = 0;
    const tick = () => {
      if (!sourceClock.current) return;
      const time = videoRef.current?.currentTime ?? ytPlayer.current?.getCurrentTime();
      if (typeof time === "number" && Number.isFinite(time)) onTimeUpdate(time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, clockEnabled, onTimeUpdate]);

  return (
    <div ref={viewportRef} className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative">
      <div data-testid="source-pane" className="bg-[#070709] flex flex-col items-center justify-center relative overflow-hidden shrink-0 w-full md:w-[var(--source-width)] h-[clamp(150px,26dvh,220px)] md:h-auto" style={{ "--source-width": `${splitPos}%` } as React.CSSProperties}>
        <div className="absolute inset-0 bg-blueprint opacity-30" />
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-3 p-3">
          <div data-testid="source-media-stage" className="source-media-stage flex-1 min-h-0 w-full flex items-center justify-center">
          {youtubeId ? (
            <div data-testid="source-video-frame" className="source-video-frame rounded-lg overflow-hidden border border-outline-variant/30 relative">
              <div ref={youtubeMount} className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full" />
            </div>
          ) : sourceType === "file" && sourceUrl ? (
            <video ref={videoRef} src={sourceUrl} playsInline controls preload="metadata" muted={muted} className="w-full h-full rounded-lg object-contain bg-black"
              onVolumeChange={(event) => onMutedChange(event.currentTarget.muted)}
              onPlay={(event) => {
                if (event.currentTarget.ended) return;
                sourceEnded.current = false;
                playbackBlocked.current = false;
                setMediaError(null);
                setSourceClock(true);
                onTimeUpdate(event.currentTarget.currentTime);
                onPlayingChange(true);
              }}
              onPause={(event) => {
                if (event.currentTarget.ended || sourceEnded.current) return;
                onTimeUpdate(event.currentTarget.currentTime);
                onPlayingChange(false);
              }}
              onTimeUpdate={(event) => {
                if (sourceClock.current && !sourceEnded.current && !event.currentTarget.seeking) onTimeUpdate(event.currentTarget.currentTime);
              }}
              onSeeking={(event) => {
                const time = event.currentTarget.currentTime;
                if (programmaticVideoSeek.current !== null && Math.abs(time - programmaticVideoSeek.current) < 0.1) return;
                programmaticVideoSeek.current = null;
                sourceEnded.current = time >= sourceDuration.current;
                setSourceClock(!sourceEnded.current && !playbackBlocked.current);
                onTimeUpdate(time);
              }}
              onSeeked={(event) => {
                if (programmaticVideoSeek.current !== null) {
                  programmaticVideoSeek.current = null;
                  return;
                }
                onTimeUpdate(event.currentTarget.currentTime);
              }}
              onRateChange={(event) => onPlaybackRateChange(event.currentTarget.playbackRate)}
              onLoadedMetadata={(event) => {
                const mediaDuration = event.currentTarget.duration;
                if (!Number.isFinite(mediaDuration)) return;
                sourceDuration.current = mediaDuration;
                sourceEnded.current = live.current.currentTime >= mediaDuration;
                programmaticVideoSeek.current = Math.min(live.current.currentTime, mediaDuration);
                event.currentTarget.currentTime = programmaticVideoSeek.current;
                appliedSeek.current = seekRequest.revision;
                setMediaReady(true); onDurationChange(mediaDuration);
                onAudioAvailability(true);
                setSourceClock(!sourceEnded.current);
              }}
              onEnded={finishSource}
              onError={() => { setMediaError("Source file is unavailable. Re-upload it to restore video playback; the translation can still play."); setMediaReady(false); onAudioAvailability(false); setSourceClock(false); }} />
          ) : (
            <div className="max-w-sm text-center">
              <span className="hidden md:block material-symbols-outlined text-primary/70 text-[36px] mb-5" aria-hidden="true">closed_caption</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80 mb-3">Source transcript</p>
              <p data-testid="source-caption" className="text-sm md:text-xl leading-relaxed text-on-surface">{activeSegment?.text ?? (currentTime >= (plan?.duration ?? Infinity) ? "Translation complete" : "Ready to translate speech into movement.")}</p>
            </div>
          )}
          </div>
          {rateNotice && <p role="status" className="text-xs text-amber-200 text-center max-w-md">{rateNotice}</p>}
          {mediaError && <p role="status" className="text-xs text-secondary text-center max-w-sm">{mediaError}</p>}
          <div className="hidden md:flex gap-2 shrink-0">
            {[`${lang} translation`, sourceType === "youtube" ? "YouTube" : sourceType === "file" ? "Uploaded media" : "Demo transcript"].map((tag) => <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded-full bg-surface-container text-on-surface-variant">{tag}</span>)}
          </div>
        </div>
      </div>
      <div role="separator" aria-label="Resize source and avatar" aria-orientation="vertical" aria-valuemin={20} aria-valuemax={65} aria-valuenow={splitPos} tabIndex={0}
        onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); setSplitPos((value) => Math.max(20, Math.min(65, value + (event.key === "ArrowRight" ? 5 : -5)))); } }}
        onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          const bounds = viewportRef.current?.getBoundingClientRect();
          if (bounds) setSplitPos(Math.max(20, Math.min(65, (event.clientX - bounds.left) / bounds.width * 100)));
        }}
        className="hidden md:flex w-2 shrink-0 cursor-col-resize touch-none bg-outline-variant/20 hover:bg-primary/40 focus-visible:bg-primary/40 items-center justify-center z-20">
        <div className="w-1 h-8 rounded-full bg-outline-variant" />
      </div>
      <div className="flex-1 min-h-[240px] min-w-0 bg-[#060a0f] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-cyan opacity-40" />
        <div className="relative z-10 flex-1 min-h-0">
          {useCwasa ? <CwasaAvatar glossTimeline={glossTimeline} currentTime={currentTime} playing={playing} className="w-full h-full" />
            : nexaFailed ? <SignAvatar plan={plan} currentTime={currentTime} playing={playing} />
            : <NexaAvatar plan={plan} currentTime={currentTime} playing={playing} onError={() => setNexaFailed(true)} />}
        </div>
        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-primary pointer-events-none z-20">{lang} · NEXA</div>
      </div>
    </div>
  );
}
