"use client";
import { useState, useEffect } from "react";
import { fetchListings, ListingDoc, ListingFilters } from "@/lib/api";
import { Listing } from "@/lib/data";
import { Chip, Skeleton, EmptyState, SectionLabel } from "../ui";
import ListingCard from "../ListingCard";
import { Search, SlidersHorizontal, BookmarkPlus, PackageOpen } from "lucide-react";

function toListin(d: ListingDoc): Listing {
  return { ...d, id: d._id } as unknown as Listing;
}

interface Props {
  onListingClick: (l: Listing) => void;
  onRequest: () => void;
}

const SUBJECTS = ["All", "Physics", "Chemistry", "Biology", "Mathematics", "Accountancy"];
const TYPES = ["All Types", "Textbook", "Notes", "Study Guide", "Formula Sheet"];
const BOARDS = ["All Boards", "CBSE", "ICSE", "IB"];
const CITIES = ["All Cities", "Delhi", "Mumbai", "Bengaluru", "Pune"];

export default function MarketplaceSection({ onListingClick, onRequest }: Props) {
  const [listings, setListings] = useState<ListingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [type, setType] = useState("All Types");
  const [board, setBoard] = useState("All Boards");
  const [city, setCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters =
    [subject !== "All", type !== "All Types", board !== "All Boards", city !== "All Cities"].filter(
      Boolean
    ).length;

  const load = async (overrides: Partial<ListingFilters> = {}) => {
    try {
      setLoading(true);
      const data = await fetchListings({
        subject: subject !== "All" ? subject : undefined,
        city: city !== "All Cities" ? city : undefined,
        board: board !== "All Boards" ? board : undefined,
        type: type !== "All Types" ? type : undefined,
        sortBy,
        ...overrides,
      });
      setListings(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [subject, city, board, type, sortBy]);

  useEffect(() => {
    const t = setTimeout(() => load({ search: search || undefined }), 350);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-10 text-[#18181B] sm:px-6 lg:px-8">
      {/* Narrower SaaS-style container */}
      <div className="mx-auto max-w-5xl space-y-10">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionLabel>Browse</SectionLabel>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Marketplace</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {listings.length} resources available near you
            </p>
          </div>
          <button
            onClick={onRequest}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          >
            <BookmarkPlus size={16} />
            Request a Resource
          </button>
        </div>

        {/* ── Search & filter toggle ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books, notes, formula sheets…"
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex h-10 flex-shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition focus:outline-none ${
              showFilters
                ? "border-zinc-300 bg-zinc-50 text-zinc-900"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilters > 0 && (
              <span className="text-xs text-zinc-400">({activeFilters})</span>
            )}
          </button>
        </div>

        {/* ── Subject chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SUBJECTS.map((s) => (
            <Chip
              key={s}
              active={subject === s}
              onClick={() => setSubject(s)}
              className="whitespace-nowrap"
            >
              {s}
            </Chip>
          ))}
        </div>

        {/* ── Advanced filters ── */}
        {showFilters && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Type", type, setType, TYPES],
                ["Board", board, setBoard, BOARDS],
                ["City", city, setCity, CITIES],
              ].map(([label, val, setter, opts]) => (
                <div key={label as string}>
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    {label as string}
                  </label>
                  <select
                    value={val as string}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/20"
                  >
                    {(opts as string[]).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/20"
                >
                  {[
                    ["createdAt", "Most Recent"],
                    ["price-asc", "Price ↑"],
                    ["price-desc", "Price ↓"],
                    ["saves", "Most Saved"],
                  ].map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setSubject("All");
                  setType("All Types");
                  setBoard("All Boards");
                  setCity("All Cities");
                }}
                className="text-sm font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── Results ── */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<PackageOpen size={32} className="text-zinc-300" />}
            title="No resources found"
            desc="Try adjusting filters or request this resource"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {listings.map((l) => (
              <ListingCard key={l._id} listing={toListin(l)} onClick={onListingClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}