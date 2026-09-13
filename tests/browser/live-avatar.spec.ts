import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { buildSignPlan } from "../../lib/sign-plan";

const model = readFileSync("public/models/nexa.glb");
const gltf = JSON.parse(model.subarray(20, 20 + model.readUInt32LE(12)).toString());
const joints: string[] = gltf.skins[0].joints.map((index: number) => gltf.nodes[index].name);
const bones = ["RightUpperArm", "RightLowerArm", "RightHand", "RightIndex1", "LeftHand"];
const indexes = bones.map(name => joints.indexOf(name));
const matrixLength = Math.max(4, Math.ceil(Math.sqrt(joints.length * 4) / 4) * 4) ** 2 * 4;
interface BoneSample { at: number; matrices: number[]; caption: string | null }
interface FixtureState { samples: BoneSample[]; hidden: boolean }
type FixtureWindow = Window & { __avatarFixture: FixtureState };

const plans = [
  buildSignPlan([{ startTime: 0, endTime: 5, sourceText: "Hello my friend.", gloss: "HELLO FRIEND", nmm: [], status: "queued" }], { lang: "ASL", duration: 5 }),
  buildSignPlan([{ startTime: 0, endTime: 5, sourceText: "Thank you for your help.", gloss: "THANK_YOU HELP", nmm: [], status: "queued" }], { lang: "ASL", duration: 5 }),
];
const captions = ["Hello my friend.", "Thank you for your help."];

async function instrument(page: Page, speechChunks = 1) {
  await page.addInitScript(({ indexes, matrixLength }) => {
    const state: FixtureState = { samples: [], hidden: false };
    (window as unknown as FixtureWindow).__avatarFixture = state;
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state.hidden ? "hidden" : "visible" });
    Object.defineProperty(document, "hidden", { configurable: true, get: () => state.hidden });

    // Observe the real GPU skinning palette, after Three has applied the rig.
    // This is independent of caption text, React props, and canvas presence.
    const nativeUpload = WebGL2RenderingContext.prototype.texSubImage2D;
    WebGL2RenderingContext.prototype.texSubImage2D = function (this: WebGL2RenderingContext, ...args: unknown[]) {
      const data = args.find(value => value instanceof Float32Array && value.length === matrixLength) as Float32Array | undefined;
      if (data && state.samples.length < 4000) state.samples.push({
        at: performance.now(),
        matrices: indexes.flatMap(index => Array.from(data.subarray(index * 16, index * 16 + 16))),
        caption: document.querySelector('[data-testid="live-current-caption"]')?.textContent ?? null,
      });
      return (nativeUpload as (...values: unknown[]) => void).apply(this, args);
    } as WebGL2RenderingContext["texSubImage2D"];

    // Only replace the picker. Real browser tracks, worklet, WAV chunks, and
    // live queue run normally; fixture tones are never sent to paid ASR.
    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", { configurable: true, value: async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 160; canvas.height = 90;
      canvas.getContext("2d")!.fillRect(0, 0, 160, 90);
      const tracks = canvas.captureStream(1).getVideoTracks();
      const settings = tracks[0].getSettings.bind(tracks[0]);
      Object.defineProperty(tracks[0], "getSettings", { value: () => ({ ...settings(), displaySurface: "browser" }) });
      const audio = new AudioContext();
      const tone = audio.createOscillator();
      const gain = audio.createGain();
      gain.gain.value = 0.1;
      const destination = audio.createMediaStreamDestination();
      tone.connect(gain).connect(destination);
      tone.start();
      await audio.resume();
      return new MediaStream([...tracks, ...destination.stream.getAudioTracks()]);
    } });
  }, { indexes, matrixLength });
  let count = 0;
  await page.route("**/api/live", route => {
    const index = count++;
    return route.fulfill({ json: index < speechChunks ? { speech: true, text: captions[index], plan: plans[index] } : { speech: false } });
  });
}

const samples = (page: Page) => page.evaluate(() => (window as unknown as FixtureWindow).__avatarFixture.samples);
const clearSamples = (page: Page) => page.evaluate(() => { (window as unknown as FixtureWindow).__avatarFixture.samples = []; });
const currentCaption = (page: Page) => page.getByTestId("live-current-caption");
const motionWait = { timeout: 30_000, intervals: [100, 200, 300] };

function matrixRanges(frames: BoneSample[]) {
  return bones.map((bone, index) => ({ bone, range: Math.max(...Array.from({ length: 16 }, (_, component) => {
    const values = frames.map(frame => frame.matrices[index * 16 + component]);
    return Math.max(...values) - Math.min(...values);
  })) }));
}

async function assertArticulation(page: Page, caption: string) {
  let frames: BoneSample[] = [];
  let ranges: ReturnType<typeof matrixRanges> = [];
  try {
    // A busy GPU can take longer to render a complete articulation. Wait for
    // the measured result, preserving both frame and movement requirements.
    await expect.poll(async () => {
      frames = (await samples(page)).filter(frame => frame.caption === caption);
      ranges = frames.length ? matrixRanges(frames) : [];
      const range = (bone: string) => ranges.find(value => value.bone === bone)?.range ?? 0;
      return {
        renderedFrames: frames.length > 15,
        rightHand: range("RightHand") > 0.2,
        indexFinger: range("RightIndex1") > 0.2,
        forearm: range("RightLowerArm") > 0.1,
      };
    }, { ...motionWait, message: `Wait for substantive GPU bone movement while signing: ${caption}` })
      .toEqual({ renderedFrames: true, rightHand: true, indexFinger: true, forearm: true });
  } finally {
    await test.info().attach("rendered-bone-motion", { body: JSON.stringify({ caption, frames: frames.length, ranges }, null, 2), contentType: "application/json" });
  }
}

test("sequential live plans move the real arm, hand, and finger skeleton", async ({ page }) => {
  await instrument(page, 2);
  await page.goto("/live");
  await page.getByText("Loading NEXA…").waitFor({ state: "hidden", timeout: 60_000 });
  await page.getByRole("button", { name: "Start live captions", exact: true }).click();
  for (const caption of captions) {
    await expect(currentCaption(page)).toHaveText(caption);
    await assertArticulation(page, caption);
  }
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
});

test("a queued plan waits for a delayed model and then articulates visibly", async ({ page }) => {
  await instrument(page);
  let release!: () => void;
  const modelReady = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/models/nexa.glb", async route => {
    await modelReady;
    await route.fulfill({ body: model, contentType: "model/gltf-binary" });
  });
  await page.goto("/live");
  await page.getByRole("button", { name: "Start live captions", exact: true }).click();
  await expect(currentCaption(page)).toHaveText(captions[0]);
  await page.waitForTimeout(plans[0].duration * 1000 + 600);
  await expect(currentCaption(page)).toHaveText(captions[0]);
  expect((await samples(page)).length).toBe(0);
  release();
  await page.getByText("Loading NEXA…").waitFor({ state: "hidden" });
  await assertArticulation(page, captions[0]);
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
});

test("a hidden page preserves its active sign and resumes bone movement on return", async ({ page }) => {
  await instrument(page);
  await page.goto("/live");
  await page.getByText("Loading NEXA…").waitFor({ state: "hidden", timeout: 60_000 });
  await page.getByRole("button", { name: "Start live captions", exact: true }).click();
  await expect(currentCaption(page)).toHaveText(captions[0]);
  await expect.poll(async () => (await samples(page)).filter(frame => frame.caption === captions[0]).length, motionWait).toBeGreaterThan(2);
  const hiddenAt = await page.evaluate(() => {
    (window as unknown as FixtureWindow).__avatarFixture.hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    return performance.now();
  });
  // Wait for three newly rendered palettes to agree. A fixed delay can end
  // before React's final paused timestamp reaches a renderer under GPU load.
  await expect.poll(async () => {
    const frames = (await samples(page)).filter(frame => frame.at >= hiddenAt);
    if (frames.length < 3) return Number.POSITIVE_INFINITY;
    return Math.max(...matrixRanges(frames.slice(-3)).map(bone => bone.range));
  }, { ...motionWait, message: "Wait for repeated stable GPU bone palettes after hiding" }).toBeLessThan(0.00001);
  await clearSamples(page);
  await page.waitForTimeout(plans[0].duration * 1000 + 500);
  await expect.poll(async () => (await samples(page)).length, motionWait).toBeGreaterThan(15);
  await expect(currentCaption(page)).toHaveText(captions[0]);
  const held = await samples(page);
  expect(held.length).toBeGreaterThan(15);
  expect(Math.max(...matrixRanges(held).map(bone => bone.range))).toBeLessThan(0.00001);
  await clearSamples(page);
  await page.evaluate(() => {
    (window as unknown as FixtureWindow).__avatarFixture.hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  // The first letters intentionally hold the wrist still. The measurement
  // waits through FRIEND too, until transport and finger motion are observed.
  await assertArticulation(page, captions[0]);
  await page.getByRole("button", { name: "Stop sharing", exact: true }).click();
});
