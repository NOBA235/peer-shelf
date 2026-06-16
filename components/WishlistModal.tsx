"use client";
import { useState } from "react";
import { Avatar } from "./ui";
import { createWishlistItem, WishlistDoc } from "@/lib/api";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

const MSGS = [
  "Querying MongoDB listings database…",
  "Matching by subject and curriculum…",
  "Filtering by board and grade…",
  "Checking listing availability…",
  "Sorting by best match…",
];

export default function WishlistModal({ onClose, onCreated }: Props) {
  const [stage, setStage] = useState<"form" | "searching" | "match">("form");
  const [msgIdx, setMsgIdx] = useState(0);
  const [result, setResult] = useState<WishlistDoc | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", subject: "", curriculum: "", grade: "" });

  const submit = async () => {
    if (!form.title.trim()) {
      setError("Please enter a resource name");
      return;
    }
    setError("");
    setStage("searching");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setMsgIdx(Math.min(i, MSGS.length - 1));
      if (i >= MSGS.length - 1) clearInterval(iv);
    }, 600);
    try {
      const item = await createWishlistItem(form);
      setTimeout(() => {
        clearInterval(iv);
        setResult(item);
        setStage("match");
        onCreated?.();
      }, 3200);
    } catch {
      clearInterval(iv);
      setError("Something went wrong. Please try again.");
      setStage("form");
    }
  };

  const field = (key: keyof typeof form, label: string, ph: string) => (
    <div key={key}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#71717A]">
        {label}
      </label>
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={ph}
        className="w-full rounded-md border border-[#E4E4E7] bg-white px-4 py-2.5 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18181B]/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4E4E7] px-6 pt-5 pb-4">
          <div>
            <h2 className="text-[18px] font-bold leading-[28px] text-[#18181B] sm:text-[24px] sm:leading-[32px]">
              🔖 Request a Resource
            </h2>
            <p className="mt-0.5 text-xs text-[#71717A]">
              We&apos;ll match you with nearby students
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1.5 text-[#71717A] transition hover:text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {stage === "form" && (
            <>
              {field("title", "Resource Name", "e.g. Physical Chemistry by O.P. Tandon")}
              {field("subject", "Subject", "e.g. Chemistry")}
              {field("curriculum", "Curriculum / Exam", "e.g. NEET / CBSE Class 12")}
              {field("grade", "Grade / Year", "e.g. Class 12")}
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button
                onClick={submit}
                className="w-full rounded-md bg-[#18181B] py-3 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              >
                Search Network →
              </button>
            </>
          )}

          {stage === "searching" && (
            <div className="py-6 flex flex-col items-center gap-6">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-[#E4E4E7]" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-[#18181B] border-r-[#18181B]/50 border-b-transparent border-l-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-[#18181B]">
                  Matching you with students…
                </p>
                <p className="text-sm text-[#52525B]">{MSGS[msgIdx]}</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-[#18181B]"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {stage === "match" && result && (
            <div className="space-y-4">
              {result.status === "match" ? (
                <>
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5 text-center space-y-2">
                    <div className="text-4xl">🎉</div>
                    <h3 className="text-[20px] font-bold leading-[28px] text-emerald-700">
                      Match Found!
                    </h3>
                    <p className="text-sm text-emerald-700/80">
                      A student nearby has exactly what you need.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 rounded-md border border-[#E4E4E7] bg-white p-4">
                    <Avatar
                      initials={result.matchName?.slice(0, 2).toUpperCase() ?? "S"}
                      size="md"
                      gradient="emerald"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#18181B]">{result.matchName}</p>
                      <p className="line-clamp-1 text-sm text-[#52525B]">
                        {result.title} · Good condition
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-700">
                        📍 {result.matchDistance} away
                      </p>
                    </div>
                  </div>
                  <button className="w-full rounded-md bg-emerald-700 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
                    Contact Seller →
                  </button>
                </>
              ) : result.status === "potential" ? (
                <div className="space-y-4">
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-5 text-center space-y-2">
                    <div className="text-4xl">👀</div>
                    <h3 className="text-[20px] font-bold leading-[28px] text-amber-700">
                      {result.matchCount} Potential Matches
                    </h3>
                    <p className="text-sm text-amber-700/80">
                      Found listings that might work. Added to your wishlist.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full rounded-md border border-[#E4E4E7] bg-white py-3 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
                  >
                    View in Wishlist →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border border-blue-200 bg-blue-50 p-5 text-center space-y-2">
                    <div className="text-4xl">🔍</div>
                    <h3 className="text-[20px] font-bold leading-[28px] text-blue-700">
                      Added to Wishlist
                    </h3>
                    <p className="text-sm text-blue-700/80">
                      No matches yet — we&apos;ll notify you the moment one appears.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full rounded-md border border-[#E4E4E7] bg-white py-3 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
                  >
                    Got It
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}