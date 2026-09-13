export function Options() {
  return <main className="extension-settings">
    <h1>UNMUTE</h1>
    <p>Live captions and ASL interpretation for your meetings.</p>
    <section><h2>Ready to use</h2><p>Transcription is provided by UNMUTE. You do not need an API key.</p></section>
    <section><h2>Choose your audio</h2><p>Select Meeting audio, My microphone, or both in the widget or sidebar with Meet open. Your microphone is used only when you select it and allow access. Use Live Meetings below to try your microphone without Meet.</p></section>
    <section><h2>Keep your conversation visible</h2><p>Stop finishes captured speech. Minimize pauses signing while capture continues. Expand Captions to review recent sentences.</p></section>
    <button onClick={() => void browser.tabs.create({ url: "https://unmute-ai.vercel.app/live" })}>Open UNMUTE Live Meetings</button>
  </main>;
}
