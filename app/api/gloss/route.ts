import { NextRequest, NextResponse } from "next/server";
import { GlossResponse } from "@/lib/types";
import { normalizeSegments } from "@/lib/segments";
import { generateGloss } from "@/lib/gloss-engine";
import { analyzeProsody } from "@/lib/prosody";
import { getProfile } from "@/lib/sign-languages";
import { readJsonObject, readLanguage, RequestError } from "@/lib/request-validation";

export const maxDuration = 60;

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
    const body = await readJsonObject(req);
    const lang = readLanguage(body.lang);

    const segments = normalizeSegments((body as { segments?: unknown }).segments);

    if (segments.length === 0) {
      return NextResponse.json(
        { error: "Provide a non-empty `segments` array, each with a `text` string." },
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
    if (!(error instanceof RequestError)) console.error("[/api/gloss]", error);
    return NextResponse.json({ error: message }, { status: error instanceof RequestError ? error.status : 500 });
  }
}
