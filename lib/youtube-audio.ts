/**
 * YouTube audio fallback.
 *
 * The primary YouTube path reads existing captions via youtube-transcript-api,
 * which is fast and free but only works when the uploader published captions
 * (or YouTube auto-generated them). A large share of videos have neither, and
 * for those the caption path fails outright.
 *
 * This module is the fallback: pull the audio track with yt-dlp and hand it to
 * the same Whisper pipeline that already serves uploaded files.
 */

import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { extractAudioTrack } from "./ffmpeg";

/** yt-dlp may be a CLI on PATH, or only available as a Python module. */
const YTDLP_CANDIDATES: { cmd: string; prefix: string[] }[] = [
  { cmd: "yt-dlp", prefix: [] },
  { cmd: "python", prefix: ["-m", "yt_dlp"] },
  { cmd: "py", prefix: ["-m", "yt_dlp"] },
  { cmd: "python3", prefix: ["-m", "yt_dlp"] },
];

function run(cmd: string, args: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      cmd,
      args,
      { encoding: "utf8", shell: true, timeout: timeoutMs, maxBuffer: 1024 * 1024 * 16 },
      (error, stdout, stderr) => {
        if (error) reject(new Error(stderr?.trim() || error.message));
        else resolve(stdout);
      },
    );
  });
}

/**
 * Turns yt-dlp's raw stderr into something a developer can act on.
 *
 * The common one is a bare "HTTP Error 403". YouTube now gates media URLs
 * behind a JavaScript challenge, and yt-dlp needs a JS runtime to solve it —
 * without one, extraction still reports the formats but every download 403s.
 * That is impossible to guess from the status code alone.
 */
function explainDownloadFailure(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  const lower = raw.toLowerCase();

  if (lower.includes("403") || lower.includes("javascript runtime") || lower.includes("nsig")) {
    return (
      "YouTube refused the audio download (HTTP 403). yt-dlp needs a JavaScript " +
      "runtime to solve YouTube's challenge — install Deno (https://deno.com) and/or " +
      'update yt-dlp with "pip install -U yt-dlp", then retry. ' +
      `Original error: ${raw}`
    );
  }
  if (lower.includes("age") && lower.includes("restrict")) {
    return `This video is age-restricted, so its audio cannot be downloaded without sign-in. Original error: ${raw}`;
  }
  if (lower.includes("private") || lower.includes("members-only")) {
    return `This video is private or members-only. Original error: ${raw}`;
  }
  if (lower.includes("unavailable")) {
    return `This video is unavailable. Original error: ${raw}`;
  }
  return `Failed to download this video's audio. ${raw}`;
}

export interface YouTubeAudioResult {
  /** Path to a Whisper-ready mono 16kHz mp3. */
  audioPath: string;
  /** Every temp file produced, for the caller to clean up. */
  tempFiles: string[];
  title?: string;
  duration?: number;
}

/**
 * Downloads a video's audio and transcodes it for Whisper.
 *
 * `maxDurationSec` guards against someone pasting a three-hour stream and
 * blocking the request; yt-dlp is asked for metadata first so we can refuse
 * before spending the download.
 */
export async function downloadYouTubeAudio(
  videoId: string,
  tempDir: string,
  opts: { maxDurationSec?: number } = {},
): Promise<YouTubeAudioResult> {
  const maxDuration = opts.maxDurationSec ?? 45 * 60;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const uid = `yt_${videoId}_${Date.now()}`;
  const rawPath = path.join(tempDir, `${uid}.audio`);
  const mp3Path = path.join(tempDir, `${uid}.mp3`);
  const tempFiles: string[] = [rawPath, mp3Path];

  let runner: { cmd: string; prefix: string[] } | null = null;
  // Keep the FIRST failure: it comes from the preferred runner and describes
  // the real problem ("video unavailable", "age restricted"). Later candidates
  // fail with "Python was not found", which just hides it.
  let firstError: unknown = null;

  // 1. Metadata first — cheap, and it tells us whether to bother downloading.
  let title: string | undefined;
  let duration: number | undefined;

  for (const candidate of YTDLP_CANDIDATES) {
    try {
      // Two separate --print flags rather than one with a delimiter: these run
      // through a shell, where characters like "|" and "(" are metacharacters.
      // Every format string is quoted for the same reason.
      const out = await run(
        candidate.cmd,
        [
          ...candidate.prefix,
          "--no-warnings",
          "--skip-download",
          "--print", '"%(title)s"',
          "--print", '"%(duration)s"',
          url,
        ],
        60_000,
      );
      const lines = out.trim().split(/\r?\n/);
      title = lines[0]?.trim() || undefined;
      const parsed = Number(lines[1]?.trim());
      duration = Number.isFinite(parsed) ? parsed : undefined;
      runner = candidate;
      break;
    } catch (e) {
      if (firstError === null) firstError = e;
    }
  }

  if (!runner) {
    throw new Error(
      `Could not download this video's audio. ` +
        `Check the video is public and available, or install yt-dlp with "pip install yt-dlp". (${firstError instanceof Error ? firstError.message : firstError})`,
    );
  }

  if (duration && duration > maxDuration) {
    throw new Error(
      `This video is ${Math.round(duration / 60)} minutes long and has no captions. ` +
        `Transcribing it would exceed the ${Math.round(maxDuration / 60)}-minute limit.`,
    );
  }

  // 2. Download the smallest usable audio stream.
  try {
    await run(
      runner.cmd,
      [
        ...runner.prefix,
        "--no-warnings",
        "--no-playlist",
        "-f", "bestaudio/best",
        "-o", `"${rawPath}"`,
        url,
      ],
      10 * 60_000,
    );
  } catch (e) {
    throw new Error(explainDownloadFailure(e));
  }

  if (!fs.existsSync(rawPath)) {
    throw new Error("yt-dlp reported success but produced no audio file.");
  }

  // 3. Transcode to the mono 16kHz mp3 Whisper expects.
  await extractAudioTrack(rawPath, mp3Path);

  return { audioPath: mp3Path, tempFiles, title, duration };
}
