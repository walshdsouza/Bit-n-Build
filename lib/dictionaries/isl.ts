/**
 * Indian Sign Language (ISL) sign dictionary.
 *
 * Encoded from ISL phonological descriptions (ISLRTC lexicon conventions).
 * Two structural differences from ASL are worth calling out, because they
 * drive the renderer:
 *
 *  1. ISL is heavily TWO-HANDED. Where ASL uses a one-handed sign, ISL often
 *     uses a symmetric or asymmetric two-handed one — so `twoHanded: true`
 *     is the common case here, not the exception.
 *  2. ISL's manual alphabet is two-handed: letters are formed against the
 *     non-dominant hand rather than in neutral space (see `isl-fingerspell.ts`).
 *
 * Lemmas missing here fall back to two-handed fingerspelling.
 */

import { SignEntry } from "../types";

const e = (
  gloss: string,
  entry: Omit<SignEntry, "gloss">,
): [string, SignEntry] => [gloss, { gloss, ...entry }];

export const ISL_DICTIONARY = new Map<string, SignEntry>([
  // ---- Pronouns ----
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

  // ---- People / kinship ----
  // ISL MAN: grasp at the moustache line — distinct from ASL's forehead tap.
  e("MAN", {
    twoHanded: false,
    dominant: { shape: "pinch12", extFingerDir: "l", palmOr: "d", location: "mouth" },
    movement: { type: "straight", direction: "r", size: "small" },
  }),
  // ISL WOMAN: thumb traces the nose-ring / bindi position.
  e("WOMAN", {
    twoHanded: false,
    dominant: { shape: "pinch12", extFingerDir: "u", palmOr: "i", location: "nose" },
    movement: { type: "twist", size: "small" },
  }),
  e("FRIEND", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "contact", repetitions: 2 },
  }),
  e("MOTHER", {
    twoHanded: false,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "i", location: "cheek" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("FATHER", {
    twoHanded: false,
    dominant: { shape: "pinch12", extFingerDir: "l", palmOr: "d", location: "mouth" },
    movement: { type: "straight", direction: "r", size: "small", repetitions: 2 },
  }),
  e("TEACHER", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "o", location: "chest" },
    movement: { type: "straight", direction: "o" },
  }),

  // ---- Cognition / state ----
  e("THINK", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "forehead" },
    movement: { type: "circle", size: "small" },
    nmm: "topic_eyebrow",
  }),
  e("KNOW", {
    twoHanded: false,
    dominant: { shape: "flat", extFingerDir: "l", palmOr: "i", location: "forehead" },
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
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "i", location: "chest" },
    movement: { type: "contact" },
    nmm: "positive_headnod",
  }),
  e("HAPPY", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "i", location: "chest" },
    movement: { type: "circle", repetitions: 2 },
    nmm: "positive_headnod",
  }),
  e("LAUGH", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2345", extFingerDir: "u", palmOr: "i", location: "mouth" },
    movement: { type: "straight", direction: "ur", repetitions: 2 },
    nmm: "positive_headnod",
  }),
  e("SAD", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2345", extFingerDir: "d", palmOr: "i", location: "eyes" },
    movement: { type: "straight", direction: "d" },
  }),

  // ---- Actions ----
  e("GO", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "straight", direction: "o" },
  }),
  e("COME", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "i", palmOr: "u", location: "neutral_space" },
    movement: { type: "curved", direction: "i" },
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
  e("CALL", {
    twoHanded: false,
    dominant: { shape: "pinch12", extFingerDir: "u", palmOr: "i", location: "cheek" },
    movement: { type: "contact" },
  }),
  e("ASK", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "u", location: "chest" },
    movement: { type: "straight", direction: "o" },
    nmm: "wh-question_browDown",
  }),
  e("HELP", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "l", location: "neutral_space" },
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
  e("WORK", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "fist", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "fist", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("PLAN", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "l", location: "neutral_space" },
    movement: { type: "straight", direction: "r" },
  }),
  e("SUGGEST", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "chest" },
    movement: { type: "straight", direction: "ur" },
  }),

  // ---- Nouns ----
  e("FOOD", {
    twoHanded: false,
    dominant: { shape: "pinchall", extFingerDir: "i", palmOr: "d", location: "mouth" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("WATER", {
    twoHanded: false,
    dominant: { shape: "cee12", extFingerDir: "l", palmOr: "l", location: "mouth" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("SCHOOL", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("HOME", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "d", location: "head" },
    movement: { type: "contact" },
  }),
  e("NAME", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "finger2", extFingerDir: "d", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "straight", direction: "o" },
  }),
  e("MONEY", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "tap", repetitions: 2 },
  }),
  e("BOOK", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "o", palmOr: "u", location: "neutral_space" },
    movement: { type: "curved", direction: "l" },
  }),
  e("PIZZA", {
    twoHanded: false,
    dominant: { shape: "finger23", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "zigzag" },
  }),
  e("DIET", {
    twoHanded: false,
    dominant: { shape: "pinch12", extFingerDir: "u", palmOr: "l", location: "stomach" },
    movement: { type: "straight", direction: "d" },
  }),
  e("ADVICE", {
    twoHanded: true,
    symmetric: false,
    dominant: { shape: "pinchall", extFingerDir: "d", palmOr: "d", location: "neutral_space" },
    nonDominant: { shape: "flat", extFingerDir: "o", palmOr: "d", location: "neutral_space" },
    movement: { type: "straight", direction: "o" },
  }),

  // ---- Function / discourse ----
  // ISL negation is a signed particle placed AFTER the verb.
  e("NOT", {
    twoHanded: false,
    dominant: { shape: "finger2345", extFingerDir: "u", palmOr: "o", location: "neutral_space" },
    movement: { type: "twist", repetitions: 2 },
    nmm: "negative_headshake",
  }),
  e("YES", {
    twoHanded: false,
    dominant: { shape: "fist", extFingerDir: "u", palmOr: "o", location: "neutral_space" },
    movement: { type: "nod", repetitions: 2 },
    nmm: "head_tilt_affirm",
  }),
  e("NO", {
    twoHanded: false,
    dominant: { shape: "finger23", extFingerDir: "u", palmOr: "o", location: "neutral_space" },
    movement: { type: "twist" },
    nmm: "negative_headshake",
  }),
  e("BUT", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "neutral_space" },
    movement: { type: "straight", direction: "l" },
  }),
  e("GOOD", {
    twoHanded: false,
    dominant: { shape: "fist", extFingerDir: "u", palmOr: "o", location: "neutral_space" },
    movement: { type: "straight", direction: "u", size: "small" },
    nmm: "positive_headnod",
  }),
  e("BAD", {
    twoHanded: false,
    dominant: { shape: "fist", extFingerDir: "d", palmOr: "i", location: "neutral_space" },
    movement: { type: "straight", direction: "d", size: "small" },
  }),

  // ---- Question words (clause-final in ISL) ----
  e("WHAT", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "finger2345", extFingerDir: "u", palmOr: "u", location: "neutral_space" },
    movement: { type: "twist", repetitions: 2 },
    nmm: "wh-question_browDown",
  }),
  e("WHO", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "o", location: "neutral_space" },
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
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "forehead" },
    movement: { type: "straight", direction: "o" },
    nmm: "wh-question_browDown",
  }),
  e("HOW", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "u", location: "neutral_space" },
    movement: { type: "twist" },
    nmm: "wh-question_browDown",
  }),

  // ---- Time markers (fronted in ISL) ----
  e("NOW", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "u", location: "neutral_space" },
    movement: { type: "straight", direction: "d", fast: true },
  }),
  e("BEFORE", {
    twoHanded: false,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "i", location: "shoulders" },
    movement: { type: "straight", direction: "i" },
  }),
  e("FUTURE", {
    twoHanded: false,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "l", location: "shoulders" },
    movement: { type: "straight", direction: "o" },
  }),
  e("YESTERDAY", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "i", location: "shoulder_r" },
    movement: { type: "straight", direction: "i" },
  }),
  e("TOMORROW", {
    twoHanded: false,
    dominant: { shape: "finger2", extFingerDir: "u", palmOr: "o", location: "shoulder_r" },
    movement: { type: "curved", direction: "o" },
  }),
  e("TODAY", {
    twoHanded: true,
    symmetric: true,
    dominant: { shape: "flat", extFingerDir: "u", palmOr: "u", location: "neutral_space" },
    movement: { type: "straight", direction: "d" },
  }),
]);
