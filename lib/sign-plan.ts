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
  NMMTag,
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
  /** Total media duration; the plan is clamped to it. */
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

/**
 * Expands one gloss row into timed sign items.
 *
 * Signs are laid out sequentially inside the row's [startTime, endTime]
 * window, then uniformly scaled so the last sign lands on the row's end —
 * keeping the avatar synchronised with the source speaker even when the
 * nominal articulation times don't add up to the spoken duration.
 */
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

  // 2. Fit the sequence into the row's time window. Durations are returned
  //    relative; buildSignPlan places them on the global timeline so that a row
  //    which cannot compress far enough pushes later rows later rather than
  //    overlapping them.
  const window = Math.max(row.endTime - row.startTime, 0.4);
  const total = units.reduce((s, u) => s + u.dur, 0);
  const scale = total > 0 ? window / total : 1;

  return units.map((u) => ({
    gloss: u.gloss,
    duration: Math.max(u.dur * scale, MIN_SIGN_DURATION),
    entry: u.entry,
    fingerspell: u.fingerspell,
    emphasis,
  }));
}

/** Attaches NMMs to whichever sign is active at each marker's timestamp. */
function attachNmm(
  items: SignPlanItem[],
  rows: GlossRow[],
  nmmSet: string[],
  prosody?: ProsodyFrame[],
) {
  const all: NMMTag[] = rows.flatMap((r) => r.nmm ?? []);

  for (const tag of all) {
    const target =
      items.find((it) => tag.time >= it.startTime && tag.time < it.endTime) ??
      items.find((it) => it.startTime >= tag.time);
    if (target && !target.nmm.some((n) => n.emotion === tag.emotion)) {
      target.nmm.push(tag);
    }
  }

  // Prosody-derived affect fills in anywhere the glosser left the face neutral.
  if (prosody?.length) {
    for (const frame of prosody) {
      if (frame.emotion === "neutral" || frame.confidence < 0.5) continue;
      const target = items.find((it) => frame.time >= it.startTime && frame.time < it.endTime);
      if (target && !target.nmm.length) {
        target.nmm.push({
          time: frame.time,
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

  for (const row of rows) {
    const pending = expandRow(row, profile.code, profile.secondsPerSign, opts.prosody);
    if (!pending.length) continue;

    cursor = Math.max(cursor, row.startTime);
    for (const p of pending) {
      items.push({
        gloss: p.gloss,
        startTime: Math.round(cursor * 1000) / 1000,
        endTime: Math.round((cursor + p.duration) * 1000) / 1000,
        entry: p.entry,
        fingerspell: p.fingerspell,
        nmm: [],
        emphasis: p.emphasis,
      });
      cursor += p.duration;
    }
  }

  attachNmm(items, rows, profile.nmmSet, opts.prosody);

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
  for (const it of plan.items) {
    if (t >= it.startTime && t < it.endTime) return it;
  }
  return null;
}
