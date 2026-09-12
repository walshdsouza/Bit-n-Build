"use client";
import { useState } from "react";
import SettingsNav from "@/components/settings/SettingsNav";
import ProfileSection from "@/components/settings/ProfileSection";
import AvatarSection from "@/components/settings/AvatarSection";
import EngineSection from "@/components/settings/EngineSection";
import ApiKeysSection from "@/components/settings/ApiKeysSection";

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  const renderSection = () => {
    switch (active) {
      case "profile": return <ProfileSection />;
      case "avatar": return <AvatarSection />;
      case "engine": return <EngineSection />;
      case "apikeys": return <ApiKeysSection />;
      default: return null;
    }
  };

  return (
    <div className="p-space-lg max-w-[900px] mx-auto">
      <div className="mb-space-lg">
        <p className="font-label-eyebrow text-label-eyebrow text-on-surface-variant uppercase tracking-widest mb-1">
          Configuration
        </p>
        <h1 className="font-headline-md text-headline-md text-on-surface">Settings</h1>
      </div>

      <div className="flex gap-space-lg">
        <SettingsNav active={active} onSelect={setActive} />
        <div className="flex-1 min-w-0 bg-surface-container rounded-xl border border-outline-variant/40 p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
