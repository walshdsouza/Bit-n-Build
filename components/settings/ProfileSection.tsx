"use client";
import { useState } from "react";

export default function ProfileSection() {
  const [name, setName] = useState("Sarah Chen");
  const [email] = useState("sarah.chen@example.com");
  const [role, setRole] = useState("Accessibility Researcher");

  return (
    <section id="profile" className="space-y-6">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Profile</h2>
        <p className="text-sm text-on-surface-variant">Manage your personal information and preferences.</p>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-tertiary to-secondary-container flex items-center justify-center text-on-tertiary text-2xl font-bold shadow-[0_0_20px_rgba(76,215,246,0.2)]">
          SC
        </div>
        <div>
          <p className="text-on-surface font-semibold">{name}</p>
          <p className="text-sm text-on-surface-variant">{email}</p>
          <button className="text-xs text-primary hover:text-primary/80 mt-1 transition-colors">Change photo</button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-on-surface-variant">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-surface-container-lowest text-on-surface text-sm rounded-lg px-3 py-2.5 border border-outline-variant/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-on-surface-variant">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-surface-container-lowest text-on-surface text-sm rounded-lg px-3 py-2.5 border border-outline-variant/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-on-surface-variant">Email (read-only)</label>
          <input
            type="email"
            value={email}
            readOnly
            className="bg-surface-container text-on-surface-variant text-sm rounded-lg px-3 py-2.5 border border-outline-variant/30 cursor-not-allowed"
          />
        </div>
      </div>

      <button className="px-5 py-2 rounded-full bg-gradient-to-r from-secondary-container to-primary-container text-on-primary text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.01] transition-all">
        Save Changes
      </button>
    </section>
  );
}
