"use client";
import { Mentor } from "@/lib/data";
import { Badge, Avatar, StarRating } from "./ui";

export default function MentorCard({
  mentor: m, onClick,
}: { mentor: Mentor; onClick: (m: Mentor) => void }) {
  return (
    <article
      onClick={() => onClick(m)}
      className="glass glass-hover cursor-pointer p-5 group space-y-4"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick(m)}
    >
      {/* Header row */}
      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="relative flex-shrink-0">
          <Avatar initials={m.initials} size="lg" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0f]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-white group-hover:text-violet-200 transition-colors">
                {m.name}
              </h3>
              <p className="body-sm text-violet-400 font-medium">{m.subject} Mentor</p>
            </div>
            <StarRating rating={m.rating} />
          </div>
          <p className="caption mt-1">{m.achievement}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge color="violet">{m.grade}</Badge>
            <Badge color="slate">📍 {m.location.split(",")[0]}</Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[[m.sessions, "Sessions"], [m.notesShared, "Notes"], [m.studentsHelped, "Helped"]].map(([v, l]) => (
          <div key={l as string} className="bg-white/4 border border-white/6 rounded-xl p-2.5 text-center">
            <p className="font-bold text-white text-sm">{v}</p>
            <p className="caption">{l}</p>
          </div>
        ))}
      </div>

      <p className="body-sm italic line-clamp-2">"{m.bio}"</p>

      <button
        onClick={e => e.stopPropagation()}
        className="btn-ghost btn-sm w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
      >
        Request Mentorship
      </button>
    </article>
  );
}
