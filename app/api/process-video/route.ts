import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { getTempDir, cleanupTempFiles } from '@/lib/temp-manager';
import { extractAudioTrack } from '@/lib/ffmpeg';
import { transcribeAudioFile } from '@/lib/whisper';

// Extract an 11-char video ID from any standard YouTube URL
function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/i,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

export async function POST(req: NextRequest) {
  let tempVideoPath: string | null = null;
  let tempAudioPath: string | null = null;

  try {
    const contentType = req.headers.get("content-type") || "";
    let url: string | null = null;
    let file: File | null = null;

    // Parse input (JSON or FormData)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      url = body.url || body.youtubeUrl;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      url = formData.get("url") as string | null;
      file = formData.get("file") as File | null;
    }

    // Identify if it's YouTube
    const videoId = url ? extractYouTubeVideoId(url) : null;

    // 1. YouTube Flow
    if (videoId) {
      const pythonScriptPath = path.join(process.cwd(), 'scripts', 'get_youtube_transcript.py');
      
      const cmds = [
        // Real Python 3.13 install path (confirmed on this machine)
        'C:\\Users\\WALSH\\AppData\\Local\\Programs\\Python\\Python313\\python.exe',
        'python',
        'py',
        'python3',
      ];
      let stdout = '';
      let stderr = '';
      let lastError = null;

      for (const cmd of cmds) {
        try {
          const result = await new Promise<{stdout: string, stderr: string}>((resolve, reject) => {
            execFile(cmd, [pythonScriptPath, videoId], { 
              encoding: 'utf8',
              shell: true,
              env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
            }, (error, out, err) => {
              if (error) {
                // The python script exits with code 1 if it fails to fetch (e.g. no captions).
                // If we have valid JSON in stdout, it's a handled application error, not a python execution failure.
                try {
                  const data = JSON.parse(out);
                  if (data && typeof data.success === 'boolean') {
                    return resolve({stdout: out, stderr: err});
                  }
                } catch (_) {}
                reject(error);
              }
              else resolve({stdout: out, stderr: err});
            });
          });
          stdout = result.stdout;
          stderr = result.stderr;
          lastError = null;
          break; // success
        } catch (e) {
          lastError = e;
        }
      }

      if (lastError) {
        console.error('Python execution failed after trying all commands:', lastError);
        return NextResponse.json({ 
          error: 'Failed to execute Python script. Ensure Python is installed and in your PATH, and you have restarted the Next.js server.', 
          execError: (lastError as any)?.message || String(lastError)
        }, { status: 500 });
      }

      try {
        const data = JSON.parse(stdout);
        if (!data.success) {
          return NextResponse.json({ error: data.error, source: 'youtube' }, { status: 400 });
        }
        
        const text = data.segments.map((s: any) => s.text).join(' ');
        const duration = data.segments.length > 0 
          ? data.segments[data.segments.length - 1].end 
          : 0;

        return NextResponse.json({
          success: true,
          source: 'youtube',
          duration,
          text,
          segments: data.segments,
          metadata: {
            provider: 'youtube-transcript-api',
            videoId,
            processedAt: new Date().toISOString()
          }
        });
      } catch (parseError: any) {
        console.error('Python Output Parse Error:', parseError.message);
        console.error('STDOUT:', stdout);
        console.error('STDERR:', stderr);
        return NextResponse.json({ 
          error: 'Failed to parse YouTube transcript data', 
          stdout, 
          stderr
        }, { status: 500 });
      }
    }

    // 2. Local MP4 / Video File Flow
    if (file) {
      const tempDir = await getTempDir();
      const uniqueId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      tempVideoPath = path.join(tempDir, `${uniqueId}_video.mp4`);
      tempAudioPath = path.join(tempDir, `${uniqueId}_audio.mp3`);

      // Write video file to disk
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(tempVideoPath, buffer);

      // Extract lightweight MP3
      await extractAudioTrack(tempVideoPath, tempAudioPath);

      // Extract API Keys from headers or fallback to environment variables
      const groqKey = req.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
      const openaiKey = req.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

      // Load extracted MP3 as Blob for transcription
      const audioBuffer = await fs.promises.readFile(tempAudioPath);
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

      // Transcribe via Whisper
      const transcription = await transcribeAudioFile(audioBlob, `${uniqueId}.mp3`, groqKey, openaiKey);

      return NextResponse.json({
        success: true,
        source: 'file',
        duration: transcription.duration,
        text: transcription.text,
        segments: transcription.segments,
        metadata: {
          provider: transcription.provider,
          filename: file.name,
          processedAt: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ error: "Provide either a valid YouTube URL or a video File." }, { status: 400 });

  } catch (error: any) {
    console.error("Video processing error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  } finally {
    // 3. Robust Cleanup of temporary files
    await cleanupTempFiles([tempVideoPath, tempAudioPath]);
  }
}
