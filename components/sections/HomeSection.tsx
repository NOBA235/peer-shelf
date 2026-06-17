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
  onTabChange: (t: string) => void;
  onListingClick: (l: Listing) => void;
  onMentorClick: (m: Mentor) => void;
  onScan: () => void;
  onWishlist: () => void;
}

/* ── Combined search (styles now in HomeSection scope) ─────── */
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
    <div className="combined-search">
      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Physics, NCERT Chemistry, Organic…"
        />
        <button onClick={search} disabled={loading} className="search-btn">
          {loading ? "…" : "Search"}
        </button>
      </div>

      {loading && (
        <div className="search-loading">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {searched && !loading && (
        <div className="search-results">
          {books.length > 0 && (
            <div className="result-group">
              <p className="result-label">Books ({books.length})</p>
              {books.map((b) => (
                <div key={b._id} className="result-item">
                  <span className="result-icon">{b.image}</span>
                  <div className="result-info">
                    <p className="result-title">{b.title}</p>
                    <p className="result-meta">{b.condition} · {b.city}</p>
                  </div>
                  <span className="result-price">
                    {b.price === 0 ? "Free" : `₹${b.price}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {mentors.length > 0 && (
            <div className="result-group">
              <p className="result-label">Mentors ({mentors.length})</p>
              {mentors.map((m) => (
                <div key={m._id} className="result-item">
                  <Avatar initials={m.initials} size="sm" />
                  <div className="result-info">
                    <p className="result-title">{m.name}</p>
                    <p className="result-meta">{m.achievement}</p>
                  </div>
                  <StarRating rating={m.rating} />
                </div>
              ))}
            </div>
          )}

          {books.length === 0 && mentors.length === 0 && (
            <p className="no-results">
              Nothing found.{" "}
              <span className="link">Request this resource →</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main HomeSection ───────────────────────────────────── */
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
  const [showRoadmap, setShowRoadmap] = useState(false);

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
    <>
      <style>{`
        /* ── Global Reset & Container ───────────── */
        .home-container {
          background: #FAFAFA;
          color: #18181B;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
        }
        .section {
          padding: 3rem 1rem;
          max-width: 72rem;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .section {
            padding: 4rem 1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .section {
            padding: 5rem 2rem;
          }
        }

        /* ── Typography ──────────────────────────── */
        .section-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #A1A1AA;
        }
        .heading-lg {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
          color: #18181B;
          margin-top: 0.5rem;
        }
        .body-sm {
          font-size: 0.875rem;
          color: #52525B;
        }
        .body-md {
          font-size: 1rem;
          color: #52525B;
        }

        /* ── Hero ────────────────────────────────── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }
        .hero-avatars {
          display: flex;
          margin-bottom: 0.5rem;
        }
        .hero-avatars div {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          border: 2px solid #FAFAFA;
          overflow: hidden;
          background: #F4F4F5;
          margin-right: -0.5rem;
          position: relative;
        }
        .hero-title {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.25;
          color: #18181B;
        }
        @media (min-width: 640px) {
          .hero-title {
            font-size: 2rem;
          }
        }
        @media (min-width: 1024px) {
          .hero-title {
            font-size: 2.25rem;
          }
        }
        .hero-desc {
          margin-top: 0.75rem;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #52525B;
        }
        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .hero-cta {
          border-radius: 0.5rem;
          background: #18181B;
          border: none;
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }
        .hero-cta:hover {
          background: #27272A;
        }
        .hero-outline {
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .hero-outline:hover {
          border-color: #18181B;
          background: #FAFAFA;
        }
        .hero-free-text {
          font-size: 0.75rem;
          color: #A1A1AA;
          margin-top: 1rem;
        }
        .hero-network-card {
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 1.25rem;
        }
        .hero-network-card .live-badge {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .hero-network-card .live-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #18181B;
        }

        /* ── How It Works ────────────────────────── */
        .steps-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .steps-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .step-card {
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 1rem;
          transition: border-color 0.2s;
        }
        .step-card:hover {
          border-color: #18181B;
        }
        .step-number {
          font-size: 0.75rem;
          font-weight: 600;
          color: #D4D4D8;
          margin-bottom: 0.75rem;
        }
        .step-icon {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .step-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #18181B;
        }
        .step-desc {
          margin-top: 0.25rem;
          font-size: 0.75rem;
          line-height: 1.4;
          color: #71717A;
        }

        /* ── Search Section ──────────────────────── */
        .combined-search {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .search-bar {
          display: flex;
          gap: 0.5rem;
        }
        .search-bar input {
          flex: 1;
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: #18181B;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-bar input:focus {
          border-color: #18181B;
          box-shadow: 0 0 0 2px rgba(24,24,27,0.1);
        }
        .search-bar input::placeholder {
          color: #A1A1AA;
        }
        .search-btn {
          border-radius: 0.5rem;
          background: #18181B;
          border: none;
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }
        .search-btn:hover {
          background: #27272A;
        }
        .search-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .search-loading {
          display: flex;
          gap: 0.25rem;
          padding: 0.5rem 0;
        }
        .search-loading .dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background: #A1A1AA;
          animation: bounce 1s infinite ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .search-results {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .result-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .result-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #A1A1AA;
        }
        .result-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .result-item:hover {
          border-color: #18181B;
        }
        .result-icon {
          font-size: 1.25rem;
        }
        .result-info {
          flex: 1;
          min-width: 0;
        }
        .result-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .result-meta {
          font-size: 0.75rem;
          color: #71717A;
        }
        .result-price {
          font-size: 0.875rem;
          font-weight: 600;
          color: #18181B;
          flex-shrink: 0;
        }
        .no-results {
          font-size: 0.875rem;
          color: #71717A;
        }
        .link {
          font-weight: 500;
          color: #18181B;
          text-decoration: underline;
          cursor: pointer;
        }

        /* ── Featured Section ────────────────────── */
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .view-all {
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
        }
        .view-all:hover {
          text-decoration: none;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── CTA Banner ──────────────────────────── */
        .cta-banner {
          border-radius: 1rem;
          background: white;
          border: 1px solid #E4E4E7;
          padding: 2rem;
          text-align: center;
          max-width: 32rem;
          margin: 0 auto;
        }
        .cta-banner .heading-lg {
          margin-top: 0.5rem;
        }
        .cta-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        /* ── Roadmap ─────────────────────────────── */
        .roadmap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .toggle-btn {
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .toggle-btn:hover {
          border-color: #18181B;
        }
        .roadmap-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .roadmap-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .roadmap-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .roadmap-item {
          display: flex;
          gap: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 1rem;
          transition: border-color 0.2s;
        }
        .roadmap-item:hover {
          border-color: #18181B;
        }
        .roadmap-icon {
          font-size: 1.25rem;
          margin-top: 0.125rem;
        }
        .roadmap-content {
          flex: 1;
        }
        .roadmap-title-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }
        .roadmap-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #18181B;
        }
        .roadmap-status {
          border-radius: 999px;
          padding: 0.125rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .roadmap-desc {
          margin-top: 0.25rem;
          font-size: 0.75rem;
          line-height: 1.4;
          color: #71717A;
        }

        /* ── Footer ──────────────────────────────── */
        .footer {
          border-top: 1px solid #E4E4E7;
          padding: 2rem 1rem;
          max-width: 72rem;
          margin: 0 auto;
        }
        .footer-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .footer-inner {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-brand-icon {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.375rem;
          background: #18181B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: white;
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.25rem;
        }
        .footer-links span {
          font-size: 0.75rem;
          color: #71717A;
          cursor: pointer;
          transition: color 0.2s;
        }
        .footer-links span:hover {
          color: #18181B;
        }
        .footer-copy {
          font-size: 0.75rem;
          color: #A1A1AA;
        }
      `}</style>

      <div className="home-container">
        {/* ── HERO ──────────────────────────────────── */}
        <section className="section">
          <div className="hero-grid">
            <div>
              <div className="hero-avatars">
                {communityImages.map((src, idx) => (
                  <div key={idx}>
                    <Image
                      src={src}
                      alt={`Member ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.75rem", color: "#71717A", marginLeft: "0.25rem" }}>
                Joined by students in Nagaland
              </p>
              <h1 className="hero-title">
                Find books & peers within your community
              </h1>
              <p className="hero-desc">
                Affordable textbooks, student mentors, shared notes — everything
                hidden inside your community, now in one place.
              </p>
              <div className="hero-buttons">
                <button onClick={() => onTabChange("marketplace")} className="hero-cta">
                  Browse Resources →
                </button>
                <button onClick={onScan} className="hero-outline">
                  📷 Scan a Book
                </button>
              </div>
              <p className="hero-free-text">Free · No sign-up required</p>
            </div>
            <div className="hero-network-card">
              <div className="live-badge">
                <p className="live-title">Knowledge Network</p>
                <Badge color="emerald">● Live</Badge>
              </div>
              <p className="body-sm" style={{ marginBottom: "1rem" }}>
                Resources flowing through student communities
              </p>
              <NetworkViz />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────── */}
        <section className="section">
          <p className="section-label">How It Works</p>
          <h2 className="heading-lg">From scan to connected in minutes</h2>
          <div className="steps-grid" style={{ marginTop: "1.5rem" }}>
            {[
              ["📸", "Scan a Textbook", "Point your camera at any book cover"],
              ["🤖", "OCR Reads It", "Vision + Open Library fetch metadata instantly"],
              ["📋", "List or Donate", "Set a price, swap, or give it free"],
              ["🤝", "Get Matched", "Connect with students who need it most"],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="step-card">
                <p className="step-number">{String(i + 1).padStart(2, "0")}</p>
                <div className="step-icon">{icon}</div>
                <p className="step-title">{title}</p>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEARCH ────────────────────────────────── */}
        <section className="section">
          <p className="section-label">Search</p>
          <h2 className="heading-lg">Find books & mentors in one go</h2>
          <p className="body-sm" style={{ marginTop: "0.25rem" }}>
            One query across all listings and mentor profiles.
          </p>
          <div style={{ marginTop: "1.25rem" }}>
            <CombinedSearch />
          </div>
        </section>

        {/* ── FEATURED LISTINGS ──────────────────────── */}
        <section className="section">
          <div className="section-header">
            <div>
              <p className="section-label">Marketplace</p>
              <h2 className="heading-lg" style={{ marginTop: "0.25rem" }}>Featured Resources</h2>
            </div>
            <button onClick={() => onTabChange("marketplace")} className="view-all">
              View all →
            </button>
          </div>
          <div className="cards-grid">
            {loadingFeatured
              ? [1, 2, 3, 4].map((i) => <Skeleton key={i} style={{ height: "8rem", borderRadius: "0.75rem" }} />)
              : featuredListings.length === 0
              ? <p className="body-sm" style={{ gridColumn: "span 2" }}>No listings yet — be the first to add one.</p>
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
        <section className="section">
          <div className="section-header">
            <div>
              <p className="section-label">Mentorship Hub</p>
              <h2 className="heading-lg" style={{ marginTop: "0.25rem" }}>Top Mentors</h2>
            </div>
            <button onClick={() => onTabChange("mentors")} className="view-all">
              View all →
            </button>
          </div>
          <div className="cards-grid">
            {loadingFeatured
              ? [1, 2].map((i) => <Skeleton key={i} style={{ height: "10rem", borderRadius: "0.75rem" }} />)
              : featuredMentors.length === 0
              ? <p className="body-sm">No mentors yet.</p>
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
        <section className="section" style={{ textAlign: "center" }}>
          <div className="cta-banner">
            <p className="section-label">Get Started</p>
            <h2 className="heading-lg">Have books collecting dust?</h2>
            <p className="body-md" style={{ marginTop: "0.5rem", maxWidth: "20rem", margin: "0.5rem auto 0" }}>
              Scan, list, and pass them on. A student nearby needs exactly what you’ve already read.
            </p>
            <div className="cta-buttons">
              <button onClick={onScan} className="hero-cta">
                📷 Scan & List Now
              </button>
              <button onClick={onWishlist} className="hero-outline">
                Request a Book
              </button>
            </div>
          </div>
        </section>

        {/* ── ROADMAP ────────────────────────────────── */}
        <section className="section">
          <div className="roadmap-header">
            <div>
              <p className="section-label">Roadmap</p>
              <h2 className="heading-lg" style={{ marginTop: "0.25rem" }}>What's coming next</h2>
            </div>
            <button onClick={() => setShowRoadmap(!showRoadmap)} className="toggle-btn">
              {showRoadmap ? "Collapse ▲" : "Expand ▼"}
            </button>
          </div>

          {showRoadmap && (
            <div className="roadmap-grid">
              {ROADMAP.map((r) => {
                const statusStyles: Record<string, { label: string; bg: string; text: string }> = {
                  next:  { label: "Up next", bg: "#ECFDF5", text: "#047857" },
                  soon:  { label: "Soon",    bg: "#F4F4F5", text: "#52525B" },
                  later: { label: "Later",   bg: "#F4F4F5", text: "#71717A" },
                };
                const st = statusStyles[r.status] || statusStyles.later;
                return (
                  <div key={r.title} className="roadmap-item">
                    <div className="roadmap-icon">{r.icon}</div>
                    <div className="roadmap-content">
                      <div className="roadmap-title-row">
                        <p className="roadmap-title">{r.title}</p>
                        <span
                          className="roadmap-status"
                          style={{ backgroundColor: st.bg, color: st.text }}
                        >
                          {st.label}
                        </span>
                      </div>
                      <p className="roadmap-desc">{r.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── FOOTER ─────────────────────────────────── */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-brand-icon">📚</div>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#18181B" }}>
                Peer<span style={{ color: "#71717A" }}>&</span>Shelf
              </span>
            </div>
            <div className="footer-links">
              {["About", "Contact", "Privacy", "Terms", "Roadmap"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <p className="footer-copy">© 2025 Peer & Shelf</p>
          </div>
        </footer>
      </div>
    </>
  );
}