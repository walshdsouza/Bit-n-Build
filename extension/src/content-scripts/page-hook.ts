const MARKER = "gesturesync";

let audioCtx: AudioContext | null = null;
let destination: MediaStreamAudioDestinationNode | null = null;
let recorder: MediaRecorder | null = null;
let capturing = false;
let captureGeneration = 0;
const connectedTrackIds = new Set<string>();

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
  const NativePC = window.RTCPeerConnection as typeof RTCPeerConnection & {
    __gesturesyncPatched?: boolean;
  };
  if (!NativePC || NativePC.__gesturesyncPatched) return;

  const Patched = new Proxy(NativePC, {
    construct(target, args, newTarget) {
      const pc = Reflect.construct(target, args, newTarget) as RTCPeerConnection;
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
  Patched.__gesturesyncPatched = true;
  window.RTCPeerConnection = Patched;
}

function flushQueue(rec: MediaRecorder, queue: Blob[]) {
  if (queue.length === 0) return;
  const blob = new Blob(queue, { type: rec.mimeType });
  console.log("[GestureSync] FLUSHED AUDIO", {
    chunks: queue.length,
    bytes: blob.size,
    kb: (blob.size / 1024).toFixed(2),
    type: blob.type,
  });

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
function startNewRecorderCycle(generation: number) {
  const { destination: dest } = ensureAudioGraph();

  console.log("[GestureSync] CREATING RECORDER", {
    streamActive: dest.stream.active,
    tracks: dest.stream.getAudioTracks().map((track) => ({
      id: track.id,
      enabled: track.enabled,
      muted: track.muted,
      readyState: track.readyState,
    })),
  });

  // Each recorder owns its container fragments. A stopped recorder can
  // deliver its final event after a newer capture has already started.
  const queue: Blob[] = [];
  let queuedBytes = 0;

  const rec = new MediaRecorder(dest.stream, { mimeType: "audio/webm;codecs=opus" });
  recorder = rec;

  rec.onstart = () => {
    console.log("[GestureSync] RECORDER STARTED", {
      state: rec.state,
      mimeType: rec.mimeType,
    });
  };

  rec.ondataavailable = (e) => {
    if (e.data.size === 0) return;
    queue.push(e.data);
    queuedBytes += e.data.size;
    if (queuedBytes >= MAX_QUEUE_BYTES && rec.state === "recording") {
      rec.stop();
    }
  };

  rec.onstop = () => {
    clearTimeout(flushTimer);
    if (recorder === rec) recorder = null;
    // A rapid Stop → Start supersedes the old tail. It must neither feed the
    // new session nor create another recorder alongside the new one.
    if (generation !== captureGeneration) return;
    flushQueue(rec, queue);
    if (capturing) startNewRecorderCycle(generation);
  };

  rec.start(TIMESLICE_MS);

  const flushTimer = setTimeout(() => {
    if (rec.state === "recording") rec.stop();
  }, FLUSH_MS);
}

function startRecording() {
  if (capturing) return;
  capturing = true;
  window.postMessage({ marker: MARKER, type: "CAPTURE_STARTED" }, "*");
  startNewRecorderCycle(++captureGeneration);
}

function stopRecording() {
  capturing = false;
  const rec = recorder;
  recorder = null;
  if (rec && rec.state !== "inactive") rec.stop();
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

export {}; // force module scope — prevents top-level names colliding across content-script files
