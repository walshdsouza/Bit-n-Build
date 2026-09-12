"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";

export default function MarketingHeader() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-xl bg-[#0A0A0F]/70 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1280px] mx-auto px-space-lg md:px-margin-md lg:px-margin-lg">
          <div className="h-20 flex items-center justify-between gap-space-md">
            {/* Logo */}
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center shadow-[0_0_15px_rgba(76,215,246,0.4)]">
                <span className="material-symbols-outlined text-on-primary text-[18px]">sign_language</span>
              </div>
              <span className="font-extrabold text-headline-sm text-on-surface tracking-tight">UNMUTE</span>
            </div>

            <nav className="hidden md:flex items-center gap-2 bg-surface-container-lowest/80 px-2 py-1 rounded-full border border-secondary/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <Link 
                href="/" 
                className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                  pathname === '/' 
                    ? 'text-cyan-400 bg-cyan-900/20 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] [text-shadow:0_0_10px_rgba(34,211,238,0.6)] font-semibold' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/features" 
                className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                  pathname === '/features' 
                    ? 'text-cyan-400 bg-cyan-900/20 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] [text-shadow:0_0_10px_rgba(34,211,238,0.6)] font-semibold' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Features
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-space-md">
              <button
                onClick={() => { setAuthMode("signin"); setShowAuth(true); }}
                className="hidden sm:inline-block font-label-button text-label-button text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => { setAuthMode("signup"); setShowAuth(true); }}
                className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-gradient-to-r from-secondary-container to-primary-container font-label-button text-label-button text-on-primary shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_28px_rgba(6,182,212,0.55)] hover:scale-[1.02] transition-all duration-200 border border-white/25"
              >
                <span>Try For Free</span>
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onModeChange={setAuthMode}
        />
      )}
    </>
  );
}
