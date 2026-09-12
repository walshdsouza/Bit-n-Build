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

  const listener = (msg: any) => {
    if (msg?.marker !== "gesturesync") return;
    if (msg.type === "AUDIO_CHUNK") onChunk(msg.blob as Blob);
  };
  browser.runtime.onMessage.addListener(listener);

  try {
    await browser.tabs.sendMessage(tabId, { type: "START_CAPTURE" });
  } catch (err) {
    onError(new Error("Could not reach the Meet tab — reload it and try again. (" + err + ")"));
  }

  const stop = () => {
    browser.tabs.sendMessage(tabId, { type: "STOP_CAPTURE" }).catch(() => {});
    browser.runtime.onMessage.removeListener(listener);
  };

  return { stop };
}