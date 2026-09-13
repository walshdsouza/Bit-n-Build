# UNMUTE Firefox listing draft

## Name

UNMUTE — Live Sign Language for Meet

## Summary

Live English captions and an ASL avatar for Google Meet, with a movable widget or Firefox sidebar. Choose participant audio, your microphone, or both. Transcription is provided by UNMUTE; no personal API key is needed.

## Description

UNMUTE makes meeting speech visible through English captions and an animated ASL avatar. Its compact Google Meet widget can be moved, resized, minimized, and reopened. The Firefox sidebar provides the same audio-source controls, input meter, caption history, and avatar playback.

Press Start after choosing Meeting audio, My microphone, or Meeting + microphone. Speech is processed in five-second windows. Stop releases capture and finishes queued audio and signs. Caption history remains available for the current view's session.

The output is ASL; BSL and ISL are not offered in this version. Machine-generated signs and fingerspelling remain subject to vocabulary and interpretation limitations. Language accuracy requires review by fluent signers.

## Setup and data

Read README.md for temporary installation and store/PRIVACY.md for audio processing. Audio is sent to the fixed UNMUTE deployment, which calls its configured transcription provider. The extension does not ask for or bundle provider keys. No remote executable code is loaded.

## Submission checklist

- Use version 0.3.0 from manifest.json.
- Attach the source archive and store/SOURCE_SUBMISSION.md build instructions.
- Provide screenshots of the widget, audio-source controls, caption history, and sidebar.
- Complete an installed Firefox and real Meet verification before distribution; controlled fixtures do not establish this result.
- Configure a valid maintainer contact in the store submission.

Support: https://github.com/walshdsouza/Bit-n-Build
