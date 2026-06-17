"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ROADMAP } from "@/lib/data";
import { fetchListings, fetchMentors, ListingDoc, MentorDoc } from "@/lib/api";
import { Badge, Avatar, StarRating, Skeleton } from "../ui";
import NetworkViz from "../NetworkViz";
import ListingCard from "../ListingCard";
import MentorCard from "../MentorCard";
import { Listing, Mentor } from "@/lib/data";

interface Props {
  onTabChange:    (t: string) => void;
  onListingClick: (l: Listing) => void;
  onMentorClick:  (m: Mentor) => void;
  onScan:         () => void;
  onWishlist:     () => void;
}

/* ── Combined search ──────────────────────────────────── */
function CombinedSearch() {
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);
  const [books,    setBooks]    = useState<ListingDoc[]>([]);
  const [mentors,  setMentors]  = useState<MentorDoc[]>([]);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const [b, m] = await Promise.all([
        fetchListings({ search: query }),
        fetchMentors({ search: query }),
      ]);
      setBooks(b.slice(0, 3));
      setMentors(m.slice(0, 2));
    } catch {
      setBooks([]);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Physics, NCERT Chemistry, Organic…"
          className="flex-1 rounded-lg border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
        />
        <button
          onClick={search}
          disabled={loading}
          className="rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#27272A] disabled:opacity-40"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-1.5 py-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A1A1AA]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {searched && !loading && (
        <div className="space-y-5">
          {books.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A1A1AA]">
                Books ({books.length})
              </p>
              {books.map((b) => (
                <div
                  key={b._id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 transition hover:border-[#18181B]"
                >
                  <span className="text-xl leading-none">{b.image}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#18181B]">{b.title}</p>
                    <p className="text-xs text-[#71717A]">{b.condition} · {b.city}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[#18181B]">
                    {b.price === 0 ? "Free" : `₹${b.price}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {mentors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A1A1AA]">
                Mentors ({mentors.length})
              </p>
              {mentors.map((m) => (
                <div
                  key={m._id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 transition hover:border-[#18181B]"
                >
                  <Avatar initials={m.initials} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#18181B]">{m.name}</p>
                    <p className="truncate text-xs text-[#71717A]">{m.achievement}</p>
                  </div>
                  <StarRating rating={m.rating} />
                </div>
              ))}
            </div>
          )}

          {books.length === 0 && mentors.length === 0 && (
            <p className="text-sm text-[#71717A]">
              Nothing found.{" "}
              <span className="cursor-pointer font-medium text-[#18181B] underline underline-offset-2">
                Request this resource →
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomeSection({
  onTabChange,
  onListingClick,
  onMentorClick,
  onScan,
  onWishlist,
}: Props) {
  const [featuredListings, setFeaturedListings] = useState<ListingDoc[]>([]);
  const [featuredMentors,  setFeaturedMentors]  = useState<MentorDoc[]>([]);
  const [loadingFeatured,  setLoadingFeatured]  = useState(true);
  const [showRoadmap,      setShowRoadmap]       = useState(false);

  useEffect(() => {
    Promise.all([
      fetchListings({ sortBy: "saves" }).catch(() => [] as ListingDoc[]),
      fetchMentors().catch(() => [] as MentorDoc[]),
    ]).then(([l, m]) => {
      setFeaturedListings(l.slice(0, 4));
      setFeaturedMentors(m.slice(0, 2));
      setLoadingFeatured(false);
    });
  }, []);

  const communityImages = [
    "/images/image1.png",
    "/images/image2.png",
    "/images/image3.png",
    "/images/image4.png",
  ];

  return (
    <div className="container-app bg-[#FAFAFA] text-[#18181B]">
      {/* ── HERO ──────────────────────────────────── */}
      <section className="section-pad">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="space-y-5 max-w-prose">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {communityImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-[#FAFAFA] bg-gray-100"
                  >
                    <Image
                      src={src}
                      alt={`Community member ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#71717A]">Joined by students in Nagaland</p>
            </div>

            <h1 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl lg:text-3xl">
              Find books &amp; peers within your community
            </h1>

            <p className="text-sm leading-relaxed text-[#52525B]">
              Affordable textbooks, student mentors, shared notes — everything
              hidden inside your community, now in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onTabChange("marketplace")}
                className="rounded-lg bg-[#18181B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              >
                Browse Resources →
              </button>
              <button
                onClick={onScan}
                className="rounded-lg border border-[#E4E4E7] bg-white px-4 py-2 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              >
                📷 Scan a Book
              </button>
            </div>

            <p className="text-xs text-[#A1A1AA]">Free · No sign-up required</p>
          </div>

          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#18181B]">Knowledge Network</p>
              <Badge color="emerald">● Live</Badge>
            </div>
            <p className="mb-4 text-xs text-[#71717A]">
              Resources flowing through student communities
            </p>
            <NetworkViz />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section className="section-pad">
        <div className="mb-7">
          <p className="section-label">How It Works</p>
          <h2 className="heading-lg">From scan to connected in minutes</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["📸", "Scan a Textbook",  "Point your camera at any book cover"],
            ["🤖", "OCR Reads It",     "Vision + Open Library fetch metadata instantly"],
            ["📋", "List or Donate",   "Set a price, swap, or give it free"],
            ["🤝", "Get Matched",      "Connect with students who need it most"],
          ].map(([icon, title, desc], i) => (
            <div
              key={i}
              className="rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B]"
            >
              <p className="mb-3 text-xs font-semibold text-[#D4D4D8]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="mb-2 text-lg">{icon}</div>
              <p className="text-xs font-semibold text-[#18181B]">{title}</p>
              <p className="mt-1 text-xs text-[#71717A] leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEARCH ────────────────────────────────── */}
      <section className="section-pad">
        <div className="mb-6">
          <p className="section-label">Search</p>
          <h2 className="heading-lg">Find books &amp; mentors in one go</h2>
          <p className="body-sm mt-1">One query across all listings and mentor profiles.</p>
        </div>
        <CombinedSearch />
      </section>

      {/* ── FEATURED LISTINGS ──────────────────────── */}
      <section className="section-pad">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="section-label">Marketplace</p>
            <h2 className="heading-lg">Featured Resources</h2>
          </div>
          <button
            onClick={() => onTabChange("marketplace")}
            className="shrink-0 text-sm font-medium text-[#18181B] underline underline-offset-2 hover:no-underline"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loadingFeatured
            ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)
            : featuredListings.length === 0
            ? <p className="col-span-full text-sm text-[#71717A]">No listings yet — be the first to add one.</p>
            : featuredListings.map((l) => (
                <ListingCard
                  key={l._id}
                  listing={{ ...l, id: l._id } as unknown as Listing}
                  onClick={onListingClick}
                />
              ))}
        </div>
      </section>

      {/* ── TOP MENTORS ──────────────────────────────── */}
      <section className="section-pad">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="section-label">Mentorship Hub</p>
            <h2 className="heading-lg">Top Mentors</h2>
          </div>
          <button
            onClick={() => onTabChange("mentors")}
            className="shrink-0 text-sm font-medium text-[#18181B] underline underline-offset-2 hover:no-underline"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loadingFeatured
            ? [1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)
            : featuredMentors.length === 0
            ? <p className="text-sm text-[#71717A]">No mentors yet.</p>
            : featuredMentors.map((m) => (
                <MentorCard
                  key={m._id}
                  mentor={{ ...m, id: m._id } as unknown as Mentor}
                  onClick={onMentorClick}
                />
              ))}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────── */}
      <section className="section-pad">
        <div className="glass text-center">
          <p className="section-label">Get Started</p>
          <h2 className="heading-lg">Have books collecting dust?</h2>
          <p className="body-md mx-auto max-w-sm mt-2">
            Scan, list, and pass them on. A student nearby needs exactly what
            you’ve already read.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={onScan}
              className="rounded-lg bg-[#18181B] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
            >
              📷 Scan &amp; List Now
            </button>
            <button
              onClick={onWishlist}
              className="rounded-lg border border-[#E4E4E7] bg-white px-5 py-2 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
            >
              Request a Book
            </button>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ────────────────────────────────── */}
      <section className="section-pad">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="section-label">Roadmap</p>
            <h2 className="heading-lg">What&apos;s coming next</h2>
          </div>
          <button
            onClick={() => setShowRoadmap(!showRoadmap)}
            className="shrink-0 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-medium text-[#18181B] transition hover:border-[#18181B]"
          >
            {showRoadmap ? "Collapse ▲" : "Expand ▼"}
          </button>
        </div>

        {showRoadmap && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROADMAP.map((r) => {
              const statusMap: Record<string, { label: string; bg: string; text: string }> = {
                next:  { label: "Up next", bg: "bg-emerald-50", text: "text-emerald-700" },
                soon:  { label: "Soon",    bg: "bg-[#F4F4F5]",  text: "text-[#52525B]"  },
                later: { label: "Later",   bg: "bg-[#F4F4F5]",  text: "text-[#71717A]"  },
              };
              const status = statusMap[r.status] || statusMap.later;
              return (
                <div
                  key={r.title}
                  className="flex items-start gap-3 rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B]"
                >
                  <span className="mt-0.5 text-base">{r.icon}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#18181B]">{r.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-snug text-[#71717A]">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="section-pad border-t border-[#E4E4E7]">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#18181B] text-xs text-white">
              📚
            </div>
            <span className="text-sm font-bold text-[#18181B]">
              Peer<span className="text-[#71717A]">&</span>Shelf
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {["About", "Contact", "Privacy", "Terms", "Roadmap"].map((l) => (
              <span
                key={l}
                className="cursor-pointer text-xs text-[#71717A] transition hover:text-[#18181B]"
              >
                {l}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#A1A1AA]">© 2025 Peer &amp; Shelf</p>
        </div>
      </footer>
    </div>
  );
}