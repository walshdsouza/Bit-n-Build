browser.commands.onCommand.addListener((command) => {
  if (command === "_execute_sidebar_action") {
    browser.sidebarAction.toggle();
  }
});

// Only extension messages from a Meet tab can control that same tab's widget.
const tokenRequests = new Map<number, Promise<string>>();
function widgetToken(tabId: number) {
  if (!tokenRequests.has(tabId)) tokenRequests.set(tabId, (async () => {
    const key = `unmute-widget-token:${tabId}`;
    const stored = await browser.storage.session.get(key);
    if (typeof stored[key] === "string") return stored[key] as string;
    const token = crypto.randomUUID();
    await browser.storage.session.set({ [key]: token });
    return token;
  })());
  return tokenRequests.get(tabId)!;
}
browser.tabs.onRemoved.addListener(tabId => {
  tokenRequests.delete(tabId);
  void browser.storage.session.remove(`unmute-widget-token:${tabId}`);
});
browser.runtime.onMessage.addListener((message: unknown, sender) => {
  if (!message || typeof message !== "object" || !("type" in message)) return;
  const commands: Record<string, string> = {
    UNMUTE_WIDGET_START: "WIDGET_START_CAPTURE",
    UNMUTE_WIDGET_STOP: "WIDGET_STOP_CAPTURE",
    UNMUTE_WIDGET_STATUS: "WIDGET_CAPTURE_STATUS",
  };
  const type = typeof message.type === "string" ? commands[message.type] : undefined;
  if (!type && message.type !== "UNMUTE_WIDGET_TOKEN") return;
  if (sender.id !== browser.runtime.id || !sender.tab?.id || !sender.tab.url?.startsWith("https://meet.google.com/")) {
    return Promise.reject(new Error("Open UNMUTE inside a Google Meet tab."));
  }
  const fromHost = sender.frameId === 0 && sender.url?.startsWith("https://meet.google.com/");
  const fromWidget = sender.url === browser.runtime.getURL("dist/widget.html");
  if (!fromHost && !fromWidget) return Promise.reject(new Error("Unrecognized widget context."));
  if (message.type === "UNMUTE_WIDGET_TOKEN") return widgetToken(sender.tab.id).then(token => ({ token }));
  if (message.type !== "UNMUTE_WIDGET_STATUS" && !fromWidget) return Promise.reject(new Error("Use the Start or Stop button inside UNMUTE."));
  const captureSessionId = "captureSessionId" in message && typeof message.captureSessionId === "string" ? message.captureSessionId : null;
  return browser.tabs.sendMessage(sender.tab.id, { type, captureSessionId });
});
