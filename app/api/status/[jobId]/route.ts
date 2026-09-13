import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Job not found. Processing endpoints return their results directly; no background job was created." }, { status: 404 });
}