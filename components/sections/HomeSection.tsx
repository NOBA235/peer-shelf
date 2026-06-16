"use client";
import { useState, useEffect, useRef } from "react";
import { STATS, ROADMAP } from "@/lib/data";
import { fetchListings, fetchMentors, ListingDoc, MentorDoc } from "@/lib/api";
import { Badge, Avatar, StarRating, Skeleton } from "../ui";
import NetworkViz from "../NetworkViz";
import ListingCard from "../ListingCard";
import MentorCard from "../MentorCard";
import { Listing, Mentor } from "@/lib/data";

interface Props {
  onTabChange: (t: string) => void;
  onListingClick: (l: Listing) => void;
  onMentorClick: (m: Mentor) => void;
  onScan: () => void;
  onWishlist: () => void;
}

/* ── Animated stat counter ─────────────────────────────── */
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / 1800, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ── Combined search — real MongoDB queries ───────────── */
function CombinedSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [books, setBooks] = useState<ListingDoc[]>([]);
  const [mentors, setMentors] = useState<MentorDoc[]>([]);

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
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="e.g. Physics, NCERT Chemistry, Organic…"
          className="flex-1 rounded-md border border-[#E4E4E7] bg-white px-4 py-2.5 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
        />
        <button
          onClick={search}
          disabled={loading}
          className="h-11 min-w-[88px] rounded-md bg-[#18181B] px-5 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center gap-1.5 py-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-[#18181B]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {searched && !loading && (
        <div className="space-y-4">
          {books.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#71717A]">
                📚 Listings ({books.length})
              </p>
              <div className="mt-2 space-y-2">
                {books.map((b) => (
                  <div
                    key={b._id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-[#E4E4E7] bg-white p-3 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
                  >
                    <span className="text-2xl">{b.image}</span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-[#18181B]">
                        {b.title}
                      </p>
                      <p className="text-xs text-[#71717A]">
                        {b.price === 0 ? "Free" : `₹${b.price}`} · {b.condition} · {b.city}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#18181B]">
                      {b.price === 0 ? "Free" : `₹${b.price}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mentors.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#71717A]">
                🌟 Mentors ({mentors.length})
              </p>
              <div className="mt-2 space-y-2">
                {mentors.map((m) => (
                  <div
                    key={m._id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-[#E4E4E7] bg-white p-3 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
                  >
                    <Avatar initials={m.initials} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#18181B]">{m.name}</p>
                      <p className="text-xs text-[#71717A]">{m.achievement}</p>
                    </div>
                    <StarRating rating={m.rating} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {books.length === 0 && mentors.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-sm text-[#52525B]">
                No results —{" "}
                <span className="cursor-pointer font-medium text-[#18181B] underline underline-offset-2">
                  request this resource
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────── */
export default function HomeSection({
  onTabChange,
  onListingClick,
  onMentorClick,
  onScan,
  onWishlist,
}: Props) {
  const [featuredListings, setFeaturedListings] = useState<ListingDoc[]>([]);
  const [featuredMentors, setFeaturedMentors] = useState<MentorDoc[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 text-[#18181B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* ── HERO — two column on large screens ────────────── */}
        <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-4 py-1.5 text-xs font-medium text-[#52525B]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Real‑time Resource Network
            </div>

            <h1 className="text-[36px] font-bold leading-[44px] tracking-tight text-[#18181B] md:text-[48px] md:leading-[56px] lg:text-[48px]">
              Turn Every Student Shelf{" "}
              <span className="text-[#18181B]">Into a Knowledge Network</span>
            </h1>

            <p className="text-[18px] leading-[28px] text-[#52525B] max-w-lg mx-auto lg:mx-0">
              Discover affordable textbooks, connect with mentors, share notes, and unlock
              educational resources hidden within your community.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                onClick={() => onTabChange("marketplace")}
                className="h-11 rounded-md bg-[#18181B] px-6 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              >
                Browse Resources →
              </button>
              <button
                onClick={onScan}
                className="h-11 rounded-md border border-[#E4E4E7] bg-white px-6 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              >
                📷 Scan a Book
              </button>
            </div>

            <p className="text-sm text-[#71717A]">Free to use · No sign‑up required</p>

            {/* Stats grid — clean, minimal */}
            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-md border border-[#E4E4E7] bg-white p-4 text-center">
                  <div className="mb-1 text-2xl">{s.icon}</div>
                  <div className="text-xl font-bold text-[#18181B]">
                    <Counter target={s.value} />+
                  </div>
                  <div className="text-xs text-[#71717A]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Network Viz card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-xl border border-[#E4E4E7] bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#18181B]">Knowledge Network</p>
                <Badge color="emerald">● Live</Badge>
              </div>
              <p className="mt-1 text-sm text-[#52525B]">Resources flowing through student communities</p>
              <div className="mt-4">
                <NetworkViz />
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[#71717A]">How It Works</p>
            <h2 className="text-[24px] font-bold leading-[32px] text-[#18181B] md:text-[30px] md:leading-[38px]">
              4 steps to unlock resources
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["📸", "Scan a Textbook", "Point camera at any book cover"],
              ["🤖", "Vision OCR Reads It", "Google Vision + Open Library fetch real metadata"],
              ["📋", "List or Donate", "Set price, swap terms, or give free"],
              ["🤝", "Get Matched", "Connect with students who need it"],
            ].map(([icon, title, desc], i) => (
              <div
                key={i}
                className="relative rounded-xl border border-[#E4E4E7] bg-white p-6 transition hover:border-[#18181B]"
              >
                <div className="absolute right-4 top-4 text-4xl font-black text-[#E4E4E7] select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-[#E4E4E7] bg-[#FAFAFA] text-xl">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#18181B]">{title}</p>
                  <p className="mt-0.5 text-sm text-[#52525B]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Search ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#71717A]">Search</p>
            <h2 className="text-[24px] font-bold leading-[32px] text-[#18181B] md:text-[30px] md:leading-[38px]">
              Find books &amp; mentors together
            </h2>
            <p className="mt-1 text-[16px] text-[#52525B]">
              One search across listings and mentor profiles in MongoDB.
            </p>
          </div>
          <CombinedSearch />
        </section>

        {/* ── Featured Listings ─────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#71717A]">Marketplace</p>
              <h2 className="text-[24px] font-bold leading-[32px] text-[#18181B]">Featured Resources</h2>
            </div>
            <button
              onClick={() => onTabChange("marketplace")}
              className="text-sm font-medium text-[#18181B] underline underline-offset-2 hover:no-underline"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {loadingFeatured
              ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)
              : featuredListings.length === 0
              ? <p className="text-sm text-[#71717A]">No listings yet — be the first to add one.</p>
              : featuredListings.map((l) => (
                  <ListingCard
                    key={l._id}
                    listing={{ ...l, id: l._id } as unknown as Listing}
                    onClick={onListingClick}
                  />
                ))}
          </div>
        </section>

        {/* ── Top Mentors ───────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#71717A]">Mentorship Hub</p>
              <h2 className="text-[24px] font-bold leading-[32px] text-[#18181B]">Top Mentors</h2>
            </div>
            <button
              onClick={() => onTabChange("mentors")}
              className="text-sm font-medium text-[#18181B] underline underline-offset-2 hover:no-underline"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {loadingFeatured
              ? [1, 2].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)
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

        {/* ── CTA Banner ────────────────────────────────────── */}
        <section className="rounded-xl border border-[#E4E4E7] bg-white p-8 text-center sm:p-10">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[#71717A]">Get started</p>
            <h2 className="text-[24px] font-bold leading-[32px] text-[#18181B] md:text-[30px] md:leading-[38px]">
              Have books you no longer need?
            </h2>
            <p className="mx-auto max-w-md text-[16px] text-[#52525B]">
              Help a student who needs them — scan, list, and share your knowledge.
            </p>
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={onScan}
              className="h-11 rounded-md bg-[#18181B] px-6 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
            >
              📷 Scan &amp; List Now
            </button>
            <button
              onClick={onWishlist}
              className="h-11 rounded-md border border-[#E4E4E7] bg-white px-6 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
            >
              Request a Book
            </button>
          </div>
        </section>

        {/* ── Roadmap ───────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="space-y-2 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[#71717A]">Platform Roadmap</p>
            <h2 className="text-[24px] font-bold leading-[32px] text-[#18181B] md:text-[30px] md:leading-[38px]">
              What&apos;s coming next
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROADMAP.map((r) => {
              const statusMap: Record<string, { label: string; bg: string; text: string }> = {
                next: { label: "Up next", bg: "bg-emerald-50", text: "text-emerald-700" },
                soon: { label: "Soon", bg: "bg-[#F4F4F5]", text: "text-[#52525B]" },
                later: { label: "Later", bg: "bg-[#F4F4F5]", text: "text-[#71717A]" },
              };
              const status = statusMap[r.status] || statusMap.later;
              return (
                <div
                  key={r.title}
                  className="flex items-start gap-3 rounded-xl border border-[#E4E4E7] bg-white p-4 transition hover:border-[#18181B]"
                >
                  <span className="text-2xl">{r.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#18181B]">{r.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-[#52525B]">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer className="border-t border-[#E4E4E7] pt-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#18181B] text-sm text-white">
              📚
            </div>
            <span className="text-lg font-bold text-[#18181B]">
              Peer<span className="text-[#52525B]">&</span>Shelf
            </span>
          </div>
          <p className="mx-auto mt-2 max-w-xs text-sm text-[#52525B]">
            Unlocking educational resources hidden within student communities.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6">
            {["About", "Contact", "Privacy", "Terms", "Roadmap"].map((l) => (
              <span
                key={l}
                className="cursor-pointer text-xs font-medium uppercase tracking-wider text-[#71717A] transition hover:text-[#18181B]"
              >
                {l}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs text-[#71717A]/60">© 2025 Peer &amp; Shelf</p>
        </footer>
      </div>
    </div>
  );
}