# AMO listing copy

Paste-ready text for <https://addons.mozilla.org/developers/>. Fields marked
**[decide]** need a human choice before submission.

---

## Name

```
GestureSync AI — Sign Language Sidebar
```

## Summary (250 char limit)

```
Turns Google Meet speech into a live 3D sign-language avatar in a Firefox
sidebar. Supports American (ASL) and Indian (ISL) Sign Language. Runs locally
with your own transcription API key — no account, no servers.
```

## Description

```
GestureSync AI captions your Google Meet calls with a signing avatar instead of
text. Speech is transcribed, translated into sign-language gloss, and performed
by a 3D avatar in a persistent Firefox sidebar — so it sits beside the call
rather than covering it.

WHAT IT DOES

• Transcribes the audio of the active Meet tab
• Translates it into ASL or ISL gloss, applying each language's own grammar
• Drives a rigged 3D avatar with articulated hands and facial markers
• Runs in a sidebar you can keep open for the whole call

ABOUT INDIAN SIGN LANGUAGE

ISL is not ASL with different vocabulary. It has its own grammar — strict
subject-object-verb order, negation after the verb, question words at the end
of the clause — and a two-handed manual alphabet. The extension implements
these separately rather than relabelling ASL output.

NO SERVER, NO ACCOUNT

Everything runs on your machine. Sign generation — glossing, notation and
motion planning — is entirely local. The only network request is the
transcription call, which goes directly from your browser to Groq or OpenAI
using an API key you provide. The authors receive no data whatsoever.

SETUP

You need a free Groq or OpenAI API key. Open the extension's settings, paste
it, choose ASL or ISL, then press Start capture during a Meet call.

HONEST LIMITATIONS

• Google Meet only
• The sign dictionaries are still small. Words without an entry are
  fingerspelled, which is correct behaviour but slower to read.
• Output is machine translation and has not been validated by Deaf signers or
  qualified interpreters. Treat it as an assistive aid, not a substitute for a
  human interpreter.
```

## Category

`Social & Communication` — secondary: `Accessibility` **[decide]**

## Tags

```
accessibility, sign language, ASL, ISL, google meet, deaf, captions, avatar
```

## Support

- Support site: `https://github.com/walshdsouza/Bit-n-Build`
- Support email: **[decide — a real address is required]**

## Privacy policy

Paste the contents of `store/PRIVACY.md`. A policy is mandatory because the
add-on declares the `personalCommunications` data-collection permission.

## Notes to reviewer

```
The bundled files in dist/ are produced by esbuild from the TypeScript sources
in src/. Build instructions are in store/SOURCE_SUBMISSION.md and source is
attached as required.

The extension calls only api.groq.com and api.openai.com, and only to
transcribe audio the user explicitly captures with their own API key. There is
no backend, no analytics and no remote code execution — the 3D model and all
libraries are bundled in the package.

UNSAFE_VAR_ASSIGNMENT warnings come from the minified React and three.js
builds inside dist/sidebar.js and dist/options.js. They are library internals,
not extension code; the unminified sources are in the attached archive.
```

## Screenshots needed **[decide]**

1. The sidebar open beside a Meet call, avatar mid-sign
2. The settings page showing the API key fields
3. The avatar close up with the gloss readout visible

## Version

Currently `0.1.0` in `manifest.json`. Bump before each submission — AMO rejects
a version number it has already seen.
