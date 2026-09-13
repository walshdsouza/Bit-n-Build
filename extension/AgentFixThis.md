# UNMUTE — fixes and verification tracker

Updated: 13 September 2026. Website: https://unmute-ai.vercel.app

## Implemented

- [x] Widget and sidebar reuse the website LiveMeeting component: meeting audio, explicit microphone and combined input, input health/level feedback, timestamped captions, active signing, bounded queues, Stop draining, cancellation, hidden playback pause/resume and avatar recovery.
- [x] Remove extension provider-key forms and unsupported language selectors; use hosted ASL transcription without bundled keys. Keep drag, resize, minimize and hide/reopen.
- [x] Replace Firefox cross-realm Blob/container transfer with bounded base64 transport of independent five-second mono 16 kHz PCM WAVs. Runtime ports authenticate capture ownership and release it when a view closes.
- [x] Handle text-model limits with GPT-OSS 120B, GPT-OSS 20B and available Qwen fallback. Preserve Retry-After, cancellation and completed caption work; do not retry exhausted models before reset. Whisper limits are separate.
- [x] Fix timing allocation and catch-up after dense/overlapping captions. Retain source-row identity and expressions during lag; retime older saved plans locally. Show extra signing time in the player.
- [x] Preserve all 826 translated captions and 19,074 signs of the supplied Hindi video. Corrected signing duration: 2,792.759 seconds versus the previous 4,214.256; source: 2,721.599 seconds. Remaining readable tail: 71.16 seconds. This does not establish exact audiovisual or linguistic equivalence.
- [x] Larger video pane, working bottom mute/unmute, blue played timeline, playback rates, native MP4 controls and device media persistence.
- [x] Profile-only website settings, essential Name/Email, solid New Translation button, UNMUTE branding and landing route.
- [x] Fix cloud persistence warnings and cleanup of resources created by failed saves; paginate transcript restoration beyond 1,000 rows.
- [x] Diagnose missing production Supabase media bucket; create it and account-owned upload/read/delete policies in the authenticated project dashboard. Setup SQL: docs/setup-media-storage.sql.
- [x] Package extension 0.3.0 with updated installation, listing and privacy documentation.

## Verification

- Unit suite, production build, TypeScript and lint passed. New targeted coverage includes timing/catch-up, 26 provider checks, 23 continuation checks, 70 live API checks and 38 persistence checks.
- 46 affected website browser cases passed including one isolated retry of a synthetic audio picker startup timeout; native MP4 check also passed.
- Actual Firefox 155 temporary add-on: three capture/runtime tests passed with real synthetic WebRTC, independently decoded WAVs, explicit microphone/mixed input, meter states, Stop drain, cancellation, iframe cleanup and restart. Restricted Meet-origin CSP fixture passed.
- Compiled widget real NEXA GPU checks passed for arm/hand/finger movement, hidden pause/resume, Stop drain and stale-response cancellation. Four runtime authorization/ownership tests and seven overlay/settings checks passed.
- Real provider probes verified Hindi negation and timestamps with 20B and Qwen. The Qwen probe simulated exhausted GPT models, then made a genuine Qwen request.
- Signed-in production synthetic MP4 played, saved on the device, reopened and survived reload. After bucket repair, a fresh production upload created cloud project 222cc4ab-a37b-4d85-accd-0acdd23806e9 and played the Supabase MP4 (readyState 4).

## Remaining external checks

- [ ] A real Google Meet call with another participant and an ASL-fluent review. Synthetic Firefox/WebRTC and motion tests do not certify interpretation accuracy.
- [ ] Mozilla signing for permanent installation. The supplied ZIP can be loaded as a temporary Firefox add-on.
- [ ] Check provider quota before a presentation. Private/restricted/speechless videos cannot be guaranteed to import.

Use My microphone when testing your own voice. In the extension, keep a Meet tab active; the website /live supports microphone use outside Meet.

Keep secrets, ignored logs and the user's presentation out of Git commits. Push verified application changes to main. See docs/TEST_REPORT.md and extension/README.md.
