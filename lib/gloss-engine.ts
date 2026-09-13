/**
 * Gloss engine: English text → sign-language gloss.
 *
 * Two paths, mirroring GenASL's "interpreter brain" idea:
 *   1. LLM path (Groq/OpenAI) — prompted per target language with that
 *      language's grammar profile. Handles nuance, role shift, emphasis.
 *   2. Deterministic rule path — a real syntactic transform used when no API
 *      key is present, so the demo works offline and the output is still
 *      grammatically shaped for the target language rather than mocked.
 *
 * The rule path is what makes ISL support meaningful: ISL is SOV with
 * clause-final question words, post-verbal negation and fronted time markers,
 * none of which fall out of simply relabelling ASL output.
 */

import { GlossRow, NMMTag, SignLanguageCode, TranscriptSegment } from "./types";
import { buildGlossSystemPrompt, getProfile, SignLanguageProfile } from "./sign-languages";
import { translateTranscriptToEnglish } from "./transcript-translation";

/* ---------------------------------------------------------------- *
 * Lexical resources for the rule-based path
 * ---------------------------------------------------------------- */

const QUESTION_WORDS = new Set(["WHAT", "WHO", "WHERE", "WHEN", "WHY", "HOW", "WHICH"]);

const TIME_WORDS = new Set([
  "YESTERDAY", "TOMORROW", "TODAY", "NOW", "TONIGHT", "BEFORE", "AFTER",
  "LATER", "SOON", "ALREADY", "YEAR", "WEEK", "MONTH", "MORNING", "EVENING",
]);

const NEGATIONS = new Set([
  "NOT", "NO", "NEVER", "NOTHING", "CANNOT", "DONT", "DOESNT", "DIDNT",
  "CANT", "WONT", "ISNT", "ARENT", "WASNT", "WERENT", "HASNT", "HAVENT",
  "HADNT", "COULDNT", "SHOULDNT", "WOULDNT", "MUSTNT", "NEEDNT",
]);

/** Irregular past tense → (lemma, time marker). */
const PAST_TENSE: Record<string, string> = {
  WENT: "GO", ATE: "EAT", SAW: "SEE", SAID: "SAY", MADE: "MAKE",
  TOOK: "TAKE", CAME: "COME", GAVE: "GIVE", THOUGHT: "THINK",
  KNEW: "KNOW", GOT: "GET", FOUND: "FIND", TOLD: "TELL", DRANK: "DRINK",
  WANTED: "WANT", CALLED: "CALL", PLANNED: "PLAN", LAUGHED: "LAUGH",
  ASKED: "ASK", SUGGESTED: "SUGGEST", HELPED: "HELP", WORKED: "WORK",
};

const PRONOUNS: Record<string, string> = {
  I: "IX-1", ME: "IX-1", MY: "IX-1", MINE: "IX-1", MYSELF: "IX-1",
  YOU: "IX-2", YOUR: "IX-2", YOURS: "IX-2",
  HE: "IX-3", SHE: "IX-3", HIM: "IX-3", HER: "IX-3", HIS: "IX-3",
  THEY: "IX-3", THEM: "IX-3", THEIR: "IX-3", IT: "IX-3",
  WE: "TWO-OF-US", US: "TWO-OF-US", OUR: "TWO-OF-US",
};

/** Very small verb lexicon — enough to find the verb for SOV reordering. */
const VERBS = new Set([
  "GO", "COME", "EAT", "DRINK", "WANT", "THINK", "KNOW", "CALL", "ASK",
  "SUGGEST", "PLAN", "HELP", "LEARN", "WORK", "LOVE", "LAUGH", "SEE",
  "SAY", "MAKE", "TAKE", "GIVE", "GET", "FIND", "TELL", "READ", "WRITE",
  "BUY", "SELL", "PLAY", "RUN", "WALK", "SLEEP", "LIVE", "MEET", "NEED",
]);

/* ---------------------------------------------------------------- *
 * Rule-based glosser
 * ---------------------------------------------------------------- */

function tokenize(text: string): string[] {
  if (typeof text !== "string" || !text) return [];
  return (
    text
      .toUpperCase()
      .replace(/[‘’]/g, "'")
      .replace(/[^A-Z0-9'\s-]/g, " ")
      // Expand negative contractions BEFORE apostrophe suffixes are stripped.
      // Without this, "DON'T" loses its "'T" and becomes "DON" — silently
      // dropping the negation and inverting the meaning of the sentence.
      .replace(/\bCAN'T\b/g, " CAN NOT ")
      .replace(/\bWON'T\b/g, " WILL NOT ")
      .replace(/\bSHAN'T\b/g, " SHALL NOT ")
      .replace(/\bAIN'T\b/g, " IS NOT ")
      .replace(/([A-Z]+)N'T\b/g, "$1 NOT ")
      // Remaining clitics carry no sign: possessive 'S, copula 'RE/'M/'S, etc.
      .replace(/'(S|RE|VE|LL|D|M)\b/g, "")
      .replace(/'/g, "")
      .split(/\s+/)
      .filter(Boolean)
  );
}

/**
 * Applies a sign language's grammar profile to an English clause.
 * Returns gloss lemmas in target-language order.
 */
export function glossByRules(text: string, profile: SignLanguageProfile): string[] {
  const g = profile.grammar;
  const drop = new Set(g.dropWords.map((w) => w.toUpperCase()));

  const source = typeof text === "string" ? text : "";
  const isQuestion = /\?\s*$/.test(source.trim());
  const tokens = tokenize(source);

  // 1. Normalise: de-inflect verbs, map pronouns, drop function words.
  //
  // Every de-inflection rule is gated on the stem being a KNOWN VERB. Matching
  // on the suffix alone wrecks ordinary nouns: "NEED"/"SEED"/"BED" all end in
  // -ED, and "KING"/"THING" all end in -ING.
  let sawPast = false;
  let sawFuture = false;
  const out: string[] = [];

  for (const raw of tokens) {
    let t = raw;

    if (PAST_TENSE[t]) {
      t = PAST_TENSE[t];
      sawPast = true;
    } else if (/^[A-Z]{4,}ED$/.test(t) && VERBS.has(t.slice(0, -2))) {
      t = t.slice(0, -2); // WALKED → WALK
      sawPast = true;
    } else if (
      /^[A-Z]{4,}ED$/.test(t) &&
      VERBS.has(t.slice(0, -1)) &&
      // Only for verbs whose stem ends consonant+E (LIVE→LIVED). Guards against
      // SEED→SEE and FEED→FEE, where the stem ends in a vowel pair.
      /[^AEIOU]E$/.test(t.slice(0, -1))
    ) {
      t = t.slice(0, -1);
      sawPast = true;
    } else if (/^[A-Z]{4,}ING$/.test(t) && VERBS.has(t.slice(0, -3))) {
      t = t.slice(0, -3); // WALKING → WALK
    } else if (/^[A-Z]{3,}S$/.test(t) && !t.endsWith("SS") && VERBS.has(t.slice(0, -1))) {
      t = t.slice(0, -1); // CALLS → CALL
    }

    if (t === "WILL" || t === "SHALL" || raw === "GOING") sawFuture = true;

    if (PRONOUNS[t]) t = PRONOUNS[t];
    if (drop.has(t)) continue;
    if (g.dropCopula && ["IS", "AM", "ARE", "WAS", "WERE", "BE", "BEEN"].includes(t)) continue;
    if (["WILL", "SHALL", "GOING", "DO", "DOES", "DID"].includes(t)) continue;

    // Normalise contracted negatives to the NOT particle.
    if (NEGATIONS.has(t)) t = "NOT";

    if (t) out.push(t);
  }

  // 2. Tense is not inflected on the verb in these languages; it is carried by
  //    a fronted time marker instead. An explicit time word in the sentence
  //    always wins over the inferred one.
  let timeMarker: string | null = null;
  if (g.timeMarkerFirst && !out.some((t) => TIME_WORDS.has(t))) {
    if (sawFuture) timeMarker = "FUTURE";
    else if (sawPast) timeMarker = "BEFORE";
  }

  // 3. Pull out question words and negation for repositioning.
  const questions: string[] = [];
  const negations: string[] = [];
  let body = out.filter((t) => {
    if (QUESTION_WORDS.has(t)) {
      questions.push(t);
      return false;
    }
    if (t === "NOT") {
      negations.push(t);
      return false;
    }
    return true;
  });

  // 4. Collapse a referent repeated inside one clause — sign languages
  //    establish a pronoun in space once ("IX-3 CALL IX-3 FRIEND" → "IX-3 CALL
  //    FRIEND") rather than re-indexing it every time English says "her".
  const seenIx = new Set<string>();
  body = body.filter((t) => {
    if (!t.startsWith("IX")) return true;
    if (seenIx.has(t)) return false;
    seenIx.add(t);
    return true;
  });

  // 5. Constituent reordering. This runs BEFORE time-fronting so that moving
  //    the object or verb can never displace the time marker from first position.
  const timeWords = body.filter((t) => TIME_WORDS.has(t));
  body = body.filter((t) => !TIME_WORDS.has(t));

  if (g.wordOrder === "SOV") {
    // Move the verb to the end of the clause: "I drink water" → "I water drink".
    const verbIdx = body.findIndex((t) => VERBS.has(t));
    if (verbIdx !== -1 && verbIdx < body.length - 1) {
      const verb = body.splice(verbIdx, 1)[0];
      body.push(verb);
    }
  } else if (g.wordOrder === "TOPIC_COMMENT") {
    // Front the object as topic when there is a clear S-V-O shape.
    const verbIdx = body.findIndex((t) => VERBS.has(t));
    if (verbIdx > 0 && verbIdx < body.length - 1) {
      const topic = body.slice(verbIdx + 1);
      const comment = body.slice(0, verbIdx + 1);
      if (topic.length <= 2) body = [...topic, ...comment];
    }
  }

  // 6. Now front the time marker, ahead of the reordered clause.
  if (g.timeMarkerFirst) {
    if (timeWords.length) body = [...timeWords, ...body];
    else if (timeMarker) body = [timeMarker, ...body];
  } else if (timeWords.length) {
    body = [...body, ...timeWords];
  }

  // 7. Negation. Both grammars place the NOT particle clause-finally (after the
  //    verb, which SOV has already moved to the end); they differ in that ASL
  //    leans on the headshake NMM, added downstream in deriveNMM().
  if (negations.length) body.push("NOT");

  // 8. Question word placement.
  if (questions.length) {
    if (g.questionWordPosition === "final") body = [...body, ...questions];
    else if (g.questionWordPosition === "initial") body = [...questions, ...body];
    else body = [...body, ...questions];
  } else if (isQuestion && g.questionWordPosition === "final") {
    // Yes/no question with no wh-word — carried entirely by the NMM.
  }

  return body.filter(Boolean);
}

/** Chooses the non-manual markers for a glossed clause. */
export function deriveNMM(
  text: string,
  lemmas: string[],
  profile: SignLanguageProfile,
  startTime: number,
): NMMTag[] {
  const tags: NMMTag[] = [];
  const t = text.trim();
  const hasWh = lemmas.some((l) => QUESTION_WORDS.has(l));
  const isQuestion = /\?$/.test(t);

  if (hasWh) {
    tags.push({ time: startTime + 0.1, emotion: "wh-question_browDown", intensity: 0.8 });
  } else if (isQuestion) {
    tags.push({ time: startTime + 0.1, emotion: "yes-no_browUp", intensity: 0.75 });
  }

  if (lemmas.includes("NOT")) {
    tags.push({ time: startTime + 0.2, emotion: "negative_headshake", intensity: 0.9 });
  }

  if (/!$/.test(t)) {
    const emphatic = profile.nmmSet.includes("head_tilt_affirm")
      ? "head_tilt_affirm"
      : "positive_headnod";
    tags.push({ time: startTime + 0.15, emotion: emphatic, intensity: 0.85 });
  }

  if (!tags.length) {
    tags.push({ time: startTime, emotion: "neutral", intensity: 0.3 });
  }
  return tags;
}

/* ---------------------------------------------------------------- *
 * LLM path
 * ---------------------------------------------------------------- */

interface LlmKeys {
  groqKey?: string | null;
  openaiKey?: string | null;
}

function normalizeLlmGloss(gloss: string, source: string, profile: SignLanguageProfile): string[] | null {
  const sourceTokens = tokenize(source);
  const lemmas = tokenize(gloss).map((lemma) =>
    PRONOUNS[lemma] ?? PAST_TENSE[lemma] ?? (NEGATIONS.has(lemma) ? "NOT" : lemma),
  );
  if (!lemmas.length) return null;
  // An omitted negative changes the meaning and loses its headshake NMM.
  // Reject the response so the normal rule fallback preserves the clause;
  // blindly appending NOT could attach it to the wrong model-reordered clause.
  if (sourceTokens.some((token) => NEGATIONS.has(token)) && !lemmas.includes("NOT")) return null;
  if (!profile.grammar.timeMarkerFirst) return lemmas;
  const explicitTime = sourceTokens.filter((token) => TIME_WORDS.has(token));
  if (explicitTime.some((token) => !lemmas.includes(token))) return null;
  const isTime = (lemma: string) => TIME_WORDS.has(lemma) || lemma === "FUTURE";
  return [...lemmas.filter(isTime), ...lemmas.filter((lemma) => !isTime(lemma))];
}

async function glossWithLlm(
  segments: TranscriptSegment[],
  profile: SignLanguageProfile,
  keys: LlmKeys,
): Promise<string[] | null> {
  const useGroq = !!keys.groqKey?.trim();
  const apiKey = useGroq ? keys.groqKey : keys.openaiKey;
  if (!apiKey?.trim()) return null;

  const endpoint = useGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = useGroq ? "openai/gpt-oss-120b" : "gpt-4o";

  const numbered = segments.map((s, i) => `${i + 1}. ${s.text}`).join("\n");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildGlossSystemPrompt(profile) },
          {
            role: "user",
            content:
              `Gloss each numbered sentence into ${profile.code}.\n` +
              `Respond as JSON: {"gloss": ["<line 1 gloss>", "<line 2 gloss>", ...]} ` +
              `with exactly ${segments.length} entries, same order.\n\n${numbered}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.warn(`[gloss] LLM returned HTTP ${res.status}; using local rules.`);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed.gloss) ? parsed.gloss : null;
    if (!arr || arr.length !== segments.length || arr.some((s: unknown) => typeof s !== "string" || !s.trim())) return null;
    // Preserve model ordering within the clause, enforce profile time-fronting,
    // and keep the existing, honestly reported rule fallback for meaning loss.
    const normalized = arr.map((gloss: string, index: number) => normalizeLlmGloss(gloss, segments[index].text, profile));
    if (normalized.some((lemmas: string[] | null) => !lemmas)) return null;
    return normalized.map((lemmas: string[]) => lemmas.join(" "));
  } catch (err) {
    console.warn("[gloss] LLM path failed, falling back to rules:", err);
    return null;
  }
}

/* ---------------------------------------------------------------- *
 * Orchestrator
 * ---------------------------------------------------------------- */

export interface GlossOptions {
  lang: SignLanguageCode;
  groqKey?: string | null;
  openaiKey?: string | null;
  /** Skip the network call entirely. */
  rulesOnly?: boolean;
}

export async function generateGloss(
  segments: TranscriptSegment[],
  opts: GlossOptions,
): Promise<{ rows: GlossRow[]; engine: "llm" | "rules" }> {
  const profile = getProfile(opts.lang);
  // Older saved transcripts or API callers may still supply source-language
  // captions. Translate them before the English-only rule fallback can erase
  // their letters; missing translation credentials must fail explicitly.
  const englishSegments = await translateTranscriptToEnglish(segments, {
    groqKey: opts.rulesOnly ? undefined : opts.groqKey,
    openaiKey: opts.rulesOnly ? undefined : opts.openaiKey,
  });

  let llmGloss: string[] | null = null;
  if (!opts.rulesOnly && segments.length) {
    llmGloss = await glossWithLlm(englishSegments, profile, {
      groqKey: opts.groqKey,
      openaiKey: opts.openaiKey,
    });
  }

  const rows: GlossRow[] = segments.map((seg, i) => {
    const lemmas = llmGloss
      ? llmGloss[i].split(/\s+/).filter(Boolean)
      : glossByRules(englishSegments[i].text, profile);

    return {
      startTime: seg.start,
      endTime: seg.end,
      sourceText: seg.text,
      gloss: lemmas.join(" "),
      nmm: deriveNMM(englishSegments[i].text, lemmas, profile, seg.start),
      status: "queued",
      lang: profile.code,
    };
  });

  return { rows, engine: llmGloss ? "llm" : "rules" };
}
