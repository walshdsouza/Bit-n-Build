import { NextRequest, NextResponse } from "next/server";
import { IngestResponse } from "@/lib/types";

// In-memory job store (replace with Supabase for production)
export const jobStore: Record<string, unknown> = {};

function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    const jobId = generateJobId();

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { url } = body as { url: string };

      if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }

      // Store job
      jobStore[jobId] = {
        jobId,
        filename: url,
        sourceUrl: url,
        status: "processing",
        stage: "audio_extraction",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // TODO: In production, kick off yt-dlp via child_process:
      // import { exec } from "child_process";
      // exec(`yt-dlp -x --audio-format mp3 -o /tmp/${jobId}.mp3 "${url}"`);
      // Then call /api/transcribe with the extracted audio

      // Mock: simulate progression
      simulateJobProgress(jobId);
    } else {
      // Multipart file upload
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "File is required" }, { status: 400 });
      }

      jobStore[jobId] = {
        jobId,
        filename: file.name,
        status: "processing",
        stage: "audio_extraction",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      simulateJobProgress(jobId);
    }

    const response: IngestResponse = { jobId, status: "processing" };
    return NextResponse.json(response, { status: 202 });
  } catch (err) {
    console.error("Ingest error:", err);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}

function simulateJobProgress(jobId: string) {
  const stages = [
    { stage: "audio_extraction", progress: 20 },
    { stage: "transcription", progress: 45 },
    { stage: "gloss_generation", progress: 70 },
    { stage: "sigml_synthesis", progress: 88 },
    { stage: "cwasa_rendering", progress: 100 },
  ];
  let i = 0;
  const interval = setInterval(() => {
    if (i >= stages.length) {
      clearInterval(interval);
      (jobStore[jobId] as Record<string, unknown>).status = "done";
      return;
    }
    Object.assign(jobStore[jobId] as object, stages[i]);
    (jobStore[jobId] as Record<string, unknown>).updatedAt = new Date().toISOString();
    i++;
  }, 3000);
}
