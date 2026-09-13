import type { SupabaseClient } from '@supabase/supabase-js';

interface CloudTranscriptSegment {
  id: string;
  start_time: number;
  end_time: number;
  original_text: string;
  edited_text: string | null;
}

/** Supabase caps a select at 1000 rows by default. Page explicitly so a saved
 * long recording cannot silently lose the second half of its transcript. */
export async function loadCloudTranscript(supabase: SupabaseClient, projectId: string): Promise<CloudTranscriptSegment[]> {
  const segments: CloudTranscriptSegment[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase.from('transcript_segments')
      .select('id,start_time,end_time,original_text,edited_text')
      .eq('project_id', projectId).order('sequence_index', { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error('The saved transcript could not be loaded. Please retry this track.');
    segments.push(...(data ?? []));
    if (!data || data.length < pageSize) return segments;
  }
}
