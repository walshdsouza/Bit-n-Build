import { NextRequest, NextResponse } from "next/server";
import { buildSignPlan } from "@/lib/sign-plan";
import { getProfile } from "@/lib/sign-languages";
import { readJsonObject, readLanguage, readDuration, readGlossRows, readProsody, RequestError } from "@/lib/request-validation";

/**
 * POST /api/sigml
 * Body: { glossRows: GlossRow[], lang?, prosody?, duration? }
 *
 * The Kozha HamNoSys → SiGML bridge that used to be a hard-coded mock.
 * Returns a real SiGML document plus the timed motion plan the avatar renders.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await readJsonObject(req);
    const glossRows = readGlossRows(body.glossRows);
    const lang = readLanguage(body.lang);
    const prosody = readProsody(body.prosody);
    const duration = readDuration(body.duration);

    const profile = getProfile(lang ?? glossRows[0]?.lang);
    const plan = buildSignPlan(glossRows, {
      lang: profile.code,
      prosody,
      duration,
    });

    return NextResponse.json({
      sigml: plan.sigml,
      lang: profile.code,
      plan,
      stats: {
        signs: plan.items.length,
        fingerspelled: plan.items.filter((i) => i.fingerspell).length,
        duration: plan.duration,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    if (!(error instanceof RequestError)) console.error("[/api/sigml]", error);
    return NextResponse.json({ error: message }, { status: error instanceof RequestError ? error.status : 500 });
  }
}
