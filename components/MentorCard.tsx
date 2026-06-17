"use client";
import { Mentor } from "@/lib/data";
import { Badge, Avatar, StarRating } from "./ui";
import { MapPin, MessageCircle } from "lucide-react";

interface Props {
  mentor: Mentor;
  onClick: (m: Mentor) => void;
}

export default function MentorCard({ mentor: m, onClick }: Props) {
  return (
    <>
      <style>{`
        .mentor-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 1.25rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .mentor-card:hover {
          border-color: #18181B;
        }
        .mentor-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .mentor-avatar {
          position: relative;
          flex-shrink: 0;
        }
        .online-dot {
          position: absolute;
          bottom: -0.125rem;
          right: -0.125rem;
          width: 0.875rem;
          height: 0.875rem;
          border-radius: 50%;
          border: 2px solid white;
          background-color: #10B981;
        }
        .mentor-info {
          min-width: 0;
          flex: 1;
        }
        .mentor-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #18181B;
        }
        .mentor-subject {
          font-size: 0.75rem;
          font-weight: 500;
          color: #7c3aed;
        }
        .mentor-achievement {
          margin-top: 0.125rem;
          font-size: 0.75rem;
          color: #71717A;
        }
        .mentor-meta {
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.375rem;
        }
        .mentor-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #71717A;
        }
        .mentor-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          text-align: center;
        }
        .stat-card {
          border-radius: 0.5rem;
          border: 1px solid #F4F4F5;
          background: #FAFAFA;
          padding: 0.75rem 0.5rem;
        }
        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: #18181B;
        }
        .stat-label {
          margin-top: 0.125rem;
          font-size: 0.625rem;
          color: #71717A;
          line-height: 1.25;
        }
        .mentor-bio {
          font-size: 0.75rem;
          font-style: italic;
          line-height: 1.5;
          color: #52525B;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .request-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .request-btn:hover {
          border-color: #18181B;
          background: #FAFAFA;
        }
        @media (min-width: 640px) {
          .mentor-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <article
        className="mentor-card"
        onClick={() => onClick(m)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick(m)}
      >
        {/* Header: avatar + name + rating */}
        <div className="mentor-header">
          <div className="mentor-avatar">
            <Avatar initials={m.initials} size="lg" />
            <div className="online-dot" />
          </div>
          <div className="mentor-info">
            <h3 className="mentor-name">{m.name}</h3>
            <p className="mentor-subject">{m.subject} Mentor</p>
            <p className="mentor-achievement">{m.achievement}</p>
            <div className="mentor-meta">
              <Badge color="violet">{m.grade}</Badge>
              <div className="mentor-location">
                <MapPin size={12} />
                <span>{m.location.split(",")[0]}</span>
              </div>
            </div>
          </div>
          <StarRating rating={m.rating} />
        </div>

        {/* Quick stats */}
        <div className="mentor-stats">
          {[
            [m.sessions, "Sessions"],
            [m.notesShared, "Notes shared"],
            [m.studentsHelped, "Students helped"],
          ].map(([value, label]) => (
            <div key={label as string} className="stat-card">
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p className="mentor-bio">"{m.bio}"</p>

        {/* CTA */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="request-btn"
        >
          <MessageCircle size={16} />
          Request Mentorship
        </button>
      </article>
    </>
  );
}