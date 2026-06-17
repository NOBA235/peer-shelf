"use client";
import { useState, useEffect } from "react";
import { fetchListings, ListingDoc, ListingFilters } from "@/lib/api";
import { Listing } from "@/lib/data";
import { Card, Chip, Skeleton, EmptyState, SectionLabel } from "../ui";
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

  const activeFilters = [subject !== "All", type !== "All Types", board !== "All Boards", city !== "All Cities"].filter(Boolean).length;

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
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-12 text-[#18181B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionLabel>Browse</SectionLabel>
            <h1 className="text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl">
              Marketplace
            </h1>
            <p className="mt-1 text-sm text-[#52525B]">
              {listings.length} resources available near you
            </p>
          </div>
          <button
            onClick={onRequest}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
          >
            <BookmarkPlus size={16} />
            Request a Resource
          </button>
        </div>

        {/* Search + filter toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books, notes, formula sheets…"
              className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-4 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative inline-flex h-10 flex-shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 ${
              showFilters
                ? "border-[#18181B] bg-[#F4F4F5] text-[#18181B]"
                : "border-[#E4E4E7] bg-white text-[#18181B] hover:border-[#18181B] hover:bg-[#FAFAFA]"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilters > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#18181B] text-[11px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Subject chips */}
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

        {/* Advanced filters */}
        {showFilters && (
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 shadow-sm space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Type", type, setType, TYPES],
                ["Board", board, setBoard, BOARDS],
                ["City", city, setCity, CITIES],
              ].map(([label, val, setter, opts]) => (
                <div key={label as string}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                    {label as string}
                  </label>
                  <select
                    value={val as string}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2.5 text-sm text-[#18181B] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2.5 text-sm text-[#18181B] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
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
                className="text-sm font-medium text-[#18181B] underline underline-offset-2 hover:no-underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<PackageOpen size={32} className="text-[#A1A1AA]" />}
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