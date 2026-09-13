"use client";

import { useEffect, useRef, useState } from "react";

const MAX_BYTES = Math.floor(3.8 * 1024 * 1024);
const STOP_AT_BYTES = MAX_BYTES - 128 * 1024;
const MAX_SECONDS = 10 * 60;

interface TabAudioCaptureProps {
  disabled?: boolean;
  selectedFile: File | null;
  onRecorded: (file: File) => void;
  onBusyChange: (busy: boolean) => void;
}

interface CaptureSession {
  stream: MediaStream | null;
  recorder: MediaRecorder | null;
  context: AudioContext | null;
  timer: number | null;
  timeout: number | null;
  chunks: Blob[];
  bytes: number;
  heardAudio: boolean;
  measuredAudio: boolean;
  cancelled: boolean;
  finishing: boolean;
  limitReached: boolean;
  removeListeners: Array<() => void>;
}

function release(session: CaptureSession) {
  if (session.timer !== null) window.clearInterval(session.timer);
  if (session.timeout !== null) window.clearTimeout(session.timeout);
  session.removeListeners.forEach((remove) => remove());
  session.removeListeners = [];
  session.stream?.getTracks().forEach((track) => track.stop());
  if (session.context && session.context.state !== "closed") void session.context.close().catch(() => {});
}

function discard(session: CaptureSession) {
  session.cancelled = true;
  if (session.recorder) {
    session.recorder.ondataavailable = null;
    session.recorder.onstop = null;
    session.recorder.onerror = null;
    if (session.recorder.state !== "inactive") session.recorder.stop();
  }
  release(session);
  session.chunks = [];
}

function displayTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function TabAudioCapture({ disabled, selectedFile, onRecorded, onBusyChange }: TabAudioCaptureProps) {
  const sessionRef = useRef<CaptureSession | null>(null);
  const [phase, setPhase] = useState<"idle" | "choosing" | "recording" | "stopping">("idle");
  const [seconds, setSeconds] = useState(0);
  const [signal, setSignal] = useState<"waiting" | "audio" | "quiet">("waiting");
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);

  useEffect(() => () => {
    const session = sessionRef.current;
    sessionRef.current = null;
    if (session) discard(session);
  }, []);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview]);

  function cancel(message = "Recording cancelled. No recording was saved or uploaded.", error = false) {
    const session = sessionRef.current;
    sessionRef.current = null;
    if (session) discard(session);
    setPhase("idle");
    onBusyChange(false);
    setFeedback({ text: message, error });
  }

  function stop(session: CaptureSession | null, limitReached = false) {
    if (!session || session.cancelled || session.finishing || sessionRef.current !== session) return;
    session.finishing = true;
    session.limitReached = limitReached;
    setPhase("stopping");
    // stop() emits the final audio chunk before its stop event.
    if (session.recorder?.state === "recording") session.recorder.stop();
    release(session);
  }

  async function start() {
    if (disabled || sessionRef.current) return;
    if (!navigator.mediaDevices?.getDisplayMedia || typeof MediaRecorder === "undefined") {
      setFeedback({ text: "Tab audio capture is unavailable in this browser. Open this page in desktop Chrome or Edge, or upload an audio file.", error: true });
      return;
    }
    const mimeType = ["audio/webm;codecs=opus", "audio/webm"].find((type) => MediaRecorder.isTypeSupported(type));
    if (!mimeType) {
      setFeedback({ text: "This browser cannot record WebM audio. Use desktop Chrome or Edge, or upload an audio file.", error: true });
      return;
    }
    const session: CaptureSession = {
      stream: null, recorder: null, context: null, timer: null, timeout: null,
      chunks: [], bytes: 0, heardAudio: false, measuredAudio: false,
      cancelled: false, finishing: false, limitReached: false, removeListeners: [],
    };
    sessionRef.current = session;
    setPhase("choosing");
    setFeedback(null);
    setSeconds(0);
    setSignal("waiting");
    onBusyChange(true);

    try {
      // Only this explicit click opens the browser picker. These are hints;
      // inspect the user's selected stream too, since browsers may ignore them.
      const options: DisplayMediaStreamOptions & {
        systemAudio: "exclude";
        selfBrowserSurface: "exclude";
        monitorTypeSurfaces: "exclude";
        surfaceSwitching: "exclude";
      } = {
        video: { displaySurface: "browser" }, audio: true, systemAudio: "exclude",
        selfBrowserSurface: "exclude", monitorTypeSurfaces: "exclude", surfaceSwitching: "exclude",
      };
      const stream = await navigator.mediaDevices.getDisplayMedia(options);
      if (sessionRef.current !== session || session.cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      session.stream = stream;
      const surface = stream.getVideoTracks()[0]?.getSettings().displaySurface;
      if (surface && surface !== "browser") {
        cancel("Choose a browser tab in the sharing picker, with Share tab audio enabled. Whole-screen and window recording are not used.", true);
        return;
      }
      const tracks = stream.getAudioTracks().filter((track) => track.readyState === "live");
      if (!tracks.length) {
        cancel("No tab audio was shared. Start again, select a browser tab, and enable Share tab audio.", true);
        return;
      }

      // The browser requires a display track for its picker. Its video frames
      // are never attached to a recorder, preview, file, or upload.
      const audioOnly = new MediaStream(tracks);
      const recorder = new MediaRecorder(audioOnly, { mimeType, audioBitsPerSecond: 64_000 });
      session.recorder = recorder;
      const context = new AudioContext();
      session.context = context;
      void context.resume().catch(() => {});
      const source = context.createMediaStreamSource(audioOnly);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const samples = new Float32Array(analyser.fftSize);
      let lastSound = Number.NEGATIVE_INFINITY;
      const started = performance.now();

      recorder.ondataavailable = (event) => {
        if (sessionRef.current !== session || session.cancelled || !event.data.size) return;
        session.chunks.push(event.data);
        session.bytes += event.data.size;
        if (session.bytes >= STOP_AT_BYTES) stop(session, true);
      };
      recorder.onerror = () => {
        if (sessionRef.current === session) cancel("The browser could not finish recording this tab. Start again or upload an audio file.", true);
      };
      recorder.onstop = () => {
        release(session);
        if (sessionRef.current !== session || session.cancelled) return;
        sessionRef.current = null;
        setPhase("idle");
        onBusyChange(false);
        const blob = new Blob(session.chunks, { type: mimeType });
        session.chunks = [];
        if (!blob.size || (session.measuredAudio && !session.heardAudio)) {
          setFeedback({ text: "No audio was detected. Play the source with sound, then start a new recording with Share tab audio enabled.", error: true });
          return;
        }
        if (blob.size > MAX_BYTES) {
          setFeedback({ text: "This recording exceeds 3.8 MB. Record a shorter section before importing.", error: true });
          return;
        }
        const file = new File([blob], `tab-audio-${Date.now()}.webm`, { type: "audio/webm" });
        setPreview({ file, url: URL.createObjectURL(file) });
        onRecorded(file);
        setFeedback({ text: session.limitReached ? "Recording limit reached. The captured audio is selected for review and import." : "Audio recorded and selected for import. Review it, then choose Synthesize ASL. Nothing has been uploaded yet.", error: false });
      };
      for (const track of stream.getTracks()) {
        const ended = () => stop(session);
        track.addEventListener("ended", ended);
        session.removeListeners.push(() => track.removeEventListener("ended", ended));
      }
      recorder.start(1000);
      setPhase("recording");
      session.timer = window.setInterval(() => {
        const elapsed = Math.min(MAX_SECONDS, Math.floor((performance.now() - started) / 1000));
        setSeconds(elapsed);
        if (context.state === "running") {
          analyser.getFloatTimeDomainData(samples);
          session.measuredAudio = true;
          if (samples.some((sample) => Math.abs(sample) > 0.001)) {
            session.heardAudio = true;
            lastSound = performance.now();
          }
          setSignal(performance.now() - lastSound < 1500 ? "audio" : elapsed >= 5 ? "quiet" : "waiting");
        }
        if (elapsed >= MAX_SECONDS) stop(session, true);
      }, 250);
      session.timeout = window.setTimeout(() => stop(session, true), MAX_SECONDS * 1000);
    } catch (error) {
      if (sessionRef.current !== session || session.cancelled) return;
      const denied = error instanceof DOMException && error.name === "NotAllowedError";
      cancel(denied ? "Tab sharing was cancelled or denied. Nothing was recorded. Start again when you are ready." : "Tab audio capture could not start. Choose a browser tab with Share tab audio enabled, or upload an audio file.", !denied);
    }
  }

  return (
    <section aria-label="Tab audio capture" className="mt-4 rounded-lg border border-primary/25 bg-primary/5 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-on-surface">Capture audio from a browser tab</h3>
      <p className="text-xs leading-relaxed text-on-surface-variant">
        If a link cannot be imported, open its video in another tab. Choose Start, select that tab, and enable <strong>Share tab audio</strong>. Play from 0:00 to capture the full clip, then return here and stop. Only shared audio is saved; video is never recorded or uploaded.
      </p>
      <p className="text-xs text-on-surface-variant">Up to 10 minutes or 3.8 MB per recording. Capture only audio you intend to send for transcription.</p>
      <div className="flex flex-wrap items-center gap-2">
        {phase === "idle" ? (
          <button type="button" onClick={start} disabled={disabled} className="min-h-11 rounded-lg bg-primary/15 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/25 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-primary">Start tab audio capture</button>
        ) : (
          <>
            {phase === "recording" && <button type="button" onClick={() => stop(sessionRef.current)} className="min-h-11 rounded-lg bg-primary/15 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/25">Stop recording</button>}
            <button type="button" onClick={() => cancel()} className="min-h-11 rounded-lg border border-outline-variant/50 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high">Cancel capture</button>
            <span className="text-sm font-mono text-on-surface" aria-label="Recording elapsed time">{displayTime(seconds)}</span>
          </>
        )}
      </div>
      {phase !== "idle" && <p role="status" className="text-xs text-on-surface-variant">{phase === "choosing" ? "Choose a browser tab in the sharing picker." : phase === "stopping" ? "Finishing the audio recording…" : signal === "audio" ? "Recording · Audio detected" : signal === "quiet" ? "Recording · No audio detected yet. Play the video and check that its sound is on." : "Recording · Waiting for audio"}</p>}
      {feedback && <p role={feedback.error ? "alert" : "status"} aria-label="Tab capture feedback" className={`text-xs leading-relaxed ${feedback.error ? "text-error" : "text-on-surface-variant"}`}>{feedback.text}</p>}
      {preview && selectedFile === preview.file && phase === "idle" && <audio aria-label="Recorded tab audio preview" className="w-full" controls preload="metadata" src={preview.url} />}
    </section>
  );
}
