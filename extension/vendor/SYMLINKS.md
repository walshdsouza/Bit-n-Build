# extension/vendor/SYMLINKS.md

Not yet wired up. Extension code currently imports the shared pipeline directly
via relative paths, e.g.:

    import { transcribeAudioFile } from "../../../lib/whisper";

Once the extension's build is stable, consider replacing that with real
symlinks so extension/ can be zipped/packaged on its own without ../../../
paths reaching outside the folder:

    ln -s ../../lib               extension/vendor/lib
    ln -s ../../components/player extension/vendor/player

Then update tsconfig.json paths (or esbuild aliases) to resolve
"@vendor/lib/*" -> vendor/lib/* instead of the relative chain. Not done yet
because it changes every import statement at once — worth doing after the
capture → transcribe path is proven out, not before.
