"use client";
import { useState, useEffect } from "react";
import { fetchWishlist, deleteWishlistItem, WishlistDoc } from "@/lib/api";
import { Badge, Skeleton, EmptyState, SectionLabel } from "../ui";

interface Props {
  onRequest: () => void;
}

const STATUS_CFG = {
  match: { label: "✓ Match Found", color: "emerald" as const },
  potential: { label: "~ Potential Match", color: "amber" as const },
  searching: { label: "⟳ Searching", color: "blue" as const },
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
      setItems((p) => p.filter((i) => i._id !== id));
    } catch {
      /* ignore */
    }
  };

  const matched = items.filter((i) => i.status !== "searching");

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 text-[#18181B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <SectionLabel>Resource Matching</SectionLabel>
            <h1 className="text-[30px] font-bold leading-[38px] tracking-tight text-[#18181B] md:text-[36px] md:leading-[44px]">
              My Wishlist
            </h1>
            <p className="mt-0.5 text-sm text-[#52525B]">
              Resources you&apos;re looking for
            </p>
          </div>
          <button
            onClick={onRequest}
            className="h-10 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
          >
            + Request
          </button>
        </div>

        {/* Match found alert */}
        {items.some((i) => i.status === "match") && (
          <div className="flex items-center gap-3 rounded-xl border border-[#E4E4E7] bg-white p-4">
            <span className="text-2xl">🎉</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#18181B]">Match Found!</p>
              <p className="text-sm text-[#52525B]">
                {items.find((i) => i.status === "match")?.matchName} has your resource nearby
              </p>
            </div>
            <button className="flex-shrink-0 text-sm font-medium text-[#18181B] underline underline-offset-2 hover:no-underline">
              View →
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Total", items.length, "📋"],
            ["Matched", matched.length, "✅"],
            ["Searching", items.filter((i) => i.status === "searching").length, "🔍"],
          ].map(([l, v, icon]) => (
            <div
              key={l as string}
              className="rounded-md border border-[#E4E4E7] bg-white p-4 text-center"
            >
              <div className="mb-1 text-2xl">{icon}</div>
              <div className="text-xl font-bold text-[#18181B]">{v}</div>
              <div className="mt-0.5 text-xs text-[#71717A]">{l}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="Your wishlist is empty"
            desc="Request resources and we'll match you with nearby students"
          />
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const cfg = STATUS_CFG[item.status];
              const isMatch = item.status === "match";
              const isPotential = item.status === "potential";
              const isSearching = item.status === "searching";

              return (
                <div
                  key={item._id}
                  className="rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#18181B]">{item.title}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        <Badge color="violet">{item.subject}</Badge>
                        <Badge color="blue">{item.curriculum}</Badge>
                        <Badge color="slate">{item.grade}</Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-[#71717A]">
                        Added {item.addedDaysAgo}d ago
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                      <Badge color={cfg.color}>{cfg.label}</Badge>
                      <button
                        onClick={() => remove(item._id)}
                        className="text-xs text-[#71717A] transition hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {isMatch && item.matchName && (
                    <div className="flex items-center gap-2 rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-3">
                      <span>🎉</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-emerald-700">
                          {item.matchName} has this resource
                        </p>
                        {item.matchDistance && (
                          <p className="text-xs text-[#71717A]">{item.matchDistance} away</p>
                        )}
                      </div>
                      <button className="text-xs font-medium text-[#18181B] underline underline-offset-2 hover:no-underline">
                        Contact →
                      </button>
                    </div>
                  )}

                  {isPotential && item.matchCount && (
                    <div className="flex items-center gap-2 rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-3">
                      <span>👀</span>
                      <p className="flex-1 text-xs font-medium text-amber-700">
                        {item.matchCount} potential listings found
                      </p>
                      <button className="text-xs font-medium text-[#18181B] underline underline-offset-2 hover:no-underline">
                        View →
                      </button>
                    </div>
                  )}

                  {isSearching && (
                    <div className="flex items-center gap-2 text-xs text-[#71717A]">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#18181B]"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                      Scanning network for matches…
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}