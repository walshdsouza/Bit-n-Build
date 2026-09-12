"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfile from "./UserProfile";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = breadcrumbMap[pathname] ?? (pathname.startsWith("/player") ? "Translation Player" : "GestureSync AI");

  return (
    <header className="h-14 flex items-center gap-4 px-space-md border-b border-outline-variant/30 bg-surface-container-lowest/60 backdrop-blur-sm sticky top-0 z-30">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-on-surface-variant text-sm">GestureSync</span>
        <span className="text-outline">/</span>
        <span className="text-on-surface text-sm font-semibold">{title}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Engine status badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-xs text-on-surface-variant">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          Engine Online · 42ms
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all relative">
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-surface-container-lowest" />
        </button>

        {/* New translation */}
        <Link
          href="/dashboard"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary-container to-primary-container text-on-primary text-xs font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.02] transition-all"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          New Translation
        </Link>
        <UserProfile />
      </div>
    </header>
  );
}
