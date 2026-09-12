# Agent task list

Add items here and they get picked up on the next pull.

## Requested

- [x] Add instructions to README.md on how to build and run the extension
      (mention it's Firefox only, and standalone)
- [x] Fix Options tab and add a method to add API keys
- [x] Ensure the avatar is loading and working

## What was wrong

**Options tab.** Two separate faults, both of which had to go:
- `esbuild.config.mjs` copied `options.html` to `dist/` but not `options.css`,
  so the settings page loaded with no stylesheet at all.
- `options.css` began `ody {` — the leading `b` was missing, so the `body`
  rule would not have applied even once the file was copied.

The key fields themselves were already there and work; they just looked broken.
Added a **Settings** button in the sidebar so the page is reachable without
going through the Add-ons Manager, and a warning when no key is set.

**Missing host permissions.** The manifest requested `http://localhost:3000/*`
but never `api.groq.com` or `api.openai.com` — the two hosts the extension
actually calls. Transcription would have been blocked. Swapped the stale
localhost entry for the two real ones.

**Committed `node_modules`.** 273 files were tracked, including a Linux-only
esbuild binary, so `npm run build` failed outright on Windows with "You
installed esbuild for another platform". Untracked it and added a `.gitignore`;
`npm install` now gives everyone a working binary for their own platform.

## Avatar

The sidebar now renders the NEXA avatar and signs the live transcript. Nothing
calls a server: Whisper is invoked directly with the user's key, and glossing,
HamNoSys, SiGML and motion planning are pure functions from `lib/`, so the
standalone property holds.

- `nexa.glb` is copied into `dist/` at build time and loaded through
  `browser.runtime.getURL` — there is no server to serve it from.
- Bundle is ~950 KB plus the 3.3 MB model.

## Still open

- The add-on id is still `gesturesync-sidebar@REPLACE_ME.example`. AMO needs a
  real one before submission — see the publishing note in the root README.
- Audio capture has not been tested against a live Meet call from here; the
  avatar and gloss pipeline were verified, the `tabs.sendMessage` capture path
  was not.
