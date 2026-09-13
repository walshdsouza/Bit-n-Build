import { useEffect, useRef, useState } from "react";
import LiveMeeting from "../../../components/live/LiveMeeting";
import { captureExtensionMeetingAudio, requestExtensionLiveAudio } from "../pipeline/meetingCapture";

const CHANNEL = "unmute-widget";
const MEET_ORIGIN = "https://meet.google.com";
const captureAudio = captureExtensionMeetingAudio("widget");
const post = (type: string) => window.parent.postMessage({ channel: CHANNEL, type }, MEET_ORIGIN);

/** Geometry stays in the content script; live behavior is shared with /live. */
export function WidgetApp() {
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const hostToken = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const extensionUrl = new URL(browser.runtime.getURL("dist/widget.html"));
    const extensionOrigin = `${extensionUrl.protocol}//${extensionUrl.host}`;
    const receive = (event: MessageEvent) => {
      const validSource = event.source === window.parent || (event.isTrusted && event.source === null);
      if (!validSource || (event.origin !== MEET_ORIGIN && event.origin !== extensionOrigin) || event.data?.channel !== CHANNEL || !hostToken.current || event.data.token !== hostToken.current) return;
      if (event.data.type === "WIDGET_STATE") {
        setMinimized(event.data.minimized === true);
        setHidden(event.data.hidden === true);
      }
    };
    window.addEventListener("message", receive);
    void browser.runtime.sendMessage({ type: "UNMUTE_WIDGET_TOKEN" }).then(result => {
      if (cancelled || typeof result?.token !== "string") return;
      hostToken.current = result.token;
      post("WIDGET_READY");
    }).catch(() => { if (!cancelled) setConnectionError("Reload this Meet tab to reconnect UNMUTE."); });
    return () => { cancelled = true; hostToken.current = null; window.removeEventListener("message", receive); };
  }, []);

  return <>
    <header className="widget-bar">
      <strong>UNMUTE</strong>
      <span className={`status-dot${capturing ? " live" : ""}`} role="img" aria-label={capturing ? "Capturing meeting audio" : "Capture idle"} />
      <div className="bar-actions">
        <button className="btn-icon" aria-label={minimized ? "Expand widget" : "Minimize widget"} aria-expanded={!minimized} onClick={() => post("WIDGET_MINIMIZE")}>{minimized ? "⌄" : "⌃"}</button>
        <button className="btn-icon" aria-label="Hide widget" title="Hide widget; capture continues" onClick={() => post("WIDGET_CLOSE")}>×</button>
      </div>
    </header>
    {connectionError && !minimized && <p className="widget-status error" role="alert">{connectionError}</p>}
    <div className="widget-live" style={{ display: minimized ? "none" : "flex" }}>
      <LiveMeeting compact captureAudio={captureAudio} requestAudio={requestExtensionLiveAudio} visible={!minimized && !hidden}
        modelUrl={browser.runtime.getURL("dist/nexa.glb")} onCaptureChange={setCapturing} />
    </div>
  </>;
}
