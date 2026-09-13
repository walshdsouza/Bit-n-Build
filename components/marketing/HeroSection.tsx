"use client";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

export default function HeroSection({ onTryFree }: { onTryFree?: () => void }) {
  return (
    <section className="flex flex-col items-center text-center pt-space-md pb-space-xl relative">
      {/* Ambient flare - Softened glare */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[720px] h-[280px] bg-primary-container/5 blur-[120px] pointer-events-none rounded-full" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center relative z-10"
      >
        {/* Eyebrow pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-primary/5 shadow-sm backdrop-blur-md mb-space-md border border-primary/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="font-label-eyebrow text-label-eyebrow text-primary uppercase tracking-[0.14em]">
            English speech to ASL
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants}>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-extrabold text-on-surface tracking-tight max-w-4xl mx-auto leading-[1.08] mb-space-md">
            Accessible Video, Powered by{" "}
            <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent drop-shadow-sm">
              AI Sign Translation
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={itemVariants}>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-space-lg leading-relaxed font-medium">
            Turn English speech and captions into an ASL signing plan with a 3D avatar.
            Import media, review the translation at your pace, or share audio from a live meeting tab.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-space-md">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTryFree}
            className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-gradient-to-r from-secondary-container to-primary-container font-label-button text-label-button text-on-primary shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-200 border border-white/10"
          >
            <span>Try For Free</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/player/demo"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container/80 hover:bg-surface-container-high text-on-surface font-label-button text-label-button backdrop-blur-md shadow-sm hover:text-primary transition-all duration-200 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">play_circle</span>
              <span>Watch Demo</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
