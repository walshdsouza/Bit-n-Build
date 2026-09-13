import { test, expect, type Page } from "@playwright/test";

type CaptureMode = "tone" | "silent" | "no-audio" | "pending";
interface CaptureProbe {
  calls: number;
  options?: Record<string, unknown>;
  tracks: MediaStreamTrack[];
  recorderKinds: string[];
  recordedBytes: number;
  recorder?: MediaRecorder;
  resolvePicker?: () => void;
}
type ProbeWindow = Window & { __captureProbe: CaptureProbe };

async function installCaptureFixture(page: Page, mode: CaptureMode = "tone") {
  await page.addInitScript(({ mode }) => {
    // Replace only the browser picker. Recording, Web Audio and stream tracks
    // are real browser implementations; no microphone or user's tab is read.
    const probe: CaptureProbe = { calls: 0, tracks: [], recorderKinds: [], recordedBytes: 0 };
    (window as unknown as ProbeWindow).__captureProbe = probe;
    const NativeRecorder = window.MediaRecorder;
    window.MediaRecorder = class extends NativeRecorder {
      constructor(stream: MediaStream, options?: MediaRecorderOptions) {
        super(stream, options);
        probe.recorderKinds = stream.getTracks().map((track) => track.kind);
        probe.recorder = this;
        this.addEventListener("dataavailable", (event) => { probe.recordedBytes += event.data.size; });
      }
    };
    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
      configurable: true,
      value: async (options: Record<string, unknown>) => {
        probe.calls += 1;
        probe.options = options;
        // A real chooser resolves after a separate user interaction, never
        // synchronously inside React's hydration/replayed click event.
        await new Promise((resolve) => window.setTimeout(resolve, 100));
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 90;
        canvas.getContext("2d")!.fillRect(0, 0, 160, 90);
        const video = canvas.captureStream(1).getVideoTracks()[0];
        const settings = video.getSettings.bind(video);
        Object.defineProperty(video, "getSettings", { value: () => ({ ...settings(), displaySurface: "browser" }) });
        probe.tracks = [video];
        if (mode !== "no-audio") {
          const context = new AudioContext();
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          gain.gain.value = mode === "silent" ? 0 : 0.15;
          const destination = context.createMediaStreamDestination();
          oscillator.connect(gain).connect(destination);
          oscillator.start();
          await context.resume();
          probe.tracks.push(...destination.stream.getAudioTracks());
        }
        const stream = new MediaStream(probe.tracks);
        if (mode === "pending") return new Promise<MediaStream>((resolve) => { probe.resolvePicker = () => resolve(stream); });
        return stream;
      },
    });
  }, { mode });
}

const start = (page: Page) => page.getByRole("button", { name: "Start tab audio capture" }).click();
const feedback = (page: Page) => page.getByRole("alert", { name: "Tab capture feedback" });
async function expectReleased(page: Page) {
  await expect.poll(() => page.evaluate(() => (window as unknown as ProbeWindow).__captureProbe.tracks.every((track) => track.readyState === "ended"))).toBe(true);
}

test("explicit capture records only audio and waits for review before import", async ({ page }) => {
  await installCaptureFixture(page);
  let imports = 0;
  page.on("request", (request) => { if (request.url().includes("/api/process-video")) imports += 1; });
  await page.goto("/dashboard");
  expect(await page.evaluate(() => (window as unknown as ProbeWindow).__captureProbe.calls)).toBe(0);
  await start(page);
  await expect(page.getByRole("status").filter({ hasText: "Audio detected" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "YouTube URL" })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Synthesize ASL/ })).toBeDisabled();
  expect(await page.evaluate(() => (window as unknown as ProbeWindow).__captureProbe.recorderKinds)).toEqual(["audio"]);
  expect(await page.evaluate(() => (window as unknown as ProbeWindow).__captureProbe.options?.systemAudio)).toBe("exclude");
  await expect.poll(() => page.evaluate(() => (window as unknown as ProbeWindow).__captureProbe.recordedBytes)).toBeGreaterThan(100);
  await expect(page.getByLabel("Recording elapsed time")).not.toHaveText("0:00");
  await page.getByRole("button", { name: "Stop recording" }).click();
  await expect(page.getByLabel("Recorded tab audio preview")).toBeVisible();
  await expect(page.getByText(/^tab-audio-\d+\.webm$/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Synthesize ASL/ })).toBeEnabled();
  await expectReleased(page);
  const recording = await page.getByLabel("Recorded tab audio preview").evaluate(async (audio: HTMLAudioElement) => {
    const blob = await fetch(audio.src).then((response) => response.blob());
    const context = new AudioContext();
    const decoded = await context.decodeAudioData(await blob.arrayBuffer());
    const result = { size: blob.size, type: blob.type, duration: decoded.duration };
    await context.close();
    return result;
  });
  expect(recording.type).toBe("audio/webm");
  expect(recording.size).toBeGreaterThan(100);
  expect(recording.size).toBeLessThan(3.8 * 1024 * 1024);
  expect(recording.duration).toBeGreaterThan(0.5);
  expect(imports).toBe(0);
});

test("cancel discards audio and releases every shared track", async ({ page }) => {
  await installCaptureFixture(page);
  await page.goto("/dashboard");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill("https://youtu.be/dQw4w9WgXcQ");
  await start(page);
  await expect(page.getByRole("button", { name: "Stop recording" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel capture" }).click();
  await expectReleased(page);
  await expect(page.getByLabel("Recorded tab audio preview")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "YouTube URL" })).toHaveValue("https://youtu.be/dQw4w9WgXcQ");
  await expect(page.getByRole("textbox", { name: "YouTube URL" })).toBeEnabled();
  await expect(page.getByRole("status", { name: "Tab capture feedback" })).toContainText("No recording was saved or uploaded");
});

test("missing shared audio is actionable and stops the unused display track", async ({ page }) => {
  await installCaptureFixture(page, "no-audio");
  await page.goto("/dashboard");
  await start(page);
  await expect(feedback(page)).toContainText("No tab audio was shared");
  await expectReleased(page);
  await expect(page.getByRole("button", { name: /Synthesize ASL/ })).toBeDisabled();
});

test("a silent audio stream is rejected without creating a selected recording", async ({ page }) => {
  await installCaptureFixture(page, "silent");
  await page.goto("/dashboard");
  await start(page);
  await expect(page.getByRole("button", { name: "Stop recording" })).toBeVisible();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Stop recording" }).click();
  await expect(feedback(page)).toContainText("No audio was detected");
  await expect(page.getByLabel("Recorded tab audio preview")).toHaveCount(0);
  await expectReleased(page);
});

test("cancelling while the picker is pending disposes a late-arriving stream", async ({ page }) => {
  await installCaptureFixture(page, "pending");
  await page.goto("/dashboard");
  await start(page);
  await expect.poll(() => page.evaluate(() => !!(window as unknown as ProbeWindow).__captureProbe.resolvePicker)).toBe(true);
  await page.getByRole("button", { name: "Cancel capture" }).click();
  await page.evaluate(() => (window as unknown as ProbeWindow).__captureProbe.resolvePicker!());
  await expectReleased(page);
  await expect(page.getByRole("button", { name: "Stop recording" })).toHaveCount(0);
  await expect(page.getByLabel("Recorded tab audio preview")).toHaveCount(0);
});

test("leaving the dashboard discards capture and stops sharing", async ({ page }) => {
  await installCaptureFixture(page);
  await page.goto("/dashboard");
  await start(page);
  await expect(page.getByRole("button", { name: "Stop recording" })).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expectReleased(page);
});

test("recording duration automatically stops at the ten-minute limit", async ({ page }) => {
  await installCaptureFixture(page);
  await page.clock.install();
  await page.goto("/dashboard");
  await start(page);
  await expect(page.getByRole("status").filter({ hasText: "Audio detected" })).toBeVisible();
  await page.waitForTimeout(1000);
  await page.clock.fastForward(10 * 60 * 1000);
  await expect(page.getByRole("status", { name: "Tab capture feedback" })).toContainText("Recording limit reached");
  await expectReleased(page);
  await expect(page.getByLabel("Recorded tab audio preview")).toBeVisible();
});

test("oversized recorder output is rejected before file selection or upload", async ({ page }) => {
  await installCaptureFixture(page);
  await page.goto("/dashboard");
  await start(page);
  await expect(page.getByRole("status").filter({ hasText: "Audio detected" })).toBeVisible();
  // Exercise the size guard with an oversized chunk on the real recorder.
  await page.evaluate(() => (window as unknown as ProbeWindow).__captureProbe.recorder!.dispatchEvent(new BlobEvent("dataavailable", { data: new Blob([new Uint8Array(4 * 1024 * 1024)], { type: "audio/webm" }) })));
  await expect(feedback(page)).toContainText("exceeds 3.8 MB");
  await expect(page.getByLabel("Recorded tab audio preview")).toHaveCount(0);
  await expectReleased(page);
});
