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
 * Expands one gloss row into timed sign items.
 *
 * Signs are laid out sequentially inside the row's [startTime, endTime]
 * window, then uniformly scaled so the last sign lands on the row's end —
 * keeping the avatar synchronised with the source speaker even when the
 * nominal articulation times don't add up to the spoken duration.
 */
function expandRow(
  row: GlossRow,
  lang: SignLanguageCode,
  secondsPerSign: number,
  prosody: ProsodyFrame[] | undefined,
): SignPlanItem[] {
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

  // 2. Fit the sequence into the row's time window.
  const window = Math.max(row.endTime - row.startTime, 0.4);
  const total = units.reduce((s, u) => s + u.dur, 0);
  const scale = total > 0 ? window / total : 1;

  let cursor = row.startTime;
  return units.map((u) => {
    const dur = u.dur * scale;
    const item: SignPlanItem = {
      gloss: u.gloss,
      startTime: Math.round(cursor * 1000) / 1000,
      endTime: Math.round((cursor + dur) * 1000) / 1000,
      entry: u.entry,
      fingerspell: u.fingerspell,
      nmm: [],
      emphasis,
    };
    cursor += dur;
    return item;
  });
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

  const items = rows.flatMap((row) =>
    expandRow(row, profile.code, profile.secondsPerSign, opts.prosody),
  );

  attachNmm(items, rows, profile.nmmSet, opts.prosody);

  const duration =
    opts.duration ?? (items.length ? items[items.length - 1].endTime : 0);

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
