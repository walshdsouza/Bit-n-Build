const capabilities = [
  { value: "ASL", label: "Current signing language", icon: "sign_language" },
  { value: "3D", label: "Browser-based NEXA avatar", icon: "view_in_ar" },
  { value: "SiGML", label: "Export your signing plan", icon: "download" },
  { value: "Your control", label: "Explicit audio-sharing controls", icon: "privacy_tip" },
];

export default function TrustMetrics() {
  return (
    <section aria-label="App capabilities" className="pb-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {capabilities.map((item) => <div key={item.label} className="flex flex-col items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/60 p-4 text-center sm:p-6">
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-[28px]">{item.icon}</span>
          <span className="text-xl font-semibold tracking-tight text-on-surface">{item.value}</span>
          <span className="text-xs leading-relaxed text-on-surface-variant">{item.label}</span>
        </div>)}
      </div>
    </section>
  );
}
