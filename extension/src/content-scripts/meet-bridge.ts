const MARKER = "gesturesync";

function injectPageHook() {
  const script = document.createElement("script");
  script.src = browser.runtime.getURL("dist/page-hook.js");
  script.onload = () => script.remove();
  (document.documentElement || document.head || document.body).appendChild(script);
}

window.addEventListener("message", (event: MessageEvent) => {
  if (event.source !== window) return;
  const data = event.data;
  if (!data || data.marker !== MARKER) return;
  if (data.type === "AUDIO_CHUNK" || data.type === "CAPTURE_STARTED" || data.type === "CAPTURE_STOPPED") {
    browser.runtime.sendMessage(data).catch(() => {
      /* no listener yet (sidebar closed) — drop the chunk */
    });
  }
});

browser.runtime.onMessage.addListener((msg: { type: string }) => {
  if (msg.type === "START_CAPTURE" || msg.type === "STOP_CAPTURE") {
    window.postMessage({ marker: MARKER, type: msg.type }, "*");
  }
});

injectPageHook();

export {};