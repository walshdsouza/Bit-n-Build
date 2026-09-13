import Image from "next/image";

/** The supplied artwork, displayed through a square crop without altering the image. */
export default function BrandLogo({ size = 40, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <span className="relative block shrink-0 overflow-hidden rounded-xl border border-primary/20 bg-[#14232c]" style={{ width: size, height: size }}>
        <Image src="/brand/unmute-logo.jpg" alt={wordmark ? "" : "UNMUTE"} width={1024} height={559} unoptimized className="absolute" style={{ width: "284.45%", maxWidth: "none", height: "auto", left: "-93.06%", top: "-15.28%" }} />
      </span>
      {wordmark && <span className="text-lg font-extrabold tracking-tight text-on-surface sm:text-xl">UNMUTE</span>}
    </span>
  );
}
