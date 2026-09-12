import { useCallback, useEffect, useRef, useState } from "react";
import { startTabAudioCapture, type CaptureHandle } from "../pipeline/captureAudio";
import { transcribeChunk } from "../pipeline/liveTranslate";
import { getSettings } from "../pipeline/storage";
import NexaAvatar from "../../../components/player/NexaAvatar";
import { generateGloss } from "../../../lib/gloss-engine";
import { buildSignPlan } from "../../../lib/sign-plan";
import { analyzeProsody } from "../../../lib/prosody";
import { validateApiKey } from "../../../lib/whisper";
import type { SignLanguageCode, SignPlan, TranscriptSegment } from "../../../lib/types";

type KeyStatus = "unset" | "checking" | "valid" | "invalid";

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
  const [keyStatus, setKeyStatus] = useState<KeyStatus>("unset");

  const handleRef = useRef<CaptureHandle | null>(null);
  const timeRef = useRef(0);
  const [currentTime, setCurrentTime] = useState(0);

  const modelUrl = browser.runtime.getURL("dist/nexa.glb");

  const checkKey = useCallback(async () => {
    const s = await getSettings();
    setLang(s.targetLanguage);
    if (s.groqApiKey) {
      setKeyStatus("checking");
      const result = await validateApiKey("groq", s.groqApiKey);
      setKeyStatus(result.valid ? "valid" : "invalid");
      return;
    }
    if (s.openaiApiKey) {
      setKeyStatus("checking");
      const result = await validateApiKey("openai", s.openaiApiKey);
      setKeyStatus(result.valid ? "valid" : "invalid");
      return;
    }
    setKeyStatus("unset");
  }, []);

  useEffect(() => {
    checkKey();

    const onStorageChanged = (
      changes: Record<string, browser.storage.StorageChange>,
      area: string,
    ) => {
      if (area !== "local") return;
      if ("targetLanguage" in changes) {
        setLang(changes.targetLanguage.newValue as SignLanguageCode);
      }
      if ("groqApiKey" in changes || "openaiApiKey" in changes) {
        checkKey();
      }
    };
    browser.storage.onChanged.addListener(onStorageChanged);
    return () => browser.storage.onChanged.removeListener(onStorageChanged);
  }, [checkKey]);

  const rebuildPlan = useCallback(
    async (segs: TranscriptSegment[], target: SignLanguageCode) => {
      if (!segs.length) return;
      try {
        const { groqApiKey, openaiApiKey } = await getSettings();
        const prosody = analyzeProsody(segs);
        const { rows } = await generateGloss(segs, {
          lang: target,
          groqKey: groqApiKey ?? null,
          openaiKey: openaiApiKey ?? null,
        });
        setPlan(buildSignPlan(rows, { lang: target, prosody }));
      } catch (err) {
        setError(`Could not build the sign plan: ${String(err)}`);
      }
    },
    [],
  );

  useEffect(() => {
    rebuildPlan(segments, lang);
  }, [segments, lang, rebuildPlan]);

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

      {keyStatus === "unset" && (
        <p className="hint">
          No API key set — transcription will not run.{" "}
          <button className="link" onClick={openOptions}>
            Open settings
          </button>
        </p>
      )}
      {keyStatus === "checking" && <p className="hint">Checking API key…</p>}
      {keyStatus === "invalid" && (
        <p className="error">
          API key was rejected — check it in{" "}
          <button className="link" onClick={openOptions}>
            settings
          </button>
          .
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