import { test, expect, type Page } from "@playwright/test";
import { useRuleGlossWhenRequested } from "./rule-gloss-fixture";

test.beforeEach(async ({ page }) => useRuleGlossWhenRequested(page));

const playhead = (page: Page) => page.getByRole("slider", { name: "Playback position" });
const position = (page: Page) => playhead(page).inputValue().then(Number);

async function openMediaPlayer(page: Page, blocked = false, metadataHeld = false) {
  // Real browser media decoder + real /api/translate. The short silent WAV
  // deliberately has more fingerspelling than can fit before its endpoint.
  await page.addInitScript(({ blocked, metadataHeld }) => {
    const rate = 8000, duration = blocked || metadataHeld ? 10 : 1.4, count = rate * duration;
    const buffer = new ArrayBuffer(44 + count * 2);
    const view = new DataView(buffer);
    const tag = (at: number, text: string) => [...text].forEach((letter, i) => view.setUint8(at + i, letter.charCodeAt(0)));
    tag(0, "RIFF"); view.setUint32(4, 36 + count * 2, true); tag(8, "WAVE");
    tag(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); tag(36, "data"); view.setUint32(40, count * 2, true);
    sessionStorage.setItem("sourceVideoUrl", URL.createObjectURL(new Blob([buffer], { type: "audio/wav" })));
    sessionStorage.setItem("sourceType", "upload"); // saved projects use this legacy value
    sessionStorage.setItem("processedTranscript", JSON.stringify({ segments: [{ start: 0, end: duration, text: "Xylophonist Quizzicality Jazzworker." }] }));
    localStorage.removeItem("gesturesync.apiKeys");
    const fixture = window as unknown as { rejectMediaPlayback: boolean };
    fixture.rejectMediaPlayback = blocked;
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      return fixture.rejectMediaPlayback ? Promise.reject(new DOMException("Blocked by regression fixture", "NotAllowedError")) : nativePlay.call(this);
    };
    if (metadataHeld) {
      const metadata = window as unknown as { holdMediaMetadata: boolean };
      metadata.holdMediaMetadata = true;
      const nativeDuration = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "duration")!;
      Object.defineProperty(HTMLMediaElement.prototype, "duration", { configurable: true, get() {
        return metadata.holdMediaMetadata ? NaN : nativeDuration.get!.call(this);
      } });
    }
  }, { blocked, metadataHeld });
  await page.goto("/player/local");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  if (!metadataHeld) await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.duration)).toBeCloseTo(blocked ? 10 : 1.4, 1);
  await expect.poll(() => playhead(page).getAttribute("max").then(Number)).toBeGreaterThan(2.5);
}

test("source ending, signing tail, backward seek and replay keep one clock", async ({ page }) => {
  await openMediaPlayer(page);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => position(page)).toBeGreaterThan(1.8);
  expect(await page.locator("video").evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);

  await playhead(page).fill("0.3");
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.5);

  const end = Number(await playhead(page).getAttribute("max"));
  await playhead(page).fill(String(Number((end - 0.3).toFixed(1))));
  await expect(page.getByRole("button", { name: "Replay", exact: true })).toBeEnabled();
  expect(Math.abs(await position(page) - end)).toBeLessThan(0.101);
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  expect(await position(page)).toBeLessThan(1.4);
});

test("blocked source playback uses fallback without a frozen competing clock, then retries", async ({ page }) => {
  await openMediaPlayer(page, true);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Source playback was blocked" })).toBeVisible();
  await expect.poll(() => position(page)).toBeGreaterThan(0.8);
  expect(await page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeLessThan(0.2);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await playhead(page).fill("0.2");
  await page.evaluate(() => { (window as unknown as { rejectMediaPlayback: boolean }).rejectMediaPlayback = false; });
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.5);
  await expect(page.getByRole("status").filter({ hasText: "Source playback was blocked" })).toHaveCount(0);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const sourceTime = await page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime);
  expect(Math.abs(await position(page) - sourceTime)).toBeLessThan(0.3);
});

test("blank source rows retain their identity after regeneration", async ({ page }) => {
  await page.goto("/player/demo");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await page.getByRole("textbox", { name: "Source text for segment 1", exact: true }).fill("");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled();
  await expect(page.getByRole("textbox", { name: /Source text for segment/ })).toHaveCount(6);
  const second = page.getByRole("textbox", { name: "Source text for segment 2", exact: true });
  await expect(second).toHaveValue("She wants pizza but is on a diet.");
  await second.fill("Hello my friend.");
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem("signPlan") || "{}").items?.map((item: { gloss: string }) => item.gloss).join(" "))).toContain("HELLO");
  await expect(page.getByRole("textbox", { name: "Source text for segment 1", exact: true })).toHaveValue("");
  await expect(second).toHaveValue("Hello my friend.");
});

test("late source metadata takes over playback without retranslating or pausing", async ({ page }) => {
  let translationRequests = 0;
  page.on("request", request => { if (request.url().endsWith("/api/translate")) translationRequests++; });
  await openMediaPlayer(page, false, true);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => position(page)).toBeGreaterThan(0.3);
  await page.evaluate(() => {
    (window as unknown as { holdMediaMetadata: boolean }).holdMediaMetadata = false;
    document.querySelector("video")!.dispatchEvent(new Event("loadedmetadata"));
  });
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  await page.waitForTimeout(850); // covers the translation debounce window
  expect(translationRequests).toBe(1);
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeEnabled();
  await expect.poll(() => position(page)).toBeGreaterThan(1);
});
