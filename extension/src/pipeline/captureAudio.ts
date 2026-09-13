export type AudioChunkHandler = (blob: Blob) => void;

export interface CaptureHandle {
  stop: () => void;
}

async function getMeetTabId(): Promise<number> {
  const [tab] = await browser.tabs.query({
    url: "https://meet.google.com/*",
    active: true,
    currentWindow: true,
  });
  if (!tab?.id) throw new Error("No active Google Meet tab found in this window.");
  return tab.id;
}

export async function startTabAudioCapture(
  onChunk: AudioChunkHandler,
  onError: (err: unknown) => void
): Promise<CaptureHandle> {
  const tabId = await getMeetTabId();

  const listener = (msg: unknown) => {
    if (!msg || typeof msg !== "object") return;
    const message = msg as Record<string, unknown>;
    if (message.marker !== "gesturesync") return;
    if (message.type === "AUDIO_CHUNK" && message.blob instanceof Blob) onChunk(message.blob);
  };
  browser.runtime.onMessage.addListener(listener);

  try {
    await browser.tabs.sendMessage(tabId, { type: "START_CAPTURE" });
  } catch (err) {
    browser.runtime.onMessage.removeListener(listener);
    const error = new Error("Could not reach the Meet tab — reload it and try again. (" + err + ")");
    onError(error);
    throw error;
  }

  const stop = () => {
    browser.tabs.sendMessage(tabId, { type: "STOP_CAPTURE" }).catch(() => {});
    browser.runtime.onMessage.removeListener(listener);
  };

  return { stop };
}
