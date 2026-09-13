# Privacy information — UNMUTE Firefox extension

Updated 13 September 2026.

## Selected audio

UNMUTE starts capture only after you press **Start**. Choose incoming Google Meet participant audio, your microphone, or both. A microphone source requires browser permission. Video is not recorded.

Complete audio windows are sent through the extension's authenticated background connection to `https://unmute-ai.vercel.app/api/live`. That deployment sends the audio to its configured speech transcription provider, Groq or OpenAI. The response contains English captions and an ASL signing plan. No personal API key is requested by the extension, and deployment credentials are never bundled or shared with the meeting page.

**Stop** releases input and finishes sending audio already captured. **Cancel** discards pending work. Closing a capturing view cancels its session. Minimize and Hide keep capture running while pausing the visible signing playback; reopen the widget to stop it.

## Session data

Audio buffers, captions, and queued signing plans are held in memory for the current view. The extension does not write meeting recordings or transcripts to disk. Its session storage holds a private per-tab messaging token. Old keys or language preferences from previous extension versions are unused.

The extension adds no analytics or telemetry. Audio received by UNMUTE and its transcription provider is subject to the deployment and provider's operational processing and retention. This document does not claim that server or provider logs are absent.

## Permissions

- `activeTab` and `tabs` locate the relevant Google Meet tab.
- `storage` maintains private extension session messaging tokens.
- Google Meet host permission enables the audio bridge and floating widget.
- UNMUTE host permission enables the fixed live transcription endpoint.
- `personalCommunications` declares that user-selected conversation audio is sent for processing.

The avatar model and renderer are bundled locally. No remote executable code is loaded.

Report a problem through the [project repository](https://github.com/walshdsouza/Bit-n-Build).
