import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const shell = "https://extension.test/";

async function settingsFixture(page: Page) {
  await page.route(`${shell}**`, async route => {
    if (route.request().url().endsWith("/dist/nexa.glb")) return route.fulfill({ contentType: "model/gltf-binary", body: readFileSync("public/models/nexa.glb") });
    return route.fulfill({ contentType: "text/html", body: '<div id="root"></div>' });
  });
  await page.addInitScript(() => {
    Object.assign(window, { browser: {
      runtime: { getURL: (path: string) => `https://extension.test/${path}` },
      tabs: { create: async ({ url }: { url: string }) => { document.body.dataset.openedUrl = url; } },
      storage: { local: { get: async () => { throw new Error("Legacy API key storage should not be read"); } } },
    } });
  });
  await page.goto(shell);
}

test("extension settings explain hosted transcription without API keys or language controls", async ({ page }) => {
  await settingsFixture(page);
  await page.addScriptTag({ path: "extension/dist/options.js" });
  await expect(page.getByRole("heading", { name: "UNMUTE", exact: true })).toBeVisible();
  await expect(page.getByText("Transcription is provided by UNMUTE. You do not need an API key.")).toBeVisible();
  await expect(page.locator("input, select")).toHaveCount(0);
  await page.getByRole("button", { name: "Open UNMUTE Live Meetings", exact: true }).click();
  await expect(page.locator("body")).toHaveAttribute("data-opened-url", "https://unmute-ai.vercel.app/live");
});

test("sidebar offers shared audio sources immediately without a personal key", async ({ page }) => {
  const errors: string[] = [];
  let providerCalls = 0;
  page.on("pageerror", error => errors.push(error.message));
  await page.route(/https:\/\/(api\.(groq|openai)\.com|unmute-ai\.vercel\.app)\//, route => { providerCalls++; return route.abort(); });
  await settingsFixture(page);
  await page.addStyleTag({ path: "extension/dist/widget.css" });
  await page.addScriptTag({ path: "extension/dist/sidebar.js" });
  await expect(page.getByRole("button", { name: "Start live captions", exact: true })).toBeEnabled();
  await expect(page.getByLabel("Audio source")).toHaveValue("tab");
  await expect(page.getByLabel("Audio source").locator("option")).toHaveText(["Meeting audio", "My microphone", "Meeting + microphone"]);
  await page.getByLabel("Audio source").selectOption("microphone");
  await expect(page.getByLabel("Audio source")).toHaveValue("microphone");
  await expect(page.getByText("Live ASL", { exact: true })).toBeVisible();
  await expect(page.getByRole("meter", { name: "Input audio level" })).toBeVisible();
  expect(providerCalls).toBe(0);
  expect(errors).toEqual([]);
});
