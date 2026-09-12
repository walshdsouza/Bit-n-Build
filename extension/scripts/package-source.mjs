/**
 * Builds the source archive AMO requires alongside a package containing
 * minified code.
 *
 * The extension shares its translation pipeline with the web app, so the
 * archive has to reach outside `extension/` — `lib/`, the avatar component and
 * the model all live in the parent repository. A reviewer unpacking this and
 * following store/SOURCE_SUBMISSION.md must be able to reproduce `dist/`.
 */

import { existsSync, mkdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const extDir = path.resolve(here, "..");
const repoDir = path.resolve(extDir, "..");
const outDir = path.join(extDir, "web-ext-artifacts");

/** Everything a reviewer needs, relative to the repository root. */
const INCLUDE = [
  "extension/src",
  "extension/icons",
  "extension/store",
  "extension/scripts",
  "extension/manifest.json",
  "extension/esbuild.config.mjs",
  "extension/package.json",
  "extension/package-lock.json",
  "extension/tsconfig.json",
  "extension/README-BUILD.txt",
  // Shared pipeline the sidebar imports.
  "lib",
  "components/player/NexaAvatar.tsx",
  "components/player/avatar",
  "public/models",
];

mkdirSync(outDir, { recursive: true });
const v = JSON.parse(
  execFileSync(process.execPath, ["-p", "JSON.stringify(require('./manifest.json').version)"], {
    cwd: extDir,
    encoding: "utf8",
  }),
);
const zipPath = path.join(outDir, `gesturesync-source-${v}.zip`);

const present = INCLUDE.filter((p) => existsSync(path.join(repoDir, p)));
const missing = INCLUDE.filter((p) => !existsSync(path.join(repoDir, p)));
if (missing.length) {
  console.warn("Skipping paths that do not exist:", missing.join(", "));
}

// PowerShell's Compress-Archive is always available on Windows; `zip` is the
// usual tool elsewhere. Either produces an archive AMO accepts.
if (process.platform === "win32") {
  const list = present.map((p) => `'${path.join(repoDir, p).replace(/'/g, "''")}'`).join(",");
  execFileSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `if (Test-Path '${zipPath}') { Remove-Item '${zipPath}' } ; Compress-Archive -Path ${list} -DestinationPath '${zipPath}'`,
    ],
    { stdio: "inherit" },
  );
} else {
  execFileSync("zip", ["-r", "-q", zipPath, ...present, "-x", "*/node_modules/*"], {
    cwd: repoDir,
    stdio: "inherit",
  });
}

const size = statSync(zipPath).size;
console.log(`Source archive → ${zipPath} (${(size / 1024 / 1024).toFixed(1)} MB)`);
console.log("Upload this alongside the add-on package when AMO asks for source.");
