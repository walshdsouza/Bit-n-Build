/**
 * Sign language registry.
 *
 * GestureSync was originally ASL-only. This registry generalises the pipeline
 * so every downstream stage (glossing → HamNoSys → SiGML → motion synthesis)
 * is parameterised by a sign language profile rather than hard-coding ASL.
 *
 * Indian Sign Language (ISL) is a first-class target here. ISL is *not* a
 * dialect of ASL — it has its own lexicon, a predominantly two-handed
 * manual alphabet, and distinct grammar (see `GrammarProfile` below).
 */

import { SignLanguageCode } from "./types";

export interface GrammarProfile {
  /** Canonical constituent order the glosser should emit. */
  wordOrder: "SOV" | "SVO" | "TOPIC_COMMENT";
  /** Function words stripped before glossing. */
  dropWords: string[];
  /** Copulas ("is/are/was") are not signed in any of these languages. */
  dropCopula: boolean;
  /** Where interrogative words land in the sentence. */
  questionWordPosition: "final" | "initial" | "in_situ";
  /**
   * Tense is not inflected on the verb; a time marker is fronted instead.
   * ISL relies on this far more heavily than ASL.
   */
  timeMarkerFirst: boolean;
  /** Negation particle follows the verb (ISL) vs. headshake-only (ASL). */
  negationAfterVerb: boolean;
  /** Plural by reduplication rather than an inflected sign. */
  pluralByReduplication: boolean;
  /** Optional override for the drop-word list shown in the LLM prompt. */
  grammarDropSample?: string;
}

export interface SignLanguageProfile {
  code: SignLanguageCode;
  name: string;
  nativeName?: string;
  region: string;
  /** Manual alphabet handedness — drives the fingerspelling renderer. */
  fingerspellingHands: 1 | 2;
  /** Characters the manual alphabet can represent. */
  alphabet: string;
  grammar: GrammarProfile;
  /** Non-manual markers this language uses (drives the avatar's face rig). */
  nmmSet: string[];
  /** Average seconds per sign — used to time the motion plan. */
  secondsPerSign: number;
  /** Source languages we can gloss from. */
  sourceLanguages: string[];
  /** Extra instructions appended to the LLM gloss prompt. */
  promptNotes: string[];
}

const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const SIGN_LANGUAGES: Record<SignLanguageCode, SignLanguageProfile> = {
  ASL: {
    code: "ASL",
    name: "American Sign Language",
    region: "United States & Canada",
    fingerspellingHands: 1,
    alphabet: LATIN,
    grammar: {
      wordOrder: "TOPIC_COMMENT",
      dropWords: [
        "a", "an", "the", "of", "to", "for", "at", "in", "on", "very",
        "about", "with", "from", "into", "instead", "both", "some", "just",
        "that", "as", "by", "and", "or", "so",
      ],
      dropCopula: true,
      questionWordPosition: "final",
      timeMarkerFirst: true,
      negationAfterVerb: false,
      pluralByReduplication: true,
    },
    nmmSet: [
      "wh-question_browDown",
      "yes-no_browUp",
      "negative_headshake",
      "topic_eyebrow",
      "puffedCheeks",
      "pursedLips",
      "neutral",
      "raised_brow",
      "positive_headnod",
    ],
    secondsPerSign: 0.55,
    sourceLanguages: ["en"],
    promptNotes: [
      "Use topic-comment structure: front the topic, then comment on it.",
      "Use IX for pronouns and spatial indexing (IX-1 = I, IX-2 = you, IX-3 = he/she/they).",
      "Mark yes/no questions with raised brows, wh-questions with lowered brows.",
    ],
  },

  ISL: {
    code: "ISL",
    name: "Indian Sign Language",
    nativeName: "भारतीय सांकेतिक भाषा",
    region: "India, Nepal, Bangladesh, Pakistan",
    // ISL's manual alphabet is predominantly TWO-handed (unlike ASL's one-handed
    // alphabet) — the renderer must bring the non-dominant hand into play.
    fingerspellingHands: 2,
    alphabet: LATIN,
    grammar: {
      wordOrder: "SOV",
      // ISL has no articles and no grammatical copula. It also drops most
      // English prepositions and auxiliary verbs.
      dropWords: [
        "a", "an", "the", "of", "to", "for", "at", "in", "on",
        "is", "am", "are", "was", "were", "be", "been", "being",
        "do", "does", "did", "will", "would", "shall", "should",
        "has", "have", "had", "very", "so",
        "about", "with", "from", "into", "instead", "both", "some", "just",
        "that", "as", "by", "and", "or",
      ],
      dropCopula: true,
      // ISL reliably places the interrogative at the END of the clause:
      // "you name what?" rather than "what is your name?".
      questionWordPosition: "final",
      // No verb inflection for tense — a time sign is fronted instead:
      // "yesterday I school go".
      timeMarkerFirst: true,
      // Negation follows the verb: "I go not".
      negationAfterVerb: true,
      pluralByReduplication: true,
    },
    nmmSet: [
      "wh-question_browDown",
      "yes-no_browUp",
      "negative_headshake",
      "topic_eyebrow",
      "neutral",
      "raised_brow",
      "positive_headnod",
      // ISL-specific: a side-to-side head tilt used for affirmation/assent,
      // distinct from the ASL head nod.
      "head_tilt_affirm",
      "mouth_open_question",
    ],
    // ISL signs are on average slightly slower to articulate than ASL, largely
    // because so many are two-handed.
    secondsPerSign: 0.62,
    sourceLanguages: ["en", "hi"],
    promptNotes: [
      "Use strict Subject-Object-Verb order: 'I water drink', not 'I drink water'.",
      "Never sign articles (a/an/the) or any form of the copula 'to be'.",
      "Do not inflect verbs for tense. Front a time marker instead: BEFORE / NOW / FUTURE, or a specific time sign such as YESTERDAY, TOMORROW.",
      "Place question words (WHAT, WHO, WHERE, WHEN, WHY, HOW) at the END of the clause.",
      "Place negation AFTER the verb: 'I go NOT'.",
      "Express plurals by repeating the noun sign rather than adding a plural marker.",
      "Many ISL signs are two-handed; prefer a two-handed lemma when one exists.",
    ],
  },

  BSL: {
    code: "BSL",
    name: "British Sign Language",
    region: "United Kingdom",
    fingerspellingHands: 2,
    alphabet: LATIN,
    grammar: {
      wordOrder: "TOPIC_COMMENT",
      dropWords: ["a", "an", "the", "of", "to", "for", "at", "in", "on", "is", "are", "am"],
      dropCopula: true,
      questionWordPosition: "final",
      timeMarkerFirst: true,
      negationAfterVerb: true,
      pluralByReduplication: true,
    },
    nmmSet: [
      "wh-question_browDown",
      "yes-no_browUp",
      "negative_headshake",
      "topic_eyebrow",
      "neutral",
      "raised_brow",
      "positive_headnod",
    ],
    secondsPerSign: 0.6,
    sourceLanguages: ["en"],
    promptNotes: [
      "Use topic-comment structure with BSL's two-handed manual alphabet for names.",
    ],
  },
};

export const DEFAULT_SIGN_LANGUAGE: SignLanguageCode = "ASL";

/** Languages we ship a real dictionary + motion data for. */
export const PRODUCTION_READY: SignLanguageCode[] = ["ASL", "ISL"];

export function getProfile(code?: string | null): SignLanguageProfile {
  const key = (code || "").toUpperCase() as SignLanguageCode;
  return SIGN_LANGUAGES[key] ?? SIGN_LANGUAGES[DEFAULT_SIGN_LANGUAGE];
}

export function isSupported(code?: string | null): code is SignLanguageCode {
  return !!code && (code.toUpperCase() as SignLanguageCode) in SIGN_LANGUAGES;
}

/** Builds the system prompt for the LLM glosser for a given target language. */
export function buildGlossSystemPrompt(profile: SignLanguageProfile): string {
  const g = profile.grammar;
  return [
    `You are an expert ${profile.name} (${profile.code}) interpreter.`,
    `Convert English text into ${profile.code} gloss notation.`,
    "",
    "Rules:",
    `1. Word order: ${g.wordOrder.replace(/_/g, "-")}.`,
    `2. Omit articles and function words: ${g.grammarDropSample ?? g.dropWords.slice(0, 8).join(", ")}.`,
    g.dropCopula ? "3. Never gloss the copula (is/are/was/were)." : "3. Retain the copula.",
    g.timeMarkerFirst
      ? "4. Do not inflect verbs for tense; front a time marker instead (BEFORE, NOW, FUTURE, YESTERDAY, TOMORROW)."
      : "4. Inflect verbs for tense normally.",
    `5. Question words go ${g.questionWordPosition === "final" ? "at the END of the clause" : g.questionWordPosition === "initial" ? "at the START of the clause" : "in place"}.`,
    g.negationAfterVerb
      ? "6. Negation follows the verb (e.g. 'I GO NOT')."
      : "6. Negation is carried by a headshake non-manual marker.",
    `7. Emit facial Non-Manual Markers as JSON objects: {"time": <offset_seconds>, "emotion": "<nmm>"}.`,
    `   Valid NMM values: ${profile.nmmSet.join(", ")}.`,
    "8. Output ONLY uppercase gloss lemmas separated by spaces, no punctuation.",
    "",
    ...profile.promptNotes.map((n, i) => `${i + 9}. ${n}`),
  ].join("\n");
}
