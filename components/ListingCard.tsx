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
  const [saved, setSaved] = useState(false);
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
    <>
      <style>{`
        .listing-card {
          display: flex;
          gap: 1rem;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 1rem;
          cursor: pointer;
          transition: border-color 0.2s;
          align-items: stretch;
        }
        .listing-card:hover {
          border-color: #18181B;
        }
        .book-icon {
          width: 3.5rem;
          height: 4.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .card-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }
        .title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .title {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.375;
          color: #18181B;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .save-btn {
          margin-top: 0.125rem;
          border-radius: 0.25rem;
          padding: 0.125rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #A1A1AA;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .save-btn:hover {
          color: #18181B;
        }
        .badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }
        .price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .price-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .price {
          font-size: 1rem;
          font-weight: 700;
        }
        .price-free {
          color: #059669;
        }
        .price-regular {
          color: #18181B;
        }
        .original-price {
          font-size: 0.75rem;
          color: #A1A1AA;
          text-decoration: line-through;
        }
        .location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #71717A;
        }
        .seller-row {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .seller-name {
          font-size: 0.75rem;
          color: #71717A;
        }
        .dot {
          color: #D4D4D8;
        }
        @media (min-width: 640px) {
          .listing-card {
            gap: 1.25rem;
            padding: 1.25rem;
          }
          .book-icon {
            width: 4rem;
            height: 5rem;
            font-size: 1.875rem;
          }
        }
      `}</style>

      <article
        className="listing-card"
        onClick={() => onClick(l)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick(l)}
      >
        {/* Book icon */}
        <div
          className="book-icon"
          style={{
            background: l.color + "18",
            border: `1px solid ${l.color}28`,
          }}
        >
          {l.image}
        </div>

        {/* Content */}
        <div className="card-content">
          {/* Title & save */}
          <div className="title-row">
            <h3 className="title">{l.title}</h3>
            <button
              onClick={handleSave}
              disabled={saving}
              aria-label={saved ? "Saved" : "Save listing"}
              className="save-btn"
            >
              <Bookmark
                size={18}
                fill={saved ? "#18181B" : "none"}
                strokeWidth={saved ? 0 : 2}
              />
            </button>
          </div>

          {/* Badges */}
          <div className="badges-row">
            <Badge color="violet">{l.subject}</Badge>
            <Badge color="slate">{l.grade}</Badge>
            {l.notes && <Badge color="emerald">Notes</Badge>}
            {l.mentor && <Badge color="amber">Mentor</Badge>}
            {l.donated && <Badge color="rose">Free</Badge>}
            {l.exchange && <Badge color="blue">Exchange</Badge>}
          </div>

          {/* Price + condition */}
          <div className="price-row">
            <div className="price-left">
              <span className={`price ${l.price === 0 ? "price-free" : "price-regular"}`}>
                {l.price === 0 ? "Free" : `₹${l.price}`}
              </span>
              {l.price > 0 && (
                <span className="original-price">₹{l.originalPrice}</span>
              )}
              <Badge color={CONDITION_COLOR[l.condition] ?? "slate"}>
                {l.condition}
              </Badge>
            </div>
            <div className="location">
              <MapPin size={12} />
              <span>{l.city}</span>
            </div>
          </div>

          {/* Seller row */}
          <div className="seller-row">
            <Avatar initials={l.sellerInitials} size="xs" />
            <span className="seller-name">{l.seller}</span>
            <span className="dot">·</span>
            <StarRating rating={l.rating} />
          </div>
        </div>
      </article>
    </>
  );
}