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
  match:  "bg-emerald-500/8 border-emerald-500/15",
  mentor: "bg-violet-500/8 border-violet-500/15",
  save:   "bg-blue-500/8 border-blue-500/15",
  review: "bg-amber-500/8 border-amber-500/15",
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
    <div className="space-y-6 pt-6">

      {/* Profile card */}
      <Card hover={false} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative">
          <div className="relative flex-shrink-0">
            <Avatar initials="YO" size="xl" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center text-[8px] text-white">✓</div>
          </div>
          <div className="flex-1">
            <h1 className="heading-md text-white">Your Dashboard</h1>
            <p className="body-sm">Member since Jan 2024</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge color="violet">⭐ Top Contributor</Badge>
              <Badge color="emerald">✓ Verified Student</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-5 relative">
          {[[listings.length || 12,"Books"],[28,"Notes"],[34,"Helped"],["4.8★","Rating"]].map(([v,l]) => (
            <div key={l as string} className="text-center">
              <p className="font-extrabold text-white text-lg">{v}</p>
              <p className="caption">{l}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tab bar */}
      <div className="tab-bar">
        {(["overview","listings","activity"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? "tab-btn-active" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-14" />)}</div>
      ) : (
        <>
          {tab === "overview" && (
            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <SectionHeader label="🔔 Notifications" />
                  {unread > 0 && <Badge color="violet">{unread} new</Badge>}
                </div>
                <div className="space-y-2">
                  {notifs.length === 0
                    ? <p className="body-sm text-center py-4">No notifications yet</p>
                    : notifs.slice(0, 5).map(n => (
                      <div key={n._id} className={`glass rounded-xl p-3 flex gap-3 items-start border ${!n.read ? NOTIF_BG[n.type] : "border-transparent"}`}>
                        <span className="text-lg flex-shrink-0">{NOTIF_ICONS[n.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="body-sm text-white/75 leading-snug">{n.text}</p>
                          <p className="caption mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Reputation */}
              <div>
                <SectionHeader label="🏆 Reputation" />
                <div className="space-y-3">
                  {REPUTATION.map(r => (
                    <div key={r.label} className="flex items-center gap-3">
                      <span className="text-lg w-6 flex-shrink-0">{r.icon}</span>
                      <span className="body-sm text-white/60 flex-1">{r.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="progress-track w-20">
                          <div className="progress-fill" style={{ width: `${Math.min((r.value/r.max)*100,100)}%` }} />
                        </div>
                        <span className="font-bold text-white text-sm w-6 text-right">{r.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wishlist status */}
              <div>
                <SectionHeader label="🔖 My Requests" />
                <div className="space-y-2">
                  {wishlist.length === 0
                    ? <p className="body-sm text-center py-4">No requests yet</p>
                    : wishlist.slice(0,3).map(w => (
                      <div key={w._id} className="glass rounded-xl p-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="body-sm text-white/75 line-clamp-1">{w.title}</p>
                          <p className="caption">{w.subject} · {w.curriculum}</p>
                        </div>
                        <Badge color={w.status==="match"?"emerald":w.status==="potential"?"amber":"blue"}>
                          {w.status==="match"?"Matched":w.status==="potential"?"Potential":"Searching"}
                        </Badge>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {tab === "listings" && (
            <div className="space-y-3">
              <SectionHeader label="📦 My Active Listings" />
              {listings.length === 0
                ? <p className="body-sm text-center py-4">No listings yet</p>
                : listings.slice(0,5).map(l => (
                  <div key={l._id} className="glass glass-hover rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                    <span className="text-2xl">{l.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm line-clamp-1">{l.title}</p>
                      <p className="caption">{l.price===0?"Free":`₹${l.price}`} · {l.condition} · ❤️ {l.saves}</p>
                    </div>
                    <Badge color="emerald">Active</Badge>
                  </div>
                ))
              }
              <button className="btn-ghost w-full border-violet-500/25 text-violet-400">
                + Add New Listing
              </button>
            </div>
          )}

          {tab === "activity" && (
            <div className="space-y-3">
              <SectionHeader label="📋 Recent Activity" />
              {ACTIVITY.map((a, i) => (
                <div key={i} className="glass glass-hover rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-xl flex-shrink-0">{a.icon}</div>
                  <div className="flex-1">
                    <p className="body-sm text-white/75">{a.text}</p>
                    <p className="caption mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
