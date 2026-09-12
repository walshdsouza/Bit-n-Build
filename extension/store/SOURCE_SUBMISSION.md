# Source code submission — instructions for AMO reviewers

The add-on's `dist/` directory is generated: it contains minified JavaScript
bundled by esbuild from the TypeScript sources. AMO therefore requires the
source, which is attached. These are the steps to reproduce `dist/` from it.

## Build environment

| | |
|---|---|
| Node.js | 22.x (built and verified on 22.19.0) |
| npm | 10.x, bundled with Node 22 |
| OS | Platform-independent; verified on Windows 11 and Linux |

No compiler, container or proprietary tool is needed.

## Steps

```bash
cd extension
npm install
npm run build
```

`npm run build` runs `esbuild.config.mjs`, which:

1. Bundles five entry points from `src/` into `dist/` as IIFEs targeting
   Firefox — `background`, `meet-bridge`, `page-hook`, `sidebar`, `options`
2. Copies the HTML and CSS shells, which esbuild does not process
3. Copies the 3D avatar model `../public/models/nexa.glb` into `dist/`

Output appears in `extension/dist/` and matches the submitted package.

## Layout

| Path | What it is |
|---|---|
| `src/background/` | Background script (toolbar button → sidebar) |
| `src/content-scripts/` | Meet tab audio bridge |
| `src/sidebar/` | Sidebar UI (React) |
| `src/options/` | Settings page (React) |
| `src/pipeline/` | Audio capture, transcription call, settings storage |
| `../lib/` | Shared translation pipeline — gloss, HamNoSys, SiGML, motion planning |
| `../components/player/NexaAvatar.tsx` | 3D avatar renderer |
| `esbuild.config.mjs` | The entire build; there is no other build step |

The sidebar imports `../../../lib/*` and the avatar component from the parent
repository, because the extension and the web app share one translation
pipeline. Both directories are included in the source archive.

## Third-party code in the bundle

| Library | Licence | Why |
|---|---|---|
| React + React DOM 19 | MIT | Sidebar and settings UI |
| three.js 0.180 | MIT | Renders the 3D avatar |

Both are unmodified npm releases, bundled by esbuild rather than loaded
remotely. No code is fetched at runtime.

`nexa.glb` is an MIT-licensed 3D model included in the package; its licence is
at `public/models/NEXA-LICENSE.txt`.

## Notes on lint warnings

`web-ext lint` reports four `UNSAFE_VAR_ASSIGNMENT` warnings in
`dist/sidebar.js` and `dist/options.js`. These are `innerHTML` assignments
inside the minified React and three.js builds, not extension code. They are
visible in the unminified sources of those libraries under `node_modules/`.

## Network access

The extension contacts exactly two hosts, both declared in the manifest and
both only for transcribing audio the user explicitly captures:

- `api.groq.com`
- `api.openai.com`

The request carries the user's own API key from `browser.storage.local`. There
is no backend, no analytics and no remote code execution.
