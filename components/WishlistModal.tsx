"use client";
import { useState } from "react";
import { Avatar } from "./ui";
import { createWishlistItem, WishlistDoc } from "@/lib/api";

interface Props { onClose: () => void; onCreated?: () => void; }

const MSGS = [
  "Querying MongoDB listings database…",
  "Matching by subject and curriculum…",
  "Filtering by board and grade…",
  "Checking listing availability…",
  "Sorting by best match…",
];

export default function WishlistModal({ onClose, onCreated }: Props) {
  const [stage, setStage]   = useState<"form"|"searching"|"match">("form");
  const [msgIdx, setMsgIdx] = useState(0);
  const [result, setResult] = useState<WishlistDoc | null>(null);
  const [error, setError]   = useState("");
  const [form, setForm]     = useState({ title: "", subject: "", curriculum: "", grade: "" });

  const submit = async () => {
    if (!form.title.trim()) { setError("Please enter a resource name"); return; }
    setError("");
    setStage("searching");
    let i = 0;
    const iv = setInterval(() => { i++; setMsgIdx(Math.min(i, MSGS.length - 1)); if (i >= MSGS.length - 1) clearInterval(iv); }, 600);
    try {
      const item = await createWishlistItem(form);
      setTimeout(() => { clearInterval(iv); setResult(item); setStage("match"); onCreated?.(); }, 3200);
    } catch {
      clearInterval(iv);
      setError("Something went wrong. Please try again.");
      setStage("form");
    }
  };

  const field = (key: keyof typeof form, label: string, ph: string) => (
    <div key={key}>
      <label className="caption mb-1.5 block">{label}</label>
      <input
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={ph}
        className="input-base"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8">
          <div>
            <h2 className="heading-md text-white">🔖 Request a Resource</h2>
            <p className="caption mt-0.5">We&apos;ll match you with nearby students</p>
          </div>
          <button onClick={onClose} className="btn-ghost btn-sm px-2.5">✕</button>
        </div>

        <div className="p-6 space-y-4">

          {stage === "form" && (
            <>
              {field("title",      "Resource Name",       "e.g. Physical Chemistry by O.P. Tandon")}
              {field("subject",    "Subject",             "e.g. Chemistry")}
              {field("curriculum", "Curriculum / Exam",   "e.g. NEET / CBSE Class 12")}
              {field("grade",      "Grade / Year",        "e.g. Class 12")}
              {error && <p className="caption text-rose-400">{error}</p>}
              <button onClick={submit} className="btn-primary w-full" style={{ padding: "0.9rem" }}>
                Search Network →
              </button>
            </>
          )}

          {stage === "searching" && (
            <div className="py-6 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-violet-500/15" />
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-violet-400/50 border-b-transparent border-l-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-violet-600/25 animate-ping" style={{ animationDuration: "2s" }} />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-white">Matching you with students…</p>
                <p className="body-sm text-violet-400">{MSGS[msgIdx]}</p>
              </div>
              <div className="flex gap-1.5">
                {[0,1,2,3].map(i => (
                  <div key={i} className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {stage === "match" && result && (
            <div className="space-y-4">
              {result.status === "match" ? (
                <>
                  <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-2xl p-5 text-center space-y-2">
                    <div className="text-4xl float">🎉</div>
                    <h3 className="heading-md text-emerald-400">Match Found!</h3>
                    <p className="body-sm">A student nearby has exactly what you need.</p>
                  </div>
                  <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <Avatar initials={result.matchName?.slice(0,2).toUpperCase() ?? "S"} size="md" gradient="emerald" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white">{result.matchName}</p>
                      <p className="body-sm line-clamp-1">{result.title} · Good condition</p>
                      <p className="caption text-emerald-400 mt-0.5">📍 {result.matchDistance} away</p>
                    </div>
                  </div>
                  <button className="btn-primary w-full" style={{ background: "#059669", padding: "0.9rem" }}>
                    Contact Seller →
                  </button>
                </>
              ) : result.status === "potential" ? (
                <div className="space-y-4">
                  <div className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5 text-center space-y-2">
                    <div className="text-4xl">👀</div>
                    <h3 className="heading-md text-amber-400">{result.matchCount} Potential Matches</h3>
                    <p className="body-sm">Found listings that might work. Added to your wishlist.</p>
                  </div>
                  <button onClick={onClose} className="btn-ghost w-full">View in Wishlist →</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-500/8 border border-blue-500/25 rounded-2xl p-5 text-center space-y-2">
                    <div className="text-4xl">🔍</div>
                    <h3 className="heading-md text-blue-400">Added to Wishlist</h3>
                    <p className="body-sm">No matches yet — we&apos;ll notify you the moment one appears.</p>
                  </div>
                  <button onClick={onClose} className="btn-ghost w-full">Got It</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
