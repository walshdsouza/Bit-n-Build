import { test, expect, type Page } from "@playwright/test";
import { encodeMonoWav } from "../../lib/live-audio";
import { buildSignPlan } from "../../lib/sign-plan";

type FixtureWindow = Window & { __liveFixture: { calls: number; micCalls: number; tracks: MediaStreamTrack[]; resolvePicker?: () => void } };

async function fixture(page: Page, mode: "tone" | "no-audio" | "denied" | "screen" | "pending" | "silent" | "mic-denied" = "tone") {
  await page.addInitScript(({ mode }) => {
    const state: FixtureWindow["__liveFixture"] = { calls: 0, micCalls: 0, tracks: [] };
    (window as unknown as FixtureWindow).__liveFixture = state;
    const audio = async () => {
      const context = new AudioContext();
      const tone = context.createOscillator();
      const gain = context.createGain();
      gain.gain.value = mode === "silent" ? 0 : 0.1;
      const destination = context.createMediaStreamDestination();
      tone.connect(gain).connect(destination);
      tone.start();
      await context.resume();
      return destination.stream;
    };
    Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
      configurable: true,
      value: async () => {
        state.micCalls++;
        if (mode === "mic-denied") throw new DOMException("Microphone blocked", "NotAllowedError");
        const stream = await audio();
        state.tracks.push(...stream.getTracks());
        return stream;
      },
    });
    // Only the picker is replaced. Tracks, AudioWorklet and WAV encoding run
    // in the browser; the fixture never captures people or the microphone.
    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
      configurable: true,
      value: async () => {
        state.calls++;
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (mode === "denied") throw new DOMException("User cancelled", "NotAllowedError");
        const canvas = document.createElement("canvas");
        canvas.width = 160; canvas.height = 90;
        canvas.getContext("2d")!.fillRect(0, 0, 160, 90);
        state.tracks = canvas.captureStream(1).getVideoTracks();
        const video = state.tracks[0];
        const settings = video.getSettings.bind(video);
        Object.defineProperty(video, "getSettings", { value: () => ({ ...settings(), displaySurface: mode === "screen" ? "monitor" : "browser" }) });
        if (mode !== "no-audio") {
          state.tracks.push(...(await audio()).getAudioTracks());
        }
        const stream = new MediaStream(state.tracks);
        if (mode === "pending") return new Promise<MediaStream>((resolve) => { state.resolvePicker = () => resolve(stream); });
        return stream;
      },
    });
  }, { mode });
}

const start = (page: Page) => page.getByRole("button", { name: "Start live captions", exact: true }).click();
const released = (page: Page) => expect.poll(() => page.evaluate(() =>
  (window as unknown as FixtureWindow).__liveFixture.tracks.every((track) => track.readyState === "ended"),
)).toBe(true);
const plan = buildSignPlan([{ startTime: 0, endTime: 5, sourceText: "Hello my friend.", gloss: "HELLO FRIEND", nmm: [], status: "queued" }], { lang: "ASL", duration: 5 });

test("live sharing sends complete sequential WAVs, displays captions and flushes on stop", async ({ page }) => {
  await fixture(page);
  const durations: number[] = [];
  let inFlight = 0;
  let maximumInFlight = 0;
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/live", async (route) => {
    inFlight++;
    maximumInFlight = Math.max(maximumInFlight, inFlight);
    const body = route.request().postDataBuffer()!;
    const start = body.indexOf(Buffer.from("RIFF"));
    expect(start).toBeGreaterThan(-1);
    expect(body.subarray(start + 8, start + 12).toString()).toBe("WAVE");
    durations.push(body.readUInt32LE(start + 40) / body.readUInt32LE(start + 28));
    // The second chunk can be captured while this request is in flight.
    await new Promise((resolve) => setTimeout(resolve, durations.length === 1 ? 5200 : 100));
    await route.fulfill({ json: { speech: true, text: "Hello my friend.", plan, provider: "test-fixture" } });
    inFlight--;
  });
  await page.goto("/live");
  expect(await page.evaluate(() => (window as unknown as FixtureWindow).__liveFixture.calls)).toBe(0);
  await start(page);
  await expect(page.getByRole("button", { name: "Stop sharing", exact: true })).toBeVisible();
  await expect(page.getByRole("log", { name: "Meeting captions" })).toContainText("Hello my friend.");
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start live captions", exact: true })).toBeEnabled();
  await released(page);
  expect(durations.length).toBeGreaterThanOrEqual(2);
  expect(durations[0]).toBe(5);
  expect(durations[1]).toBe(5);
  expect(durations.every((duration) => duration >= 0.15 && duration <= 5)).toBe(true);
  expect(maximumInFlight).toBe(1);
  expect(errors).toEqual([]);
});

test("missing tab audio releases the display track and explains the sharing checkbox", async ({ page }) => {
  await fixture(page, "no-audio");
  await page.goto("/live");
  await start(page);
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toContainText("No tab audio was shared");
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toContainText("Share tab audio");
  await released(page);
  await expect(page.getByRole("button", { name: "Start live captions", exact: true })).toBeEnabled();
});

test("cancelled browser picker stays idle and can be retried", async ({ page }) => {
  await fixture(page, "denied");
  await page.goto("/live");
  await start(page);
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toContainText("cancelled or blocked");
  await expect(page.getByRole("button", { name: "Start live captions", exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Stop sharing", exact: true })).toHaveCount(0);
});

test("whole-screen sharing is rejected and every selected track is released", async ({ page }) => {
  await fixture(page, "screen");
  await page.goto("/live");
  await start(page);
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toContainText("Whole-screen and window sharing are not supported");
  await released(page);
});

test("a picker that resolves after leaving the page releases its late stream", async ({ page }) => {
  await fixture(page, "pending");
  await page.goto("/live");
  await start(page);
  await expect.poll(() => page.evaluate(() => Boolean((window as unknown as FixtureWindow).__liveFixture.resolvePicker))).toBe(true);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await page.evaluate(() => (window as unknown as FixtureWindow).__liveFixture.resolvePicker!());
  await released(page);
});

test("provider failure stops sharing and keeps the actionable error", async ({ page }) => {
  await fixture(page);
  await page.route("**/api/live", (route) => route.fulfill({ status: 429, json: { error: "Transcription is rate limited. Please retry later." } }));
  await page.goto("/live");
  await start(page);
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toContainText("rate limited");
  await released(page);
  await expect(page.getByRole("button", { name: "Start live captions", exact: true })).toBeEnabled();
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toContainText("rate limited");
});

test("leaving live meetings releases capture without starting another request", async ({ page }) => {
  await fixture(page);
  let requests = 0;
  await page.route("**/api/live", (route) => { requests++; return route.fulfill({ json: { speech: false } }); });
  await page.goto("/live");
  await start(page);
  await expect(page.getByRole("button", { name: "Stop sharing", exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await released(page);
  expect(requests).toBe(0);
});

test("live endpoint rejects invalid chunks and skips real PCM silence", async ({ request }) => {
  const invalid = await request.post("/api/live", { data: { audio: "no" } });
  expect(invalid.status()).toBe(400);
  const wrongOrigin = await request.post("/api/live", { headers: { origin: "https://example.com" }, data: "no" });
  expect(wrongOrigin.status()).toBe(403);
  const malformed = await request.post("/api/live", { multipart: { audio: { name: "meeting.wav", mimeType: "audio/wav", buffer: Buffer.from("not audio") } } });
  expect(malformed.status()).toBe(400);
  const silence = Buffer.from(encodeMonoWav(new Float32Array(16000 * 5), 16000));
  const quiet = await request.post("/api/live", { multipart: { audio: { name: "meeting.wav", mimeType: "audio/wav", buffer: silence } } });
  expect(quiet.status()).toBe(200);
  expect(await quiet.json()).toEqual({ speech: false });
  const long = Buffer.from(encodeMonoWav(new Float32Array(16000 * 9), 16000));
  const oversizedDuration = await request.post("/api/live", { multipart: { audio: { name: "meeting.wav", mimeType: "audio/wav", buffer: long } } });
  expect(oversizedDuration.status()).toBe(400);
});

test("microphone mode hears the user's voice without opening a tab picker", async ({ page }) => {
  await fixture(page);
  let requests = 0;
  await page.route("**/api/live", async (route) => {
    requests++;
    const body = route.request().postDataBuffer()!;
    expect(body.indexOf(Buffer.from("RIFF"))).toBeGreaterThan(-1);
    await route.fulfill({ json: { speech: true, text: "Hello my friend.", plan } });
  });
  await page.goto("/live");
  await page.getByRole("radio", { name: /My microphone/ }).check();
  expect(await page.evaluate(() => (window as unknown as FixtureWindow).__liveFixture.micCalls)).toBe(0);
  await start(page);
  await expect(page.getByText("Audio is reaching UNMUTE", { exact: true })).toBeVisible();
  await expect(page.getByRole("log", { name: "Meeting captions" })).toContainText("Hello my friend.");
  await expect(page.getByTestId("live-current-caption")).toHaveText("Hello my friend.");
  const counts = await page.evaluate(() => {
    const { calls, micCalls } = (window as unknown as FixtureWindow).__liveFixture;
    return { calls, micCalls };
  });
  expect(counts).toEqual({ calls: 0, micCalls: 1 });
  expect(requests).toBeGreaterThan(0);
  await expect(page.getByText("Source: Your microphone", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
  await released(page);
  await expect(page.getByRole("button", { name: "Start live captions", exact: true })).toBeEnabled();
});

test("including the microphone mixes both chosen sources and releases both on stop", async ({ page }) => {
  await fixture(page);
  await page.route("**/api/live", (route) => route.fulfill({ json: { speech: false } }));
  await page.goto("/live");
  await page.getByRole("checkbox", { name: /Include my microphone/ }).check();
  await start(page);
  await expect(page.getByText("Audio is reaching UNMUTE", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => {
    const { calls, micCalls, tracks } = (window as unknown as FixtureWindow).__liveFixture;
    return { calls, micCalls, tracks: tracks.length };
  })).toEqual({ calls: 1, micCalls: 1, tracks: 3 });
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
  await released(page);
});

test("denied microphone permission also releases an already shared tab", async ({ page }) => {
  await fixture(page, "mic-denied");
  await page.goto("/live");
  await page.getByRole("checkbox", { name: /Include my microphone/ }).check();
  await start(page);
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toContainText("cancelled or blocked");
  await released(page);
  await expect(page.getByRole("button", { name: "Start live captions", exact: true })).toBeEnabled();
});

test("silent meeting input explains how to include the user's own microphone", async ({ page }) => {
  await fixture(page, "silent");
  await page.goto("/live");
  await start(page);
  await expect(page.getByTestId("live-status")).toHaveText("No audio detected");
  await expect(page.getByText(/To translate your own voice, stop sharing/)).toBeVisible();
  await expect(page.getByRole("meter", { name: "Input audio level" })).toHaveAttribute("aria-valuenow", "0");
  await expect(page.getByText(/\bchunks? pending\b/)).toHaveCount(0);
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
  await released(page);
});

test("a stalled transcription is cancelled with a visible retry instead of indefinite pending", async ({ page }) => {
  await fixture(page);
  await page.route("**/api/live", () => new Promise(() => {}));
  await page.goto("/live");
  await start(page);
  await expect(page.getByTestId("live-status")).toHaveText("Transcription is taking longer than usual…", { timeout: 20000 });
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toContainText("did not respond in time", { timeout: 25000 });
  await released(page);
  await expect(page.getByRole("button", { name: "Start again", exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Start live captions", exact: true })).toBeEnabled();
  await page.unrouteAll({ behavior: "ignoreErrors" });
});
