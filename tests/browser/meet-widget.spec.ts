import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

const host = (page: Page) => page.locator("#gesturesync-widget-root");
const widget = (page: Page) => page.frameLocator('iframe[title="UNMUTE live sign language"]');
const moveControl = (page: Page) => page.getByRole("button", { name: "Move UNMUTE widget. Use arrow keys to reposition.", exact: true });
const resizeControl = (page: Page) => page.getByRole("button", { name: "Resize UNMUTE widget. Use arrow keys to resize.", exact: true });

async function openWidget(page: Page) {
  let providerRequests = 0;
  await page.route(/https:\/\/api\.(?:groq|openai)\.com\//, route => { providerRequests++; return route.abort(); });
  await page.route("https://meet.google.com/**", route => route.fulfill({
    contentType: "text/html",
    body: '<!doctype html><html><head><title>Controlled Meet fixture</title></head><body style="margin:0;background:#202124;color:white;font-family:system-ui"><main style="padding:40px"><h1>Meeting layout fixture</h1><p>No real meeting or microphone is connected.</p><button id="meeting-control" onclick="this.dataset.clicks=String(Number(this.dataset.clicks||0)+1)" style="padding:12px">Meeting toolbar</button></main></body></html>',
  }));
  await page.route("https://extension.test/**", route => {
    const basename = path.basename(new URL(route.request().url()).pathname);
    const allowed = ["widget.html", "widget.js", "widget.css", "nexa.glb"];
    if (!allowed.includes(basename)) return route.fulfill({ status: 404, body: "Unknown fixture asset" });
    const contentType = basename.endsWith(".html") ? "text/html" : basename.endsWith(".js") ? "text/javascript" : basename.endsWith(".css") ? "text/css" : "model/gltf-binary";
    return route.fulfill({ contentType, body: readFileSync(path.join(process.cwd(), "extension", "dist", basename)) });
  });
  await page.addInitScript(() => {
    const fixture = window as unknown as {
      runtimeMessages: Array<{ type: string }>;
      browser: { runtime: object; storage: object };
    };
    fixture.runtimeMessages = [];
    fixture.browser = {
      runtime: {
        getURL: (resource: string) => `https://extension.test/${resource}`,
        sendMessage: async (message: { type: string }) => {
          fixture.runtimeMessages.push(message);
          if (message.type === "UNMUTE_WIDGET_TOKEN") return { token: "test-only-widget-token" };
          return { owner: null, captureSessionId: null };
        },
        openOptionsPage: async () => {},
      },
      storage: { local: { get: async () => ({ targetLanguage: "ASL", groqApiKey: "gsk-invalid-widget-fixture" }), set: async () => {} } },
    };
  });
  await page.goto("https://meet.google.com/fixture-room");
  await page.addScriptTag({ path: path.join(process.cwd(), "extension", "dist", "meet-widget.js") });
  await expect(widget(page).getByRole("button", { name: "Start live captions", exact: true })).toBeVisible();
  return { providerRequests: () => providerRequests };
}

async function expectInBounds(page: Page) {
  const box = await host(page).boundingBox();
  const viewport = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(8);
  expect(box!.y).toBeGreaterThanOrEqual(8);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width - 7);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height - 7);
  return box!;
}

test("floating widget renders the real NEXA iframe and leaves meeting controls usable", async ({ page }) => {
  const fixture = await openWidget(page);
  const box = await expectInBounds(page);
  expect(box.width).toBe(280);
  expect(box.height).toBe(320);
  await expect(widget(page).getByText("Loading NEXA…")).toBeHidden({ timeout: 60_000 });
  await expect(widget(page).locator("canvas")).toBeVisible();
  const canvas = await widget(page).locator("canvas").boundingBox();
  expect(canvas!.width).toBeGreaterThan(200);
  expect(canvas!.height).toBeGreaterThan(80);
  await page.getByRole("button", { name: "Meeting toolbar", exact: true }).click();
  await expect(page.locator("#meeting-control")).toHaveAttribute("data-clicks", "1");
  await expect(widget(page).getByText("Choose a source and press Start.")).toBeVisible();
  expect(fixture.providerRequests()).toBe(0);
  await page.screenshot({ path: "logs/meet-widget-desktop.png" });
  await host(page).screenshot({ path: "logs/meet-widget-closeup.png" });
});

test("dragging, resizing and keyboard controls keep the widget inside the viewport", async ({ page }) => {
  await openWidget(page);
  const original = await expectInBounds(page);
  const move = await moveControl(page).boundingBox();
  await page.mouse.move(move!.x + 30, move!.y + 18);
  await page.mouse.down();
  await page.mouse.move(move!.x - 370, move!.y - 282, { steps: 8 });
  await page.mouse.up();
  const moved = await expectInBounds(page);
  expect(moved.x).toBeLessThan(original.x - 300);
  expect(moved.y).toBeLessThan(original.y - 200);
  const grip = await resizeControl(page).boundingBox();
  await page.mouse.move(grip!.x + 11, grip!.y + 11);
  await page.mouse.down();
  await page.mouse.move(grip!.x + 151, grip!.y + 91, { steps: 8 });
  await page.mouse.up();
  const resized = await expectInBounds(page);
  expect(resized.width).toBeCloseTo(original.width + 140, 0);
  expect(resized.height).toBeCloseTo(original.height + 80, 0);
  await resizeControl(page).focus();
  await page.keyboard.press("ArrowRight");
  expect((await expectInBounds(page)).width).toBe(resized.width + 10);
  await moveControl(page).focus();
  await page.keyboard.press("Shift+ArrowLeft");
  expect((await expectInBounds(page)).x).toBe(resized.x - 40);
  await page.setViewportSize({ width: 390, height: 700 });
  const small = await expectInBounds(page);
  expect(small.width).toBeLessThanOrEqual(374);
  await resizeControl(page).focus();
  for (let i = 0; i < 10; i++) await page.keyboard.press("Shift+ArrowRight");
  expect((await expectInBounds(page)).width).toBe(374);
  await page.setViewportSize({ width: 320, height: 568 });
  await expectInBounds(page);
  await expect(widget(page).getByRole("button", { name: "Start live captions", exact: true })).toBeInViewport();
  await page.screenshot({ path: "logs/meet-widget-small.png" });
});

test("minimize, expand, hide and reopen preserve widget geometry", async ({ page }) => {
  await openWidget(page);
  const original = await expectInBounds(page);
  await widget(page).getByRole("button", { name: "Minimize widget", exact: true }).click();
  await expect(widget(page).getByRole("button", { name: "Expand widget", exact: true })).toBeVisible();
  expect((await host(page).boundingBox())!.height).toBe(36);
  await expect(resizeControl(page)).toBeHidden();
  await widget(page).getByRole("button", { name: "Expand widget", exact: true }).click();
  await expect(widget(page).getByRole("button", { name: "Start live captions", exact: true })).toBeVisible();
  expect((await expectInBounds(page)).height).toBe(original.height);
  await widget(page).getByRole("button", { name: "Hide widget", exact: true }).click();
  await expect(page.locator('iframe[title="UNMUTE live sign language"]')).toBeHidden();
  const reopen = page.getByRole("button", { name: "Show UNMUTE widget", exact: true });
  await expect(reopen).toBeInViewport();
  await reopen.focus();
  await page.keyboard.press("Enter");
  await expect(reopen).toBeHidden();
  await expect(widget(page).getByRole("button", { name: "Start live captions", exact: true })).toBeVisible();
  expect(await expectInBounds(page)).toEqual(original);
});

test("Meet replacing its body reattaches one widget without duplicate injection", async ({ page }) => {
  await openWidget(page);
  await moveControl(page).focus();
  await page.keyboard.press("ArrowLeft");
  const original = await expectInBounds(page);
  await page.evaluate(() => {
    const nextBody = document.createElement("body");
    nextBody.innerHTML = '<main><h1>Changed meeting layout</h1><button>Replacement toolbar</button></main>';
    document.body.replaceWith(nextBody);
  });
  await expect(host(page)).toHaveCount(1);
  await expect(widget(page).getByRole("button", { name: "Start live captions", exact: true })).toBeVisible();
  expect(await expectInBounds(page)).toEqual(original);
  await page.addScriptTag({ path: path.join(process.cwd(), "extension", "dist", "meet-widget.js") });
  await expect(host(page)).toHaveCount(1);
  await expect(page.locator('iframe[title="UNMUTE live sign language"]')).toHaveCount(1);
});

test("page-forged capture commands and tokenless iframe audio never start transcription", async ({ page }) => {
  const fixture = await openWidget(page);
  await page.evaluate(() => {
    const frame = document.getElementById("gesturesync-widget-root")!.shadowRoot!.querySelector("iframe")!;
    window.dispatchEvent(new MessageEvent("message", {
      origin: "https://extension.test", source: frame.contentWindow,
      data: { channel: "unmute-widget", type: "WIDGET_START" },
    }));
    frame.contentWindow!.postMessage({ channel: "unmute-widget", type: "WIDGET_STATE", owner: "widget", captureSessionId: "forged" }, "https://extension.test");
    frame.contentWindow!.postMessage({ channel: "unmute-widget", type: "AUDIO_CHUNK", blob: new Blob(["forged audio"], { type: "audio/webm" }) }, "https://extension.test");
  });
  await page.waitForTimeout(500);
  await expect(widget(page).getByRole("button", { name: "Start live captions", exact: true })).toBeVisible();
  await expect(widget(page).getByRole("button", { name: "Stop sharing", exact: true })).toHaveCount(0);
  expect(fixture.providerRequests()).toBe(0);
  const messages = await page.evaluate(() => (window as unknown as { runtimeMessages: Array<{ type: string }> }).runtimeMessages);
  expect(messages.some(message => message.type === "UNMUTE_WIDGET_START")).toBe(false);
});
