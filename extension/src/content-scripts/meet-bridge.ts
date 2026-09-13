const MARKER = "gesturesync";
let captureOwner: "widget" | "sidebar" | null = null;
let captureError: string | null = null;
let captureSessionId: string | null = null;
const publishOwner = () => window.postMessage({ marker: "unmute-widget-bridge", type: "CAPTURE_STATE", owner: captureOwner }, location.origin);
function injectPageHook() {
  const script = document.createElement("script");
  script.src = browser.runtime.getURL("dist/page-hook.js");
  script.onload = () => script.remove();
  (document.documentElement || document.head || document.body).appendChild(script);
}
window.addEventListener("message", (event: MessageEvent) => {
  if (event.source !== window || event.origin !== location.origin || !event.isTrusted) return;
  const data = event.data;
  if (!data || data.marker !== MARKER || !captureOwner || data.captureSessionId !== captureSessionId) return;
  if (!["AUDIO_CHUNK", "INPUT_STATUS", "CAPTURE_STARTED", "CAPTURE_STOPPED", "CAPTURE_ERROR"].includes(data.type)) return;
  // Only JSON-safe scalar/PCM transport crosses Firefox's page, content-script,
  // background and extension-frame realms. No cross-realm Blob instanceof.
  if (data.type === "AUDIO_CHUNK" && (typeof data.audioBase64 !== "string" || data.audioBase64.length > 220000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data.audioBase64))) return;
  const payload = JSON.parse(JSON.stringify(data));
  void browser.runtime.sendMessage({ ...payload, type: "UNMUTE_CAPTURE_EVENT", event: data.type, owner: captureOwner }).catch(() => {
    // The consumer disappeared; an orphan must not keep capturing microphones.
    window.postMessage({ marker: MARKER, type: "CANCEL_CAPTURE", captureSessionId }, location.origin);
  });
  if (data.type === "CAPTURE_ERROR") captureError = typeof data.message === "string" ? data.message.slice(0, 300) : "Meeting audio stopped. Start again.";
  if (data.type === "CAPTURE_STOPPED") captureOwner = null;
  publishOwner();
});
browser.runtime.onMessage.addListener((msg: Record<string, unknown>, sender) => {
  if (sender.id !== browser.runtime.id) return;
  if (msg.type === "WIDGET_CAPTURE_STATUS") return Promise.resolve({ owner: captureOwner, error: captureError, captureSessionId });
  if (!["MEETING_START_CAPTURE", "MEETING_STOP_CAPTURE", "MEETING_CANCEL_CAPTURE"].includes(String(msg.type))) return;
  if (msg.owner !== "widget" && msg.owner !== "sidebar") return Promise.reject(new Error("Unknown capture owner."));
  if (typeof msg.captureSessionId !== "string") return Promise.reject(new Error("Missing capture session."));
  if (msg.type === "MEETING_START_CAPTURE") {
    if (captureOwner) return Promise.reject(new Error(`Stop the active ${captureOwner} capture before starting again.`));
    captureOwner = msg.owner; captureSessionId = msg.captureSessionId; captureError = null;
    window.postMessage({ marker: MARKER, type: "START_CAPTURE", captureSessionId, options: msg.options,
      workletUrl: browser.runtime.getURL("dist/live-audio-worklet.js") }, location.origin);
  } else if (msg.owner === captureOwner && msg.captureSessionId === captureSessionId) {
    // Retain ownership until the last PCM and STOPPED acknowledgement arrive.
    window.postMessage({ marker: MARKER, type: msg.type === "MEETING_STOP_CAPTURE" ? "STOP_CAPTURE" : "CANCEL_CAPTURE", captureSessionId }, location.origin);
  }
  publishOwner();
  return Promise.resolve({ owner: captureOwner, captureSessionId });
});
injectPageHook();
export {};
