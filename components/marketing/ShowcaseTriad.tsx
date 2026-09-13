import Image from "next/image";
import Link from "next/link";
import dashboardImage from "@/public/features/dashboard.png";
import playerImage from "@/public/features/player.png";
import liveImage from "@/public/features/live.png";

const cards = [
  { href: "/dashboard", title: "Import your source", label: "01 · IMPORT", image: dashboardImage, alt: "The UNMUTE media import dashboard", copy: "Upload media, try a YouTube link, or capture audio from a browser tab. Review the source before translating.", action: "Create a translation" },
  { href: "/player/demo", title: "See the avatar in action", label: "02 · TRANSLATE", image: playerImage, alt: "The NEXA avatar in the working UNMUTE player", copy: "Explore the ASL demo with source captions, adjustable playback and a signing plan you can inspect.", action: "Play the demo" },
  { href: "/live", title: "Follow a live meeting", label: "03 · LIVE", image: liveImage, alt: "UNMUTE Live Meetings workspace", copy: "Choose a meeting tab and share its audio for captions and ASL playback. Start and stop sharing yourself.", action: "Open Live Meetings" },
];

export default function ShowcaseTriad() {
  return (
    <section aria-label="Explore UNMUTE" className="pb-12">
      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card) => <article key={card.href} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low">
          <Image src={card.image} alt={card.alt} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[16/10] h-auto w-full border-b border-outline-variant/30 object-cover object-top" />
          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs font-semibold tracking-widest text-primary">{card.label}</p>
            <h2 className="mt-3 text-xl font-bold text-on-surface">{card.title}</h2>
            <p className="mt-3 mb-5 text-sm leading-relaxed text-on-surface-variant">{card.copy}</p>
            <Link href={card.href} className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">{card.action}<span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span></Link>
          </div>
        </article>)}
      </div>
    </section>
  );
}
