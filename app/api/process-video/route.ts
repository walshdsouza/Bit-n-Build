import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { execFile } from "child_process";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import { getTempDir, cleanupTempFiles } from "@/lib/temp-manager";
import { extractAudioTrack, SilentAudioError } from "@/lib/ffmpeg";
import { requireTranscriptionKey, transcribeAudioFile } from "@/lib/whisper";
import { downloadYouTubeAudio, YouTubeAudioError } from "@/lib/youtube-audio";
import { extractYouTubeVideoId } from "@/lib/youtube-url";
import { normalizeSegments } from "@/lib/segments";
import { isRecord, readJsonObject, RequestError } from "@/lib/request-validation";
import type { TranscriptSegment } from "@/lib/types";
import { fetchNativeYouTubeCaptions } from "@/lib/youtube-captions";
import { readProviderYouTube } from "@/lib/youtube-provider";

export const runtime = "nodejs";
export const maxDuration = 180;

interface MediaResult {
  duration: number;
  text: string;
  segments: TranscriptSegment[];
}
interface PersistInput extends MediaResult {
  title: string;
  sourceType: "youtube" | "upload";
  sourceUrl?: string | null;
  file?: File;
  buffer?: Buffer;
}

/** Saving is optional: a missing account or database must not discard speech. */
async function persistTranscript(input: PersistInput) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { projectId: null, sourceUrl: input.sourceUrl ?? null };
  }
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { projectId: null, sourceUrl: input.sourceUrl ?? null };
    let sourceUrl = input.sourceUrl ?? null;
    if (input.file && input.buffer) {
      const extension = input.file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "mp4";
      const storagePath = `${user.id}/${randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("media").upload(storagePath, input.buffer, {
        contentType: input.file.type || "application/octet-stream", upsert: false,
      });
      if (!error) sourceUrl = supabase.storage.from("media").getPublicUrl(storagePath).data.publicUrl;
      else console.warn("[process-video] Media could not be saved:", error.message);
    }
    const { data: project, error } = await supabase.from("projects").insert({
      user_id: user.id, title: input.title, source_type: input.sourceType,
      source_url: sourceUrl, source_duration: input.duration, status: "ready",
    }).select().single();
    if (error || !project) {
      console.warn("[process-video] Project could not be saved:", error?.message);
      return { projectId: null, sourceUrl, persistenceWarning: "Translation is ready, but could not be saved to your account." };
    }
    const { error: segmentError } = await supabase.from("transcript_segments").insert(
      input.segments.map((segment, index) => ({
        project_id: project.id, sequence_index: index,
        start_time: segment.start, end_time: segment.end, original_text: segment.text,
      })),
    );
    if (segmentError) {
      console.warn("[process-video] Transcript could not be saved:", segmentError.message);
      return { projectId: null, sourceUrl, persistenceWarning: "Translation is ready, but its transcript could not be saved." };
    }
    return { projectId: project.id, sourceUrl };
  } catch (error) {
    console.warn("[process-video] Optional persistence failed:", error instanceof Error ? error.message : "Unknown database error");
    return { projectId: null, sourceUrl: input.sourceUrl ?? null, persistenceWarning: "Translation is ready, but could not be saved to your account." };
  }
}

async function readYouTubeCaptions(videoId: string): Promise<{ segments: TranscriptSegment[]; error?: string }> {
  // Native Node fetch works in serverless functions without a Python install.
  try {
    const segments = await fetchNativeYouTubeCaptions(videoId);
    if (segments.length) return { segments };
  } catch (error) {
    // Keep the failure class visible in runtime logs without signed URLs.
    console.info("[process-video] Caption lookup:", error instanceof Error ? error.name : "unavailable");
  }
  if (process.env.VERCEL) return { segments: [], error: "English captions are unavailable from this server." };
  const script = path.join(process.cwd(), "scripts", "get_youtube_transcript.py");
  const commands = [process.env.PYTHON_PATH, "python", "python3", ...(process.platform === "win32" ? ["py"] : [])].filter((command): command is string => !!command);
  for (const command of commands) {
    try {
      const stdout = await new Promise<string>((resolve, reject) => {
        execFile(command, [script, videoId], {
          encoding: "utf8", timeout: 45_000, maxBuffer: 8 * 1024 * 1024,
          env: { ...process.env, PYTHONIOENCODING: "utf-8" },
        }, (error, out) => {
          // The script can return a handled caption error and exit nonzero.
          if (out.trim()) resolve(out);
          else if (error) reject(error);
          else resolve(out);
        });
      });
      const data: unknown = JSON.parse(stdout);
      if (!isRecord(data)) continue;
      const segments = data.success === true ? normalizeSegments(data.segments) : [];
      return { segments, error: typeof data.error === "string" ? data.error : undefined };
    } catch {
      // Try the next installed interpreter, without hardcoded personal paths.
    }
  }
  return { segments: [], error: "Caption reader unavailable. Install Python and youtube-transcript-api, or configure PYTHON_PATH." };
}

export async function POST(req: NextRequest) {
  const temps: string[] = [];
  try {
    const contentType = req.headers.get("content-type") || "";
    let sourceUrl: string | null = null;
    let file: File | null = null;
    let jobToken: string | undefined;
    if (contentType.includes("application/json")) {
      const body = await readJsonObject(req);
      const url = body.url ?? body.youtubeUrl;
      if (typeof url !== "string") throw new RequestError("Provide a valid YouTube URL.");
      sourceUrl = url.trim();
      if (body.jobToken !== undefined && typeof body.jobToken !== "string") throw new RequestError("Invalid YouTube import session.");
      jobToken = typeof body.jobToken === "string" ? body.jobToken : undefined;
    } else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData().catch(() => null);
      if (!form) throw new RequestError("The multipart upload could not be read.");
      const url = form.get("url");
      const uploaded = form.get("file");
      if (url !== null && typeof url !== "string") throw new RequestError("The URL field must be text.");
      if (uploaded !== null && !(uploaded instanceof File)) throw new RequestError("The file field must contain a media file.");
      sourceUrl = typeof url === "string" ? url.trim() : null;
      file = uploaded instanceof File ? uploaded : null;
    } else {
      throw new RequestError("Send a YouTube URL as JSON or a media file as multipart/form-data.");
    }

    const groqKey = req.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const openaiKey = req.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;
    const youtubeKey = req.headers.get("x-supadata-api-key") || process.env.SUPADATA_API_KEY;
    if (sourceUrl) {
      const videoId = extractYouTubeVideoId(sourceUrl);
      if (!videoId) throw new RequestError("Provide a valid YouTube URL.");
      if (jobToken && !youtubeKey?.trim()) throw new RequestError("The YouTube import key is no longer configured. Add it in Settings to resume.", 422, "YOUTUBE_NOT_CONFIGURED");
      const hosted = youtubeKey?.trim() ? await readProviderYouTube(videoId, youtubeKey, jobToken) : null;
      if (hosted?.jobToken) return NextResponse.json({ pending: true, jobToken: hosted.jobToken, pollAfterMs: 2500 }, { status: 202 });
      const captions = hosted?.segments ? { segments: hosted.segments } : await readYouTubeCaptions(videoId);
      let result: MediaResult;
      let provider: string;
      let title = `YouTube Video: ${videoId}`;
      let fallback: string | undefined;
      if (captions.segments.length) {
        result = {
          segments: captions.segments,
          text: captions.segments.map((segment) => segment.text).join(" "),
          duration: captions.segments.reduce((duration, segment) => Math.max(duration, segment.end), 0),
        };
        provider = hosted ? "supadata" : "youtube-captions";
      } else {
        if (process.env.VERCEL && !youtubeKey?.trim()) {
          throw new RequestError("YouTube is blocking direct access from this deployment. Add a Supadata key in Settings for YouTube imports, or use tab audio capture below.", 422, "YOUTUBE_NOT_CONFIGURED");
        }
        if (!groqKey?.trim() && !openaiKey?.trim()) {
          throw new RequestError("YouTube captions could not be read. Add a Groq or OpenAI API key in Settings to transcribe the audio instead.", 422, "TRANSCRIPTION_NOT_CONFIGURED");
        }
        const tempDir = await getTempDir();
        let audio;
        try { audio = await downloadYouTubeAudio(videoId, tempDir); }
        catch (error) {
          if (error instanceof RequestError) throw error;
          if (error instanceof YouTubeAudioError) throw new RequestError(error.message, error.status, "YOUTUBE_AUDIO_UNAVAILABLE");
          throw new RequestError(error instanceof Error ? error.message : "YouTube audio could not be downloaded. Upload a recording with spoken audio instead.", 502, "YOUTUBE_AUDIO_UNAVAILABLE");
        }
        temps.push(...audio.tempFiles);
        const buffer = await fs.promises.readFile(audio.audioPath);
        const transcription = await transcribeAudioFile(new Blob([buffer], { type: "audio/mpeg" }), `${videoId}.mp3`, groqKey, openaiKey);
        result = { ...transcription, duration: Math.max(transcription.duration, audio.duration || 0) };
        provider = transcription.provider;
        title = audio.title || title;
        fallback = "yt-dlp+whisper";
      }
      const persistence = await persistTranscript({ ...result, title, sourceType: "youtube", sourceUrl });
      return NextResponse.json({
        success: true, source: "youtube", ...result, ...persistence,
        metadata: { provider, videoId, title, fallback, processedAt: new Date().toISOString() },
      });
    }

    if (!file || !file.size) throw new RequestError("Provide a non-empty video or audio file.");
    const maxUploadMb = process.env.VERCEL ? 4 : 100;
    if (file.size > maxUploadMb * 1024 * 1024) throw new RequestError(`The media file exceeds ${maxUploadMb} MB. Upload a smaller recording.`, 413);
    requireTranscriptionKey(groqKey, openaiKey);
    const tempDir = await getTempDir();
    const uniqueId = randomUUID();
    const inputPath = path.join(tempDir, `${uniqueId}.media`);
    const audioPath = path.join(tempDir, `${uniqueId}.mp3`);
    temps.push(inputPath, audioPath);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(inputPath, buffer);
    try { await extractAudioTrack(inputPath, audioPath); }
    catch (error) {
      if (error instanceof SilentAudioError) throw new RequestError(error.message, 422, "NO_SPEECH");
      throw new RequestError("Audio could not be read from this file. Upload a valid video or audio recording with a sound track.", 422);
    }
    const audioBuffer = await fs.promises.readFile(audioPath);
    const transcription = await transcribeAudioFile(new Blob([audioBuffer], { type: "audio/mpeg" }), `${uniqueId}.mp3`, groqKey, openaiKey);
    const persistence = await persistTranscript({ ...transcription, title: file.name, sourceType: "upload", file, buffer });
    return NextResponse.json({
      success: true, source: "file", ...transcription, ...persistence,
      metadata: { provider: transcription.provider, filename: file.name, processedAt: new Date().toISOString() },
    });
  } catch (error) {
    if (!(error instanceof RequestError)) console.error("[process-video]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Media processing failed.", ...(error instanceof RequestError && error.code ? { code: error.code } : {}) },
      { status: error instanceof RequestError ? error.status : 500 });
  } finally {
    await cleanupTempFiles(temps);
  }
}
