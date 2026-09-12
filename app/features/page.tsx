"use client";
import { motion, Variants } from "framer-motion";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 20 },
  },
};

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0F] overflow-x-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-container/5 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[300px] bg-secondary-container/5 blur-[120px] pointer-events-none" />

      <Header />

      <main className="max-w-[1280px] mx-auto px-space-lg md:px-margin-md lg:px-margin-lg pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-[3rem] md:text-[4rem] font-extrabold text-on-surface tracking-tight leading-tight mb-4">
            Unleash the Power of <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Generative Sign Language
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto font-medium">
            Discover how our advanced pipeline processes multimodal input into expressive, lifelike ASL in milliseconds.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-32"
        >
          {/* Feature 1 */}
          <motion.section variants={sectionVariants} className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary text-2xl">cloud_download</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Omni-Source Ingestion</h2>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                Whether it's a live video feed, an uploaded file, or a direct microphone stream, our ingestion layer seamlessly normalizes and processes diverse audio formats. Powered by Whisper V3, it captures intent and tone flawlessly.
              </p>
            </div>
            <div className="flex-1 w-full h-[300px] md:h-[400px] rounded-2xl bg-surface-container-low border border-outline-variant/30 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-blueprint opacity-30" />
              <span className="material-symbols-outlined text-outline/30 text-9xl relative z-10">input</span>
            </div>
          </motion.section>

          {/* Feature 2 */}
          <motion.section variants={sectionVariants} className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-2xl">translate</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Zero-Shot LLM Translation</h2>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                Our fine-tuned LLM doesn't just translate words; it understands semantics. It converts complex English sentences into grammatically correct Subject-Object-Verb (SOV) ASL glosses, complete with non-manual markers (NMM).
              </p>
            </div>
            <div className="flex-1 w-full h-[300px] md:h-[400px] rounded-2xl bg-surface-container-low border border-outline-variant/30 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-blueprint-cyan opacity-20" />
              <span className="material-symbols-outlined text-outline/30 text-9xl relative z-10">psychology</span>
            </div>
          </motion.section>

          {/* Feature 3 */}
          <motion.section variants={sectionVariants} className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                <span className="material-symbols-outlined text-tertiary text-2xl">3d_rotation</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Real-Time WebGL Avatar</h2>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                Rendered entirely in the browser using React Three Fiber, our custom 3D avatar executes inverse kinematics (IK) in real-time. This ensures fluid, natural movements without the latency of server-side video rendering.
              </p>
            </div>
            <div className="flex-1 w-full h-[300px] md:h-[400px] rounded-2xl bg-[#0a1a1e] border border-primary/20 relative overflow-hidden flex items-center justify-center shadow-lg">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
              <span className="material-symbols-outlined text-primary/30 text-9xl relative z-10">sign_language</span>
            </div>
          </motion.section>

          {/* Feature 4 */}
          <motion.section variants={sectionVariants} className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center border border-primary-container/40">
                <span className="material-symbols-outlined text-primary-container text-2xl">record_voice_over</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Live Meet Interception</h2>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                Integrate directly into your video conferencing calls. Our virtual audio driver intercepts meeting audio and translates it live, providing an accessible overlay for Deaf and Hard-of-Hearing participants instantly.
              </p>
            </div>
            <div className="flex-1 w-full h-[300px] md:h-[400px] rounded-2xl bg-surface-container-low border border-outline-variant/30 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-blueprint opacity-30" />
              <span className="material-symbols-outlined text-outline/30 text-9xl relative z-10">meeting_room</span>
            </div>
          </motion.section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
