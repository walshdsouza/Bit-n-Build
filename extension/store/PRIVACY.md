# Privacy Policy — GestureSync AI (Firefox extension)

_Last updated: 13 September 2026_

GestureSync AI turns spoken audio in a Google Meet call into a sign-language
avatar. This policy describes exactly what the extension handles and where it
goes.

## The short version

The extension has no backend. We do not run a server, we receive nothing, and
there is no analytics or telemetry of any kind. The only data that leaves your
machine is the call audio you explicitly capture, and it goes directly to the
transcription provider **you** configured with **your own** API key.

## What is processed

**Call audio.** When you press *Start capture*, the extension records audio from
the active Google Meet tab and sends it, in short chunks, to a speech-to-text
provider so it can be transcribed. Nothing is captured until you press that
button, and it stops when you press *Stop capture* or close the sidebar.

Because that audio is a recording of a conversation, the extension declares the
`personalCommunications` data-collection permission in its manifest, and Firefox
shows you this at install time.

**The resulting transcript.** Held in memory in the sidebar so the avatar can
sign it. It is not written to disk and is discarded when you close the sidebar.

## Where audio is sent

To exactly one of these, whichever you configure in Settings:

| Provider | Endpoint | Their policy |
|---|---|---|
| Groq | `api.groq.com` | <https://groq.com/privacy-policy/> |
| OpenAI | `api.openai.com` | <https://openai.com/policies/privacy-policy> |

Your audio is subject to that provider's privacy policy and retention rules once
it reaches them. We have no control over, and no visibility into, what they do
with it. If you set no key, no audio is sent anywhere and transcription simply
does not run.

## What is stored on your device

Stored with `browser.storage.local`, on your computer only:

- your Groq and/or OpenAI API key
- your chosen target sign language (ASL or ISL)

Your API key is sent only to the provider it belongs to, as the authorisation
header of the transcription request. It is never transmitted anywhere else.
Removing the extension deletes this storage.

## What is never collected

- No browsing history, page content, form data, cookies or credentials
- No identifiers, device fingerprints, analytics or crash reports
- No account — the extension has no sign-in
- Nothing is sent to the extension's authors

## Permissions, and why each is needed

| Permission | Why |
|---|---|
| `activeTab`, `tabs` | Find the Google Meet tab to capture audio from |
| `storage` | Save your API key and language choice on your device |
| `https://meet.google.com/*` | Run the content script that captures tab audio |
| `https://api.groq.com/*`, `https://api.openai.com/*` | Send audio for transcription |

## The avatar

Sign generation runs entirely on your machine. Glossing, notation and motion
planning are local computations, and the 3D model ships inside the extension.
No part of rendering the avatar involves a network request.

## Contact

Report problems via the GitHub repository:
<https://github.com/walshdsouza/Bit-n-Build>
