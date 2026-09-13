# UNMUTE for Google Meet

UNMUTE adds a floating ASL avatar and live captions to Google Meet in Firefox. The widget, Firefox sidebar, and hosted Live Meetings page share their caption queue and avatar playback.

## Build and install

Use Node.js 22. From this folder run `npm ci`, then `npm run build`. In Firefox, open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select `extension/manifest.json`. Reload Meet tabs opened before installation so UNMUTE can observe incoming participant audio.

Transcription is provided by the UNMUTE deployment at `https://unmute-ai.vercel.app`. No personal API key is needed. Keys are never bundled in the extension or exposed to the meeting page.

## Choose the audio to translate

1. Open Google Meet. The 280 × 320 widget appears at the bottom right.
2. Choose **Meeting audio** for other participants, **My microphone** for your own voice, or **Meeting + microphone** for both. Microphone access is requested only when you select a microphone source and press **Start**.
3. Press **Start**. The input meter confirms that audio is arriving. Speech is sent in complete five-second WAV recordings and becomes English captions with ASL signing after processing.
4. **Now signing** follows the sentence the avatar is performing. Expand **Captions** to review the current session's timestamped history.
5. **Stop** releases capture and finishes already captured audio and signs. **Cancel** discards pending work when finishing. A connection, permission, or avatar error gives a recovery message and a fresh **Start again** action.

Meeting audio must contain another participant's voice. To test by speaking yourself, choose **My microphone**. There are no unsupported ASL/BSL/ISL output selectors: the current avatar signs ASL, with English captions for translated speech.

## Move, resize and switch views

Drag the widget's top bar to move it or its lower-right handle to resize it, up to 560 × 600. Focus either handle and use arrow keys for keyboard control; Shift moves in larger steps. The widget stays inside the viewport.

**Minimize** keeps the status bar visible. **Hide** shows a small UNMUTE button to reopen it. Both retain capture and captions while pausing avatar playback; expanding resumes signing from the paused position. Queues are bounded: if speech gets too far ahead, capture stops and the existing queue finishes rather than silently skipping sentences.

The toolbar button or **Ctrl+Shift+G** opens the sidebar with the same source, meter, captions, and avatar controls. Keep a Google Meet tab active when starting from the sidebar, including for microphone-only mode. To use your microphone outside Meet, open the hosted Live Meetings page from extension Settings. Only one view owns meeting capture at a time. Stop the active view before starting another. Closing or replacing a capturing frame releases its capture lease and cancels that view's work; reopening starts a fresh session.

## Privacy and verification

No recording starts before **Start**. Only audio from the selected source is sent to UNMUTE for transcription; video is not recorded. Captions stay in the current view for its session. The extension stores no meeting recordings or transcription API keys.

Run `npx tsc --noEmit`, `npm run build`, and `npm run lint:ext` here. Browser regressions at the repository root exercise the real NEXA renderer, shared live UI, capture ownership, and overlay geometry. Firefox 155 checks temporarily install the add-on and exercise real WebRTC tracks, the audio worklet, extension ports, Stop, cancellation, and view cleanup against a controlled meeting fixture. Provider responses are stubbed. A Google Meet call with real participant speech remains a separate verification; these checks do not certify signing accuracy.
