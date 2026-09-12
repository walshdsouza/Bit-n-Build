"use client";
import { use, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import SplitViewport from "@/components/player/SplitViewport";
import Timeline from "@/components/player/Timeline";
import GlossInspector from "@/components/player/GlossInspector";
import LanguageSelector from "@/components/player/LanguageSelector";
import { GlossRow, SignLanguageCode, SignPlan, TranscriptSegment } from "@/lib/types";

const DEMO_SEGMENTS: TranscriptSegment[] = [
  { start: 0, end: 4.2, text: "The woman thinks about food." },
  { start: 4.2, end: 8.0, text: "She wants pizza but is on a diet." },
  { start: 8.0, end: 13.1, text: "She calls her friend for advice." },
  { start: 13.1, end: 18.5, text: "They plan to go to a salad bar." },
  { start: 18.5, end: 23.8, text: "But the friend suggests tacos instead." },
  { start: 23.8, end: 28.0, text: "They both laugh at the situation." },
];

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [playing, setPlaying] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [lang, setLang] = useState<SignLanguageCode>("ASL");
  const [glossRows, setGlossRows] = useState<GlossRow[]>([]);
  const [plan, setPlan] = useState<SignPlan | null>(null);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** True when a real <video>/YouTube element is available to act as the clock. */
  const [hasMedia, setHasMedia] = useState(true);
  const [planDuration, setPlanDuration] = useState(0);
  const timeRef = useRef(0);

  /** Seeking must move the fallback clock too, not just the displayed time. */
  const handleSeek = useCallback((t: number) => {
    timeRef.current = t;
    setCurrentTime(t);
  }, []);

  /** Guards against a slow response for an old language clobbering a newer one. */
  const requestRef = useRef(0);

  /** Runs prosody → gloss → HamNoSys → SiGML → motion plan for a target language. */
  const translate = useCallback(async (target: SignLanguageCode) => {
    const reqId = ++requestRef.current;
    let segments: TranscriptSegment[] = DEMO_SEGMENTS;
    let mediaDuration: number | undefined;

    const mediaPresent = Boolean(sessionStorage.getItem("sourceVideoUrl"));
    const raw = sessionStorage.getItem("processedTranscript");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (Array.isArray(data.segments) && data.segments.length) {
          segments = data.segments;
          mediaDuration = data.duration;
        }
      } catch {
        /* fall back to the demo transcript */
      }
    }

    setTranslating(true);
    setError(null);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segments, lang: target, duration: mediaDuration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Translation failed (${res.status})`);
      if (reqId !== requestRef.current) return; // superseded by a newer request

      setGlossRows(data.glossRows ?? []);
      setPlan(data.plan ?? null);
      setHasMedia(mediaPresent);

      // With no media element, the plan's own duration drives the timeline.
      if (!mediaPresent && data.plan?.duration) {
        setPlanDuration(data.plan.duration);
        setDuration(data.plan.duration);
      }
      // localStorage has a much larger quota (~5-10MB) than sessionStorage (~2.5MB).
      // The signPlan for a long video can easily exceed sessionStorage limits.
      try {
        localStorage.setItem("signPlan", JSON.stringify(data.plan));
      } catch {
        // Quota exceeded even for localStorage — silently ignore, plan is still in memory.
      }
    } catch (e) {
      if (reqId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Translation failed");
      setGlossRows([]);
      setPlan(null);
    } finally {
      if (reqId === requestRef.current) setTranslating(false);
    }
  }, []);

  // Translate on mount and whenever the target language changes. Deferred by a
  // tick so rapid switches coalesce into a single request.
  useEffect(() => {
    const t = setTimeout(() => translate(lang), 0);
    return () => clearTimeout(t);
  }, [lang, translate]);

  /**
   * Without a source medium (demo runs, audio-only jobs) no <video> element
   * drives the playhead, so the avatar would never animate. Fall back to our
   * own clock running off the motion plan's duration.
   */
  useEffect(() => {
    if (hasMedia || !playing || !planDuration) return;

    // Anchor playback to wall time rather than accumulating frame deltas.
    // Summing deltas makes the clock frame-rate dependent — it runs slow on a
    // struggling device, and browsers pause rAF entirely on a hidden tab, so a
    // delta-based clock either stalls or lurches forward on return.
    const startedAt = performance.now();
    const startTime = timeRef.current;
    let raf = 0;

    const tick = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const next = startTime + elapsed;

      if (next >= planDuration) {
        timeRef.current = planDuration;
        setCurrentTime(planDuration);
        setPlaying(false);
        return;
      }
      timeRef.current = next;
      setCurrentTime(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasMedia, playing, planDuration]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#060a0f]">
      {/* Player nav */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-outline-variant/30 bg-surface-container-lowest flex-shrink-0">
        <Link
          href="/dashboard"
          className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface truncate">
            {id === "demo" ? "Demo Translation — TED Talk on Accessibility" : `Translation #${id}`}
          </p>
          <p className="text-xs text-on-surface-variant">
            {duration > 0 ? `${Math.round(duration)}s` : "0:28"} · English → {lang}
            {translating && " · translating…"}
            {error && <span className="text-error"> · {error}</span>}
          </p>
        </div>

        <LanguageSelector value={lang} onChange={setLang} disabled={translating} />

        <button
          onClick={() => setInspectorOpen(!inspectorOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            inspectorOpen ? "bg-primary/15 text-primary" : "bg-surface-container text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
          Gloss
        </button>

        <button
          onClick={() => {
            if (!plan?.sigml) return;
            const blob = new Blob([plan.sigml], { type: "application/xml" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `gesturesync-${lang.toLowerCase()}-${id}.sigml`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          disabled={!plan?.sigml}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-on-surface-variant bg-surface-container hover:text-on-surface transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Download the generated SiGML document"
        >
          <span className="material-symbols-outlined text-[14px]">download</span>
          SiGML
        </button>
      </div>

      {/* Main split area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <SplitViewport
            playing={playing}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
            onDurationChange={setDuration}
            onPlayPause={() => setPlaying((p) => !p)}
            plan={plan}
            lang={lang}
          />
          <Timeline
            playing={playing}
            onPlayPause={() => setPlaying((p) => !p)}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>

        {inspectorOpen && (
          <div className="w-[280px] flex-shrink-0 hidden md:flex">
            <GlossInspector
              currentTime={currentTime}
              rows={glossRows}
              plan={plan}
              lang={lang}
            />
          </div>
        )}
      </div>
    </div>
  );
}
