# UNMUTE release test report

Tested on 13 September 2026 (Asia/Kolkata).

Public application: https://unmute-ai.vercel.app
Vercel project: `unmute` (same project ID and production credentials as the original deployment).
The requested `unmute.vercel.app` alias was already taken; `unmute-ai.vercel.app` was successfully assigned.

## Player, Hindi import, Settings and Meet widget update

This update supersedes the earlier notes about removing mute controls, personal website API keys, and rejecting non-English transcripts.

- The source video uses more of its pane. A blue played track, bottom Mute/Unmute button and native MP4 controls share state with the avatar timeline. Native MP4 play, pause, seeking, arbitrary supported speed and mute were exercised with an actual H.264/AAC file in Edge. YouTube command delays and rapid mute reversals have controlled browser coverage.
- Settings has one Profile section with Name and Email. API-key views, redundant sections and website key forwarding were removed. The New Translation header action uses a solid background and ordinary hover/focus states.
- The exact Hindi source `OIipC9LicMU` returned 826 timed captions from Supadata. All 826 were translated to English using real Groq requests with original timestamps retained. Quota delays and incomplete model responses were encountered and recovered through saved, signed continuations and a bounded Groq model fallback. A separate forced Supadata generation request on a short public video passed, verifying the audio-generation path in addition to caption retrieval.
- Those 826 English captions generated 826 gloss rows and 19,074 finite, positively timed signs locally. Dense speech and fingerspelling extend the signing plan to approximately 70 minutes for this 45-minute source. This is evidence of successful ingestion and plan generation, not a claim of exact full-video sign/audio synchronization or certified linguistic accuracy.
- Translation continuation tests cover progress reuse, expiry, tampering, video identity, empty signing keys, cancellation and provider backoff. Longer quota delays preserve progress and tell the user when to retry instead of repeatedly polling the provider.
- The Firefox extension now includes an in-page Meet widget with NEXA, recent captions, drag/resize, minimize and hide/reopen. The widget and sidebar share one existing recorder. It captures incoming participant audio, not the user's microphone. Website credentials are not bundled into the extension.

The production Next.js build and full ESLint check passed. The complete unit suite passed, including 46 text-translation and 21 continuation assertions. All 37 affected Edge browser cases passed: player controls, actual MP4 playback, native-media clocks, saved tracks, YouTube jobs, Settings/branding, import recovery and upload handoff. Small 320/375 px layouts allow normal vertical scrolling without clipping the avatar or overflowing horizontally. Browser media tests use an explicit rule-engine fixture to avoid consuming production Groq quota; provider transcription itself is validated separately with real requests. A real signed-in Supabase account and an actual Firefox Google Meet call were not exercised in this update.

## Changes verified locally

- Playback speeds 0.5×, 1×, 1.5× and 2× change actual native-media elapsed time and keep the avatar playhead synchronized. The media-free avatar clock also advances at 2×. Unsupported YouTube rates report the actual rate instead of leaving a false selection.
- Removed the nonfunctional volume controls and target-language dropdown. The web experience uses ASL; spoken language cannot uniquely identify a desired sign language.
- Save atomically persists the transcript, edited text, signing plan, source media Blob, playback position and speed in IndexedDB. Saved tracks survive session loss and reload, reopen from dashboard history, and update without duplicates. Errors do not claim a successful save.
- Live Meetings is available at `/live` from desktop/mobile navigation. Explicit tab sharing produces independent five-second mono PCM WAV files, sends one transcription request at a time, and displays captions and ASL animation. Stop flushes the final audio and releases shared tracks; errors, navigation and late picker responses also release tracks.
- The supplied logo is reused byte-for-byte through a shared visual crop, including header, footer, sidebar, authentication dialog and favicon. Features and landing cards show fresh screenshots of the actual application.
- Settings contains Profile and working personal API-key fields. Unsupported marketing numbers and a fake upload interface were removed.
- `/` remains the landing page, including in middleware's authenticated flow.
- Hosted YouTube ingestion supports Supadata captions/generated transcription, signed asynchronous continuation tokens, retry/resume, cancellation, and distinct configuration/quota/unavailable-video errors. Timestamp conversion and provider response validation have deterministic contract coverage.
- AI gloss output that drops explicit negative or time words falls back to the rule engine; profile time markers are fronted. Injected regressions and actual Groq calls confirmed the negative particle and headshake remain present.

## Automated validation

- Production Next.js build and TypeScript pass; ESLint passes without errors or warnings.
- Core tests: 72 pipeline, 118 regression, 29 media, 28 downloader and 42 hosted-YouTube contract assertions, plus timing, motion and live audio suites.
- Motion checks cover 9,790 dictionary poses and the shipped NEXA model: numeric safety, continuous transitions, anatomical elbows, wrist/finger orientation, repeated strokes, stable orbiting and deterministic seek/pause.
- All 48 browser tests passed against the local production build in 3.3 minutes. Coverage includes desktop/mobile branding, Settings, ingestion recovery, async YouTube jobs, upload handoff, media clocks, all four speeds, saved-track restoration and errors, tab capture and live meeting lifecycle.
- All 48 browser tests also passed against the public UNMUTE deployment in 4.4 minutes after its production domain was registered.
- All 83 deterministic HTTP API assertions passed with external keys disabled. A separate keyed API run exposed the AI negative/time-word issue; focused fixes and live provider checks then passed. Exact output determinism is tested with the rule engine rather than assumed for a remote model.
- Earlier Firefox extension TypeScript/build and Mozilla validation passed (0 errors, 4 bundled-library warnings). The new `/live` web flow does not require that extension.

## Actual service and browser checks

An isolated browser tab played a generated speech fixture: “Hello my friend. Today we are learning sign language. Thank you for helping me.” Native Edge tab sharing, the AudioWorklet, two independent WAV requests, real Groq transcription, and ASL plans all worked twice locally, including after final lifecycle guards. The exact speech appeared in captions, with no browser page errors. No meeting participants or user tabs were recorded.

The existing upload and dashboard capture pipelines were previously verified on Vercel with this real speech fixture. A silent WAV and the user's signing-only source audio returned `NO_SPEECH`, rather than fabricated successful transcripts. The configured Groq key is stored in ignored local configuration and encrypted Vercel production settings; no secret values are included here.

Full validation deployment: `dpl_AHXc3vjNYM2gSHJTnd133Ki8WmA7`. The new alias is registered as a production project domain. Initial verification exposed a Vercel login redirect before this registration; fresh unauthenticated checks now return the landing page and model correctly. Both native browser capture workflows were repeated successfully on `https://unmute-ai.vercel.app`: Live Meetings returned two real Groq results and ASL plans; dashboard capture returned the exact complete speech through FFmpeg, Groq and the player. The real YouTube URL probe returns `422 YOUTUBE_NOT_CONFIGURED` with an accurate Supadata setup message.

Final layout follow-up: `dpl_FjxWgbL4xWrgQgtKYFvm8a2MnJKa`, automatically aliased to `unmute-ai.vercel.app`. Saved tracks now occupy the upper dashboard sidebar instead of the unused usage report. Status text no longer hides titles on narrow screens, and the import header wraps correctly. Fresh feature artwork reflects the actual dashboard. Six affected browser checks passed against this deployment; 320/390 px visual checks confirm readable saved titles and no header overlap. API and avatar code are unchanged from the full production test run.

The user's exact follow-up URL `FuqNluMTIR8` also succeeded locally in 1.4 seconds with 46 genuine English caption segments and 256.2 seconds duration. It is a narrated, accessible video. Its earlier cloud failure was missing hosted transcript configuration, not absent speech/captions. Evidence: `logs/exact-FuqNluMTIR8-local.json`.

## Supadata activation and final YouTube verification

Current deployment: `dpl_5jEjgpbJuGozWTAaMoU8eWY4gfYY`, at `https://unmute-ai.vercel.app`. The supplied Supadata credential was installed as a Vercel production Secret and in ignored local configuration, then redeployed. No personal browser key was present during the live UI test.

- The exact `FuqNluMTIR8` URL passed the complete production flow: dashboard URL submission → real Supadata result → 46 timed segments → ASL avatar/player → Save. The actual YouTube video element reported playbackRate 2 and time 7.24 seconds while the app playhead read 7 seconds. No browser page errors occurred. Evidence: `logs/youtube-working-production.json` and `logs/youtube-working-production.png`.
- An independent official API request using `mode=generate` on the short public `jNQXAC9IVRw` video returned HTTP 200 with four timed English speech segments in 61 seconds. This validates audio generation as well as existing-caption retrieval. It was a synchronous response; asynchronous behavior is covered by provider and browser contract tests, not claimed as a live async-job test.
- Updated the provider's initial timeout to 130 seconds (within the app route's 180-second budget), while polls remain bounded to 25 seconds. Correctly handles documented HTTP 206 errors, plan/quota/access errors, both completed-job response shapes, and explicit non-English transcript responses.
- The full unit suite, 42 provider assertions, TypeScript, targeted lint and production build passed. All eight affected browser recovery/job tests passed against the configured production deployment.

## Demo video

`logs/unmute-demo.mp4` is a captioned, silent recording of the layout release: 40.64 seconds, 1440×810, H.264 at 25 fps, 3.17 MB. The encoded playback and saved-history frames were visually inspected. It shows the landing page, actual ASL avatar playback, speed controls, transcript editing, a device save and dashboard history, then Live Meetings discovery. It predates Supadata activation and does not show YouTube import. `scripts/record-demo.mjs` and `scripts/finalize-demo.mjs` reproduce the capture and encoding.

## Limitations and required configuration

- Supadata is now configured and real YouTube caption/audio-generation requests have passed. Provider quotas and plan limits still apply. Private/unavailable videos and sources without usable English speech/captions cannot be guaranteed; explicit non-English transcript results are rejected because the web ASL pipeline currently expects English input. Browser-tab capture remains available as an alternate source path.
- Uploaded files are limited to 4 MB on Vercel; dashboard recording stops at ten minutes or below 3.8 MB. This app converts speech/captions into signing; it does not recognize hand movements in videos.
- Device saves belong to this browser and origin. Clearing browser data removes them; they are not cross-device account synchronization.
- Meeting-tab capture requires desktop Chrome/Edge with Share tab audio. The current release also supports explicitly selected microphone-only and combined input, as verified in the live microphone section below. Five-second capture windows and transcription/signing add delay. Backlog limits stop sharing while queued results finish.
- Sign-up email delivery, Google OAuth configuration and account-owned persistence were not tested with a real signed-in user. App project reads are scoped to the signed-in owner. Supabase account storage requires the project's schema, authentication redirects and access policies to be configured separately.
- Software and motion checks do not certify the linguistic accuracy of every generated sign. The current ASL dictionary/rules coverage limits interpretation quality.

## Reproduce

```sh
npm test
npm run lint
npm run build
# Start the server separately, then:
API_BASE_URL=http://localhost:3113 npm run test:api
PLAYWRIGHT_BASE_URL=http://localhost:3112 PLAYWRIGHT_CHANNEL=msedge UI_TEST_SERVER_PROVIDER=groq npm run test:browser
# Record the actual UI and encode a captioned MP4 (requires FFmpeg):
PLAYWRIGHT_BASE_URL=https://unmute-ai.vercel.app node scripts/record-demo.mjs
node scripts/finalize-demo.mjs
```

In PowerShell set `$env:NAME='value'` before each command. Generated speech fixtures, native-capture helpers and raw evidence under `logs/` are local QA artifacts and are not distributed in the repository. The committed browser tests provide reproducible controlled-input checks. Deployments use the authenticated Vercel CLI.
## Live microphone and playback repair — 13 September 2026

Deployment: `dpl_DMYbDzrPDhyisT4nXR7xijKdbaWV`, at https://unmute-ai.vercel.app/live.

The reported silent-avatar case was traced to input selection: the user was speaking into their own microphone, while the previous Live Meetings implementation captured only audio played by a shared browser tab. Production transcription itself responded to a real speech fixture in 2.72 seconds.

The repair adds explicit Meeting tab, My microphone, and optional combined capture. Microphone access is requested only after selecting it and pressing Start. Input level, silence, mute and paused-recorder feedback distinguish missing audio from transcription delay. The UI no longer exposes pending chunk counts. Live provider calls have a 20-second deadline and upstream cancellation; the client bounds the complete response wait to 25 seconds and offers a visible retry.

Playback waits for the NEXA model to load and preserves its elapsed signing position while the page is hidden. Failed model loads release capture and can be retried with a fresh avatar instance. Caption-only grammar results (such as a standalone conjunction) do not stop the conversation. Capture startup, permission failures, late picker results, suspension and Stop release all owned streams; ordinary Stop preserves the final partial audio segment.

Validation completed before deployment: the complete unit suite, including 48 live-server assertions, TypeScript, ESLint and the production build. Browser coverage includes 13 live-flow cases, 11 capture cases, 3 GPU bone-motion cases and 2 recovery cases. Desktop, 390 px and 320 px layouts have no horizontal overflow.

Real production checks used generated speech, never a user's actual microphone or meeting participants:

- Browser getUserMedia with a synthetic WAV input → real Groq → timed captions → ASL plans succeeded twice, without browser errors. Evidence: `logs/live-microphone-production.json` and `.png`.
- Native Edge browser-tab sharing → AudioWorklet → independent WAVs → real Groq produced the complete fixture transcript and signing plans, without browser errors. Evidence: `logs/live-meeting-result.json` and `logs/live-meeting-speech.png`.
- Rig tests inspect the GPU bone matrices for the arm, hand and fingers, rather than treating a visible canvas or caption as proof of signing.

This section supersedes the earlier tab-only microphone limitation. Meeting-tab capture still requires a supported browser and Share tab audio; microphone-only mode does not need a meeting tab. Five-second input windows and transcription add delay, and provider/sign-vocabulary limits still apply.

Final production browser result: all 18 unique live UI/playback cases pass on the deployed release (13 flow, 2 recovery, 3 GPU-motion cases). The first production pass exposed two test timing assumptions under concurrent browser/GPU load: a fixed sample collected only 14 frames, and a fixed pause delay sampled the final settling frame. The motion tests now use bounded polling for actual frames, substantive articulation and settled repeated bone palettes. The focused production rerun passed all three cases in 52.9 seconds with unchanged movement/freeze thresholds; no application changes were needed after deployment. Results: `logs/live-production-results` and `logs/live-avatar-production-final`.
