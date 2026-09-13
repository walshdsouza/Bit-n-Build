"use client";
import { use, useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SplitViewport from "@/components/player/SplitViewport";
import Timeline from "@/components/player/Timeline";
import GlossInspector from "@/components/player/GlossInspector";
import { GlossRow, SignLanguageCode, SignPlan, TranscriptSegment } from "@/lib/types";
import { getLocalProject, saveLocalProject } from "@/lib/local-projects";
import { loadCloudTranscript } from "@/lib/cloud-transcript";

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

const lang: SignLanguageCode = "ASL";
const sourceKey = (source: TranscriptSegment[]) => JSON.stringify(source.map(({ start, end, text }) => ({ start, end, text })));

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
  const router = useRouter();

  const [playing, setPlaying] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaDuration, setDuration] = useState(0);
  const mediaDurationRef = useRef(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [seekRequest, setSeekRequest] = useState({ time: 0, revision: 0 });
  const playerRef = useRef<HTMLDivElement>(null);

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
  const savedIdRef = useRef<string | undefined>(undefined);
  const sourceBlobRef = useRef<Blob | null>(null);
  const translatedSourceRef = useRef<string | null>(null);
  const requestRef = useRef(0);
  const projectGeneration = useRef(0);

  /** True when a real <video>/YouTube element is available to act as the clock. */
  const [hasMedia, setHasMedia] = useState(false);
  const [planDuration, setPlanDuration] = useState(0);
  const duration = Math.max(mediaDuration, planDuration);
  const sourceDuration = useMemo(() => mediaDuration || segments.reduce((end, segment) => Math.max(end, segment.end), 0), [mediaDuration, segments]);
  const signingTail = sourceDuration > 0 ? Math.max(0, Math.ceil(planDuration - sourceDuration)) : 0;
  const timeRef = useRef(0);
  const clockAnchor = useRef({ at: 0, time: 0 });

  /** Seeking must move the fallback clock too, not just the displayed time. */
  const handleSeek = useCallback((t: number) => {
    const time = Math.max(0, Math.min(duration, t));
    timeRef.current = time;
    clockAnchor.current = { at: performance.now(), time };
    setCurrentTime(time);
    setSeekRequest((previous) => ({ time, revision: previous.revision + 1 }));
  }, [duration]);

  const togglePlayback = useCallback(() => {
    if (!plan || translating) return;
    if (!playing && timeRef.current >= duration - 0.05) handleSeek(0);
    setPlaying((previous) => !previous);
  }, [plan, translating, playing, duration, handleSeek]);

  const handleMediaDuration = useCallback((value: number) => {
    mediaDurationRef.current = value;
    setDuration(value);
  }, []);

  const handleMediaTime = useCallback((time: number) => {
    timeRef.current = time;
    setCurrentTime(time);
  }, []);
  const handleEnded = useCallback(() => {
    // Dense speech can leave readable signing after the source has finished.
    // Continue from the media endpoint using the fallback clock.
    const time = Math.max(timeRef.current, mediaDuration);
    timeRef.current = time;
    setCurrentTime(time);
    setHasMedia(false);
    if (time >= duration - 0.01) setPlaying(false);
  }, [mediaDuration, duration]);

  /* ---------------------------------------------------------------- *
   * Load: database when the project is saved, sessionStorage otherwise
   * ---------------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;
    let restoredUrl: string | null = null;

    const fromSession = (): { project: ProjectRow; segments: EditableSegment[]; warning?: string } => {
      if (id === "demo") return {
        project: { title: "Demo Translation — Everyday Conversation", source_url: null, source_type: null },
        segments: DEMO_SEGMENTS,
      };
      const url = sessionStorage.getItem("sourceVideoUrl");
      const type = sessionStorage.getItem("sourceType");
      const raw = sessionStorage.getItem("processedTranscript");

      let parsed: EditableSegment[] = [];
      let title = "Untitled translation";
      let warning: string | undefined;
      if (raw) {
        try {
          const data = JSON.parse(raw);
          if ((id === "local" || data.projectId === id) && Array.isArray(data.segments) && data.segments.length) {
            warning = typeof data.persistenceWarning === "string" ? data.persistenceWarning : undefined;
            title = typeof data.title === "string" ? data.title : typeof data.filename === "string" ? data.filename : "Untitled translation";
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
          /* Report the missing transcript below. */
        }
      }

      return {
        project: {
          title,
          source_url: parsed.length ? url : null,
          source_type: parsed.length ? type : null,
        },
        segments: parsed,
        warning,
      };
    };

    async function load() {
      projectGeneration.current++;
      requestRef.current++;
      translatedSourceRef.current = null;
      savedIdRef.current = undefined;
      sourceBlobRef.current = null;
      mediaDurationRef.current = 0;
      timeRef.current = 0;
      setLoading(true);
      setPlaying(false);
      setTranslating(false);
      setError(null);
      setSaveNote(null);
      setSaving(false);
      setHasMedia(false);
      setAudioReady(false);
      setDuration(0);
      setPlanDuration(0);
      setCurrentTime(0);
      setPlan(null);
      setGlossRows([]);
      setPlaybackRate(1);
      setSeekRequest(previous => ({ time: 0, revision: previous.revision + 1 }));

      if (id.startsWith("saved-")) {
        try {
          const saved = await getLocalProject(id);
          if (cancelled) return;
          if (!saved) throw new Error("This track is not saved in this browser. Open it on the device where you saved it.");
          savedIdRef.current = saved.id;
          sourceBlobRef.current = saved.mediaBlob;
          restoredUrl = saved.mediaBlob ? URL.createObjectURL(saved.mediaBlob) : null;
          setProject({ id: saved.id, title: saved.title, source_url: restoredUrl ?? saved.sourceUrl, source_type: saved.sourceType });
          setSegments(saved.segments);
          // Retiming an older snapshot is local; it never reruns paid translation.
          let restoredPlan = saved.plan;
          if (restoredPlan?.lang === lang && restoredPlan.items.length) {
            if (saved.glossRows.length && restoredPlan.items.some(item => item.sourceIndex === undefined)) {
              const { buildSignPlan } = await import("@/lib/sign-plan");
              if (cancelled) return;
              restoredPlan = buildSignPlan(saved.glossRows, {
                lang,
                duration: saved.segments.reduce((end, segment) => Math.max(end, segment.end), 0),
              });
            }
            translatedSourceRef.current = sourceKey(saved.segments);
            setPlan(restoredPlan);
            setPlanDuration(restoredPlan.duration);
            setGlossRows(saved.glossRows);
            sessionStorage.setItem("signPlan", JSON.stringify(restoredPlan));
          }
          const time = Math.max(0, Math.min(saved.position, restoredPlan?.duration ?? saved.duration));
          timeRef.current = time;
          setCurrentTime(time);
          setSeekRequest(previous => ({ time, revision: previous.revision + 1 }));
          setPlaybackRate([0.5, 1, 1.5, 2].includes(saved.playbackRate) ? saved.playbackRate : 1);
          setSaveNote("Saved on this device");
        } catch (e) {
          if (!cancelled) {
            setProject(null);
            setSegments([]);
            setError(e instanceof Error ? e.message : "This saved track could not be opened.");
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }
      // The demo never touches the database.
      if (id === "demo" || id === "local") {
        const s = fromSession();
        if (!cancelled) {
          setProject(s.project);
          setSegments(s.segments);
          setSaveNote(s.warning ?? null);
          if (!s.segments.length) setError("No transcript is available for this project. Return to the dashboard to create a translation.");
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Sign in to open a saved project.");

        const { data: projData } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (!projData) throw new Error("This saved project is unavailable to your account.");

        const segData = await loadCloudTranscript(supabase, id);

        if (cancelled) return;

        if (projData) {
          // A cloud transcript can save even when its video upload does not.
          // Preserve the freshly uploaded local preview for this same project.
          const handoff = fromSession();
          setSaveNote(handoff.warning ?? null);
          setProject({
            ...projData as ProjectRow,
            source_url: projData.source_url || handoff.project.source_url,
            source_type: projData.source_type || handoff.project.source_type,
          });
        }

        if (segData?.length) {
          setSegments(
            segData.map((s) => ({
              id: s.id,
              start: s.start_time,
              end: s.end_time,
              text: s.edited_text ?? s.original_text,
              original_text: s.original_text,
            })),
          );
        } else {
          const s = fromSession();
          if (!projData) setProject(s.project);
          setSegments(s.segments);
          if (!s.segments.length) setError("No transcript is available for this project. Return to the dashboard to create a translation.");
        }
      } catch (e) {
        // No database configured, or the row is missing — fall back rather
        // than leaving the user staring at a permanent spinner.
        console.warn("[player] falling back to the local transcript:", e);
        if (cancelled) return;
        const s = fromSession();
        setProject(s.project);
        setSegments(s.segments);
        setSaveNote(s.warning ?? null);
        if (!s.segments.length) setError("This project could not be loaded. Return to the dashboard to create a translation.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      // This ref is a request generation counter, not a rendered DOM node.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      requestRef.current++;
      if (restoredUrl) URL.revokeObjectURL(restoredUrl);
    };
  }, [id]);

  /* ---------------------------------------------------------------- *
   * Translate
   * ---------------------------------------------------------------- */

  /** Runs prosody → gloss → HamNoSys → SiGML → motion plan for a target language. */
  const translate = useCallback(
    async (target: SignLanguageCode, source: EditableSegment[]) => {
      if (!source.length) return;
      const reqId = ++requestRef.current;

      const payload: TranscriptSegment[] = source.map((s) => ({
        start: s.start,
        end: s.end,
        text: s.text,
      }));

      setTranslating(true);
      setPlaying(false);
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

        // The API omits blank transcript entries. Preserve the original row
        // positions so clearing one line never makes later edits target it.
        let translatedIndex = 0;
        const sourceIndices = source.flatMap((segment, index) => segment.text.trim() ? [index] : []);
        if (data.plan?.items) {
          data.plan.items = data.plan.items.map((item: SignPlan["items"][number]) => ({
            ...item,
            sourceIndex: item.sourceIndex === undefined ? undefined : sourceIndices[item.sourceIndex],
          }));
        }
        setGlossRows(source.map((segment) => {
          const row = segment.text.trim() ? data.glossRows?.[translatedIndex++] : null;
          return row ?? { startTime: segment.start, endTime: segment.end, sourceText: segment.text, gloss: "", nmm: [], status: "queued", lang: target };
        }));
        translatedSourceRef.current = data.plan ? sourceKey(source) : null;
        setPlan(data.plan ?? null);
        const nextPlanDuration = data.plan?.duration ?? 0;
        setPlanDuration(nextPlanDuration);
        const nextDuration = Math.max(mediaDurationRef.current, nextPlanDuration);
        if (timeRef.current > nextDuration) {
          timeRef.current = nextDuration;
          setCurrentTime(nextDuration);
          setSeekRequest((previous) => ({ time: nextDuration, revision: previous.revision + 1 }));
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
    [],
  );

  // Re-translate when the transcript is edited. The
  // delay defers the call off the effect and debounces typing, so correcting a
  // line doesn't fire a request per keystroke.
  useEffect(() => {
    if (loading || !segments.length || translatedSourceRef.current === sourceKey(segments)) return;
    const t = setTimeout(() => translate(lang, segments), 400);
    return () => clearTimeout(t);
  }, [segments, loading, translate]);

  /* ---------------------------------------------------------------- *
   * Edit + save
   * ---------------------------------------------------------------- */

  const handleUpdateSource = useCallback((index: number, text: string) => {
    if (!segments[index] || segments[index].text === text) return;
    // Invalidate immediately, including the 400ms debounce window. An older
    // response must not re-enable playback against newly edited source text.
    requestRef.current++;
    setPlaying(false);
    setTranslating(true);
    setSaveNote(null);
    setSegments((previous) => previous.map((segment, i) => i === index ? { ...segment, text } : segment));
  }, [segments]);

  const handleSave = useCallback(async () => {
    if (!plan || translating || saving) return;
    const requestAtSave = requestRef.current;
    const projectAtSave = projectGeneration.current;
    const existingId = savedIdRef.current;
    setSaving(true);
    setSaveNote(null);
    try {
      const sourceType = project?.source_type === "upload" ? "file" : project?.source_type;
      let mediaBlob = sourceBlobRef.current;
      if (sourceType === "file" && !mediaBlob) {
        if (!project?.source_url) throw new Error("Upload the source file again before saving this track.");
        const response = await fetch(project.source_url).catch(() => {
          throw new Error("The source file is unavailable. Upload it again before saving.");
        });
        if (!response.ok) throw new Error("The source file is unavailable. Upload it again before saving.");
        mediaBlob = await response.blob();
        if (!mediaBlob.size) throw new Error("The source file is empty. Upload it again before saving.");
        if (projectAtSave === projectGeneration.current) sourceBlobRef.current = mediaBlob;
      }
      const savedId = await saveLocalProject({
        id: existingId,
        title: project?.title || "Untitled translation",
        sourceType: sourceType === "file" || sourceType === "youtube" ? sourceType : null,
        sourceUrl: sourceType === "youtube" ? project?.source_url ?? null : null,
        mediaBlob,
        segments,
        glossRows,
        plan,
        playbackRate,
        position: timeRef.current,
        duration,
      });
      if (projectAtSave !== projectGeneration.current) return;
      savedIdRef.current = savedId;
      if (requestRef.current !== requestAtSave) {
        setSaveNote("Previous version saved on this device. Save again to keep your latest edits.");
      } else {
        setSaveNote("Saved on this device");
        if (id !== savedId) router.replace(`/player/${savedId}`, { scroll: false });
      }
    } catch (e) {
      if (projectAtSave !== projectGeneration.current) return;
      const message = e instanceof DOMException && e.name === "QuotaExceededError"
        ? "Device storage is full. Free some space and try again."
        : e instanceof Error ? e.message : "Your browser could not save this track.";
      setSaveNote(`Save failed: ${message}`);
    } finally {
      if (projectAtSave === projectGeneration.current) setSaving(false);
    }
  }, [id, segments, project, plan, translating, saving, glossRows, playbackRate, duration, router]);

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
    if (hasMedia || !playing || !duration) return;

    clockAnchor.current = { at: performance.now(), time: timeRef.current };
    let raf = 0;

    const tick = () => {
      const elapsed = (performance.now() - clockAnchor.current.at) / 1000;
      const next = clockAnchor.current.time + elapsed * playbackRate;

      if (next >= duration) {
        timeRef.current = duration;
        setCurrentTime(duration);
        setPlaying(false);
        return;
      }
      timeRef.current = next;
      setCurrentTime(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasMedia, playing, duration, playbackRate]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-[#060a0f] text-sm font-mono text-on-surface-variant">
        Loading project…
      </div>
    );
  }

  return (
    <div ref={playerRef} className="flex flex-col h-[calc(100dvh-3.5rem)] min-h-[720px] md:min-h-[560px] bg-[#060a0f]">
      {/* Player nav */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-outline-variant/30 bg-surface-container-lowest flex-shrink-0">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface truncate">
            {project?.title ?? `Translation #${id}`}
          </p>
          <p className="text-xs text-on-surface-variant">
            {duration > 0 ? `${Math.round(duration)}s` : "0:28"} · {lang} translation
            {translating && " · translating…"}
            {saveNote && <span role="status" className="text-primary"> · {saveNote}</span>}
            {error && <span className="text-error"> · {error}</span>}
          </p>
          {signingTail > 2 && <p className="mt-1 text-xs text-on-surface-variant">Signing continues for {signingTail >= 60 ? `${Math.floor(signingTail / 60)}m ${signingTail % 60}s` : `${signingTail}s`} after the source ends to finish the translation.</p>}
        </div>

        <button
          onClick={handleSave}
          aria-label={saving ? "Saving track" : "Save"}
          disabled={saving || translating || !plan}
          title="Save the track and source media on this device"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[14px]">save</span>
          {saving ? "Saving…" : "Save"}
        </button>

        <button
          onClick={() => setInspectorOpen(!inspectorOpen)}
          aria-pressed={inspectorOpen}
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
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <div className="flex flex-col flex-1 overflow-hidden">
          <SplitViewport
            key={`${id}:${project?.source_url ?? "transcript"}`}
            playing={playing}
            currentTime={currentTime}
            onTimeUpdate={handleMediaTime}
            onDurationChange={handleMediaDuration}
            onPlayingChange={setPlaying}
            onMediaAvailability={setHasMedia}
            onEnded={handleEnded}
            onPlaybackRateChange={setPlaybackRate}
            playbackRate={playbackRate}
            muted={muted}
            onMutedChange={setMuted}
            onAudioAvailability={setAudioReady}
            seekRequest={seekRequest}
            segments={segments}
            plan={plan}
            lang={lang}
            project={project}
          />
          <Timeline
            playing={playing}
            onPlayPause={togglePlayback}
            disabled={!plan || translating}
            playbackRate={playbackRate}
            muted={muted}
            audioReady={audioReady}
            hasSourceAudio={Boolean(project?.source_url && ["youtube", "file", "upload"].includes(project?.source_type ?? ""))}
            onToggleMute={() => setMuted(value => !value)}
            onPlaybackRateChange={setPlaybackRate}
            onFullscreen={() => {
              const operation = document.fullscreenElement ? document.exitFullscreen() : playerRef.current?.requestFullscreen();
              operation?.catch(() => setError("Fullscreen is unavailable in this browser."));
            }}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>

        {inspectorOpen && (
          <div className="absolute inset-y-0 right-0 z-30 w-[min(280px,85%)] md:static md:w-[280px] flex-shrink-0 flex">
            <GlossInspector
              currentTime={currentTime}
              rows={glossRows}
              plan={plan}
              lang={lang}
              onUpdateSource={handleUpdateSource}
              sourceSegments={segments}
            />
          </div>
        )}
      </div>
    </div>
  );
}
