// GestureSync AI — Background Service Worker (Manifest V3)

const GESTURE_SYNC_API = "http://localhost:3000/api";

// Listen for tab audio capture requests from popup
chrome.runtime.onMessage.addListener((msg: { type: string; tabId?: number }, sender, sendResponse) => {
  if (msg.type === "START_CAPTURE") {
    startAudioCapture(msg.tabId ?? sender.tab?.id ?? 0, sendResponse);
    return true; // keep channel open for async
  }
  if (msg.type === "STOP_CAPTURE") {
    stopCapture();
    sendResponse({ ok: true });
  }
});

let mediaRecorder: MediaRecorder | null = null;
let captureStream: MediaStream | null = null;

async function startAudioCapture(tabId: number, sendResponse: (r: unknown) => void) {
  try {
    // TODO: Use chrome.tabCapture.capture (requires tabCapture permission + offscreen API in MV3):
    // chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
    //   captureStream = stream;
    //   startChunkedRecording(stream);
    //   sendResponse({ ok: true });
    // });

    // Mock: notify that capture started
    chrome.tabs.sendMessage(tabId, { type: "CAPTURE_STARTED" });
    sendResponse({ ok: true, mock: true });
  } catch (err) {
    console.error("Capture error:", err);
    sendResponse({ ok: false, error: String(err) });
  }
}

function startChunkedRecording(stream: MediaStream) {
  mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
  const chunks: Blob[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);

    // Every 3 seconds, send chunk to pipeline
    if (chunks.length >= 3) {
      const blob = new Blob(chunks, { type: "audio/webm" });
      chunks.length = 0;
      sendChunkToPipeline(blob);
    }
  };

  mediaRecorder.start(1000); // 1-second chunks
}

async function sendChunkToPipeline(blob: Blob) {
  const formData = new FormData();
  formData.append("file", blob, `chunk_${Date.now()}.webm`);

  try {
    const res = await fetch(`${GESTURE_SYNC_API}/ingest`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    // Broadcast jobId to all content scripts for live rendering
    chrome.tabs.query({ url: "https://meet.google.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { type: "JOB_CREATED", jobId: data.jobId });
        }
      });
    });
  } catch (err) {
    console.error("Pipeline send error:", err);
  }
}

function stopCapture() {
  mediaRecorder?.stop();
  captureStream?.getTracks().forEach((t) => t.stop());
  mediaRecorder = null;
  captureStream = null;
}
