/**
 * Prosody & emotion analysis.
 *
 * Borrowed from GenASL's insight that a sign-language interpretation driven by
 * *words alone* is flat: speech rate, emphasis and affect carry grammatical
 * weight in sign languages, where they surface as non-manual markers, sign
 * size and articulation speed.
 *
 * We derive prosody from two sources that are always available in our pipeline:
 *   - segment timing from Whisper (→ speaking rate, pauses)
 *   - lexical/punctuation cues from the transcript (→ affect, emphasis)
 *
 * `analyzeAudioProsody` is the hook for real acoustic features (F0/RMS via
 * librosa or the Web Audio API); until that lands, the timing+lexical estimate
 * drives the avatar and is clearly labelled as such.
 */

import { EmotionLabel, ProsodyFrame, TranscriptSegment } from "./types";

const EMOTION_LEXICON: Record<EmotionLabel, string[]> = {
  happy: ["happy", "laugh", "joy", "great", "wonderful", "love", "excited", "glad", "fun", "smile"],
  sad: ["sad", "sorry", "unfortunately", "cry", "lost", "miss", "hurt", "difficult", "afraid"],
  angry: ["angry", "hate", "furious", "unacceptable", "wrong", "stop", "no", "refuse"],
  surprised: ["surprise", "suddenly", "wow", "unexpected", "amazing", "incredible", "really"],
  emphatic: ["must", "definitely", "absolutely", "never", "always", "critical", "important", "need"],
  questioning: ["what", "why", "how", "when", "where", "who", "which", "whether"],
  neutral: [],
};

function detectEmotion(text: string): { emotion: EmotionLabel; confidence: number } {
  if (typeof text !== "string" || !text) return { emotion: "neutral", confidence: 0.2 };
  const lower = text.toLowerCase();
  const words = lower.split(/\W+/).filter(Boolean);
  if (!words.length) return { emotion: "neutral", confidence: 0.2 };

  let best: EmotionLabel = "neutral";
  let bestHits = 0;

  (Object.keys(EMOTION_LEXICON) as EmotionLabel[]).forEach((emo) => {
    // Match words and common inflections, not incidental substrings: "know"
    // and "another" must not trigger the negative word "no".
    const hits = EMOTION_LEXICON[emo].filter((w) => words.some((word) =>
      word === w || word === `${w}s` || word === `${w}ed` || word === `${w}ing`,
    )).length;
    if (hits > bestHits) {
      bestHits = hits;
      best = emo;
    }
  });

  // Punctuation overrides lexical cues.
  if (/\?\s*$/.test(text.trim())) {
    return { emotion: "questioning", confidence: 0.9 };
  }
  if (/!\s*$/.test(text.trim())) {
    return { emotion: "emphatic", confidence: 0.85 };
  }
  if (bestHits === 0) return { emotion: "neutral", confidence: 0.3 };

  return { emotion: best, confidence: Math.min(0.5 + bestHits * 0.2, 0.95) };
}

/** Words per second, normalised against conversational English (~2.5 wps). */
function speakingRate(seg: TranscriptSegment): number {
  const span = Number(seg.end) - Number(seg.start);
  const dur = Number.isFinite(span) ? Math.max(span, 0.2) : 0.2;
  const words = typeof seg.text === "string" ? seg.text.split(/\s+/).filter(Boolean).length : 0;
  return words / dur;
}

export function analyzeProsody(segments: TranscriptSegment[]): ProsodyFrame[] {
  if (!segments.length) return [];

  const rates = segments.map(speakingRate);
  const maxRate = Math.max(...rates, 1);

  return segments.map((seg, i) => {
    const { emotion, confidence } = detectEmotion(seg.text);
    const rate = rates[i];

    // Energy proxy: faster + longer + exclamatory → louder/more emphatic.
    const lengthFactor = Math.min(seg.text.length / 80, 1);
    const punchFactor = /!/.test(seg.text) ? 0.25 : 0;
    const energy = Math.min(0.25 + (rate / maxRate) * 0.5 + lengthFactor * 0.2 + punchFactor, 1);

    // Pitch proxy: questions rise, statements fall.
    const pitch = /\?\s*$/.test(seg.text.trim())
      ? 0.75
      : emotion === "happy" || emotion === "surprised"
        ? 0.65
        : emotion === "sad"
          ? 0.32
          : 0.5;

    return {
      time: seg.start,
      energy: Math.round(energy * 100) / 100,
      pitch,
      rate: Math.round(rate * 100) / 100,
      emotion,
      confidence,
    };
  });
}

/** Maps an emotion to the facial non-manual marker the avatar should hold. */
export function emotionToNMM(emotion: EmotionLabel, supportsIslNmm: boolean): string {
  switch (emotion) {
    case "questioning":
      return "wh-question_browDown";
    case "happy":
      return supportsIslNmm ? "head_tilt_affirm" : "positive_headnod";
    case "sad":
      return "pursedLips";
    case "angry":
      return "negative_headshake";
    case "surprised":
      return "raised_brow";
    case "emphatic":
      return "topic_eyebrow";
    default:
      return "neutral";
  }
}

/**
 * Placeholder for true acoustic analysis. Returns null so callers fall back to
 * `analyzeProsody`; wire this to librosa/Web Audio when raw PCM is available.
 */
export async function analyzeAudioProsody(): Promise<ProsodyFrame[] | null> {
  return null;
}
