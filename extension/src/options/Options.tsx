import { useEffect, useState } from "react";
import { getSettings, setSettings, type Settings } from "../pipeline/storage";
import { validateApiKey, type KeyValidationResult } from "../../../lib/whisper";

type KeyStatus = "idle" | "checking" | "valid" | "invalid";

export function Options() {
  const [settings, setLocalSettings] = useState<Settings>({ targetLanguage: "ASL" });
  const [saved, setSaved] = useState(false);
  const [groqStatus, setGroqStatus] = useState<KeyStatus>("idle");
  const [openaiStatus, setOpenaiStatus] = useState<KeyStatus>("idle");
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    getSettings().then(setLocalSettings);
  }, []);

  async function testKey(provider: "groq" | "openai") {
    const key = provider === "groq" ? settings.groqApiKey : settings.openaiApiKey;
    const setStatus = provider === "groq" ? setGroqStatus : setOpenaiStatus;
    if (!key) {
      setStatus("idle");
      return;
    }
    setStatus("checking");
    setStatusError(null);
    const result: KeyValidationResult = await validateApiKey(provider, key);
    setStatus(result.valid ? "valid" : "invalid");
    if (!result.valid) setStatusError(result.error ?? "Key was rejected.");
  }

  async function handleSave() {
    await setSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    if (settings.groqApiKey) testKey("groq");
    if (settings.openaiApiKey) testKey("openai");
  }

  function statusBadge(status: KeyStatus) {
    if (status === "checking") return <span className="badge checking">Checking…</span>;
    if (status === "valid") return <span className="badge valid">Valid</span>;
    if (status === "invalid") return <span className="badge invalid">Invalid</span>;
    return null;
  }

  return (
    <div>
      <h1>GestureSync AI — Settings</h1>

      <label htmlFor="groq">Groq API key</label>
      <div className="key-row">
        <input
          id="groq"
          type="password"
          value={settings.groqApiKey ?? ""}
          onChange={(e) => {
            setLocalSettings({ ...settings, groqApiKey: e.target.value });
            setGroqStatus("idle");
          }}
          placeholder="gsk_..."
        />
        <button type="button" className="test" onClick={() => testKey("groq")}>
          Test
        </button>
      </div>
      {statusBadge(groqStatus)}

      <label htmlFor="openai">OpenAI API key (fallback if Groq is empty)</label>
      <div className="key-row">
        <input
          id="openai"
          type="password"
          value={settings.openaiApiKey ?? ""}
          onChange={(e) => {
            setLocalSettings({ ...settings, openaiApiKey: e.target.value });
            setOpenaiStatus("idle");
          }}
          placeholder="sk-..."
        />
        <button type="button" className="test" onClick={() => testKey("openai")}>
          Test
        </button>
      </div>
      {statusBadge(openaiStatus)}

      {statusError && <p className="key-error">{statusError}</p>}

      <label htmlFor="lang">Target sign language</label>
      <select
        id="lang"
        value={settings.targetLanguage}
        onChange={(e) => setLocalSettings({ ...settings, targetLanguage: e.target.value as Settings["targetLanguage"] })}
      >
        <option value="ASL">ASL</option>
        <option value="ISL">ISL</option>
      </select>

      <button onClick={handleSave}>Save</button>
      {saved && <p className="saved">Saved.</p>}
    </div>
  );
}