"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Captions, Mic, MonitorUp, Radio, Square, Video } from "lucide-react";
import NexaAvatar from "@/components/player/NexaAvatar";
import type { SignPlan } from "@/lib/types";
import { captureMeetingAudio, type MeetingCapture, type MeetingCaptureStatus, type MeetingChunk } from "./capture";
import { LiveChunkQueue } from "./chunk-queue";

interface Caption { id: number; text: string; offset: number }
interface Playback extends Caption { plan: SignPlan }
interface PendingChunk extends MeetingChunk { offset: number; id: number }

function clock(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}

function friendlyError(error: unknown) {
  if (error instanceof DOMException && error.name === "NotAllowedError") return "Audio access was cancelled or blocked. Allow access to your selected source, then start live captions again.";
  if (error instanceof DOMException && error.name === "NotFoundError") return "No microphone was found. Connect one or choose Meeting tab instead.";
  return error instanceof Error ? error.message : "Could not connect the selected audio source. Try desktop Chrome or Edge.";
}

export default function LiveMeeting() {
  const [starting, setStarting] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [started, setStarted] = useState(false);
  const [source, setSource] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(0);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [playback, setPlayback] = useState<Playback[]>([]);
  const [playhead, setPlayhead] = useState({ id: -1, time: 0 });
  const [input, setInput] = useState<"tab" | "microphone">("tab");
  const [includeMicrophone, setIncludeMicrophone] = useState(false);
  const [audioStatus, setAudioStatus] = useState<MeetingCaptureStatus | null>(null);
  const [requestStarted, setRequestStarted] = useState<number | null>(null);
  const [requestSeconds, setRequestSeconds] = useState(0);
  const [noSpeech, setNoSpeech] = useState(false);
  const [avatarReady, setAvatarReady] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [avatarAttempt, setAvatarAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const captureRef = useRef<MeetingCapture | null>(null);
  const captureControllerRef = useRef<AbortController | null>(null);
  const queueRef = useRef<LiveChunkQueue<PendingChunk> | null>(null);
  const generationRef = useRef(0);
  const playbackCountRef = useRef(0);
  const playbackClockRef = useRef({ id: -1, elapsed: 0 });
  const endRef = useRef<HTMLDivElement>(null);
  const active = playback[0];

  const stop = useCallback(async () => {
    const capture = captureRef.current;
    if (!capture) return;
    captureRef.current = null;
    setCapturing(false);
    setFinishing(true);
    try { await capture.stop(); }
    finally { setFinishing(false); }
  }, []);

  const avatarError = useCallback((message: string) => {
    setAvatarFailed(true);
    setError(`The avatar could not load: ${message}. Start again to reload it.`);
    captureControllerRef.current?.abort();
    queueRef.current?.close();
    void stop();
  }, [stop]);

  useEffect(() => () => {
    generationRef.current++;
    captureControllerRef.current?.abort();
    queueRef.current?.close();
    void captureRef.current?.stop();
  }, []);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (requestStarted === null) return;
    const timer = setInterval(() => setRequestSeconds(Math.floor((Date.now() - requestStarted) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [requestStarted]);

  useEffect(() => {
    if (!active) return;
    const clock = playbackClockRef.current;
    if (clock.id !== active.id) { clock.id = active.id; clock.elapsed = 0; }
    // Do not consume a sign before the model is ready or while it is hidden.
    if (!avatarReady || !visible) return;
    let previous = performance.now();
    let frame = 0;
    const tick = () => {
      const now = performance.now();
      clock.elapsed += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      const time = Math.min(clock.elapsed, active.plan.duration);
      setPlayhead({ id: active.id, time });
      if (time < active.plan.duration) frame = requestAnimationFrame(tick);
      else {
        playbackCountRef.current--;
        setPlayback((items) => items.slice(1));
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, avatarReady, visible]);

  useEffect(() => {
    // Scroll just this caption panel; never move the page or keyboard focus.
    const panel = endRef.current?.parentElement;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [captions]);

  async function start() {
    const generation = ++generationRef.current;
    captureControllerRef.current?.abort();
    const captureController = new AbortController();
    captureControllerRef.current = captureController;
    queueRef.current?.close();
    setStarting(true);
    setError(null);
    setCaptions([]);
    setPlayback([]);
    setPlayhead({ id: -1, time: 0 });
    setAudioStatus(null);
    setRequestStarted(null);
    setRequestSeconds(0);
    setNoSpeech(false);
    if (avatarFailed) { setAvatarFailed(false); setAvatarReady(false); setAvatarAttempt((attempt) => attempt + 1); }
    playbackClockRef.current = { id: -1, elapsed: 0 };
    playbackCountRef.current = 0;
    let offset = 0;
    let id = 0;
    let accepting = true;
    const fail = (failure: unknown) => {
      if (generation !== generationRef.current) return;
      accepting = false;
      queueRef.current?.close();
      captureController.abort();
      setError(friendlyError(failure));
      void stop();
    };
    const queue = new LiveChunkQueue<PendingChunk>(async (chunk, signal) => {
      const form = new FormData();
      form.append("audio", chunk.audio, `meeting-${chunk.id}.wav`);
      const timeout = new AbortController();
      const timer = setTimeout(() => timeout.abort(), 25_000);
      setRequestStarted(Date.now());
      setRequestSeconds(0);
      let response: Response;
      let result;
      try {
        response = await fetch("/api/live", {
          method: "POST", body: form,
          signal: AbortSignal.any([signal, timeout.signal]),
        });
        result = await response.json();
      } catch (failure) {
        if (timeout.signal.aborted && !signal.aborted) throw new Error("Transcription did not respond in time. Sharing has stopped. Start again to reconnect.");
        if (failure instanceof TypeError) throw new Error("The transcription connection was lost. Check your internet connection, then start again.");
        if (failure instanceof SyntaxError) throw new Error("The transcription service returned an unreadable response. Start again to reconnect.");
        throw failure;
      } finally {
        clearTimeout(timer);
        if (generation === generationRef.current) setRequestStarted(null);
      }
      if (!response.ok) throw new Error(result?.error || `Live transcription failed (${response.status}). Please try again.`);
      if (!result || typeof result.speech !== "boolean") throw new Error("Live transcription returned an invalid response. Share the tab again.");
      if (generation !== generationRef.current || signal.aborted) return;
      setNoSpeech(!result.speech);
      if (!result.speech) return;
      if (!Array.isArray(result.plan?.items) || result.plan.lang !== "ASL" || !Number.isFinite(result.plan.duration) || result.plan.duration <= 0) {
        throw new Error("Speech was received, but signing could not be prepared. Start again to reconnect.");
      }
      const caption = { id: chunk.id, offset: chunk.offset, text: String(result.text) };
      setCaptions((items) => [...items, caption].slice(-100));
      // A standalone filler/conjunction can have captions but no ASL content.
      // Keep listening instead of terminating a valid conversation.
      if (!result.plan.items.length) return;
      playbackCountRef.current++;
      setPlayback((items) => [...items, { ...caption, plan: result.plan }]);
      if (playbackCountRef.current >= 8) {
        setError("Signing is catching up with the conversation. Sharing has stopped; queued captions will finish below.");
        void stop();
      }
    }, (count) => {
      if (generation === generationRef.current) setPending(count);
    }, fail);
    queueRef.current = queue;
    try {
      const capture = await captureMeetingAudio((chunk) => {
        if (generation !== generationRef.current || !accepting) return;
        const next = { ...chunk, offset, id: id++ };
        offset += chunk.duration;
        if (!queue.push(next)) {
          setError("Transcription is taking longer than the conversation. Sharing has stopped; queued captions will finish below.");
          void stop();
        }
      }, () => { void stop(); }, (message) => fail(new Error(message)), captureController.signal, {
        source: input,
        includeMicrophone: input === "tab" && includeMicrophone,
        onStatus: (status) => { if (generation === generationRef.current) setAudioStatus(status); },
      });
      if (generation !== generationRef.current || !accepting || captureController.signal.aborted) { await capture.stop(); return; }
      captureRef.current = capture;
      setSource(capture.label);
      setCapturing(true);
      setStarted(true);
    } catch (failure) {
      queue.close();
      if (generation === generationRef.current && accepting && !captureController.signal.aborted) setError(friendlyError(failure));
    } finally {
      if (generation === generationRef.current) setStarting(false);
    }
  }

  const busy = starting || finishing || pending > 0;
  const silent = capturing && (audioStatus?.state === "silent" || audioStatus?.state === "muted");
  const captureIssue = capturing && (audioStatus?.state === "suspended" || audioStatus?.state === "stalled");
  const meterLevel = audioStatus?.level ? Math.round(Math.max(0, Math.min(1, (20 * Math.log10(audioStatus.level) + 80) / 80)) * 100) : 0;
  const status = capturing ? (pending ? (requestSeconds >= 8 ? "Transcription is taking longer than usual…" : "Turning speech into captions…") : silent ? "No audio detected" : noSpeech ? "Audio received; waiting for clear speech" : "Listening for speech")
    : finishing || pending ? "Finishing captured audio" : active ? "Finishing ASL playback" : started ? "Sharing stopped" : "Ready to connect";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Conversation, made visible</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">Live meetings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">Turn speech from your meeting or your microphone into English captions and an ASL avatar.</p>
        </div>
        <span className="self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">ASL · American Sign Language</span>
      </header>

      <section aria-label="Share meeting audio" className="rounded-2xl border border-outline-variant bg-surface-container p-5 sm:p-6">
        <fieldset disabled={capturing || busy} className="mb-5 space-y-3 disabled:opacity-70">
          <legend className="mb-3 font-display text-lg font-semibold">What should UNMUTE listen to?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${input === "tab" ? "border-primary bg-primary/10" : "border-outline-variant"}`}>
              <input type="radio" name="audio-source" value="tab" checked={input === "tab"} onChange={() => setInput("tab")} className="mt-1 accent-primary" />
              <span><span className="block font-semibold">Meeting tab</span><span className="mt-1 block text-sm text-on-surface-variant">Hear other participants from a browser tab.</span></span>
            </label>
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${input === "microphone" ? "border-primary bg-primary/10" : "border-outline-variant"}`}>
              <input type="radio" name="audio-source" value="microphone" checked={input === "microphone"} onChange={() => setInput("microphone")} className="mt-1 accent-primary" />
              <span><span className="block font-semibold">My microphone</span><span className="mt-1 block text-sm text-on-surface-variant">Translate your voice, or try it without a meeting.</span></span>
            </label>
          </div>
          {input === "tab" && <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={includeMicrophone} onChange={(event) => setIncludeMicrophone(event.target.checked)} className="h-4 w-4 accent-primary" /> Include my microphone so my own words are translated too</label>}
        </fieldset>
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex gap-3">
            <MonitorUp aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-display text-lg font-semibold">{input === "microphone" ? "Connect your microphone" : "Connect your meeting tab"}</h2>
              <p id="share-instructions" className="mt-1 max-w-2xl text-sm leading-6 text-on-surface-variant">{input === "microphone" ? "Select Start live captions, allow microphone access, then speak. No meeting tab is needed." : <>In desktop Chrome or Edge, choose your meeting in the <strong className="text-on-surface">browser tab</strong> section and enable <strong className="text-on-surface">Share tab audio</strong>. {includeMicrophone ? "Allow microphone access as well to include your own voice." : "Your own microphone is excluded unless you select it above."}</>}</p>
            </div>
          </div>
          {capturing ? (
            <button onClick={() => void stop()} className="flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-error px-5 font-semibold text-on-error transition-colors hover:bg-error/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <Square aria-hidden="true" size={18} /> Stop sharing
            </button>
          ) : (
            <button onClick={() => void start()} disabled={busy} aria-describedby="share-instructions" className="flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              {input === "microphone" ? <Mic aria-hidden="true" size={19} /> : <MonitorUp aria-hidden="true" size={19} />} {starting ? "Allow audio access…" : finishing || pending ? "Finishing captions…" : "Start live captions"}
            </button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-outline-variant pt-4 text-xs text-on-surface-variant">
          <span className="flex items-center gap-2"><Video aria-hidden="true" size={15} /> You choose which audio is shared</span>
          <span>Audio is sent for transcription; screen video is never sent.</span>
          <span>Only start with permission to transcribe the conversation.</span>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)]">
        <section aria-label="Live ASL avatar" className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center justify-between gap-2 border-b border-outline-variant px-5 py-4">
            <h2 className="font-display font-semibold">ASL interpretation</h2>
            <span className="flex items-center gap-2 text-xs text-on-surface-variant"><Radio aria-hidden="true" size={15} className={capturing ? "text-primary" : "text-outline"} /> {capturing ? "Sharing audio" : "Not sharing"}</span>
          </div>
          <div className="h-[380px] sm:h-[470px]">
            <NexaAvatar key={avatarAttempt} plan={active?.plan ?? null} currentTime={active && playhead.id === active.id ? playhead.time : 0} playing={Boolean(active) && avatarReady && visible} label={active ? undefined : "Ready for conversation"} onReady={setAvatarReady} onError={avatarError} />
          </div>
          <div className="min-h-24 border-t border-outline-variant bg-surface-container px-5 py-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">Now signing</p>
            <p data-testid="live-current-caption" className="text-sm leading-6 text-on-surface">{active?.text || (input === "microphone" ? "Speak into your microphone to start signing." : "Speech from your selected audio will appear here.")}</p>
            {active && !avatarReady && <p className="mt-2 text-xs text-primary">Your signs are saved while the avatar loads.</p>}
          </div>
        </section>

        <section aria-labelledby="live-captions-heading" className="flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
          <div className="border-b border-outline-variant p-5">
            <h2 id="live-captions-heading" className="flex items-center gap-2 font-display font-semibold"><Captions aria-hidden="true" size={20} className="text-primary" /> Live captions</h2>
            <p role="status" data-testid="live-status" className="mt-2 text-sm text-on-surface-variant">{error ? "Needs attention" : captureIssue ? "Audio capture needs attention" : status}</p>
            {capturing && <div className="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
              <div aria-label="Input audio level" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={meterLevel} className="h-2 w-24 overflow-hidden rounded-full bg-surface-container-highest"><div className="h-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${meterLevel}%` }} /></div>
              <span>{audioStatus?.state === "receiving" ? "Audio is reaching UNMUTE" : captureIssue ? "Audio paused" : "Waiting for audio"}</span>
            </div>}
            {silent && <p className="mt-3 text-sm leading-6 text-primary">{input === "microphone" ? "We cannot hear your microphone yet. Check that it is unmuted and speak near it." : includeMicrophone ? "No audio is arriving. Check your microphone and the shared tab's sound." : "We cannot hear the meeting tab yet. To translate your own voice, stop sharing and choose My microphone or Include my microphone."}</p>}
            {captureIssue && <p className="mt-3 text-sm leading-6 text-error">Your browser has paused the audio connection. Stop sharing and start again to reconnect.</p>}
            {error && <div role="alert" aria-label="Live meeting feedback" className="mt-4 rounded-xl border border-error/40 bg-error/10 p-4 text-sm leading-6 text-error">{error}{!capturing && !busy && <button onClick={() => void start()} className="mt-3 block min-h-11 cursor-pointer rounded-lg border border-error/40 px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Start again</button>}</div>}
          </div>
          <div role="log" aria-label="Meeting captions" aria-live="polite" aria-relevant="additions" className="max-h-[440px] min-h-60 flex-1 space-y-4 overflow-y-auto p-5">
            {captions.length ? captions.map((caption) => (
              <div key={caption.id} className="flex gap-3">
                <span className="pt-1 font-mono text-xs text-primary">{clock(caption.offset)}</span>
                <p className="text-sm leading-6 text-on-surface">{caption.text}</p>
              </div>
            )) : (
              <div className="flex h-full min-h-52 flex-col items-center justify-center text-center">
                <Captions aria-hidden="true" className="mb-4 h-10 w-10 text-outline" />
                <p className="font-medium text-on-surface">{capturing ? (pending ? "Preparing your first captions…" : "Listening for your first words…") : "A place for every word"}</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-on-surface-variant">{capturing ? "After a few seconds of speech, captions appear here and the avatar starts signing. Silence does not generate signs." : "Choose your audio source and start live captions."}</p>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="border-t border-outline-variant p-5 text-xs leading-5 text-on-surface-variant">
            <p>Expect a short delay while speech becomes captions and signs. Signing pauses when this tab is hidden and resumes when you return.</p>
            {source && <p className="mt-2 truncate" title={source}>Source: {source}</p>}
          </div>
        </section>
      </div>
      <p className="text-xs leading-5 text-on-surface-variant">Only your selected audio sources are captured, after you allow access. Stop sharing releases the tab and microphone. Recent captions stay on this page until you start again or leave.</p>
    </div>
  );
}
