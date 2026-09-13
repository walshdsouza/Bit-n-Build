import { test, expect, type Frame } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const extensionOrigin = "https://extension.test";
const token = "test-only-widget-token";
const model = readFileSync("public/models/nexa.glb");
const gltf = JSON.parse(model.subarray(20, 20 + model.readUInt32LE(12)).toString());
const joints: string[] = gltf.skins[0].joints.map((index: number) => gltf.nodes[index].name);
const bones = ["RightLowerArm", "RightHand", "RightIndex1"];
const indexes = bones.map(name => joints.indexOf(name));
const matrixLength = Math.max(4, Math.ceil(Math.sqrt(joints.length * 4) / 4) * 4) ** 2 * 4;
const caption = "Hello my friend. Thank you for your help.";

interface Sample { matrices: number[]; caption: string | null }
interface WidgetProbe {
  samples: Sample[];
  requests: { url: string; model: string | null; filename: string | null }[];
  starts: number;
  stops: number;
  aborted: number;
  releaseStale?: () => void;
}
type ProbeWindow = Window & { __widgetProbe: WidgetProbe };

function ranges(samples: Sample[]) {
  return bones.map((bone, index) => ({ bone, range: Math.max(...Array.from({ length: 16 }, (_, component) => {
    const values = samples.map(sample => sample.matrices[index * 16 + component]);
    return Math.max(...values) - Math.min(...values);
  })) }));
}
const snapshot = (frame: Frame) => frame.evaluate(() => {
  const state = (window as unknown as ProbeWindow).__widgetProbe;
  return { samples: state.samples, requests: state.requests, starts: state.starts, stops: state.stops, aborted: state.aborted };
});

test("compiled Meet widget requires Start, articulates real NEXA bones, and rejects speech after Stop", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("https://meet.google.com/**", route => route.fulfill({
    contentType: "text/html", body: '<!doctype html><html><body><h1>Controlled meeting fixture</h1><iframe title="UNMUTE fixture" src="https://extension.test/dist/widget.html" style="width:420px;height:540px;border:0"></iframe></body></html>',
  }));
  await page.route(`${extensionOrigin}/**`, route => {
    const filename = path.basename(new URL(route.request().url()).pathname);
    const types: Record<string, string> = { "widget.html": "text/html", "widget.js": "application/javascript", "widget.css": "text/css", "nexa.glb": "model/gltf-binary" };
    if (!types[filename]) return route.abort();
    return route.fulfill({ contentType: types[filename], body: filename === "nexa.glb" ? model : readFileSync(path.join("extension/dist", filename)) });
  });
  // Backstop: even a missing fixture interception must never reach paid ASR.
  await page.route("https://api.groq.com/**", route => route.abort());
  await page.route("https://api.openai.com/**", route => route.abort());
  await page.addInitScript(({ indexes, matrixLength, extensionOrigin, token, caption }) => {
    if (location.origin !== extensionOrigin) return;
    const state: WidgetProbe = { samples: [], requests: [], starts: 0, stops: 0, aborted: 0 };
    (window as unknown as ProbeWindow).__widgetProbe = state;
    let owner: "widget" | null = null;
    const runtime = {
      getURL: (file: string) => `${extensionOrigin}/${file}`,
      openOptionsPage: async () => {},
      sendMessage: async (message: { type: string; captureSessionId?: string }) => {
        if (message.type === "UNMUTE_WIDGET_TOKEN") return { token };
        if (message.type === "UNMUTE_WIDGET_START") { state.starts++; owner = "widget"; return { owner, captureSessionId: "fixture-session" }; }
        if (message.type === "UNMUTE_WIDGET_STOP") { state.stops++; owner = null; return { owner, captureSessionId: "fixture-session" }; }
        return { owner, captureSessionId: owner ? "fixture-session" : null };
      },
    };
    Object.defineProperty(window, "browser", { configurable: true, value: {
      runtime, storage: { local: { get: async () => ({ targetLanguage: "ASL", groqApiKey: "gsk-invalid-widget-fixture" }) } },
    } });

    // Observe the actual GPU skinning palette; labels/canvas existence alone
    // cannot prove that the bundled WidgetApp has generated and played a plan.
    const upload = WebGL2RenderingContext.prototype.texSubImage2D;
    WebGL2RenderingContext.prototype.texSubImage2D = function (this: WebGL2RenderingContext, ...args: unknown[]) {
      const data = args.find(value => value instanceof Float32Array && value.length === matrixLength) as Float32Array | undefined;
      if (data && state.samples.length < 4000) state.samples.push({
        matrices: indexes.flatMap(index => Array.from(data.subarray(index * 16, index * 16 + 16))),
        caption: document.querySelector(".caption-strip")?.textContent ?? null,
      });
      return (upload as (...values: unknown[]) => void).apply(this, args);
    } as WebGL2RenderingContext["texSubImage2D"];

    const realFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url !== "https://api.groq.com/openai/v1/audio/translations") return realFetch(input, init);
      const form = init?.body as FormData;
      const file = form.get("file");
      state.requests.push({ url, model: form.get("model") as string | null, filename: file instanceof File ? file.name : null });
      if (state.requests.length === 1) return Response.json({
        text: caption, duration: 12,
        segments: [{ start: 0, end: 6, text: "Hello my friend." }, { start: 6, end: 12, text: "Thank you for your help." }],
      });
      // Keep a late provider response available even after AbortSignal fires.
      // Both the actual signal and generation guard must protect Stop.
      return new Promise<Response>(resolve => {
        init?.signal?.addEventListener("abort", () => { state.aborted++; }, { once: true });
        state.releaseStale = () => resolve(Response.json({ text: "Stale response must not appear.", duration: 4, segments: [{ start: 0, end: 4, text: "Stale response must not appear." }] }));
      });
    };
  }, { indexes, matrixLength, extensionOrigin, token, caption });

  await page.goto("https://meet.google.com/fixture-widget-avatar");
  await expect.poll(() => page.frames().some(frame => frame.url() === `${extensionOrigin}/dist/widget.html`)).toBe(true);
  const widget = page.frames().find(frame => frame.url() === `${extensionOrigin}/dist/widget.html`)!;
  await widget.getByRole("button", { name: "Start", exact: true }).waitFor();
  await widget.getByText("Loading NEXA…").waitFor({ state: "hidden", timeout: 60_000 });
  const audio = async (messageToken = token) => page.evaluate(({ token, extensionOrigin }) => {
    document.querySelector("iframe")!.contentWindow!.postMessage({ channel: "unmute-widget", token, type: "AUDIO_CHUNK", blob: new Blob([new Uint8Array([1, 2, 3])], { type: "audio/webm" }) }, extensionOrigin);
  }, { token: messageToken, extensionOrigin });

  await audio(); // Valid host message still requires an explicit user Start.
  await page.waitForTimeout(150);
  expect((await snapshot(widget)).requests).toHaveLength(0);
  await widget.getByRole("button", { name: "Start", exact: true }).click();
  await expect(widget.getByRole("button", { name: "Stop", exact: true })).toBeVisible();
  await audio("forged-token");
  await page.waitForTimeout(150);
  expect((await snapshot(widget)).requests).toHaveLength(0);
  await audio();
  await expect(widget.locator(".caption-strip")).toHaveText(caption);

  let measured: ReturnType<typeof ranges> = [];
  let renderedFrames = 0;
  await expect.poll(async () => {
    const frames = (await snapshot(widget)).samples.filter(sample => sample.caption === caption);
    renderedFrames = frames.length;
    measured = frames.length ? ranges(frames) : [];
    return renderedFrames > 15 && measured.every(item => item.range > (item.bone === "RightLowerArm" ? 0.1 : 0.2));
  }, { timeout: 30_000, intervals: [100, 200, 300], message: "Wait for substantive forearm, hand and finger motion in the compiled widget" }).toBe(true);
  const motionEvidence = test.info().outputPath("widget-rendered-bone-motion.json");
  mkdirSync(path.dirname(motionEvidence), { recursive: true });
  writeFileSync(motionEvidence, JSON.stringify({ renderedFrames, bones: measured }, null, 2));
  await test.info().attach("widget-rendered-bone-motion", { path: motionEvidence, contentType: "application/json" });
  expect((await snapshot(widget)).requests[0]).toEqual({ url: "https://api.groq.com/openai/v1/audio/translations", model: "whisper-large-v3", filename: "meeting.webm" });

  await audio();
  await expect.poll(async () => (await snapshot(widget)).requests.length).toBe(2);
  await audio(); // Queued behind the deliberately stalled provider response.
  await widget.getByRole("button", { name: "Stop", exact: true }).click();
  await expect.poll(async () => (await snapshot(widget)).aborted).toBe(1);
  await widget.evaluate(() => (window as unknown as ProbeWindow).__widgetProbe.releaseStale?.());
  await audio(); // Late host audio after Stop must also be ignored.
  await page.waitForTimeout(350);
  await expect(widget.locator(".caption-strip")).toHaveText(caption);
  await expect(widget.getByRole("button", { name: "Start", exact: true })).toBeVisible();
  const final = await snapshot(widget);
  expect(final.requests).toHaveLength(2);
  expect(final.starts).toBe(1);
  expect(final.stops).toBe(1);
  expect(errors).toEqual([]);
});
