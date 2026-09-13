"use client";

const sections = [
  { id: "profile", label: "Profile", icon: "person" },
  { id: "apikeys", label: "API Keys", icon: "key" },
];

interface SettingsNavProps {
  active: string;
  onSelect: (id: string) => void;
}

export default function SettingsNav({ active, onSelect }: SettingsNavProps) {
  return (
    <nav aria-label="Settings sections" className="flex flex-row flex-wrap md:flex-col gap-1 w-full md:w-48 flex-shrink-0">
      {sections.map(({ id, label, icon }) => (
        <button
          key={id}
          aria-current={active === id ? "page" : undefined}
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
