import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { useRuleGlossWhenRequested } from "./rule-gloss-fixture";

test.beforeEach(async ({ page }) => useRuleGlossWhenRequested(page));

test("uploaded MP4 exposes native controls and keeps native playback, seek, speed and mute in sync", async ({ page }, testInfo) => {
  const outputPath = testInfo.outputPath("source-controls.mp4");
  mkdirSync(path.dirname(outputPath), { recursive: true });
  const requireDependency = createRequire(path.join(process.cwd(), "package.json"));
  const ffmpeg = requireDependency("@ffmpeg-installer/ffmpeg") as { path: string };
  execFileSync(ffmpeg.path, [
    "-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=0x164e63:s=640x360:r=24:d=12",
    "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=44100:duration=12",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", "-shortest", "-y", outputPath,
  ], { windowsHide: true, timeout: 30_000 });

  await page.addInitScript(() => localStorage.removeItem("gesturesync.apiKeys"));
  let uploaded = 0;
  // Only transcription is controlled. The MP4 upload, decoder, translation
  // route, media events, timeline, and avatar player are the real app.
  await page.route("**/api/process-video", async route => {
    uploaded++;
    await route.fulfill({ json: { success: true, projectId: null, filename: "source-controls.mp4", duration: 12, segments: [
      { start: 0, end: 6, text: "Hello my friend." }, { start: 6, end: 12, text: "Thank you for your help." },
    ] } });
  });
  await page.goto("/dashboard");
  await page.locator('input[type="file"]').setInputFiles(outputPath);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page).toHaveURL(/\/player\/local$/);
  expect(uploaded).toBe(1);
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  const video = page.locator("video");
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.videoWidth)).toBe(640);
  expect(await video.evaluate((media: HTMLVideoElement) => media.videoHeight)).toBe(360);
  expect(await video.evaluate((media: HTMLVideoElement) => media.controls)).toBe(true);
  expect(await page.evaluate(() => sessionStorage.getItem("sourceType"))).toBe("file");
  expect(await page.evaluate(() => sessionStorage.getItem("sourceVideoUrl"))).toMatch(/^blob:/);

  // Native media API changes exercise the same events fired by the browser's
  // built-in controls, without using the app's bottom buttons to initiate them.
  await video.evaluate((media: HTMLVideoElement) => media.play());
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  const slider = page.getByRole("slider", { name: "Playback position" });
  await expect.poll(() => slider.inputValue().then(Number)).toBeGreaterThan(0.3);
  await video.evaluate((media: HTMLVideoElement) => media.pause());
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  await video.evaluate((media: HTMLVideoElement) => { media.currentTime = 4; });
  await expect.poll(() => slider.inputValue().then(Number)).toBeCloseTo(4, 1);
  await video.evaluate((media: HTMLVideoElement) => { media.playbackRate = 2; });
  await expect(page.getByRole("combobox", { name: "Playback speed" })).toHaveValue("2");
  await video.evaluate((media: HTMLVideoElement) => { media.muted = true; });
  await expect(page.getByRole("button", { name: "Unmute", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Unmute", exact: true }).click();
  expect(await video.evaluate((media: HTMLVideoElement) => media.muted)).toBe(false);
  await slider.fill("7");
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.currentTime)).toBeCloseTo(7, 1);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.paused)).toBe(false);
  await expect.poll(() => slider.inputValue().then(Number)).toBeGreaterThan(7.3);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.paused)).toBe(true);
  await expect(page.getByText("Loading NEXA…")).toBeHidden({ timeout: 60_000 });
  await video.hover();
  await page.screenshot({ path: "logs/player-mp4-desktop.png" });
});
