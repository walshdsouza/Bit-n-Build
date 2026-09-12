import { useRef, useState } from "react";
import { startTabAudioCapture, type CaptureHandle } from "../pipeline/captureAudio";
import { transcribeChunk } from "../pipeline/liveTranslate";
import type { TranscriptSegment } from "../../../lib/types";

export function App() {
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const handleRef = useRef<CaptureHandle | null>(null);

  async function handleStart() {
    setError(null);
    try {
      handleRef.current = await startTabAudioCapture(
        async (blob) => {
          try {
            const result = await transcribeChunk(blob);
            setSegments((prev) => [...prev, ...result.segments]);
          } catch (err) {
            setError(String(err));
          }
        },
        (err) => setError(String(err))
      );
      setCapturing(true);
    } catch (err) {
      setError(String(err));
    }
  }

  function handleStop() {
    handleRef.current?.stop();
    handleRef.current = null;
    setCapturing(false);
  }

  return (
    <div className="panel">
      <h1>GestureSync AI</h1>
      {!capturing ? (
        <button onClick={handleStart}>Start capture</button>
      ) : (
        <button onClick={handleStop}>Stop capture</button>
      )}
      {error && <p className="error">{error}</p>}
      <ul className="transcript">
        {segments.map((s, i) => (
          <li key={i}>{s.text}</li>
        ))}
      </ul>
      {/* Avatar mounts here once this path is verified end-to-end */}
    </div>
  );
}