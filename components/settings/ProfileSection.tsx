"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";

interface AccountProfile {
  name: string;
  email: string;
}

export default function ProfileSection() {
  const configured = isSupabaseConfigured();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loaded, setLoaded] = useState(!configured);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    async function loadProfile() {
      try {
        const { data, error } = await createClient().auth.getUser();
        if (error) throw error;
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
    <section id="profile" className="space-y-6">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Profile</h2>
        <p className="text-sm text-on-surface-variant">Your account on this deployment.</p>
      </div>
      {!loaded ? <p role="status" className="text-sm text-on-surface-variant">Loading account…</p> : profile ? (
        <dl className="space-y-4 rounded-xl border border-outline-variant/40 bg-surface-container-low p-4">
          <div><dt className="text-xs text-on-surface-variant">Name</dt><dd className="mt-1 text-sm text-on-surface">{profile.name}</dd></div>
          <div><dt className="text-xs text-on-surface-variant">Email</dt><dd className="mt-1 break-all text-sm text-on-surface">{profile.email || "Not provided"}</dd></div>
        </dl>
      ) : (
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-4">
          <p className="font-semibold text-on-surface">Guest mode</p>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {!configured ? "Accounts and saved projects are not configured on this deployment. The demo and translation tools remain available." : unavailable ? "The account service could not be reached. Try again later." : "You are not signed in. You can continue using the demo and translation tools."}
          </p>
        </div>
      )}
      <p className="text-sm leading-relaxed text-on-surface-variant">Provider keys are managed in API Keys. They are saved on this device and do not require an account.</p>
    </section>
  );
}
