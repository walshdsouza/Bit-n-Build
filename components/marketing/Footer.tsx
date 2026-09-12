export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 py-space-lg">
      <div className="max-w-[1280px] mx-auto px-space-lg md:px-margin-md lg:px-margin-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-space-sm">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[14px]">sign_language</span>
          </div>
          <span className="font-extrabold text-sm text-on-surface tracking-tight">UNMUTE</span>
        </div>
        <p className="text-xs text-on-surface-variant">
          © 2026 UNMUTE. Built for the Deaf and Hard-of-Hearing community.
        </p>
        <div className="flex items-center gap-space-md text-xs text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
