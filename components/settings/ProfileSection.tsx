"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import AuthModal from "@/components/auth/AuthModal";

interface AccountProfile {
  name: string;
  email: string;
}

export default function ProfileSection() {
  const configured = isSupabaseConfigured();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loaded, setLoaded] = useState(!configured);
  const [unavailable, setUnavailable] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    async function loadProfile() {
      try {
        const { data, error } = await createClient().auth.getUser();
        if (error && error.name !== "AuthSessionMissingError") throw error;
        if (!cancelled && data.user) {
          const name: unknown = data.user.user_metadata.full_name;
          setProfile({ name: typeof name === "string" ? name : "Signed-in user", email: data.user.email ?? "" });
        }
      } catch {
        if (!cancelled) setUnavailable(true);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    void loadProfile();
    return () => { cancelled = true; };
  }, [configured]);

  return (
    <section id="profile" aria-labelledby="profile-heading" className="scroll-mt-20 space-y-6">
      <h2 id="profile-heading" className="font-headline-sm text-headline-sm text-on-surface">Profile</h2>
      {!loaded ? <p role="status" className="text-sm text-on-surface-variant">Loading profile…</p> : (
        <dl className="space-y-5">
          <div><dt className="text-xs text-on-surface-variant">Name</dt><dd className="mt-1 text-sm text-on-surface">{profile?.name ?? "Guest"}</dd></div>
          <div><dt className="text-xs text-on-surface-variant">Email</dt><dd className="mt-1 break-all text-sm text-on-surface">{profile ? profile.email || "Not provided" : "Not signed in"}</dd></div>
        </dl>
      )}
      {loaded && !profile && configured && (
        <button type="button" onClick={() => { setAuthMode("signin"); setShowAuth(true); }}
          className="inline-flex min-h-11 items-center rounded-lg border border-outline-variant px-4 text-sm font-medium text-primary transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-primary">
          Sign in
        </button>
      )}
      {unavailable && <p role="status" className="text-sm text-on-surface-variant">Unable to load your profile. Please try again later.</p>}
      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onModeChange={setAuthMode} />}
    </section>
  );
}
