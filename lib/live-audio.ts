/** Standalone, bounded PCM WAV chunks for live tab audio. */
export const LIVE_CHUNK_SECONDS = 5;
export const MAX_LIVE_CHUNK_BYTES = 1_600_000;

export function encodeMonoWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const write = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, buffer.byteLength - 8, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const sample = Number.isFinite(samples[i]) ? Math.max(-1, Math.min(1, samples[i])) : 0;
    view.setInt16(44 + i * 2, Math.round(sample * (sample < 0 ? 32768 : 32767)), true);
  }
  return buffer;
}

export function inspectLiveWav(buffer: ArrayBuffer): { duration: number; rms: number } {
  const fail = () => { throw new Error("Share the meeting tab again to send a valid, short audio chunk."); };
  if (buffer.byteLength < 46 || buffer.byteLength > MAX_LIVE_CHUNK_BYTES) return fail();
  const view = new DataView(buffer);
  const text = (start: number, count: number) => String.fromCharCode(...new Uint8Array(buffer, start, count));
  if (text(0, 4) !== "RIFF" || text(8, 4) !== "WAVE" || text(12, 4) !== "fmt " ||
      text(36, 4) !== "data" || view.getUint32(16, true) !== 16 ||
      view.getUint16(20, true) !== 1 || view.getUint16(22, true) !== 1 ||
      view.getUint16(32, true) !== 2 || view.getUint16(34, true) !== 16) return fail();
  const sampleRate = view.getUint32(24, true);
  const byteLength = view.getUint32(40, true);
  if (sampleRate < 8_000 || sampleRate > 96_000 || byteLength % 2 ||
      byteLength + 44 !== buffer.byteLength || view.getUint32(4, true) + 8 !== buffer.byteLength ||
      view.getUint32(28, true) !== sampleRate * 2) return fail();
  const duration = byteLength / (sampleRate * 2);
  if (duration < 0.15 || duration > 8) return fail();
  let energy = 0;
  for (let offset = 44; offset < buffer.byteLength; offset += 2) {
    energy += (view.getInt16(offset, true) / 32768) ** 2;
  }
  return { duration, rms: Math.sqrt(energy / (byteLength / 2)) };
}
