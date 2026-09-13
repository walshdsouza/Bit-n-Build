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
import { isTranslationJob, translateYouTubeTranscript } from "@/lib/youtube-translation-job";
import { persistProjectTranscript, type PersistTranscriptInput } from "@/lib/project-persistence";

export const runtime = "nodejs";
export const maxDuration = 180;

interface MediaResult {
  duration: number;
  text: string;
  segments: TranscriptSegment[];
}

/** Saving is optional: a missing account or database must not discard speech. */
async function persistTranscript(input: PersistTranscriptInput) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { projectId: null, sourceUrl: input.sourceUrl ?? null };
  }
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { projectId: null, sourceUrl: input.sourceUrl ?? null };
    return await persistProjectTranscript(supabase, user.id, input);
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
  const startedAt = Date.now();
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
      const translating = isTranslationJob(jobToken);
      if (jobToken && !translating && !youtubeKey?.trim()) throw new RequestError("YouTube import is no longer configured on this server. Please contact the site owner.", 422, "YOUTUBE_NOT_CONFIGURED");
      const hosted = !translating && youtubeKey?.trim() ? await readProviderYouTube(videoId, youtubeKey, jobToken) : null;
      if (hosted?.jobToken) return NextResponse.json({ pending: true, jobToken: hosted.jobToken, pollAfterMs: 2500 }, { status: 202 });
      const captions = translating ? { segments: [] } : hosted?.segments ? { segments: hosted.segments } : await readYouTubeCaptions(videoId);
      let result: MediaResult;
      let provider: string;
      let title = `YouTube Video: ${videoId}`;
      let fallback: string | undefined;
      if (translating || captions.segments.length) {
        const translation = await translateYouTubeTranscript(translating ? jobToken! : { segments: captions.segments, language: hosted?.language }, {
          videoId, signingKey: youtubeKey || groqKey || openaiKey || '', groqKey, openaiKey, signal: req.signal,
          // Fast native captions leave time to translate long Hindi videos.
          // Slow AI generation still leaves a bounded window inside maxDuration.
          timeoutMs: Math.max(1000, 165_000 - (Date.now() - startedAt)),
        });
        if (translation.jobToken) return NextResponse.json({ pending: true, jobToken: translation.jobToken, pollAfterMs: translation.pollAfterMs }, { status: 202 });
        const segments = translation.segments!;
        result = {
          segments,
          text: segments.map((segment) => segment.text).join(" "),
          duration: segments.reduce((duration, segment) => Math.max(duration, segment.end), 0),
        };
        provider = translating ? "translated-captions" : hosted ? "supadata" : "youtube-captions";
      } else {
        if (process.env.VERCEL && !youtubeKey?.trim()) {
          throw new RequestError("YouTube import is not available from this server. Use tab audio capture below, or contact the site owner.", 422, "YOUTUBE_NOT_CONFIGURED");
        }
        if (!groqKey?.trim() && !openaiKey?.trim()) {
          throw new RequestError("YouTube captions could not be read and audio transcription is not configured on this server. Please contact the site owner.", 422, "TRANSCRIPTION_NOT_CONFIGURED");
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
