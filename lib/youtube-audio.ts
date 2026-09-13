/**
 * Public YouTube audio ingestion using a pinned standalone downloader.
 *
 * The build installs the platform binary under vendor/youtube. Its bundled
 * challenge solver uses this server's Node runtime, so serverless functions
 * need neither Python, a shell, user cookies nor remote proxy services.
 */
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { extractAudioTrack, SilentAudioError } from "./ffmpeg";
import { cleanupTempFiles } from "./temp-manager";

const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

export class YouTubeAudioError extends Error {
  constructor(message: string, public readonly status = 502) {
    super(message);
    this.name = "YouTubeAudioError";
  }
}

function downloaderPath(): string {
  const platform = `${process.platform}-${process.arch}`;
  const filename = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp_linux";
  const executable = path.join(process.cwd(), "vendor", "youtube", platform, filename);
  if (!fs.existsSync(executable)) {
    throw new YouTubeAudioError("YouTube audio processing is temporarily unavailable on this server. Please retry shortly.", 503);
  }
  return executable;
}

function safeDownloadError(error: unknown): YouTubeAudioError {
  if (error instanceof YouTubeAudioError) return error;
  if (error instanceof SilentAudioError) return new YouTubeAudioError(error.message, 422);
  const raw = error instanceof Error ? error.message.toLowerCase() : "";
  if (/\bprivate video\b|\bvideo is private\b|\bmembers-only\b/.test(raw)) {
    return new YouTubeAudioError("This YouTube video is private or members-only. Choose a public video.", 422);
  }
  if (raw.includes("age") && raw.includes("restrict")) {
    return new YouTubeAudioError("This YouTube video requires age verification. Choose a public video that does not require sign-in.", 422);
  }
  if (raw.includes("unavailable") || raw.includes("removed") || raw.includes("not available")) {
    return new YouTubeAudioError("This YouTube video is unavailable from our server. Check that it is public and available in your region.", 422);
  }
  if (raw.includes("max-filesize") || raw.includes("larger than max") || raw.includes("file is larger")) {
    return new YouTubeAudioError("This video's audio exceeds the 25 MB processing limit. Choose a shorter video.", 413);
  }
  if (raw.includes("403") || raw.includes("429") || raw.includes("sign in") || raw.includes("bot")) {
    return new YouTubeAudioError("YouTube temporarily refused this video's audio. Please retry, or upload the recording directly.", 502);
  }
  // Never reflect command lines, signed media URLs, or subprocess diagnostics.
  return new YouTubeAudioError("This video's audio could not be downloaded. Please retry or choose another public video.", 502);
}

function runDownloader(
  executable: string,
  args: string[],
  timeoutMs: number,
  outputPath?: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let exceededSize = false;
    let settled = false;
    const child = execFile(executable, args, {
      encoding: "utf8",
      windowsHide: true,
      timeout: timeoutMs,
      maxBuffer: 8 * 1024 * 1024,
    }, (error, stdout, stderr) => {
      settled = true;
      if (watcher) clearInterval(watcher);
      if (exceededSize) {
        reject(new YouTubeAudioError("This video's audio exceeds the 25 MB processing limit. Choose a shorter video.", 413));
      } else if (error?.killed) {
        reject(new YouTubeAudioError("YouTube audio processing took too long. Please retry or choose a shorter video.", 504));
      } else if (error) {
        reject(safeDownloadError(new Error(stderr || error.message)));
      } else {
        resolve(stdout);
      }
    });
    // --max-filesize rejects known large downloads; this also bounds formats
    // whose server omits a content length. The final size is verified below.
    const watcher = outputPath ? setInterval(() => {
      void fs.promises.stat(outputPath).then((stat) => {
        if (!settled && stat.size > MAX_AUDIO_BYTES) {
          exceededSize = true;
          child.kill();
        }
      }).catch(() => { /* The downloader may not have created the file yet. */ });
    }, 250) : undefined;
    watcher?.unref();
  });
}

export interface YouTubeAudioResult {
  audioPath: string;
  tempFiles: string[];
  title?: string;
  duration?: number;
}

/** Download real audio, validate its limits, then prepare it for Whisper. */
export async function downloadYouTubeAudio(
  videoId: string,
  tempDir: string,
  opts: { maxDurationSec?: number } = {},
): Promise<YouTubeAudioResult> {
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    throw new YouTubeAudioError("Invalid YouTube video ID.", 400);
  }
  const maxDuration = opts.maxDurationSec ?? 45 * 60;
  if (!Number.isFinite(maxDuration) || maxDuration <= 0) {
    throw new YouTubeAudioError("Invalid video duration limit.", 400);
  }
  const executable = downloaderPath();
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const uid = `yt_${videoId}_${randomUUID()}`;
  const rawPath = path.join(tempDir, `${uid}.audio`);
  const mp3Path = path.join(tempDir, `${uid}.mp3`);
  await fs.promises.mkdir(tempDir, { recursive: true });
  const common = [
    "--ignore-config", "--no-plugin-dirs", "--no-cache-dir", "--no-update",
    "--no-warnings", "--no-playlist", "--no-progress",
    "--no-js-runtimes", "--js-runtimes", `node:${process.execPath}`,
    "--no-remote-components",
    "--socket-timeout", "10", "--retries", "1", "--extractor-retries", "1", "--fragment-retries", "1",
  ];
  const ownedFiles = async () => (await fs.promises.readdir(tempDir))
    .filter((name) => name.startsWith(uid + "."))
    .map((name) => path.join(tempDir, name));

  try {
    // Metadata is a separate bounded call so long videos and live streams are
    // refused before any media download begins.
    const output = await runDownloader(executable, [...common, "--skip-download", "--dump-single-json", "-f", "bestaudio", url], 30_000);
    const metadata = JSON.parse(output) as Record<string, unknown>;
    const duration = typeof metadata.duration === "number" && Number.isFinite(metadata.duration) ? metadata.duration : 0;
    if (metadata.is_live === true || metadata.live_status === "is_live" || metadata.live_status === "is_upcoming") {
      throw new YouTubeAudioError("Live and upcoming streams cannot be transcribed yet. Choose a completed recording.", 422);
    }
    if (!duration || duration > maxDuration) {
      throw new YouTubeAudioError(`Choose a completed video under ${Math.round(maxDuration / 60)} minutes long for audio transcription.`, 422);
    }
    if (typeof metadata.filesize === "number" && metadata.filesize > MAX_AUDIO_BYTES) {
      throw new YouTubeAudioError("This video's audio exceeds the 25 MB processing limit. Choose a shorter video.", 413);
    }
    await runDownloader(executable, [
      ...common, "--no-part", "--max-filesize", String(MAX_AUDIO_BYTES),
      "-f", "bestaudio", "-o", rawPath, url,
    ], 60_000, rawPath);
    const downloaded = await fs.promises.stat(rawPath).catch(() => null);
    if (!downloaded?.size) throw new YouTubeAudioError("YouTube returned no audio for this video. Try another public video.", 422);
    if (downloaded.size > MAX_AUDIO_BYTES) {
      throw new YouTubeAudioError("This video's audio exceeds the 25 MB processing limit. Choose a shorter video.", 413);
    }
    await extractAudioTrack(rawPath, mp3Path);
    const prepared = await fs.promises.stat(mp3Path);
    if (!prepared.size || prepared.size > MAX_AUDIO_BYTES) {
      throw new YouTubeAudioError("This video's extracted audio exceeds the processing limit. Choose a shorter video.", 413);
    }
    return {
      audioPath: mp3Path, tempFiles: await ownedFiles(),
      title: typeof metadata.title === "string" ? metadata.title : undefined, duration,
    };
  } catch (error) {
    await cleanupTempFiles(await ownedFiles().catch(() => [rawPath, mp3Path]));
    throw safeDownloadError(error);
  }
}
