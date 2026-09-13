// Official standalone releases include Python and yt-dlp's EJS solver.
// Pin and verify the artifact; never download executable code during a request.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, chmod } from 'node:fs/promises';
import path from 'node:path';

const release = '2026.08.19';
const artifacts = {
  'linux-x64': { name: 'yt-dlp_linux', sha256: '58162f9bfdc27458ea47bfcb311cf47028f17d8154a8bf7d689861d46399230a' },
  'win32-x64': { name: 'yt-dlp.exe', sha256: '66674953fe251b89f4d08c5f0e35e0728679bd67ab3d7d05c0562af101dd3e7a' },
};
const platform = `${process.platform}-${process.arch}`;
const artifact = artifacts[platform];
if (!artifact) {
  if (process.env.VERCEL) throw new Error(`No bundled YouTube downloader for ${platform}.`);
  console.log('YouTube downloader is not bundled for this platform. File upload and browser-tab capture remain available.');
} else {
  const directory = path.join(process.cwd(), 'vendor', 'youtube', platform);
  const target = path.join(directory, artifact.name);
  const valid = (bytes) => createHash('sha256').update(bytes).digest('hex') === artifact.sha256;
  let cached = false;
  try { cached = valid(await readFile(target)); } catch { /* First build. */ }
  if (!cached) {
    const response = await fetch(`https://github.com/yt-dlp/yt-dlp/releases/download/${release}/${artifact.name}`, {
      signal: AbortSignal.timeout(90_000),
    });
    if (!response.ok) throw new Error(`YouTube downloader download failed: HTTP ${response.status}.`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!valid(bytes)) throw new Error('YouTube downloader checksum mismatch.');
    await mkdir(directory, { recursive: true });
    await writeFile(target, bytes);
  }
  if (process.platform !== 'win32') await chmod(target, 0o755);
  console.log(`YouTube downloader ${release} verified for ${platform}.`);
}
