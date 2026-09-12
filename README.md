# GestureSync AI

Turns spoken audio, recorded video, or a YouTube link into a real-time **3D sign
language avatar** — in American Sign Language (ASL) or **Indian Sign Language (ISL)**.

```
speech → transcript → prosody → gloss → HamNoSys → SiGML → 3D avatar
```

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The player at `/player/demo` works with no
configuration — it ships a demo transcript and the rule-based glosser.

### Optional API keys

Transcription and LLM glossing use Groq (preferred, faster) or OpenAI. Without a
key the app still runs: transcription falls back to a mock and glossing falls
back to a deterministic rule engine.

```bash
# .env.local
GROQ_API_KEY=...
OPENAI_API_KEY=...
```

Keys can also be supplied per-request via `x-groq-api-key` / `x-openai-api-key`
headers, or through the in-app Settings page.

### YouTube ingestion

Two paths, tried in order:

1. **Captions** — needs Python with `youtube-transcript-api`:
   ```bash
   pip install youtube-transcript-api
   ```
2. **Audio fallback**, used when a video has no captions (or the caption reader
   isn't installed) — downloads the audio and runs Whisper. Needs `yt-dlp` and
   an API key:
   ```bash
   pip install -U yt-dlp
   ```

> **yt-dlp needs a JavaScript runtime.** YouTube gates media URLs behind a JS
> challenge; without a runtime, extraction appears to work but every download
> fails with `HTTP Error 403`. Install [Deno](https://deno.com) and keep
> `yt-dlp` current — it needs frequent updates to track YouTube's changes.

Videos with captions work with neither of the above beyond Python.

## Features

- **Two sign languages, properly.** ISL is not ASL relabelled — it has its own
  SOV grammar, two-handed manual alphabet, post-verbal negation and its own
  lexicon. Switch targets from the picker in the player.
- **Real notation output.** Emits valid **SiGML**, downloadable from the player,
  so translations drive any CWASA/JASigning renderer as well as our own avatar.
- **Prosody-aware.** Speech rate and affect modulate sign size, speed and facial
  non-manual markers.
- **Degrades gracefully.** No API key, no dictionary entry, or no source video —
  each has a real fallback rather than a failure.

## API

| Endpoint | Purpose |
|---|---|
| `POST /api/process-video` | Ingest a YouTube URL or uploaded file → transcript |
| `POST /api/translate` | Transcript → gloss + SiGML + motion plan (one shot) |
| `POST /api/gloss` | Transcript → gloss rows only |
| `POST /api/sigml` | Gloss rows → SiGML + motion plan |
| `GET /api/sign-languages` | Supported languages and their grammar profiles |

```bash
curl -X POST http://localhost:3000/api/translate \
  -H 'Content-Type: application/json' \
  -d '{"lang":"ISL","segments":[{"start":0,"end":3,"text":"Yesterday I went to school."}]}'
# → gloss: "YESTERDAY IX-1 SCHOOL GO"
```

## Firefox extension

A **standalone** Firefox sidebar that captions Google Meet calls with a signing
avatar. Standalone means exactly that: it runs no server and does not need the
web app above. Audio is transcribed by calling Whisper directly with your own
API key, and glossing, HamNoSys, SiGML and motion planning all run inside the
extension using the same `lib/` code as the web app.

> **Firefox only.** It uses Manifest V2 and the `sidebar_action` API, neither of
> which Chrome supports.

### Build

```bash
cd extension
npm install
npm run build
```

Output goes to `extension/dist/`. Use `npm run watch` while developing — note
that it only copies the HTML/CSS/model once, so re-run `npm run build` after
editing those.

### Run it

1. Open `about:debugging#/runtime/this-firefox` in Firefox
2. Click **Load Temporary Add-on…**
3. Select `extension/manifest.json`
4. Open the sidebar with **Ctrl+Shift+G** (or the toolbar button)

A temporary add-on is removed when Firefox restarts; repeat these steps to load
it again.

### Set an API key

Transcription needs a Groq or OpenAI key — without one, nothing is transcribed.
Open the extension's **Settings** (the button in the sidebar, or Add-ons
Manager → GestureSync AI → Preferences), paste a key and choose ASL or ISL.
Keys are stored in `browser.storage.local` on your machine and are sent only to
the provider you configured.

### Use it

Join a Google Meet call, open the sidebar and press **Start capture**. The
avatar signs the speech as it is transcribed.

### Publishing to addons.mozilla.org

Not submitted yet. Before it can be, it needs at minimum: a real add-on id in
place of `gesturesync-sidebar@REPLACE_ME.example`, an icon set and listing
copy, and a privacy note covering the API key and the audio sent to the
transcription provider. AMO also requires reviewable source for the bundled
`dist/` output.

## Testing

```bash
npm test        # pipeline + timing (no server needed)
npm run test:api   # API integration — needs `npx next dev -p 3111` running
```

The `lib/` layer has no React or three.js imports, so it compiles with `tsc`
and runs in plain Node — no test framework. Covers grammar invariants for both
languages, HamNoSys/SiGML validity, malformed input, plan timing, and pose-solver
numeric safety.

## Documentation

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full pipeline, how ISL
support is implemented, how to add another sign language, and known limitations.

## Acknowledgements

Architecture informed by [Kozha](https://github.com/zhan-a/Kozha) (MIT) for the
HamNoSys → SiGML notation spine, and
[GenASL](https://github.com/sanaro99/GenASL) (GPL-3.0) for prosody-driven,
plan-then-synthesise avatar generation. No code was copied from either project.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · three.js · Whisper
