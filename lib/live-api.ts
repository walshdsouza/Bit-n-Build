import { generateGloss } from "./gloss-engine";
import { inspectLiveWav, MAX_LIVE_CHUNK_BYTES } from "./live-audio";
import { analyzeProsody } from "./prosody";
import { RequestError } from "./request-validation";
import { buildSignPlan } from "./sign-plan";
import { transcribeAudioFile } from "./whisper";

export const LIVE_TRANSCRIPTION_TIMEOUT_MS = 20_000;

/** Host-permitted background requests are outside page CORS. Firefox assigns
 * each installation a new extension UUID, so the Gecko add-on ID cannot be an
 * origin allowlist. Accept only the browser's canonical extension-origin form;
 * web pages (including opaque/null origins) still cannot spend the site's key.
 * This is origin isolation for the guest API, not extension authentication. */
export function isAllowedLiveOrigin(origin: string | null, requestUrl: string): boolean {
  return !origin || origin === new URL(requestUrl).origin
    || /^moz-extension:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(origin);
}

/** Server handler kept independent of Next so provider failure and cancellation
 * can be tested through the complete HTTP contract without recording people. */
export async function handleLiveRequest(request: Request): Promise<Response> {
  let stage: "validation" | "transcription" | "signing" = "validation";
  try {
    const origin = request.headers.get("origin");
    if (!isAllowedLiveOrigin(origin, request.url)) {
      throw new RequestError("Start live captions from UNMUTE or its installed meeting extension.", 403);
    }
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      throw new RequestError("Send a live audio chunk as multipart form data.");
    }
    if (Number(request.headers.get("content-length")) > MAX_LIVE_CHUNK_BYTES + 10_000) {
      throw new RequestError("This live audio chunk is too large. Share the tab again.", 413);
    }
    const form = await request.formData().catch(() => null);
    const audio = form?.get("audio");
    if (!(audio instanceof File) || !audio.size) throw new RequestError("Provide a live audio chunk.");
    if (audio.size > MAX_LIVE_CHUNK_BYTES) throw new RequestError("This live audio chunk is too large.", 413);
    let info;
    try { info = inspectLiveWav(await audio.arrayBuffer()); }
    catch (error) { throw new RequestError(error instanceof Error ? error.message : "Invalid live audio chunk."); }
    // Ignore effectively silent PCM before ASR to avoid invented silence captions.
    if (info.rms < 0.00001) return Response.json({ speech: false });
    if (!process.env.GROQ_API_KEY?.trim() && !process.env.OPENAI_API_KEY?.trim()) {
      throw new RequestError("Live transcription is not configured on this server. Please contact the site owner.", 503, "LIVE_NOT_CONFIGURED");
    }
    stage = "transcription";
    const transcript = await transcribeAudioFile(audio, "meeting.wav", process.env.GROQ_API_KEY, process.env.OPENAI_API_KEY, {
      timeoutMs: LIVE_TRANSCRIPTION_TIMEOUT_MS, signal: request.signal,
    });
    const segments = transcript.segments.map((segment) => ({
      ...segment, start: Math.max(0, Math.min(segment.start, info.duration)),
      end: Math.max(0, Math.min(segment.end, info.duration)),
    })).filter((segment) => segment.end > segment.start);
    if (!segments.length) return Response.json({ speech: false });
    stage = "signing";
    // Local ASL grammar keeps a live chunk to one network request.
    const { rows } = await generateGloss(segments, { lang: "ASL", rulesOnly: true });
    const plan = buildSignPlan(rows, { lang: "ASL", prosody: analyzeProsody(segments), duration: info.duration });
    return Response.json({ speech: true, text: segments.map((s) => s.text).join(" "), segments, plan, provider: transcript.provider });
  } catch (error) {
    if (error instanceof RequestError && error.code === "NO_SPEECH") return Response.json({ speech: false });
    const status = error instanceof RequestError ? error.status : 500;
    const timeout = error instanceof RequestError && error.code === "TRANSCRIPTION_TIMEOUT";
    const code = timeout ? "LIVE_TIMEOUT" : error instanceof RequestError && error.code
      ? error.code : stage === "validation" ? "LIVE_INVALID_AUDIO" : "LIVE_PROCESSING_FAILED";
    const message = timeout ? "Live transcription took longer than 20 seconds. Please start again."
      : error instanceof RequestError
        ? error.message.includes("API key") ? "The live transcription service is unavailable. Please contact the site owner." : error.message
        : "Live transcription could not finish. Stop and start again.";
    return Response.json({ error: message, code, stage }, { status });
  }
}
