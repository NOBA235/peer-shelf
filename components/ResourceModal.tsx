"use client";
import { useState, useEffect } from "react";
import { Listing } from "@/lib/data";
import {
  fetchMentors,
  fetchListings,
  createResourceRequest,
  saveListing,
  MentorDoc,
  ListingDoc,
} from "@/lib/api";
import { Badge, Avatar, StarRating, Skeleton } from "./ui";
import {
  X,
  Heart,
  MapPin,
  BookOpen,
  User,
  Clock,
  CheckCircle,
  Send,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface Props {
  listing: Listing;
  onClose: () => void;
}

const TABS = ["details", "seller", "similar"] as const;

export default function ResourceModal({ listing: l, onClose }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("details");
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

  // Fetch linked mentor
  useEffect(() => {
    if (!l.mentor) return;
    fetchMentors({ subject: l.subject })
      .then((ms) => setLinkedMentor(ms[0] ?? null))
      .catch(() => setLinkedMentor(null));
  }, [l.mentor, l.subject]);

  // Fetch similar listings when tab changes to "similar"
  useEffect(() => {
    if (tab !== "similar" || similar !== null) return;
    fetchListings({ subject: l.subject })
      .then((items) =>
        setSimilar(items.filter((i) => i._id !== String(l.id)).slice(0, 4))
      )
      .catch(() => setSimilar([]));
  }, [tab, l.subject, l.id, similar]);

  // Fetch seller listing count
  useEffect(() => {
    if (tab !== "seller" || sellerCount !== null) return;
    fetchListings({ search: l.seller })
      .then((items) =>
        setSellerCount(items.filter((i) => i.seller === l.seller).length)
      )
      .catch(() => setSellerCount(0));
  }, [tab, l.seller, sellerCount]);

  const sendRequest = async () => {
    setRequesting(true);
    setRequestError("");
    try {
      await createResourceRequest(String(l.id));
      setRequested(true);
    } catch (err) {
      setRequestError(
        err instanceof Error ? err.message : "Failed to send request"
      );
    } finally {
      setRequesting(false);
    }
  };

  const handleSave = async () => {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18181B]/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex flex-shrink-0 gap-4 p-6 pb-5">
          <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-3xl">
            {l.image}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold leading-snug text-[#18181B] sm:text-xl">
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
            className="flex-shrink-0 rounded-lg p-1.5 text-[#A1A1AA] transition hover:bg-[#F4F4F5] hover:text-[#18181B]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="flex flex-shrink-0 border-b border-[#E4E4E7] px-6">
          {TABS.map((t) => (
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

        {/* ── Scrollable content ────────────────────────── */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {tab === "details" && (
            <>
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Price", l.price === 0 ? "Free" : `₹${l.price}`],
                  ["Condition", l.condition],
                  ["City", l.city],
                  ["Listed", `${l.listedDaysAgo}d ago`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-[#F4F4F5] bg-[#FAFAFA] p-3"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A1A1AA]">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#18181B]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  Description
                </p>
                <p className="text-sm leading-relaxed text-[#52525B]">
                  {l.description}
                </p>
              </div>

              {/* What's included */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  What&apos;s Included
                </p>
                <div className="space-y-2">
                  {l.included.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-[#52525B]"
                    >
                      <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup point */}
              <div className="flex items-center gap-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4">
                <MapPin size={20} className="text-[#71717A]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    Preferred Pickup Point
                  </p>
                  <p className="text-sm font-medium text-[#18181B]">
                    {l.meetupPoint}
                  </p>
                </div>
              </div>

              {/* Linked mentor */}
              {l.mentor && linkedMentor && (
                <div className="rounded-xl border border-l-4 border-l-amber-500 bg-[#FAFAFA] p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
                    <Sparkles size={14} />
                    Linked Mentor
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar initials={linkedMentor.initials} size="md" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#18181B]">{linkedMentor.name}</p>
                      <p className="text-xs text-[#71717A]">{linkedMentor.achievement}</p>
                    </div>
                    <StarRating rating={linkedMentor.rating} />
                  </div>
                  {linkedMentor.quote && (
                    <p className="mt-3 text-sm italic text-[#52525B]">
                      &ldquo;{linkedMentor.quote}&rdquo;
                    </p>
                  )}
                </div>
              )}
              {l.mentor && !linkedMentor && (
                <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4">
                  <p className="text-sm text-[#A1A1AA]">Fetching linked mentor…</p>
                </div>
              )}
            </>
          )}

          {tab === "seller" && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar initials={l.sellerInitials} size="lg" />
                <div>
                  <p className="text-lg font-bold text-[#18181B]">
                    {l.seller.replace(".", "")}
                  </p>
                  <StarRating rating={l.rating} />
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-[#71717A]">
                    <MapPin size={12} />
                    {l.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#F4F4F5] bg-[#FAFAFA] p-4 text-center">
                  <p className="text-xl font-bold text-[#18181B]">
                    {sellerCount === null ? "—" : sellerCount}
                  </p>
                  <p className="mt-1 text-xs text-[#71717A]">Active Listings</p>
                </div>
                <div className="rounded-xl border border-[#F4F4F5] bg-[#FAFAFA] p-4 text-center">
                  <p className="text-xl font-bold text-[#18181B]">{l.rating}★</p>
                  <p className="mt-1 text-xs text-[#71717A]">Rating</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4 text-center">
                <p className="text-sm font-medium text-[#18181B]">Reviews</p>
                <p className="mt-1 text-xs text-[#A1A1AA]">
                  Reviews not collected yet — coming in a future update.
                </p>
              </div>
            </div>
          )}

          {tab === "similar" && (
            <div className="space-y-3">
              <p className="text-sm text-[#52525B]">
                Other{" "}
                <span className="font-medium text-[#18181B]">{l.subject}</span>{" "}
                resources available
              </p>
              {similar === null ? (
                <>
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </>
              ) : similar.length === 0 ? (
                <div className="py-8 text-center">
                  <BookOpen size={24} className="mx-auto mb-2 text-[#D4D4D8]" />
                  <p className="text-sm text-[#71717A]">
                    No other {l.subject} listings yet.
                  </p>
                </div>
              ) : (
                similar.map((s) => (
                  <div
                    key={s._id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E4E4E7] bg-white p-3 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
                  >
                    <span className="text-2xl">{s.image}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#18181B]">{s.title}</p>
                      <p className="text-xs text-[#71717A]">{s.condition} · {s.city}</p>
                    </div>
                    <span className="flex-shrink-0 text-sm font-bold text-[#18181B]">
                      {s.price === 0 ? "Free" : `₹${s.price}`}
                    </span>
                    <ChevronRight size={16} className="text-[#D4D4D8]" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Footer actions ──────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-[#E4E4E7] p-6 pt-4">
          {requestError && (
            <p className="mb-3 text-sm text-rose-600">{requestError}</p>
          )}
          <div className="flex gap-2">
            {requested ? (
              <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700">
                <CheckCircle size={18} />
                Request Saved
              </div>
            ) : (
              <button
                onClick={sendRequest}
                disabled={requesting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#18181B] py-3 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 disabled:opacity-50"
              >
                {requesting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Request Resource
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className={`flex aspect-square h-12 items-center justify-center rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 ${
                saved
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-[#E4E4E7] bg-white text-[#A1A1AA] hover:border-[#18181B] hover:text-[#18181B]"
              }`}
            >
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#A1A1AA] border-t-[#18181B]" />
              ) : (
                <Heart
                  size={20}
                  fill={saved ? "#e11d48" : "none"}
                  strokeWidth={saved ? 0 : 2}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}