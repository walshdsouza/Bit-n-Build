import type { EmotionLabel, GlossRow, NMMTag, ProsodyFrame } from "./types";
import { isSupported } from "./sign-languages";

/** An actionable client error, kept separate from internal processing failures. */
export class RequestError extends Error {
  constructor(message: string, public readonly status = 400, public readonly code?: string) {
    super(message);
    this.name = "RequestError";
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) throw new RequestError("Provide a valid JSON object.");
  return body;
}

export function readLanguage(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (!isSupported(value)) {
    throw new RequestError("Unsupported sign language. Try ASL, ISL or BSL.");
  }
  return value;
}

export function readDuration(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new RequestError("`duration` must be a finite, non-negative number.");
  }
  return value;
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function unit(value: unknown): value is number {
  return finite(value) && value >= 0 && value <= 1;
}

export function readGlossRows(value: unknown): GlossRow[] {
  if (!Array.isArray(value) || !value.length) {
    throw new RequestError("Provide a non-empty `glossRows` array.");
  }
  return value.map((row: unknown, index) => {
    if (!isRecord(row) || typeof row.gloss !== "string" ||
      !finite(row.startTime) || row.startTime < 0 ||
      !finite(row.endTime) || row.endTime <= row.startTime) {
      throw new RequestError(`glossRows[${index}] requires gloss text and valid startTime/endTime numbers.`);
    }
    const nmm: NMMTag[] = [];
    if (row.nmm !== undefined && !Array.isArray(row.nmm)) {
      throw new RequestError(`glossRows[${index}].nmm must be an array.`);
    }
    for (const tag of (row.nmm ?? []) as unknown[]) {
      if (!isRecord(tag) || !finite(tag.time) || tag.time < 0 || typeof tag.emotion !== "string" ||
        (tag.intensity !== undefined && !unit(tag.intensity))) {
        throw new RequestError(`glossRows[${index}] contains an invalid non-manual marker.`);
      }
      nmm.push({ time: tag.time, emotion: tag.emotion,
        ...(tag.intensity !== undefined ? { intensity: tag.intensity as number } : {}) });
    }
    const lang = readLanguage(row.lang);
    return {
      startTime: row.startTime, endTime: row.endTime,
      sourceText: typeof row.sourceText === "string" ? row.sourceText : "",
      gloss: row.gloss, nmm, status: "queued",
      ...(lang ? { lang: lang.toUpperCase() as GlossRow["lang"] } : {}),
    };
  });
}

const EMOTIONS = new Set<EmotionLabel>(["neutral", "happy", "sad", "angry", "surprised", "emphatic", "questioning"]);

export function readProsody(value: unknown): ProsodyFrame[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) throw new RequestError("`prosody` must be an array.");
  return value.map((frame: unknown, index) => {
    if (!isRecord(frame) || !finite(frame.time) || frame.time < 0 ||
      !unit(frame.energy) || !unit(frame.pitch) || !unit(frame.confidence) ||
      !finite(frame.rate) || frame.rate < 0 ||
      typeof frame.emotion !== "string" || !EMOTIONS.has(frame.emotion as EmotionLabel)) {
      throw new RequestError(`prosody[${index}] contains invalid timing, emotion or numeric values.`);
    }
    return {
      time: frame.time, energy: frame.energy, pitch: frame.pitch,
      rate: frame.rate, emotion: frame.emotion as EmotionLabel, confidence: frame.confidence,
    };
  }).sort((a, b) => a.time - b.time);
}
