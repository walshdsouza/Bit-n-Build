/**
 * Test runner for the translation pipeline.
 *
 * The `lib/` layer is deliberately free of React and three.js imports, so it
 * can be compiled with tsc and exercised in plain Node — no test framework
 * needed.
 *
 *   npm test           unit + timing (no server required)
 *   npm run test:api   API integration (needs `npm run dev` on :3111)
 */

import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const outDir = path.join(here, ".build");

const SOURCES = [
  "lib/gloss-engine.ts",
  "lib/sign-plan.ts",
  "lib/sigml.ts",
  "lib/hamnosys.ts",
  "lib/prosody.ts",
  "lib/sign-languages.ts",
  "lib/segments.ts",
  "lib/avatar/pose-solver.ts",
  "lib/dictionaries/index.ts",
];

function compile() {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });

  // Run tsc's JS entrypoint through node directly. Spawning `npx`/`tsc` by name
  // is not portable on Windows, where they are .cmd shims.
  const tsc = path.join(root, "node_modules", "typescript", "bin", "tsc");
  if (!existsSync(tsc)) {
    console.error("typescript not installed — run `npm install` first.");
    process.exit(1);
  }

  execFileSync(
    process.execPath,
    [
      tsc, ...SOURCES,
      "--outDir", outDir,
      "--module", "commonjs",
      "--target", "es2020",
      "--moduleResolution", "node",
      "--skipLibCheck",
      "--esModuleInterop",
      // lib/dictionaries imports the compiled ISL dataset as JSON.
      "--resolveJsonModule",
      // Pin the root so output always lands at <out>/lib/... — importing the
      // JSON dataset from outside lib/ would otherwise move the common root.
      "--rootDir", ".",
    ],
    { cwd: root, stdio: "inherit" },
  );
}

function run(file) {
  console.log(`\n>>> ${file}`);
  execFileSync(process.execPath, [path.join(here, file)], { stdio: "inherit" });
}

const apiOnly = process.argv.includes("--api");

if (apiOnly) {
  run("api.test.js");
} else {
  compile();
  run("pipeline.test.js");
  run("timing.test.js");
}
