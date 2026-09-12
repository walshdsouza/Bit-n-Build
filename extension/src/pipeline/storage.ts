/** Thin wrapper around browser.storage.local for extension settings. */

export interface Settings {
  groqApiKey?: string;
  openaiApiKey?: string;
  targetLanguage: "ASL" | "ISL";
}

const DEFAULTS: Settings = { targetLanguage: "ASL" };
export async function getSettings(): Promise<Settings> {
  const stored = await browser.storage.local.get(DEFAULTS);
  return stored as Settings;
}

export async function setSettings(patch: Partial<Settings>): Promise<void> {
  await browser.storage.local.set(patch);
}