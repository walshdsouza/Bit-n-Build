import { inspectLiveWav } from "../../../lib/live-audio";

type Owner = "widget" | "sidebar";
type Message = Record<string, unknown>;
interface Client {
  port: browser.runtime.Port; owner: Owner; tabId: number | null; session: string | null;
  closed: boolean; stopped: boolean; requests: Map<string, AbortController>; audio: Map<string, number>;
}
const clients = new Set<Client>();
const tokenRequests = new Map<number, Promise<string>>();
const endpoint = "https://unmute-ai.vercel.app/api/live";
const meet = (url?: string) => { try { return new URL(url || "").origin === "https://meet.google.com"; } catch { return false; } };
const object = (value: unknown): Message | null => value !== null && typeof value === "object" ? value as Message : null;
function send(client: Client, message: Message) {
  if (client.closed) return;
  try { client.port.postMessage({ ...message, captureSessionId: client.session }); } catch { void close(client); }
}
async function command(client: Client, type: string) {
  if (client.tabId === null || !client.session) return;
  return browser.tabs.sendMessage(client.tabId, { type, owner: client.owner, captureSessionId: client.session });
}
async function close(client: Client) {
  if (client.closed) return;
  client.closed = true;
  client.requests.forEach(controller => controller.abort()); client.requests.clear(); client.audio.clear();
  clients.delete(client);
  await command(client, "MEETING_CANCEL_CAPTURE").catch(() => {});
}
async function widgetToken(tabId: number) {
  if (!tokenRequests.has(tabId)) tokenRequests.set(tabId, (async () => {
    const key = `unmute-widget-token:${tabId}`, stored = await browser.storage.session.get(key);
    if (typeof stored[key] === "string") return stored[key] as string;
    const token = crypto.randomUUID(); await browser.storage.session.set({ [key]: token }); return token;
  })());
  return tokenRequests.get(tabId)!;
}
async function begin(client: Client, message: Message) {
  if (client.session || typeof message.captureSessionId !== "string" || !/^[\w-]{16,80}$/.test(message.captureSessionId)) throw new Error("Invalid audio session. Reopen UNMUTE.");
  client.session = message.captureSessionId;
  if (client.tabId === null) {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs.find(tab => meet(tab.url));
    if (tab?.id === undefined) throw new Error("Open a Google Meet tab before starting UNMUTE. You can also test your microphone on the UNMUTE website.");
    client.tabId = tab.id;
  }
  if (client.closed) return;
  const other = [...clients].find(candidate => candidate !== client && !candidate.closed && !candidate.stopped && candidate.tabId === client.tabId && candidate.session);
  if (other) throw new Error(`Audio is already running in the ${other.owner}. Stop it there first.`);
  // A disconnected sidebar or a restarted background must not leave capture orphaned.
  const status = object(await browser.tabs.sendMessage(client.tabId, { type: "WIDGET_CAPTURE_STATUS" }));
  if (status?.owner && typeof status.captureSessionId === "string") {
    await browser.tabs.sendMessage(client.tabId, { type: "MEETING_CANCEL_CAPTURE", owner: status.owner, captureSessionId: status.captureSessionId });
    for (let attempt = 0; attempt < 20; attempt++) {
      const state = object(await browser.tabs.sendMessage(client.tabId, { type: "WIDGET_CAPTURE_STATUS" }));
      if (!state?.owner) break;
      if (attempt === 19) throw new Error("The previous audio session did not close. Reload the meeting and try again.");
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  if (client.closed) return;
  const options = object(message.options);
  const result = object(await browser.tabs.sendMessage(client.tabId, { type: "MEETING_START_CAPTURE", owner: client.owner, captureSessionId: client.session,
    options: { source: options?.source === "microphone" ? "microphone" : "tab", includeMicrophone: options?.includeMicrophone === true } }));
  if (typeof result?.error === "string") throw new Error(result.error);
}
async function request(client: Client, message: Message) {
  const id = message.requestId, encoded = message.audioBase64;
  if (typeof id !== "string" || id.length > 80 || typeof encoded !== "string" || encoded.length > 220000 || client.requests.has(id)) return;
  const allowance = client.audio.get(encoded) || 0;
  if (!allowance) { send(client, { type: "LIVE_RESULT", requestId: id, status: 400, body: JSON.stringify({ error: "Audio is no longer available. Start sharing again." }) }); return; }
  if (allowance === 1) client.audio.delete(encoded); else client.audio.set(encoded, allowance - 1);
  const controller = new AbortController(); client.requests.set(id, controller);
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const raw = atob(encoded), bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const wav = inspectLiveWav(bytes.buffer);
    if (!wav || new DataView(bytes.buffer).getUint32(24, true) !== 16000 || wav.duration > 5.02 || bytes.length > 170000) throw new Error("The audio recording is invalid. Start sharing again.");
    const form = new FormData(); form.append("audio", new Blob([bytes], { type: "audio/wav" }), "meeting.wav");
    const response = await fetch(endpoint, { method: "POST", body: form, signal: controller.signal, credentials: "omit" });
    const body = await response.text();
    if (body.length > 2_000_000) throw new Error("The transcription response was too large. Try again.");
    if (!client.closed && !controller.signal.aborted) send(client, { type: "LIVE_RESULT", requestId: id, status: response.status, body });
  } catch (error) {
    if (!client.closed && client.requests.get(id) === controller) send(client, { type: "LIVE_RESULT", requestId: id, status: controller.signal.aborted ? 504 : 502,
      body: JSON.stringify({ error: controller.signal.aborted ? "Transcription took too long. Try again." : error instanceof Error ? error.message : "Transcription could not connect. Try again." }) });
  } finally { clearTimeout(timeout); if (client.requests.get(id) === controller) client.requests.delete(id); }
}
browser.runtime.onConnect.addListener(port => {
  if (port.name !== "unmute-meeting") return;
  const sender = port.sender;
  const owner: Owner | null = sender?.url === browser.runtime.getURL("dist/widget.html") ? "widget" : sender?.url === browser.runtime.getURL("dist/sidebar.html") ? "sidebar" : null;
  if (sender?.id !== browser.runtime.id || !owner || (owner === "widget" && (sender.tab?.id === undefined || !meet(sender.tab.url)))) { port.disconnect(); return; }
  const client: Client = { port, owner, tabId: owner === "widget" ? sender.tab!.id! : null, session: null, closed: false, stopped: false, requests: new Map(), audio: new Map() };
  clients.add(client);
  port.onDisconnect.addListener(() => { void close(client); });
  port.onMessage.addListener(value => {
    const message = object(value); if (!message || client.closed) return;
    if (message.type === "START") { void begin(client, message).catch(error => { send(client, { type: "ERROR", message: error instanceof Error ? error.message : "Audio could not start. Reload the meeting." }); void close(client); }); return; }
    if (!client.session || message.captureSessionId !== client.session) return;
    if (message.type === "STOP") void command(client, "MEETING_STOP_CAPTURE").catch(() => { send(client, { type: "ERROR", message: "The meeting connection closed. Reload the meeting." }); void close(client); });
    else if (message.type === "CANCEL") void close(client);
    else if (message.type === "LIVE_REQUEST") void request(client, message);
    else if (message.type === "LIVE_CANCEL" && typeof message.requestId === "string") { const controller = client.requests.get(message.requestId); client.requests.delete(message.requestId); controller?.abort(); }
  });
});
browser.runtime.onMessage.addListener((value: unknown, sender) => {
  const message = object(value); if (!message || sender.id !== browser.runtime.id) return;
  const tabId = sender.tab?.id;
  const fromHost = tabId !== undefined && sender.frameId === 0 && meet(sender.url) && meet(sender.tab?.url);
  const fromWidget = tabId !== undefined && sender.url === browser.runtime.getURL("dist/widget.html") && meet(sender.tab?.url);
  if (message.type === "UNMUTE_CAPTURE_EVENT" && fromHost) {
    const client = [...clients].find(client => !client.closed && client.tabId === tabId && client.owner === message.owner && client.session === message.captureSessionId);
    if (!client) return Promise.resolve();
    if (message.event === "AUDIO_CHUNK") {
      const encoded = message.audioBase64;
      if (client.stopped || typeof encoded !== "string" || encoded.length > 220000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return Promise.resolve();
      client.audio.set(encoded, (client.audio.get(encoded) || 0) + 1);
      // Bound queued audio in memory; the UI applies its own queue backpressure.
      if (client.audio.size > 16) client.audio.delete(client.audio.keys().next().value!);
    } else if (message.event === "CAPTURE_STOPPED") client.stopped = true;
    if (message.event === "CAPTURE_ERROR") send(client, { type: "ERROR", message: typeof message.message === "string" ? message.message.slice(0, 250) : "Audio capture stopped." });
    else send(client, { ...message, type: message.event });
    return Promise.resolve();
  }
  if (message.type === "UNMUTE_WIDGET_TOKEN" || message.type === "UNMUTE_WIDGET_STATUS") {
    if (!fromHost && !fromWidget) return Promise.reject(new Error("Open UNMUTE inside a Google Meet tab."));
    return message.type === "UNMUTE_WIDGET_TOKEN" ? widgetToken(tabId!).then(token => ({ token })) : browser.tabs.sendMessage(tabId!, { type: "WIDGET_CAPTURE_STATUS" });
  }
});
browser.tabs.onRemoved.addListener(tabId => {
  tokenRequests.delete(tabId); void browser.storage.session.remove(`unmute-widget-token:${tabId}`);
  clients.forEach(client => { if (client.tabId === tabId) { send(client, { type: "ERROR", message: "The meeting tab closed." }); void close(client); } });
});
browser.commands.onCommand.addListener(command => { if (command === "_execute_sidebar_action") void browser.sidebarAction.toggle(); });
