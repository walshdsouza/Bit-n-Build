import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-5 px-6 text-center lg:flex-row lg:text-left">
        <Link href="/" aria-label="UNMUTE home"><BrandLogo size={36} /></Link>
        <p className="text-xs leading-relaxed text-on-surface-variant">© 2026 UNMUTE. Speech and captions to ASL.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-2 text-sm text-on-surface-variant">
          <Link href="/features" className="min-h-11 px-3 py-3 hover:text-primary">Features</Link>
          <Link href="/live" className="min-h-11 px-3 py-3 hover:text-primary">Live Meetings</Link>
          <Link href="/dashboard" className="min-h-11 px-3 py-3 hover:text-primary">Open app</Link>
        </nav>
      </div>
    </footer>
  );
}
