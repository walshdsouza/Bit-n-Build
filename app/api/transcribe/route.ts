import { NextRequest, NextResponse } from "next/server";
import { TranscribeResponse, TranscriptSegment } from "@/lib/types";

const MOCK_SEGMENTS: TranscriptSegment[] = [
  { start: 0, end: 4.2, text: "The woman thinks about food." },
  { start: 4.2, end: 8.0, text: "She wants pizza but is on a diet." },
  { start: 8.0, end: 13.1, text: "She calls her friend for advice." },
  { start: 13.1, end: 18.5, text: "They plan to go to a salad bar." },
  { start: 18.5, end: 23.8, text: "But the friend suggests tacos instead." },
  { start: 23.8, end: 28.0, text: "They both laugh at the situation." },
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { audioPath, jobId } = body as { audioPath?: string; jobId?: string };

  // TODO: Replace with real Whisper API call:
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const transcription = await openai.audio.transcriptions.create({
  //   file: fs.createReadStream(audioPath),
  //   model: "whisper-1",
  //   response_format: "verbose_json",
  //   timestamp_granularities: ["segment"],
  // });
  // return NextResponse.json({ segments: transcription.segments });

  // Mock response
  await new Promise((r) => setTimeout(r, 800));
  const response: TranscribeResponse = { segments: MOCK_SEGMENTS };
  return NextResponse.json(response);
}
