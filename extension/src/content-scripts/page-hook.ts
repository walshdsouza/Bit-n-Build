const MARKER = "gesturesync";

let audioCtx: AudioContext | null = null;
let destination: MediaStreamAudioDestinationNode | null = null;
let recorder: MediaRecorder | null = null;
let capturing = false;
const connectedTrackIds = new Set<string>();

// Chunks collected since the last flush. A MediaRecorder only puts container
// header info in its very first chunk (per the W3C spec, only the FULL
// concatenation since start() is guaranteed playable) — so this queue can
// only ever be flushed by cleanly stop()ping the recorder, never by slicing
// out part of it or reusing it across a flush.
let queue: Blob[] = [];
let queuedBytes = 0;

// Primary trigger: flush every ~8s so segments stay close to sentence-length
// without too much delay. Tune later; correctness matters more than latency
// right now.
const FLUSH_MS = 8000;
// Safety-net trigger: Whisper providers' file-size limits are tens of MB, far
// above what 8s of Opus audio produces, but this caps runaway growth if a
// stop() is ever delayed (e.g. a suspended background tab).
const MAX_QUEUE_BYTES = 4 * 1024 * 1024;
const TIMESLICE_MS = 1000; // how often we get a chance to check the size cap

function ensureAudioGraph() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    destination = audioCtx.createMediaStreamDestination();
  }
  return { audioCtx: audioCtx!, destination: destination! };
}

function patchRTCPeerConnection() {
  const NativePC = window.RTCPeerConnection;
  if (!NativePC || (NativePC as any).__gesturesyncPatched) return;

  const Patched = new Proxy(NativePC, {
    construct(target, args) {
      const pc: RTCPeerConnection = new (target as any)(...args);
      pc.addEventListener("track", (event: RTCTrackEvent) => {
        const track = event.track;
        if (track.kind !== "audio" || connectedTrackIds.has(track.id)) return;
        connectedTrackIds.add(track.id);

        const { audioCtx: ctx, destination: dest } = ensureAudioGraph();
        const remoteStream = new MediaStream([track]);
        const source = ctx.createMediaStreamSource(remoteStream);
        source.connect(dest);

        track.addEventListener("ended", () => {
          connectedTrackIds.delete(track.id);
          source.disconnect();
        });
      });
      return pc;
    },
  });
  (Patched as any).__gesturesyncPatched = true;
  window.RTCPeerConnection = Patched as unknown as typeof RTCPeerConnection;
}

function flushQueue(rec: MediaRecorder) {
  if (queue.length === 0) return;
  const blob = new Blob(queue, { type: rec.mimeType });
  queue = [];
  queuedBytes = 0;
  window.postMessage({ marker: MARKER, type: "AUDIO_CHUNK", blob }, "*");
}

/**
 * MediaRecorder's timeslice fires ondataavailable periodically, but per the
 * W3C spec, only the FULL concatenation of chunks since start() is
 * guaranteed playable — an individual mid-stream chunk lacks the container
 * header the first chunk carries, so providers correctly reject it as not a
 * valid media file. So this queue is only ever flushed by cleanly stop()ping
 * the recorder (never by slicing out part of it), which finalizes the
 * container and delivers everything queued as one complete file — then a
 * fresh recorder starts immediately for the next cycle.
 */
function startNewRecorderCycle() {
  const { destination: dest } = ensureAudioGraph();
  queue = [];
  queuedBytes = 0;

  const rec = new MediaRecorder(dest.stream, { mimeType: "audio/webm;codecs=opus" });
  recorder = rec;

  rec.ondataavailable = (e) => {
    if (e.data.size === 0) return;
    queue.push(e.data);
    queuedBytes += e.data.size;
    if (queuedBytes >= MAX_QUEUE_BYTES && rec.state === "recording") {
      rec.stop();
    }
  };

  rec.onstop = () => {
    flushQueue(rec);
    if (capturing) startNewRecorderCycle();
  };

  rec.start(TIMESLICE_MS);

  setTimeout(() => {
    if (rec.state === "recording") rec.stop();
  }, FLUSH_MS);
}

function startRecording() {
  if (capturing) return;
  capturing = true;
  window.postMessage({ marker: MARKER, type: "CAPTURE_STARTED" }, "*");
  startNewRecorderCycle();
}

function stopRecording() {
  capturing = false;
  recorder?.stop();
  recorder = null;
  window.postMessage({ marker: MARKER, type: "CAPTURE_STOPPED" }, "*");
}

window.addEventListener("message", (event: MessageEvent) => {
  if (event.source !== window) return;
  const data = event.data;
  if (!data || data.marker !== MARKER) return;
  if (data.type === "START_CAPTURE") startRecording();
  if (data.type === "STOP_CAPTURE") stopRecording();
});

patchRTCPeerConnection();

export {};