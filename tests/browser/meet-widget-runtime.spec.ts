import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type Message = { type: string; captureSessionId?: string | null; [key: string]: unknown };
interface Probe {
  invoke: (message: Message) => Promise<{ owner: string | null; captureSessionId: string | null; error?: string }>;
  sidebar: Message[];
  widget: Message[];
}
type TestWindow = Window & { browser: unknown; unmuteBridge: Probe };

async function bridgeFixture(page: Page) {
  await page.route("https://meet.google.com/**", route => route.fulfill({ contentType: "text/html", body: "<button>Meet fixture</button>" }));
  await page.route("https://extension.test/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
  await page.goto("https://meet.google.com/test-room");
  await page.evaluate(() => {
    let receive: (message: Message, sender: { id: string }) => unknown;
    const probe: Probe = {
      sidebar: [], widget: [],
      invoke: message => Promise.resolve(receive(message, { id: "unmute-test" }) as ReturnType<Probe["invoke"]>),
    };
    const win = window as unknown as TestWindow;
    win.unmuteBridge = probe;
    win.browser = { runtime: {
      id: "unmute-test",
      getURL: (path: string) => `https://extension.test/${path}`,
      onMessage: { addListener: (listener: typeof receive) => { receive = listener; } },
      sendMessage: (message: Message) => { probe.sidebar.push(message); return Promise.resolve(); },
    } };
    window.addEventListener("message", event => {
      if (event.data?.marker === "unmute-widget-bridge") probe.widget.push(event.data);
    });
  });
  await page.addScriptTag({ path: "extension/dist/meet-bridge.js" });
}
const invoke = (page: Page, message: Message) => page.evaluate(message => (window as unknown as TestWindow).unmuteBridge.invoke(message), message);
const event = (page: Page, type: string, captureSessionId: string | null, audio = false) => page.evaluate(({ type, captureSessionId, audio }) => {
  window.postMessage({ marker: "gesturesync", type, captureSessionId, ...(audio ? { blob: new Blob(["audio"], { type: "audio/webm" }) } : {}) }, location.origin);
}, { type, captureSessionId, audio });

test("widget and sidebar share one capture owner and never duplicate audio routing", async ({ page }) => {
  await bridgeFixture(page);
  const widget = await invoke(page, { type: "WIDGET_START_CAPTURE" });
  expect(widget.owner).toBe("widget");
  const duplicate = await invoke(page, { type: "WIDGET_START_CAPTURE" });
  expect(duplicate.captureSessionId).toBe(widget.captureSessionId);
  await expect(invoke(page, { type: "START_CAPTURE" })).rejects.toThrow(/Stop capture in the UNMUTE widget/);
  await event(page, "AUDIO_CHUNK", widget.captureSessionId, true);
  await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).unmuteBridge.widget.filter(message => message.type === "AUDIO_CHUNK").length)).toBe(1);
  expect(await page.evaluate(() => (window as unknown as TestWindow).unmuteBridge.sidebar.length)).toBe(0);
  await invoke(page, { type: "WIDGET_STOP_CAPTURE", captureSessionId: widget.captureSessionId });
  const sidebar = await invoke(page, { type: "START_CAPTURE" });
  expect(sidebar.owner).toBe("sidebar");
  await expect(invoke(page, { type: "WIDGET_START_CAPTURE" })).rejects.toThrow(/Stop capture in the sidebar/);
  await event(page, "AUDIO_CHUNK", sidebar.captureSessionId, true);
  await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).unmuteBridge.sidebar.filter(message => message.type === "AUDIO_CHUNK").length)).toBe(1);
  expect(await page.evaluate(() => (window as unknown as TestWindow).unmuteBridge.widget.filter(message => message.type === "AUDIO_CHUNK").length)).toBe(1);
  await event(page, "CAPTURE_STOPPED", sidebar.captureSessionId);
  await expect.poll(async () => (await invoke(page, { type: "WIDGET_CAPTURE_STATUS" })).owner).toBeNull();
});

test("stale Stop events and stale iframe leases cannot stop a newer widget capture", async ({ page }) => {
  await bridgeFixture(page);
  const first = await invoke(page, { type: "WIDGET_START_CAPTURE" });
  await invoke(page, { type: "WIDGET_STOP_CAPTURE", captureSessionId: first.captureSessionId });
  const next = await invoke(page, { type: "WIDGET_START_CAPTURE" });
  expect(next.captureSessionId).not.toBe(first.captureSessionId);
  await event(page, "CAPTURE_STOPPED", first.captureSessionId);
  await event(page, "CAPTURE_ERROR", first.captureSessionId);
  const staleStop = await invoke(page, { type: "WIDGET_STOP_CAPTURE", captureSessionId: first.captureSessionId });
  expect(staleStop.owner).toBe("widget");
  expect(staleStop.captureSessionId).toBe(next.captureSessionId);
  await event(page, "CAPTURE_ERROR", next.captureSessionId);
  await expect.poll(async () => (await invoke(page, { type: "WIDGET_CAPTURE_STATUS" })).owner).toBeNull();
  expect((await invoke(page, { type: "WIDGET_CAPTURE_STATUS" })).error).toContain("audio could not start");
});

test("background restricts capture consent and private handshake tokens to their extension contexts", async () => {
  type Sender = { id: string; tab: { id: number; url: string }; frameId: number; url: string };
  let listener: (message: Message, sender: Sender) => Promise<unknown> | undefined = () => undefined;
  const sent: { tabId: number; message: Message }[] = [];
  const storage: Record<string, unknown> = {};
  const widgetURL = "moz-extension://unmute-test/dist/widget.html";
  vm.runInNewContext(readFileSync("extension/dist/background.js", "utf8"), {
    crypto: { randomUUID: () => "private-runtime-test-token" },
    browser: {
      commands: { onCommand: { addListener: () => {} } }, sidebarAction: { toggle: () => {} },
      runtime: { id: "unmute-test", getURL: (path: string) => `moz-extension://unmute-test/${path}`, onMessage: { addListener: (fn: typeof listener) => { listener = fn; } } },
      tabs: { onRemoved: { addListener: () => {} }, sendMessage: (tabId: number, message: Message) => { sent.push({ tabId, message }); return Promise.resolve({ owner: "widget", captureSessionId: "lease" }); } },
      storage: { session: { get: async (key: string) => ({ [key]: storage[key] }), set: async (values: Record<string, unknown>) => { Object.assign(storage, values); }, remove: async () => {} } },
    },
  });
  const host: Sender = { id: "unmute-test", tab: { id: 12, url: "https://meet.google.com/room" }, frameId: 0, url: "https://meet.google.com/room" };
  const widget: Sender = { ...host, frameId: 5, url: widgetURL };
  expect(await listener({ type: "UNMUTE_WIDGET_TOKEN" }, host)).toEqual(await listener({ type: "UNMUTE_WIDGET_TOKEN" }, widget));
  // Normalize cross-realm VM promises/errors before asserting their messages.
  const rejected = (message: Message, sender: Sender) => Promise.resolve(listener(message, sender)).then(() => "", reason => String(reason.message));
  expect(await rejected({ type: "UNMUTE_WIDGET_START" }, host)).toContain("inside UNMUTE");
  expect(await rejected({ type: "UNMUTE_WIDGET_TOKEN" }, { ...widget, url: "https://meet.google.com/forged", frameId: 9 })).toContain("Unrecognized");
  expect(await rejected({ type: "UNMUTE_WIDGET_START" }, { ...widget, id: "another-extension" })).toContain("inside a Google Meet tab");
  await listener({ type: "UNMUTE_WIDGET_START" }, widget);
  await listener({ type: "UNMUTE_WIDGET_STOP", captureSessionId: "lease" }, widget);
  expect(sent).toEqual([
    { tabId: 12, message: { type: "WIDGET_START_CAPTURE", captureSessionId: null } },
    { tabId: 12, message: { type: "WIDGET_STOP_CAPTURE", captureSessionId: "lease" } },
  ]);
});

test("a suspended audio graph reports capture failure instead of a false live state", async ({ page }) => {
  await bridgeFixture(page);
  await page.evaluate(() => {
    const win = window as unknown as { AudioContext: unknown };
    win.AudioContext = class {
      state = "suspended";
      createMediaStreamDestination() { return { stream: new MediaStream() }; }
      resume() { return Promise.reject(new Error("Audio activation blocked")); }
    };
  });
  await page.addScriptTag({ path: "extension/dist/page-hook.js" });
  await invoke(page, { type: "WIDGET_START_CAPTURE" });
  await expect.poll(async () => (await invoke(page, { type: "WIDGET_CAPTURE_STATUS" })).error).toContain("audio could not start");
  expect((await invoke(page, { type: "WIDGET_CAPTURE_STATUS" })).owner).toBeNull();
});
