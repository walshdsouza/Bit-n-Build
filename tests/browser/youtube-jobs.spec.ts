import { test, expect } from "@playwright/test";
import { useRuleGlossWhenRequested } from "./rule-gloss-fixture";

test.beforeEach(async ({ page }) => useRuleGlossWhenRequested(page));

const url = "https://www.youtube.com/watch?v=jNQXAC9IVRw";
const result = { success: true, projectId: null, segments: [{ start: 0, end: 3, text: "Hello my friend." }], duration: 3 };

test("long YouTube jobs poll the existing import and open the completed transcript", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gesturesync.apiKeys", JSON.stringify({ supadata: "test-youtube-key" })));
  const requests: Array<{ url: string; jobToken?: string }> = [];
  await page.route("**/api/process-video", async (route) => {
    requests.push(route.request().postDataJSON());
    // Legacy browser keys must not override this deployment's credentials.
    expect(route.request().headers()["x-supadata-api-key"]).toBeUndefined();
    await route.fulfill(requests.length < 3
      ? { status: 202, json: { pending: true, jobToken: "signed-test-job", pollAfterMs: 1000 } }
      : { json: result });
  });
  await page.goto("/dashboard");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(url);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("button", { name: "Preparing YouTube transcript…" })).toBeDisabled();
  await expect(page).toHaveURL(/\/player\/local$/);
  expect(requests).toEqual([{ url }, { url, jobToken: "signed-test-job" }, { url, jobToken: "signed-test-job" }]);
  expect(await page.evaluate(() => sessionStorage.getItem("youtubeImportJob"))).toBeNull();
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("processedTranscript") || "{}").segments)).toEqual(result.segments);
});

test("stopping a pending YouTube job preserves a resumable token without another initial import", async ({ page }) => {
  const requests: Array<{ url: string; jobToken?: string }> = [];
  let complete = false;
  await page.route("**/api/process-video", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill(complete ? { json: result } : { status: 202, json: { pending: true, jobToken: "resume-this-job", pollAfterMs: 10000 } });
  });
  await page.goto("/dashboard");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(url);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("button", { name: "Preparing YouTube transcript…" })).toBeVisible();
  await page.getByRole("button", { name: "Stop import" }).click();
  await expect(page.getByRole("alert", { name: "Import error" })).toContainText("Import stopped");
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("youtubeImportJob") || "{}").jobToken)).toBe("resume-this-job");
  complete = true;
  await page.getByRole("button", { name: "Retry import" }).click();
  await expect(page).toHaveURL(/\/player\/local$/);
  expect(requests).toEqual([{ url }, { url, jobToken: "resume-this-job" }]);
});

test("malformed saved job state cannot prevent a fresh YouTube request", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("youtubeImportJob", "null"));
  let requested = false;
  await page.route("**/api/process-video", async (route) => {
    requested = true;
    expect(route.request().postDataJSON()).toEqual({ url });
    await route.fulfill({ status: 422, json: { error: "Test source is unavailable.", code: "YOUTUBE_VIDEO_UNAVAILABLE" } });
  });
  await page.goto("/dashboard");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(url);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("alert", { name: "Import error" })).toHaveText("Test source is unavailable.");
  expect(requested).toBe(true);
  expect(await page.evaluate(() => sessionStorage.getItem("youtubeImportJob"))).toBeNull();
});

test("long provider backoff stops polling and preserves the same job for manual retry", async ({ page }) => {
  await page.clock.install();
  const requests: Array<{ url: string; jobToken?: string }> = [];
  let complete = false;
  await page.route("**/api/process-video", async route => {
    requests.push(route.request().postDataJSON());
    await route.fulfill(complete
      ? { json: result }
      : { status: 202, json: { pending: true, jobToken: "quota-preserved-job", pollAfterMs: 120000 } });
  });
  await page.goto("/dashboard");
  await page.getByRole("textbox", { name: "YouTube URL" }).fill(url);
  await page.getByRole("button", { name: /Synthesize ASL/ }).click();
  await expect(page.getByRole("alert", { name: "Import error" })).toHaveText("The translation service is busy. Your progress is saved. Retry in 2 minutes.");
  await expect(page.getByRole("button", { name: "Retry import" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Preparing YouTube transcript…" })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("youtubeImportJob") || "{}").jobToken)).toBe("quota-preserved-job");
  await page.clock.fastForward(120000);
  expect(requests).toEqual([{ url }]);
  complete = true;
  await page.getByRole("button", { name: "Retry import" }).click();
  await expect(page).toHaveURL(/\/player\/local$/);
  expect(requests).toEqual([{ url }, { url, jobToken: "quota-preserved-job" }]);
  expect(await page.evaluate(() => sessionStorage.getItem("youtubeImportJob"))).toBeNull();
});
