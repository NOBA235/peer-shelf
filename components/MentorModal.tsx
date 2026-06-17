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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18181B]/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ── Header ──────────────────────────────────── */}
        <div className="relative flex-shrink-0 p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-[#A1A1AA] transition hover:bg-[#F4F4F5] hover:text-[#18181B]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="relative flex-shrink-0">
              <Avatar initials={m.initials} size="xl" />
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[10px] font-bold text-white">
                ✓
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold tracking-tight text-[#18181B] sm:text-2xl">
                {m.name}
              </h2>
              <p className="text-sm font-medium text-[#7c3aed]">{m.subject} Mentor</p>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-[#71717A]">
                <MapPin size={12} />
                <span>{m.location}</span>
              </div>
              <div className="mt-1">
                <StarRating rating={m.rating} />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              [m.sessions, "Sessions"],
              [m.notesShared, "Notes"],
              [m.studentsHelped, "Helped"],
              [m.reviews, "Reviews"],
            ].map(([value, label]) => (
              <div
                key={label as string}
                className="rounded-lg border border-[#F4F4F5] bg-[#FAFAFA] px-2 py-3 text-center"
              >
                <p className="text-base font-bold text-[#18181B]">{value}</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#71717A]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────── */}
        <div className="flex flex-shrink-0 border-b border-[#E4E4E7] px-6">
          {(["overview", "resources"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-sm font-semibold capitalize transition ${
                tab === t
                  ? "text-[#18181B]"
                  : "text-[#A1A1AA] hover:text-[#52525B]"
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#18181B]" />
              )}
            </button>
          ))}
        </div>

        {/* ── Scrollable content ────────────────────────── */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {tab === "overview" && (
            <>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  About
                </p>
                <p className="text-sm leading-relaxed text-[#52525B]">{m.bio}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  Achievements
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge color="amber">{m.grade}</Badge>
                  <Badge color="violet">{m.achievement}</Badge>
                  <Badge color="blue">{m.board}</Badge>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  Subjects Covered
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {m.subjects.map((s) => (
                    <Badge key={s} color="slate">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4 text-center">
                <p className="text-sm font-medium text-[#18181B]">Student Reviews</p>
                {m.reviews > 0 ? (
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[#71717A]">
                    <Clock size={14} />
                    <span>{m.reviews} reviews recorded — display coming soon.</span>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-[#A1A1AA]">No reviews yet.</p>
                )}
              </div>
            </>
          )}

          {tab === "resources" && (
            <>
              <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  Books That Helped
                </p>
                <ul className="space-y-3">
                  {m.books.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <BookOpen size={18} className="mt-0.5 flex-shrink-0 text-[#A1A1AA]" />
                      <div>
                        <p className="text-sm font-medium text-[#18181B]">{b}</p>
                        <p className="text-xs text-[#71717A]">Used for {m.subject} mastery</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-5">
                <p className="text-sm italic leading-relaxed text-[#52525B]">"{m.quote}"</p>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  Mentor Stats
                </p>
                <div className="divide-y divide-[#F4F4F5] rounded-xl border border-[#E4E4E7] bg-white">
                  {[
                    ["Sessions completed", m.sessions],
                    ["Notes shared", m.notesShared],
                    ["Students helped", m.studentsHelped],
                  ].map(([label, value]) => (
                    <div
                      key={label as string}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <span className="text-sm text-[#52525B]">{label}</span>
                      <span className="text-sm font-semibold text-[#18181B]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Footer CTA ────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-[#E4E4E7] p-6 pt-4">
          {requested ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={18} />
              Mentorship Request Sent
            </div>
          ) : (
            <button
              onClick={sendRequest}
              disabled={requesting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18181B] py-3 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 disabled:opacity-50"
            >
              {requesting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
  );
}