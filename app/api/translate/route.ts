import { NextRequest, NextResponse } from "next/server";
import { normalizeSegments } from "@/lib/segments";
import { generateGloss } from "@/lib/gloss-engine";
import { analyzeProsody } from "@/lib/prosody";
import { buildSignPlan } from "@/lib/sign-plan";
import { getProfile, isSupported } from "@/lib/sign-languages";
import { dictionaryStats } from "@/lib/dictionaries";

/**
 * POST /api/translate
 * Body: { segments: TranscriptSegment[], lang?, duration? }
 *
 * Runs the whole downstream pipeline in one call:
 *   prosody → gloss → HamNoSys → SiGML → motion plan
 * so the player only needs a single round trip after transcription.
 */
export async function POST(req: NextRequest) {
  const started = Date.now();
  try {
    const body = await req.json().catch(() => ({}));
    const { lang, duration } = body as { lang?: string; duration?: number };

    // Drops unusable entries and repairs bad timestamps rather than letting
    // them crash the gloss engine or poison the plan with NaN times.
    const segments = normalizeSegments((body as { segments?: unknown }).segments);

    if (segments.length === 0) {
      return NextResponse.json(
        { error: "Provide a non-empty `segments` array, each with a `text` string." },
        { status: 400 },
      );
    }

    if (lang && !isSupported(lang)) {
      return NextResponse.json(
        { error: `Unsupported sign language "${lang}". Try ASL, ISL or BSL.` },
        { status: 400 },
      );
    }

    const profile = getProfile(lang);
    const groqKey = req.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const openaiKey = req.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    // 1. Prosody / emotion
    const prosody = analyzeProsody(segments);

    // 2. Gloss into the target sign language
    const { rows, engine } = await generateGloss(segments, {
      lang: profile.code,
      groqKey,
      openaiKey,
    });

    // 3. HamNoSys → SiGML → timed motion plan
    const plan = buildSignPlan(rows, {
      lang: profile.code,
      prosody,
      duration: duration ?? segments[segments.length - 1]?.end,
    });

    return NextResponse.json({
      success: true,
      lang: profile.code,
      language: {
        code: profile.code,
        name: profile.name,
        nativeName: profile.nativeName,
        fingerspellingHands: profile.fingerspellingHands,
        wordOrder: profile.grammar.wordOrder,
      },
      glossRows: rows,
      prosody,
      plan,
      sigml: plan.sigml,
      stats: {
        engine,
        segments: segments.length,
        signs: plan.items.length,
        fingerspelled: plan.items.filter((i) => i.fingerspell).length,
        dictionary: dictionaryStats(profile.code),
        latencyMs: Date.now() - started,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[/api/translate]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
