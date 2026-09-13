import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import type { MeetingCapture, MeetingCaptureOptions, MeetingCaptureStatus } from "../../components/live/capture";

const compile = (file: string) => ts.transpileModule(readFileSync(file, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const bundle = `(() => {
  const audio = {exports:{}};
  ((module,exports)=>{${compile("lib/live-audio.ts")}})(audio,audio.exports);
  const capture = {exports:{}};
  ((module,exports,require)=>{${compile("components/live/capture.ts")}})(capture,capture.exports,()=>audio.exports);
  window.__captureApi = capture.exports;
  window.__inspectWav = audio.exports.inspectLiveWav;
})();`;
const worklet = readFileSync("public/live-audio-worklet.js", "utf8");

type Mode = "normal" | "silent" | "microphone-denied" | "pending-microphone" | "resume-never" | "worklet-pending";
type HarnessWindow = Window & {
  __captureApi: typeof import("../../components/live/capture");
  __inspectWav: typeof import("../../lib/live-audio").inspectLiveWav;
  __captureHarness: {
    calls: { tab: number; microphone: number };
    statuses: MeetingCaptureStatus[];
    chunks: { duration: number; rms: number }[];
    errors: string[];
    tracks: MediaStreamTrack[];
    contexts: AudioContext[];
    worklets: AudioWorkletNode[];
    capture?: MeetingCapture;
    controller: AbortController;
    resolveMicrophone?: () => void;
  };
};

async function harness(page: Page, options: MeetingCaptureOptions = {}, mode: Mode = "normal") {
  await page.route("**/__capture_harness", (route) => route.fulfill({
    contentType: "text/html",
    body: '<button id="start">Start fixture</button><button id="stop">Stop fixture</button><button id="cancel">Cancel fixture</button>',
  }));
  await page.route("**/live-audio-worklet.js", (route) => mode === "worklet-pending"
    ? new Promise(() => {})
    : route.fulfill({ contentType: "application/javascript", body: worklet }));
  await page.goto("/__capture_harness");
  await page.addScriptTag({ content: bundle });
  await page.evaluate(({ options, mode }) => {
    const target = window as unknown as HarnessWindow;
    const nativeAudioContext = window.AudioContext;
    const nativeAudioWorkletNode = window.AudioWorkletNode;
    const state: HarnessWindow["__captureHarness"] = {
      calls: { tab: 0, microphone: 0 }, statuses: [], chunks: [], errors: [], tracks: [], contexts: [], worklets: [], controller: new AbortController(),
    };
    target.__captureHarness = state;
    window.AudioContext = class extends nativeAudioContext {
      constructor(config?: AudioContextOptions) { super(config); state.contexts.push(this); }
      resume() { return mode === "resume-never" ? new Promise<void>(() => {}) : super.resume(); }
    };
    window.AudioWorkletNode = class extends nativeAudioWorkletNode {
      constructor(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions) { super(context, name, options); state.worklets.push(this); }
    };
    async function source(kind: "tab" | "microphone") {
      const context = new nativeAudioContext();
      const oscillator = context.createOscillator();
      oscillator.frequency.value = kind === "tab" ? 440 : 880;
      const gain = context.createGain();
      gain.gain.value = mode === "silent" ? 0 : 0.4;
      const destination = context.createMediaStreamDestination();
      oscillator.connect(gain).connect(destination);
      oscillator.start();
      await context.resume();
      const stream = new MediaStream(destination.stream.getAudioTracks());
      if (kind === "tab") {
        const canvas = document.createElement("canvas");
        canvas.width = 16; canvas.height = 16;
        canvas.getContext("2d")!.fillRect(0, 0, 16, 16);
        const video = canvas.captureStream(1).getVideoTracks()[0];
        const settings = video.getSettings.bind(video);
        Object.defineProperty(video, "getSettings", { value: () => ({ ...settings(), displaySurface: "browser" }) });
        stream.addTrack(video);
      }
      state.tracks.push(...stream.getTracks());
      return stream;
    }
    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", { configurable: true, value: async () => {
      state.calls.tab++;
      return source("tab");
    } });
    Object.defineProperty(navigator.mediaDevices, "getUserMedia", { configurable: true, value: async () => {
      state.calls.microphone++;
      if (mode === "microphone-denied") throw new DOMException("Microphone denied", "NotAllowedError");
      const stream = await source("microphone");
      if (mode === "pending-microphone") return new Promise<MediaStream>((resolve) => { state.resolveMicrophone = () => resolve(stream); });
      return stream;
    } });
    document.getElementById("start")!.onclick = () => {
      void target.__captureApi.captureMeetingAudio(
        (chunk) => { void chunk.audio.arrayBuffer().then((bytes) => state.chunks.push(target.__inspectWav(bytes))); },
        () => {},
        (message) => state.errors.push(message),
        state.controller.signal,
        { ...options, onStatus: (status) => state.statuses.push(status) },
      ).then((capture) => { state.capture = capture; }).catch((error) => state.errors.push(error.message));
    };
    document.getElementById("stop")!.onclick = () => { void state.capture?.stop(); };
    document.getElementById("cancel")!.onclick = () => state.controller.abort();
  }, { options, mode });
}
const start = async (page: Page) => {
  await page.getByRole("button", { name: "Start fixture" }).click();
  await expect.poll(() => page.evaluate(() => Boolean((window as unknown as HarnessWindow).__captureHarness.capture))).toBe(true);
};
const released = async (page: Page) => expect.poll(() => page.evaluate(() => {
  const state = (window as unknown as HarnessWindow).__captureHarness;
  return state.tracks.every((track) => track.readyState === "ended") && state.contexts.every((context) => context.state === "closed");
})).toBe(true);
const stateSeen = async (page: Page, state: MeetingCaptureStatus["state"]) => expect.poll(() => page.evaluate((state) =>
  (window as unknown as HarnessWindow).__captureHarness.statuses.some((status) => status.state === state), state,
)).toBe(true);

test("tab capture never requests a microphone by default and flushes actual PCM", async ({ page }) => {
  await harness(page);
  expect(await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.calls)).toEqual({ tab: 0, microphone: 0 });
  await start(page);
  await stateSeen(page, "receiving");
  expect(await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.calls)).toEqual({ tab: 1, microphone: 0 });
  await page.getByRole("button", { name: "Stop fixture" }).click();
  await released(page);
  await expect.poll(() => page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.chunks.length)).toBeGreaterThan(0);
  const chunks = await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.chunks);
  expect(chunks[0].duration).toBeGreaterThanOrEqual(0.15);
  expect(chunks[0].duration).toBeLessThan(5);
  expect(chunks[0].rms).toBeGreaterThan(0.1);
});

test("explicit microphone capture skips the display picker and Stop is idempotent", async ({ page }) => {
  await harness(page, { source: "microphone" });
  await start(page);
  await stateSeen(page, "receiving");
  expect(await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.calls)).toEqual({ tab: 0, microphone: 1 });
  await expect.poll(() => page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.chunks.length), { timeout: 12_000 }).toBeGreaterThan(0);
  expect(await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.chunks[0].duration)).toBe(5);
  expect(await page.evaluate(async () => {
    const capture = (window as unknown as HarnessWindow).__captureHarness.capture!;
    const first = capture.stop(); const second = capture.stop();
    await Promise.all([first, second]);
    return first === second;
  })).toBe(true);
  await released(page);
});

test("explicit tab plus microphone mixes both sources without doubled amplitude", async ({ page }) => {
  await harness(page, { source: "tab", includeMicrophone: true });
  await start(page);
  await stateSeen(page, "receiving");
  expect(await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.calls)).toEqual({ tab: 1, microphone: 1 });
  await page.getByRole("button", { name: "Stop fixture" }).click();
  await released(page);
  const chunks = await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.chunks);
  expect(chunks[0].rms).toBeGreaterThan(0.12);
  expect(chunks[0].rms).toBeLessThan(0.25);
});

test("microphone denial after tab selection releases the display audio and video", async ({ page }) => {
  await harness(page, { source: "tab", includeMicrophone: true }, "microphone-denied");
  await page.getByRole("button", { name: "Start fixture" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.errors)).toContain("Microphone denied");
  await released(page);
});

test("cancelling a pending microphone prompt closes context and releases its late stream", async ({ page }) => {
  await harness(page, { source: "microphone" }, "pending-microphone");
  await page.getByRole("button", { name: "Start fixture" }).click();
  await expect.poll(() => page.evaluate(() => Boolean((window as unknown as HarnessWindow).__captureHarness.resolveMicrophone))).toBe(true);
  await page.getByRole("button", { name: "Cancel fixture" }).click();
  await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.resolveMicrophone!());
  await released(page);
  expect(await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.chunks.length)).toBe(0);
});

test("silence and muted tracks are distinguished from received audio", async ({ page }) => {
  await harness(page, { source: "microphone" }, "silent");
  await start(page);
  await stateSeen(page, "silent");
  await page.evaluate(() => {
    const audio = (window as unknown as HarnessWindow).__captureHarness.tracks.find((track) => track.kind === "audio")!;
    Object.defineProperty(audio, "muted", { configurable: true, value: true });
    audio.dispatchEvent(new Event("mute"));
  });
  await stateSeen(page, "muted");
  await page.evaluate(() => {
    const audio = (window as unknown as HarnessWindow).__captureHarness.tracks.find((track) => track.kind === "audio")!;
    Object.defineProperty(audio, "muted", { configurable: true, value: false });
    audio.dispatchEvent(new Event("unmute"));
  });
  await expect.poll(() => page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.statuses.at(-1)?.state)).toBe("silent");
  await page.getByRole("button", { name: "Stop fixture" }).click();
  await released(page);
});

test("suspended audio contexts report their state and recover processing", async ({ page }) => {
  await harness(page, { source: "microphone" });
  await start(page);
  await stateSeen(page, "receiving");
  await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.contexts[0].suspend());
  await stateSeen(page, "suspended");
  await expect.poll(() => page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.contexts[0].state)).toBe("running");
  await page.getByRole("button", { name: "Stop fixture" }).click();
  await released(page);
});

test("a startup resume that never settles fails with recovery instead of hanging", async ({ page }) => {
  await harness(page, { source: "microphone" }, "resume-never");
  await page.getByRole("button", { name: "Start fixture" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.errors.join(" ")), { timeout: 12_000 }).toContain("could not start audio processing");
  await released(page);
});

test("cancelling a pending worklet load releases all capture resources", async ({ page }) => {
  await harness(page, { source: "microphone" }, "worklet-pending");
  await page.getByRole("button", { name: "Start fixture" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.tracks.length)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Cancel fixture" }).click();
  await released(page);
  expect(await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.chunks.length)).toBe(0);
});

test("missing recorder heartbeats report stalled processing while Stop remains bounded", async ({ page }) => {
  await harness(page, { source: "microphone" });
  await start(page);
  await stateSeen(page, "receiving");
  await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.worklets[0].port.close());
  await stateSeen(page, "stalled");
  await page.getByRole("button", { name: "Stop fixture" }).click();
  await released(page);
});

test("aborting active capture discards a partial chunk and releases every owned stream", async ({ page }) => {
  await harness(page, { source: "tab", includeMicrophone: true });
  await start(page);
  await stateSeen(page, "receiving");
  await page.getByRole("button", { name: "Cancel fixture" }).click();
  await released(page);
  expect(await page.evaluate(() => (window as unknown as HarnessWindow).__captureHarness.chunks.length)).toBe(0);
});
