"use client";
import { use, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import SplitViewport from "@/components/player/SplitViewport";
import Timeline from "@/components/player/Timeline";
import GlossInspector from "@/components/player/GlossInspector";
import LanguageSelector from "@/components/player/LanguageSelector";
import { GlossRow, SignLanguageCode, SignPlan, TranscriptSegment } from "@/lib/types";

/** A transcript segment plus the identity it needs to be written back. */
interface EditableSegment extends TranscriptSegment {
  id?: string;
  original_text?: string;
}

interface ProjectRow {
  id?: string;
  title?: string;
  source_url?: string | null;
  source_type?: string | null;
}

const DEMO_SEGMENTS: EditableSegment[] = [
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

  // Project + transcript, loaded from the database or handed over by ingestion.
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [segments, setSegments] = useState<EditableSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState<string | null>(null);

  /** True when a real <video>/YouTube element is available to act as the clock. */
  const [hasMedia, setHasMedia] = useState(true);
  const [planDuration, setPlanDuration] = useState(0);
  const timeRef = useRef(0);

  /** Seeking must move the fallback clock too, not just the displayed time. */
  const handleSeek = useCallback((t: number) => {
    timeRef.current = t;
    setCurrentTime(t);
  }, []);

  /* ---------------------------------------------------------------- *
   * Load: database when the project is saved, sessionStorage otherwise
   * ---------------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    const fromSession = (): { project: ProjectRow; segments: EditableSegment[] } => {
      const url = sessionStorage.getItem("sourceVideoUrl");
      const type = sessionStorage.getItem("sourceType");
      const raw = sessionStorage.getItem("processedTranscript");

      let parsed: EditableSegment[] = [];
      if (raw) {
        try {
          const data = JSON.parse(raw);
          if (Array.isArray(data.segments) && data.segments.length) {
            parsed = data.segments.map(
              (s: { start: number; end: number; text: string }, i: number) => ({
                id: String(i),
                start: s.start,
                end: s.end,
                text: s.text,
                original_text: s.text,
              }),
            );
          }
        } catch {
          /* fall through to the demo transcript */
        }
      }

      return {
        project: {
          title:
            id === "demo"
              ? "Demo Translation — TED Talk on Accessibility"
              : `Translation #${id}`,
          source_url: url,
          source_type: type,
        },
        segments: parsed.length ? parsed : DEMO_SEGMENTS,
      };
    };

    async function load() {
      // The demo never touches the database.
      if (id === "demo") {
        const s = fromSession();
        if (!cancelled) {
          setProject(s.project);
          setSegments(s.segments);
          setLoading(false);
        }
        return;
      }

      try {
        // Imported lazily and guarded: utils/supabase/client asserts its env
        // vars, so calling it without NEXT_PUBLIC_SUPABASE_* configured throws
        // — which would take the whole player down, demo included.
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();

        const { data: projData } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        const { data: segData } = await supabase
          .from("transcript_segments")
          .select("*")
          .eq("project_id", id)
          .order("sequence_index", { ascending: true });

        if (cancelled) return;

        if (projData) setProject(projData as ProjectRow);

        if (segData?.length) {
          setSegments(
            segData.map((s) => ({
              id: s.id,
              start: s.start_time,
              end: s.end_time,
              text: s.edited_text || s.original_text,
              original_text: s.original_text,
            })),
          );
        } else {
          const s = fromSession();
          if (!projData) setProject(s.project);
          setSegments(s.segments);
        }
      } catch (e) {
        // No database configured, or the row is missing — fall back rather
        // than leaving the user staring at a permanent spinner.
        console.warn("[player] falling back to the local transcript:", e);
        if (cancelled) return;
        const s = fromSession();
        setProject(s.project);
        setSegments(s.segments);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ---------------------------------------------------------------- *
   * Translate
   * ---------------------------------------------------------------- */

  /** Guards against a slow response for an old language clobbering a newer one. */
  const requestRef = useRef(0);

  /** Runs prosody → gloss → HamNoSys → SiGML → motion plan for a target language. */
  const translate = useCallback(
    async (target: SignLanguageCode, source: EditableSegment[]) => {
      if (!source.length) return;
      const reqId = ++requestRef.current;

      const mediaPresent = Boolean(
        project?.source_url || sessionStorage.getItem("sourceVideoUrl"),
      );
      const payload: TranscriptSegment[] = source.map((s) => ({
        start: s.start,
        end: s.end,
        text: s.text,
      }));

      setTranslating(true);
      setError(null);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            segments: payload,
            lang: target,
            duration: payload[payload.length - 1]?.end,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Translation failed (${res.status})`);
        if (reqId !== requestRef.current) return; // superseded by a newer request

        setGlossRows(data.glossRows ?? []);
        setPlan(data.plan ?? null);
        setHasMedia(mediaPresent);

        if (!mediaPresent && data.plan?.duration) {
          setPlanDuration(data.plan.duration);
          setDuration(data.plan.duration);
        }
        sessionStorage.setItem("signPlan", JSON.stringify(data.plan));
      } catch (e) {
        if (reqId !== requestRef.current) return;
        setError(e instanceof Error ? e.message : "Translation failed");
        setGlossRows([]);
        setPlan(null);
      } finally {
        if (reqId === requestRef.current) setTranslating(false);
      }
    },
    [project],
  );

  // Re-translate when the language changes or the transcript is edited. The
  // delay defers the call off the effect and debounces typing, so correcting a
  // line doesn't fire a request per keystroke.
  useEffect(() => {
    if (loading || !segments.length) return;
    const t = setTimeout(() => translate(lang, segments), 400);
    return () => clearTimeout(t);
  }, [lang, segments, loading, translate]);

  /* ---------------------------------------------------------------- *
   * Edit + save
   * ---------------------------------------------------------------- */

  const handleUpdateSource = useCallback((index: number, text: string) => {
    setSegments((prev) => {
      if (!prev[index] || prev[index].text === text) return prev;
      const next = [...prev];
      next[index] = { ...next[index], text };
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (id === "demo") return;
    setSaving(true);
    setSaveNote(null);
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      const rows = segments.map((s, i) => ({
        ...(s.id ? { id: s.id } : {}),
        project_id: id,
        sequence_index: i,
        start_time: s.start,
        end_time: s.end,
        original_text: s.original_text ?? s.text,
        edited_text: s.text,
      }));

      const { error: upsertError } = await supabase
        .from("transcript_segments")
        .upsert(rows);
      if (upsertError) throw upsertError;
      setSaveNote("Saved");
    } catch (e) {
      setSaveNote(e instanceof Error ? `Save failed: ${e.message}` : "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveNote(null), 4000);
    }
  }, [id, segments]);

  /* ---------------------------------------------------------------- *
   * Fallback clock
   * ---------------------------------------------------------------- */

  /**
   * Without a source medium (demo runs, audio-only jobs) no <video> element
   * drives the playhead, so the avatar would never animate. Anchor playback to
   * wall time rather than accumulating frame deltas: summing deltas makes the
   * clock frame-rate dependent, and browsers pause rAF on a hidden tab, so a
   * delta-based clock either stalls or lurches forward on return.
   */
  useEffect(() => {
    if (hasMedia || !playing || !planDuration) return;

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

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-[#060a0f] text-sm font-mono text-on-surface-variant">
        Loading project…
      </div>
    );
  }

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
            {project?.title ?? `Translation #${id}`}
          </p>
          <p className="text-xs text-on-surface-variant">
            {duration > 0 ? `${Math.round(duration)}s` : "0:28"} · English → {lang}
            {translating && " · translating…"}
            {saveNote && <span className="text-primary"> · {saveNote}</span>}
            {error && <span className="text-error"> · {error}</span>}
          </p>
        </div>

        <LanguageSelector value={lang} onChange={setLang} disabled={translating} />

        <button
          onClick={handleSave}
          disabled={saving || id === "demo"}
          title={
            id === "demo"
              ? "The demo is not backed by a saved project"
              : "Save transcript edits"
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[14px]">save</span>
          {saving ? "Saving…" : "Save"}
        </button>

        <button
          onClick={() => setInspectorOpen(!inspectorOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            inspectorOpen
              ? "bg-primary/15 text-primary"
              : "bg-surface-container text-on-surface-variant"
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
            project={project}
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
              onUpdateSource={handleUpdateSource}
            />
          </div>
        )}
      </div>
    </div>
  );
}
