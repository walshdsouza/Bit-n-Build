"use client";
import { useState } from "react";
import Header from "@/components/marketing/Header";
import HeroSection from "@/components/marketing/HeroSection";
import ShowcaseTriad from "@/components/marketing/ShowcaseTriad";
import TrustMetrics from "@/components/marketing/TrustMetrics";
import Footer from "@/components/marketing/Footer";
import AuthModal from "@/components/auth/AuthModal";

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] overflow-x-hidden">
      {/* Full-page ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-container/5 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[300px] bg-secondary-container/5 blur-[120px] pointer-events-none" />

      <Header />

      <main className="max-w-[1280px] mx-auto px-space-lg md:px-margin-md lg:px-margin-lg pt-28 md:pt-32">
        <HeroSection onTryFree={() => { setAuthMode("signup"); setShowAuth(true); }} />
        <ShowcaseTriad />
        <TrustMetrics />
      </main>

      <Footer />

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  );
}
