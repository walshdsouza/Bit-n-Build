"use client";

const sections = [
  { id: "profile", label: "Profile", icon: "person" },
  { id: "avatar", label: "Avatar", icon: "view_in_ar" },
  { id: "engine", label: "Neural Engine", icon: "psychology" },
  { id: "apikeys", label: "API Keys", icon: "key" },
];

interface SettingsNavProps {
  active: string;
  onSelect: (id: string) => void;
}

export default function SettingsNav({ active, onSelect }: SettingsNavProps) {
  return (
    <nav className="flex flex-col gap-1 w-48 flex-shrink-0">
      {sections.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-150 ${
            active === id
              ? "bg-secondary-container/25 text-primary"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <span className={`material-symbols-outlined text-[18px] ${active === id ? "text-primary" : ""}`}>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
