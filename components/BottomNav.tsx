"use client";
import {
  FaHome,
  FaStore,
  FaCamera,
  FaBookmark,
  FaUserGraduate,
  FaUser,
} from "react-icons/fa";

const TABS = [
  { id: "home", label: "Home", icon: FaHome },
  { id: "marketplace", label: "Market", icon: FaStore },
  { id: "scan", label: "Scan", icon: FaCamera },
  { id: "wishlist", label: "Wishlist", icon: FaBookmark },
  { id: "mentors", label: "Mentors", icon: FaUserGraduate },
  { id: "dashboard", label: "You", icon: FaUser },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/6 bg-[#0a0a0f]/92 backdrop-blur-2xl safe-area-pb lg:hidden">
      <div className="container-app flex h-16 items-center justify-around">
        {TABS.map((t) => {
          const isActive = active === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-all ${
                isActive ? "text-violet-400" : "text-white/35 hover:text-white/60"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl border border-violet-500/20 bg-violet-500/10" />
              )}
              <Icon className="relative z-10 text-[20px]" />
              <span
                className={`caption relative z-10 ${
                  isActive ? "text-violet-400" : ""
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}