"use client";
import { useState } from "react";
import { Mentor } from "@/lib/data";
import { Badge, Avatar, StarRating } from "./ui";
import { X, MapPin, BookOpen, MessageCircle, CheckCircle2, Clock } from "lucide-react";

interface Props {
  mentor: Mentor;
  onClose: () => void;
}

export default function MentorModal({ mentor: m, onClose }: Props) {
  const [tab, setTab] = useState<"overview" | "resources">("overview");
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const sendRequest = async () => {
    setRequesting(true);
    await new Promise((r) => setTimeout(r, 600));
    setRequested(true);
    setRequesting(false);
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: rgba(24, 24, 27, 0.4);
          backdrop-filter: blur(4px);
          padding: 1rem;
        }
        .modal-card {
          display: flex;
          flex-direction: column;
          max-height: 92vh;
          width: 100%;
          max-width: 32rem;
          border-radius: 1.25rem;
          background: white;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          overflow: hidden;
        }
        .modal-header {
          position: relative;
          flex-shrink: 0;
          padding: 1.5rem 1.5rem 1.25rem;
        }
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          border-radius: 50%;
          padding: 0.375rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #A1A1AA;
          transition: background 0.2s, color 0.2s;
        }
        .close-btn:hover {
          background: #F4F4F5;
          color: #18181B;
        }
        .mentor-main {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding-right: 2rem;
        }
        .mentor-avatar-wrapper {
          position: relative;
          flex-shrink: 0;
        }
        .verified-badge {
          position: absolute;
          bottom: -0.125rem;
          right: -0.125rem;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          border: 2px solid white;
          background: #10B981;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          font-weight: 700;
          color: white;
        }
        .mentor-info {
          min-width: 0;
          flex: 1;
        }
        .mentor-name {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.2;
          color: #18181B;
        }
        .mentor-subject {
          font-size: 0.875rem;
          font-weight: 500;
          color: #7c3aed;
        }
        .mentor-location {
          margin-top: 0.125rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #71717A;
        }
        .stats-row {
          margin-top: 1.25rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }
        .stat-item {
          border-radius: 0.5rem;
          border: 1px solid #F4F4F5;
          background: #FAFAFA;
          padding: 0.75rem 0.5rem;
          text-align: center;
        }
        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: #18181B;
        }
        .stat-label {
          margin-top: 0.125rem;
          font-size: 0.625rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717A;
        }
        .tabs-bar {
          display: flex;
          flex-shrink: 0;
          border-bottom: 1px solid #E4E4E7;
          padding: 0 1.5rem;
        }
        .tab-btn {
          position: relative;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .tab-btn.active {
          color: #18181B;
        }
        .tab-btn.inactive {
          color: #A1A1AA;
        }
        .tab-btn.inactive:hover {
          color: #52525B;
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
        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .section-label {
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #A1A1AA;
        }
        .bio-text {
          font-size: 0.875rem;
          line-height: 1.625;
          color: #52525B;
        }
        .badges-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .subjects-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .review-placeholder {
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: #FAFAFA;
          padding: 1rem;
          text-align: center;
        }
        .books-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .book-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .book-info p:first-child {
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
        }
        .book-info p:last-child {
          font-size: 0.75rem;
          color: #71717A;
        }
        .stat-divider {
          border-top: 1px solid #F4F4F5;
          margin: 0;
        }
        .stat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
        }
        .stat-row-label {
          font-size: 0.875rem;
          color: #52525B;
        }
        .stat-row-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #18181B;
        }
        .quote-box {
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: #FAFAFA;
          padding: 1.25rem;
        }
        .quote-text {
          font-size: 0.875rem;
          font-style: italic;
          line-height: 1.5;
          color: #52525B;
        }
        .footer-cta {
          flex-shrink: 0;
          border-top: 1px solid #E4E4E7;
          padding: 1.5rem 1.5rem 1rem;
        }
        .request-sent {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.75rem;
          border: 1px solid #A7F3D0;
          background: #ECFDF5;
          padding: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #047857;
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
          .modal-overlay {
            align-items: center;
            padding: 1.5rem;
          }
          .modal-card {
            border-radius: 1.5rem;
          }
          .mentor-name {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-card">
          {/* Header */}
          <div className="modal-header">
            <button onClick={onClose} className="close-btn" aria-label="Close modal">
              <X size={20} />
            </button>

            <div className="mentor-main">
              <div className="mentor-avatar-wrapper">
                <Avatar initials={m.initials} size="xl" />
                <div className="verified-badge">✓</div>
              </div>
              <div className="mentor-info">
                <h2 className="mentor-name">{m.name}</h2>
                <p className="mentor-subject">{m.subject} Mentor</p>
                <div className="mentor-location">
                  <MapPin size={12} />
                  <span>{m.location}</span>
                </div>
                <div style={{ marginTop: "0.25rem" }}>
                  <StarRating rating={m.rating} />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-row">
              {[
                [m.sessions, "Sessions"],
                [m.notesShared, "Notes"],
                [m.studentsHelped, "Helped"],
                [m.reviews, "Reviews"],
              ].map(([value, label]) => (
                <div key={label as string} className="stat-item">
                  <p className="stat-value">{value}</p>
                  <p className="stat-label">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-bar">
            {(["overview", "resources"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`tab-btn ${tab === t ? "active" : "inactive"}`}
              >
                {t}
                {tab === t && <span className="tab-underline" />}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="modal-body">
            {tab === "overview" && (
              <>
                <div>
                  <p className="section-label">About</p>
                  <p className="bio-text">{m.bio}</p>
                </div>

                <div>
                  <p className="section-label">Achievements</p>
                  <div className="badges-wrap">
                    <Badge color="amber">{m.grade}</Badge>
                    <Badge color="violet">{m.achievement}</Badge>
                    <Badge color="blue">{m.board}</Badge>
                  </div>
                </div>

                <div>
                  <p className="section-label">Subjects Covered</p>
                  <div className="subjects-wrap">
                    {m.subjects.map((s) => (
                      <Badge key={s} color="slate">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="review-placeholder">
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#18181B" }}>
                    Student Reviews
                  </p>
                  {m.reviews > 0 ? (
                    <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#71717A" }}>
                      <Clock size={14} />
                      <span>{m.reviews} reviews recorded — display coming soon.</span>
                    </div>
                  ) : (
                    <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#A1A1AA" }}>
                      No reviews yet.
                    </p>
                  )}
                </div>
              </>
            )}

            {tab === "resources" && (
              <>
                <div style={{ borderRadius: "0.75rem", border: "1px solid #E4E4E7", background: "#FAFAFA", padding: "1.25rem" }}>
                  <p className="section-label" style={{ marginBottom: "0.75rem" }}>Books That Helped</p>
                  <ul className="books-list">
                    {m.books.map((b) => (
                      <li key={b} className="book-item">
                        <BookOpen size={18} style={{ marginTop: "0.125rem", flexShrink: 0, color: "#A1A1AA" }} />
                        <div className="book-info">
                          <p>{b}</p>
                          <p>Used for {m.subject} mastery</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="quote-box">
                  <p className="quote-text">"{m.quote}"</p>
                </div>

                <div>
                  <p className="section-label" style={{ marginBottom: "0.75rem" }}>Mentor Stats</p>
                  <div style={{ borderRadius: "0.75rem", border: "1px solid #E4E4E7", background: "white" }}>
                    {[
                      ["Sessions completed", m.sessions],
                      ["Notes shared", m.notesShared],
                      ["Students helped", m.studentsHelped],
                    ].map(([label, value], index) => (
                      <div key={label as string}>
                        {index > 0 && <hr className="stat-divider" />}
                        <div className="stat-row">
                          <span className="stat-row-label">{label}</span>
                          <span className="stat-row-value">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer CTA */}
          <div className="footer-cta">
            {requested ? (
              <div className="request-sent">
                <CheckCircle2 size={18} />
                Mentorship Request Sent
              </div>
            ) : (
              <button onClick={sendRequest} disabled={requesting} className="request-btn">
                {requesting ? (
                  <>
                    <div className="spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    Request Mentorship
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}