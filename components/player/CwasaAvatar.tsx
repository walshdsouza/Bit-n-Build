"use client";

/**
 * CwasaAvatar — CWASA WebGL signing avatar pane.
 *
 * Responsibilities:
 *  1. Inject allcsa.js into <head> exactly once via useEffect.
 *  2. Expose a playSiGML(xml) method that enqueues SiGML strings safely,
 *     preventing race conditions by cancelling an in-flight request before
 *     starting a new one.
 *  3. Drive playback from the parent's `currentTime` + `glossTimeline`
 *     via a timeupdate-style callback prop.
 *
 * The component also renders a polished overlay so the pane looks good
 * even before the CWASA canvas is ready.
 */

import { useEffect, useRef, useCallback, useState, useImperativeHandle, forwardRef } from "react";
import { generateFluidSiGML, NMMTag, prewarmLexicon } from "@/lib/sigmlEngine";

// ---------------------------------------------------------------------------
// CWASA global type shim
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    CWASA?: {
      playSiGMLText: (xml: string) => void;
      stop?: () => void;
      setSpeed?: (s: number) => void;
    };
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GlossTimelineEntry {
  /** When this gloss segment starts (seconds, matching video currentTime). */
  startTime: number;
  /** Space-separated gloss words. */
  gloss: string;
  /** Facial expression / NMM for this segment. */
  nmm?: NMMTag;
}

export interface CwasaAvatarHandle {
  /** Manually trigger a SiGML play for a list of gloss words + NMM. */
  playGloss: (words: string[], nmm?: NMMTag) => void;
}

interface CwasaAvatarProps {
  /** Timeline entries produced by the LLM, sorted ascending by startTime. */
  glossTimeline?: GlossTimelineEntry[];
  /** Current playback time of the source video (seconds). */
  currentTime?: number;
  /** Whether the video is currently playing. */
  playing?: boolean;
  /** URL to the CWASA script. Falls back to the public dir copy. */
  cwasaScriptUrl?: string;
  /** CSS class for the outer wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_CWASA_URL = "https://vhg.cs.ucl.ac.uk/anims/cwasa/allcsa.js";
// How close (in seconds) the currentTime must be to a timeline entry's
// startTime to trigger it.  Must be >= the polling granularity (100 ms here).
const TRIGGER_WINDOW = 0.15;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CwasaAvatar = forwardRef<CwasaAvatarHandle, CwasaAvatarProps>(
  (
    {
      glossTimeline = [],
      currentTime = 0,
      playing = false,
      cwasaScriptUrl = DEFAULT_CWASA_URL,
      className = "",
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [avatarReady, setAvatarReady] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Tracks which timeline entries have already been triggered so we don't
    // fire the same segment twice on repeated renders.
    const triggeredRef = useRef<Set<number>>(new Set());
    // Stores the abort controller for the in-flight SiGML generation.
    const inFlightRef = useRef<AbortController | null>(null);
    // Ref copy of glossTimeline so the polling effect always sees the latest.
    const timelineRef = useRef(glossTimeline);
    useEffect(() => { timelineRef.current = glossTimeline; }, [glossTimeline]);

    // ── CWASA script injection ───────────────────────────────────────────
    useEffect(() => {
      prewarmLexicon();

      // Avoid double-injection across hot-reloads.
      if (document.querySelector(`script[data-cwasa]`)) {
        if (window.CWASA) setAvatarReady(true);
        return;
      }

      const script = document.createElement("script");
      script.src = cwasaScriptUrl;
      script.async = true;
      script.setAttribute("data-cwasa", "1");

      script.onload = () => {
        // CWASA initialises asynchronously; poll until the global is ready.
        let attempts = 0;
        const poll = setInterval(() => {
          if (window.CWASA) {
            clearInterval(poll);
            setAvatarReady(true);
          } else if (++attempts > 40) {
            clearInterval(poll);
            // CWASA global never appeared — the script likely blocked on WebGL
            // context creation; we'll show the fallback avatar instead.
            setLoadError("CWASA avatar could not initialise (WebGL unavailable?)");
          }
        }, 250);
      };

      script.onerror = () => {
        setLoadError(`Failed to load CWASA script from ${cwasaScriptUrl}`);
      };

      document.head.appendChild(script);

      return () => {
        // Don't remove the script on unmount — the CWASA object is global and
        // would be garbage-collected, breaking any other instances on the page.
      };
    }, [cwasaScriptUrl]);

    // ── Core: enqueue a SiGML play, cancelling any in-flight generation ──
    const playSiGML = useCallback(async (words: string[], nmm: NMMTag = "neutral") => {
      // Cancel any previous in-flight generation.
      if (inFlightRef.current) {
        inFlightRef.current.abort();
      }
      const controller = new AbortController();
      inFlightRef.current = controller;

      try {
        const xml = await generateFluidSiGML(words, nmm);

        // Check if this request was superseded before handing off to CWASA.
        if (controller.signal.aborted) return;

        if (window.CWASA) {
          window.CWASA.playSiGMLText(xml);
        } else {
          console.warn("[CwasaAvatar] CWASA not ready; dropping SiGML frame.");
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("[CwasaAvatar] SiGML generation failed:", err);
      } finally {
        if (inFlightRef.current === controller) {
          inFlightRef.current = null;
        }
      }
    }, []);

    // ── Expose playGloss to parent via ref ───────────────────────────────
    useImperativeHandle(ref, () => ({
      playGloss: (words: string[], nmm?: NMMTag) => playSiGML(words, nmm),
    }), [playSiGML]);

    // ── Timeline polling — fires glosses when video reaches their startTime ─
    useEffect(() => {
      if (!playing) return;

      const interval = setInterval(() => {
        const t = currentTime;
        const tl = timelineRef.current;

        for (const entry of tl) {
          const delta = Math.abs(t - entry.startTime);
          if (delta < TRIGGER_WINDOW && !triggeredRef.current.has(entry.startTime)) {
            triggeredRef.current.add(entry.startTime);
            const words = entry.gloss.trim().split(/\s+/).filter(Boolean);
            playSiGML(words, entry.nmm ?? "neutral");
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }, [playing, currentTime, playSiGML]);

    // Reset triggered set when the timeline changes (new translation loaded).
    useEffect(() => {
      triggeredRef.current.clear();
    }, [glossTimeline]);

    // ── Render ───────────────────────────────────────────────────────────
    return (
      <div className={`relative w-full h-full flex flex-col items-center justify-center ${className}`}>
        {/* CWASA mounts into this div — the id is required by the CWASA init code. */}
        <div
          id="cwasa-avatar-container"
          ref={containerRef}
          className="w-full h-full"
          style={{ minHeight: 300 }}
        />

        {/* Overlay states */}
        {!avatarReady && !loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#060a0f]/90 backdrop-blur-sm pointer-events-none">
            <div className="w-8 h-8 border-2 border-primary/60 border-t-primary rounded-full animate-spin" />
            <p className="text-[11px] font-mono text-on-surface-variant">Loading CWASA avatar…</p>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#060a0f]/80 pointer-events-none p-6">
            <span className="material-symbols-outlined text-[36px] text-error">error_outline</span>
            <p className="text-xs font-mono text-error text-center max-w-[200px]">{loadError}</p>
            <p className="text-[10px] text-on-surface-variant text-center">
              The procedural avatar will handle signing instead.
            </p>
          </div>
        )}

        {/* Status badge */}
        {avatarReady && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container/80 backdrop-blur-sm border border-outline-variant/30 text-[10px] font-mono text-primary pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            CWASA Live
          </div>
        )}
      </div>
    );
  },
);

CwasaAvatar.displayName = "CwasaAvatar";
export default CwasaAvatar;
