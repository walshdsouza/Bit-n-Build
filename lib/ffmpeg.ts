import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

// Set the path to the ffmpeg binary provided by @ffmpeg-installer
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Extracts a lightweight .mp3 audio track from a given video file.
 * @param videoPath The absolute path to the input video file (e.g. .mp4, .webm)
 * @param outputPath The absolute path to the output .mp3 file
 * @returns A promise that resolves when the extraction completes
 */
export function extractAudioTrack(videoPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo() // Remove video stream
      .audioCodec('libmp3lame')
      .audioBitrate('64k') // 64kbps is plenty for Whisper speech recognition and keeps the file lightweight
      .audioChannels(1) // Mono is better/faster for Whisper
      .audioFrequency(16000) // 16kHz is standard for speech recognition models
      .output(outputPath)
      .on('end', () => {
        resolve();
      })
      .on('error', (err: Error) => {
        reject(new Error(`Failed to extract audio using ffmpeg: ${err.message}`));
      })
      .run();
  });
}
