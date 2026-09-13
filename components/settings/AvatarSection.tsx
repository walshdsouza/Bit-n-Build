import Link from "next/link";

export default function AvatarSection() {
  return (
    <section id="avatar" className="space-y-6">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Avatar Configuration</h2>
        <p className="text-sm text-on-surface-variant">The player uses the NEXA 3D signing avatar.</p>
      </div>
      <dl className="space-y-4 rounded-xl border border-outline-variant/40 bg-surface-container-low p-4">
        <div><dt className="text-xs text-on-surface-variant">Appearance</dt><dd className="mt-1 text-sm text-on-surface">NEXA 3D</dd></div>
        <div><dt className="text-xs text-on-surface-variant">Signing language</dt><dd className="mt-1 text-sm text-on-surface">Choose ASL or ISL in the player.</dd></div>
        <div><dt className="text-xs text-on-surface-variant">Playback speed</dt><dd className="mt-1 text-sm text-on-surface">Adjust the speed control below the player. Video and signing stay synchronized.</dd></div>
        <div><dt className="text-xs text-on-surface-variant">Camera</dt><dd className="mt-1 text-sm text-on-surface">Drag the avatar to rotate the view.</dd></div>
      </dl>
      <p className="text-sm text-on-surface-variant">Alternate avatar styles and dominant-hand overrides are not available in this version.</p>
      <Link href="/player/demo" className="inline-flex min-h-11 items-center rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-primary">Open demo player</Link>
    </section>
  );
}
