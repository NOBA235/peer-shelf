"use client";
import { useState, useEffect } from "react";
import { Listing } from "@/lib/data";
import { fetchMentors, fetchListings, createResourceRequest, saveListing, MentorDoc, ListingDoc } from "@/lib/api";
import { Badge, Avatar, StarRating, Skeleton } from "./ui";

interface Props {
  listing: Listing;
  onClose: () => void;
}

export default function ResourceModal({ listing: l, onClose }: Props) {
  const [tab, setTab] = useState<"details" | "seller" | "similar">("details");
  const [linkedMentor, setLinkedMentor] = useState<MentorDoc | null>(null);
  const [similar, setSimilar] = useState<ListingDoc[] | null>(null);
  const [sellerCount, setSellerCount] = useState<number | null>(null);

  // Request state
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [requestError, setRequestError] = useState("");

  // Save/heart state
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch linked mentor when listing has mentor=true
  useEffect(() => {
    if (!l.mentor) return;
    fetchMentors({ subject: l.subject })
      .then((ms) => setLinkedMentor(ms[0] ?? null))
      .catch(() => setLinkedMentor(null));
  }, [l.mentor, l.subject]);

  // Fetch similar listings when "similar" tab is opened
  useEffect(() => {
    if (tab !== "similar" || similar !== null) return;
    fetchListings({ subject: l.subject })
      .then((items) => setSimilar(items.filter((i) => i._id !== String(l.id)).slice(0, 4)))
      .catch(() => setSimilar([]));
  }, [tab, l.subject, l.id, similar]);

  // Fetch seller listing count when "seller" tab is opened
  useEffect(() => {
    if (tab !== "seller" || sellerCount !== null) return;
    fetchListings({ search: l.seller })
      .then((items) => setSellerCount(items.filter((i) => i.seller === l.seller).length))
      .catch(() => setSellerCount(0));
  }, [tab, l.seller, sellerCount]);

  // Send a real resource request → saved to MongoDB + creates notification
  const sendRequest = async () => {
    setRequesting(true);
    setRequestError("");
    try {
      await createResourceRequest(String(l.id));
      setRequested(true);
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : "Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  // Increment saves counter in MongoDB
  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    try {
      await saveListing(String(l.id));
      setSaved(true);
    } catch {
      // Still mark saved locally even if network fails
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const TABS = ["details", "seller", "similar"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18181B]/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-lg">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-start gap-4 p-6 pb-4">
          <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center rounded-md border border-[#E4E4E7] bg-[#F4F4F5] text-4xl">
            {l.image}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold leading-snug text-[#18181B] sm:text-[24px] sm:leading-[32px]">
              {l.title}
            </h2>
            <p className="mt-0.5 text-sm text-[#52525B]">by {l.author}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge color="violet">{l.subject}</Badge>
              <Badge color="blue">{l.curriculum}</Badge>
              <Badge color="slate">{l.grade}</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1.5 text-[#71717A] transition hover:text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ── Tab bar ────────────────────────────────────── */}
        <div className="flex flex-shrink-0 border-b border-[#E4E4E7] px-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2.5 text-sm font-semibold capitalize transition -mb-px ${
                tab === t
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Scrollable content ─────────────────────────── */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Details tab */}
          {tab === "details" && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Price", l.price === 0 ? "Free" : `₹${l.price}`],
                  ["Condition", l.condition],
                  ["City", l.city],
                  ["Listed", `${l.listedDaysAgo}d ago`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">{k}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#18181B]">{v}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  Description
                </p>
                <p className="text-[16px] text-[#52525B]">{l.description}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  What&apos;s Included
                </p>
                <div className="space-y-2">
                  {l.included.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-[#52525B]">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] text-emerald-700">
                        ✓
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-4 flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                    Preferred Pickup Point
                  </p>
                  <p className="text-sm font-medium text-[#18181B]">{l.meetupPoint}</p>
                </div>
              </div>

              {/* Linked mentor — real data from MongoDB */}
              {l.mentor && linkedMentor && (
                <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-4 space-y-3 border-l-2 border-l-amber-500">
                  <p className="text-xs font-medium uppercase tracking-wider text-amber-700">
                    🌟 Linked Mentor
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar initials={linkedMentor.initials} size="md" gradient="amber" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#18181B]">{linkedMentor.name}</p>
                      <p className="text-xs text-[#71717A]">{linkedMentor.achievement}</p>
                    </div>
                    <StarRating rating={linkedMentor.rating} />
                  </div>
                  <p className="text-sm italic text-[#52525B]">"{linkedMentor.quote}"</p>
                </div>
              )}
              {l.mentor && !linkedMentor && (
                <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-4">
                  <p className="text-sm text-[#71717A]">🌟 Fetching linked mentor…</p>
                </div>
              )}
            </>
          )}

          {/* Seller tab — real listing count from MongoDB, no fake reviews */}
          {tab === "seller" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar initials={l.sellerInitials} size="lg" />
                <div>
                  <p className="text-lg font-bold text-[#18181B]">{l.seller.replace(".", "")}</p>
                  <StarRating rating={l.rating} />
                  <p className="mt-0.5 text-xs text-[#71717A]">📍 {l.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-3 text-center">
                  <p className="text-lg font-bold text-[#18181B]">
                    {sellerCount === null ? "…" : sellerCount}
                  </p>
                  <p className="text-xs text-[#71717A]">Active Listings</p>
                </div>
                <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-3 text-center">
                  <p className="text-lg font-bold text-[#18181B]">{l.rating}★</p>
                  <p className="text-xs text-[#71717A]">Rating</p>
                </div>
              </div>

              <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-4 text-center">
                <p className="text-sm font-medium text-[#18181B]">Reviews</p>
                <p className="mt-1 text-sm text-[#71717A]">
                  Reviews aren&apos;t collected yet — coming in a future update.
                </p>
              </div>
            </div>
          )}

          {/* Similar tab — real listings from MongoDB by subject */}
          {tab === "similar" && (
            <div className="space-y-3">
              <p className="text-sm text-[#52525B]">
                Other <span className="font-medium text-[#18181B]">{l.subject}</span> resources available
              </p>
              {similar === null ? (
                <>
                  <Skeleton className="h-14 rounded-md" />
                  <Skeleton className="h-14 rounded-md" />
                  <Skeleton className="h-14 rounded-md" />
                </>
              ) : similar.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-[#71717A]">No other {l.subject} listings yet.</p>
                </div>
              ) : (
                similar.map((s) => (
                  <div
                    key={s._id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-[#E4E4E7] bg-white p-3 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
                  >
                    <span className="text-2xl">{s.image}</span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-[#18181B]">{s.title}</p>
                      <p className="text-xs text-[#71717A]">{s.condition} · {s.city}</p>
                    </div>
                    <span className="flex-shrink-0 text-sm font-bold text-[#18181B]">
                      {s.price === 0 ? "Free" : `₹${s.price}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Footer actions — all wired to real API calls ── */}
        <div className="flex flex-shrink-0 flex-col gap-2 border-t border-[#E4E4E7] p-6 pt-4">
          {requestError && (
            <p className="text-sm text-rose-600">{requestError}</p>
          )}
          <div className="flex gap-2">
            {requested ? (
              <div className="flex-1 rounded-md border border-emerald-200 bg-emerald-50 py-3.5 text-center text-sm font-semibold text-emerald-700">
                ✓ Request Saved to Database
              </div>
            ) : (
              <button
                onClick={sendRequest}
                disabled={requesting}
                className="flex-1 rounded-md bg-[#18181B] py-3 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 disabled:opacity-50"
              >
                {requesting ? "Sending…" : "Request Resource"}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saved || saving}
              title={saved ? "Saved" : "Save listing"}
              className={`rounded-md border px-4 text-base transition focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 ${
                saved
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-[#E4E4E7] bg-white text-[#18181B] hover:border-[#18181B] hover:bg-[#FAFAFA]"
              }`}
              style={{ minHeight: "48px" }}
            >
              {saving ? "…" : saved ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}