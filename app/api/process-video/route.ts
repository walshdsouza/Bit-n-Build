import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
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
        'python', 
        'py', 
        'python3',
        // Fallback for Windows Store Python if PATH is completely broken in the terminal
        path.join(process.env.LOCALAPPDATA || 'C:\\Users\\' + (process.env.USERNAME || 'soham') + '\\AppData\\Local', 'Microsoft', 'WindowsApps', 'python.exe')
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
              if (error) reject(error);
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

        // Save to DB
        let projectId: string | null = null;
        let dbError = null;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: project, error: insertError } = await supabase.from('projects').insert({
            user_id: user.id,
            title: `YouTube Video: ${videoId}`,
            source_type: 'youtube',
            source_url: url,
            source_duration: duration,
            status: 'ready'
          }).select().single();
          
          if (insertError) {
            console.error("YouTube DB Insert Error:", insertError);
            dbError = insertError;
          }
          
          if (project) {
            projectId = project.id;
            
            // Insert transcript segments
            if (data.segments && data.segments.length > 0) {
              const segmentsToInsert = data.segments.map((s: any, i: number) => ({
                project_id: projectId,
                sequence_index: i,
                start_time: s.start,
                end_time: s.end,
                original_text: s.text,
              }));
              
              await supabase.from('transcript_segments').insert(segmentsToInsert);
            }
          }
        } else {
          dbError = "User not logged in according to supabase.auth.getUser()";
        }

        return NextResponse.json({
          success: true,
          source: 'youtube',
          duration,
          text,
          segments: data.segments,
          projectId,
          metadata: {
            provider: 'youtube-transcript-api',
            videoId,
            processedAt: new Date().toISOString(),
            dbError
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

      // Save to DB
      let projectId: string | null = null;
      let finalPublicUrl = null;
      
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Upload the video to Supabase Storage
        // Use a unique file name in the 'media' bucket, under the user's ID
        const fileExt = file.name.split('.').pop() || 'mp4';
        const storagePath = `${user.id}/${uniqueId}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('media')
          .upload(storagePath, buffer, {
            contentType: file.type || 'video/mp4',
            upsert: false
          });
          
        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          // Proceed anyway but without source_url
        } else {
          const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(storagePath);
          finalPublicUrl = publicUrlData.publicUrl;
        }

        const { data: project } = await supabase.from('projects').insert({
          user_id: user.id,
          title: file.name,
          source_type: 'upload',
          source_url: finalPublicUrl,
          source_duration: transcription.duration,
          status: 'ready'
        }).select().single();
        
        if (project) {
          projectId = project.id;
          
          // Insert transcript segments
          if (transcription.segments && transcription.segments.length > 0) {
            const segmentsToInsert = transcription.segments.map((s: any, i: number) => ({
              project_id: projectId,
              sequence_index: i,
              start_time: s.start,
              end_time: s.end,
              original_text: s.text,
            }));
            
            await supabase.from('transcript_segments').insert(segmentsToInsert);
          }
        }
      }

      return NextResponse.json({
        success: true,
        source: 'file',
        duration: transcription.duration,
        text: transcription.text,
        segments: transcription.segments,
        projectId,
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
