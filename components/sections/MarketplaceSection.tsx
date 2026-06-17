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
    <>
      <style>{`
        .marketplace-wrapper {
          min-height: 100vh;
          background: #FAFAFA;
          display: flex;
          justify-content: center;
        }
        .marketplace-container {
          width: 100%;
          max-width: 64rem;
          padding: 2rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .marketplace-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .search-filter-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: stretch;
        }
        .search-input-wrap {
          position: relative;
          flex: 1;
        }
        .search-input-wrap input {
          width: 100%;
          padding: 0.625rem 0.75rem 0.625rem 2.25rem;
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          font-size: 0.875rem;
          color: #18181B;
          outline: none;
          box-sizing: border-box;
        }
        .search-input-wrap input::placeholder {
          color: #A1A1AA;
        }
        .filter-btn {
          display: inline-flex;
          height: 2.5rem;
          align-items: center;
          gap: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #52525B;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .filter-btn.active {
          border-color: #D4D4D8;
          background: #F4F4F5;
          color: #18181B;
        }
        .chips-row {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .chips-row::-webkit-scrollbar {
          display: none;
        }
        .advanced-filters {
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .filter-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .filter-grid label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717A;
          margin-bottom: 0.375rem;
        }
        .filter-grid select {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #18181B;
          outline: none;
        }
        .results-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .marketplace-container {
            padding: 2.5rem 1.5rem;
            gap: 1.75rem;
          }
          .marketplace-header {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
          }
          .search-filter-row {
            flex-direction: row;
            align-items: center;
          }
          .filter-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .marketplace-container {
            padding: 3rem 2rem;
          }
          .filter-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .results-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
        }
      `}</style>

      <div className="marketplace-wrapper">
        <div className="marketplace-container">
          {/* Header */}
          <div className="marketplace-header">
            <div>
              <SectionLabel>Browse</SectionLabel>
              <h1 style={{ marginTop: "0.25rem", fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2, color: "#18181B" }}>
                Marketplace
              </h1>
              <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#71717A" }}>
                {listings.length} resource{listings.length !== 1 ? "s" : ""} available near you
              </p>
            </div>
            <button
              onClick={onRequest}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #E4E4E7",
                background: "white",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#52525B",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              <BookmarkPlus size={16} />
              Request a Resource
            </button>
          </div>

          {/* Search & filter toggle */}
          <div className="search-filter-row">
            <div className="search-input-wrap">
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#A1A1AA",
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books, notes, formula sheets…"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-btn${showFilters ? " active" : ""}`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilters > 0 && (
                <span style={{ fontSize: "0.75rem", color: "#A1A1AA", marginLeft: "0.25rem" }}>
                  ({activeFilters})
                </span>
              )}
            </button>
          </div>

          {/* Subject chips */}
          <div className="chips-row">
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
            <div className="advanced-filters">
              <div className="filter-grid">
                <div>
                  <label>Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    {TYPES.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Board</label>
                  <select value={board} onChange={(e) => setBoard(e.target.value)}>
                    {BOARDS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    {CITIES.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {[
                      ["createdAt", "Most Recent"],
                      ["price-asc", "Price ↑"],
                      ["price-desc", "Price ↓"],
                      ["saves", "Most Saved"],
                    ].map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
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
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#52525B",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="results-grid">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} style={{ height: "8rem", borderRadius: "0.75rem" }} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              icon={<PackageOpen size={28} style={{ color: "#D4D4D8" }} />}
              title="No resources found"
              desc="Try adjusting filters or request this resource"
            />
          ) : (
            <div className="results-grid">
              {listings.map((l) => (
                <ListingCard key={l._id} listing={toListin(l)} onClick={onListingClick} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}