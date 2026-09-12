import { NextRequest, NextResponse } from "next/server";
import { GlossResponse, TranscriptSegment } from "@/lib/types";
import { generateGloss } from "@/lib/gloss-engine";
import { analyzeProsody } from "@/lib/prosody";
import { getProfile, isSupported } from "@/lib/sign-languages";

/**
 * POST /api/gloss
 * Body: { segments: TranscriptSegment[], lang?: "ASL" | "ISL" | "BSL" }
 *
 * Runs the transcript through the target language's grammar profile. Uses an
 * LLM when a key is present, otherwise falls back to the deterministic
 * rule-based glosser so the endpoint always returns real, grammatical output.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { segments, lang } = body as {
      segments?: TranscriptSegment[];
      lang?: string;
    };

    if (!Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json(
        { error: "Provide a non-empty `segments` array." },
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

    const prosody = analyzeProsody(segments);
    const { rows, engine } = await generateGloss(segments, {
      lang: profile.code,
      groqKey,
      openaiKey,
    });

    // Mark the first row active so the inspector has something highlighted.
    if (rows.length) rows[0].status = "active";

    const payload: GlossResponse & { engine: string; prosody: typeof prosody } = {
      glossRows: rows,
      lang: profile.code,
      engine,
      prosody,
    };

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[/api/gloss]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
