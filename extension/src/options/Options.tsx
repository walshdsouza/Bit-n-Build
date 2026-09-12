import { useEffect, useState } from "react";
import { getSettings, setSettings, type Settings } from "../pipeline/storage";

export function Options() {
  const [settings, setLocalSettings] = useState<Settings>({ targetLanguage: "ASL" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then(setLocalSettings);
  }, []);

  async function handleSave() {
    await setSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div>
      <h1>GestureSync AI — Settings</h1>

      <label htmlFor="groq">Groq API key</label>
      <input
        id="groq"
        type="password"
        value={settings.groqApiKey ?? ""}
        onChange={(e) => setLocalSettings({ ...settings, groqApiKey: e.target.value })}
        placeholder="gsk_..."
      />

      <label htmlFor="openai">OpenAI API key (fallback if Groq is empty)</label>
      <input
        id="openai"
        type="password"
        value={settings.openaiApiKey ?? ""}
        onChange={(e) => setLocalSettings({ ...settings, openaiApiKey: e.target.value })}
        placeholder="sk-..."
      />

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