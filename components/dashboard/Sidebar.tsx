"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/player/demo", icon: "play_circle", label: "Player" },
  { href: "/live", icon: "video_chat", label: "Live Meetings" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col items-center py-4 z-40">
      {/* Logo mark */}
      <Link href="/" aria-label="UNMUTE home" className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-primary">
        <BrandLogo size={44} wordmark={false} />
      </Link>

      {/* Nav */}
      <nav aria-label="Main navigation" className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, icon, label }) => {
          const active = href === "/player/demo" ? pathname.startsWith("/player/") : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 ${
                active
                  ? "bg-secondary-container/30 text-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{icon}</span>
            </Link>
          );
        })}
      </nav>

      <Link href="/settings" aria-label="Profile settings" title="Profile settings" className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
        <span aria-hidden="true" className="material-symbols-outlined text-[22px]">account_circle</span>
      </Link>
    </aside>
  );
}
