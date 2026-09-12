import { NextResponse } from "next/server";
import { SIGN_LANGUAGES, PRODUCTION_READY } from "@/lib/sign-languages";
import { dictionaryStats } from "@/lib/dictionaries";
import { SignLanguageCode } from "@/lib/types";

/** GET /api/sign-languages — powers the target-language picker. */
export async function GET() {
  const languages = (Object.keys(SIGN_LANGUAGES) as SignLanguageCode[]).map((code) => {
    const p = SIGN_LANGUAGES[code];
    const stats = dictionaryStats(code);
    return {
      code: p.code,
      name: p.name,
      nativeName: p.nativeName,
      region: p.region,
      wordOrder: p.grammar.wordOrder,
      fingerspellingHands: p.fingerspellingHands,
      secondsPerSign: p.secondsPerSign,
      ready: PRODUCTION_READY.includes(code),
      dictionary: stats,
    };
  });

  return NextResponse.json({ languages, default: "ASL" });
}
