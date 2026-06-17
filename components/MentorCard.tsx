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
    <article
      onClick={() => onClick(m)}
      className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-[#E4E4E7] bg-white p-5 transition hover:border-[#18181B]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(m)}
    >
      {/* Header: avatar + name + rating */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <Avatar initials={m.initials} size="lg" />
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#18181B]">{m.name}</h3>
          <p className="text-xs font-medium text-[#7c3aed]">{m.subject} Mentor</p>
          <p className="mt-0.5 text-xs text-[#71717A]">{m.achievement}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge color="violet">{m.grade}</Badge>
            <div className="flex items-center gap-1 text-xs text-[#71717A]">
              <MapPin size={12} />
              <span>{m.location.split(",")[0]}</span>
            </div>
          </div>
        </div>
        <StarRating rating={m.rating} />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          [m.sessions, "Sessions"],
          [m.notesShared, "Notes shared"],
          [m.studentsHelped, "Students helped"],
        ].map(([value, label]) => (
          <div key={label as string} className="rounded-lg border border-[#F4F4F5] bg-[#FAFAFA] px-2 py-3">
            <p className="text-base font-bold text-[#18181B]">{value}</p>
            <p className="mt-0.5 text-[10px] text-[#71717A] leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Bio */}
      <p className="text-xs italic leading-relaxed text-[#52525B] line-clamp-2">
        "{m.bio}"
      </p>

      {/* CTA */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E4E4E7] bg-white py-2 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
      >
        <MessageCircle size={16} />
        Request Mentorship
      </button>
    </article>
  );
}