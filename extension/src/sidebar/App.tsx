import LiveMeeting from "../../../components/live/LiveMeeting";
import { captureExtensionMeetingAudio, requestExtensionLiveAudio } from "../pipeline/meetingCapture";

const captureAudio = captureExtensionMeetingAudio("sidebar");

/** The sidebar and floating widget use the same hosted live interpretation. */
export function App() {
  return <div className="sidebar-live">
    <header className="widget-bar"><strong>UNMUTE</strong><span className="sidebar-label">Live ASL</span></header>
    <LiveMeeting compact captureAudio={captureAudio} requestAudio={requestExtensionLiveAudio} modelUrl={browser.runtime.getURL("dist/nexa.glb")} />
  </div>;
}
