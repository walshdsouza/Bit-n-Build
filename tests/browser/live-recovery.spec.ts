import { test, expect, type Page } from "@playwright/test";
import { buildSignPlan } from "../../lib/sign-plan";
import { glossByRules } from "../../lib/gloss-engine";
import { getProfile } from "../../lib/sign-languages";

type RecoveryWindow = Window & { __liveRecovery: { micCalls: number; tracks: MediaStreamTrack[] } };

async function microphoneFixture(page: Page) {
  await page.addInitScript(() => {
    const state: RecoveryWindow["__liveRecovery"] = { micCalls: 0, tracks: [] };
    (window as unknown as RecoveryWindow).__liveRecovery = state;
    // Real browser audio/worklet processing, with a synthetic input instead
    // of the user's microphone. The transcription responses are routed below.
    Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
      configurable: true,
      value: async () => {
        state.micCalls++;
        const context = new AudioContext();
        const tone = context.createOscillator();
        const gain = context.createGain();
        gain.gain.value = 0.1;
        const destination = context.createMediaStreamDestination();
        tone.connect(gain).connect(destination);
        tone.start();
        await context.resume();
        const tracks = destination.stream.getAudioTracks();
        state.tracks.push(...tracks);
        return destination.stream;
      },
    });
    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
      configurable: true,
      value: () => Promise.reject(new Error("A microphone-only retry must not open the tab picker")),
    });
  });
}

const signingPlan = buildSignPlan([{
  startTime: 0, endTime: 5, sourceText: "Hello my friend.", gloss: "HELLO FRIEND", nmm: [], status: "queued",
}], { lang: "ASL", duration: 5 });
const captionOnlyPlan = buildSignPlan([{
  startTime: 0, endTime: 5, sourceText: "And.", gloss: glossByRules("And.", getProfile("ASL")).join(" "), nmm: [], status: "queued",
}], { lang: "ASL", duration: 5 });

async function expectReleased(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const tracks = (window as unknown as RecoveryWindow).__liveRecovery.tracks;
    return tracks.length > 0 && tracks.every((track) => track.readyState === "ended");
  })).toBe(true);
}

async function expectSigningClock(page: Page) {
  const avatar = page.getByRole("region", { name: "Live ASL avatar" });
  await expect(page.getByTestId("live-current-caption")).toHaveText("Hello my friend.");
  // The actual loaded rig must advance between signs, not merely show a
  // transcript beside a permanently paused or unloaded avatar.
  await expect(avatar.getByText("HELLO", { exact: true })).toBeVisible();
  await expect(avatar.getByText("FRIEND", { exact: true })).toBeVisible();
}

test("a caption-only chunk keeps listening and the next chunk advances real signing", async ({ page }) => {
  await microphoneFixture(page);
  let requests = 0;
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  expect(captionOnlyPlan.items).toHaveLength(0);
  await page.route("**/api/live", async (route) => {
    requests++;
    await route.fulfill({ json: requests === 1
      ? { speech: true, text: "And.", plan: captionOnlyPlan }
      : requests === 2 ? { speech: true, text: "Hello my friend.", plan: signingPlan }
        : { speech: false },
    });
  });
  await page.goto("/live");
  await expect(page.getByText("Loading NEXA…", { exact: true })).toBeHidden({ timeout: 60_000 });
  await page.getByRole("radio", { name: /My microphone/ }).check();
  await page.getByRole("button", { name: "Start live captions", exact: true }).click();
  await expect(page.getByRole("log", { name: "Meeting captions" }).getByText("And.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop sharing", exact: true })).toBeVisible();
  await expect(page.getByRole("alert", { name: "Live meeting feedback" })).toHaveCount(0);
  await expect(page.getByTestId("live-current-caption")).toHaveText("Speak into your microphone to start signing.");
  await expectSigningClock(page);
  expect(requests).toBeGreaterThanOrEqual(2);
  expect(await page.evaluate(() => (window as unknown as RecoveryWindow).__liveRecovery.micCalls)).toBe(1);
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
  await expectReleased(page);
  expect(pageErrors).toEqual([]);
});

test("a failed first avatar load stops capture and Start again reloads the rig and signs", async ({ page }) => {
  await microphoneFixture(page);
  let modelRequests = 0;
  let releaseFailure: (() => Promise<void>) | undefined;
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("**/models/nexa.glb", async (route) => {
    modelRequests++;
    if (modelRequests === 1) {
      await new Promise<void>((resolve) => {
        releaseFailure = async () => { await route.abort("failed"); resolve(); };
      });
    } else await route.continue();
  });
  await page.route("**/api/live", (route) => route.fulfill({ json: {
    speech: true, text: "Hello my friend.", plan: signingPlan,
  } }));
  await page.goto("/live");
  await expect.poll(() => Boolean(releaseFailure)).toBe(true);
  await page.getByRole("radio", { name: /My microphone/ }).check();
  await page.getByRole("button", { name: "Start live captions", exact: true }).click();
  await expect(page.getByRole("button", { name: "Stop sharing", exact: true })).toBeVisible();
  await expect(page.getByRole("log", { name: "Meeting captions" })).toContainText("Hello my friend.");
  await expect(page.getByText("Your signs are saved while the avatar loads.", { exact: true })).toBeVisible();
  await releaseFailure!();
  const feedback = page.getByRole("alert", { name: "Live meeting feedback" });
  await expect(feedback).toContainText("The avatar could not load");
  await expectReleased(page);
  await expect(page.getByRole("button", { name: "Stop sharing", exact: true })).toHaveCount(0);
  await feedback.getByRole("button", { name: "Start again", exact: true }).click();
  await expect.poll(() => modelRequests).toBeGreaterThanOrEqual(2);
  await expect(page.getByText("Loading NEXA…", { exact: true })).toBeHidden({ timeout: 60_000 });
  await expect(page.getByText("Your signs are saved while the avatar loads.", { exact: true })).toHaveCount(0);
  await expect(feedback).toHaveCount(0);
  await expectSigningClock(page);
  expect(await page.evaluate(() => (window as unknown as RecoveryWindow).__liveRecovery.micCalls)).toBe(2);
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
  await expectReleased(page);
  expect(pageErrors).toEqual([]);
});
