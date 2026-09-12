/** Thin wrapper around browser.storage.local for extension settings. */

export interface Settings {
  groqApiKey?: string;
  openaiApiKey?: string;
  targetLanguage: "ASL" | "ISL";
}

const DEFAULTS: Settings = { targetLanguage: "ASL" };

/**
 * browser.storage.local.get(keysObject) only returns keys that are present
 * in keysObject — it does NOT mean "fetch everything, falling back to these
 * defaults." DEFAULTS only lists targetLanguage, so get(DEFAULTS) was only
 * ever querying storage for targetLanguage; groqApiKey/openaiApiKey were
 * never part of the request and came back undefined even when genuinely
 * saved. Fetching everything and merging locally avoids that trap, and
 * doesn't need updating every time a field is added.
 */
export async function getSettings(): Promise<Settings> {
  const stored = await browser.storage.local.get(null);
  return { ...DEFAULTS, ...stored } as Settings;
}

export async function setSettings(patch: Partial<Settings>): Promise<void> {
  await browser.storage.local.set(patch);
}