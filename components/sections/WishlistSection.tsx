"use client";
import { useState, useEffect } from "react";
import { fetchWishlist, deleteWishlistItem, WishlistDoc } from "@/lib/api";
import { Badge, Skeleton, EmptyState, SectionLabel } from "../ui";
import { CheckCircle2, Circle, Clock, Plus, Trash2, ChevronRight, Sparkles, Eye } from "lucide-react";

interface Props {
  onRequest: () => void;
}

const STATUS_CFG: Record<string, { label: string; color: "emerald" | "amber" | "blue" }> = {
  match:     { label: "Match Found",     color: "emerald" },
  potential: { label: "Potential Match", color: "amber" },
  searching: { label: "Searching",       color: "blue" },
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
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-12 text-[#18181B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionLabel>Resource Matching</SectionLabel>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Your Wishlist</h1>
            <p className="mt-1 text-sm text-[#52525B]">
              Resources you&apos;re looking for — we&apos;ll notify when matched.
            </p>
          </div>
          <button
            onClick={onRequest}
            className="inline-flex items-center gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
          >
            <Plus size={16} />
            Request a Resource
          </button>
        </div>

        {/* Quick stats – now stack on mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {[
            { count: matchedCount, label: "Matched", icon: CheckCircle2, color: "text-emerald-600" },
            { count: potentialCount, label: "Potential", icon: Eye, color: "text-amber-600" },
            { count: searchingCount, label: "Searching", icon: Clock, color: "text-blue-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-row items-center gap-3 rounded-xl border border-[#E4E4E7] bg-white p-4 sm:flex-col sm:items-center sm:justify-center sm:gap-2 sm:p-5"
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <div className="flex items-baseline gap-1 sm:flex-col sm:items-center sm:gap-0">
                <p className="text-2xl font-bold leading-tight">{stat.count}</p>
                <p className="text-xs text-[#71717A] sm:mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Match alert banner – flexible on mobile */}
        {items.some((i) => i.status === "match") && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 px-5 py-4 transition hover:border-emerald-300 sm:flex-nowrap sm:gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles size={20} className="text-emerald-700" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-800 truncate">Match found!</p>
              <p className="mt-0.5 text-xs text-emerald-700 truncate">
                {items.find((i) => i.status === "match")?.matchName} has a resource you need.
              </p>
            </div>
            <ChevronRight size={18} className="flex-shrink-0 text-emerald-600" />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={32} className="text-[#A1A1AA]" />}
            title="Your wishlist is empty"
            desc="Request a textbook or notes and we'll instantly search for nearby matches."
          />
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const cfg = STATUS_CFG[item.status];
              const isMatch = item.status === "match";
              const isPotential = item.status === "potential";
              const isSearching = item.status === "searching";

              return (
                <li
                  key={item._id}
                  className="rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge color="violet">{item.subject}</Badge>
                        <Badge color="blue">{item.curriculum}</Badge>
                        <Badge color="slate">{item.grade}</Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-[#71717A]">
                        Added {item.addedDaysAgo}d ago
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge color={cfg.color}>{cfg.label}</Badge>
                      <button
                        onClick={() => remove(item._id)}
                        className="text-xs text-[#A1A1AA] hover:text-rose-600 transition rounded focus:outline-none"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Match highlight */}
                  {isMatch && item.matchName && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 sm:flex-nowrap">
                      <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-emerald-800 truncate">
                          {item.matchName} has this resource
                        </p>
                        {item.matchDistance && (
                          <p className="text-xs text-emerald-700 truncate">{item.matchDistance} away</p>
                        )}
                      </div>
                      <ChevronRight size={16} className="flex-shrink-0 text-emerald-600" />
                    </div>
                  )}

                  {/* Potential matches */}
                  {isPotential && item.matchCount && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 sm:flex-nowrap">
                      <Eye size={18} className="text-amber-600 flex-shrink-0" />
                      <p className="min-w-0 flex-1 text-sm font-medium text-amber-800 truncate">
                        {item.matchCount} potential listing{item.matchCount > 1 ? "s" : ""} nearby
                      </p>
                      <ChevronRight size={16} className="flex-shrink-0 text-amber-600" />
                    </div>
                  )}

                  {/* Searching indicator */}
                  {isSearching && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A1A1AA]"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[#71717A]">Scanning network for matches…</p>
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