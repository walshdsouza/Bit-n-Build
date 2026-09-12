import { NextRequest, NextResponse } from "next/server";
import { jobStore } from "@/app/api/ingest/route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const resolvedParams = await params;
  const { jobId } = resolvedParams;
  const job = jobStore[jobId];

  if (!job) {
    // Return mock demo job if not found
    return NextResponse.json({
      jobId,
      status: "done",
      stage: "cwasa_rendering",
      progress: 100,
      updatedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json(job);
}
