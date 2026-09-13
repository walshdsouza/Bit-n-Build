import { test, expect } from "@playwright/test";

const sourceUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

test("dashboard reports whether transcription is available without exposing provider setup", async ({ page }) => {
  // Set to groq, openai, or none for the server under test; no credentials are needed by this test.
  const provider = process.env.UI_TEST_SERVER_PROVIDER;
  test.skip(!provider, "Set UI_TEST_SERVER_PROVIDER to assert the expected server configuration.");
  await page.goto("/dashboard");
  if (provider === "none") {
    await expect(page.getByText("Audio transcription is currently unavailable. Please try again later.", { exact: true })).toBeVisible();
  } else {
    await expect(page.getByText("Converts speech into English captions", { exact: true })).toBeVisible();
    await expect(page.getByText("Audio transcription is ready.", { exact: true })).toBeVisible();
  }
  await expect(page.getByRole("link", { name: "Configure API keys" })).toHaveCount(0);
  await expect(page.getByText(/Groq|OpenAI|API key/i)).toHaveCount(0);
});

test("failed YouTube imports preserve the URL, display the API error and retry the same source", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gesturesync.apiKeys", JSON.stringify({ groq: "gsk-test-only", openai: "" })));
  const requests: string[] = [];
  const message = "YouTube refused caption access for this video. The configured transcription provider is available for uploaded audio.";
  await page.route("**/api/process-video", async (route) => {
    requests.push(route.request().postDataJSON().url);
    await route.fulfill({ status: 422, json: { error: message, code: "YOUTUBE_CAPTIONS_UNAVAILABLE", recovery: "upload_or_transcript" } });
  });
  await page.goto("/dashboard");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(sourceUrl);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("alert", { name: "Import error" })).toHaveText(message);
  await expect(page.getByRole("textbox", { name: "YouTube URL" })).toHaveValue(sourceUrl);
  await expect(page.getByRole("button", { name: "Choose a file instead" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Configure API keys" })).toHaveCount(0);
  await expect(page.getByText("Pipeline Ready", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Retry import" }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(requests).toEqual([sourceUrl, sourceUrl]);
  await expect(page).toHaveURL(/\/dashboard$/);

  const chooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Choose a file instead" }).click();
  const chooser = await chooserPromise;
  await chooser.setFiles({ name: "spoken-audio.wav", mimeType: "audio/wav", buffer: Buffer.alloc(64) });
  await expect(page.getByRole("textbox", { name: "YouTube URL" })).toHaveValue("");
  await expect(page.getByText("spoken-audio.wav", { exact: true })).toBeVisible();
  await expect(page.getByRole("alert", { name: "Import error" })).toHaveCount(0);
});

test("gateway timeouts show a useful retry message instead of a JSON parsing error", async ({ page }) => {
  await page.route("**/api/process-video", (route) => route.fulfill({ status: 504, contentType: "text/html", body: "<html>Gateway timeout</html>" }));
  await page.goto("/dashboard");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(sourceUrl);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("alert", { name: "Import error" })).toContainText("The import timed out.");
  await expect(page.getByRole("button", { name: "Retry import" })).toBeEnabled();
  await expect(page.getByRole("textbox", { name: "YouTube URL" })).toHaveValue(sourceUrl);
});

test("empty transcript responses never navigate to a fake successful translation", async ({ page }) => {
  await page.route("**/api/process-video", (route) => route.fulfill({ json: { success: true, segments: [], duration: 0 } }));
  await page.goto("/dashboard");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(sourceUrl);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("alert", { name: "Import error" })).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard$/);
  expect(await page.evaluate(() => sessionStorage.getItem("processedTranscript"))).toBeNull();
});

test("no-speech errors remain distinct from API-key configuration errors", async ({ page }) => {
  const message = "No clear speech was detected in this recording. Choose a source with spoken audio or captions.";
  await page.route("**/api/process-video", (route) => route.fulfill({ status: 422, json: { error: message, code: "NO_SPEECH" } }));
  await page.goto("/dashboard");
  await expect(page.getByText("Translates speech or captions into ASL signs. Hand movements in source videos are not recognized.", { exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(sourceUrl);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("alert", { name: "Import error" })).toHaveText(message);
  await expect(page.getByRole("button", { name: "Choose a file instead" })).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard$/);
});
