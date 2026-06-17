"use client";
import { useState } from "react";
import { Listing } from "@/lib/data";
import { saveListing } from "@/lib/api";
import { Badge, Avatar, StarRating } from "./ui";
import { MapPin, Bookmark } from "lucide-react";

const CONDITION_COLOR: Record<string, string> = {
  "Like New": "emerald",
  "Very Good": "blue",
  "Good": "violet",
  "Fair": "amber",
};

interface Props {
  listing: Listing;
  onClick: (l: Listing) => void;
}

export default function ListingCard({ listing: l, onClick }: Props) {
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
      setSaved(true); // optimistic
    } finally {
      setSaving(false);
    }
  };

  return (
    <article
      onClick={() => onClick(l)}
      className="group flex cursor-pointer gap-4 rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B] sm:gap-5 sm:p-5"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(l)}
    >
      {/* Book icon */}
      <div
        className="flex h-[72px] w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl sm:h-20 sm:w-16 sm:text-3xl"
        style={{ background: l.color + "18", border: `1px solid ${l.color}28` }}
      >
        {l.image}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Title & save */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-[#18181B] line-clamp-2 group-hover:text-[#18181B]">
            {l.title}
          </h3>
          <button
            onClick={handleSave}
            disabled={saving}
            aria-label={saved ? "Saved" : "Save listing"}
            className="mt-0.5 flex-shrink-0 rounded p-0.5 text-[#A1A1AA] transition hover:text-[#18181B]"
          >
            <Bookmark
              size={18}
              fill={saved ? "#18181B" : "none"}
              strokeWidth={saved ? 0 : 2}
            />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          <Badge color="violet">{l.subject}</Badge>
          <Badge color="slate">{l.grade}</Badge>
          {l.notes    && <Badge color="emerald">Notes</Badge>}
          {l.mentor   && <Badge color="amber">Mentor</Badge>}
          {l.donated  && <Badge color="rose">Free</Badge>}
          {l.exchange && <Badge color="blue">Exchange</Badge>}
        </div>

        {/* Price + condition */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-base font-bold ${l.price === 0 ? "text-emerald-600" : "text-[#18181B]"}`}>
              {l.price === 0 ? "Free" : `₹${l.price}`}
            </span>
            {l.price > 0 && (
              <span className="text-xs text-[#A1A1AA] line-through">₹{l.originalPrice}</span>
            )}
            <Badge color={CONDITION_COLOR[l.condition] ?? "slate"}>{l.condition}</Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#71717A]">
            <MapPin size={12} />
            <span>{l.city}</span>
          </div>
        </div>

        {/* Seller row */}
        <div className="flex items-center gap-1.5">
          <Avatar initials={l.sellerInitials} size="xs" />
          <span className="text-xs text-[#71717A]">{l.seller}</span>
          <span className="text-[#D4D4D8]">·</span>
          <StarRating rating={l.rating} />
        </div>
      </div>
    </article>
  );
}