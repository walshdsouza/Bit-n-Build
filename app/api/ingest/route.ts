// Compatibility endpoint: return the actual processed transcript instead of
// inventing an in-memory job whose timer claims the media was translated.
export { POST } from "../process-video/route";
export const runtime = "nodejs";
export const maxDuration = 180;
