import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { encodeMonoWav } from "../../lib/live-audio";

type Message = Record<string, unknown>;
type Sender = { id: string; url: string; tab?: { id: number; url: string }; frameId?: number };
const host: Sender = { id: "unmute-test", url: "https://meet.google.com/room", tab: { id: 12, url: "https://meet.google.com/room" }, frameId: 0 };
const extensionUrl = (view: string) => `moz-extension://fixture/${view}`;

function fixture(fetcher: typeof fetch = async () => new Response('{"speech":false}')) {
  let connected: (port: object) => void = () => {};
  let receive: (message: Message, sender: Sender) => unknown = () => {};
  const sent: Message[] = [];
  const storage: Record<string, unknown> = {};
  let owner: string | null = null;
  let session: string | null = null;
  vm.runInNewContext(readFileSync("extension/dist/background.js", "utf8"), {
    URL, Blob, FormData, Response, AbortController, atob, setTimeout, clearTimeout, crypto,
    fetch: fetcher,
    browser: {
      commands: { onCommand: { addListener: () => {} } }, sidebarAction: { toggle: () => {} },
      runtime: { id: "unmute-test", getURL: extensionUrl,
        onConnect: { addListener: (listener: typeof connected) => { connected = listener; } },
        onMessage: { addListener: (listener: typeof receive) => { receive = listener; } } },
      tabs: { onRemoved: { addListener: () => {} }, query: async () => [host.tab],
        sendMessage: async (_tabId: number, message: Message) => {
          sent.push(message);
          if (message.type === "MEETING_START_CAPTURE") { owner = String(message.owner); session = String(message.captureSessionId); }
          if (message.type === "MEETING_CANCEL_CAPTURE" && message.captureSessionId === session) owner = null;
          return { owner, captureSessionId: session };
        } },
      storage: { session: { get: async (key: string) => ({ [key]: storage[key] }), set: async (values: object) => Object.assign(storage, values), remove: async () => {} } },
    },
  });
  const connect = (view: "widget" | "sidebar", sender: Sender = { ...host, url: extensionUrl(`dist/${view}.html`), frameId: 5 }) => {
    let listener: (message: Message) => void = () => {};
    let disconnected: () => void = () => {};
    const messages: Message[] = [];
    let closed = false;
    connected({ name: "unmute-meeting", sender, postMessage: (message: Message) => messages.push(message),
      disconnect: () => { closed = true; disconnected(); },
      onMessage: { addListener: (fn: typeof listener) => { listener = fn; } },
      onDisconnect: { addListener: (fn: typeof disconnected) => { disconnected = fn; } },
    });
    return { send: (message: Message) => listener(message), messages, disconnect: () => { closed = true; disconnected(); }, isClosed: () => closed };
  };
  return { connect, sent, receive, event: (event: string, captureSessionId: string, extra: Message = {}) => receive({ type: "UNMUTE_CAPTURE_EVENT", event, owner: "widget", captureSessionId, ...extra }, host) };
}
const firstSession = "fixture-first-session-0001";
const secondSession = "fixture-second-session-0002";

test("runtime authorizes only extension views and keeps handshake tokens private", async () => {
  const probe = fixture();
  const bad = probe.connect("widget", { ...host, url: "https://meet.google.com/forged" });
  expect(bad.isClosed()).toBe(true);
  expect(probe.connect("widget", { ...host, id: "other-extension", url: extensionUrl("dist/widget.html") }).isClosed()).toBe(true);
  const widget = { ...host, frameId: 5, url: extensionUrl("dist/widget.html") };
  expect(await probe.receive({ type: "UNMUTE_WIDGET_TOKEN" }, host)).toEqual(await probe.receive({ type: "UNMUTE_WIDGET_TOKEN" }, widget));
  await expect(Promise.resolve(probe.receive({ type: "UNMUTE_WIDGET_TOKEN" }, { ...host, frameId: 9 }))).rejects.toThrow(/inside a Google Meet/);
  expect(await probe.receive({ type: "UNMUTE_WIDGET_START" }, widget)).toBeUndefined();
  expect(probe.sent).toHaveLength(0);
});

test("widget and sidebar cannot record together and closing an owner releases its lease", async () => {
  const probe = fixture();
  const widget = probe.connect("widget");
  widget.send({ type: "START", captureSessionId: firstSession });
  await expect.poll(() => probe.sent.filter(message => message.type === "MEETING_START_CAPTURE").length).toBe(1);
  const sidebar = probe.connect("sidebar", { id: host.id, url: extensionUrl("dist/sidebar.html") });
  sidebar.send({ type: "START", captureSessionId: secondSession });
  await expect.poll(() => String(sidebar.messages.find(message => message.type === "ERROR")?.message)).toContain("already running in the widget");
  expect(probe.sent.filter(message => message.type === "MEETING_START_CAPTURE")).toHaveLength(1);
  widget.disconnect();
  await expect.poll(() => probe.sent.some(message => message.type === "MEETING_CANCEL_CAPTURE" && message.captureSessionId === firstSession)).toBe(true);
  const retry = probe.connect("sidebar", { id: host.id, url: extensionUrl("dist/sidebar.html") });
  retry.send({ type: "START", captureSessionId: "fixture-retry-session-0003" });
  await expect.poll(() => probe.sent.filter(message => message.type === "MEETING_START_CAPTURE").length).toBe(2);
  retry.disconnect();
});

test("hosted requests accept only captured WAVs and final audio drains after Stop", async () => {
  const requests: { url: string; options?: RequestInit }[] = [];
  const probe = fixture(async (url, options) => { requests.push({ url: String(url), options }); return new Response('{"speech":false}'); });
  const widget = probe.connect("widget");
  widget.send({ type: "START", captureSessionId: firstSession });
  await expect.poll(() => probe.sent.some(message => message.type === "MEETING_START_CAPTURE")).toBe(true);
  const audioBase64 = Buffer.from(encodeMonoWav(new Float32Array(16000).fill(.1), 16000)).toString("base64");
  widget.send({ type: "LIVE_REQUEST", requestId: "uncaptured", audioBase64, captureSessionId: firstSession });
  await expect.poll(() => widget.messages.find(message => message.requestId === "uncaptured")?.status).toBe(400);
  await probe.event("AUDIO_CHUNK", firstSession, { audioBase64, duration: 1 });
  widget.send({ type: "STOP", captureSessionId: firstSession });
  await probe.event("CAPTURE_STOPPED", firstSession);
  widget.send({ type: "LIVE_REQUEST", requestId: "final-audio", audioBase64, captureSessionId: firstSession, url: "https://invalid.example/" });
  await expect.poll(() => widget.messages.find(message => message.requestId === "final-audio")?.status).toBe(200);
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toBe("https://unmute-ai.vercel.app/api/live");
  expect(requests[0].options?.credentials).toBe("omit");
  const audio = (requests[0].options?.body as FormData).get("audio") as Blob;
  expect(audio.type).toBe("audio/wav");
  expect(audio.size).toBe(32044);
  widget.disconnect();
});

test("closing a view aborts its hosted request and late or wrong-tab audio is ignored", async () => {
  let requestSignal: AbortSignal | undefined;
  const probe = fixture(async (_url, options) => new Promise((_resolve, reject) => {
    requestSignal = options?.signal as AbortSignal;
    requestSignal.addEventListener("abort", () => reject(new DOMException("Cancelled", "AbortError")), { once: true });
  }));
  const widget = probe.connect("widget");
  widget.send({ type: "START", captureSessionId: firstSession });
  await expect.poll(() => probe.sent.some(message => message.type === "MEETING_START_CAPTURE")).toBe(true);
  const audioBase64 = Buffer.from(encodeMonoWav(new Float32Array(16000).fill(.1), 16000)).toString("base64");
  await probe.receive({ type: "UNMUTE_CAPTURE_EVENT", event: "AUDIO_CHUNK", owner: "widget", captureSessionId: firstSession, audioBase64 }, { ...host, tab: { id: 22, url: host.url } });
  expect(widget.messages.filter(message => message.type === "AUDIO_CHUNK")).toHaveLength(0);
  await probe.event("AUDIO_CHUNK", firstSession, { audioBase64, duration: 1 });
  widget.send({ type: "LIVE_REQUEST", requestId: "active", audioBase64, captureSessionId: firstSession });
  await expect.poll(() => Boolean(requestSignal)).toBe(true);
  widget.disconnect();
  expect(requestSignal!.aborted).toBe(true);
  await probe.event("AUDIO_CHUNK", firstSession, { audioBase64, duration: 1 });
  expect(widget.messages.filter(message => message.type === "AUDIO_CHUNK")).toHaveLength(1);
});
