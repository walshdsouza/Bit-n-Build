export default function SettingsNav() {
  return (
    <nav aria-label="Settings sections" className="flex flex-row flex-wrap md:flex-col gap-1 w-full md:w-48 flex-shrink-0">
      <a href="#profile" aria-current="page"
        className="flex min-h-11 items-center gap-2.5 rounded-lg bg-surface-container px-3 py-2.5 text-left text-sm font-medium text-primary transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-primary">
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person</span>
        Profile
      </a>
    </nav>
  );
}
