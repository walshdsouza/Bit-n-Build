/**
 * Motion planning: gloss rows → a timed, renderable sign plan.
 *
 * This is where the two reference projects meet:
 *   - Kozha contributes the notation spine — every sign resolves to HamNoSys
 *     primitives and a SiGML document, so output is renderer-agnostic.
 *   - GenASL contributes the "plan, then synthesise" structure — prosody sets
 *     emphasis and articulation speed, unknown lemmas degrade to fingerspelling
 *     instead of dropping out, and timing is fitted to the source audio.
 */

import {
  GlossRow,
  ProsodyFrame,
  SignEntry,
  SignLanguageCode,
  SignPlan,
  SignPlanItem,
} from "./types";
import { getProfile } from "./sign-languages";
import { buildFingerspelling, lookupSign } from "./dictionaries";
import { estimateSignDuration } from "./hamnosys";
import { buildSigmlDocument } from "./sigml";
import { emotionToNMM } from "./prosody";

export interface PlanOptions {
  lang: SignLanguageCode;
  prosody?: ProsodyFrame[];
  /** Total media duration; readable signing may extend beyond it. */
  duration?: number;
}

function prosodyAt(frames: ProsodyFrame[] | undefined, t: number): ProsodyFrame | null {
  if (!frames?.length) return null;
  let best = frames[0];
  for (const f of frames) {
    if (f.time <= t) best = f;
    else break;
  }
  return best;
}

/**
 * Below this, a sign is a flicker rather than something a viewer can read.
 * Speech dense enough to demand faster signing makes the avatar lag instead —
 * which is what a human interpreter does too.
 */
const MIN_SIGN_DURATION = 0.13;

/** A resolved sign with a relative duration, not yet placed on the timeline. */
interface PendingSign {
  gloss: string;
  duration: number;
  entry: SignEntry | null;
  fingerspell?: string;
  emphasis: number;
}

function expandRow(
  row: GlossRow,
  lang: SignLanguageCode,
  secondsPerSign: number,
  prosody: ProsodyFrame[] | undefined,
): PendingSign[] {
  const lemmas = row.gloss.split(/\s+/).filter(Boolean);
  if (!lemmas.length) return [];

  const frame = prosodyAt(prosody, row.startTime);
  const emphasis = frame ? frame.energy : 0.5;
  // Faster speech → faster signing, bounded so it stays legible.
  const speedScale = frame ? Math.min(Math.max(2.5 / Math.max(frame.rate, 0.5), 0.7), 1.4) : 1;

  // 1. Resolve each lemma to a dictionary entry or a fingerspelled sequence.
  type Unit = { gloss: string; entry: ReturnType<typeof lookupSign>; fingerspell?: string; dur: number };
  const units: Unit[] = [];

  for (const lemma of lemmas) {
    const entry = lookupSign(lang, lemma);
    if (entry) {
      units.push({
        gloss: lemma,
        entry,
        dur: estimateSignDuration(entry, secondsPerSign) * speedScale,
      });
    } else {
      // Unknown lemma → fingerspell it letter by letter.
      const letters = buildFingerspelling(lang, lemma);
      if (!letters.length) continue;
      letters.forEach((le, idx) => {
        units.push({
          gloss: `${lemma}[${idx + 1}/${letters.length}]`,
          entry: le,
          fingerspell: lemma,
          dur: (le.duration ?? 0.22) * speedScale,
        });
      });
    }
  }

  if (!units.length) return [];

  return units.map((u) => ({
    gloss: u.gloss,
    duration: u.dur,
    entry: u.entry,
    fingerspell: u.fingerspell,
    emphasis,
  }));
}

/** Fit weighted durations while reserving the readability floor first.
 * Clamping each independently after scaling can exceed an otherwise feasible
 * window. Redistributing the remaining budget avoids that artificial drift.
 */
function fitDurations(pending: PendingSign[], available: number): number[] {
  let budget = Math.max(available, pending.length * MIN_SIGN_DURATION);
  const durations = pending.map(() => 0);
  let remaining = pending.map((_, index) => index);
  while (remaining.length) {
    const weight = remaining.reduce((sum, index) => sum + pending[index].duration, 0);
    const short = remaining.filter((index) => pending[index].duration * budget / weight < MIN_SIGN_DURATION);
    if (!short.length) {
      for (const index of remaining) durations[index] = pending[index].duration * budget / weight;
      break;
    }
    const fixed = new Set(short);
    for (const index of short) durations[index] = MIN_SIGN_DURATION;
    budget -= short.length * MIN_SIGN_DURATION;
    remaining = remaining.filter((index) => !fixed.has(index));
  }
  return durations;
}

/** Map this row's expression markers onto its actual signing window. */
function attachNmm(
  items: SignPlanItem[],
  row: GlossRow,
  nmmSet: string[],
  prosody?: ProsodyFrame[],
) {
  if (!items.length) return;
  const start = items[0].startTime;
  const end = items[items.length - 1].endTime;
  const signingTime = (time: number) => start + Math.max(0, Math.min(1,
    (time - row.startTime) / Math.max(row.endTime - row.startTime, 0.001))) * (end - start);

  for (const tag of row.nmm ?? []) {
    const time = signingTime(tag.time);
    const target =
      items.find((it) => time >= it.startTime && time < it.endTime) ?? items[items.length - 1];
    if (target && !target.nmm.some((n) => n.emotion === tag.emotion)) {
      target.nmm.push({ ...tag, time });
    }
  }

  // Prosody-derived affect fills in anywhere the glosser left the face neutral.
  if (prosody?.length) {
    for (const frame of prosody) {
      if (frame.time < row.startTime || frame.time >= row.endTime) continue;
      if (frame.emotion === "neutral" || frame.confidence < 0.5) continue;
      const time = signingTime(frame.time);
      const target = items.find((it) => time >= it.startTime && time < it.endTime);
      if (target && !target.nmm.length) {
        target.nmm.push({
          time,
          // Only offer the ISL-specific affirmation tilt if this language has it.
          emotion: emotionToNMM(frame.emotion, nmmSet.includes("head_tilt_affirm")),
          intensity: frame.confidence,
        });
      }
    }
  }

  // Every sign carries at least its own lexical NMM, else neutral.
  for (const it of items) {
    if (!it.nmm.length) {
      it.nmm.push({
        time: it.startTime,
        emotion: it.entry?.nmm ?? "neutral",
        intensity: 0.3,
      });
    }
  }
}

export function buildSignPlan(rows: GlossRow[], opts: PlanOptions): SignPlan {
  const profile = getProfile(opts.lang);

  // Lay every row out against one monotonic cursor. A row normally starts at
  // its own timestamp, but if the previous row overran (speech too dense to
  // sign in the time available) the cursor carries that lag forward instead of
  // producing overlapping signs.
  const items: SignPlanItem[] = [];
  let cursor = 0;

  for (const [sourceIndex, row] of rows.entries()) {
    const pending = expandRow(row, profile.code, profile.secondsPerSign, opts.prosody);
    if (!pending.length) continue;

    cursor = Math.max(cursor, row.startTime);
    // A delayed row uses the time left until its source end, rather than its
    // full original width. Later, less dense rows can therefore catch up.
    const durations = fitDurations(pending, row.endTime - cursor);
    const rowItems: SignPlanItem[] = [];
    for (const [index, p] of pending.entries()) {
      const duration = durations[index];
      rowItems.push({
        gloss: p.gloss,
        sourceIndex,
        startTime: Math.round(cursor * 1000) / 1000,
        endTime: Math.round((cursor + duration) * 1000) / 1000,
        entry: p.entry,
        fingerspell: p.fingerspell,
        nmm: [],
        emphasis: p.emphasis,
      });
      cursor += duration;
    }
    attachNmm(rowItems, row, profile.nmmSet, opts.prosody);
    items.push(...rowItems);
  }

  const lastEnd = items.length ? items[items.length - 1].endTime : 0;
  // Never report a duration shorter than the signing actually takes, or the
  // tail of the translation would be unreachable on the timeline.
  const duration = Math.max(opts.duration ?? 0, lastEnd);

  return {
    lang: profile.code,
    duration,
    items,
    sigml: buildSigmlDocument(items, profile.code),
  };
}

/** The sign active at time `t` — used by the avatar renderer each frame. */
export function signAt(plan: SignPlan, t: number): SignPlanItem | null {
  let low = 0;
  let high = plan.items.length - 1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    const item = plan.items[mid];
    if (t < item.startTime) high = mid - 1;
    else if (t >= item.endTime) low = mid + 1;
    else return Number.isFinite(t) ? item : null;
  }
  return null;
}
