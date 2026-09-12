// GestureSync AI — Content Script
// Injects the ASL avatar overlay iframe into Google Meet

const GESTURE_SYNC_URL = "http://localhost:3000/player/live";
const OVERLAY_ID = "gesturesync-overlay";

function injectOverlay() {
  if (document.getElementById(OVERLAY_ID)) return;

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 320px;
    height: 280px;
    z-index: 99999;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 30px rgba(76, 215, 246, 0.4), 0 20px 60px rgba(0,0,0,0.6);
    border: 1px solid rgba(76, 215, 246, 0.3);
    resize: both;
    transition: box-shadow 0.3s ease;
  `;

  const iframe = document.createElement("iframe");
  iframe.src = GESTURE_SYNC_URL;
  iframe.style.cssText = "width: 100%; height: 100%; border: none; background: #0a0a0f;";
  iframe.allow = "autoplay; microphone";

  // Drag handle
  const handle = document.createElement("div");
  handle.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 28px;
    background: linear-gradient(to right, #0566d9, #06b6d4);
    cursor: move;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    z-index: 1;
    font-family: Inter, sans-serif;
    font-size: 11px;
    color: rgba(255,255,255,0.9);
    font-weight: 600;
    letter-spacing: 0.04em;
  `;
  handle.textContent = "⬥ GestureSync AI — Live ASL";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.style.cssText = `
    background: none; border: none; color: rgba(255,255,255,0.8);
    cursor: pointer; font-size: 12px; padding: 0; margin-left: 8px;
  `;
  closeBtn.onclick = () => overlay.remove();
  handle.appendChild(closeBtn);

  overlay.appendChild(handle);
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);

  // Make draggable
  makeDraggable(overlay, handle);
}

function makeDraggable(el: HTMLElement, handle: HTMLElement) {
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;
  handle.addEventListener("mousedown", (e: MouseEvent) => {
    startX = e.clientX;
    startY = e.clientY;
    const rect = el.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    el.style.right = "auto";
    el.style.bottom = "auto";

    const onMove = (me: MouseEvent) => {
      el.style.left = `${startLeft + me.clientX - startX}px`;
      el.style.top = `${startTop + me.clientY - startY}px`;
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  });
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((msg: { type: string }) => {
  if (msg.type === "TOGGLE_OVERLAY") {
    const existing = document.getElementById(OVERLAY_ID);
    if (existing) {
      existing.remove();
    } else {
      injectOverlay();
    }
  }
});

// Auto-inject on Meet page
if (window.location.hostname === "meet.google.com") {
  injectOverlay();
}
