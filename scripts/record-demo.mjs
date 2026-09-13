import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("logs/demo-video");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === "win32" ? "msedge" : undefined),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 810 },
  recordVideo: { dir: output, size: { width: 1440, height: 810 } },
});
const page = await context.newPage();
const epoch = Date.now();
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3111";
const cues = [];
let start = 0;
function cue(text) { cues.push({ start: (Date.now() - epoch) / 1000 - start, text }); }
function srtTime(seconds) {
  const milliseconds = Math.round(Math.max(0, seconds) * 1000);
  return `${String(Math.floor(milliseconds / 3600000)).padStart(2, "0")}:${String(Math.floor(milliseconds / 60000) % 60).padStart(2, "0")}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, "0")},${String(milliseconds % 1000).padStart(3, "0")}`;
}
async function playerReady() {
  await page.getByRole("button", { name: "Play", exact: true }).waitFor({ timeout: 90_000 });
  await page.waitForFunction(() => !document.querySelector('button[aria-label="Play"]')?.disabled);
  await page.getByText("Loading NEXA…").waitFor({ state: "hidden", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
}
try {
  // Warm the model, fonts, translator, and client routes before the kept take.
  await page.goto(`${baseURL}/player/demo`);
  await playerReady();
  await page.goto(`${baseURL}/`);
  await page.getByRole("link", { name: /Watch Demo/ }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  start = (Date.now() - epoch) / 1000;
  cue("UNMUTE / English speech to ASL");
  await page.waitForTimeout(2000);
  await page.getByRole("link", { name: /Watch Demo/ }).click();
  await playerReady();
  cue("The ASL demo / Smooth transitions and articulated hands");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.waitForTimeout(10500);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  cue("Review at your pace / Seek, slow down, or play at 2×");
  await page.getByRole("slider", { name: "Playback position" }).fill("4.4");
  await page.getByRole("combobox", { name: "Playback speed" }).selectOption("0.5");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.waitForTimeout(2500);
  await page.getByRole("combobox", { name: "Playback speed" }).selectOption("1.5");
  await page.waitForTimeout(1500);
  await page.getByRole("combobox", { name: "Playback speed" }).selectOption("2");
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  cue("Edit the transcript / Regenerate and review the ASL plan");
  const translated = page.waitForResponse(response => new URL(response.url()).pathname === "/api/translate" && response.request().method() === "POST", { timeout: 60_000 });
  await page.getByRole("textbox", { name: "Source text for segment 1", exact: true }).fill("Hello my friend.");
  const translation = await translated;
  if (!translation.ok()) throw new Error("The edited transcript could not be translated for the demo.");
  await playerReady();
  await page.getByRole("combobox", { name: "Playback speed" }).selectOption("1");
  await page.getByRole("slider", { name: "Playback position" }).fill("0");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  cue("Save your track / Kept in this browser on this device");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL(/\/player\/saved-[a-f0-9-]{36}$/);
  await page.getByRole("status").filter({ hasText: "Saved on this device" }).waitFor();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(output, "poster.png") });
  await page.getByRole("link", { name: "Back to dashboard" }).click();
  const savedTrack = page.getByRole("link", { name: /Demo Translation.*Saved on this device/ });
  await savedTrack.waitFor();
  await savedTrack.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  cue("Live meetings / Choose a browser tab and share its audio");
  await page.getByRole("link", { name: /Live Meetings/i }).first().click();
  await page.waitForURL(/\/live$/);
  await page.getByRole("button", { name: /Start|Share|Choose/i }).first().waitFor();
  // Show discovery only: a real meeting requires the user's browser picker.
  await page.waitForTimeout(3000);
  const duration = (Date.now() - epoch) / 1000 - start;
  const video = page.video();
  await context.close();
  const rawPath = await video.path();
  const srt = cues.map((entry, index) => `${index + 1}\n${srtTime(entry.start)} --> ${srtTime(cues[index + 1]?.start ?? duration)}\n${entry.text}\n`).join("\n");
  await writeFile(path.join(output, "captions.srt"), srt);
  await writeFile(path.join(output, "recording.json"), JSON.stringify({ rawPath, start, duration, baseURL, cues }, null, 2));
  console.log(JSON.stringify({ rawPath, start, duration, output }));
} catch (error) {
  await page.screenshot({ path: path.join(output, "recording-error.png") }).catch(() => {});
  throw error;
} finally {
  await browser.close();
}
