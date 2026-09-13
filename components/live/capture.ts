import { encodeMonoWav, LIVE_CHUNK_SECONDS } from "../../lib/live-audio";

export interface MeetingChunk { audio: Blob; duration: number }
export interface MeetingCapture { stop: () => Promise<void>; label: string }
export interface MeetingCaptureStatus {
  state: "starting" | "receiving" | "silent" | "muted" | "suspended" | "stalled" | "stopped";
  /** Raw RMS, bounded to 0–1. Audio activity does not establish that speech is present. */
  level: number;
  receivedSeconds: number;
}
export interface MeetingCaptureOptions {
  source?: "tab" | "microphone";
  includeMicrophone?: boolean;
  onStatus?: (status: MeetingCaptureStatus) => void;
}

const abortError = () => new DOMException("Sharing was cancelled", "AbortError");

/** Called from the selected Start action; never opens a microphone implicitly. */
export async function captureMeetingAudio(
  onChunk: (chunk: MeetingChunk) => void,
  onEnded: () => void,
  onError: (message: string) => void,
  signal?: AbortSignal,
  options: MeetingCaptureOptions = {},
): Promise<MeetingCapture> {
  if (signal?.aborted) throw abortError();
  const microphoneOnly = options.source === "microphone";
  if (!window.AudioContext || !window.AudioWorkletNode ||
      (microphoneOnly ? !navigator.mediaDevices?.getUserMedia : !navigator.mediaDevices?.getDisplayMedia)) {
    throw new Error("Open Live meetings in desktop Chrome or Edge to capture the selected audio source.");
  }
  const streams: MediaStream[] = [];
  const sources: MediaStreamAudioSourceNode[] = [];
  const inputGains: GainNode[] = [];
  const lifecycle = new AbortController();
  // Unlock Web Audio in the original user gesture, before waiting for a picker.
  const context = new AudioContext({ sampleRate: 16_000 });
  void context.resume().catch(() => {});
  let worklet: AudioWorkletNode | undefined;
  let output: GainNode | undefined;
  let watchdog: ReturnType<typeof setInterval> | undefined;
  let flushDone: (() => void) | undefined;
  let stopping = false;
  let stopPromise: Promise<void> | undefined;
  let ready = false;
  let receivedSeconds = 0;
  let level = 0;
  let lastHeartbeat = performance.now();
  let hasInput = false;
  let resuming = false;

  function report(state: MeetingCaptureStatus["state"]) {
    options.onStatus?.({ state, level: state === "receiving" ? level : 0, receivedSeconds });
  }
  function audioTracks() { return streams.flatMap((stream) => stream.getAudioTracks()); }
  function reportCurrent() {
    if (stopping) return;
    if (context.state !== "running") return report("suspended");
    const tracks = audioTracks();
    if (tracks.length && tracks.every((track) => track.muted || !track.enabled)) return report("muted");
    if (performance.now() - lastHeartbeat > 3000) return report("stalled");
    report(hasInput && level > 0.00001 ? "receiving" : "silent");
  }
  function waitFor<T>(promise: Promise<T>, timeoutMs?: number, message?: string): Promise<T> {
    return new Promise((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const cleanup = () => { clearTimeout(timer); lifecycle.signal.removeEventListener("abort", aborted); };
      const aborted = () => { cleanup(); reject(abortError()); };
      if (lifecycle.signal.aborted) { void promise.catch(() => {}); return aborted(); }
      lifecycle.signal.addEventListener("abort", aborted, { once: true });
      if (timeoutMs) timer = setTimeout(() => { cleanup(); reject(new Error(message)); }, timeoutMs);
      promise.then((value) => { cleanup(); resolve(value); }, (error) => { cleanup(); reject(error); });
    });
  }
  async function own(promise: Promise<MediaStream>) {
    return waitFor(promise.then((stream) => {
      // A browser permission prompt can finish after navigation/cancellation.
      if (stopping || lifecycle.signal.aborted) {
        stream.getTracks().forEach((track) => track.stop());
        throw abortError();
      }
      streams.push(stream);
      stream.getTracks().forEach((track) => track.addEventListener("ended", ended, { once: true }));
      stream.getAudioTracks().forEach((track) => {
        track.addEventListener("mute", reportCurrent);
        track.addEventListener("unmute", reportCurrent);
      });
      return stream;
    }));
  }
  function ended() {
    if (stopping) return;
    // Release every owned source, including a microphone paired with a tab.
    void finish(ready);
    onEnded();
  }
  function abort() { void finish(false); }
  function stateChanged() {
    reportCurrent();
    // Browser interruptions can suspend processing while tracks remain live.
    if (ready && !stopping && context.state === "suspended" && !resuming) {
      resuming = true;
      void waitFor(context.resume(), 5000, "Audio processing stayed paused. Stop sharing and start again.")
        .catch((error) => { if (!stopping) { onError(error.message); void finish(false); } })
        .finally(() => { resuming = false; reportCurrent(); });
    }
  }
  function finish(flush: boolean): Promise<void> {
    if (stopPromise) return stopPromise;
    stopping = true;
    lifecycle.abort();
    signal?.removeEventListener("abort", abort);
    clearInterval(watchdog);
    context.removeEventListener("statechange", stateChanged);
    sources.forEach((source) => source.disconnect());
    for (const stream of streams) for (const track of stream.getTracks()) {
      track.removeEventListener("ended", ended);
      track.removeEventListener("mute", reportCurrent);
      track.removeEventListener("unmute", reportCurrent);
      track.stop();
    }
    stopPromise = (async () => {
      // Normal Stop preserves the last partial chunk; cancellation discards it.
      if (flush && worklet && context.state === "running") {
        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, 500);
          flushDone = () => { clearTimeout(timer); resolve(); };
          worklet!.port.postMessage("flush");
        });
      }
      if (worklet) {
        worklet.port.onmessage = null;
        worklet.onprocessorerror = null;
        worklet.disconnect();
        worklet.port.close();
      }
      inputGains.forEach((gain) => gain.disconnect());
      output?.disconnect();
      if (context.state !== "closed") await context.close().catch(() => {});
      report("stopped");
    })();
    return stopPromise;
  }

  signal?.addEventListener("abort", abort, { once: true });
  report("starting");
  try {
    let tab: MediaStream | undefined;
    if (!microphoneOnly) {
      tab = await own(navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" }, audio: true,
        selfBrowserSurface: "exclude", systemAudio: "exclude", surfaceSwitching: "exclude",
      } as DisplayMediaStreamOptions));
      if (tab.getVideoTracks()[0]?.getSettings().displaySurface !== "browser") {
        throw new Error("Choose your meeting from the browser tab section. Whole-screen and window sharing are not supported for live captions.");
      }
      if (!tab.getAudioTracks().length) {
        throw new Error("No tab audio was shared. Choose your meeting under the browser tab section and turn on Share tab audio. Use desktop Chrome or Edge.");
      }
    }
    if (microphoneOnly || options.includeMicrophone) {
      await own(navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false,
      }));
      if (!streams.at(-1)?.getAudioTracks().length) throw new Error("No microphone audio was available. Choose an available microphone and start again.");
    }
    await waitFor(context.resume(), 6000, "The browser could not start audio processing. Click Start again and allow audio.");
    await waitFor(context.audioWorklet.addModule("/live-audio-worklet.js"), 10000, "The audio recorder could not load. Refresh the page and start again.");
    if (stopping || lifecycle.signal.aborted) throw abortError();
    if (audioTracks().some((track) => track.readyState === "ended")) throw new Error("The selected audio source stopped before capture could start.");
    worklet = new AudioWorkletNode(context, "meeting-pcm", {
      processorOptions: { chunkSeconds: LIVE_CHUNK_SECONDS, statusIntervalSeconds: 0.25 },
    });
    worklet.port.onmessage = ({ data }) => {
      if (data.type === "flushed") { flushDone?.(); return; }
      if (data.type === "status") {
        if (stopping) return;
        lastHeartbeat = performance.now();
        hasInput = data.hasInput === true;
        level = typeof data.rms === "number" && Number.isFinite(data.rms) ? Math.min(1, Math.max(0, data.rms)) : 0;
        receivedSeconds = typeof data.receivedSeconds === "number" && Number.isFinite(data.receivedSeconds) ? Math.max(receivedSeconds, data.receivedSeconds) : receivedSeconds;
        reportCurrent();
        return;
      }
      if (data.type !== "chunk" || !(data.samples instanceof Float32Array)) return;
      const duration = data.samples.length / data.sampleRate;
      if (!Number.isFinite(duration) || duration < 0.15 || duration > LIVE_CHUNK_SECONDS + 0.01) return;
      onChunk({ audio: new Blob([encodeMonoWav(data.samples, data.sampleRate)], { type: "audio/wav" }), duration });
    };
    worklet.onprocessorerror = () => {
      if (stopping) return;
      onError("Audio capture stopped unexpectedly. Share the selected audio source again.");
      void finish(false);
    };
    output = context.createGain();
    output.gain.value = 0;
    worklet.connect(output).connect(context.destination);
    for (const stream of streams) {
      const source = context.createMediaStreamSource(new MediaStream(stream.getAudioTracks()));
      const gain = context.createGain();
      // Explicit tab+microphone mixing avoids doubling peak amplitude.
      gain.gain.value = 1 / streams.length;
      source.connect(gain).connect(worklet);
      sources.push(source);
      inputGains.push(gain);
    }
    lastHeartbeat = performance.now();
    ready = true;
    context.addEventListener("statechange", stateChanged);
    watchdog = setInterval(reportCurrent, 1000);
    const rawLabel = tab?.getVideoTracks()[0]?.label;
    const tabLabel = rawLabel && !/^(web-contents-media-stream|screen|window):/i.test(rawLabel) ? rawLabel : "Shared browser tab";
    return {
      stop: () => finish(true),
      label: microphoneOnly ? "Your microphone" : options.includeMicrophone ? `${tabLabel} + your microphone` : tabLabel,
    };
  } catch (error) {
    await finish(false);
    throw error;
  }
}

/** Existing callers retain tab-only behavior unless they explicitly include a microphone. */
export function captureMeetingTab(
  onChunk: (chunk: MeetingChunk) => void,
  onEnded: () => void,
  onError: (message: string) => void,
  signal?: AbortSignal,
  options: MeetingCaptureOptions = {},
): Promise<MeetingCapture> {
  return captureMeetingAudio(onChunk, onEnded, onError, signal, { ...options, source: "tab" });
}
