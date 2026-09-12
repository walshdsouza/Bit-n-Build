// Shared TypeScript types for the GestureSync AI pipeline

export type JobStatus = "queued" | "processing" | "done" | "error";

export type PipelineStage =
  | "audio_extraction"
  | "transcription"
  | "prosody_analysis"
  | "gloss_generation"
  | "hamnosys_encoding"
  | "sigml_synthesis"
  | "motion_synthesis"
  | "cwasa_rendering";

/** Sign languages supported by the GestureSync notation + motion pipeline. */
export type SignLanguageCode = "ASL" | "ISL" | "BSL";

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
  /** Which sign language this row was glossed into. */
  lang?: SignLanguageCode;
  /** Lemmas with no dictionary entry — rendered as fingerspelling. */
  fingerspelled?: string[];
}

/* ------------------------------------------------------------------ *
 * Prosody / emotion  (GenASL-style "audio analysis" stage)
 * ------------------------------------------------------------------ */

export interface ProsodyFrame {
  time: number; // seconds
  energy: number; // 0-1 loudness
  pitch: number; // 0-1 normalised F0
  rate: number; // words per second
  emotion: EmotionLabel;
  confidence: number; // 0-1
}

export type EmotionLabel =
  | "neutral"
  | "happy"
  | "sad"
  | "angry"
  | "surprised"
  | "emphatic"
  | "questioning";

/* ------------------------------------------------------------------ *
 * HamNoSys / SiGML notation  (Kozha-style notation bridge)
 * ------------------------------------------------------------------ */

export type HandShape =
  | "fist" | "flat" | "finger2" | "finger23" | "finger2345"
  | "pinch12" | "pinchall" | "cee12" | "ceeall" | "finger23spread";

export type ExtFingerDir =
  | "u" | "d" | "l" | "r" | "o" | "i"
  | "ul" | "ur" | "dl" | "dr" | "ol" | "or";

export type PalmOrientation = "u" | "d" | "l" | "r" | "o" | "i" | "ul" | "ur" | "dl" | "dr";

export type BodyLocation =
  | "head" | "forehead" | "eyes" | "nose" | "mouth" | "chin" | "cheek"
  | "neck" | "shoulders" | "chest" | "stomach" | "neutral_space"
  | "shoulder_l" | "shoulder_r" | "palm_weak";

export type MovementType =
  | "straight" | "curved" | "circle" | "wavy" | "zigzag"
  | "contact" | "tap" | "twist" | "nod" | "none";

export interface HandConfig {
  shape: HandShape;
  extFingerDir: ExtFingerDir;
  palmOr: PalmOrientation;
  location: BodyLocation;
}

export interface SignMovement {
  type: MovementType;
  direction?: ExtFingerDir;
  size?: "small" | "medium" | "large";
  repetitions?: number;
  fast?: boolean;
}

/** One dictionary entry: a gloss lemma encoded in HamNoSys primitives. */
export interface SignEntry {
  gloss: string;
  /** true = both hands articulate; "symmetric" mirrors the dominant hand. */
  twoHanded: boolean;
  symmetric?: boolean;
  dominant: HandConfig;
  nonDominant?: HandConfig;
  movement: SignMovement;
  /** Default non-manual marker carried by the sign itself. */
  nmm?: string;
  /** Pre-computed HamNoSys string (Unicode HamNoSys 4 range). */
  hamnosys?: string;
  /** Seconds this sign nominally takes to articulate. */
  duration?: number;
}

/* ------------------------------------------------------------------ *
 * Motion plan  (GenASL-style "interpreter brain" → motion synthesis)
 * ------------------------------------------------------------------ */

export interface SignPlanItem {
  gloss: string;
  startTime: number;
  endTime: number;
  entry: SignEntry | null;
  fingerspell?: string;
  nmm: NMMTag[];
  /** 0-1 emphasis, driven by prosody energy. */
  emphasis: number;
}

export interface SignPlan {
  lang: SignLanguageCode;
  duration: number;
  items: SignPlanItem[];
  sigml: string;
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
  lang: SignLanguageCode;
}

export interface SiGMLResponse {
  sigml: string;
  lang: SignLanguageCode;
}

export interface SignPlanResponse {
  plan: SignPlan;
}
