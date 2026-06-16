"use client";

const TABS = [
  { id: "home",        label: "Home",    icon: "🏠" },
  { id: "marketplace", label: "Market",  icon: "🛍️" },
  { id: "scan",        label: "Scan",    icon: "📷" },
  { id: "wishlist",    label: "Wishlist",icon: "🔖" },
  { id: "mentors",     label: "Mentors", icon: "🌟" },
  { id: "dashboard",   label: "You",     icon: "👤" },
];

export default function BottomNav({
  active, onChange,
}: { active: string; onChange: (t: string) => void }) {
  return (
    /* Only visible on mobile / tablet */
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0a0a0f]/92 backdrop-blur-2xl border-t border-white/6 safe-area-pb">
      <div className="container-app h-16 flex items-center justify-around">
        {TABS.map(t => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                on ? "text-violet-400" : "text-white/35 hover:text-white/60"
              }`}
            >
              {on && (
                <span className="absolute inset-0 bg-violet-500/10 rounded-xl border border-violet-500/20" />
              )}
              <span className="text-[17px] relative z-10">{t.icon}</span>
              <span className={`caption relative z-10 ${on ? "text-violet-400" : ""}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
