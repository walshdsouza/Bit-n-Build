import { test, expect, type Page } from "@playwright/test";
import { useRuleGlossWhenRequested } from "./rule-gloss-fixture";

test.beforeEach(async ({ page }) => useRuleGlossWhenRequested(page));

const playhead = (page: Page) => page.getByRole("slider", { name: "Playback position" });

async function openUploadedTrack(page: Page) {
  await page.addInitScript(() => {
    if (!location.pathname.endsWith("/player/local")) return;
    const rate = 8000, duration = 20, count = rate * duration;
    const buffer = new ArrayBuffer(44 + count * 2);
    const view = new DataView(buffer);
    const tag = (at: number, text: string) => [...text].forEach((letter, i) => view.setUint8(at + i, letter.charCodeAt(0)));
    tag(0, "RIFF"); view.setUint32(4, 36 + count * 2, true); tag(8, "WAVE");
    tag(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); tag(36, "data"); view.setUint32(40, count * 2, true);
    sessionStorage.setItem("sourceVideoUrl", URL.createObjectURL(new Blob([buffer], { type: "audio/wav" })));
    sessionStorage.setItem("sourceType", "file");
    sessionStorage.setItem("processedTranscript", JSON.stringify({ title: "Library regression recording", segments: [
      { start: 0, end: 10, text: "Hello my friend." }, { start: 10, end: 20, text: "Thank you for your help." },
    ] }));
    localStorage.removeItem("gesturesync.apiKeys");
  });
  await page.goto("/player/local");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.duration)).toBeCloseTo(20, 1);
}

test("all four speeds change real source elapsed time and the avatar playhead together", async ({ page }) => {
  await openUploadedTrack(page);
  const speed = page.getByRole("combobox", { name: "Playback speed" });
  await expect(speed.locator("option")).toHaveText(["0.5×", "1×", "1.5×", "2×"]);
  await expect(page.getByRole("slider", { name: "Volume", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mute", exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: /^Target sign language/ })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("signPlan")!).lang)).toBe("ASL");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  // Decoder/audio-device startup is not part of the playback-rate sample.
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.3);
  for (const rate of [0.5, 1, 1.5, 2]) {
    const before = await page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime);
    await speed.selectOption(String(rate));
    await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.playbackRate)).toBe(rate);
    const sample = await page.evaluate(async () => {
      const video = document.querySelector("video")!;
      const at = performance.now(), start = video.currentTime;
      await new Promise(resolve => setTimeout(resolve, 1200));
      const end = video.currentTime;
      return { start, end, elapsed: (performance.now() - at) / 1000, playhead: Number((document.querySelector('[aria-label="Playback position"]') as HTMLInputElement).value) };
    });
    expect(sample.start).toBeGreaterThanOrEqual(before - 0.1);
    expect(Math.abs((sample.end - sample.start) / sample.elapsed - rate)).toBeLessThan(0.18);
    expect(Math.abs(sample.end - sample.playhead)).toBeLessThan(0.25);
    await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  }
});

test("2× also advances the avatar when there is no source media", async ({ page }) => {
  await page.goto("/player/demo");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await page.getByRole("combobox", { name: "Playback speed" }).selectOption("2");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  const sample = await page.evaluate(async () => {
    const slider = document.querySelector('[aria-label="Playback position"]') as HTMLInputElement;
    const at = performance.now(), start = Number(slider.value);
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { delta: Number(slider.value) - start, elapsed: (performance.now() - at) / 1000 };
  });
  expect(Math.abs(sample.delta / sample.elapsed - 2)).toBeLessThan(0.2);
});

test("Save commits the media and plan, survives session loss, and reopens from dashboard history", async ({ page }) => {
  await openUploadedTrack(page);
  await playhead(page).fill("3");
  await page.getByRole("combobox", { name: "Playback speed" }).selectOption("1.5");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/\/player\/saved-[a-f0-9-]{36}$/);
  const savedUrl = page.url();
  await expect(page.getByRole("status").filter({ hasText: "Saved on this device" })).toBeVisible();
  // No session data, object URL, or translation API is needed for a saved plan.
  await page.evaluate(() => {
    URL.revokeObjectURL(sessionStorage.getItem("sourceVideoUrl")!);
    sessionStorage.clear();
  });
  let translationRequests = 0;
  await page.route("**/api/translate", route => { translationRequests++; return route.abort(); });
  await page.reload();
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled();
  await expect(page.getByRole("textbox", { name: "Source text for segment 1", exact: true })).toHaveValue("Hello my friend.");
  await expect(page.getByRole("combobox", { name: "Playback speed" })).toHaveValue("1.5");
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.duration)).toBeCloseTo(20, 1);
  expect(Number(await playhead(page).inputValue())).toBeCloseTo(3, 1);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(3.8);
  expect(translationRequests).toBe(0);
  await page.getByRole("link", { name: "Back to dashboard" }).click();
  const savedTrack = page.getByRole("link", { name: /Library regression recording.*Saved on this device/ });
  await expect(savedTrack).toBeVisible();
  await savedTrack.click();
  await expect(page).toHaveURL(savedUrl);
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled();
  expect(translationRequests).toBe(0);
});

test("saving edited transcript updates the existing local track", async ({ page }) => {
  await openUploadedTrack(page);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/\/player\/saved-[a-f0-9-]{36}$/);
  const savedUrl = page.url();
  const first = page.getByRole("textbox", { name: "Source text for segment 1", exact: true });
  await expect(first).toHaveValue("Hello my friend.");
  await first.fill("Good morning my friend.");
  await expect(page.getByRole("button", { name: "Save", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Saved on this device" })).toBeVisible();
  await expect(page).toHaveURL(savedUrl);
  await page.reload();
  await expect(first).toHaveValue("Good morning my friend.");
  await page.getByRole("link", { name: "Back to dashboard" }).click();
  await expect(page.getByRole("link", { name: /Library regression recording.*Saved on this device/ })).toHaveCount(1);
});

test("missing local track gives an actionable error instead of a demo", async ({ page }) => {
  await page.goto("/player/saved-00000000-0000-4000-8000-000000000000");
  await expect(page.getByText(/This track is not saved in this browser/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeDisabled();
  await expect(page.getByRole("textbox", { name: /Source text for segment/ })).toHaveCount(0);
});

test("YouTube refuses an unsupported rate without leaving a false 2× selection", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("sourceType", "youtube");
    sessionStorage.setItem("sourceVideoUrl", "https://www.youtube.com/watch?v=abcdefghijk");
    sessionStorage.setItem("processedTranscript", JSON.stringify({ segments: [{ start: 0, end: 20, text: "Hello my friend." }] }));
    // Controlled provider contract: this video's iframe supports only 1×.
    type Events = { onReady: (event: { target: unknown }) => void; onStateChange: (event: { data: number }) => void };
    const fixture = window as unknown as { YT: { Player: unknown } };
    fixture.YT = { Player: class {
      private time = 0;
      private started = 0;
      private active = false;
      private muted = false;
      private events: Events;
      constructor(_element: HTMLElement, options: { events: Events }) {
        this.events = options.events;
        setTimeout(() => this.events.onReady({ target: this }), 0);
      }
      getCurrentTime() { return this.time + (this.active ? (performance.now() - this.started) / 1000 : 0); }
      getDuration() { return 20; }
      getPlaybackRate() { return 1; }
      getAvailablePlaybackRates() { return [1]; }
      setPlaybackRate() {}
      mute() { this.muted = true; }
      unMute() { this.muted = false; }
      isMuted() { return this.muted; }
      playVideo() { if (!this.active) { this.started = performance.now(); this.active = true; } this.events.onStateChange({ data: 1 }); }
      pauseVideo() { this.time = this.getCurrentTime(); this.active = false; this.events.onStateChange({ data: 2 }); }
      seekTo(time: number) { this.time = time; this.started = performance.now(); }
      destroy() {}
    } };
  });
  await page.goto("/player/local");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await page.getByRole("combobox", { name: "Playback speed" }).selectOption("2");
  await expect(page.getByRole("combobox", { name: "Playback speed" })).toHaveValue("1");
  await expect(page.getByRole("status").filter({ hasText: "does not support 2×. Playing at 1×" })).toBeVisible();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => playhead(page).inputValue().then(Number)).toBeGreaterThan(0.6);
  await expect(page.getByRole("status").filter({ hasText: "does not support 2×" })).toBeVisible();
});

test("an expired source cannot be reported as a successfully saved media track", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("sourceType", "file");
    sessionStorage.setItem("sourceVideoUrl", "blob:expired");
    sessionStorage.setItem("processedTranscript", JSON.stringify({ segments: [{ start: 0, end: 3, text: "Hello my friend." }] }));
  });
  await page.goto("/player/local");
  await expect(page.getByRole("button", { name: "Save", exact: true })).toBeEnabled({ timeout: 60_000 });
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Save failed: The source file is unavailable. Upload it again before saving." })).toBeVisible();
  await expect(page).toHaveURL(/\/player\/local$/);
});
