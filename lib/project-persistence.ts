import { randomUUID } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { TranscriptSegment } from './types';

function logPersistenceFailure(stage: string, error: unknown) {
  const value = error && typeof error === 'object' ? error as Record<string, unknown> : {};
  const code = typeof value.code === 'string' && /^[a-zA-Z0-9_]{1,60}$/.test(value.code) ? value.code
    : typeof value.message === 'string' && /bucket not found/i.test(value.message) ? 'MEDIA_BUCKET_NOT_FOUND' : 'PERSISTENCE_ERROR';
  const status = Number(value.statusCode ?? value.status);
  // Codes and stage are enough to diagnose bucket/schema/RLS failures. Never
  // log database details, request payloads, signed URLs, or account credentials.
  console.warn('[process-video] Persistence failed', { stage, code, ...(Number.isFinite(status) ? { status } : {}) });
}

export interface PersistTranscriptInput {
  duration: number;
  segments: TranscriptSegment[];
  title: string;
  sourceType: 'youtube' | 'upload';
  sourceUrl?: string | null;
  file?: File;
  buffer?: Uint8Array;
}

/** A failed optional save must retain the usable transcription without leaving
 * an empty "ready" project or an orphan media upload in the account. */
export async function persistProjectTranscript(supabase: SupabaseClient, userId: string, input: PersistTranscriptInput) {
  let sourceUrl = input.sourceUrl ?? null;
  let uploadedPath: string | null = null;
  let projectId: string | null = null;
  let mediaWarning: string | undefined;
  let stage = 'media_upload';
  try {
    if (input.file && input.buffer) {
      const extension = input.file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'mp4';
      const storagePath = `${userId}/${randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from('media').upload(storagePath, input.buffer, {
        contentType: input.file.type || 'application/octet-stream', upsert: false,
      });
      if (!error) {
        uploadedPath = storagePath;
        sourceUrl = supabase.storage.from('media').getPublicUrl(storagePath).data.publicUrl;
      } else {
        logPersistenceFailure(stage, error);
        mediaWarning = 'Your transcript is saved to your account, but the media upload failed. Choose Save to keep the video and translation on this device.';
      }
    }
    stage = 'project_insert';
    const { data: project, error } = await supabase.from('projects').insert({
      user_id: userId, title: input.title, source_type: input.sourceType,
      source_url: sourceUrl, source_duration: input.duration, status: 'ready',
    }).select().single();
    if (error || !project) throw error ?? new Error('Project insert failed');
    projectId = project.id;
    stage = 'transcript_insert';
    const { error: segmentError } = await supabase.from('transcript_segments').insert(
      input.segments.map((segment, index) => ({
        project_id: project.id, sequence_index: index,
        start_time: segment.start, end_time: segment.end, original_text: segment.text,
      })),
    );
    if (segmentError) throw segmentError;
    return { projectId, sourceUrl, ...(mediaWarning ? { persistenceWarning: mediaWarning } : {}) };
  } catch (error) {
    logPersistenceFailure(stage, error);
    // Only resources created by this attempt are eligible for cleanup. RLS
    // still enforces ownership; cleanup failure must not hide the transcript.
    if (projectId) await supabase.from('projects').delete().eq('id', projectId).eq('user_id', userId).then(() => {}, () => {});
    if (uploadedPath) await supabase.storage.from('media').remove([uploadedPath]).catch(() => {});
    return { projectId: null, sourceUrl: input.sourceUrl ?? null,
      persistenceWarning: 'Translation is ready, but could not be saved to your account. Choose Save to keep it on this device.',
    };
  }
}
