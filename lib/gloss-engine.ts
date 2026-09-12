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

/* ---------------------------------------------------------------- *
 * Lexical resources for the rule-based path
 * ---------------------------------------------------------------- */

const QUESTION_WORDS = new Set(["WHAT", "WHO", "WHERE", "WHEN", "WHY", "HOW", "WHICH"]);

const TIME_WORDS = new Set([
  "YESTERDAY", "TOMORROW", "TODAY", "NOW", "TONIGHT", "BEFORE", "AFTER",
  "LATER", "SOON", "ALREADY", "YEAR", "WEEK", "MONTH", "MORNING", "EVENING",
]);

const NEGATIONS = new Set(["NOT", "NO", "NEVER", "NOTHING", "DONT", "DOESNT", "CANT", "WONT"]);

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
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9'\s-]/g, " ")
    .replace(/'(S|RE|VE|LL|D|M|T)\b/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Applies a sign language's grammar profile to an English clause.
 * Returns gloss lemmas in target-language order.
 */
export function glossByRules(text: string, profile: SignLanguageProfile): string[] {
  const g = profile.grammar;
  const drop = new Set(g.dropWords.map((w) => w.toUpperCase()));

  const isQuestion = /\?\s*$/.test(text.trim());
  const tokens = tokenize(text);

  // 1. Tense detection BEFORE we strip auxiliaries.
  let timeMarker: string | null = null;
  if (g.timeMarkerFirst) {
    const hasPast = tokens.some((t) => PAST_TENSE[t] || /^[A-Z]+ED$/.test(t));
    const hasFuture = tokens.some((t) => t === "WILL" || t === "SHALL" || t === "GOING");
    const hasExplicitTime = tokens.some((t) => TIME_WORDS.has(t));
    if (!hasExplicitTime) {
      if (hasFuture) timeMarker = "FUTURE";
      else if (hasPast) timeMarker = "BEFORE";
    }
  }

  // 2. Normalise: de-inflect verbs, map pronouns, drop function words.
  const out: string[] = [];
  for (const raw of tokens) {
    let t = raw;
    if (PAST_TENSE[t]) t = PAST_TENSE[t];
    else if (/^[A-Z]{4,}ED$/.test(t)) t = t.slice(0, -2);
    else if (/^[A-Z]{4,}ING$/.test(t)) t = t.slice(0, -3);
    // Third-person singular -s: "CALLS" → "CALL". Only strip when the base is a
    // known verb, so plural nouns like GLASS/NEWS are left alone.
    else if (/^[A-Z]{3,}S$/.test(t) && !t.endsWith("SS") && VERBS.has(t.slice(0, -1))) {
      t = t.slice(0, -1);
    }

    if (PRONOUNS[t]) t = PRONOUNS[t];
    if (drop.has(t)) continue;
    if (g.dropCopula && ["IS", "AM", "ARE", "WAS", "WERE", "BE", "BEEN"].includes(t)) continue;
    if (["WILL", "SHALL", "GOING", "DO", "DOES", "DID"].includes(t)) continue;

    // Normalise contracted negatives to the NOT particle.
    if (NEGATIONS.has(t)) t = "NOT";

    if (t) out.push(t);
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

  // 7. Negation placement.
  if (negations.length) {
    if (g.negationAfterVerb) {
      body.push("NOT"); // ISL/BSL: post-verbal particle
    } else {
      body.push("NOT"); // ASL: particle + headshake NMM added downstream
    }
  }

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

async function glossWithLlm(
  segments: TranscriptSegment[],
  profile: SignLanguageProfile,
  keys: LlmKeys,
): Promise<string[] | null> {
  const useGroq = !!keys.groqKey;
  const apiKey = useGroq ? keys.groqKey : keys.openaiKey;
  if (!apiKey) return null;

  const endpoint = useGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = useGroq ? "llama-3.3-70b-versatile" : "gpt-4o";

  const numbered = segments.map((s, i) => `${i + 1}. ${s.text}`).join("\n");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
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
      console.warn(`[gloss] LLM ${res.status}: ${await res.text()}`);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed.gloss) ? parsed.gloss : null;
    if (!arr || arr.length !== segments.length) return null;
    return arr.map((s: unknown) => String(s).toUpperCase().trim());
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

  let llmGloss: string[] | null = null;
  if (!opts.rulesOnly && segments.length) {
    llmGloss = await glossWithLlm(segments, profile, {
      groqKey: opts.groqKey,
      openaiKey: opts.openaiKey,
    });
  }

  const rows: GlossRow[] = segments.map((seg, i) => {
    const lemmas = llmGloss
      ? llmGloss[i].split(/\s+/).filter(Boolean)
      : glossByRules(seg.text, profile);

    return {
      startTime: seg.start,
      endTime: seg.end,
      sourceText: seg.text,
      gloss: lemmas.join(" "),
      nmm: deriveNMM(seg.text, lemmas, profile, seg.start),
      status: "queued",
      lang: profile.code,
    };
  });

  return { rows, engine: llmGloss ? "llm" : "rules" };
}
