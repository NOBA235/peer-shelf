"use client";
import { useState, useEffect } from "react";
import { fetchWishlist, deleteWishlistItem, WishlistDoc } from "@/lib/api";
import { Badge, Skeleton, EmptyState, SectionLabel } from "../ui";
import {
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  Eye,
} from "lucide-react";

interface Props {
  onRequest: () => void;
}

const STATUS_CFG: Record<
  string,
  { label: string; color: "emerald" | "amber" | "blue" }
> = {
  match: { label: "Match Found", color: "emerald" },
  potential: { label: "Potential Match", color: "amber" },
  searching: { label: "Searching", color: "blue" },
};

export default function WishlistSection({ onRequest }: Props) {
  const [items, setItems] = useState<WishlistDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    try {
      await deleteWishlistItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      /* ignore */
    }
  };

  const matchedCount = items.filter((i) => i.status === "match").length;
  const potentialCount = items.filter((i) => i.status === "potential").length;
  const searchingCount = items.filter((i) => i.status === "searching").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA", color: "#18181B" }}>
      <div
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: "48rem", // max-w-3xl
          padding: "2rem 1rem", // py-8 px-4
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem", // space-y-6
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
          className="sm:flex-row sm:items-start"
        >
          <div>
            <SectionLabel>Resource Matching</SectionLabel>
            <h1
              style={{
                marginTop: "0.25rem",
                fontSize: "1.5rem",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
              className="sm:text-3xl"
            >
              Your Wishlist
            </h1>
            <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#52525B" }}>
              Resources you&apos;re looking for — we&apos;ll notify when matched.
            </p>
          </div>
          <button
            onClick={onRequest}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "#18181B",
              padding: "0.625rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "white",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#27272A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#18181B")
            }
          >
            <Plus size={16} />
            Request a Resource
          </button>
        </div>

        {/* Quick stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.5rem",
          }}
          className="sm:gap-4"
        >
          {[
            { count: matchedCount, label: "Matched", icon: CheckCircle2, color: "#059669" },
            { count: potentialCount, label: "Potential", icon: Eye, color: "#D97706" },
            { count: searchingCount, label: "Searching", icon: Clock, color: "#2563EB" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                borderRadius: "0.75rem",
                border: "1px solid #E4E4E7",
                backgroundColor: "white",
                padding: "0.75rem",
              }}
              className="sm:p-4"
            >
              <stat.icon size={20} color={stat.color} className="sm:h-6 sm:w-6" />
              <p style={{ fontSize: "1.125rem", fontWeight: 700, lineHeight: 1 }}>
                {stat.count}
              </p>
              <p style={{ fontSize: "0.625rem", color: "#71717A" }} className="sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Match alert banner */}
        {items.some((i) => i.status === "match") && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.75rem",
              borderRadius: "0.75rem",
              border: "1px solid #A7F3D0",
              backgroundColor: "rgba(236, 253, 245, 0.5)",
              padding: "0.75rem 1rem",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#6EE7B7")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#A7F3D0")
            }
          >
            <div
              style={{
                display: "flex",
                width: "2rem",
                height: "2rem",
                flexShrink: 0,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "#D1FAE5",
              }}
              className="sm:w-10 sm:h-10"
            >
              <Sparkles size={16} color="#047857" className="sm:size-5" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#065F46",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Match found!
              </p>
              <p
                style={{
                  marginTop: "0.125rem",
                  fontSize: "0.75rem",
                  color: "#047857",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {items.find((i) => i.status === "match")?.matchName} has a
                resource you need.
              </p>
            </div>
            <ChevronRight size={16} color="#059669" style={{ flexShrink: 0 }} />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} style={{ height: "6rem", borderRadius: "0.75rem" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={28} color="#A1A1AA" />}
            title="Your wishlist is empty"
            desc="Request a textbook or notes and we'll instantly search for nearby matches."
          />
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
            className="sm:gap-4"
          >
            {items.map((item) => {
              const cfg = STATUS_CFG[item.status];
              const isMatch = item.status === "match";
              const isPotential = item.status === "potential";
              const isSearching = item.status === "searching";

              return (
                <li
                  key={item._id}
                  style={{
                    borderRadius: "0.75rem",
                    border: "1px solid #E4E4E7",
                    backgroundColor: "white",
                    padding: "0.75rem",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  className="sm:p-4 hover:border-[#18181B]/50 hover:shadow-sm"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(24,24,27,0.5)";
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E4E4E7";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title}
                      </h3>
                      <div
                        style={{
                          marginTop: "0.5rem",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.375rem",
                        }}
                      >
                        <Badge color="violet">{item.subject}</Badge>
                        <Badge color="blue">{item.curriculum}</Badge>
                        <Badge color="slate">{item.grade}</Badge>
                      </div>
                      <p
                        style={{
                          marginTop: "0.375rem",
                          fontSize: "0.75rem",
                          color: "#71717A",
                        }}
                      >
                        Added {item.addedDaysAgo}d ago
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <Badge color={cfg.color}>{cfg.label}</Badge>
                      <button
                        onClick={() => remove(item._id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#A1A1AA",
                          fontSize: "0.75rem",
                          padding: 0,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#E11D48")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#A1A1AA")
                        }
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Match highlight */}
                  {isMatch && item.matchName && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #A7F3D0",
                        backgroundColor: "rgba(236, 253, 245, 0.6)",
                        padding: "0.5rem 0.75rem",
                      }}
                      className="sm:px-4 sm:py-3"
                    >
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#065F46",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.matchName} has this resource
                        </p>
                        {item.matchDistance && (
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#047857",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.matchDistance} away
                          </p>
                        )}
                      </div>
                      <ChevronRight size={14} color="#059669" style={{ flexShrink: 0 }} />
                    </div>
                  )}

                  {/* Potential matches */}
                  {isPotential && item.matchCount && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #FCD34D",
                        backgroundColor: "rgba(255, 251, 235, 0.6)",
                        padding: "0.5rem 0.75rem",
                      }}
                      className="sm:px-4 sm:py-3"
                    >
                      <Eye size={16} color="#D97706" style={{ flexShrink: 0 }} />
                      <p
                        style={{
                          minWidth: 0,
                          flex: 1,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#92400E",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.matchCount} potential listing
                        {item.matchCount > 1 ? "s" : ""} nearby
                      </p>
                      <ChevronRight size={14} color="#D97706" style={{ flexShrink: 0 }} />
                    </div>
                  )}

                  {/* Searching indicator */}
                  {isSearching && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: "0.375rem",
                              height: "0.375rem",
                              borderRadius: "50%",
                              backgroundColor: "#A1A1AA",
                              animation: "bounce 1s infinite",
                              animationDelay: `${i * 0.15}s`,
                            }}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#71717A" }}>
                        Scanning network for matches…
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}