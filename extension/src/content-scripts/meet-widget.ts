/** The Meet document owns geometry; the extension iframe owns audio credentials. */
const ROOT_ID = "gesturesync-widget-root";
const CHANNEL = "unmute-widget";
const frameUrl = browser.runtime.getURL("dist/widget.html");
const parsedFrameUrl = new URL(frameUrl);
const extensionOrigin = `${parsedFrameUrl.protocol}//${parsedFrameUrl.host}`;

if (!document.getElementById(ROOT_ID)) {
  const wrapper = document.createElement("div");
  wrapper.id = ROOT_ID;
  // Isolate controls from Meet's styles without creating a page-wide hit area.
  const shadow = wrapper.attachShadow({ mode: "open" });
  wrapper.style.cssText = "position:fixed;z-index:9000;pointer-events:none;contain:layout style;";
  const frame = document.createElement("iframe");
  frame.src = frameUrl;
  frame.title = "UNMUTE live sign language";
  frame.allow = "autoplay; camera; microphone";
  frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
  frame.style.cssText = "display:block;width:100%;height:100%;border:1px solid rgba(255,255,255,.12);border-radius:12px;box-sizing:border-box;pointer-events:auto;background:#121827;box-shadow:0 8px 28px #0006;";
  const drag = document.createElement("button");
  drag.type = "button";
  drag.setAttribute("aria-label", "Move UNMUTE widget. Use arrow keys to reposition.");
  drag.title = "Drag to move · arrow keys to reposition";
  drag.style.cssText = "position:absolute;top:0;left:0;right:74px;height:36px;border:0;border-radius:12px 0 0 0;background:transparent;cursor:grab;pointer-events:auto;touch-action:none;";
  const resize = document.createElement("button");
  resize.type = "button";
  resize.setAttribute("aria-label", "Resize UNMUTE widget. Use arrow keys to resize.");
  resize.title = "Drag to resize · arrow keys to resize";
  resize.style.cssText = "position:absolute;right:1px;bottom:1px;width:22px;height:22px;border:0;border-radius:0 0 10px;background:linear-gradient(135deg,transparent 45%,#8b9bad 46%,#8b9bad 51%,transparent 52%,transparent 64%,#8b9bad 65%,#8b9bad 70%,transparent 71%);cursor:nwse-resize;pointer-events:auto;touch-action:none;";
  const style = document.createElement("style");
  style.textContent = "button:focus-visible{outline:2px solid #4cd7f6;outline-offset:-3px;}";
  shadow.append(style, frame, drag, resize);

  const reopen = document.createElement("button");
  reopen.type = "button";
  reopen.textContent = "UNMUTE";
  reopen.setAttribute("aria-label", "Show UNMUTE widget");
  reopen.style.cssText = "display:none;position:fixed;bottom:24px;right:24px;z-index:9000;pointer-events:auto;min-height:44px;padding:0 16px;border:1px solid #536477;border-radius:12px;background:#121827;color:#4cd7f6;font:600 12px system-ui,sans-serif;cursor:pointer;";
  // Keep the reopen control in the same isolated host, but outside its hidden frame.
  shadow.append(reopen);

  let width = 280, height = 320, left = innerWidth - width - 24, top = innerHeight - height - 24;
  let minimized = false, hidden = false, ready = false;
  let token: string | null = null;
  let captureSessionId: string | null = null;
  let owner: "widget" | "sidebar" | null = null;
  let pointer: { id: number; x: number; y: number; left: number; top: number; width: number; height: number; resize: boolean } | null = null;
  const send = (data: Record<string, unknown>) => {
    if (ready && token) frame.contentWindow?.postMessage({ channel: CHANNEL, token, ...data }, extensionOrigin);
  };
  const syncOwner = () => browser.runtime.sendMessage({ type: "UNMUTE_WIDGET_STATUS" }).then(state => {
    if (state?.owner === "widget" || state?.owner === "sidebar" || state?.owner === null) owner = state.owner;
    captureSessionId = typeof state?.captureSessionId === "string" ? state.captureSessionId : null;
    layout();
    if (state?.error) send({ type: "WIDGET_ERROR", message: state.error });
  });
  function layout() {
    const maxWidth = Math.max(180, Math.min(560, innerWidth - 16));
    const maxHeight = Math.max(180, Math.min(600, innerHeight - 16));
    width = Math.max(Math.min(240, maxWidth), Math.min(width, maxWidth));
    height = Math.max(Math.min(280, maxHeight), Math.min(height, maxHeight));
    const shownHeight = minimized ? 36 : height;
    left = Math.max(8, Math.min(left, innerWidth - width - 8));
    top = Math.max(8, Math.min(top, innerHeight - shownHeight - 8));
    Object.assign(wrapper.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${shownHeight}px` });
    frame.style.display = hidden ? "none" : "block";
    drag.style.display = hidden ? "none" : "block";
    resize.style.display = hidden || minimized ? "none" : "block";
    reopen.style.display = hidden ? "block" : "none";
    reopen.textContent = owner === "widget" ? "● UNMUTE" : "UNMUTE";
    send({ type: "WIDGET_STATE", minimized, hidden, owner, captureSessionId });
  }
  function finishPointer(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId) return;
    pointer = null;
    frame.style.pointerEvents = "auto";
    drag.style.cursor = "grab";
  }
  for (const [element, resizing] of [[drag, false], [resize, true]] as const) {
    element.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      event.preventDefault();
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, left, top, width, height, resize: resizing };
      element.setPointerCapture(event.pointerId);
      frame.style.pointerEvents = "none";
      drag.style.cursor = "grabbing";
    });
    element.addEventListener("pointermove", event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (pointer.resize) { width = pointer.width + event.clientX - pointer.x; height = pointer.height + event.clientY - pointer.y; }
      else { left = pointer.left + event.clientX - pointer.x; top = pointer.top + event.clientY - pointer.y; }
      layout();
    });
    element.addEventListener("pointerup", finishPointer);
    element.addEventListener("pointercancel", finishPointer);
    element.addEventListener("lostpointercapture", finishPointer);
    element.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const delta = event.shiftKey ? 40 : 10;
      const x = event.key === "ArrowLeft" ? -delta : event.key === "ArrowRight" ? delta : 0;
      const y = event.key === "ArrowUp" ? -delta : event.key === "ArrowDown" ? delta : 0;
      if (resizing) { width += x; height += y; } else { left += x; top += y; }
      layout();
    });
  }
  reopen.addEventListener("click", () => { hidden = false; layout(); });
  window.addEventListener("resize", layout);
  window.addEventListener("message", event => {
    const data = event.data;
    if (!data || typeof data !== "object") return;
    // Firefox may redact privileged extension MessageEvent.source to null.
    if (event.isTrusted && (event.source === frame.contentWindow || event.source === null) && event.origin === extensionOrigin && data.channel === CHANNEL) {
      if (data.type === "WIDGET_READY") {
        ready = true;
        void browser.runtime.sendMessage({ type: "UNMUTE_WIDGET_TOKEN" }).then(result => {
          token = typeof result?.token === "string" ? result.token : null;
          return syncOwner();
        }).catch(() => send({ type: "WIDGET_ERROR", message: "Reload this Meet tab to connect UNMUTE." }));
      }
      if (data.type === "WIDGET_MINIMIZE") { minimized = !minimized; layout(); }
      if (data.type === "WIDGET_CLOSE") { hidden = true; layout(); }
      return;
    }
    const fromPage = event.source === window && event.origin === location.origin;
    const fromIsolatedExtension = event.isTrusted && event.source === null && (event.origin === location.origin || event.origin === extensionOrigin);
    if ((!fromPage && !fromIsolatedExtension) || data.marker !== "unmute-widget-bridge") return;
    if (data.type === "CAPTURE_STATE") {
      // Page events are notifications only. Ownership comes from the isolated
      // extension bridge so Meet scripts cannot authorize paid transcription.
      void syncOwner().catch(() => {});
    }
  });
  const attach = () => { if (!wrapper.isConnected && document.body) { document.body.prepend(wrapper); layout(); } };
  attach();
  const observer = new MutationObserver(attach);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
}
export {};
