# Source code submission

Use Node.js 22 and npm. From the source repository:

```sh
cd extension
npm ci
npm run build
```

The build bundles seven entries: background, meet-bridge, meet-widget, page-hook, widget, sidebar, and options. HTML/CSS shells, the NEXA model, and the audio worklet are copied into `dist/`.

The extension imports shared code from `../components/live`, `../components/player`, and `../lib`. These directories, the model in `../public/models`, and `../public/live-audio-worklet.js` must be retained in the source tree. Dependencies resolve from `extension/node_modules` through the build aliases.

React, React DOM, three.js, and lucide-react are unmodified npm dependencies bundled locally. No remote code is loaded. The model's license is included at `public/models/NEXA-LICENSE.txt`.

The extension sends explicitly selected audio to the fixed UNMUTE `/api/live` endpoint through its authenticated background bridge. API keys belong to the deployment and are never included in the extension. Google Meet permission is used for audio capture and the widget.

See `README.md` for installation, source selection, capture lifecycle, and verification limits. `npm run lint:ext` reports the current Mozilla validation result; warnings in bundled dependencies should be reviewed separately from application code.
