import { test, expect, type Frame } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { generateGloss } from "../../lib/gloss-engine";
import { buildSignPlan } from "../../lib/sign-plan";

const extensionOrigin = "https://extension.test", token = "test-only-widget-token";
const model = readFileSync("public/models/nexa.glb");
const gltf = JSON.parse(model.subarray(20, 20 + model.readUInt32LE(12)).toString());
const joints: string[] = gltf.skins[0].joints.map((index: number) => gltf.nodes[index].name);
const bones = ["RightLowerArm", "RightHand", "RightIndex1"], indexes = bones.map(name => joints.indexOf(name));
const matrixLength = Math.max(4, Math.ceil(Math.sqrt(joints.length * 4) / 4) * 4) ** 2 * 4;
const caption = "Hello my friend.";
interface Sample { matrices: number[]; caption: string | null }
interface WidgetProbe {
  samples: Sample[]; requests: { bytes: number; session: string }[];
  starts: number; stops: number; cancels: number;
  audio?: (forged?: boolean) => void; release?: () => void;
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
  return { samples: state.samples, requests: state.requests, starts: state.starts, stops: state.stops, cancels: state.cancels };
});

test("compiled shared Meet widget requires Start, animates real bones, pauses hidden, drains Stop and cancels stale responses", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const responseFor = async (text: string) => {
    const segments = [{ start: 0, end: 5, text }];
    const { rows } = await generateGloss(segments, { lang: "ASL", rulesOnly: true });
    return { speech: true, text, segments, plan: buildSignPlan(rows, { lang: "ASL", duration: 5 }) };
  };
  const responses = [await responseFor(caption), await responseFor("Thank you for your help."), await responseFor("Stale response must not appear.")];
  await page.route("https://meet.google.com/**", route => route.fulfill({
    contentType: "text/html", body: '<!doctype html><html><body><h1>Controlled meeting fixture</h1><iframe title="UNMUTE fixture" src="https://extension.test/dist/widget.html" style="width:420px;height:540px;border:0"></iframe></body></html>',
  }));
  await page.route(`${extensionOrigin}/**`, route => {
    const filename = path.basename(new URL(route.request().url()).pathname);
    const types: Record<string, string> = { "widget.html": "text/html", "widget.js": "application/javascript", "widget.css": "text/css", "nexa.glb": "model/gltf-binary" };
    if (!types[filename]) return route.abort();
    return route.fulfill({ contentType: types[filename], body: filename === "nexa.glb" ? model : readFileSync(path.join("extension/dist", filename)) });
  });
  // The hosted API response is controlled; the bundled adapter, shared live
  // queue, clock and GPU-rendered NEXA avatar are the actual application.
  for (const host of ["api.groq.com", "api.openai.com", "unmute-ai.vercel.app"]) await page.route(`https://${host}/**`, route => route.abort());
  await page.addInitScript(({ indexes, matrixLength, extensionOrigin, token, responses }) => {
    if (location.origin !== extensionOrigin) return;
    const state: WidgetProbe = { samples: [], requests: [], starts: 0, stops: 0, cancels: 0 };
    (window as unknown as ProbeWindow).__widgetProbe = state;
    type Message = Record<string, unknown>;
    const runtime = {
      getURL: (file: string) => `${extensionOrigin}/${file}`,
      sendMessage: async () => ({ token }),
      connect: () => {
        const listeners = new Set<(message: Message) => void>();
        let session = "";
        const emit = (message: Message) => listeners.forEach(listener => listener({ captureSessionId: session, ...message }));
        const buffer = new ArrayBuffer(160044), view = new DataView(buffer);
        const tag = (offset: number, value: string) => [...value].forEach((letter, index) => view.setUint8(offset + index, letter.charCodeAt(0)));
        tag(0, "RIFF"); view.setUint32(4, 160036, true); tag(8, "WAVE"); tag(12, "fmt ");
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
        view.setUint32(24, 16000, true); view.setUint32(28, 32000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
        tag(36, "data"); view.setUint32(40, 160000, true);
        for (let i = 44; i < buffer.byteLength; i += 2) view.setInt16(i, 1000, true);
        let binary = ""; const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
        state.audio = (forged = false) => emit({ type: "AUDIO_CHUNK", audioBase64: btoa(binary), duration: 5, ...(forged ? { captureSessionId: "forged-session" } : {}) });
        return {
          onMessage: { addListener: (listener: (message: Message) => void) => listeners.add(listener) },
          onDisconnect: { addListener: () => {} }, disconnect: () => {},
          postMessage: (message: Message) => {
            if (message.type === "START") {
              session = String(message.captureSessionId); state.starts++;
              queueMicrotask(() => { emit({ type: "CAPTURE_STARTED" }); emit({ type: "INPUT_STATUS", status: { state: "receiving", level: 0.1 } }); });
            } else if (message.type === "STOP") {
              state.stops++; queueMicrotask(() => emit({ type: "CAPTURE_STOPPED" }));
            } else if (message.type === "CANCEL" || message.type === "LIVE_CANCEL") state.cancels++;
            else if (message.type === "LIVE_REQUEST") {
              state.requests.push({ bytes: atob(String(message.audioBase64)).length, session });
              const index = state.requests.length - 1;
              const release = () => emit({ type: "LIVE_RESULT", requestId: message.requestId, status: 200, body: JSON.stringify(responses[index]) });
              if (index === 0) queueMicrotask(release); else state.release = release;
            }
          },
        };
      },
    };
    Object.defineProperty(window, "browser", { configurable: true, value: { runtime } });
    const upload = WebGL2RenderingContext.prototype.texSubImage2D;
    WebGL2RenderingContext.prototype.texSubImage2D = function (this: WebGL2RenderingContext, ...args: unknown[]) {
      const data = args.find(value => value instanceof Float32Array && value.length === matrixLength) as Float32Array | undefined;
      if (data && state.samples.length < 4000) state.samples.push({
        matrices: indexes.flatMap(index => Array.from(data.subarray(index * 16, index * 16 + 16))),
        caption: document.querySelector('[data-testid="live-current-caption"]')?.textContent ?? null,
      });
      return (upload as (...values: unknown[]) => void).apply(this, args);
    } as WebGL2RenderingContext["texSubImage2D"];
  }, { indexes, matrixLength, extensionOrigin, token, responses });

  await page.goto("https://meet.google.com/fixture-widget-avatar");
  await expect.poll(() => page.frames().some(frame => frame.url() === `${extensionOrigin}/dist/widget.html`)).toBe(true);
  const widget = page.frames().find(frame => frame.url() === `${extensionOrigin}/dist/widget.html`)!;
  const start = widget.getByRole("button", { name: "Start live captions", exact: true });
  const stop = widget.getByRole("button", { name: "Stop sharing", exact: true });
  const current = widget.getByTestId("live-current-caption");
  const audio = (forged = false) => widget.evaluate(value => (window as unknown as ProbeWindow).__widgetProbe.audio?.(value), forged);
  await start.waitFor();
  await widget.getByText("Loading NEXA…").waitFor({ state: "hidden", timeout: 60_000 });
  await audio(); expect((await snapshot(widget)).requests).toHaveLength(0);
  await start.click(); await stop.waitFor();
  await audio(true); await page.waitForTimeout(100);
  expect((await snapshot(widget)).requests).toHaveLength(0);
  await audio(); await expect(current).toHaveText(caption);
  let measured: ReturnType<typeof ranges> = [], renderedFrames = 0;
  await expect.poll(async () => {
    const frames = (await snapshot(widget)).samples.filter(sample => sample.caption === caption);
    renderedFrames = frames.length; measured = frames.length ? ranges(frames) : [];
    return renderedFrames > 15 && measured.every(item => item.range > (item.bone === "RightLowerArm" ? 0.1 : 0.2));
  }, { timeout: 20_000, intervals: [100, 200, 300] }).toBe(true);
  const motionEvidence = test.info().outputPath("widget-rendered-bone-motion.json");
  mkdirSync(path.dirname(motionEvidence), { recursive: true });
  writeFileSync(motionEvidence, JSON.stringify({ renderedFrames, bones: measured, scope: "Compiled shared LiveMeeting and extension port adapter; hosted response controlled" }, null, 2));
  await test.info().attach("widget-rendered-bone-motion", { path: motionEvidence, contentType: "application/json" });
  expect((await snapshot(widget)).requests[0].bytes).toBe(160044);

  const hidden = (value: boolean) => page.evaluate(({ token, extensionOrigin, hidden }) => {
    document.querySelector("iframe")!.contentWindow!.postMessage({ channel: "unmute-widget", token, type: "WIDGET_STATE", hidden }, extensionOrigin);
  }, { token, extensionOrigin, hidden: value });
  await hidden(true);
  await page.waitForTimeout((responses[0].plan.duration + 0.3) * 1000);
  await expect(current).toHaveText(caption);
  await hidden(false);
  await expect(current).not.toHaveText(caption, { timeout: 10000 });

  await audio(); await expect.poll(async () => (await snapshot(widget)).requests.length).toBe(2);
  await stop.click(); await expect(start).toBeDisabled();
  await widget.evaluate(() => (window as unknown as ProbeWindow).__widgetProbe.release?.());
  await expect(widget.getByRole("log", { name: "Meeting captions", includeHidden: true })).toContainText("Thank you for your help.");
  await expect(start).toBeEnabled(); // Stop drains audio already captured.
  await audio(); expect((await snapshot(widget)).requests).toHaveLength(2);
  await start.click(); await stop.waitFor();
  await audio(); await expect.poll(async () => (await snapshot(widget)).requests.length).toBe(3);
  await stop.click();
  await widget.getByRole("button", { name: "Cancel pending captions and signing" }).click();
  await widget.evaluate(() => (window as unknown as ProbeWindow).__widgetProbe.release?.());
  await audio(); await page.waitForTimeout(200);
  await expect(widget.getByRole("log", { name: "Meeting captions", includeHidden: true })).not.toContainText("Stale response");
  await expect(start).toBeEnabled();
  const final = await snapshot(widget);
  expect(final.requests).toHaveLength(3); expect(final.starts).toBe(2); expect(final.stops).toBe(2); expect(final.cancels).toBeGreaterThanOrEqual(2);
  expect(errors).toEqual([]);
});
