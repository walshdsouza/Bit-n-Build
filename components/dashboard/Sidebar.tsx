"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/player/demo", icon: "play_circle", label: "Player" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col items-center py-4 z-40">
      {/* Logo mark */}
      <Link href="/" className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center shadow-[0_0_16px_rgba(76,215,246,0.4)] mb-6">
        <span className="material-symbols-outlined text-on-primary text-[18px]">sign_language</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                active
                  ? "bg-secondary-container/30 text-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom — avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tertiary to-secondary-container flex items-center justify-center text-on-tertiary text-sm font-bold">
        SC
      </div>
    </aside>
  );
}
