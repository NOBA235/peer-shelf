"use client";
import { useState } from "react";
import { Avatar } from "./ui";
import { createWishlistItem, WishlistDoc } from "@/lib/api";
import {
  X,
  Bookmark,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

export default function WishlistModal({ onClose, onCreated }: Props) {
  const [stage, setStage] = useState<"form" | "searching" | "match">("form");
  const [result, setResult] = useState<WishlistDoc | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    subject: "",
    curriculum: "",
    grade: "",
  });

  const submit = async () => {
    if (!form.title.trim()) {
      setError("Please enter a resource name");
      return;
    }
    setError("");
    setStage("searching");
    try {
      const item = await createWishlistItem(form);
      await new Promise((r) => setTimeout(r, 1800));
      setResult(item);
      setStage("match");
      onCreated?.();
    } catch {
      setError("Something went wrong. Please try again.");
      setStage("form");
    }
  };

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <style>{`
        /* ── Overlay ────────────────────────── */
        .wishlist-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: rgba(24,24,27,0.4);
          backdrop-filter: blur(4px);
          padding: 1rem;
        }
        /* ── Card ───────────────────────────── */
        .wishlist-card {
          width: 100%;
          max-width: 28rem;
          border-radius: 1.25rem;
          background: white;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        /* ── Header ─────────────────────────── */
        .wishlist-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #E4E4E7;
          padding: 1.25rem;
        }
        .wishlist-header .header-content {
          padding-right: 1rem;
        }
        .wishlist-header .header-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .wishlist-header .header-icon svg {
          color: #18181B;
        }
        .wishlist-header .header-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #18181B;
        }
        .wishlist-header .header-subtitle {
          margin-top: 0.125rem;
          font-size: 0.75rem;
          color: #71717A;
        }
        .close-btn {
          border-radius: 0.5rem;
          padding: 0.375rem;
          background: transparent;
          border: none;
          color: #A1A1AA;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          background: #F4F4F5;
          color: #18181B;
        }
        /* ── Body ───────────────────────────── */
        .wishlist-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .wishlist-body .error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #FECACA;
          background: #FFF1F2;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #E11D48;
        }
        /* ── Input fields ───────────────────── */
        .input-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #A1A1AA;
          margin-bottom: 0.25rem;
        }
        .input-group input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: #18181B;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-group input::placeholder {
          color: #A1A1AA;
        }
        .input-group input:focus {
          border-color: #18181B;
          box-shadow: 0 0 0 2px rgba(24,24,27,0.1);
        }
        /* ── Form grid ──────────────────────── */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .form-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        /* ── Buttons ────────────────────────── */
        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.75rem;
          background: #18181B;
          border: none;
          padding: 0.75rem;
          width: 100%;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-primary:hover {
          background: #27272A;
        }
        .btn-primary:focus {
          outline: 2px solid #18181B;
          outline-offset: 2px;
        }
        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.75rem;
          width: 100%;
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-secondary:hover {
          background: #FAFAFA;
          border-color: #18181B;
        }
        .btn-emerald {
          background: #059669;
          color: white;
        }
        .btn-emerald:hover {
          background: #047857;
        }
        /* ── Searching animation ────────────── */
        .searching-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2.5rem 0;
        }
        .spinner {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: 3px solid #E4E4E7;
          border-top-color: #18181B;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .searching-text {
          text-align: center;
        }
        .searching-text .primary {
          font-size: 0.875rem;
          font-weight: 600;
          color: #18181B;
        }
        .searching-text .secondary {
          font-size: 0.75rem;
          color: #71717A;
        }
        /* ── Match result card ──────────────── */
        .match-banner {
          border-radius: 0.75rem;
          border: 1px solid #A7F3D0;
          background: rgba(236,253,245,0.5);
          padding: 1.25rem;
          text-align: center;
        }
        .match-banner .icon {
          margin: 0 auto 0.75rem;
        }
        .match-banner h3 {
          font-size: 1.125rem;
          font-weight: 700;
        }
        .match-banner p {
          margin-top: 0.25rem;
          font-size: 0.875rem;
        }
        .match-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 1rem;
        }
        .match-card .info {
          min-width: 0;
          flex: 1;
        }
        .match-card .info .name {
          font-weight: 600;
          color: #18181B;
        }
        .match-card .info .title {
          font-size: 0.875rem;
          color: #52525B;
        }
        .match-card .info .distance {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #047857;
        }
        .potential-banner, .searching-banner {
          border-radius: 0.75rem;
          border: 1px solid;
          padding: 1.25rem;
          text-align: center;
        }
        .potential-banner {
          border-color: #FCD34D;
          background: rgba(255,251,235,0.5);
        }
        .searching-banner {
          border-color: #BFDBFE;
          background: rgba(239,246,255,0.5);
        }
        /* ── Responsive ──────────────────────── */
        @media (min-width: 640px) {
          .wishlist-overlay {
            align-items: center;
            padding: 1.5rem;
          }
          .wishlist-card {
            border-radius: 1.5rem;
          }
          .wishlist-header {
            padding: 1.5rem;
          }
          .wishlist-body {
            padding: 1.5rem;
          }
          .wishlist-header .header-title {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="wishlist-overlay">
        <div className="wishlist-card">
          {/* Header */}
          <div className="wishlist-header">
            <div className="header-content">
              <div className="header-icon">
                <Bookmark size={20} />
                <h2 className="header-title">Request a Resource</h2>
              </div>
              <p className="header-subtitle">
                We'll match you with nearby students who have what you need.
              </p>
            </div>
            <button onClick={onClose} className="close-btn" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="wishlist-body">
            {stage === "form" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="form-grid" style={{ gap: "1rem" }}>
                  <div className="input-group">
                    <label>Resource Name</label>
                    <input
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="e.g. Physical Chemistry by O.P. Tandon"
                    />
                  </div>
                  <div className="input-group">
                    <label>Subject</label>
                    <input
                      value={form.subject}
                      onChange={(e) => updateField("subject", e.target.value)}
                      placeholder="e.g. Chemistry"
                    />
                  </div>
                  <div className="form-2col">
                    <div className="input-group">
                      <label>Curriculum / Exam</label>
                      <input
                        value={form.curriculum}
                        onChange={(e) => updateField("curriculum", e.target.value)}
                        placeholder="CBSE, NEET…"
                      />
                    </div>
                    <div className="input-group">
                      <label>Grade / Year</label>
                      <input
                        value={form.grade}
                        onChange={(e) => updateField("grade", e.target.value)}
                        placeholder="Class 12"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="error-banner">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button onClick={submit} className="btn-primary">
                  <Search size={16} />
                  Search Network
                </button>
              </div>
            )}

            {stage === "searching" && (
              <div className="searching-container">
                <div className="spinner" />
                <div className="searching-text">
                  <p className="primary">Searching for matches…</p>
                  <p className="secondary">Looking through listings near you</p>
                </div>
              </div>
            )}

            {stage === "match" && result && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {result.status === "match" && (
                  <>
                    <div className="match-banner" style={{ borderColor: "#A7F3D0", background: "rgba(236,253,245,0.5)" }}>
                      <div className="icon">
                        <CheckCircle2 size={32} color="#059669" />
                      </div>
                      <h3 style={{ color: "#065F46" }}>Match Found!</h3>
                      <p style={{ color: "#047857" }}>A student nearby has the exact resource you need.</p>
                    </div>
                    <div className="match-card">
                      <Avatar
                        initials={result.matchName?.slice(0, 2).toUpperCase() ?? "ST"}
                        size="md"
                      />
                      <div className="info">
                        <p className="name">{result.matchName}</p>
                        <p className="title">{result.title}</p>
                        <div className="distance">
                          <MapPin size={12} />
                          {result.matchDistance} away
                        </div>
                      </div>
                    </div>
                    <button className="btn-primary btn-emerald">
                      Contact Seller
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}

                {result.status === "potential" && (
                  <>
                    <div className="potential-banner">
                      <Sparkles size={32} color="#D97706" style={{ margin: "0 auto 0.75rem" }} />
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#92400E" }}>
                        {result.matchCount} Potential Match{result.matchCount !== 1 && "es"}
                      </h3>
                      <p style={{ color: "#92400E" }}>We found listings that might work — added to your wishlist.</p>
                    </div>
                    <button onClick={onClose} className="btn-secondary">
                      View in Wishlist
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}

                {result.status === "searching" && (
                  <>
                    <div className="searching-banner">
                      <Search size={32} color="#2563EB" style={{ margin: "0 auto 0.75rem" }} />
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1E40AF" }}>Added to Wishlist</h3>
                      <p style={{ color: "#1E40AF" }}>No matches yet — we'll notify you when one appears.</p>
                    </div>
                    <button onClick={onClose} className="btn-secondary">
                      Got It
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}