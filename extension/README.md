# UNMUTE for Google Meet

UNMUTE adds a floating ASL avatar and live captions to Google Meet in Firefox. The original sidebar remains available as an alternative.

## Build and install

Use Node.js 22, then run `npm install` and `npm run build` from this folder. In Firefox, open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select `extension/manifest.json`. Reload any Meet tabs that were open before installation so UNMUTE can observe incoming audio tracks.

Open the extension's **Settings** and enter your Groq or OpenAI transcription key. This standalone extension uses its own settings, separate from the hosted UNMUTE website. Keys remain in extension storage and are sent only to the selected provider.

## Floating widget

1. Join a meeting at `https://meet.google.com/`. The 280 × 320 widget appears at the bottom right.
2. Click **Start** inside the widget. Speech played by other participants becomes English captions and ASL signs after each eight-second recording and provider processing.
3. Drag the top bar to move the widget, or drag its lower-right handle to resize it up to 560 × 600. Focus either handle and use arrow keys for keyboard control; Shift moves in larger steps.
4. Minimize keeps the status bar visible. **Hide** preserves capture and the session; use the **UNMUTE** button to reopen it. **Stop** ends capture and cancels pending transcription.

The widget listens to incoming meeting audio. Your own microphone is not part of this capture. To test alone with your microphone, use the hosted app's Live Meetings microphone mode instead. If Meet replaces the iframe during navigation, the widget returns and releases the old capture; press **Start** again. Hiding or minimizing the widget keeps its iframe session and capture running.

Capture is shared with the existing sidebar: only one view may own it at a time. Stop the sidebar before closing it or starting the widget, and stop the widget before starting the sidebar. Closing a capturing sidebar does not stop its legacy recorder; if that happens, reload Meet to release its capture before switching to the widget. This prevents duplicate recording and duplicate transcription charges. The widget always signs ASL; it uses local gloss rules after speech-to-English transcription.

Audio and signing queues are bounded so a slow provider cannot grow memory indefinitely. When speech gets ahead, the widget catches up to recent speech; it may skip older queued portions. Captions show the last two transcript segments and are retained only for the current widget session. No meeting recording starts until **Start** is pressed.

## Verification

Run `npx tsc --noEmit` and `npm run lint:ext` here. Overlay tests live in `tests/browser/meet-widget.spec.ts`, with runtime/ownership tests in `tests/browser/meet-widget-runtime.spec.ts`, at the repository root. Browser fixtures exercise the real NEXA renderer, drag, resize, minimize, hide/reopen, iframe message validation, and shared capture ownership. These fixtures use a mocked extension runtime; an installed Firefox extension should also be checked in a real call before distribution.
