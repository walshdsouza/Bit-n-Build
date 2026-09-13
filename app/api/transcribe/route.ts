import { NextRequest, NextResponse } from "next/server";
import { transcribeAudioFile } from "@/lib/whisper";
import { RequestError } from "@/lib/request-validation";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Transcribe a multipart audio file using the caller's configured provider. */
export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      throw new RequestError("Upload an audio file as multipart/form-data using the `file` field.");
    }
    const form = await req.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File) || !file.size) throw new RequestError("Provide a non-empty audio file.");
    if (process.env.VERCEL && file.size > 4 * 1024 * 1024) throw new RequestError("The audio file exceeds 4 MB. Upload a smaller recording.", 413);
    const result = await transcribeAudioFile(file, file.name,
      req.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY,
      req.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Transcription failed." },
      { status: error instanceof RequestError ? error.status : 500 });
  }
}
