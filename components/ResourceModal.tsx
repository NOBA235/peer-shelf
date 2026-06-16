"use client";
import { useState, useEffect } from "react";
import { Listing } from "@/lib/data";
import { fetchMentors, fetchListings, createResourceRequest, saveListing, MentorDoc, ListingDoc } from "@/lib/api";
import { Badge, Avatar, StarRating, Skeleton } from "./ui";

interface Props { listing: Listing; onClose: () => void; }

export default function ResourceModal({ listing: l, onClose }: Props) {
  const [tab, setTab]                       = useState<"details"|"seller"|"similar">("details");
  const [linkedMentor, setLinkedMentor]     = useState<MentorDoc | null>(null);
  const [similar, setSimilar]               = useState<ListingDoc[] | null>(null);
  const [sellerCount, setSellerCount]       = useState<number | null>(null);

  // Request state
  const [requesting, setRequesting]         = useState(false);
  const [requested, setRequested]           = useState(false);
  const [requestError, setRequestError]     = useState("");

  // Save/heart state
  const [saved, setSaved]                   = useState(false);
  const [saving, setSaving]                 = useState(false);

  // Fetch linked mentor when listing has mentor=true
  useEffect(() => {
    if (!l.mentor) return;
    fetchMentors({ subject: l.subject })
      .then(ms => setLinkedMentor(ms[0] ?? null))
      .catch(() => setLinkedMentor(null));
  }, [l.mentor, l.subject]);

  // Fetch similar listings when "similar" tab is opened
  useEffect(() => {
    if (tab !== "similar" || similar !== null) return;
    fetchListings({ subject: l.subject })
      .then(items => setSimilar(items.filter(i => i._id !== String(l.id)).slice(0, 4)))
      .catch(() => setSimilar([]));
  }, [tab, l.subject, l.id, similar]);

  // Fetch seller listing count when "seller" tab is opened
  useEffect(() => {
    if (tab !== "seller" || sellerCount !== null) return;
    fetchListings({ search: l.seller })
      .then(items => setSellerCount(items.filter(i => i.seller === l.seller).length))
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-start gap-4 p-6 pb-4 flex-shrink-0">
          <div
            className="w-16 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{ background: l.color + "18", border: `1px solid ${l.color}28` }}
          >
            {l.image}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="heading-md text-white leading-snug">{l.title}</h2>
            <p className="body-sm mt-0.5">by {l.author}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge color="violet">{l.subject}</Badge>
              <Badge color="blue">{l.curriculum}</Badge>
              <Badge color="slate">{l.grade}</Badge>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost btn-sm px-2.5 flex-shrink-0">✕</button>
        </div>

        {/* ── Tab bar ────────────────────────────────────── */}
        <div className="flex px-6 border-b border-white/8 flex-shrink-0">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 body-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                tab === t
                  ? "text-violet-400 border-violet-500"
                  : "text-white/40 border-transparent hover:text-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Scrollable content ─────────────────────────── */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Details tab */}
          {tab === "details" && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ["Price",     l.price === 0 ? "Free" : `₹${l.price}`],
                  ["Condition", l.condition],
                  ["City",      l.city],
                  ["Listed",    `${l.listedDaysAgo}d ago`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white/4 border border-white/6 rounded-xl p-3">
                    <p className="caption">{k}</p>
                    <p className="font-semibold text-white text-sm mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="caption mb-2">Description</p>
                <p className="body-md">{l.description}</p>
              </div>

              <div>
                <p className="caption mb-2">What&apos;s Included</p>
                <div className="space-y-2">
                  {l.included.map(item => (
                    <div key={item} className="flex items-center gap-2 body-sm text-white/70">
                      <span className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center text-[10px] text-emerald-400 flex-shrink-0">
                        ✓
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="caption">Preferred Pickup Point</p>
                  <p className="font-medium text-white text-sm">{l.meetupPoint}</p>
                </div>
              </div>

              {/* Linked mentor — real data from MongoDB */}
              {l.mentor && linkedMentor && (
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 space-y-3">
                  <p className="caption text-amber-400 font-semibold uppercase tracking-wider">
                    🌟 Linked Mentor
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar initials={linkedMentor.initials} size="md" gradient="amber" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">{linkedMentor.name}</p>
                      <p className="caption text-amber-300/70">{linkedMentor.achievement}</p>
                    </div>
                    <StarRating rating={linkedMentor.rating} />
                  </div>
                  <p className="body-sm italic">"{linkedMentor.quote}"</p>
                </div>
              )}
              {l.mentor && !linkedMentor && (
                <div className="bg-white/4 border border-white/6 rounded-xl p-4">
                  <p className="caption">🌟 Fetching linked mentor…</p>
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
                  <p className="font-bold text-white text-lg">{l.seller.replace(".", "")}</p>
                  <StarRating rating={l.rating} />
                  <p className="caption mt-0.5">📍 {l.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/4 border border-white/6 rounded-xl p-3 text-center">
                  <p className="font-bold text-white text-lg">
                    {sellerCount === null ? "…" : sellerCount}
                  </p>
                  <p className="caption">Active Listings</p>
                </div>
                <div className="bg-white/4 border border-white/6 rounded-xl p-3 text-center">
                  <p className="font-bold text-white text-lg">{l.rating}★</p>
                  <p className="caption">Rating</p>
                </div>
              </div>

              <div className="bg-white/4 border border-white/6 rounded-xl p-4 text-center space-y-1">
                <p className="body-sm font-medium text-white">Reviews</p>
                <p className="caption">Reviews aren&apos;t collected yet — coming in a future update.</p>
              </div>
            </div>
          )}

          {/* Similar tab — real listings from MongoDB by subject */}
          {tab === "similar" && (
            <div className="space-y-3">
              <p className="body-sm">
                Other <span className="text-white font-medium">{l.subject}</span> resources available
              </p>
              {similar === null ? (
                <>
                  <Skeleton className="h-14" />
                  <Skeleton className="h-14" />
                  <Skeleton className="h-14" />
                </>
              ) : similar.length === 0 ? (
                <div className="text-center py-8">
                  <p className="body-sm">No other {l.subject} listings yet.</p>
                </div>
              ) : (
                similar.map(s => (
                  <div
                    key={s._id}
                    className="glass glass-hover cursor-pointer rounded-xl p-3 flex items-center gap-3"
                  >
                    <span className="text-2xl">{s.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="body-sm text-white font-medium line-clamp-1">{s.title}</p>
                      <p className="caption">{s.condition} · {s.city}</p>
                    </div>
                    <span className="font-bold text-violet-400 text-sm flex-shrink-0">
                      {s.price === 0 ? "Free" : `₹${s.price}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Footer actions — all wired to real API calls ── */}
        <div className="p-6 pt-4 flex gap-2 border-t border-white/8 flex-shrink-0">
          {requestError && (
            <p className="caption text-rose-400 w-full mb-2">{requestError}</p>
          )}
          {requested ? (
            <div className="flex-1 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 py-3.5 rounded-xl font-semibold text-sm text-center">
              ✓ Request Saved to Database
            </div>
          ) : (
            <button
              onClick={sendRequest}
              disabled={requesting}
              className="btn-primary flex-1 disabled:opacity-50"
              style={{ padding: "0.875rem" }}
            >
              {requesting ? "Sending…" : "Request Resource"}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saved || saving}
            title={saved ? "Saved" : "Save listing"}
            className={`btn-ghost px-4 text-lg transition-all ${saved ? "text-rose-400 border-rose-500/30" : ""}`}
          >
            {saving ? "…" : saved ? "❤️" : "🤍"}
          </button>
        </div>

      </div>
    </div>
  );
}
