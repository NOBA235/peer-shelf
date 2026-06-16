"use client";
import { useState, useRef } from "react";
import { scanBookImage, createListing, ScanResult } from "@/lib/api";

interface Props { onClose: () => void; onList?: () => void; }

type Stage = "idle" | "scanning" | "result" | "error" | "listing" | "done";

export default function ScannerModal({ onClose, onList }: Props) {
  const [stage, setStage]   = useState<Stage>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError]   = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Editable listing fields — pre-filled from scan, user can correct
  const [title, setTitle]       = useState("");
  const [author, setAuthor]     = useState("");
  const [subject, setSubject]   = useState("");
  const [price, setPrice]       = useState("0");
  const [condition, setCondition] = useState("Good");
  const [meetup, setMeetup]     = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setStage("scanning");

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      const base64 = dataUrl.split(",")[1];

      try {
        const data = await scanBookImage(base64);
        setResult(data);
        setTitle(data.title ?? "");
        setAuthor(data.author ?? "");
        setSubject(data.subjects?.[0] ?? "");
        setStage("result");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Scan failed. Please try again.");
        setStage("error");
      }
    };
    reader.onerror = () => {
      setError("Could not read the selected file.");
      setStage("error");
    };
    reader.readAsDataURL(file);
  };

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const publish = async () => {
    setStage("listing");
    try {
      await createListing({
        title: title || "Untitled Book",
        author: author || "Unknown",
        subject: subject || "General",
        curriculum: "CBSE",
        board: "CBSE",
        grade: "Class 12",
        price: Number(price) || 0,
        originalPrice: Number(price) || 0,
        condition: condition as "Like New" | "Very Good" | "Good" | "Fair",
        location: meetup || "Not specified",
        city: "Unspecified",
        notes: false,
        mentor: false,
        donated: Number(price) === 0,
        exchange: false,
        image: "📚",
        color: "#7c3aed",
        seller: "You",
        sellerInitials: "YO",
        rating: 5,
        saves: 0,
        type: "Textbook",
        description: result?.rawText
          ? `Scanned listing. ISBN: ${result.isbn ?? "not detected"}.`
          : "Manually listed via scanner.",
        included: [],
        meetupPoint: meetup || "Not specified",
        listedDaysAgo: 0,
      });
      setStage("done");
      setTimeout(() => { onList?.(); onClose(); }, 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish listing.");
      setStage("result");
    }
  };

  const reset = () => {
    setStage("idle");
    setPreview(null);
    setResult(null);
    setError("");
    setTitle(""); setAuthor(""); setSubject(""); setPrice("0"); setMeetup("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
          <div>
            <h2 className="heading-md text-white">📷 Book Scanner</h2>
            <p className="caption mt-0.5">
              {stage === "idle"     && "Powered by Google Cloud Vision + Open Library"}
              {stage === "scanning" && "Reading image with Google Vision OCR…"}
              {stage === "result"   && (result?.isbn ? "ISBN detected — metadata fetched" : "Text detected — review & edit")}
              {stage === "error"    && "Something went wrong"}
              {stage === "listing"  && "Publishing your listing…"}
              {stage === "done"     && "Listing published"}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost btn-sm px-2.5 flex-shrink-0">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Idle — file picker */}
          {stage === "idle" && (
            <div className="space-y-5">
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onFilePicked}
                className="hidden"
              />
              <div
                onClick={() => fileInput.current?.click()}
                className="border-2 border-dashed border-violet-500/25 rounded-2xl h-52 flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-500/4 transition-all group gap-4"
              >
                <div className="w-20 h-20 bg-violet-600/15 group-hover:bg-violet-600/25 rounded-full flex items-center justify-center text-4xl transition-all group-hover:scale-110">
                  📸
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white">Take or upload a photo</p>
                  <p className="body-sm mt-0.5">Cover or ISBN barcode works best</p>
                </div>
              </div>
              <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-3 space-y-1">
                <p className="caption text-blue-300 font-semibold">How this actually works</p>
                <p className="body-sm text-white/60">
                  Your photo is sent to Google Cloud Vision for text recognition. If an ISBN is found,
                  we look up real metadata from Open Library. You can edit everything before publishing.
                </p>
              </div>
            </div>
          )}

          {/* Scanning */}
          {stage === "scanning" && (
            <div className="space-y-5 py-2">
              {preview && (
                <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-white/8" />
              )}
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/15" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-violet-400/50 border-b-transparent border-l-transparent animate-spin" />
                </div>
                <p className="body-sm text-violet-400">Running OCR &amp; metadata lookup…</p>
              </div>
            </div>
          )}

          {/* Error */}
          {stage === "error" && (
            <div className="space-y-4">
              {preview && (
                <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-white/8 opacity-50" />
              )}
              <div className="bg-rose-500/8 border border-rose-500/25 rounded-xl p-4 space-y-1.5">
                <p className="font-semibold text-rose-400 text-sm">Scan failed</p>
                <p className="body-sm">{error}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={reset} className="btn-primary flex-1">Try Another Photo</button>
                <button onClick={() => { setStage("result"); setError(""); }} className="btn-ghost btn-sm px-4">
                  Enter Manually
                </button>
              </div>
            </div>
          )}

          {/* Result / edit form */}
          {(stage === "result" || stage === "listing") && (
            <div className="space-y-4">
              {preview && (
                <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-white/8" />
              )}

              {result && (
                <div className={`rounded-xl p-3 space-y-1.5 border ${result.isbn ? "bg-emerald-500/8 border-emerald-500/20" : "bg-amber-500/8 border-amber-500/20"}`}>
                  {result.isbn ? (
                    <p className="caption text-emerald-400 font-semibold">✓ ISBN {result.isbn} — verified via Open Library</p>
                  ) : (
                    <p className="caption text-amber-400 font-semibold">⚠ No ISBN found — fields guessed from image text, please verify</p>
                  )}
                  {result.subjects.length > 0 && (
                    <p className="body-sm text-white/60">Open Library subjects: {result.subjects.join(", ")}</p>
                  )}
                </div>
              )}

              {error && <p className="caption text-rose-400">{error}</p>}

              <div>
                <label className="caption mb-1.5 block">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="input-base" placeholder="Book title" />
              </div>
              <div>
                <label className="caption mb-1.5 block">Author</label>
                <input value={author} onChange={e => setAuthor(e.target.value)} className="input-base" placeholder="Author name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1.5 block">Subject</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)} className="input-base" placeholder="e.g. Physics" />
                </div>
                <div>
                  <label className="caption mb-1.5 block">Price (₹) — 0 to donate</label>
                  <input value={price} onChange={e => setPrice(e.target.value)} className="input-base" inputMode="numeric" />
                </div>
              </div>
              <div>
                <label className="caption mb-2 block">Condition</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Like New","Very Good","Good","Fair"].map(c => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`py-2 rounded-xl caption font-semibold transition-all ${condition === c ? "bg-violet-600 text-white" : "btn-ghost"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="caption mb-1.5 block">Pickup Location</label>
                <input value={meetup} onChange={e => setMeetup(e.target.value)} className="input-base" placeholder="e.g. Lajpat Nagar Metro Station" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={publish}
                  disabled={stage === "listing" || !title.trim()}
                  className="btn-primary flex-1 disabled:opacity-50"
                  style={{ padding: "0.875rem" }}
                >
                  {stage === "listing" ? "Publishing…" : "Publish Listing"}
                </button>
                <button onClick={reset} className="btn-ghost btn-sm px-4">Rescan</button>
              </div>
            </div>
          )}

          {/* Done */}
          {stage === "done" && (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-3xl float">🎉</div>
              <div>
                <p className="heading-md text-white">Listing Published!</p>
                <p className="body-sm mt-1">Saved to MongoDB — visible in the marketplace now</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
