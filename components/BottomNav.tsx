"use client";
import { Home, ShoppingBag, Camera, Bookmark, GraduationCap, User } from "lucide-react";

const TABS = [
  { id: "home",        label: "Home",    icon: Home },
  { id: "marketplace", label: "Market",  icon: ShoppingBag },
  { id: "scan",        label: "Scan",    icon: Camera },
  { id: "wishlist",    label: "Wishlist",icon: Bookmark },
  { id: "mentors",     label: "Mentors", icon: GraduationCap },
  { id: "dashboard",   label: "You",     icon: User },
];

interface Props {
  active: string;
  onChange: (tab: string) => void;
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E4E4E7] bg-white safe-area-pb lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition ${
                isActive
                  ? "text-[#18181B]"
                  : "text-[#A1A1AA] hover:text-[#71717A]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}