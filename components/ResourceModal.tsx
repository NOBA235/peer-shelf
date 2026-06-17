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
    <>
      <style>{`
        /* Overlay */
        .resource-modal-overlay {
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
        /* Card */
        .resource-modal-card {
          width: 100%;
          max-width: 32rem;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          border-radius: 1.25rem;
          background: white;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        /* Header */
        .resource-modal-header {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 1.5rem 1.25rem;
          flex-shrink: 0;
        }
        .resource-modal-header .book-icon {
          width: 4rem;
          height: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: #FAFAFA;
          font-size: 1.875rem;
          flex-shrink: 0;
        }
        .header-info {
          min-width: 0;
          flex: 1;
        }
        .header-title {
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.3;
          color: #18181B;
        }
        .header-author {
          margin-top: 0.125rem;
          font-size: 0.875rem;
          color: #52525B;
        }
        .header-badges {
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .close-btn {
          flex-shrink: 0;
          border-radius: 0.5rem;
          padding: 0.375rem;
          background: transparent;
          border: none;
          color: #A1A1AA;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .close-btn:hover {
          background: #F4F4F5;
          color: #18181B;
        }
        /* Tabs */
        .tabs-bar {
          display: flex;
          flex-shrink: 0;
          border-bottom: 1px solid #E4E4E7;
          padding: 0 1.5rem;
        }
        .tab-button {
          position: relative;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #A1A1AA;
          transition: color 0.2s;
        }
        .tab-button:hover {
          color: #52525B;
        }
        .tab-button.active {
          color: #18181B;
        }
        .tab-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          border-radius: 9999px;
          background: #18181B;
        }
        /* Body */
        .resource-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .section-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #A1A1AA;
          margin-bottom: 0.5rem;
        }
        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        .stat-card {
          border-radius: 0.5rem;
          border: 1px solid #F4F4F5;
          background: #FAFAFA;
          padding: 0.75rem;
        }
        .stat-label-text {
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #A1A1AA;
        }
        .stat-value-text {
          margin-top: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #18181B;
        }
        .description-text {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #52525B;
        }
        /* Included items */
        .included-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .included-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #52525B;
        }
        /* Pickup card */
        .pickup-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: #FAFAFA;
          padding: 1rem;
        }
        /* Mentor card */
        .mentor-card {
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: #FAFAFA;
          padding: 1rem;
          border-left: 4px solid #F59E0B;
        }
        .mentor-card-header {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #92400E;
          margin-bottom: 0.5rem;
        }
        .mentor-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mentor-name {
          font-weight: 600;
          color: #18181B;
        }
        .mentor-achievement {
          font-size: 0.75rem;
          color: #71717A;
        }
        .mentor-quote {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          font-style: italic;
          color: #52525B;
        }
        /* Seller tab */
        .seller-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .seller-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #18181B;
        }
        .seller-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.125rem;
          font-size: 0.75rem;
          color: #71717A;
        }
        .seller-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        .seller-stat-card {
          border-radius: 0.75rem;
          border: 1px solid #F4F4F5;
          background: #FAFAFA;
          padding: 1rem;
          text-align: center;
        }
        .seller-stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #18181B;
        }
        .seller-stat-label {
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #71717A;
        }
        /* Similar listing item */
        .similar-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.75rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .similar-item:hover {
          border-color: #18181B;
          background: #FAFAFA;
        }
        .similar-image {
          font-size: 1.5rem;
        }
        .similar-info {
          min-width: 0;
          flex: 1;
        }
        .similar-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .similar-meta {
          font-size: 0.75rem;
          color: #71717A;
        }
        .similar-price {
          font-size: 0.875rem;
          font-weight: 700;
          color: #18181B;
          flex-shrink: 0;
        }
        .similar-chevron {
          color: #D4D4D8;
          flex-shrink: 0;
        }
        /* Footer */
        .resource-modal-footer {
          flex-shrink: 0;
          border-top: 1px solid #E4E4E7;
          padding: 1.5rem 1.5rem 1rem;
        }
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .request-btn {
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
        .request-btn:hover {
          background: #27272A;
        }
        .request-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .save-btn {
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          color: #A1A1AA;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .save-btn:hover {
          border-color: #18181B;
          color: #18181B;
          background: #FAFAFA;
        }
        .save-btn.saved {
          border-color: #FECACA;
          background: #FFF1F2;
          color: #E11D48;
        }
        .save-btn:disabled {
          cursor: not-allowed;
        }
        .spinner {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 640px) {
          .resource-modal-overlay {
            align-items: center;
            padding: 1.5rem;
          }
          .resource-modal-card {
            border-radius: 1.5rem;
          }
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .header-title {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="resource-modal-overlay">
        <div className="resource-modal-card">
          {/* Header */}
          <div className="resource-modal-header">
            <div className="book-icon">{l.image}</div>
            <div className="header-info">
              <h2 className="header-title">{l.title}</h2>
              <p className="header-author">by {l.author}</p>
              <div className="header-badges">
                <Badge color="violet">{l.subject}</Badge>
                <Badge color="blue">{l.curriculum}</Badge>
                <Badge color="slate">{l.grade}</Badge>
              </div>
            </div>
            <button onClick={onClose} className="close-btn" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs-bar">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`tab-button${tab === t ? " active" : ""}`}
              >
                {t}
                {tab === t && <span className="tab-underline" />}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="resource-modal-body">
            {tab === "details" && (
              <>
                {/* Quick stats */}
                <div className="stats-grid">
                  {[
                    ["Price", l.price === 0 ? "Free" : `₹${l.price}`],
                    ["Condition", l.condition],
                    ["City", l.city],
                    ["Listed", `${l.listedDaysAgo}d ago`],
                  ].map(([label, value]) => (
                    <div key={label} className="stat-card">
                      <p className="stat-label-text">{label}</p>
                      <p className="stat-value-text">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <p className="section-label">Description</p>
                  <p className="description-text">{l.description}</p>
                </div>

                {/* What's included */}
                <div>
                  <p className="section-label">What's Included</p>
                  <div className="included-list">
                    {l.included.map((item) => (
                      <div key={item} className="included-item">
                        <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pickup point */}
                <div className="pickup-card">
                  <MapPin size={20} color="#71717A" />
                  <div>
                    <p className="stat-label-text" style={{ marginBottom: 0 }}>
                      Preferred Pickup Point
                    </p>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#18181B" }}>
                      {l.meetupPoint}
                    </p>
                  </div>
                </div>

                {/* Linked mentor */}
                {l.mentor && linkedMentor && (
                  <div className="mentor-card">
                    <div className="mentor-card-header">
                      <Sparkles size={14} />
                      Linked Mentor
                    </div>
                    <div className="mentor-row">
                      <Avatar initials={linkedMentor.initials} size="md" />
                      <div style={{ flex: 1 }}>
                        <p className="mentor-name">{linkedMentor.name}</p>
                        <p className="mentor-achievement">{linkedMentor.achievement}</p>
                      </div>
                      <StarRating rating={linkedMentor.rating} />
                    </div>
                    {linkedMentor.quote && (
                      <p className="mentor-quote">“{linkedMentor.quote}”</p>
                    )}
                  </div>
                )}
                {l.mentor && !linkedMentor && (
                  <div style={{ borderRadius: "0.75rem", border: "1px solid #E4E4E7", background: "#FAFAFA", padding: "1rem", fontSize: "0.875rem", color: "#A1A1AA" }}>
                    Fetching linked mentor…
                  </div>
                )}
              </>
            )}

            {tab === "seller" && (
              <>
                <div className="seller-profile">
                  <Avatar initials={l.sellerInitials} size="lg" />
                  <div>
                    <p className="seller-name">{l.seller.replace(".", "")}</p>
                    <StarRating rating={l.rating} />
                    <div className="seller-location">
                      <MapPin size={12} />
                      {l.location}
                    </div>
                  </div>
                </div>

                <div className="seller-stats-grid">
                  <div className="seller-stat-card">
                    <p className="seller-stat-value">
                      {sellerCount === null ? "—" : sellerCount}
                    </p>
                    <p className="seller-stat-label">Active Listings</p>
                  </div>
                  <div className="seller-stat-card">
                    <p className="seller-stat-value">{l.rating}★</p>
                    <p className="seller-stat-label">Rating</p>
                  </div>
                </div>

                <div style={{ borderRadius: "0.75rem", border: "1px solid #E4E4E7", background: "#FAFAFA", padding: "1rem", textAlign: "center", marginTop: "1.25rem" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#18181B" }}>Reviews</p>
                  <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#A1A1AA" }}>
                    Reviews not collected yet — coming in a future update.
                  </p>
                </div>
              </>
            )}

            {tab === "similar" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <p style={{ fontSize: "0.875rem", color: "#52525B" }}>
                  Other{" "}
                  <span style={{ fontWeight: 500, color: "#18181B" }}>{l.subject}</span>{" "}
                  resources available
                </p>
                {similar === null ? (
                  <>
                    <Skeleton style={{ height: "3.5rem", borderRadius: "0.75rem" }} />
                    <Skeleton style={{ height: "3.5rem", borderRadius: "0.75rem" }} />
                    <Skeleton style={{ height: "3.5rem", borderRadius: "0.75rem" }} />
                  </>
                ) : similar.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <BookOpen size={24} color="#D4D4D8" style={{ margin: "0 auto 0.5rem" }} />
                    <p style={{ fontSize: "0.875rem", color: "#71717A" }}>
                      No other {l.subject} listings yet.
                    </p>
                  </div>
                ) : (
                  similar.map((s) => (
                    <div key={s._id} className="similar-item">
                      <span className="similar-image">{s.image}</span>
                      <div className="similar-info">
                        <p className="similar-title">{s.title}</p>
                        <p className="similar-meta">{s.condition} · {s.city}</p>
                      </div>
                      <span className="similar-price">
                        {s.price === 0 ? "Free" : `₹${s.price}`}
                      </span>
                      <ChevronRight size={16} className="similar-chevron" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="resource-modal-footer">
            {requestError && (
              <p style={{ marginBottom: "0.75rem", fontSize: "0.875rem", color: "#E11D48" }}>
                {requestError}
              </p>
            )}
            <div className="action-buttons">
              {requested ? (
                <div style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #A7F3D0",
                  background: "#ECFDF5",
                  padding: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#047857"
                }}>
                  <CheckCircle size={18} />
                  Request Saved
                </div>
              ) : (
                <button
                  onClick={sendRequest}
                  disabled={requesting}
                  className="request-btn"
                  style={{ flex: 1 }}
                >
                  {requesting ? (
                    <>
                      <div className="spinner" />
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
                className={`save-btn${saved ? " saved" : ""}`}
                aria-label={saved ? "Saved" : "Save listing"}
              >
                {saving ? (
                  <div className="spinner" style={{ borderColor: "rgba(0,0,0,0.2)", borderTopColor: "#18181B" }} />
                ) : (
                  <Heart
                    size={20}
                    fill={saved ? "#E11D48" : "none"}
                    strokeWidth={saved ? 0 : 2}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}