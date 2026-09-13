import { handleLiveRequest } from "@/lib/live-api";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  return handleLiveRequest(request);
}
