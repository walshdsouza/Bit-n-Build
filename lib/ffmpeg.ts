import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

// Set the path to the ffmpeg binary provided by @ffmpeg-installer
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export class SilentAudioError extends Error {
  constructor() {
    super('No audible sound was detected in this recording. Choose a source with spoken audio.');
    this.name = 'SilentAudioError';
  }
}

/**
 * Extracts a lightweight .mp3 audio track from a given video file.
 * @param videoPath The absolute path to the input video file (e.g. .mp4, .webm)
 * @param outputPath The absolute path to the output .mp3 file
 * @returns A promise that resolves when the extraction completes
 */
export function extractAudioTrack(videoPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let maxVolume: number | null = null;
    ffmpeg(videoPath, { timeout: process.env.VERCEL ? 15 : 120 })
      .noVideo() // Remove video stream
      .audioCodec('libmp3lame')
      .audioBitrate('64k') // 64kbps is plenty for Whisper speech recognition and keeps the file lightweight
      .audioChannels(1) // Mono is better/faster for Whisper
      .audioFrequency(16000) // 16kHz is standard for speech recognition models
      .audioFilters('volumedetect')
      .output(outputPath)
      .on('stderr', (line: string) => {
        const match = line.match(/max_volume:\s*(-?[\d.]+|-inf)\s*dB/);
        if (match) maxVolume = match[1] === '-inf' ? Number.NEGATIVE_INFINITY : Number(match[1]);
      })
      .on('end', () => {
        // Reject digital silence before Whisper can hallucinate words. This
        // floor is far below quiet speech; ordinary speech uses confidence
        // checks after transcription, not a loudness threshold.
        if (maxVolume !== null && maxVolume <= -85) reject(new SilentAudioError());
        else resolve();
      })
      .on('error', (err: Error) => {
        reject(new Error(`Failed to extract audio using ffmpeg: ${err.message}`));
      })
      .run();
  });
}
