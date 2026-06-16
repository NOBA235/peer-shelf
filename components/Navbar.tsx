"use client";
import { useState, useEffect } from "react";
import { Avatar } from "./ui";
import { fetchNotifications, markAllNotificationsRead, NotificationDoc } from "@/lib/api";

interface Props {
  onScan: () => void;
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

export default function Navbar({ onScan }: Props) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<NotificationDoc[]>([]);

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
    <nav className="sticky top-0 z-50 border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4E4E7] bg-[#FAFAFA] text-sm font-bold">
            📚
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[#18181B]">
            Peer<span className="text-[#52525B]">&</span>Shelf
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onScan}
            className="hidden items-center gap-1.5 rounded-md border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 sm:flex"
          >
            📷 Scan Book
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#E4E4E7] bg-white text-base transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              aria-label="Notifications"
            >
              🔔
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#18181B] text-[9px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>

            {showNotifs && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifs(false)}
                />
                <div className="absolute right-0 top-11 z-50 w-80 rounded-lg border border-[#E4E4E7] bg-white shadow-lg sm:w-96">
                  <div className="flex items-center justify-between border-b border-[#E4E4E7] px-4 py-3">
                    <span className="text-sm font-bold text-[#18181B]">Notifications</span>
                    {unread > 0 && (
                      <button
                        onClick={markRead}
                        className="text-xs font-medium text-[#18181B] underline underline-offset-2 hover:no-underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 divide-y divide-[#E4E4E7] overflow-y-auto">
                    {notifs.length === 0 ? (
                      <p className="py-8 text-center text-sm text-[#71717A]">
                        No notifications yet
                      </p>
                    ) : (
                      notifs.map((n) => (
                        <div
                          key={n._id}
                          className={`flex items-start gap-3 px-4 py-3 ${
                            !n.read ? `bg-[#F4F4F5] border-l-4 ${NOTIF_ACCENT[n.type] || "border-l-transparent"}` : ""
                          }`}
                        >
                          <span className="mt-0.5 flex-shrink-0 text-base">
                            {NOTIF_ICONS[n.type]}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-snug text-[#18181B]">{n.text}</p>
                            <p className="mt-0.5 text-xs text-[#71717A]">{n.time}</p>
                          </div>
                          {!n.read && (
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#18181B]" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <Avatar initials="YO" size="sm" />
        </div>
      </div>
    </nav>
  );
}