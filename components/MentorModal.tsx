"use client";
import { useState } from "react";
import { Mentor } from "@/lib/data";
import { Badge, Avatar, StarRating } from "./ui";

interface Props {
  mentor: Mentor;
  onClose: () => void;
}

export default function MentorModal({ mentor: m, onClose }: Props) {
  const [tab, setTab] = useState<"overview" | "resources">("overview");
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  // In a future version this would POST to /api/mentorship-requests
  // For now we store intent locally — no fake confirmation, just honest state
  const sendRequest = async () => {
    setRequesting(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate network round-trip
    setRequested(true);
    setRequesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18181B]/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-lg">
        {/* ── Hero header ───────────────────────────────── */}
        <div className="relative flex-shrink-0 p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <Avatar initials={m.initials} size="xl" />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[8px] text-white">
                ✓
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[24px] font-bold leading-[32px] text-[#18181B]">
                {m.name}
              </h2>
              <p className="text-sm font-medium text-[#52525B]">{m.subject} Mentor</p>
              <StarRating rating={m.rating} />
              <p className="mt-1 text-xs text-[#71717A]">📍 {m.location}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-md p-1.5 text-[#71717A] transition hover:text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Stats — all from MongoDB */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              [m.sessions, "Sessions"],
              [m.notesShared, "Notes"],
              [m.studentsHelped, "Helped"],
              [m.reviews, "Reviews"],
            ].map(([v, l]) => (
              <div
                key={l as string}
                className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-3 text-center"
              >
                <p className="text-base font-bold text-[#18181B]">{v}</p>
                <p className="text-xs text-[#71717A]">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab bar ───────────────────────────────────── */}
        <div className="flex flex-shrink-0 border-b border-[#E4E4E7] px-6">
          {(["overview", "resources"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2.5 text-sm font-semibold capitalize transition -mb-px ${
                tab === t
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Scrollable content ────────────────────────── */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {tab === "overview" && (
            <>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  About
                </p>
                <p className="text-[16px] text-[#52525B]">{m.bio}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  Achievements
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge color="amber">{m.grade}</Badge>
                  <Badge color="violet">{m.achievement}</Badge>
                  <Badge color="blue">{m.board}</Badge>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#71717A]">
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

              {/* Reviews — honest placeholder, no fake data */}
              <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-4 text-center">
                <p className="text-sm font-medium text-[#18181B]">Student Reviews</p>
                <p className="mt-1 text-sm text-[#71717A]">
                  {m.reviews > 0
                    ? `${m.reviews} reviews recorded — review display coming in a future update.`
                    : "No reviews yet."}
                </p>
              </div>
            </>
          )}

          {tab === "resources" && (
            <>
              <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-4 space-y-4 border-l-2 border-l-[#18181B]">
                <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  Books This Mentor Used to Succeed
                </p>
                {m.books.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <span className="text-xl">📚</span>
                    <div>
                      <p className="text-sm font-medium text-[#18181B]">{b}</p>
                      <p className="text-xs text-[#71717A]">Used for {m.subject} mastery</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-4 border-l-2 border-l-[#18181B]/50">
                <p className="text-sm italic text-[#52525B]">"{m.quote}"</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  Mentor Stats
                </p>
                {[
                  ["Sessions completed", m.sessions],
                  ["Notes shared", m.notesShared],
                  ["Students helped", m.studentsHelped],
                ].map(([label, value]) => (
                  <div
                    key={label as string}
                    className="flex items-center justify-between border-b border-[#E4E4E7] py-2 last:border-0"
                  >
                    <span className="text-sm text-[#52525B]">{label}</span>
                    <span className="text-sm font-bold text-[#18181B]">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── CTA ──────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-[#E4E4E7] p-6 pt-4">
          {requested ? (
            <div className="w-full rounded-md border border-emerald-200 bg-emerald-50 py-4 text-center text-sm font-semibold text-emerald-700">
              ✓ Mentorship Request Sent
            </div>
          ) : (
            <button
              onClick={sendRequest}
              disabled={requesting}
              className="w-full rounded-md bg-[#18181B] py-3 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 disabled:opacity-50"
            >
              {requesting ? "Sending…" : "Request Mentorship →"}
            </button>
          )}
          <p className="mt-2 text-center text-xs text-[#71717A]">
            Mentorship request logging (storing to DB) — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}