import { encodeMonoWav, LIVE_CHUNK_SECONDS } from "../../../lib/live-audio";
const MARKER = "gesturesync";
const remoteTracks = new Map<string, MediaStreamTrack>();
const connections = new Set<RTCPeerConnection>();
type InputState = "starting" | "receiving" | "silent" | "muted" | "suspended" | "stalled" | "stopped";
interface CaptureOptions { source?: "tab" | "microphone"; includeMicrophone?: boolean }
interface ActiveCapture {
  id: string; context: AudioContext;
  sources: Map<string, { source: MediaStreamAudioSourceNode; gain: GainNode; track: MediaStreamTrack; cleanup: () => void }>;
  microphones: MediaStreamTrack[]; worklet: AudioWorkletNode | null; output: GainNode | null;
  watchdog: ReturnType<typeof setInterval> | null; stopping: boolean; flush: boolean; ready: boolean;
  lastHeartbeat: number; receivedSeconds: number; level: number; hasInput: boolean; options: CaptureOptions;
  finish: Promise<void> | null; flushed: (() => void) | null;
}
let active: ActiveCapture | null = null;
const post = (session: ActiveCapture, type: string, fields: Record<string, unknown> = {}) => {
  window.postMessage({ marker: MARKER, type, captureSessionId: session.id, ...fields }, location.origin);
};
function base64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer); let text = "";
  for (let at = 0; at < bytes.length; at += 8192) text += String.fromCharCode(...bytes.subarray(at, at + 8192));
  return btoa(text);
}
// Keep the hardware/WebRTC graph rate, then encode real resampled 16 kHz PCM.
function pcm16k(samples: Float32Array, rate: number): Float32Array {
  if (rate === 16000) return samples;
  const ratio = rate / 16000, output = new Float32Array(Math.round(samples.length / ratio));
  for (let i = 0; i < output.length; i++) {
    const start = i * ratio, end = Math.min(samples.length, (i + 1) * ratio);
    let total = 0, weight = 0;
    for (let source = Math.floor(start); source < Math.ceil(end); source++) {
      const amount = Math.max(0, Math.min(end, source + 1) - Math.max(start, source));
      total += (samples[source] || 0) * amount; weight += amount;
    }
    output[i] = weight ? total / weight : 0;
  }
  return output;
}
function report(session: ActiveCapture, forced?: InputState) {
  if (session !== active && forced !== "stopped") return;
  const tracks = [...session.sources.values()].map(input => input.track);
  const state = forced ?? (session.context.state !== "running" ? "suspended"
    : tracks.length && tracks.every(track => track.readyState === "ended" || !track.enabled || track.muted) ? "muted"
    : performance.now() - session.lastHeartbeat > 3000 ? "stalled"
    : session.hasInput && session.level > .00001 ? "receiving" : "silent");
  post(session, "INPUT_STATUS", { status: { state, level: state === "receiving" ? session.level : 0, receivedSeconds: session.receivedSeconds } });
}
function connectTrack(session: ActiveCapture, track: MediaStreamTrack) {
  if (session.stopping || !session.worklet || track.kind !== "audio" || track.readyState === "ended" || session.sources.has(track.id)) return;
  const source = session.context.createMediaStreamSource(new MediaStream([track])), gain = session.context.createGain();
  source.connect(gain).connect(session.worklet);
  const changed = () => report(session);
  const ended = () => {
    source.disconnect(); gain.disconnect(); session.sources.delete(track.id);
    cleanup(); session.sources.forEach(input => { input.gain.gain.value = 1 / session.sources.size; });
    if (session.microphones.includes(track) && !session.stopping) void finish(session, true).then(() => post(session, "SOURCE_ENDED"));
    else report(session);
  };
  const cleanup = () => { track.removeEventListener("mute", changed); track.removeEventListener("unmute", changed); track.removeEventListener("ended", ended); };
  session.sources.set(track.id, { source, gain, track, cleanup });
  session.sources.forEach(input => { input.gain.gain.value = 1 / session.sources.size; });
  track.addEventListener("mute", changed); track.addEventListener("unmute", changed); track.addEventListener("ended", ended, { once: true });
}
function remember(track: MediaStreamTrack) {
  if (track.kind !== "audio" || remoteTracks.has(track.id)) return;
  remoteTracks.set(track.id, track);
  track.addEventListener("ended", () => remoteTracks.delete(track.id), { once: true });
  if (active && active.options.source !== "microphone") connectTrack(active, track);
}
function patchRTCPeerConnection() {
  const Native = window.RTCPeerConnection as typeof RTCPeerConnection & { __gesturesyncPatched?: boolean };
  if (!Native || Native.__gesturesyncPatched) return;
  const Patched = new Proxy(Native, { construct(target, args, newTarget) {
    const connection = Reflect.construct(target, args, newTarget) as RTCPeerConnection;
    connections.add(connection); connection.addEventListener("track", event => remember(event.track));
    connection.addEventListener("connectionstatechange", () => { if (connection.connectionState === "closed") connections.delete(connection); });
    return connection;
  } });
  Patched.__gesturesyncPatched = true; window.RTCPeerConnection = Patched;
}
function finish(session: ActiveCapture, flush: boolean): Promise<void> {
  if (session.finish) return session.finish;
  session.stopping = true; session.flush = flush;
  if (session.watchdog) clearInterval(session.watchdog);
  session.sources.forEach(input => { input.cleanup(); input.source.disconnect(); input.gain.disconnect(); });
  session.microphones.forEach(track => track.stop());
  session.finish = (async () => {
    if (flush && session.ready && session.worklet && session.context.state === "running") {
      await new Promise<void>(resolve => {
        const timeout = setTimeout(resolve, 600);
        session.flushed = () => { clearTimeout(timeout); resolve(); };
        session.worklet!.port.postMessage("flush");
      });
    }
    if (session.worklet) {
      session.worklet.port.onmessage = null; session.worklet.onprocessorerror = null;
      session.worklet.disconnect(); session.worklet.port.close();
    }
    session.output?.disconnect();
    if (session.context.state !== "closed") await session.context.close().catch(() => {});
    report(session, "stopped");
    // A final WAV is sent before this ack; the bridge retains its owner to drain it.
    post(session, "CAPTURE_STOPPED", { cancelled: !flush });
    if (active === session) active = null;
  })();
  return session.finish;
}
async function start(id: string, options: CaptureOptions, workletUrl: string) {
  if (active) { if (active.id === id && !active.stopping) return; await finish(active, false); }
  const session: ActiveCapture = { id, context: new AudioContext(), sources: new Map(), microphones: [], worklet: null, output: null, watchdog: null,
    stopping: false, flush: false, ready: false, lastHeartbeat: performance.now(), receivedSeconds: 0, level: 0, hasInput: false, options, finish: null, flushed: null };
  active = session; report(session, "starting");
  try {
    if (options.source === "microphone" || options.includeMicrophone) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      if (session.stopping || active !== session) { stream.getTracks().forEach(track => track.stop()); return; }
      session.microphones = stream.getAudioTracks();
      if (!session.microphones.length) throw new Error("No microphone was available. Select an input and try again.");
    }
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try { await Promise.race([session.context.resume(), new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error("Audio is paused. Click in your meeting tab, then start again.")), 6000); })]); }
    finally { clearTimeout(timeout); }
    if (session.stopping || active !== session) return;
    if (session.context.state !== "running") throw new Error("Audio is paused. Click in your meeting tab, then start again.");
    await session.context.audioWorklet.addModule(workletUrl);
    if (session.stopping || active !== session) return;
    session.worklet = new AudioWorkletNode(session.context, "meeting-pcm", { processorOptions: { chunkSeconds: LIVE_CHUNK_SECONDS, statusIntervalSeconds: .25 } });
    session.worklet.port.onmessage = ({ data }) => {
      if (active !== session) return;
      if (data?.type === "flushed") { session.flushed?.(); return; }
      if (session.stopping && !session.flush) return;
      if (data?.type === "status") {
        session.lastHeartbeat = performance.now(); session.hasInput = data.hasInput === true;
        session.level = Number.isFinite(data.rms) ? Math.max(0, Math.min(1, data.rms)) : 0;
        session.receivedSeconds = Number.isFinite(data.receivedSeconds) ? Math.max(session.receivedSeconds, data.receivedSeconds) : session.receivedSeconds;
        if (!session.stopping) report(session);
      } else if (data?.type === "chunk" && data.samples instanceof Float32Array && Number.isFinite(data.sampleRate)) {
        const duration = data.samples.length / data.sampleRate;
        if (duration < .15 || duration > LIVE_CHUNK_SECONDS + .02) return;
        const samples = pcm16k(data.samples, data.sampleRate);
        post(session, "AUDIO_CHUNK", { audioBase64: base64(encodeMonoWav(samples, 16000)), duration: samples.length / 16000, mimeType: "audio/wav" });
      }
    };
    session.worklet.onprocessorerror = () => {
      if (session.stopping) return;
      post(session, "CAPTURE_ERROR", { message: "Audio processing stopped. Start sharing again." }); void finish(session, false);
    };
    session.output = session.context.createGain(); session.output.gain.value = 0;
    session.worklet.connect(session.output).connect(session.context.destination);
    if (options.source !== "microphone") {
      connections.forEach(connection => connection.getReceivers().forEach(receiver => remember(receiver.track)));
      remoteTracks.forEach(track => connectTrack(session, track));
    }
    session.microphones.forEach(track => connectTrack(session, track));
    session.ready = true;
    session.context.addEventListener("statechange", () => report(session));
    session.watchdog = setInterval(() => report(session), 1000);
    post(session, "CAPTURE_STARTED");
  } catch (error) {
    if (session.stopping || active !== session) return;
    post(session, "CAPTURE_ERROR", { message: error instanceof Error ? error.message : "Meeting audio could not start. Reload the meeting and try again." });
    await finish(session, false);
  }
}
window.addEventListener("message", (event: MessageEvent) => {
  if (event.source !== window || event.origin !== location.origin) return;
  const data = event.data;
  if (!data || data.marker !== MARKER || typeof data.captureSessionId !== "string") return;
  if (data.type === "START_CAPTURE" && typeof data.workletUrl === "string") void start(data.captureSessionId, {
    source: data.options?.source === "microphone" ? "microphone" : "tab", includeMicrophone: data.options?.includeMicrophone === true,
  }, data.workletUrl);
  if ((data.type === "STOP_CAPTURE" || data.type === "CANCEL_CAPTURE") && active && active.id === data.captureSessionId) void finish(active, data.type === "STOP_CAPTURE");
});
window.addEventListener("pagehide", () => { if (active) void finish(active, false); });
patchRTCPeerConnection();
