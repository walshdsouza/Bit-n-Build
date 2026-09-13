import { test, expect, type Page } from "@playwright/test";
import { ruleGlossHeaders } from "./rule-gloss-fixture";

async function openPlayer(page: Page) {
  await page.goto("/player/demo");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await expect(page.getByText("Loading NEXA…")).toBeHidden({ timeout: 60_000 });
  await expect(page.locator("canvas")).toBeVisible();
}
const playhead = (page: Page) => page.getByRole("slider", { name: "Playback position" });
const position = (page: Page) => playhead(page).inputValue().then(Number);

test("landing and dashboard load and expose the real demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("AI Sign Translation");
  await expect(page.getByRole("link", { name: /Watch Demo/ })).toHaveAttribute("href", "/player/demo");
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Synthesize ASL/ })).toBeDisabled();
  await page.getByRole("textbox", { name: "YouTube URL" }).fill("https://example.com/not-youtube");
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: /youtube|valid|unsupported/i })).toBeVisible();
});

test("play, pause, seek during playback, speed and replay stay synchronized", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openPlayer(page);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => position(page)).toBeGreaterThan(0.7);
  await playhead(page).fill("10");
  await expect.poll(() => position(page)).toBeGreaterThan(10.4);
  expect(await position(page)).toBeLessThan(15);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await position(page);
  await page.waitForTimeout(650);
  expect(await position(page)).toBeCloseTo(paused, 1);
  await playhead(page).focus();
  await page.keyboard.press("ArrowRight");
  expect(await position(page)).toBeGreaterThan(paused);
  await page.getByRole("combobox", { name: "Playback speed" }).selectOption("0.5");
  await playhead(page).fill("4");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  expect(await position(page)).toBeGreaterThan(4.3);
  expect(await position(page)).toBeLessThan(5.8);
  const end = await playhead(page).getAttribute("max");
  await playhead(page).fill(end!);
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await expect.poll(() => position(page)).toBeLessThan(3);
  expect(errors).toEqual([]);
});

test("ASL translation, transcript edits, filtering and SiGML download", async ({ page }) => {
  await openPlayer(page);
  await expect(page.getByRole("button", { name: /Target sign language/ })).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem("signPlan") || "{}").lang)).toBe("ASL");
  const first = page.getByRole("textbox", { name: "Source text for segment 1", exact: true });
  await first.fill("Hello my friend.");
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem("signPlan") || "{}").items?.map((item: { gloss: string }) => item.gloss).join(" "))).toContain("HELLO");
  await page.getByPlaceholder("Search gloss or source…").fill("Hello");
  await expect(page.getByRole("textbox", { name: /Source text for segment/ })).toHaveCount(1);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /SiGML/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("gesturesync-asl-demo.sigml");
  expect(await download.failure()).toBeNull();
});

test("demo is isolated from a stale uploaded-media session", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("sourceVideoUrl", "blob:expired");
    sessionStorage.setItem("sourceType", "file");
    sessionStorage.setItem("processedTranscript", JSON.stringify({ segments: [{ start: 0, end: 2, text: "STALE UPLOAD" }] }));
  });
  await openPlayer(page);
  await expect(page.getByTestId("source-caption")).toContainText("The woman thinks about food.");
  await expect(page.locator("video")).toHaveCount(0);
});

test("missing media keeps the translated transcript playable", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("sourceVideoUrl", "blob:expired");
    sessionStorage.setItem("sourceType", "file");
    sessionStorage.setItem("processedTranscript", JSON.stringify({ segments: [{ start: 0, end: 3, text: "Hello my friend." }] }));
  });
  await page.goto("/player/local");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  await expect(page.getByRole("status").filter({ hasText: "Source file is unavailable" })).toBeVisible();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect.poll(() => position(page)).toBeGreaterThan(0.4);
});

test("mobile player controls remain accessible without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPlayer(page);
  await page.getByRole("button", { name: /Gloss/, exact: false }).click();
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeInViewport();
  const dimensions = await page.evaluate(() => ({ full: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(dimensions.full).toBeLessThanOrEqual(dimensions.viewport + 1);
  await page.screenshot({ path: "logs/player-mobile.png" });
});

test("settings keeps the guest profile and sign-in path available", async ({ page }) => {
  await page.goto("/settings");
  const profile = page.getByRole("region", { name: "Profile", exact: true });
  await expect(profile.locator("dt")).toHaveText(["Name", "Email"]);
  await expect(profile.locator("dd")).toHaveText(["Guest", "Not signed in"]);
  await expect(page.getByRole("button", { name: /API Keys/ })).toHaveCount(0);
  const signIn = profile.getByRole("button", { name: "Sign in", exact: true });
  // Account-free deployments retain the same profile without offering sign-in.
  if (await signIn.count()) {
    await signIn.click();
    const dialog = page.getByRole("dialog", { name: "Sign in", exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Email Address", { exact: true })).toBeVisible();
    await expect(dialog.getByLabel("Password", { exact: true })).toBeVisible();
  }
  await page.reload();
  await expect(profile.locator("dd")).toHaveText(["Guest", "Not signed in"]);
});

test("upload handoff preserves a local file without sending legacy browser credentials", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gesturesync.apiKeys", JSON.stringify({ groq: "gsk-test-only", openai: "" })));
  // Mock only the paid transcription response; test the actual UI handoff and translator.
  let uploadedKey: string | undefined;
  await page.route("**/api/process-video", async (route) => {
    uploadedKey = route.request().headers()["x-groq-api-key"];
    await route.fulfill({ json: { success: true, projectId: null, segments: [{ start: 0, end: 3, text: "Hello my friend." }], duration: 3 } });
  });
  const translationKeys: string[] = [];
  await page.route("**/api/translate", async (route) => {
    const headers = { ...route.request().headers() };
    if (headers["x-groq-api-key"]) translationKeys.push(headers["x-groq-api-key"]);
    // Keep test credentials local even if this regression is reintroduced.
    delete headers["x-groq-api-key"];
    // Inspect the actual client headers above before optional quota-free
    // server fallback, so the credential-forwarding assertion stays intact.
    await route.continue({ headers: ruleGlossHeaders(headers) });
  });
  await page.goto("/dashboard");
  await page.locator('input[type="file"]').setInputFiles({ name: "test-audio.wav", mimeType: "audio/wav", buffer: Buffer.alloc(64) });
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page).toHaveURL(/\/player\/local$/);
  expect(uploadedKey).toBeUndefined();
  expect(await page.evaluate(() => sessionStorage.getItem("sourceType"))).toBe("file");
  expect(await page.evaluate(() => sessionStorage.getItem("sourceVideoUrl"))).toMatch(/^blob:/);
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeEnabled({ timeout: 60_000 });
  expect(translationKeys).toEqual([]);
});

test("oversized uploads are rejected before a request is sent", async ({ page }) => {
  let requested = false;
  page.on("request", (request) => { if (request.url().includes("/api/process-video")) requested = true; });
  await page.goto("/dashboard");
  await page.locator('input[type="file"]').setInputFiles({ name: "too-large.wav", mimeType: "audio/wav", buffer: Buffer.alloc(4 * 1024 * 1024 + 1) });
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "smaller than 4 MB" })).toBeVisible();
  expect(requested).toBe(false);
});
