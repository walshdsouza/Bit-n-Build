// Shared TypeScript types for the GestureSync AI pipeline

export type JobStatus = "queued" | "processing" | "done" | "error";

export type PipelineStage =
  | "audio_extraction"
  | "transcription"
  | "gloss_generation"
  | "sigml_synthesis"
  | "cwasa_rendering";

export interface TranscriptSegment {
  start: number; // seconds
  end: number;
  text: string;
  speaker?: string;
}

export interface NMMTag {
  time: number;
  emotion: string;
  intensity?: number; // 0-1
}

export interface GlossRow {
  startTime: number;
  endTime: number;
  sourceText: string;
  gloss: string; // space-separated gloss lemmas
  nmm: NMMTag[];
  status: "synced" | "active" | "buffered" | "queued";
}

export interface PipelineJob {
  jobId: string;
  filename: string;
  sourceUrl?: string;
  duration?: number; // seconds
  status: JobStatus;
  stage: PipelineStage;
  progress: number; // 0-100
  glossRows?: GlossRow[];
  sigml?: string; // SiGML XML string
  createdAt: string; // ISO timestamp
  updatedAt: string;
  errorMessage?: string;
}

export interface EngineHealth {
  whisper: { status: "online" | "offline"; latencyMs: number };
  gloss: { status: "online" | "offline"; latencyMs: number };
  cwasa: { status: "online" | "offline"; fps: number };
  totalLatencyMs: number;
}

export interface IngestRequest {
  url?: string;
  filename?: string;
}

export interface IngestResponse {
  jobId: string;
  status: JobStatus;
}

export interface TranscribeResponse {
  segments: TranscriptSegment[];
}

export interface GlossResponse {
  glossRows: GlossRow[];
}

export interface SiGMLResponse {
  sigml: string;
}
