import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Gets a safe, cross-platform temporary directory for video processing.
 * Creates it if it doesn't exist.
 */
export async function getTempDir(): Promise<string> {
  // Use OS temp dir, but inside a unique subfolder to avoid collisions
  const tempBase = path.join(os.tmpdir(), 'gesture-sync-tmp');
  
  if (!fs.existsSync(tempBase)) {
    await fs.promises.mkdir(tempBase, { recursive: true });
  }
  return tempBase;
}

/**
 * Cleans up a list of file paths. Errors are swallowed but logged to avoid crashing.
 */
export async function cleanupTempFiles(filePaths: (string | null | undefined)[]): Promise<void> {
  for (const filePath of filePaths) {
    if (!filePath) continue;
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.warn(`[Cleanup] Failed to remove ${filePath}:`, err);
    }
  }
}
