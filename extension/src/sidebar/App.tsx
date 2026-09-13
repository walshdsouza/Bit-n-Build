import { useEffect, useRef, useState } from "react";
import { startTabAudioCapture, type CaptureHandle } from "../pipeline/captureAudio";
import { transcribeChunk } from "../pipeline/liveTranslate";
import { getSettings } from "../pipeline/storage";
import NexaAvatar from "../../../components/player/NexaAvatar";
import { generateGloss } from "../../../lib/gloss-engine";
import { buildSignPlan } from "../../../lib/sign-plan";
import { analyzeProsody } from "../../../lib/prosody";
import type { SignLanguageCode, SignPlan, TranscriptSegment } from "../../../lib/types";

/** Transcript → gloss → motion plan, entirely in-process. */
async function buildTranscriptPlan(segments: TranscriptSegment[], lang: SignLanguageCode) {
  const { groqApiKey, openaiApiKey } = await getSettings();
  const prosody = analyzeProsody(segments);
  const { rows } = await generateGloss(segments, {
    lang,
    groqKey: groqApiKey ?? null,
    openaiKey: openaiApiKey ?? null,
  });
  return buildSignPlan(rows, { lang, prosody });
}

/**
 * The extension is standalone: there is no GestureSync server behind it. Every
 * stage below runs in the sidebar itself — Whisper is called directly with the
 * user's own key, and glossing, HamNoSys, SiGML and motion planning are all
 * pure functions from lib/, so they need no backend at all.
 */
export function App() {
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [plan, setPlan] = useState<SignPlan | null>(null);
  const [lang, setLang] = useState<SignLanguageCode>("ASL");
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  const handleRef = useRef<CaptureHandle | null>(null);
  const timeRef = useRef(0);
  const [currentTime, setCurrentTime] = useState(0);

  // The avatar needs a real model URL; inside an extension that is an
  // extension-relative path, not a server route.
  const modelUrl = browser.runtime.getURL("dist/nexa.glb");

  useEffect(() => {
    getSettings().then((s) => {
      setLang(s.targetLanguage);
      setHasKey(Boolean(s.groqApiKey || s.openaiApiKey));
    });
  }, []);

  useEffect(() => {
    if (!segments.length) return;
    let cancelled = false;
    buildTranscriptPlan(segments, lang).then((nextPlan) => {
      if (!cancelled) setPlan(nextPlan);
    }).catch((err: unknown) => {
      if (!cancelled) setError(`Could not build the sign plan: ${String(err)}`);
    });
    return () => { cancelled = true; };
  }, [segments, lang]);

  // Drive the avatar clock while capturing, anchored to wall time so it cannot
  // drift with the frame rate.
  useEffect(() => {
    if (!capturing || !plan?.duration) return;
    const startedAt = performance.now();
    const from = timeRef.current;
    let raf = 0;
    const tick = () => {
      const t = from + (performance.now() - startedAt) / 1000;
      timeRef.current = Math.min(t, plan.duration);
      setCurrentTime(timeRef.current);
      if (t < plan.duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [capturing, plan]);

  async function handleStart() {
    setError(null);
    try {
      handleRef.current = await startTabAudioCapture(
        async (blob) => {
          try {
            const result = await transcribeChunk(blob);
            setSegments((prev) => [...prev, ...result.segments]);
          } catch (err) {
            setError(String(err));
          }
        },
        (err) => setError(String(err)),
      );
      setCapturing(true);
    } catch (err) {
      setError(String(err));
    }
  }

  function handleStop() {
    handleRef.current?.stop();
    handleRef.current = null;
    setCapturing(false);
  }

  function openOptions() {
    browser.runtime.openOptionsPage();
  }

  return (
    <div className="panel">
      <header className="bar">
        <h1>GestureSync AI</h1>
        <span className="lang">{lang}</span>
      </header>

      <div className="avatar">
        <NexaAvatar
          plan={plan}
          currentTime={currentTime}
          playing={capturing}
          modelUrl={modelUrl}
          onError={(msg) => setError(`Avatar: ${msg}`)}
        />
      </div>

      {hasKey === false && (
        <p className="hint">
          No API key set — transcription will not run.{" "}
          <button className="link" onClick={openOptions}>
            Open settings
          </button>
        </p>
      )}

      <div className="controls">
        {!capturing ? (
          <button onClick={handleStart}>Start capture</button>
        ) : (
          <button onClick={handleStop}>Stop capture</button>
        )}
        <button className="secondary" onClick={openOptions}>
          Settings
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <ul className="transcript">
        {segments.map((s, i) => (
          <li key={i}>{s.text}</li>
        ))}
      </ul>
    </div>
  );
}
