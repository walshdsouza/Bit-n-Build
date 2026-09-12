/**
 * HamNoSys (Hamburg Notation System) encoding layer.
 *
 * Adapted from the Kozha pipeline's notation stage. HamNoSys is a phonetic
 * transcription system for sign languages: it describes a sign as a
 * *composition of articulatory primitives* — handshape, extended-finger
 * direction, palm orientation, location and movement — rather than as a video
 * clip. That is what lets us synthesise signs we have never recorded, and what
 * makes adding a new sign language a matter of adding dictionary entries
 * rather than shooting new footage.
 *
 * Symbols below are from the HamNoSys 4 Unicode private-use block (U+E000…),
 * which is what the CWASA / JASigning avatar toolchain consumes.
 */

import {
  BodyLocation,
  ExtFingerDir,
  HandConfig,
  HandShape,
  PalmOrientation,
  SignEntry,
  SignMovement,
} from "./types";

/* ---------------------------------------------------------------- *
 * Symbol tables
 * ---------------------------------------------------------------- */

export const HAMNOSYS_SYMBOLS = {
  // Structural
  HAMFIST: "",
  HAMFLATHAND: "",
  HAMSYMMLR: "", // both hands, mirrored
  HAMSYMMPAR: "", // both hands, parallel
  HAMNONDOMINANT: "",
  HAMPLUS: "",
  HAMSEQBEGIN: "",
  HAMSEQEND: "",
} as const;

const SHAPE: Record<HandShape, string> = {
  fist: "",
  flat: "",
  finger2: "",
  finger23: "",
  finger2345: "",
  pinch12: "",
  pinchall: "",
  cee12: "",
  ceeall: "",
  finger23spread: "",
};

const EXT_DIR: Record<ExtFingerDir, string> = {
  u: "",
  ul: "",
  l: "",
  dl: "",
  d: "",
  dr: "",
  r: "",
  ur: "",
  o: "", // away from signer
  i: "", // toward signer
  ol: "",
  or: "",
};

const PALM_OR: Record<PalmOrientation, string> = {
  u: "",
  ul: "",
  l: "",
  dl: "",
  d: "",
  dr: "",
  r: "",
  ur: "",
  o: "",
  i: "",
};

const LOCATION: Record<BodyLocation, string> = {
  head: "",
  forehead: "",
  eyes: "",
  nose: "",
  mouth: "",
  chin: "",
  cheek: "",
  neck: "",
  shoulders: "",
  chest: "",
  stomach: "",
  neutral_space: "",
  shoulder_l: "",
  shoulder_r: "",
  palm_weak: "",
};

const MOVEMENT: Record<string, string> = {
  straight: "",
  curved: "",
  circle: "",
  wavy: "",
  zigzag: "",
  contact: "",
  tap: "",
  twist: "",
  nod: "",
  none: "",
};

const REPEAT: Record<number, string> = {
  2: "",
  3: "",
};

const FAST = "";
const SIZE_SMALL = "";
const SIZE_LARGE = "";

/* ---------------------------------------------------------------- *
 * Encoding
 * ---------------------------------------------------------------- */

function encodeHand(h: HandConfig): string {
  return SHAPE[h.shape] + EXT_DIR[h.extFingerDir] + PALM_OR[h.palmOr] + LOCATION[h.location];
}

function encodeMovement(m: SignMovement): string {
  let out = MOVEMENT[m.type] ?? "";
  if (m.direction) out += EXT_DIR[m.direction];
  if (m.size === "small") out += SIZE_SMALL;
  if (m.size === "large") out += SIZE_LARGE;
  if (m.fast) out += FAST;
  if (m.repetitions && REPEAT[m.repetitions]) out += REPEAT[m.repetitions];
  return out;
}

/**
 * Serialise a dictionary entry into a HamNoSys string.
 *
 * Two-handed signs are prefixed with a symmetry operator: `HAMSYMMLR` when the
 * non-dominant hand mirrors the dominant one, otherwise the non-dominant hand
 * is spelled out in full after the `HAMNONDOMINANT` marker. This matters a lot
 * for ISL, where the majority of the lexicon — and the entire manual alphabet —
 * is two-handed.
 */
export function encodeHamNoSys(entry: SignEntry): string {
  if (entry.hamnosys) return entry.hamnosys;

  const parts: string[] = [];

  if (entry.twoHanded) {
    if (entry.symmetric || !entry.nonDominant) {
      parts.push(HAMNOSYS_SYMBOLS.HAMSYMMLR);
      parts.push(encodeHand(entry.dominant));
    } else {
      parts.push(encodeHand(entry.dominant));
      parts.push(HAMNOSYS_SYMBOLS.HAMNONDOMINANT);
      parts.push(encodeHand(entry.nonDominant));
    }
  } else {
    parts.push(encodeHand(entry.dominant));
  }

  const mv = encodeMovement(entry.movement);
  if (mv) parts.push(mv);

  return parts.join("");
}

/**
 * Human-readable debug rendering — what the Gloss Inspector shows, since raw
 * HamNoSys private-use codepoints render as tofu without the HamNoSys font.
 */
export function describeHamNoSys(entry: SignEntry): string {
  const d = entry.dominant;
  const bits = [
    `${d.shape}`,
    `dir:${d.extFingerDir}`,
    `palm:${d.palmOr}`,
    `@${d.location}`,
  ];
  if (entry.twoHanded) {
    bits.unshift(entry.symmetric ? "2H-sym" : "2H-asym");
  }
  if (entry.movement.type !== "none") {
    const m = entry.movement;
    bits.push(
      `mv:${m.type}${m.direction ? `-${m.direction}` : ""}${m.repetitions ? `×${m.repetitions}` : ""}`,
    );
  }
  return bits.join(" ");
}

/** Estimated articulation time, used when building the motion plan. */
export function estimateSignDuration(entry: SignEntry, base: number): number {
  if (entry.duration) return entry.duration;
  let d = base;
  if (entry.twoHanded) d *= 1.15;
  if (entry.movement.repetitions && entry.movement.repetitions > 1) {
    d *= 1 + 0.25 * (entry.movement.repetitions - 1);
  }
  if (entry.movement.size === "large") d *= 1.2;
  if (entry.movement.fast) d *= 0.75;
  return Math.round(d * 100) / 100;
}
