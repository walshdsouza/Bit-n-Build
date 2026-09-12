# GestureSync AI — Translation Pipeline

How spoken audio becomes a 3D signing avatar, and where Indian Sign Language fits in.

## Pipeline

```
video / audio / YouTube URL
  └─ audio extraction            ffmpeg            lib/ffmpeg.ts
  └─ transcription               Whisper / YT API  lib/whisper.ts, scripts/get_youtube_transcript.py
  └─ prosody + emotion                             lib/prosody.ts
  └─ glossing (per language)     LLM or rules      lib/gloss-engine.ts
  └─ HamNoSys encoding                             lib/hamnosys.ts + lib/dictionaries/
  └─ SiGML serialisation                           lib/sigml.ts
  └─ motion planning                               lib/sign-plan.ts
  └─ pose solving → 3D avatar                      lib/avatar/pose-solver.ts, components/player/SignAvatar.tsx
```

`POST /api/translate` runs everything from prosody onward in one call.

## Design notes

### Why a notation spine instead of video clips

Every sign resolves to **HamNoSys** primitives — handshape, extended-finger
direction, palm orientation, location, movement — rather than to a recorded
clip. Two consequences:

- Adding a sign is adding a dictionary entry, not shooting footage. This is what
  made ISL tractable: there is no large public ISL motion-capture corpus.
- Output is renderer-agnostic. We emit valid **SiGML**, so the same translation
  drives our avatar *or* any CWASA/JASigning player.

### Why prosody matters

Signing driven by words alone is flat. Speech rate, emphasis and affect carry
grammatical weight in sign languages, surfacing as non-manual markers, sign size
and articulation speed. `lib/prosody.ts` derives these from Whisper segment
timing plus lexical cues, and feeds `emphasis` and NMMs into the motion plan.

> Currently estimated from timing + text. `analyzeAudioProsody()` is the hook
> for real acoustic features (F0/RMS); it returns `null` today and callers fall
> back to the estimate.

### Graceful degradation

- **No LLM key** → the deterministic rule-based glosser in `glossByRules()`
  runs instead. Output is still grammatically shaped for the target language.
- **Lemma not in dictionary** → fingerspelled letter by letter rather than
  dropped.
- **No source video** (demo runs, audio-only) → the player runs its own clock
  off the motion plan's duration so the avatar still animates.

## Indian Sign Language support

ISL is **not** ASL with different vocabulary. The pipeline is parameterised by a
`SignLanguageProfile` (`lib/sign-languages.ts`) so each language brings its own
grammar, lexicon and articulation defaults.

| | ASL | ISL |
|---|---|---|
| Word order | Topic-comment | **Strict SOV** |
| Manual alphabet | One-handed | **Two-handed** |
| Question words | Clause-final | Clause-final |
| Negation | Headshake NMM | **Post-verbal particle** |
| Tense | Fronted time marker | Fronted time marker (relied on more heavily) |
| Lexicon | Mostly one-handed | **Mostly two-handed** |

Worked example — the same English through both:

```
"Yesterday I went to school."
  ASL  →  YESTERDAY SCHOOL IX-1 GO
  ISL  →  YESTERDAY IX-1 SCHOOL GO     (SOV: subject, object, verb)

"I do not want pizza."
  ASL  →  PIZZA IX-1 WANT NOT
  ISL  →  IX-1 PIZZA WANT NOT          (negation follows the verb)
```

Fingerspelling differs structurally, not just cosmetically. An out-of-vocabulary
name in ASL is formed one-handed in neutral space; in ISL each letter is formed
**against the non-dominant palm**, which the solver anchors at the `palm_weak`
location and the renderer articulates with both arms.

ISL also carries its own non-manual marker, `head_tilt_affirm` — the side-to-side
assent tilt, which is distinct from the ASL head nod and is rendered as head
*roll* rather than pitch.

### Adding another sign language

1. Add a `SignLanguageProfile` to `lib/sign-languages.ts` (grammar, NMM set,
   fingerspelling handedness).
2. Add a dictionary under `lib/dictionaries/` and register it in that folder's
   `index.ts`.
3. Add the code to `PRODUCTION_READY` once the lexicon is usable.

Nothing in the solver, SiGML writer or renderer needs to change. BSL is wired up
this way already and is awaiting a lexicon.

## The avatar

`components/player/SignAvatar.tsx` builds a procedural humanoid in three.js:
two-bone IK places the hands at the anatomical locations a sign specifies,
fingers articulate from the handshape's curl profile, and the face carries the
non-manual marker.

The rig is procedural **on purpose** — it needs no downloaded character asset,
so the avatar works offline and on first clone. `lib/avatar/pose-solver.ts` is
pure (no three.js imports), so the renderer can be swapped without touching the
motion logic.

## Prior art

The architecture draws on two open-source projects. **No code was copied from
either** — this is an independent implementation, which also keeps us clear of
GenASL's GPL-3.0 copyleft.

- [Kozha](https://github.com/zhan-a/Kozha) (MIT) — the notation spine:
  `text → HamNoSys → SiGML → CWASA avatar`. We adopted this pipeline shape.
- [GenASL](https://github.com/sanaro99/GenASL) (GPL-3.0) — the "plan, then
  synthesise" structure: prosody and emotion as first-class inputs, an LLM
  producing a structured interpretation, and a 3D avatar (VRM/three.js) rather
  than stitched video.

Sign dictionaries here are hand-encoded from published phonological descriptions
(ASL: Stokoe/HamNoSys conventions; ISL: ISLRTC lexicon conventions).

## Known limitations

Worth being honest about for anyone building on this:

- Dictionaries are small (ASL ~49 entries, ISL ~56). Everything else
  fingerspells, which is correct behaviour but slow to watch.
- The rule-based glosser uses a small verb lexicon for SOV reordering; it
  handles simple clauses well and complex/embedded ones poorly. The LLM path is
  considerably better when a key is present.
- Prosody is estimated, not measured (see above).
- Transitions between signs are linear-blended; real signing has coarticulation
  effects this does not model.
- BSL is registered but has no lexicon yet.
