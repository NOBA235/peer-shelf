"use client";
import { useState } from "react";

interface Props {
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SUBJECTS = ["Physics","Chemistry","Biology","Mathematics","Accountancy","English","Computer Science","Economics","History","Geography"];
const BOARDS   = ["CBSE","ICSE","IB","State Board"];

export default function BecomeMentorModal({ userName, onClose, onSuccess }: Props) {
  const [stage, setStage] = useState<"form"|"submitting"|"done">("form");
  const [error, setError] = useState("");
  const [form, setForm]   = useState({
    grade: "", achievement: "", subject: "",
    subjects: [] as string[], board: "CBSE",
    location: "", bio: "", quote: "", books: "",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const toggleSubject = (s: string) =>
    setForm(p => ({
      ...p,
      subjects: p.subjects.includes(s)
        ? p.subjects.filter(x => x !== s)
        : [...p.subjects, s],
    }));

  const submit = async () => {
    if (!form.grade || !form.achievement || !form.subject || !form.location || !form.bio) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setStage("submitting");
    try {
      const res = await fetch("/api/mentor-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          books:    form.books.split(",").map(b => b.trim()).filter(Boolean),
          subjects: form.subjects.length ? form.subjects : [form.subject],
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error ?? "Registration failed"); setStage("form"); return; }
      setStage("done");
      setTimeout(() => { onSuccess(); onClose(); }, 1800);
    } catch {
      setError("Network error — please try again.");
      setStage("form");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
          <div>
            <h2 className="heading-md text-white">🌟 Become a Mentor</h2>
            <p className="caption mt-0.5">Hi {userName.split(" ")[0]} — share your knowledge with students</p>
          </div>
          <button onClick={onClose} className="btn-ghost btn-sm px-2.5">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {stage === "done" ? (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center text-3xl float">🌟</div>
              <div>
                <p className="heading-md text-white">You&apos;re a Mentor!</p>
                <p className="body-sm mt-1">Your profile is now live in the Mentorship Hub</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1.5 block">Board Result <span className="text-rose-400">*</span></label>
                  <input value={form.grade} onChange={e => set("grade", e.target.value)}
                    placeholder="e.g. 98.4% CBSE" className="input-base" />
                </div>
                <div>
                  <label className="caption mb-1.5 block">Board</label>
                  <select value={form.board} onChange={e => set("board", e.target.value)} className="input-base">
                    {BOARDS.map(b => <option key={b} value={b} className="bg-[#0f0f18]">{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="caption mb-1.5 block">Top Achievement <span className="text-rose-400">*</span></label>
                <input value={form.achievement} onChange={e => set("achievement", e.target.value)}
                  placeholder="e.g. JEE Advanced AIR 142 / NEET 680/720 / IIT Bombay CSE" className="input-base" />
              </div>

              <div>
                <label className="caption mb-1.5 block">Primary Subject <span className="text-rose-400">*</span></label>
                <select value={form.subject} onChange={e => set("subject", e.target.value)} className="input-base">
                  <option value="" className="bg-[#0f0f18]">Select subject…</option>
                  {SUBJECTS.map(s => <option key={s} value={s} className="bg-[#0f0f18]">{s}</option>)}
                </select>
              </div>

              <div>
                <label className="caption mb-2 block">Also teach (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(s => (
                    <button key={s} onClick={() => toggleSubject(s)} type="button"
                      className={`chip ${form.subjects.includes(s) ? "chip-active" : ""}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="caption mb-1.5 block">Location <span className="text-rose-400">*</span></label>
                <input value={form.location} onChange={e => set("location", e.target.value)}
                  placeholder="e.g. Koramangala, Bengaluru" className="input-base" />
              </div>

              <div>
                <label className="caption mb-1.5 block">About you <span className="text-rose-400">*</span></label>
                <textarea value={form.bio} onChange={e => set("bio", e.target.value)}
                  placeholder="Tell students about your background, how you studied, and how you can help…"
                  rows={4} className="input-base resize-none" />
                <p className="caption mt-1">{form.bio.length}/500</p>
              </div>

              <div>
                <label className="caption mb-1.5 block">Books that helped you (comma separated)</label>
                <input value={form.books} onChange={e => set("books", e.target.value)}
                  placeholder="e.g. H.C. Verma, NCERT Physics, D.C. Pandey" className="input-base" />
              </div>

              <div>
                <label className="caption mb-1.5 block">Study advice in one line</label>
                <input value={form.quote} onChange={e => set("quote", e.target.value)}
                  placeholder="e.g. Master the basics before anything else" className="input-base" />
              </div>

              {error && <p className="caption text-rose-400">{error}</p>}
            </>
          )}
        </div>

        {stage !== "done" && (
          <div className="p-6 pt-4 border-t border-white/8 flex-shrink-0">
            <button onClick={submit} disabled={stage === "submitting"}
              className="btn-primary w-full disabled:opacity-50" style={{ padding: "1rem" }}>
              {stage === "submitting" ? "Creating profile…" : "Create Mentor Profile"}
            </button>
            <p className="caption text-center mt-2">Your profile appears in Mentorship Hub immediately</p>
          </div>
        )}
      </div>
    </div>
  );
}