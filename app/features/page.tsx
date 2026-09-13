import Image from "next/image";
import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import dashboardImage from "@/public/features/dashboard.png";
import playerImage from "@/public/features/player.png";
import liveImage from "@/public/features/live.png";

const features = [
  {
    number: "01", tag: "IMPORT", title: "Start with speech or captions.",
    description: "Upload a video or audio file, import an accessible YouTube transcript, or capture audio from a browser tab you choose. Review the source before creating your ASL translation.",
    detail: "YouTube availability depends on the source and provider access. Browser-tab capture gives you another way to import audio that you can play.",
    href: "/dashboard", action: "Create a translation", image: dashboardImage,
    alt: "UNMUTE dashboard with media upload, YouTube URL and browser-tab audio capture controls",
    caption: "The translation dashboard. Choose your source and review it before importing.",
  },
  {
    number: "02", tag: "REVIEW & PLAY", title: "Follow every sign at your pace.",
    description: "Watch the NEXA avatar alongside the source transcript. Pause, scrub the timeline, change playback speed, and inspect or edit the text behind each translated segment.",
    detail: "The current signing experience targets ASL. The generated signing plan can be exported as SiGML for further review.",
    href: "/player/demo", action: "Try the working demo", image: playerImage,
    alt: "UNMUTE translation player showing the NEXA signing avatar, source transcript and playback timeline",
    caption: "The built-in demo, shown in the actual translation player.",
  },
  {
    number: "03", tag: "LIVE MEETINGS", title: "Bring spoken meetings into view.",
    description: "Open a meeting in another browser tab, choose Live Meetings, and explicitly share that tab's audio. Incoming speech is transcribed and translated in short segments with captions and an ASL avatar.",
    detail: "Use a supported desktop browser and enable Share tab audio. You control when sharing starts and stops; transcription needs a configured provider.",
    href: "/live", action: "Open Live Meetings", image: liveImage,
    alt: "UNMUTE Live Meetings workspace with explicit audio-sharing controls and the signing avatar",
    caption: "The Live Meetings workspace, ready for you to choose a tab.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Header />
      <main className="mx-auto max-w-[1280px] px-5 pt-32 pb-20 sm:px-8 lg:px-10">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Inside UNMUTE</p>
          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">From spoken words<br /><span className="text-primary">to visible signs.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">Explore the tools you can use today: import a source, review an ASL translation, and follow shared meeting audio.</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">UNMUTE translates English speech and captions. It does not recognize hand movements in source videos.</p>
        </div>
        <div className="space-y-14 lg:space-y-20">
          {features.map((feature) => (
            <section key={feature.number} className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
              <div className="min-w-0">
                <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest text-primary"><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">{feature.number}</span>{feature.tag}</p>
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-on-surface sm:text-3xl">{feature.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-on-surface-variant sm:text-base">{feature.description}</p>
                <p className="mt-3 text-xs leading-relaxed text-on-surface-variant sm:text-sm">{feature.detail}</p>
                <Link href={feature.href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{feature.action}<span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span></Link>
              </div>
              <figure className="min-w-0 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low shadow-xl shadow-black/20">
                <div className="flex items-center gap-1.5 border-b border-outline-variant/30 px-4 py-3" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-outline/50" /><span className="h-2 w-2 rounded-full bg-outline/30" /><span className="h-2 w-2 rounded-full bg-primary/50" /><span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">UNMUTE / {feature.tag}</span></div>
                <Image src={feature.image} alt={feature.alt} sizes="(min-width: 1024px) 60vw, 100vw" className="block h-auto w-full" />
                <figcaption className="border-t border-outline-variant/30 px-4 py-3 text-xs leading-relaxed text-on-surface-variant">{feature.caption}</figcaption>
              </figure>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
