const MARKER = "gesturesync";

let audioCtx: AudioContext | null = null;
let destination: MediaStreamAudioDestinationNode | null = null;
let recorder: MediaRecorder | null = null;
const connectedTrackIds = new Set<string>();

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

function startRecording() {
  const { destination: dest } = ensureAudioGraph();
  if (recorder && recorder.state === "recording") return;

  recorder = new MediaRecorder(dest.stream, { mimeType: "audio/webm;codecs=opus" });
  recorder.ondataavailable = (e) => {
    if (e.data.size === 0) return;
    window.postMessage({ marker: MARKER, type: "AUDIO_CHUNK", blob: e.data }, "*");
  };
  recorder.start(4000);
  window.postMessage({ marker: MARKER, type: "CAPTURE_STARTED" }, "*");
}

function stopRecording() {
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

export {}; // force module scope — prevents top-level names colliding across content-script files