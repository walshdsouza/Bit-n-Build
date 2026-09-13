# UNMUTE — fixes and verification tracker

Updated: 13 September 2026.

This file tracks the website and standalone Firefox extension. Checked items are implemented; open items identify a known limitation, a verification gap, or a release step.

## Feature baseline: deployed Live Meetings

The floating widget and extension should match the useful behavior of [deployed Live Meetings](https://unmute-ai.vercel.app/live), adapted to a compact overlay. The deployed page was inspected on 13 September 2026, including Meeting tab, My microphone and combined-input controls. These are required parity tasks for the next implementation; the current widget is not yet feature-equivalent.

| Feature | Deployed `/live` | Current widget | Required work |
| --- | --- | --- | --- |
| Audio source selection | Meeting tab, My microphone, optional combined input | Incoming Meet participants only | Add explicit microphone-only and combined modes with clear consent and one shared capture graph. |
| User credentials | Server-configured transcription; no user key form | Standalone provider key required | Provide a hosted mode through a trusted backend; never bundle deployment keys into the extension. Document any retained standalone mode. |
| Input feedback | Audio level meter; receiving, silent, muted, suspended and stalled states | Basic listening/error status | Add equivalent input health feedback and source-specific guidance. |
| Capture cadence | Independent five-second audio windows | Independent eight-second recordings | Match the five-second cadence where supported and verify each recording remains independently playable. |
| Caption context | Timestamped recent log plus separate Now signing text | Last two transcript segments | Add an expandable caption history and associate the visible active caption with its queued signing plan. |
| Stop behavior | Releases input, flushes final audio, finishes queued captions/signs | Cancels transcription and clears pending queues | Preserve final speech on ordinary Stop; keep immediate cancellation for teardown, explicit cancel and unrecoverable failure. |
| Hidden playback | Signing pauses and resumes from the same position | Signing time continues while minimized/hidden | Preserve signing position when hidden and resume deliberately, with bounded backlog. Capture may continue until Stop. |
| Slow processing | Stops sharing on excessive backlog and explains why; queued work finishes | Discards older queued audio/plans to catch up | Match the explicit stop-and-finish behavior so speech is not silently skipped. |
| Avatar failure | Releases capture and offers a fresh avatar on Start again | Shows error while caption capture can continue | Add complete recovery, cleanup and a reliable retry path. |
| Branding and language | UNMUTE, ASL only in user flow | Widget is UNMUTE/ASL; legacy sidebar still says GestureSync AI and exposes ASL/ISL | Rename legacy extension views and remove unsupported target choices from the ordinary flow. |
| Session ownership | Navigation/errors release owned input | Widget cleanup exists; legacy sidebar has no unmount cleanup | Release sidebar ownership on close, or provide an explicit authenticated recovery action. Closing an active sidebar currently leaves the widget locked until Stop in the sidebar or a Meet reload. |

- [ ] Implement the parity gaps above; keep drag, resize, minimize and hide/reopen as overlay-specific features.
- [ ] Reuse shared behavior where practical without introducing a second recorder. The earlier additive-only widget scope did not include these legacy sidebar/pipeline changes; they are now listed explicitly for the parity follow-up.
- [ ] Verify microphone-only, meeting-only and combined modes with synthetic speech, then a real Firefox/Meet call. Check actual arm/hand/finger motion, caption alignment, silence, denied permission, retry, Stop, hidden playback and cleanup.

Reference implementation: `components/live/LiveMeeting.tsx`, `components/live/capture.ts`, `components/live/chunk-queue.ts`, `lib/live-api.ts`. Read-only deployed UI evidence: `logs/deployed-live-parity.json` and `.png` (local, ignored). Do not request microphone permission just to inspect the page.

## Required follow-up

### Firefox audio and Groq fallback reports from GitHub

These requests were added on GitHub in commit `6b09b8a` and are retained here after merging that update.

- [ ] **Diagnose unreadable Firefox WebRTC audio.** The reported final audio Blob is not producing legible speech. Reproduce it with the installed extension and a real incoming Meet audio track. Inspect request byte size, MIME type, duration, audio track count, sample rate/channels and independent container decodability before sending it to Whisper. Check that the AudioContext is running, real participant tracks are connected and recorder stop/flush yields a complete file. A non-empty Blob alone is not proof of audible speech. Avoid logging keys or private meeting audio.
- [ ] **Handle Groq model limits after the 20B model is exhausted.** Identify the exact failing endpoint/model from a redacted response. Chat/gloss model limits and Whisper speech-model limits are separate. Add an available, validated fallback appropriate to that operation, with bounded retries, cancellation and a clear retry delay when no model is available. Verify 429 responses and reset timing without switching back to an already exhausted model.

Current coverage does not close either report: real-recorder tests passed in Edge, not Firefox/Meet, and the website's text-translation fallback currently moves from `gpt-oss-120b` to `gpt-oss-20b`. It does not provide another model after 20B's quota is exhausted. The standalone widget uses Whisper for speech and local rules for glossing, so do not treat a chat-model fallback as a repair for an unreadable audio Blob.

### 1. Improve long-video signing alignment — known limitation

- [ ] Review the supplied Hindi video https://youtu.be/OIipC9LicMU at the beginning, middle and end, including seeking and replay.
- [ ] Improve phrase planning and vocabulary coverage so dense speech does not accumulate excessive signing delay. Make any extra signing time clear to the user.
- [ ] Have an ASL-fluent reviewer check meaning, negation, names and fingerspelling. Motion tests do not establish linguistic accuracy.

Evidence: all 826 captions of the 45-minute source translated with their original timestamps preserved, but its 19,074-sign plan lasts about 70 minutes. Do not describe this as exact full-video sign/audio synchronization.

Relevant files: `lib/sign-plan.ts`, `lib/gloss-engine.ts`, `lib/transcript-translation.ts`, `components/player/SplitViewport.tsx`.

### 2. Verify the installed widget in Firefox and a real Meet call — verification gap

- [ ] Load the built add-on in Firefox, reload Meet before joining, and start the widget while another participant speaks.
- [ ] Confirm participant speech produces captions and visible arm, hand and finger articulation.
- [ ] Exercise Stop/Start, sidebar/widget ownership changes, minimize, hide/reopen, resizing and room navigation. Confirm stopped or removed frames do not leave recording active.
- [ ] Check permission denial and a suspended audio context in an actual Firefox installation.

Controlled browser fixtures verify the overlay and capture routing, but do not replace a real Firefox/Meet check. The current widget captures **incoming participant audio only**. Until the explicit source-selection parity work above is implemented, use the website's **My microphone** or combined input modes for your own voice. Microphone capture must always be explicitly selected and permitted.

### 3. Verify signed-in upload persistence — verification gap

- [ ] With a real Supabase test account, upload an MP4, play it, save, reload and reopen it from Recent Translations.
- [ ] Confirm storage failure still permits playback from the matching session's local file, without substituting another project's source.
- [ ] Verify database/storage policies and account-owned reads against the configured schema.

Guest MP4 playback and device saves pass browser checks. Real signed-in account storage was not exercised in this update. Relevant files: `app/api/process-video/route.ts`, `app/(app)/player/[id]/page.tsx`, `lib/local-projects.ts`.

### 4. Finish Firefox distribution — release step

- [ ] Test the final ZIP in Firefox, then submit it for Mozilla signing if permanent installation is required.
- [ ] Update store screenshots/descriptions to show UNMUTE and the floating widget; verify the stated data collection matches capture behavior.

The manifest already has a real Gecko ID, `{6ed1217e-a95c-4c32-ae05-2f7bfc2cf119}`. The former `REPLACE_ME` note was stale. Temporary add-ons must be loaded again after Firefox restarts.

### 5. Check provider capacity before a long-video demo — operational check

- [ ] Check Supadata/Groq account capacity and run one fresh long-video import before the presentation.

The real Hindi verification encountered Groq quota limits. Model fallback, signed continuation, cancellation and a clear retry delay are implemented; completed work is retained for up to one hour. Private, restricted or speechless videos still cannot be guaranteed to import.

## Implemented in this update

- [x] Give source video more of the Translation Player pane.
- [x] Add bottom Mute/Unmute and a blue played portion of the timeline.
- [x] Support native MP4 play, pause, seek, speed and volume controls, synchronized with the app's playback state.
- [x] Preserve the matching upload's local preview when optional cloud media storage fails.
- [x] Remove the website's API Keys tab/view, obsolete settings sections and browser key forwarding.
- [x] Keep Profile with essential Name and Email and the existing sign-in path.
- [x] Restyle New Translation with a solid background and ordinary hover/focus states.
- [x] Translate Hindi captions into English before ASL planning, preserving caption IDs and original timing.
- [x] Use Whisper speech-to-English translation for recorded/live audio.
- [x] Add bounded model fallback and resumable YouTube jobs that preserve progress through quota delays.
- [x] Add a draggable/resizable NEXA widget inside Meet, with recent captions, Start/Stop, minimize and hide/reopen.
- [x] Share one existing audio recorder between widget and sidebar and prevent duplicate capture ownership.
- [x] Authorize capture through extension runtime, validate private iframe handshakes, discard stale sessions and release capture during teardown.
- [x] Resume suspended audio or show a startup failure instead of a false live state.

## Verification recorded

- Full unit suite passed, including 46 caption-translation and 21 continuation assertions.
- Next.js production build, TypeScript and ESLint passed.
- All 37 affected local Edge browser cases and all 20 focused production browser cases passed.
- Twelve relevant extension checks passed: five overlay/actual NEXA iframe cases, four capture-ownership/security cases, two independent-recorder regressions and one compiled-widget speech-to-signing case. The latter measures actual GPU arm/hand/finger motion and verifies Stop cancellation. These use controlled fixtures, not a real Meet call.
- Real services translated all 826 captions of the supplied Hindi video. A separate forced Supadata audio-generation request also passed.
- The production API accepted the completed genuine 826-caption continuation, preserved timing/text, rejected tampered/wrong-video tokens, and returned quota delay without another provider call. This was a continuation integration probe, not a second fresh import.
- A real synthetic speech fixture passed the production Live Meetings API through Groq and generated an ASL plan.

Website: https://unmute-ai.vercel.app

Website release commit: `320ddab`. Deployment: `dpl_25sSN3vWqybTD9SDaWZJEE9vdAhT`.

See `docs/TEST_REPORT.md` for release evidence, `README.md` for website setup, and `extension/README.md` for widget installation. Generated QA artifacts remain under ignored `logs/`. Never place provider keys in this tracker or committed files.

## Checks before the next push

From the repository root, run `npm test`, `npm run lint` and `npm run build`. Browser checks require a running server on port 3111 or `PLAYWRIGHT_BASE_URL` set to the intended deployment. Use installed Edge with `PLAYWRIGHT_CHANNEL=msedge`; set `UI_TEST_RULE_GLOSS=1` for controlled UI tests without billed AI gloss calls. Provider-specific behavior needs separate service checks.

From `extension/`, run `npx tsc --noEmit`, `npm run build`, `npm run lint:ext` and `npm run package`.

Keep generated `dist/` assets consistent with source, review the diff for secrets and unrelated files, then commit and push the verified changes to GitHub `main`. Keep the user's untracked presentation out of application commits.
