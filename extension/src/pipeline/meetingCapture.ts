import type { captureMeetingAudio, MeetingCaptureStatus } from "../../../components/live/capture";

type Owner = "widget" | "sidebar";
type Message = Record<string, unknown>;
interface Transport {
  port: browser.runtime.Port;
  session: string;
  cancelled: boolean;
  requests: Map<string, { resolve: (value: Response) => void; reject: (error: Error) => void; cleanup: () => void }>;
}
let current: Transport | null = null;
const aborted = () => new DOMException("Sharing was cancelled", "AbortError");
function decode(value: string): Uint8Array<ArrayBuffer> {
  const text = atob(value), bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
  return bytes;
}
async function encode(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer()); let value = "";
  for (let i = 0; i < bytes.length; i += 8192) value += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(value);
}
/** Same lifecycle as the website. Closing either extension view releases its lease. */
export function captureExtensionMeetingAudio(owner: Owner): typeof captureMeetingAudio {
  return (onChunk, onEnded, onError, signal, options = {}) => new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(aborted()); return; }
    const port = browser.runtime.connect({ name: "unmute-meeting" });
    const transport: Transport = { port, session: crypto.randomUUID(), cancelled: false, requests: new Map() };
    current = transport;
    let ready = false, stopping = false, stopped = false;
    let stopResolve: (() => void) | null = null;
    let stopPromise: Promise<void> | null = null;
    const timer = setTimeout(() => fail("Audio did not start. Allow the selected input, then try again."), 30000);
    const send = (data: Message) => { if (!transport.cancelled) port.postMessage({ ...data, captureSessionId: transport.session }); };
    function cancel() {
      if (transport.cancelled) return;
      send({ type: "CANCEL" }); transport.cancelled = true;
      clearTimeout(timer); signal?.removeEventListener("abort", cancel);
      transport.requests.forEach(request => { request.cleanup(); request.reject(aborted()); });
      transport.requests.clear(); stopResolve?.();
      if (!ready) reject(aborted());
      if (current === transport) current = null;
      port.disconnect();
    }
    function fail(message: string) {
      if (transport.cancelled) return;
      if (!ready) reject(new Error(message)); else onError(message);
      cancel();
    }
    function stop(): Promise<void> {
      if (stopPromise) return stopPromise;
      stopping = true;
      if (stopped || transport.cancelled) return Promise.resolve();
      stopPromise = new Promise<void>(done => {
        const timeout = setTimeout(() => { done(); fail("Audio did not stop cleanly. Reload the meeting before starting again."); }, 5000);
        stopResolve = () => { clearTimeout(timeout); done(); };
        send({ type: "STOP" });
      });
      return stopPromise;
    }
    port.onMessage.addListener((value: object) => {
      const message = value as Message;
      if (transport.cancelled || message.captureSessionId !== transport.session) return;
      if (message.type === "ERROR") { fail(typeof message.message === "string" ? message.message : "Audio capture could not continue."); return; }
      if (message.type === "LIVE_RESULT" && typeof message.requestId === "string") {
        const request = transport.requests.get(message.requestId);
        if (!request) return;
        transport.requests.delete(message.requestId); request.cleanup();
        request.resolve(new Response(typeof message.body === "string" ? message.body : "{}", { status: typeof message.status === "number" ? message.status : 502, headers: { "Content-Type": "application/json" } }));
      } else if (message.type === "INPUT_STATUS" && message.status && typeof message.status === "object") {
        options.onStatus?.(message.status as MeetingCaptureStatus);
      } else if (message.type === "AUDIO_CHUNK" && typeof message.audioBase64 === "string" && message.audioBase64.length <= 220000 && !stopped) {
        try { onChunk({ audio: new Blob([decode(message.audioBase64)], { type: "audio/wav" }), duration: Number(message.duration) }); }
        catch { fail("Audio could not be read. Start sharing again."); }
      } else if (message.type === "CAPTURE_STARTED") {
        clearTimeout(timer); ready = true;
        resolve({ stop, label: options.source === "microphone" ? "Your microphone" : options.includeMicrophone ? "Meeting audio + your microphone" : "Meeting audio" });
      } else if (message.type === "CAPTURE_STOPPED") {
        stopped = true; clearTimeout(timer); stopResolve?.();
        if (!ready) reject(new Error("Sharing stopped before audio was ready."));
        else if (!stopping) onEnded();
      }
    });
    port.onDisconnect.addListener(() => { if (!transport.cancelled) fail("The meeting connection closed. Reload the meeting and start again."); });
    signal?.addEventListener("abort", cancel, { once: true });
    send({ type: "START", owner, options: { source: options.source === "microphone" ? "microphone" : "tab", includeMicrophone: options.includeMicrophone === true } });
  });
}
/** Fixed privileged endpoint. No keys, arbitrary URLs, or provider calls in views. */
export async function requestExtensionLiveAudio(form: FormData, signal: AbortSignal): Promise<Response> {
  const transport = current;
  if (!transport || transport.cancelled || signal.aborted) throw aborted();
  const audio = form.get("audio");
  if (!(audio instanceof Blob) || audio.size < 46 || audio.size > 170000) throw new Error("The captured audio is invalid. Start sharing again.");
  const audioBase64 = await encode(audio);
  if (transport.cancelled || signal.aborted) throw aborted();
  const requestId = crypto.randomUUID();
  return new Promise((resolve, reject) => {
    const abort = () => {
      transport.requests.delete(requestId); signal.removeEventListener("abort", abort);
      if (!transport.cancelled) transport.port.postMessage({ type: "LIVE_CANCEL", requestId, captureSessionId: transport.session });
      reject(aborted());
    };
    signal.addEventListener("abort", abort, { once: true });
    transport.requests.set(requestId, { resolve, reject, cleanup: () => signal.removeEventListener("abort", abort) });
    transport.port.postMessage({ type: "LIVE_REQUEST", requestId, audioBase64, captureSessionId: transport.session });
  });
}

