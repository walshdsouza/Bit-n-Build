import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@ffmpeg-installer/ffmpeg', 'fluent-ffmpeg'],
  // The installer resolves this path dynamically. Include the build host's
  // binary explicitly so Linux serverless functions receive their executable.
  outputFileTracingIncludes: {
    '/api/process-video': [`./node_modules/@ffmpeg-installer/${process.platform}-${process.arch}/**/*`, `./vendor/youtube/${process.platform}-${process.arch}/*`, './scripts/get_youtube_transcript.py'],
    '/api/ingest': [`./node_modules/@ffmpeg-installer/${process.platform}-${process.arch}/**/*`, `./vendor/youtube/${process.platform}-${process.arch}/*`, './scripts/get_youtube_transcript.py'],
  },
};

export default nextConfig;
