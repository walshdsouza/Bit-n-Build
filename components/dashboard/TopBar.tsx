"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfile from "./UserProfile";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/settings": "Settings",
  "/live": "Live Meetings",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = breadcrumbMap[pathname] ?? (pathname.startsWith("/player") ? "Translation Player" : "UNMUTE");

  return (
    <header className="min-h-14 flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1 border-b border-outline-variant/30 bg-surface-container-lowest/60 backdrop-blur-sm sticky top-0 z-30">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="hidden text-on-surface-variant text-sm font-extrabold tracking-tight sm:inline">UNMUTE</span>
        <span className="hidden text-outline sm:inline">/</span>
        <span className="text-on-surface text-sm font-semibold">{title}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/live" aria-label="Live Meetings" aria-current={pathname === "/live" ? "page" : undefined} className="flex min-h-11 items-center gap-1 rounded-lg px-1.5 text-xs font-semibold text-primary hover:bg-primary/10"><span aria-hidden="true" className="material-symbols-outlined text-[18px]">video_chat</span><span className="hidden sm:inline">Live Meetings</span><span className="sm:hidden">Live</span></Link>
        {/* Product capability, not an unmeasured service health claim. */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-xs text-on-surface-variant">
          ASL
        </div>

        {/* New translation */}
        <Link
          href="/dashboard"
          className="hidden min-h-11 items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container px-3 text-xs font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
          New Translation
        </Link>
        <UserProfile />
      </div>
    </header>
  );
}
