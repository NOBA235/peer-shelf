"use client";
import { useState, useEffect } from "react";
import { Avatar } from "./ui";
import {
  fetchNotifications,
  markAllNotificationsRead,
  NotificationDoc,
} from "@/lib/api";

interface Props {
  onScan: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
}

const NOTIF_ACCENT: Record<string, string> = {
  match: "border-l-emerald-500",
  mentor: "border-l-violet-500",
  save: "border-l-blue-500",
  review: "border-l-amber-500",
  system: "",
};
const NOTIF_ICONS: Record<string, string> = {
  match: "🎉",
  mentor: "🌟",
  save: "❤️",
  review: "⭐",
  system: "📢",
};

const DESKTOP_NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "marketplace", label: "Marketplace" },
  { id: "scan", label: "Scan" },
  { id: "wishlist", label: "Wishlist" },
  { id: "mentors", label: "Mentors" },
  { id: "dashboard", label: "Dashboard" },
];

export default function Navbar({ onScan, activeTab, onTabChange }: Props) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<NotificationDoc[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchNotifications().then(setNotifs).catch(() => {});
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  const markRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    } catch {
      /* ignore */
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left – Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-sm font-bold">
            📚
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            Peer<span className="text-text-secondary">&</span>Shelf
          </span>
        </div>

        {/* Right – Actions + Navigation Dropdown */}
        <div className="flex items-center gap-2">
          {/* Desktop scan button (hidden on mobile) */}
          <button
            onClick={onScan}
            className="hidden items-center gap-1.5 btn-ghost btn-sm sm:flex"
          >
            📷 Scan Book
          </button>

          {/* Desktop nav dropdown – always visible on lg+ */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-ghost btn-sm flex items-center gap-2"
            >
              Menu
              <svg
                className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-56 glass animate-in duration-300">
                  <nav className="py-2">
                    {DESKTOP_NAV_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                          activeTab === item.id
                            ? "bg-white/[0.06] text-[#a78bfa]"
                            : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                  <div className="border-t border-white/[0.08] px-4 py-3">
                    <p className="caption mb-2">Have books to share?</p>
                    <button
                      onClick={() => {
                        onScan();
                        setMenuOpen(false);
                      }}
                      className="btn-primary btn-sm w-full justify-center"
                    >
                      📷 Scan Now
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-base transition hover:border-white/[0.16] hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-[#a78bfa] focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Notifications"
            >
              🔔
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#a78bfa] text-[9px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>

            {showNotifs && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                <div className="absolute right-0 top-11 z-50 w-80 glass shadow-lg sm:w-96">
                  <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                    <span className="text-sm font-bold">Notifications</span>
                    {unread > 0 && (
                      <button
                        onClick={markRead}
                        className="text-xs font-medium text-[#a78bfa] underline underline-offset-2 hover:no-underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 divide-y divide-white/[0.08] overflow-y-auto">
                    {notifs.length === 0 ? (
                      <p className="py-8 text-center text-sm text-text-muted">
                        No notifications yet
                      </p>
                    ) : (
                      notifs.map((n) => (
                        <div
                          key={n._id}
                          className={`flex items-start gap-3 px-4 py-3 ${
                            !n.read
                              ? `bg-white/[0.04] border-l-4 ${NOTIF_ACCENT[n.type] || "border-l-transparent"}`
                              : ""
                          }`}
                        >
                          <span className="mt-0.5 flex-shrink-0 text-base">
                            {NOTIF_ICONS[n.type]}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-snug">{n.text}</p>
                            <p className="mt-0.5 text-xs text-text-muted">{n.time}</p>
                          </div>
                          {!n.read && (
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#a78bfa]" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <Avatar initials="You" size="sm" />
        </div>
      </div>
    </nav>
  );
}