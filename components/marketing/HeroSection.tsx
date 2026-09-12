"use client";
import Link from "next/link";

export default function HeroSection({ onTryFree }: { onTryFree?: () => void }) {
  return (
    <section className="flex flex-col items-center text-center pt-space-md pb-space-xl relative">
      {/* Ambient flare */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[720px] h-[280px] bg-primary-container/10 blur-[110px] pointer-events-none rounded-full" />

      {/* Eyebrow pill */}
      <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-primary/10 shadow-sm backdrop-blur-md mb-space-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="font-label-eyebrow text-label-eyebrow text-primary uppercase tracking-[0.14em]">
          Speech to Sign, Instantly
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight max-w-4xl mx-auto leading-[1.08] mb-space-md">
        Accessible Video, Powered by{" "}
        <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
          AI Sign Translation
        </span>
      </h1>

      {/* Subtitle */}
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-space-lg leading-relaxed">
        Transform any spoken audio, recorded video, or live conferencing call into
        real-time, expressive 3D American Sign Language (ASL) avatars via an
        ultra-low-latency LLM semantic glossing and skeletal kinetics pipeline.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-space-md">
        <button
          onClick={onTryFree}
          className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-gradient-to-r from-secondary-container to-primary-container font-label-button text-label-button text-on-primary shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
        >
          <span>Try For Free</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <Link
          href="/player/demo"
          className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container/90 hover:bg-surface-container-high text-on-surface font-label-button text-label-button backdrop-blur-md shadow-md hover:text-primary transition-all duration-200"
        >
          <span className="material-symbols-outlined text-primary text-[20px]">play_circle</span>
          <span>Watch Demo (2 min)</span>
        </Link>
      </div>
    </section>
  );
}
