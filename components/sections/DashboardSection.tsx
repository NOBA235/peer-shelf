"use client";
import { useState, useEffect } from "react";
import {
  Bell,
  Package,
  TrendingUp,
  FileText,
  Heart,
  Users,
  Star,
  Clock,
  ArrowUpRight,
  Sparkles,
  Search,
  CheckCircle2,
  Eye,
  Plus,
} from "lucide-react";
import {
  fetchListings,
  fetchWishlist,
  fetchNotifications,
  NotificationDoc,
  ListingDoc,
  WishlistDoc,
} from "@/lib/api";
import { Badge, Avatar, Skeleton } from "../ui";

/* ── Static activity feed (hardcoded sample) ─────────── */
const ACTIVITY = [
  { icon: Package,   text: "You listed H.C. Verma Vol 1 & 2",  time: "2d ago" },
  { icon: ArrowUpRight, text: "Successful exchange with Priya N.", time: "5d ago" },
  { icon: FileText,  text: "Uploaded Physics formula sheet",   time: "1w ago" },
  { icon: Star,      text: "Mentorship session with Aditi S.",  time: "2w ago" },
];

const REPUTATION = [
  { label: "Books Shared",        value: 12, max: 50,  icon: Package },
  { label: "Notes Shared",        value: 28, max: 50,  icon: FileText },
  { label: "Students Helped",     value: 34, max: 100, icon: Users },
  { label: "Mentorship Sessions", value: 7,  max: 25,  icon: Star },
  { label: "Exchanges",           value: 9,  max: 25,  icon: ArrowUpRight },
];

/* ── Notif icon mapper ──────────────────────────────────── */
const NOTIF_ICONS: Record<string, React.ReactNode> = {
  match:   <CheckCircle2 size={16} className="text-emerald-500" />,
  mentor:  <Star size={16} className="text-violet-500" />,
  save:    <Heart size={16} className="text-rose-500" />,
  review:  <Star size={16} className="text-amber-500" />,
  system:  <Bell size={16} className="text-zinc-400" />,
};

const stats: {
  value: string | number;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { value: 28, label: "Notes", Icon: FileText },
  { value: 34, label: "Helped", Icon: Users },
  { value: "4.8★", label: "Rating", Icon: Star },
];

export default function DashboardSection() {
  const [tab, setTab] = useState<"overview" | "listings" | "activity">("overview");
  const [notifs, setNotifs] = useState<NotificationDoc[]>([]);
  const [listings, setListings] = useState<ListingDoc[]>([]);
  const [wishlist, setWishlist] = useState<WishlistDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchNotifications().catch(() => [] as NotificationDoc[]),
      fetchListings().catch(() => [] as ListingDoc[]),
      fetchWishlist().catch(() => [] as WishlistDoc[]),
    ]).then(([n, l, w]) => {
      setNotifs(n);
      setListings(l);
      setWishlist(w);
      setLoading(false);
    });
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-12 text-[#18181B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Profile card */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-shrink-0">
              <Avatar initials="YO" size="xl" />
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[10px] font-bold text-white">
                ✓
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-[#18181B] sm:text-3xl">
                Your Dashboard
              </h1>
              <p className="mt-0.5 text-sm text-[#52525B]">Member since Jan 2024</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge color="violet">Top Contributor</Badge>
                <Badge color="emerald">Verified Student</Badge>
              </div>
            </div>
          </div>

   {stats.map(({ value, label, Icon }) => (
  <div key={label} className="text-center">
    <div className="flex items-center justify-center gap-1.5 text-xl font-extrabold text-[#18181B]">
      <Icon size={18} className="text-[#52525B]" />
      {value}
    </div>
    <p className="mt-1 text-xs text-[#71717A]">{label}</p>
  </div>
))}

</div>
        {/* Tabs */}
        <div className="flex border-b border-[#E4E4E7]">
          {(["overview", "listings", "activity"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-sm font-semibold capitalize transition ${
                tab === t
                  ? "text-[#18181B]"
                  : "text-[#A1A1AA] hover:text-[#52525B]"
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#18181B]" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* ── Overview tab ────────────────────────── */}
            {tab === "overview" && (
              <div className="space-y-8">
                {/* Notifications */}
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={20} className="text-[#52525B]" />
                      <h2 className="text-lg font-bold text-[#18181B]">Notifications</h2>
                    </div>
                    {unread > 0 && <Badge color="violet">{unread} new</Badge>}
                  </div>
                  <div className="space-y-2">
                    {notifs.length === 0 ? (
                      <p className="py-6 text-center text-sm text-[#A1A1AA]">
                        No notifications yet
                      </p>
                    ) : (
                      notifs.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          className={`flex items-start gap-3 rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] ${
                            !n.read ? "border-l-4 border-l-[#18181B] bg-[#FAFAFA]" : ""
                          }`}
                        >
                          <span className="mt-0.5 flex-shrink-0">
                            {NOTIF_ICONS[n.type] || <Bell size={16} className="text-[#A1A1AA]" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-snug text-[#18181B]">{n.text}</p>
                            <p className="mt-0.5 text-xs text-[#A1A1AA]">{n.time}</p>
                          </div>
                          {!n.read && (
                            <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#18181B]" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Reputation */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#52525B]" />
                    <h2 className="text-lg font-bold text-[#18181B]">Reputation</h2>
                  </div>
                  <div className="space-y-3">
                    {REPUTATION.map((r) => (
                      <div
                        key={r.label}
                        className="flex flex-col gap-3 rounded-xl border border-[#E4E4E7] bg-white p-4 sm:flex-row sm:items-center"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <r.icon size={18} className="text-[#52525B]" />
                          <span className="text-sm font-medium text-[#18181B]">{r.label}</span>
                        </div>
                        <div className="flex w-full items-center gap-3 sm:w-52">
                          <div className="h-2 flex-1 rounded-full bg-[#F4F4F5]">
                            <div
                              className="h-2 rounded-full bg-[#18181B]"
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
                </section>

                {/* Wishlist status */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-[#52525B]" />
                    <h2 className="text-lg font-bold text-[#18181B]">My Requests</h2>
                  </div>
                  <div className="space-y-2">
                    {wishlist.length === 0 ? (
                      <p className="py-6 text-center text-sm text-[#A1A1AA]">No requests yet</p>
                    ) : (
                      wishlist.slice(0, 3).map((w) => (
                        <div
                          key={w._id}
                          className="flex flex-col gap-2 rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] sm:flex-row sm:items-center"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-[#18181B]">{w.title}</p>
                            <p className="text-xs text-[#71717A]">{w.subject} · {w.curriculum}</p>
                          </div>
                          <Badge
                            color={
                              w.status === "match" ? "emerald" : w.status === "potential" ? "amber" : "blue"
                            }
                          >
                            {w.status === "match" ? "Matched" : w.status === "potential" ? "Potential" : "Searching"}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* ── Listings tab ────────────────────────── */}
            {tab === "listings" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-[#52525B]" />
                  <h2 className="text-lg font-bold text-[#18181B]">My Active Listings</h2>
                </div>
                {listings.length === 0 ? (
                  <p className="py-6 text-center text-sm text-[#A1A1AA]">No listings yet</p>
                ) : (
                  listings.slice(0, 5).map((l) => (
                    <div
                      key={l._id}
                      className="flex cursor-pointer items-center gap-4 rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
                    >
                      <span className="text-2xl">{l.image}</span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-[#18181B]">{l.title}</p>
                        <p className="text-xs text-[#71717A]">
                          {l.price === 0 ? "Free" : `₹${l.price}`} · {l.condition}
                          {l.saves ? ` · Saved ${l.saves}` : ""}
                        </p>
                      </div>
                      <Badge color="emerald">Active</Badge>
                    </div>
                  ))
                )}
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4E4E7] bg-white py-2.5 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA]">
                  <Plus size={16} />
                  Add New Listing
                </button>
              </div>
            )}

            {/* ── Activity tab ────────────────────────── */}
            {tab === "activity" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-[#52525B]" />
                  <h2 className="text-lg font-bold text-[#18181B]">Recent Activity</h2>
                </div>
                {ACTIVITY.map((a, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E4E4E7] bg-[#FAFAFA]">
                      <a.icon size={20} className="text-[#52525B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#18181B]">{a.text}</p>
                      <p className="mt-0.5 text-xs text-[#A1A1AA]">{a.time}</p>
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