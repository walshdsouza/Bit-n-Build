import { NextRequest, NextResponse } from "next/server";
import { GlossRow, ProsodyFrame } from "@/lib/types";
import { buildSignPlan } from "@/lib/sign-plan";
import { getProfile, isSupported } from "@/lib/sign-languages";

/**
 * POST /api/sigml
 * Body: { glossRows: GlossRow[], lang?, prosody?, duration? }
 *
 * The Kozha HamNoSys → SiGML bridge that used to be a hard-coded mock.
 * Returns a real SiGML document plus the timed motion plan the avatar renders.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { glossRows, lang, prosody, duration } = body as {
      glossRows?: GlossRow[];
      lang?: string;
      prosody?: ProsodyFrame[];
      duration?: number;
    };

    if (!Array.isArray(glossRows) || glossRows.length === 0) {
      return NextResponse.json(
        { error: "Provide a non-empty `glossRows` array." },
        { status: 400 },
      );
    }

    if (lang && !isSupported(lang)) {
      return NextResponse.json(
        { error: `Unsupported sign language "${lang}". Try ASL, ISL or BSL.` },
        { status: 400 },
      );
    }

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
    console.error("[/api/sigml]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
