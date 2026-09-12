import { transcribeAudioFile } from "../../../lib/whisper";
import { getSettings } from "./storage";

/**
 * Testing-stage entry point: audio chunk in, transcript segments out.
 * Gloss → HamNoSys → SiGML → avatar wiring comes after this path is proven.
 */
export async function transcribeChunk(blob: Blob) {
  const { groqApiKey, openaiApiKey } = await getSettings();
  const result = await transcribeAudioFile(
    blob,
    `chunk_${Date.now()}.webm`,
    groqApiKey ?? null,
    openaiApiKey ?? null
  );
  return result;
}