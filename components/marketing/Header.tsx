"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";
import BrandLogo from "@/components/brand/BrandLogo";

const links = [{ href: "/", label: "Home" }, { href: "/features", label: "Features" }, { href: "/live", label: "Live Meetings" }];

export default function MarketingHeader() {
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const pathname = usePathname();

  function openAuth(mode: "signin" | "signup") {
    setMenuOpen(false);
    setAuthMode(mode);
    setShowAuth(true);
  }

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-outline-variant/20 bg-[#0A0A0F]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-10">
          <Link href="/" aria-label="UNMUTE home" className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><BrandLogo size={36} /></Link>
          <nav aria-label="Website navigation" className="hidden items-center gap-1 rounded-full border border-secondary/20 bg-surface-container-lowest/80 p-1 lg:flex">
            {links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`min-h-11 rounded-full px-4 py-3 text-sm transition-colors ${pathname === href ? "bg-primary/10 font-semibold text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>{label}</Link>)}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => openAuth("signin")} className="hidden min-h-11 text-sm font-semibold text-on-surface-variant hover:text-on-surface sm:inline-block">Sign in</button>
            <button onClick={() => openAuth("signup")} className="min-h-11 rounded-full border border-white/20 bg-gradient-to-r from-secondary-container to-primary-container px-3 text-xs font-semibold text-on-primary shadow-lg shadow-primary/15 sm:px-5 sm:text-sm">Try For Free</button>
            <button type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-on-surface hover:bg-surface-container lg:hidden"><span aria-hidden="true" className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span></button>
          </div>
        </div>
        {menuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="grid gap-1 border-t border-outline-variant/30 bg-surface-container-lowest px-4 py-3 lg:hidden">
          {links.map(({ href, label }) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={pathname === href ? "page" : undefined} className={`min-h-11 rounded-lg px-4 py-3 text-sm ${pathname === href ? "bg-primary/10 font-semibold text-primary" : "text-on-surface-variant hover:bg-surface-container"}`}>{label}</Link>)}
          <button onClick={() => openAuth("signin")} className="min-h-11 rounded-lg px-4 py-3 text-left text-sm text-on-surface-variant sm:hidden">Sign in</button>
        </nav>}
      </header>
      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onModeChange={setAuthMode} />}
    </>
  );
}
