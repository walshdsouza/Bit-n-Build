import { test, expect, type Page } from "@playwright/test";
import { useRuleGlossWhenRequested } from "./rule-gloss-fixture";

test.beforeEach(async ({ page }) => useRuleGlossWhenRequested(page));

const playhead = (page: Page) => page.getByRole("slider", { name: "Playback position" });
const muteButton = (page: Page) => page.getByRole("button", { name: "Mute", exact: true });
const unmuteButton = (page: Page) => page.getByRole("button", { name: "Unmute", exact: true });

async function openUploadedMedia(page: Page) {
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
    // Audible PCM decoded by the browser: muting must change the actual media,
    // while its clock keeps running. No patched HTMLMediaElement methods.
    for (let i = 0; i < count; i++) view.setInt16(44 + i * 2, Math.round(Math.sin(i / rate * Math.PI * 440) * 3000), true);
    sessionStorage.setItem("sourceVideoUrl", URL.createObjectURL(new Blob([buffer], { type: "audio/wav" })));
    sessionStorage.setItem("sourceType", "file");
    sessionStorage.setItem("processedTranscript", JSON.stringify({ title: "Player control recording", segments: [
      { start: 0, end: 10, text: "Hello my friend." }, { start: 10, end: 20, text: "Thank you for your help." },
    ] }));
    localStorage.removeItem("gesturesync.apiKeys");
  });
  await page.goto("/player/local");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.duration)).toBeCloseTo(20, 1);
}

async function openYouTubeMedia(page: Page, initiallyMuted = false, commandDelayMs = 0) {
  await page.addInitScript(({ initiallyMuted, commandDelayMs }) => {
    if (!location.pathname.endsWith("/player/local")) return;
    sessionStorage.setItem("sourceType", "youtube");
    sessionStorage.setItem("sourceVideoUrl", "https://www.youtube.com/watch?v=abcdefghijk");
    sessionStorage.setItem("processedTranscript", JSON.stringify({ title: "YouTube control recording", segments: [
      { start: 0, end: 20, text: "Hello my friend." },
    ] }));
    localStorage.removeItem("gesturesync.apiKeys");
    type Events = { onReady: (event: { target: unknown }) => void; onStateChange: (event: { data: number }) => void };
    const fixture = window as unknown as {
      YT: { Player: unknown };
      youtubeControls: { commands: string[]; settledCommands: string[]; muted: boolean; commandDelayMs: number; setProviderMuted: (muted: boolean) => void };
    };
    fixture.youtubeControls = { commands: [], settledCommands: [], muted: initiallyMuted, commandDelayMs, setProviderMuted: (muted) => { fixture.youtubeControls.muted = muted; } };
    fixture.YT = { Player: class {
      private time = 0;
      private started = 0;
      private active = false;
      private rate = 1;
      private events: Events;
      private iframe: HTMLIFrameElement;
      constructor(element: HTMLElement, options: { events: Events }) {
        this.events = options.events;
        this.iframe = document.createElement("iframe");
        this.iframe.title = "YouTube fixture video";
        this.iframe.width = "640";
        this.iframe.height = "360";
        this.iframe.srcdoc = '<html><body style="margin:0;background:#1e293b;color:white;display:grid;place-items:center;height:100vh;font-family:sans-serif">YouTube source video</body></html>';
        element.replaceWith(this.iframe);
        setTimeout(() => this.events.onReady({ target: this }), 0);
      }
      getCurrentTime() { return this.time + (this.active ? (performance.now() - this.started) / 1000 * this.rate : 0); }
      getDuration() { return 20; }
      getPlaybackRate() { return this.rate; }
      getAvailablePlaybackRates() { return [0.5, 1, 1.5, 2]; }
      setPlaybackRate(rate: number) { this.time = this.getCurrentTime(); this.started = performance.now(); this.rate = rate; }
      playVideo() { if (!this.active) { this.started = performance.now(); this.active = true; } this.events.onStateChange({ data: 1 }); }
      pauseVideo() { this.time = this.getCurrentTime(); this.active = false; this.events.onStateChange({ data: 2 }); }
      seekTo(time: number) { this.time = time; this.started = performance.now(); }
      private changeMute(muted: boolean) {
        const command = muted ? "mute" : "unMute";
        fixture.youtubeControls.commands.push(command);
        const settle = () => { fixture.youtubeControls.muted = muted; fixture.youtubeControls.settledCommands.push(command); };
        if (fixture.youtubeControls.commandDelayMs) setTimeout(settle, fixture.youtubeControls.commandDelayMs);
        else settle();
      }
      mute() { this.changeMute(true); }
      unMute() { this.changeMute(false); }
      isMuted() { return fixture.youtubeControls.muted; }
      destroy() { this.iframe.remove(); }
    } };
  }, { initiallyMuted, commandDelayMs });
  await page.goto("/player/local");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await expect(page.getByTitle("YouTube fixture video", { exact: true })).toBeVisible();
}

test("bottom mute control changes native source audio without interrupting playback", async ({ page }) => {
  await openUploadedMedia(page);
  await expect(muteButton(page)).toBeEnabled();
  await expect(muteButton(page)).toBeInViewport();
  expect(await page.locator("video").evaluate((video: HTMLVideoElement) => video.muted)).toBe(false);
  await muteButton(page).click();
  await expect(unmuteButton(page)).toBeEnabled();
  expect(await page.locator("video").evaluate((video: HTMLVideoElement) => video.muted)).toBe(true);

  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.5);
  const before = await page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime);
  await unmuteButton(page).focus();
  await page.keyboard.press("Enter");
  await expect(muteButton(page)).toBeEnabled();
  expect(await page.locator("video").evaluate((video: HTMLVideoElement) => video.muted)).toBe(false);
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(before + 0.3);
  expect(await page.locator("video").evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);

  // A media-originated volumechange must update the bottom label as well.
  await page.locator("video").evaluate((video: HTMLVideoElement) => { video.muted = true; });
  await expect(unmuteButton(page)).toBeEnabled();
  await page.locator("video").evaluate((video: HTMLVideoElement) => { video.muted = false; });
  await expect(muteButton(page)).toBeEnabled();
});

for (const initiallyMuted of [false, true]) {
  test(`YouTube ${initiallyMuted ? "muted" : "audible"} initial state and bottom toggle use the provider audio commands`, async ({ page }) => {
    await openYouTubeMedia(page, initiallyMuted);
    const initialButton = initiallyMuted ? unmuteButton(page) : muteButton(page);
    const oppositeButton = initiallyMuted ? muteButton(page) : unmuteButton(page);
    await expect(initialButton).toBeEnabled();
    await page.evaluate(() => { (window as unknown as { youtubeControls: { commands: string[] } }).youtubeControls.commands.length = 0; });
    await initialButton.click();
    await expect(oppositeButton).toBeEnabled();
    const first = await page.evaluate(() => (window as unknown as { youtubeControls: { commands: string[]; muted: boolean } }).youtubeControls);
    expect(first.commands).toContain(initiallyMuted ? "unMute" : "mute");
    expect(first.muted).toBe(!initiallyMuted);
    await oppositeButton.click();
    await expect(initialButton).toBeEnabled();
    const second = await page.evaluate(() => (window as unknown as { youtubeControls: { commands: string[]; muted: boolean } }).youtubeControls);
    expect(second.commands).toContain(initiallyMuted ? "mute" : "unMute");
    expect(second.muted).toBe(initiallyMuted);
  });
}

test("delayed YouTube mute commands settle to the last click even after a quick reversal", async ({ page }) => {
  await openYouTubeMedia(page, false, 300);
  await muteButton(page).click();
  await expect(unmuteButton(page)).toBeEnabled();
  await expect.poll(() => page.evaluate(() => (window as unknown as { youtubeControls: { muted: boolean } }).youtubeControls.muted)).toBe(true);
  await unmuteButton(page).click();
  await expect(muteButton(page)).toBeEnabled();
  await expect.poll(() => page.evaluate(() => (window as unknown as { youtubeControls: { muted: boolean } }).youtubeControls.muted)).toBe(false);

  // Reverse immediately after React paints the first label. An iframe command
  // is still pending, so its old isMuted() cache must not discard this click.
  await page.evaluate(async () => {
    const state = (window as unknown as { youtubeControls: { commands: string[]; settledCommands: string[]; commandDelayMs: number } }).youtubeControls;
    state.commands.length = 0;
    state.settledCommands.length = 0;
    state.commandDelayMs = 1000;
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { observer.disconnect(); reject(new Error("Mute button did not change its label")); }, 5000);
      const observer = new MutationObserver(() => {
        const button = document.querySelector<HTMLButtonElement>('button[aria-label="Unmute"]');
        if (!button) return;
        observer.disconnect();
        button.click();
        clearTimeout(timer);
        resolve();
      });
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
      document.querySelector<HTMLButtonElement>('button[aria-label="Mute"]')!.click();
    });
  });
  await expect(muteButton(page)).toBeEnabled();
  await expect.poll(() => page.evaluate(() => (window as unknown as { youtubeControls: { settledCommands: string[] } }).youtubeControls.settledCommands)).toEqual(["mute", "unMute"]);
  expect(await page.evaluate(() => (window as unknown as { youtubeControls: { muted: boolean } }).youtubeControls.muted)).toBe(false);
  await expect(muteButton(page)).toBeEnabled();
  // A later provider-originated change must still be reflected by the UI.
  await page.evaluate(() => (window as unknown as { youtubeControls: { setProviderMuted: (muted: boolean) => void } }).youtubeControls.setProviderMuted(true));
  await expect(unmuteButton(page)).toBeEnabled();
});

test("YouTube fills the wider source pane and remains fitted after resizing", async ({ page }) => {
  await openYouTubeMedia(page);
  const separator = page.getByRole("separator", { name: "Resize source and avatar" });
  await expect(separator).toHaveAttribute("aria-valuenow", "55");
  const dimensions = async () => {
    const pane = await page.getByTestId("source-pane").boundingBox();
    const frame = await page.getByTestId("source-video-frame").boundingBox();
    const iframe = await page.getByTitle("YouTube fixture video", { exact: true }).boundingBox();
    expect(pane).not.toBeNull(); expect(frame).not.toBeNull(); expect(iframe).not.toBeNull();
    expect(frame!.width).toBeGreaterThanOrEqual(pane!.width - 32);
    expect(frame!.width / frame!.height).toBeCloseTo(16 / 9, 1);
    expect(Math.abs(iframe!.width - frame!.width)).toBeLessThan(3);
    expect(Math.abs(iframe!.height - frame!.height)).toBeLessThan(3);
    expect(frame!.x).toBeGreaterThanOrEqual(pane!.x);
    expect(frame!.x + frame!.width).toBeLessThanOrEqual(pane!.x + pane!.width + 1);
    return frame!;
  };
  const original = await dimensions();
  expect(original.width).toBeGreaterThan(500);
  await playhead(page).fill("10");
  await expect(page.getByText("Loading NEXA…")).toBeHidden({ timeout: 60_000 });
  await page.screenshot({ path: "logs/player-controls-desktop.png" });
  await separator.focus();
  await page.keyboard.press("ArrowRight");
  await expect(separator).toHaveAttribute("aria-valuenow", "60");
  expect((await dimensions()).width).toBeGreaterThan(original.width + 25);
  await page.setViewportSize({ width: 1280, height: 720 });
  await dimensions();
});

test("timeline paints a blue played segment and seeking moves both media and fill", async ({ page }) => {
  await openUploadedMedia(page);
  const slider = playhead(page);
  const duration = Number(await slider.getAttribute("max"));
  await slider.fill(String(Math.round(duration * 5) / 10));
  const position = Number(await slider.inputValue());
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeCloseTo(position, 1);
  await expect(slider).toHaveClass(/playback-progress/);
  const progress = await slider.evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue("--playback-progress")));
  expect(progress).toBeCloseTo(position / duration * 100, 1);

  // Read pixels from the rendered control, not just its stylesheet. A typo in
  // the browser's range-track pseudo-element must fail this regression.
  const screenshot = await slider.screenshot();
  const pixels = await page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    const at = (fraction: number) => Array.from(context.getImageData(Math.round(image.width * fraction), Math.floor(image.height / 2), 1, 1).data).slice(0, 3);
    return { played: at(0.25), remaining: at(0.75) };
  }, screenshot.toString("base64"));
  expect(pixels.played[2]).toBeGreaterThan(pixels.played[0] + 40);
  expect(pixels.played[2]).toBeGreaterThan(150);
  expect(Math.max(...pixels.remaining) - Math.min(...pixels.remaining)).toBeLessThan(30);
  expect(pixels.remaining[2]).toBeLessThan(pixels.played[2] - 80);

  await slider.focus();
  await page.keyboard.press("ArrowRight");
  expect(Number(await slider.inputValue())).toBeGreaterThan(position);
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(position);
  const nextProgress = await slider.evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue("--playback-progress")));
  expect(nextProgress).toBeGreaterThan(progress);
});

test("mobile video, blue timeline and audio button fit without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openYouTubeMedia(page);
  await page.getByRole("button", { name: /Gloss/ }).click();
  await expect(page.getByTitle("YouTube fixture video", { exact: true })).toBeInViewport();
  await expect(muteButton(page)).toBeInViewport();
  await expect(playhead(page)).toBeInViewport();
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeInViewport();
  await muteButton(page).click();
  await expect(unmuteButton(page)).toBeInViewport();
  await playhead(page).fill("5");
  expect(Number(await playhead(page).inputValue())).toBe(5);
  const bounds = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(bounds.content).toBeLessThanOrEqual(bounds.viewport + 1);
  const frame = await page.getByTestId("source-video-frame").boundingBox();
  expect(frame!.width).toBeGreaterThan(250);
  expect(frame!.width / frame!.height).toBeCloseTo(16 / 9, 1);
  await expect(page.getByText("Loading NEXA…")).toBeHidden({ timeout: 60_000 });
  await page.screenshot({ path: "logs/player-controls-mobile.png" });
});

test("transcript demo has no inactive source-audio toggle", async ({ page }) => {
  await page.goto("/player/demo");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await expect(page.getByRole("button", { name: /^(Mute|Unmute)$/ })).toHaveCount(0);
});

for (const viewport of [{ width: 375, height: 667 }, { width: 320, height: 568 }]) {
  test(`small mobile ${viewport.width}×${viewport.height} keeps the avatar unclipped and controls reachable`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openYouTubeMedia(page);
    await page.getByRole("button", { name: /Gloss/ }).click();
    await expect(page.getByText("Loading NEXA…")).toBeHidden({ timeout: 60_000 });
    const iframe = page.getByTitle("YouTube fixture video", { exact: true });
    await iframe.scrollIntoViewIfNeeded();
    await expect(iframe).toBeInViewport();
    const frame = await page.getByTestId("source-video-frame").boundingBox();
    expect(frame!.width / frame!.height).toBeCloseTo(16 / 9, 1);
    const geometry = await page.getByTestId("source-pane").evaluate(pane => {
      const split = pane.parentElement!.getBoundingClientRect();
      const canvas = pane.parentElement!.querySelector("canvas")!.getBoundingClientRect();
      return { splitBottom: split.bottom, canvasBottom: canvas.bottom, canvasHeight: canvas.height };
    });
    expect(geometry.canvasHeight).toBeGreaterThanOrEqual(140);
    expect(geometry.canvasBottom).toBeLessThanOrEqual(geometry.splitBottom + 1);
    await muteButton(page).scrollIntoViewIfNeeded();
    await expect(muteButton(page)).toBeInViewport();
    await expect(playhead(page)).toBeInViewport();
    await muteButton(page).click();
    await expect(unmuteButton(page)).toBeInViewport();
    const bounds = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(bounds.content).toBeLessThanOrEqual(bounds.viewport + 1);
    await page.screenshot({ path: `logs/player-controls-mobile-${viewport.width}.png` });
  });
}
