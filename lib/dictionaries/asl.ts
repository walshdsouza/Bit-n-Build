/**
 * ASL sign dictionary — gloss lemma → HamNoSys articulatory primitives.
 *
 * Entries are hand-encoded from standard ASL phonological descriptions
 * (Stokoe / HamNoSys conventions). Any lemma missing here falls back to
 * fingerspelling, so the pipeline degrades gracefully rather than failing.
 */

import { SignEntry } from "../types";

const e = (
  gloss: string,
  entry: Omit<SignEntry, "gloss">,
): [string, SignEntry] => [gloss, { gloss, ...entry }];

export const ASL_DICTIONARY = new Map<string, SignEntry>([
  // ---- Pronouns / indexing ----
  e("IX-1", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "i", palmOr: "i", location: "chest" },
    movement: { type: "contact" },
  }),
  e("IX-2", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "straight", direction: "o", size: "small" },
  }),
  e("IX-3", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "or", palmOr: "d", location: "neutral_space" },
    movement: { type: "straight", direction: "or", size: "small" },
  }),
  e("IX", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "straight", direction: "o", size: "small" },
  }),

  // ---- People ----
  e("WOMAN", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "l", location: "chin" },
    movement: { type: "straight", direction: "d" },
  }),
  e("MAN", {
    twoHanded: false,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "l", location: "forehead" },
    movement: { type: "straight", direction: "d" },
  }),
  e("FRIEND", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "finger2", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "finger2", extFingerDir: "i", palmOr: "u", location: "neutral_space" },
    movement: { type: "contact", repetitions: 2 },
  }),
  e("MOTHER", {
    twoHanded: false,
    dominant: { shape: "finger2345", extFingerDir: "u", palmOr: "l", location: "chin" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("FATHER", {
    twoHanded: false,
    dominant: { shape: "finger2345", extFingerDir: "u", palmOr: "l", location: "forehead" },
    movement: { type: "tap", repetitions: 2 },
  }),

  // ---- Cognition / state ----
  e("THINK", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "forehead" },
    movement: { type: "contact" },
    nmm: "topic_eyebrow",
  }),
  e("KNOW", {
    twoHanded: false,
    dominant: { shape: "flat", extFingerDir: "ul", palmOr: "i", location: "forehead" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("WANT", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "ceeall", extFingerDir: "o", palmOr: "u", location: "chest" },
    movement: { type: "straight", direction: "i" },
  }),
  e("LOVE", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "fist", extFingerDir: "u", palmOr: "i", location: "chest" },
    movement: { type: "contact" },
    nmm: "positive_headnod",
  }),
  e("LAUGH", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "mouth" },
    movement: { type: "straight", direction: "ur", repetitions: 2 },
    nmm: "positive_headnod",
  }),

  // ---- Actions ----
  e("GO", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "straight", direction: "o" },
  }),
  e("COME", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2", extFingerDir: "i", palmOr: "u", location: "neutral_space" },
    movement: { type: "straight", direction: "i" },
  }),
  e("CALL", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "finger23", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "contact" },
  }),
  e("ASK", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "o", location: "chest" },
    movement: { type: "curved", direction: "i" },
    nmm: "wh-question_browDown",
  }),
  e("SUGGEST", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "chest" },
    movement: { type: "straight", direction: "ur" },
  }),
  e("PLAN", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "l", location: "neutral_space" },
    movement: { type: "straight", direction: "r" },
  }),
  e("EAT", {
    twoHanded: false,
    dominant: { shape: "pinchall", extFingerDir: "i", palmOr: "d", location: "mouth" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("DRINK", {
    twoHanded: false,
    dominant: { shape: "cee12", extFingerDir: "l", palmOr: "l", location: "mouth" },
    movement: { type: "twist" },
  }),
  e("HELP", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "fist", extFingerDir: "u", palmOr: "l", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "straight", direction: "u" },
  }),
  e("LEARN", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "pinchall", extFingerDir: "d", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "straight", direction: "u" },
  }),

  // ---- Nouns ----
  e("FOOD", {
    twoHanded: false,
    dominant: { shape: "pinchall", extFingerDir: "i", palmOr: "d", location: "mouth" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("PIZZA", {
    twoHanded: false,
    dominant: { shape: "finger23", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "zigzag" },
  }),
  e("TACO", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "finger23", extFingerDir: "d", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("SALAD-BAR", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger23spread", extFingerDir: "u", palmOr: "u", location: "neutral_space" },
    movement: { type: "circle", repetitions: 2 },
  }),
  e("DIET", {
    twoHanded: false,
    dominant: { shape: "pinch12", extFingerDir: "u", palmOr: "l", location: "chin" },
    movement: { type: "straight", direction: "d" },
  }),
  e("ADVICE", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "pinchall", extFingerDir: "d", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "straight", direction: "o" },
  }),
  e("SCHOOL", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("WATER", {
    twoHanded: false,
    dominant: { shape: "finger23spread", extFingerDir: "u", palmOr: "l", location: "chin" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("NAME", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "finger23", extFingerDir: "ol", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "finger23", extFingerDir: "or", palmOr: "u", location: "neutral_space" },
    movement: { type: "tap", repetitions: 2 },
  }),

  // ---- Function / discourse ----
  e("BUT", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "neutral_space" },
    movement: { type: "straight", direction: "l" },
  }),
  e("NOT", {
    twoHanded: false,
    dominant: { shape: "fist", extFingerDir: "u", palmOr: "o", location: "chin" },
    movement: { type: "straight", direction: "o" },
    nmm: "negative_headshake",
  }),
  e("YES", {
    twoHanded: false,
    dominant: { shape: "fist", extFingerDir: "u", palmOr: "o", location: "neutral_space" },
    movement: { type: "nod", repetitions: 2 },
    nmm: "positive_headnod",
  }),
  e("NO", {
    twoHanded: false,
    dominant: { shape: "finger23", extFingerDir: "u", palmOr: "o", location: "neutral_space" },
    movement: { type: "contact" },
    nmm: "negative_headshake",
  }),
  e("TWO-OF-US", {
    twoHanded: false,
    dominant: { shape: "finger23", extFingerDir: "u", palmOr: "i", location: "chest" },
    movement: { type: "straight", direction: "l", repetitions: 2 },
  }),

  // ---- Question words ----
  e("WHAT", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2345", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "straight", direction: "l", repetitions: 2 },
    nmm: "wh-question_browDown",
  }),
  e("WHO", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "chin" },
    movement: { type: "circle", size: "small" },
    nmm: "wh-question_browDown",
  }),
  e("WHERE", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "o", location: "neutral_space" },
    movement: { type: "straight", direction: "l", repetitions: 2, fast: true },
    nmm: "wh-question_browDown",
  }),
  e("WHEN", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "finger2", extFingerDir: "d", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "neutral_space" },
    movement: { type: "circle" },
    nmm: "wh-question_browDown",
  }),
  e("WHY", {
    twoHanded: false,
    dominant: { shape: "finger2345", extFingerDir: "d", palmOr: "i", location: "forehead" },
    movement: { type: "straight", direction: "d" },
    nmm: "wh-question_browDown",
  }),
  e("HOW", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "fist", extFingerDir: "d", palmOr: "d", location: "neutral_space" },
    movement: { type: "twist" },
    nmm: "wh-question_browDown",
  }),

  // ---- Time markers ----
  e("NOW", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2345", extFingerDir: "u", palmOr: "u", location: "neutral_space" },
    movement: { type: "straight", direction: "d" },
  }),
  e("BEFORE", {
    twoHanded: false,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "i", location: "shoulders" },
    movement: { type: "straight", direction: "i" },
  }),
  e("FUTURE", {
    twoHanded: false,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "l", location: "cheek" },
    movement: { type: "straight", direction: "o" },
  }),
  e("YESTERDAY", {
    twoHanded: false,
    dominant: { shape: "pinch12", extFingerDir: "u", palmOr: "l", location: "cheek" },
    movement: { type: "straight", direction: "i" },
  }),
  e("TOMORROW", {
    twoHanded: false,
    dominant: { shape: "fist", extFingerDir: "u", palmOr: "l", location: "cheek" },
    movement: { type: "curved", direction: "o" },
  }),
]);
