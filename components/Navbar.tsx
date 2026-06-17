"use client";
import { useState, useEffect, useRef } from "react";
import { Avatar } from "./ui";
import {
  fetchNotifications,
  markAllNotificationsRead,
  NotificationDoc,
} from "@/lib/api";
import {
  Camera,
  Bell,
  BookOpen,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

interface Props {
  onScan: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
}

const DESKTOP_NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "marketplace", label: "Marketplace" },
  { id: "scan", label: "Scan" },
  { id: "wishlist", label: "Wishlist" },
  { id: "mentors", label: "Mentors" },
  { id: "dashboard", label: "Dashboard" },
];

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  match: <Check size={16} className="text-emerald-500" />,
  mentor: <BookOpen size={16} className="text-violet-500" />,
  save: <Bell size={16} className="text-blue-500" />,
  review: <Bell size={16} className="text-amber-500" />,
  system: <Bell size={16} className="text-zinc-400" />,
};

export default function Navbar({ onScan, activeTab, onTabChange }: Props) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<NotificationDoc[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications().then(setNotifs).catch(() => {});
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    if (menuOpen || showNotifs) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, showNotifs]);

  const unread = notifs.filter((n) => !n.read).length;

  const markRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      /* ignore */
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E4E4E7] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18181B] text-white">
            <BookOpen size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#18181B]">
            Peer<span className="text-[#71717A]">&</span>Shelf
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Desktop scan button */}
          <button
            onClick={onScan}
            className="hidden items-center gap-1.5 rounded-lg bg-[#18181B] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#27272A] sm:flex"
          >
            <Camera size={16} />
            Scan
          </button>

          {/* Desktop navigation dropdown (visible on lg+ screens) */}
          <div className="relative hidden lg:block" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#52525B] transition hover:bg-[#F4F4F5] hover:text-[#18181B]"
            >
              Menu
              <ChevronDown
                size={16}
                className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E4E4E7] bg-white shadow-xl animate-in duration-200">
                <div className="py-2">
                  {DESKTOP_NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                        activeTab === item.id
                          ? "bg-[#F4F4F5] text-[#18181B]"
                          : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-[#E4E4E7] px-4 py-3">
                  <p className="mb-2 text-xs text-[#71717A]">Have books to share?</p>
                  <button
                    onClick={() => {
                      onScan();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#18181B] py-2 text-sm font-medium text-white transition hover:bg-[#27272A]"
                  >
                    <Camera size={16} />
                    Scan Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#52525B] transition hover:bg-[#F4F4F5] hover:text-[#18181B]"
            >
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#18181B] text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-[#E4E4E7] bg-white shadow-xl sm:w-96">
                <div className="flex items-center justify-between border-b border-[#F4F4F5] px-4 py-3">
                  <span className="text-sm font-semibold text-[#18181B]">Notifications</span>
                  {unread > 0 && (
                    <button
                      onClick={markRead}
                      className="text-xs font-medium text-[#7c3aed] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 divide-y divide-[#F4F4F5] overflow-y-auto">
                  {notifs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-[#A1A1AA]">No notifications yet</p>
                  ) : (
                    notifs.map((n) => (
                      <div
                        key={n._id}
                        className={`flex items-start gap-3 px-4 py-3 ${!n.read ? "bg-[#FAFAFA]" : ""}`}
                      >
                        <span className="mt-0.5 flex-shrink-0">
                          {NOTIF_ICONS[n.type] || <Bell size={16} className="text-[#A1A1AA]" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-snug text-[#18181B]">{n.text}</p>
                          <p className="mt-0.5 text-xs text-[#A1A1AA]">{n.time}</p>
                        </div>
                        {!n.read && (
                          <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#7c3aed]" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Avatar initials="You" size="sm" />
        </div>
      </div>
    </nav>
  );
}