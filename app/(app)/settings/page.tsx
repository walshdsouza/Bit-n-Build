"use client";
import { useState } from "react";
import SettingsNav from "@/components/settings/SettingsNav";
import ProfileSection from "@/components/settings/ProfileSection";
import ApiKeysSection from "@/components/settings/ApiKeysSection";

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  const renderSection = () => {
    switch (active) {
      case "profile": return <ProfileSection />;
      case "apikeys": return <ApiKeysSection />;
      default: return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[900px] mx-auto">
      <div className="mb-space-lg">
        <p className="font-label-eyebrow text-label-eyebrow text-on-surface-variant uppercase tracking-widest mb-1">
          Configuration
        </p>
        <h1 className="font-headline-md text-headline-md text-on-surface">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-space-lg">
        <SettingsNav active={active} onSelect={setActive} />
        <div className="flex-1 min-w-0 bg-surface-container rounded-xl border border-outline-variant/40 p-4 sm:p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
