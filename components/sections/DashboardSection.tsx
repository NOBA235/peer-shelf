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

/* ── Static activity feed ─────────── */
const ACTIVITY = [
  { icon: Package, text: "You listed H.C. Verma Vol 1 & 2", time: "2d ago" },
  { icon: ArrowUpRight, text: "Successful exchange with Priya N.", time: "5d ago" },
  { icon: FileText, text: "Uploaded Physics formula sheet", time: "1w ago" },
  { icon: Star, text: "Mentorship session with Aditi S.", time: "2w ago" },
];

const REPUTATION = [
  { label: "Books Shared", value: 12, max: 50, icon: Package },
  { label: "Notes Shared", value: 28, max: 50, icon: FileText },
  { label: "Students Helped", value: 34, max: 100, icon: Users },
  { label: "Mentorship Sessions", value: 7, max: 25, icon: Star },
  { label: "Exchanges", value: 9, max: 25, icon: ArrowUpRight },
];

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  match: <CheckCircle2 size={16} color="#10B981" />,
  mentor: <Star size={16} color="#8B5CF6" />,
  save: <Heart size={16} color="#F43F5E" />,
  review: <Star size={16} color="#F59E0B" />,
  system: <Bell size={16} color="#A1A1AA" />,
};

const stats = [
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
    <>
      {/* Scoped responsive styles – no Tailwind needed */}
      <style>{`
        .dash-container {
          padding: 2rem 1rem;
          max-width: 64rem;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .profile-card-inner {
          flex-direction: column;
          gap: 1rem;
        }
        .stats-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .tab-bar {
          display: flex;
          border-bottom: 1px solid #E4E4E7;
        }
        .notif-row {
          flex-direction: column;
          align-items: flex-start;
        }
        .rep-row {
          flex-direction: column;
          align-items: flex-start;
        }
        .wish-row {
          flex-direction: column;
          align-items: flex-start;
        }
        .list-row {
          flex-direction: row;
          align-items: center;
        }
        @media (min-width: 640px) {
          .dash-container {
            padding: 3rem 1.5rem;
          }
          .profile-card-inner {
            flex-direction: row;
            gap: 1.5rem;
          }
          .notif-row {
            flex-direction: row;
            align-items: center;
          }
          .rep-row {
            flex-direction: row;
            align-items: center;
          }
          .wish-row {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA", color: "#18181B" }}>
        <div className="dash-container">
          {/* Profile card */}
          <div
            style={{
              borderRadius: "1rem",
              border: "1px solid #E4E4E7",
              backgroundColor: "white",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div className="profile-card-inner" style={{ display: "flex" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Avatar initials="YO" size="xl" />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-0.125rem",
                    right: "-0.125rem",
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    border: "2px solid white",
                    backgroundColor: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  ✓
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
                  Your Dashboard
                </h1>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#52525B" }}>
                  Member since Jan 2024
                </p>
                <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <Badge color="violet">Top Contributor</Badge>
                  <Badge color="emerald">Verified Student</Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ display: "grid", marginTop: "1.5rem" }}>
              {stats.map(({ value, label, Icon }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.375rem",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#18181B",
                    }}
                  >
                    <Icon size={18} color="#52525B" />
                    {value}
                  </div>
                  <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#71717A" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-bar">
            {(["overview", "listings", "activity"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  position: "relative",
                  padding: "0.75rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: tab === t ? "#18181B" : "#A1A1AA",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (tab !== t) (e.currentTarget.style.color = "#52525B");
                }}
                onMouseLeave={(e) => {
                  if (tab !== t) (e.currentTarget.style.color = "#A1A1AA");
                }}
              >
                {t}
                {tab === t && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      borderRadius: "9999px",
                      backgroundColor: "#18181B",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} style={{ height: "3.5rem", borderRadius: "0.75rem" }} />
              ))}
            </div>
          ) : (
            <>
              {/* Overview tab */}
              {tab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {/* Notifications */}
                  <section>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Bell size={20} color="#52525B" />
                        <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Notifications</h2>
                      </div>
                      {unread > 0 && <Badge color="violet">{unread} new</Badge>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {notifs.length === 0 ? (
                        <p style={{ padding: "1.5rem 0", textAlign: "center", fontSize: "0.875rem", color: "#A1A1AA" }}>
                          No notifications yet
                        </p>
                      ) : (
                        notifs.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            className="notif-row"
                            style={{
                              display: "flex",
                              gap: "0.75rem",
                              borderRadius: "0.75rem",
                              border: "1px solid #E4E4E7",
                              backgroundColor: n.read ? "white" : "#FAFAFA",
                              padding: "1rem",
                              borderLeft: n.read ? undefined : "4px solid #18181B",
                              transition: "border-color 0.2s",
                              alignItems: "center",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#18181B")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E4E4E7")}
                          >
                            <span style={{ flexShrink: 0, marginTop: "0.125rem" }}>
                              {NOTIF_ICONS[n.type] || <Bell size={16} color="#A1A1AA" />}
                            </span>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ fontSize: "0.875rem", lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {n.text}
                              </p>
                              <p style={{ marginTop: "0.125rem", fontSize: "0.75rem", color: "#A1A1AA" }}>{n.time}</p>
                            </div>
                            {!n.read && (
                              <div
                                style={{
                                  width: "0.5rem",
                                  height: "0.5rem",
                                  borderRadius: "50%",
                                  backgroundColor: "#18181B",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {/* Reputation */}
                  <section>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                      <TrendingUp size={20} color="#52525B" />
                      <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Reputation</h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {REPUTATION.map((r) => (
                        <div
                          key={r.label}
                          className="rep-row"
                          style={{
                            display: "flex",
                            borderRadius: "0.75rem",
                            border: "1px solid #E4E4E7",
                            backgroundColor: "white",
                            padding: "1rem",
                            gap: "0.75rem",
                          }}
                        >
                          <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "0.75rem" }}>
                            <r.icon size={18} color="#52525B" />
                            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{r.label}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              maxWidth: "13rem",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                height: "0.5rem",
                                flex: 1,
                                borderRadius: "9999px",
                                backgroundColor: "#F4F4F5",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  borderRadius: "9999px",
                                  backgroundColor: "#18181B",
                                  width: `${Math.min((r.value / r.max) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <span style={{ width: "1.5rem", textAlign: "right", fontSize: "0.875rem", fontWeight: 700 }}>
                              {r.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Wishlist status */}
                  <section>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                      <Sparkles size={20} color="#52525B" />
                      <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>My Requests</h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {wishlist.length === 0 ? (
                        <p style={{ padding: "1.5rem 0", textAlign: "center", fontSize: "0.875rem", color: "#A1A1AA" }}>
                          No requests yet
                        </p>
                      ) : (
                        wishlist.slice(0, 3).map((w) => (
                          <div
                            key={w._id}
                            className="wish-row"
                            style={{
                              display: "flex",
                              borderRadius: "0.75rem",
                              border: "1px solid #E4E4E7",
                              backgroundColor: "white",
                              padding: "1rem",
                              gap: "0.75rem",
                              transition: "border-color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#18181B")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E4E4E7")}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {w.title}
                              </p>
                              <p style={{ fontSize: "0.75rem", color: "#71717A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                  </section>
                </div>
              )}

              {/* Listings tab */}
              {tab === "listings" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Package size={20} color="#52525B" />
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>My Active Listings</h2>
                  </div>
                  {listings.length === 0 ? (
                    <p style={{ padding: "1.5rem 0", textAlign: "center", fontSize: "0.875rem", color: "#A1A1AA" }}>
                      No listings yet
                    </p>
                  ) : (
                    listings.slice(0, 5).map((l) => (
                      <div
                        key={l._id}
                        className="list-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          borderRadius: "0.75rem",
                          border: "1px solid #E4E4E7",
                          backgroundColor: "white",
                          padding: "1rem",
                          cursor: "pointer",
                          transition: "border-color 0.2s, background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#18181B";
                          e.currentTarget.style.backgroundColor = "#FAFAFA";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E4E4E7";
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>{l.image}</span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {l.title}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: "#71717A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {l.price === 0 ? "Free" : `₹${l.price}`} · {l.condition}
                            {l.saves ? ` · Saved ${l.saves}` : ""}
                          </p>
                        </div>
                        <Badge color="emerald">Active</Badge>
                      </div>
                    ))
                  )}
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      borderRadius: "0.75rem",
                      border: "1px solid #E4E4E7",
                      backgroundColor: "white",
                      padding: "0.625rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#18181B",
                      cursor: "pointer",
                      transition: "border-color 0.2s, background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#18181B";
                      e.currentTarget.style.backgroundColor = "#FAFAFA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E4E4E7";
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <Plus size={16} />
                    Add New Listing
                  </button>
                </div>
              )}

              {/* Activity tab */}
              {tab === "activity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Clock size={20} color="#52525B" />
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Recent Activity</h2>
                  </div>
                  {ACTIVITY.map((a, i) => (
                    <div
                      key={i}
                      className="list-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        borderRadius: "0.75rem",
                        border: "1px solid #E4E4E7",
                        backgroundColor: "white",
                        padding: "1rem",
                        cursor: "pointer",
                        transition: "border-color 0.2s, background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#18181B";
                        e.currentTarget.style.backgroundColor = "#FAFAFA";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#E4E4E7";
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                    >
                      <div
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "0.5rem",
                          border: "1px solid #E4E4E7",
                          backgroundColor: "#FAFAFA",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <a.icon size={20} color="#52525B" />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.text}
                        </p>
                        <p style={{ marginTop: "0.125rem", fontSize: "0.75rem", color: "#A1A1AA" }}>{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}