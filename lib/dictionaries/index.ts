/**
 * Dictionary lookup + fingerspelling fallback.
 *
 * Any gloss lemma without a dictionary entry is fingerspelled letter by
 * letter. The manual alphabet differs structurally between languages:
 * ASL fingerspells one-handed in neutral space, while ISL and BSL fingerspell
 * TWO-handed, forming each letter against the non-dominant palm.
 */

import { SignLanguageCode, SignEntry, HandShape } from "../types";
import { getProfile } from "../sign-languages";
import { ASL_DICTIONARY } from "./asl";
import { ISL_DICTIONARY } from "./isl";

const DICTIONARIES: Partial<Record<SignLanguageCode, Map<string, SignEntry>>> = {
  ASL: ASL_DICTIONARY,
  ISL: ISL_DICTIONARY,
  // BSL falls back to fingerspelling until its lexicon lands.
};

export function getDictionary(lang: SignLanguageCode): Map<string, SignEntry> {
  return DICTIONARIES[lang] ?? new Map();
}

export function lookupSign(lang: SignLanguageCode, gloss: string): SignEntry | null {
  const dict = getDictionary(lang);
  const key = gloss.trim().toUpperCase();
  if (dict.has(key)) return dict.get(key)!;

  // Tolerate inflected/compound lemmas: WALKING → WALK, SALAD-BAR → SALAD BAR
  const stripped = key.replace(/-/g, " ").split(/\s+/)[0];
  if (dict.has(stripped)) return dict.get(stripped)!;

  for (const suffix of ["ING", "ED", "S"]) {
    if (key.endsWith(suffix)) {
      const base = key.slice(0, -suffix.length);
      if (dict.has(base)) return dict.get(base)!;
    }
  }
  return null;
}

/** Letter → handshape approximation used by the fingerspelling renderer. */
const LETTER_SHAPES: Record<string, HandShape> = {
  A: "fist", B: "flat", C: "ceeall", D: "finger2", E: "fist",
  F: "pinch12", G: "finger2", H: "finger23", I: "fist", J: "fist",
  K: "finger23", L: "finger2", M: "fist", N: "fist", O: "pinchall",
  P: "finger23", Q: "pinch12", R: "finger23", S: "fist", T: "fist",
  U: "finger23", V: "finger23spread", W: "finger2345", X: "finger2",
  Y: "fist", Z: "finger2",
};

/**
 * Builds a sequence of `SignEntry` objects spelling out `word`.
 *
 * For two-handed alphabets the non-dominant hand is added as a flat "base"
 * hand and the dominant hand contacts it — the defining articulatory feature
 * of ISL/BSL fingerspelling.
 */
export function buildFingerspelling(lang: SignLanguageCode, word: string): SignEntry[] {
  const profile = getProfile(lang);
  const twoHanded = profile.fingerspellingHands === 2;
  const letters = word.toUpperCase().replace(/[^A-Z0-9]/g, "").split("");

  return letters.map((ch) => {
    const shape = LETTER_SHAPES[ch] ?? "flat";
    const entry: SignEntry = {
      gloss: `fs:${ch}`,
      twoHanded,
      symmetric: false,
      dominant: {
        shape,
        extFingerDir: "u",
        palmOr: "o",
        location: twoHanded ? "palm_weak" : "neutral_space",
      },
      movement: { type: twoHanded ? "contact" : "none", size: "small" },
      // Fingerspelled letters are quick.
      duration: 0.22,
    };
    if (twoHanded) {
      entry.nonDominant = {
        shape: "flat",
        extFingerDir: "o",
        palmOr: "u",
        location: "neutral_space",
      };
    }
    return entry;
  });
}

/** True when the lemma has no entry and must be fingerspelled. */
export function needsFingerspelling(lang: SignLanguageCode, gloss: string): boolean {
  return lookupSign(lang, gloss) === null;
}

export function dictionaryStats(lang: SignLanguageCode) {
  const dict = getDictionary(lang);
  let twoHanded = 0;
  dict.forEach((s) => {
    if (s.twoHanded) twoHanded++;
  });
  return {
    lang,
    entries: dict.size,
    twoHanded,
    oneHanded: dict.size - twoHanded,
  };
}
