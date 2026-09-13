"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { logout } from "@/app/auth/actions";
import Link from "next/link";

export default function UserProfile() {
  const [email, setEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Built inside the effect, and guarded: createClient() asserts its env
    // vars, so calling it in the component body throws during prerendering and
    // fails the production build when Supabase is not configured.
    if (!isSupabaseConfigured()) return;
    try {
      createClient()
        .auth.getUser()
        .then(({ data }) => {
          if (data?.user) setEmail(data.user.email ?? null);
        })
        .catch(() => {
          /* signed out, or auth unreachable */
        });
    } catch {
      /* Supabase misconfigured — stay in the signed-out state */
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!email) return (
    <span className="text-xs text-on-surface-variant">Guest</span>
  );

  return (
    <div className="relative" ref={menuRef}>
      <button 
        aria-label="Open account menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/40 overflow-hidden hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <div className="w-full h-full bg-gradient-to-br from-secondary-container to-primary-container flex items-center justify-center text-on-primary-container font-semibold text-xs uppercase">
          {email.charAt(0)}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-2xl py-1 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant/30 bg-surface-container-lowest">
            <p className="text-xs text-on-surface-variant font-medium">Signed in as</p>
            <p className="text-sm text-on-surface font-semibold truncate mt-0.5">{email}</p>
          </div>
          <div className="p-1.5">
            <Link href="/settings" onClick={() => setIsOpen(false)}
              className="w-full text-left px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-md transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              Account Settings
            </Link>
            <form action={logout} className="w-full mt-1">
              <button 
                type="submit"
                className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
