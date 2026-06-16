"use client";
import { useState, useEffect } from "react";
import { fetchListings, fetchWishlist, fetchNotifications, NotificationDoc, ListingDoc, WishlistDoc } from "@/lib/api";
import { Card, Badge, Avatar, SectionHeader, Skeleton } from "../ui";

const ACTIVITY = [
  { icon: "📦", text: "You listed H.C. Verma Vol 1 & 2", time: "2d ago" },
  { icon: "🤝", text: "Successful exchange with Priya N.", time: "5d ago" },
  { icon: "📝", text: "Uploaded Physics formula sheet", time: "1w ago" },
  { icon: "🌟", text: "Mentorship session with Aditi S.", time: "2w ago" },
];

const REPUTATION = [
  { label: "Books Shared",       value: 12, max: 50,  icon: "📚" },
  { label: "Notes Shared",       value: 28, max: 50,  icon: "📝" },
  { label: "Students Helped",    value: 34, max: 100, icon: "👥" },
  { label: "Mentorship Sessions",value: 7,  max: 25,  icon: "🌟" },
  { label: "Exchanges",          value: 9,  max: 25,  icon: "🤝" },
];

const NOTIF_ICONS: Record<string, string> = { match:"🎉", mentor:"🌟", save:"❤️", review:"⭐", system:"📢" };
const NOTIF_BG:   Record<string, string> = {
  match:  "border-l-emerald-500 bg-emerald-50",
  mentor: "border-l-violet-500 bg-violet-50",
  save:   "border-l-blue-500 bg-blue-50",
  review: "border-l-amber-500 bg-amber-50",
  system: "",
};

export default function DashboardSection() {
  const [tab, setTab] = useState<"overview" | "listings" | "activity">("overview");
  const [notifs,   setNotifs]   = useState<NotificationDoc[]>([]);
  const [listings, setListings] = useState<ListingDoc[]>([]);
  const [wishlist, setWishlist] = useState<WishlistDoc[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetchNotifications().catch(() => [] as NotificationDoc[]),
      fetchListings().catch(() => [] as ListingDoc[]),
      fetchWishlist().catch(() => [] as WishlistDoc[]),
    ]).then(([n, l, w]) => {
      setNotifs(n as NotificationDoc[]);
      setListings(l as ListingDoc[]);
      setWishlist(w as WishlistDoc[]);
      setLoading(false);
    });
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 text-[#18181B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Profile card */}
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-shrink-0">
              <Avatar initials="YO" size="xl" />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[8px] text-white">
                ✓
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-[24px] font-bold leading-[32px] text-[#18181B]">Your Dashboard</h1>
              <p className="text-sm text-[#52525B]">Member since Jan 2024</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge color="violet">⭐ Top Contributor</Badge>
                <Badge color="emerald">✓ Verified Student</Badge>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              [listings.length || 12, "Books"],
              [28, "Notes"],
              [34, "Helped"],
              ["4.8★", "Rating"],
            ].map(([v, l]) => (
              <div key={l as string} className="text-center">
                <p className="text-lg font-extrabold text-[#18181B]">{v}</p>
                <p className="text-xs text-[#71717A]">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[#E4E4E7]">
          {(["overview", "listings", "activity"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition ${
                tab === t
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 rounded-md" />
            ))}
          </div>
        ) : (
          <>
            {tab === "overview" && (
              <div className="space-y-6">
                {/* Notifications */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <SectionHeader label="🔔 Notifications" />
                    {unread > 0 && <Badge color="violet">{unread} new</Badge>}
                  </div>
                  <div className="space-y-2">
                    {notifs.length === 0 ? (
                      <p className="py-4 text-center text-sm text-[#71717A]">
                        No notifications yet
                      </p>
                    ) : (
                      notifs.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          className={`rounded-md border border-[#E4E4E7] bg-white p-3 flex gap-3 items-start ${
                            !n.read ? `border-l-4 ${NOTIF_BG[n.type] || "border-l-transparent"}` : ""
                          }`}
                        >
                          <span className="flex-shrink-0 text-lg">{NOTIF_ICONS[n.type]}</span>
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

                {/* Reputation */}
                <div>
                  <SectionHeader label="🏆 Reputation" />
                  <div className="space-y-3">
                    {REPUTATION.map((r) => (
                      <div
                        key={r.label}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-md border border-[#E4E4E7] bg-white p-3"
                      >
                        <div className="flex items-center gap-3 sm:flex-1">
                          <span className="flex-shrink-0 text-lg">{r.icon}</span>
                          <span className="text-sm text-[#52525B]">{r.label}</span>
                        </div>
                        <div className="flex items-center gap-3 sm:w-48">
                          <div className="h-1.5 flex-1 rounded-full bg-[#F4F4F5]">
                            <div
                              className="h-1.5 rounded-full bg-[#18181B]"
                              style={{ width: `${Math.min((r.value / r.max) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-sm font-bold text-[#18181B]">
                            {r.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wishlist status */}
                <div>
                  <SectionHeader label="🔖 My Requests" />
                  <div className="space-y-2">
                    {wishlist.length === 0 ? (
                      <p className="py-4 text-center text-sm text-[#71717A]">
                        No requests yet
                      </p>
                    ) : (
                      wishlist.slice(0, 3).map((w) => (
                        <div
                          key={w._id}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-md border border-[#E4E4E7] bg-white p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-[#18181B]">
                              {w.title}
                            </p>
                            <p className="text-xs text-[#71717A]">
                              {w.subject} · {w.curriculum}
                            </p>
                          </div>
                          <Badge
                            color={
                              w.status === "match"
                                ? "emerald"
                                : w.status === "potential"
                                ? "amber"
                                : "blue"
                            }
                          >
                            {w.status === "match"
                              ? "Matched"
                              : w.status === "potential"
                              ? "Potential"
                              : "Searching"}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === "listings" && (
              <div className="space-y-3">
                <SectionHeader label="📦 My Active Listings" />
                {listings.length === 0 ? (
                  <p className="py-4 text-center text-sm text-[#71717A]">No listings yet</p>
                ) : (
                  listings.slice(0, 5).map((l) => (
                    <div
                      key={l._id}
                      className="flex cursor-pointer items-center gap-3 rounded-md border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
                    >
                      <span className="text-2xl">{l.image}</span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-[#18181B]">
                          {l.title}
                        </p>
                        <p className="text-xs text-[#71717A]">
                          {l.price === 0 ? "Free" : `₹${l.price}`} · {l.condition} · ❤️ {l.saves}
                        </p>
                      </div>
                      <Badge color="emerald">Active</Badge>
                    </div>
                  ))
                )}
                <button className="w-full rounded-md border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA]">
                  + Add New Listing
                </button>
              </div>
            )}

            {tab === "activity" && (
              <div className="space-y-3">
                <SectionHeader label="📋 Recent Activity" />
                {ACTIVITY.map((a, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-[#E4E4E7] bg-[#FAFAFA] text-xl">
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#18181B]">{a.text}</p>
                      <p className="mt-0.5 text-xs text-[#71717A]">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}