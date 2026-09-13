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
  if (event.source !== window || event.origin !== location.origin) return;
  const data = event.data;
  if (!data || data.marker !== MARKER) return;
  if (captureSessionId && data.captureSessionId !== captureSessionId) return;
  if (data.type === "CAPTURE_ERROR") {
    captureOwner = null;
    captureError = "Meeting audio could not start. Click Start again, or reload and rejoin this meeting.";
    publishOwner();
    return;
  }
  if (data.type === "AUDIO_CHUNK" || data.type === "CAPTURE_STARTED" || data.type === "CAPTURE_STOPPED") {
    if (data.type === "AUDIO_CHUNK" && !captureOwner) return;
    if (captureOwner === "widget") {
      if (data.type === "AUDIO_CHUNK" && data.blob instanceof Blob && data.blob.size > 0 && data.blob.size <= 4 * 1024 * 1024) {
        window.postMessage({ marker: "unmute-widget-bridge", type: "AUDIO_CHUNK", blob: data.blob }, location.origin);
      }
      if (data.type === "CAPTURE_STOPPED") captureOwner = null;
      publishOwner();
      return;
    }
    browser.runtime.sendMessage(data).catch(() => {
      /* no listener yet (sidebar closed) — drop the chunk */
    });
    if (data.type === "CAPTURE_STOPPED") { captureOwner = null; publishOwner(); }
  }
});

browser.runtime.onMessage.addListener((msg: { type: string; captureSessionId?: string | null }, sender) => {
  if (sender.id !== browser.runtime.id) return;
  if (msg.type === "WIDGET_CAPTURE_STATUS") return Promise.resolve({ owner: captureOwner, error: captureError, captureSessionId });
  if (["START_CAPTURE", "STOP_CAPTURE", "WIDGET_START_CAPTURE", "WIDGET_STOP_CAPTURE"].includes(msg.type)) {
    const requestedOwner = msg.type.startsWith("WIDGET_") ? "widget" : "sidebar";
    const start = msg.type.includes("START");
    if (start && captureOwner && captureOwner !== requestedOwner) {
      return Promise.reject(new Error(captureOwner === "widget" ? "Stop capture in the UNMUTE widget before starting the sidebar." : "Stop capture in the sidebar before starting the UNMUTE widget."));
    }
    if (start && captureOwner === requestedOwner) return Promise.resolve({ owner: captureOwner, captureSessionId });
    if (!start && (captureOwner !== requestedOwner || (requestedOwner === "widget" && msg.captureSessionId !== captureSessionId))) return Promise.resolve({ owner: captureOwner, captureSessionId });
    captureOwner = start ? requestedOwner : null;
    if (start) captureSessionId = crypto.randomUUID();
    captureError = null;
    window.postMessage({ marker: MARKER, type: start ? "START_CAPTURE" : "STOP_CAPTURE", captureSessionId }, location.origin);
    publishOwner();
    return Promise.resolve({ owner: captureOwner, captureSessionId });
  }
});

injectPageHook();

export {};
