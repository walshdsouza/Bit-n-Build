import { TranscriptSegment } from './types';

// Simple mock fallback to prevent hard crashes when keys are absent
const MOCK_SEGMENTS: TranscriptSegment[] = [
  { start: 0, end: 4.2, text: "The woman thinks about food." },
  { start: 4.2, end: 8.0, text: "She wants pizza but is on a diet." },
  { start: 8.0, end: 13.1, text: "She calls her friend for advice." },
  { start: 13.1, end: 18.5, text: "They plan to go to a salad bar." },
  { start: 18.5, end: 23.8, text: "But the friend suggests tacos instead." },
  { start: 23.8, end: 28.0, text: "They both laugh at the situation." },
];

export interface TranscriptionResult {
  text: string;
  segments: TranscriptSegment[];
  duration: number;
  provider: 'groq-whisper' | 'openai-whisper' | 'mock';
}

/**
 * Sends an audio file to Groq Whisper or OpenAI Whisper API.
 * Prioritizes Groq for speed if both keys are present.
 */
export async function transcribeAudioFile(audioBlob: Blob, filename: string, groqKey?: string | null, openaiKey?: string | null): Promise<TranscriptionResult> {
  // If no keys, return mock
  if (!groqKey && !openaiKey) {
    console.warn("No Groq or OpenAI API key found. Using mock transcription.");
    await new Promise((r) => setTimeout(r, 800)); // simulate latency
    return {
      text: MOCK_SEGMENTS.map(s => s.text).join(' '),
      segments: MOCK_SEGMENTS,
      duration: 28.0,
      provider: 'mock'
    };
  }

  const useGroq = !!groqKey;
  const endpoint = useGroq 
    ? 'https://api.groq.com/openai/v1/audio/transcriptions'
    : 'https://api.openai.com/v1/audio/transcriptions';
  
  const apiKey = useGroq ? groqKey : openaiKey;
  const model = useGroq ? 'whisper-large-v3' : 'whisper-1';
  const provider = useGroq ? 'groq-whisper' : 'openai-whisper';

  const formData = new FormData();
  formData.append('file', audioBlob, filename || 'audio.mp3');
  formData.append('model', model);
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'segment');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[${provider}] Transcription failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  // Parse verbose_json format segments to TranscriptSegment format
  const segments: TranscriptSegment[] = (data.segments || []).map((seg: any) => ({
    start: Number(seg.start),
    end: Number(seg.end),
    text: String(seg.text).trim()
  }));

  return {
    text: data.text || '',
    segments,
    duration: data.duration || 0,
    provider
  };
}
