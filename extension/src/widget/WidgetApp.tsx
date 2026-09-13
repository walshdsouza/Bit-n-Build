import { useCallback, useEffect, useRef, useState } from "react";
import NexaAvatar from "../../../components/player/NexaAvatar";
import { transcribeAudioFile } from "../../../lib/whisper";
import { generateGloss } from "../../../lib/gloss-engine";
import { buildSignPlan } from "../../../lib/sign-plan";
import { analyzeProsody } from "../../../lib/prosody";
import { RequestError } from "../../../lib/request-validation";
import { getSettings } from "../pipeline/storage";
import type { SignPlan, TranscriptSegment } from "../../../lib/types";

const CHANNEL = "unmute-widget";
const MEET_ORIGIN = "https://meet.google.com";
const MAX_AUDIO = 2;
const MAX_PLANS = 2;
const post = (type: string) => window.parent.postMessage({ channel: CHANNEL, type }, MEET_ORIGIN);

export function WidgetApp() {
  const [owner, setOwner] = useState<"widget" | "sidebar" | null>(null);
  const [starting, setStarting] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [plan, setPlan] = useState<SignPlan | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [status, setStatus] = useState("Start to translate other participants' speech.");
  const [error, setError] = useState<string | null>(null);
  const [avatarReady, setAvatarReady] = useState(false);
  const ownerRef = useRef<typeof owner>(null);
  const mounted = useRef(true);
  const hostToken = useRef<string | null>(null);
  const captureSession = useRef<string | null>(null);
  const generation = useRef(0);
  const audioQueue = useRef<Blob[]>([]);
  const planQueue = useRef<SignPlan[]>([]);
  const planRef = useRef<SignPlan | null>(null);
  const currentTimeRef = useRef(0);
  const working = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const beginPlan = useCallback((next: SignPlan | null) => {
    planRef.current = next;
    currentTimeRef.current = 0;
    setCurrentTime(0);
    setPlan(next);
  }, []);
  const stopWork = useCallback(() => {
    generation.current++;
    abort.current?.abort();
    abort.current = null;
    audioQueue.current = [];
    planQueue.current = [];
    if (startTimer.current) clearTimeout(startTimer.current);
    startTimer.current = null;
    setStarting(false);
  }, []);

  const processQueue = useCallback(async () => {
    if (working.current) return;
    working.current = true;
    try {
      while (audioQueue.current.length && ownerRef.current === "widget") {
        const blob = audioQueue.current.shift()!;
        const requestGeneration = generation.current;
        const controller = new AbortController();
        abort.current = controller;
        try {
          setStatus("Translating speech…");
          const settings = await getSettings();
          if (requestGeneration !== generation.current) continue;
          // Same Whisper implementation as the sidebar, with live cancellation.
          // Credentials never leave this extension-origin frame for the Meet page.
          const result = await transcribeAudioFile(blob, "meeting.webm", settings.groqApiKey, settings.openaiApiKey, { signal: controller.signal, timeoutMs: 20_000 });
          if (requestGeneration !== generation.current) continue;
          if (!result.segments.length) { setStatus("Listening for speech…"); continue; }
          const start = result.segments[0].start;
          const batch = result.segments.map(segment => ({ ...segment, start: Math.max(0, segment.start - start), end: Math.max(.1, segment.end - start) }));
          // Local glossing keeps stop/cancel immediate and avoids a second paid
          // request for every eight-second capture. Whisper already outputs English.
          const { rows } = await generateGloss(batch, { lang: "ASL", rulesOnly: true });
          if (requestGeneration !== generation.current) continue;
          const nextPlan = buildSignPlan(rows, { lang: "ASL", prosody: analyzeProsody(batch) });
          setSegments(previous => [...previous, ...batch].slice(-2));
          setError(null);
          setStatus("Live ASL · meeting audio");
          if (!planRef.current || currentTimeRef.current >= planRef.current.duration) beginPlan(nextPlan);
          else {
            if (planQueue.current.length >= MAX_PLANS) {
              planQueue.current.shift();
              setStatus("Catching up with the latest speech…");
            }
            planQueue.current.push(nextPlan);
          }
        } catch (reason) {
          if (requestGeneration !== generation.current) continue;
          if (reason instanceof RequestError && reason.code === "NO_SPEECH") { setError(null); setStatus("Listening for speech…"); continue; }
          setError(reason instanceof Error ? reason.message : "Speech could not be translated. Try again.");
          setStatus("Listening for the next sentence…");
        } finally {
          if (abort.current === controller) abort.current = null;
        }
      }
    } finally { working.current = false; }
  }, [beginPlan]);

  useEffect(() => {
    mounted.current = true;
    const receive = (event: MessageEvent) => {
      const extensionUrl = new URL(browser.runtime.getURL("dist/widget.html"));
      const extensionOrigin = `${extensionUrl.protocol}//${extensionUrl.host}`;
      const validSource = event.source === window.parent || (event.isTrusted && event.source === null);
      if (!validSource || (event.origin !== MEET_ORIGIN && event.origin !== extensionOrigin) || event.data?.channel !== CHANNEL || !hostToken.current || event.data.token !== hostToken.current) return;
      const data = event.data;
      if (data.type === "WIDGET_STATE") {
        setMinimized(data.minimized === true);
        setHidden(data.hidden === true);
        const next = data.owner === "widget" || data.owner === "sidebar" ? data.owner : null;
        captureSession.current = next === "widget" && typeof data.captureSessionId === "string" ? data.captureSessionId : null;
        if (next !== ownerRef.current) {
          stopWork();
          ownerRef.current = next;
          setOwner(next);
          if (next === "widget") setStatus("Listening to other participants…");
          else setStatus(next === "sidebar" ? "Sidebar capture is active. Stop it there to use this widget." : "Start to translate other participants' speech.");
        }
        if (next === "widget") { setStarting(false); if (startTimer.current) clearTimeout(startTimer.current); }
      } else if (data.type === "AUDIO_CHUNK" && ownerRef.current === "widget" && data.blob instanceof Blob && data.blob.size > 0 && data.blob.size <= 4 * 1024 * 1024) {
        if (audioQueue.current.length >= MAX_AUDIO) { audioQueue.current.shift(); setStatus("Catching up with the latest speech…"); }
        audioQueue.current.push(data.blob);
        void processQueue();
      } else if (data.type === "WIDGET_ERROR" && typeof data.message === "string") {
        setError(data.message.slice(0, 300));
        setStarting(false);
        if (startTimer.current) clearTimeout(startTimer.current);
      }
    };
    window.addEventListener("message", receive);
    let cancelled = false;
    void browser.runtime.sendMessage({ type: "UNMUTE_WIDGET_TOKEN" }).then(result => {
      if (cancelled || typeof result?.token !== "string") return;
      hostToken.current = result.token;
      post("WIDGET_READY");
    }).catch(() => { if (!cancelled) setError("Reload the Meet tab to reconnect UNMUTE."); });
    const release = () => {
      mounted.current = false;
      if (ownerRef.current === "widget" && captureSession.current) {
        void browser.runtime.sendMessage({ type: "UNMUTE_WIDGET_STOP", captureSessionId: captureSession.current }).catch(() => {});
      }
      stopWork();
    };
    window.addEventListener("pagehide", release);
    return () => { cancelled = true; hostToken.current = null; window.removeEventListener("message", receive); window.removeEventListener("pagehide", release); release(); };
  }, [processQueue, stopWork]);

  useEffect(() => {
    if (!plan || owner !== "widget" || (!minimized && !hidden && !avatarReady)) return;
    const started = performance.now();
    const from = currentTimeRef.current;
    const tick = () => {
      const time = Math.min(plan.duration, from + (performance.now() - started) / 1000);
      currentTimeRef.current = time;
      setCurrentTime(time);
      if (time >= plan.duration && planQueue.current.length) beginPlan(planQueue.current.shift()!);
    };
    const timer = setInterval(tick, 50);
    return () => clearInterval(timer);
  }, [plan, owner, minimized, hidden, avatarReady, beginPlan]);

  async function start() {
    if (starting || ownerRef.current) return;
    setError(null);
    setStarting(true);
    const requestGeneration = generation.current;
    try {
      const settings = await getSettings();
      if (requestGeneration !== generation.current) return;
      if (!settings.groqApiKey?.trim() && !settings.openaiApiKey?.trim()) {
        setError("Add a transcription key in extension settings first.");
        setStarting(false);
        return;
      }
      stopWork();
      beginPlan(null);
      setSegments([]);
      setStarting(true);
      // Capture consent crosses the authenticated extension runtime, never DOM
      // events that a Meet page script could synthesize with a forged origin.
      let expired = false;
      const request = browser.runtime.sendMessage({ type: "UNMUTE_WIDGET_START" }).then(result => {
        if ((expired || !mounted.current) && result?.owner === "widget") {
          void browser.runtime.sendMessage({ type: "UNMUTE_WIDGET_STOP", captureSessionId: result.captureSessionId }).catch(() => {});
        }
        return result;
      });
      const result = await Promise.race([request, new Promise<never>((_, reject) => {
        startTimer.current = setTimeout(() => { expired = true; reject(new Error("Meet did not respond. Reload the tab, then start again.")); }, 10_000);
      })]);
      if (!mounted.current) return;
      captureSession.current = result?.captureSessionId ?? null;
      if (result?.owner !== "widget") throw new Error("Stop sidebar capture before starting this widget.");
      ownerRef.current = "widget";
      setOwner("widget");
      setStarting(false);
      setStatus("Listening to other participants…");
    } catch (reason) {
      if (mounted.current) { setStarting(false); setError(reason instanceof Error ? reason.message : "Capture could not start. Reload the Meet tab and retry."); }
    } finally { if (startTimer.current) clearTimeout(startTimer.current); startTimer.current = null; }
  }
  function stop() {
    stopWork();
    ownerRef.current = null;
    setOwner(null);
    void browser.runtime.sendMessage({ type: "UNMUTE_WIDGET_STOP", captureSessionId: captureSession.current }).catch(() => setError("Capture could not stop. Reload this Meet tab."));
    captureSession.current = null;
    setStatus("Stopped. Captions stay here until you start again.");
  }
  const capturing = owner === "widget";
  return <>
    <header className="widget-bar">
      <strong>UNMUTE</strong>
      <span className={`status-dot${capturing ? " live" : ""}`} role="img" aria-label={capturing ? "Capturing meeting audio" : "Capture idle"} />
      <div className="bar-actions">
        <button className="btn-icon" aria-label={minimized ? "Expand widget" : "Minimize widget"} aria-expanded={!minimized} onClick={() => post("WIDGET_MINIMIZE")}>{minimized ? "⌄" : "⌃"}</button>
        <button className="btn-icon" aria-label="Hide widget" title="Hide widget; capture continues" onClick={() => post("WIDGET_CLOSE")}>×</button>
      </div>
    </header>
    {!minimized && <>
      <div className="avatar-zone">{!hidden && <NexaAvatar plan={plan} currentTime={currentTime} playing={capturing} modelUrl={browser.runtime.getURL("dist/nexa.glb")} onReady={setAvatarReady} onError={() => setError("The avatar could not load. Captions remain available.")} />}</div>
      <div className="caption-strip" aria-live="polite" aria-atomic="true">{segments.length ? segments.map(segment => segment.text).join(" ") : "Meeting captions will appear here."}</div>
      <p role="status" className={`widget-status${error ? " error" : ""}`}>{error ?? status}</p>
      <div className="widget-controls">
        <button disabled={starting || owner === "sidebar"} onClick={capturing ? stop : start}>{starting ? "Starting…" : capturing ? "Stop" : owner === "sidebar" ? "Sidebar active" : "Start"}</button>
        <button onClick={() => void browser.runtime.openOptionsPage()}>Settings</button>
      </div>
    </>}
  </>;
}
