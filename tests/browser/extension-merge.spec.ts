import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

interface AudioProbe {
  chunks: Blob[];
  recorders: MediaRecorder[];
  contexts: AudioContext[];
  holdStops: boolean;
  releaseStops: (() => void)[];
}
type AudioWindow = Window & { __extensionAudio: AudioProbe };
type Changes = Record<string, { oldValue?: unknown; newValue?: unknown }>;
interface SettingsProbe {
  stored: Record<string, unknown>;
  change: (values: Record<string, unknown>) => void;
}
type SettingsWindow = Window & { __extensionSettings: SettingsProbe };
const shell = "https://extension.test/";

async function audioFixture(page: Page) {
  await page.route(`${shell}**`, route => route.fulfill({ contentType: "text/html", body: '<button id="start">Start</button><button id="stop">Stop</button>' }));
  await page.goto(shell);
  await page.evaluate(() => {
    const probe: AudioProbe = { chunks: [], recorders: [], contexts: [], holdStops: false, releaseStops: [] };
    (window as unknown as AudioWindow).__extensionAudio = probe;
    const NativeAudioContext = AudioContext;
    window.AudioContext = class extends NativeAudioContext {
      constructor(options?: AudioContextOptions) { super(options); probe.contexts.push(this); }
    };
    const NativeRecorder = MediaRecorder;
    window.MediaRecorder = class extends NativeRecorder {
      constructor(stream: MediaStream, options?: MediaRecorderOptions) {
        super(stream, options);
        probe.recorders.push(this);
        this.addEventListener("stop", event => {
          // Delay only delivery of a genuine recorder's stop event, making
          // an otherwise intermittent Stop → Start race deterministic.
          if (probe.holdStops && event.isTrusted) {
            event.stopImmediatePropagation();
            probe.releaseStops.push(() => this.dispatchEvent(new Event("stop")));
          }
        });
      }
    };
    window.addEventListener("message", event => {
      if (event.data?.marker === "gesturesync" && event.data.type === "AUDIO_CHUNK") probe.chunks.push(event.data.blob);
    });
    document.querySelector("#start")!.addEventListener("click", () => window.postMessage({ marker: "gesturesync", type: "START_CAPTURE" }, "*"));
    document.querySelector("#stop")!.addEventListener("click", () => window.postMessage({ marker: "gesturesync", type: "STOP_CAPTURE" }, "*"));
  });
  await page.addScriptTag({ path: "extension/dist/page-hook.js" });
  await page.evaluate(async () => {
    const audio = new AudioContext();
    const tone = audio.createOscillator();
    const gain = audio.createGain();
    gain.gain.value = 0.15;
    const destination = audio.createMediaStreamDestination();
    tone.connect(gain).connect(destination);
    tone.start();
    await audio.resume();
    // Use a real audio track; only the remote-track event is supplied by the
    // fixture. Web Audio, MediaRecorder and decoding are browser-native.
    const peer = new RTCPeerConnection();
    const event = new Event("track");
    Object.defineProperty(event, "track", { value: destination.stream.getAudioTracks()[0] });
    peer.dispatchEvent(event);
  });
  // This test targets complete recording containers. Warm both native audio
  // graphs before timing the recorder, so device startup is not counted as PCM.
  await expect.poll(() => page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.contexts.map(context => context.state))).toEqual(["running", "running"]);
  await expect.poll(() => page.evaluate(() => Math.min(...(window as unknown as AudioWindow).__extensionAudio.contexts.map(context => context.currentTime)))).toBeGreaterThan(0.8);
}

async function decodedChunks(page: Page) {
  return page.evaluate(async () => {
    const audio = new AudioContext();
    const result = [];
    for (const blob of (window as unknown as AudioWindow).__extensionAudio.chunks) {
      const data = await blob.arrayBuffer();
      const decoded = await audio.decodeAudioData(data.slice(0));
      const pcm = decoded.getChannelData(0);
      const rms = Math.sqrt(pcm.reduce((sum, value) => sum + value * value, 0) / pcm.length);
      result.push({ header: [...new Uint8Array(data, 0, 4)], duration: decoded.duration, rms });
    }
    await audio.close();
    return result;
  });
}

test("merged extension emits independently decodable eight-second recordings and a final stop tail", async ({ page }) => {
  await audioFixture(page);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.chunks.length), { timeout: 25_000 }).toBe(2);
  await page.waitForTimeout(1100); // Record a nonempty partial cycle for final flush.
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.chunks.length)).toBe(3);
  const chunks = await decodedChunks(page);
  await test.info().attach("decoded-audio-cycles", { body: JSON.stringify(chunks, null, 2), contentType: "application/json" });
  for (const chunk of chunks) {
    expect(chunk.header).toEqual([0x1a, 0x45, 0xdf, 0xa3]);
    expect(chunk.rms).toBeGreaterThan(0.03);
  }
  expect(chunks[0].duration).toBeGreaterThan(7.5);
  expect(chunks[0].duration).toBeLessThan(9.5);
  expect(chunks[1].duration).toBeGreaterThan(7.5);
  expect(chunks[1].duration).toBeLessThan(9.5);
  expect(chunks[2].duration).toBeGreaterThan(0.5);
  expect(chunks[2].duration).toBeLessThan(3);
  await expect.poll(() => page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.recorders.filter(recorder => recorder.state !== "inactive").length)).toBe(0);
});

test("rapid recorder restart cannot mix old fragments or create competing recorder cycles", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await audioFixture(page);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const probe = (window as unknown as AudioWindow).__extensionAudio;
    probe.holdStops = true;
    window.postMessage({ marker: "gesturesync", type: "STOP_CAPTURE" }, "*");
    window.postMessage({ marker: "gesturesync", type: "START_CAPTURE" }, "*");
  });
  await expect.poll(() => page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.releaseStops.length)).toBe(1);
  await expect.poll(() => page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.recorders.length)).toBe(2);
  await page.evaluate(() => {
    const probe = (window as unknown as AudioWindow).__extensionAudio;
    probe.holdStops = false;
    probe.releaseStops.splice(0).forEach(release => release());
  });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    window.postMessage({ marker: "gesturesync", type: "STOP_CAPTURE" }, "*");
    window.postMessage({ marker: "gesturesync", type: "STOP_CAPTURE" }, "*");
  });
  await expect.poll(() => page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.chunks.length)).toBe(1);
  const [chunk] = await decodedChunks(page);
  expect(chunk.header).toEqual([0x1a, 0x45, 0xdf, 0xa3]);
  expect(chunk.rms).toBeGreaterThan(0.03);
  expect(chunk.duration).toBeGreaterThan(0.5);
  expect(chunk.duration).toBeLessThan(3);
  await page.waitForTimeout(8300); // Cross both old recorder deadlines.
  expect(await page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.recorders.length)).toBe(2);
  expect(await page.evaluate(() => (window as unknown as AudioWindow).__extensionAudio.recorders.every(recorder => recorder.state === "inactive"))).toBe(true);
  expect(errors).toEqual([]);
});

async function settingsFixture(page: Page) {
  await page.route(`${shell}**`, async route => {
    if (route.request().url().endsWith("/dist/nexa.glb")) return route.fulfill({ contentType: "model/gltf-binary", body: readFileSync("public/models/nexa.glb") });
    return route.fulfill({ contentType: "text/html", body: '<div id="root"></div>' });
  });
  await page.addInitScript(() => {
    const listeners: ((changes: Changes, area: string) => void)[] = [];
    const stored = JSON.parse(localStorage.getItem("extension-fixture-settings") || '{"groqApiKey":"gsk-old","targetLanguage":"ASL"}') as Record<string, unknown>;
    const change = (values: Record<string, unknown>) => {
      const changes: Changes = {};
      for (const [key, value] of Object.entries(values)) { changes[key] = { oldValue: stored[key], newValue: value }; stored[key] = value; }
      localStorage.setItem("extension-fixture-settings", JSON.stringify(stored));
      listeners.forEach(listener => listener(changes, "local"));
    };
    (window as unknown as SettingsWindow).__extensionSettings = { stored, change };
    Object.assign(window, { browser: {
      runtime: { getURL: (path: string) => `https://extension.test/${path}`, openOptionsPage: () => Promise.resolve() },
      storage: {
        local: {
          // Match the real API: a defaults object only queries its own keys.
          get: async (keys: null | Record<string, unknown>) => keys === null ? { ...stored } : Object.fromEntries(Object.entries(keys).map(([key, fallback]) => [key, stored[key] ?? fallback])),
          set: async (values: Record<string, unknown>) => change(values),
        },
        onChanged: { addListener: (listener: typeof listeners[number]) => listeners.push(listener), removeListener: (listener: typeof listeners[number]) => listeners.splice(listeners.indexOf(listener), 1) },
      },
    } });
  });
  await page.goto(shell);
}

test("merged extension settings load saved API keys, validate, save and reopen", async ({ page }) => {
  await settingsFixture(page);
  await page.route("https://api.groq.com/openai/v1/models", route => route.fulfill({ json: { data: [] } }));
  await page.addScriptTag({ path: "extension/dist/options.js" });
  await expect(page.getByLabel("Groq API key", { exact: true })).toHaveValue("gsk-old");
  await page.getByLabel("Groq API key", { exact: true }).fill("gsk-new");
  await page.getByRole("button", { name: "Test", exact: true }).first().click();
  await expect(page.getByText("Valid", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Saved.", { exact: true })).toBeVisible();
  await page.reload();
  await page.addScriptTag({ path: "extension/dist/options.js" });
  await expect(page.getByLabel("Groq API key", { exact: true })).toHaveValue("gsk-new");
});

test("merged sidebar observes setting changes and rejects stale key-validation results", async ({ page }) => {
  await settingsFixture(page);
  let release!: () => void;
  const oldResponse = new Promise<void>(resolve => { release = resolve; });
  await page.route("https://api.groq.com/openai/v1/models", async route => {
    if (route.request().headers().authorization === "Bearer gsk-old") {
      await oldResponse;
      return route.fulfill({ json: { data: [] } });
    }
    return route.fulfill({ status: 401, json: { error: { message: "Rejected fixture key" } } });
  });
  await page.addScriptTag({ path: "extension/dist/sidebar.js" });
  await expect(page.getByText("Checking API key…", { exact: true })).toBeVisible();
  await page.evaluate(() => (window as unknown as SettingsWindow).__extensionSettings.change({ groqApiKey: "gsk-new", targetLanguage: "ISL" }));
  await expect(page.getByText(/API key was rejected/)).toBeVisible();
  await expect(page.locator(".bar .lang")).toHaveText("ISL");
  const completed = page.waitForResponse(response => response.url().endsWith("/models") && response.request().headers().authorization === "Bearer gsk-old");
  release();
  await completed;
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(page.getByText(/API key was rejected/)).toBeVisible();
  await page.evaluate(() => (window as unknown as SettingsWindow).__extensionSettings.change({ groqApiKey: "", openaiApiKey: "" }));
  await expect(page.getByText(/No API key set/)).toBeVisible();
});
