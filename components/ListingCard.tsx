"use client";
import { useState } from "react";
import { Listing } from "@/lib/data";
import { saveListing } from "@/lib/api";
import { Badge, Avatar, StarRating } from "./ui";

const CONDITION_COLOR: Record<string, string> = {
  "Like New": "emerald",
  "Very Good": "blue",
  "Good": "violet",
  "Fair": "amber",
};

export default function ListingCard({
  listing: l,
  onClick,
}: {
  listing: Listing;
  onClick: (l: Listing) => void;
}) {
  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved || saving) return;
    setSaving(true);
    try {
      await saveListing(String(l.id));
      setSaved(true);
    } catch {
      setSaved(true); // Optimistic — mark saved even if request failed
    } finally {
      setSaving(false);
    }
  };

  return (
    <article
      onClick={() => onClick(l)}
      className="glass glass-hover cursor-pointer p-4 sm:p-5 group"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick(l)}
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Book icon */}
        <div
          className="w-14 h-[72px] sm:w-16 sm:h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl sm:text-4xl"
          style={{ background: l.color + "18", border: `1px solid ${l.color}28` }}
        >
          {l.image}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title + save */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="body-md font-semibold text-white line-clamp-2 group-hover:text-violet-200 transition-colors leading-snug">
              {l.title}
            </h3>
            <button
              onClick={handleSave}
              disabled={saving}
              aria-label={saved ? "Saved" : "Save listing"}
              className={`flex-shrink-0 text-base transition-all mt-0.5 ${
                saved ? "scale-110 opacity-100" : "opacity-40 hover:opacity-80"
              }`}
            >
              {saving ? "…" : saved ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1">
            <Badge color="violet">{l.subject}</Badge>
            <Badge color="slate">{l.grade}</Badge>
            {l.notes    && <Badge color="emerald">📝 Notes</Badge>}
            {l.mentor   && <Badge color="amber">🌟 Mentor</Badge>}
            {l.donated  && <Badge color="rose">❤️ Free</Badge>}
            {l.exchange && <Badge color="blue">🔄 Exchange</Badge>}
          </div>

          {/* Price + condition */}
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-base ${l.price === 0 ? "text-emerald-400" : "text-white"}`}>
                {l.price === 0 ? "Free" : `₹${l.price}`}
              </span>
              {l.price > 0 && (
                <span className="body-sm line-through opacity-40">₹{l.originalPrice}</span>
              )}
              <Badge color={CONDITION_COLOR[l.condition] ?? "slate"}>{l.condition}</Badge>
            </div>
            <span className="caption">📍 {l.city}</span>
          </div>

          {/* Seller */}
          <div className="flex items-center gap-1.5">
            <Avatar initials={l.sellerInitials} size="xs" />
            <span className="caption">{l.seller}</span>
            <span className="caption opacity-40">·</span>
            <StarRating rating={l.rating} />
          </div>
        </div>
      </div>
    </article>
  );
}
