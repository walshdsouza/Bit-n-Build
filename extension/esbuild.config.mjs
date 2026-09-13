import { build, context } from "esbuild";
import { mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const watch = process.argv.includes("--watch");
const reactDir = fileURLToPath(new URL("./node_modules/react", import.meta.url));
const reactDomDir = fileURLToPath(new URL("./node_modules/react-dom", import.meta.url));

const options = {
  alias: {
    react: reactDir,
    "react-dom": reactDomDir,
    "react/jsx-runtime": `${reactDir}/jsx-runtime`,
    "react-dom/client": `${reactDomDir}/client`,
  },
  entryPoints: {
    background: "src/background/background.ts",
    "meet-bridge": "src/content-scripts/meet-bridge.ts",
    "meet-widget": "src/content-scripts/meet-widget.ts",
    widget: "src/widget/index.tsx",
    sidebar: "src/sidebar/index.tsx",
    options: "src/options/index.tsx",
    "page-hook": "src/content-scripts/page-hook.ts",
  },
  bundle: true,
  outdir: "dist",
  format: "iife",
  target: "firefox112",
  sourcemap: watch ? "inline" : false,
  minify: !watch,
};

// esbuild bundles JS/TS entry points only — it does not know about the HTML
// shells or CSS these pages load, so those have to be copied to dist/ by hand
// on every build.
const staticFiles = [
  ["src/sidebar/sidebar.html", "dist/sidebar.html"],
  ["src/sidebar/sidebar.css", "dist/sidebar.css"],
  ["src/options/options.html", "dist/options.html"],
  // options.html links this; without it the settings page renders unstyled.
  ["src/options/options.css", "dist/options.css"],
  ["src/widget/widget.html", "dist/widget.html"],
  ["src/widget/widget.css", "dist/widget.css"],
  // The avatar model ships inside the extension — it is standalone, so there
  // is no server to fetch it from.
  ["../public/models/nexa.glb", "dist/nexa.glb"],
];

function copyStatic() {
  mkdirSync("dist", { recursive: true });
  for (const [from, to] of staticFiles) {
    copyFileSync(from, to);
  }
}

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  copyStatic();
  console.log("Watching for changes... (static files copied once — re-run `npm run build` if you edit .html/.css)");
} else {
  await build(options);
  copyStatic();
  console.log("Build complete → dist/");
}
