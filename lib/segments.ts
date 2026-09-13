/**
 * Transcript segment validation.
 *
 * Segments arrive from several sources — Groq/OpenAI Whisper, the YouTube
 * transcript API, or a caller's own POST body — and not all of them guarantee
 * a well-formed shape. A segment missing `text`, or carrying non-numeric
 * timestamps, must not be allowed to reach the gloss engine: it either throws
 * (crashing the request) or poisons the motion plan with NaN timings.
 */

import { TranscriptSegment } from "./types";

function toFiniteNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value :
    typeof value === "string" && value.trim() ? Number(value) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Coerces arbitrary input into usable segments.
 *
 * - segments without any text content are dropped (nothing to sign)
 * - non-numeric or missing timestamps are rebuilt from the surrounding
 *   segments so the timeline stays monotonic
 * - `end` is always pushed past `start`
 */
export function normalizeSegments(input: unknown): TranscriptSegment[] {
  if (!Array.isArray(input)) return [];

  const out: TranscriptSegment[] = [];
  let cursor = 0;

  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const seg = raw as Record<string, unknown>;

    const text = typeof seg.text === "string" ? seg.text.trim() : "";
    if (!text) continue; // nothing to gloss

    const start = toFiniteNumber(seg.start, cursor);
    let end = toFiniteNumber(seg.end, start + 2);

    const safeStart = Math.max(0, start);
    if (!(end > safeStart)) end = safeStart + 2;

    out.push({
      start: safeStart,
      end,
      text,
      ...(typeof seg.speaker === "string" ? { speaker: seg.speaker } : {}),
    });
    cursor = end;
  }

  return out;
}
