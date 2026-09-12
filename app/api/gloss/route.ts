import { NextRequest, NextResponse } from "next/server";
import { GlossResponse, GlossRow, TranscriptSegment } from "@/lib/types";

const GLOSS_SYSTEM_PROMPT = `You are an expert ASL (American Sign Language) interpreter. 
Convert English text to ASL gloss notation following these rules:
1. Use SOV (Subject-Object-Verb) word order
2. Omit articles (a, an, the), copulas (is, are), and most prepositions
3. Use IX for pronouns (IX = "he/she/they"), IX-ARC for "they (two)"
4. Emit facial Non-Manual Markers (NMMs) as JSON: {"time": <offset_seconds>, "emotion": "<nmm_type>"}
   NMM types: wh-question_browDown, yes-no_browUp, negative_headshake, topic_eyebrow, 
               puffedCheeks, pursedLips, neutral, raised_brow, positive_headnod
5. Output ONLY gloss lemmas separated by spaces, no punctuation

Example input: "She wants pizza but is on a diet."
Example output: IX WANT PIZZA BUT IX DIET`;

// Mock gloss mapping for demo
const MOCK_GLOSS: GlossRow[] = [
  { startTime: 0, endTime: 4.2, sourceText: "The woman thinks about food.", gloss: "WOMAN THINK FOOD", nmm: [{ time: 0.2, emotion: "wh-question_browDown" }], status: "synced" },
  { startTime: 4.2, endTime: 8.0, sourceText: "She wants pizza but is on a diet.", gloss: "IX WANT PIZZA BUT IX DIET", nmm: [{ time: 4.5, emotion: "negative_headshake" }], status: "synced" },
  { startTime: 8.0, endTime: 13.1, sourceText: "She calls her friend for advice.", gloss: "IX CALL FRIEND ADVICE ASK", nmm: [{ time: 8.3, emotion: "topic_eyebrow" }], status: "active" },
  { startTime: 13.1, endTime: 18.5, sourceText: "They plan to go to a salad bar.", gloss: "PLAN GO SALAD-BAR", nmm: [{ time: 13.2, emotion: "neutral" }], status: "buffered" },
  { startTime: 18.5, endTime: 23.8, sourceText: "But the friend suggests tacos instead.", gloss: "FRIEND SUGGEST TACO IX-ARC", nmm: [{ time: 18.7, emotion: "raised_brow" }], status: "queued" },
  { startTime: 23.8, endTime: 28.0, sourceText: "They both laugh at the situation.", gloss: "TWO-OF-US LAUGH", nmm: [{ time: 24.0, emotion: "positive_headnod" }], status: "queued" },
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { segments } = body as { segments?: TranscriptSegment[] };

  // TODO: Replace with real GPT-4o API call:
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const glossRows = await Promise.all(
  //   segments.map(async (seg) => {
  //     const completion = await openai.chat.completions.create({
  //       model: "gpt-4o",
  //       messages: [
  //         { role: "system", content: GLOSS_SYSTEM_PROMPT },
  //         { role: "user", content: seg.text }
  //       ],
  //       temperature: 0.3,
  //     });
  //     const gloss = completion.choices[0].message.content?.trim() ?? "";
  //     return { startTime: seg.start, endTime: seg.end, sourceText: seg.text, gloss, nmm: [], status: "buffered" };
  //   })
  // );
  // return NextResponse.json({ glossRows });

  // Mock response
  await new Promise((r) => setTimeout(r, 1200));
  const response: GlossResponse = { glossRows: MOCK_GLOSS };
  return NextResponse.json(response);
}
