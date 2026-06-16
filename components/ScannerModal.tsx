"use client";
import { useState, useRef } from "react";
import { scanBookImage, createListing, ScanResult } from "@/lib/api";

interface Props {
  onClose: () => void;
  onList?: () => void;
}

type Stage = "idle" | "scanning" | "result" | "error" | "listing" | "done";

export default function ScannerModal({ onClose, onList }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Editable listing fields — pre-filled from scan, user can correct
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("0");
  const [condition, setCondition] = useState("Good");
  const [meetup, setMeetup] = useState("");

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
      setTimeout(() => {
        onList?.();
        onClose();
      }, 1600);
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
    setTitle("");
    setAuthor("");
    setSubject("");
    setPrice("0");
    setMeetup("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18181B]/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E4E4E7] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#18181B] sm:text-[24px] sm:leading-[32px]">
              📷 Book Scanner
            </h2>
            <p className="mt-0.5 text-xs text-[#71717A]">
              {stage === "idle" && "Powered by Google Cloud Vision + Open Library"}
              {stage === "scanning" && "Reading image with Google Vision OCR…"}
              {stage === "result" &&
                (result?.isbn
                  ? "ISBN detected — metadata fetched"
                  : "Text detected — review & edit")}
              {stage === "error" && "Something went wrong"}
              {stage === "listing" && "Publishing your listing…"}
              {stage === "done" && "Listing published"}
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

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
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
                className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-[#E4E4E7] bg-[#FAFAFA] p-8 transition hover:border-[#18181B] hover:bg-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInput.current?.click()}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F4F5] text-4xl">
                  📸
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#18181B]">Take or upload a photo</p>
                  <p className="mt-0.5 text-sm text-[#52525B]">Cover or ISBN barcode works best</p>
                </div>
              </div>
              <div className="rounded-md border border-[#E4E4E7] bg-[#FAFAFA] p-4 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-[#52525B]">
                  How this actually works
                </p>
                <p className="text-sm text-[#71717A]">
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
                <img
                  src={preview}
                  alt="Preview"
                  className="h-40 w-full rounded-md border border-[#E4E4E7] object-cover"
                />
              )}
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-[#E4E4E7]" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#18181B] border-r-[#18181B]/50 border-b-transparent border-l-transparent animate-spin" />
                </div>
                <p className="text-sm font-medium text-[#52525B]">
                  Running OCR &amp; metadata lookup…
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {stage === "error" && (
            <div className="space-y-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-full rounded-md border border-[#E4E4E7] object-cover opacity-50"
                />
              )}
              <div className="rounded-md border border-rose-200 bg-rose-50 p-4 space-y-1.5">
                <p className="text-sm font-semibold text-rose-700">Scan failed</p>
                <p className="text-sm text-rose-600">{error}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="flex-1 rounded-md bg-[#18181B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
                >
                  Try Another Photo
                </button>
                <button
                  onClick={() => {
                    setStage("result");
                    setError("");
                  }}
                  className="rounded-md border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
                >
                  Enter Manually
                </button>
              </div>
            </div>
          )}

          {/* Result / edit form */}
          {(stage === "result" || stage === "listing") && (
            <div className="space-y-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-full rounded-md border border-[#E4E4E7] object-cover"
                />
              )}

              {result && (
                <div
                  className={`rounded-md border p-3 space-y-1.5 ${
                    result.isbn
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  {result.isbn ? (
                    <p className="text-xs font-semibold text-emerald-700">
                      ✓ ISBN {result.isbn} — verified via Open Library
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-amber-700">
                      ⚠ No ISBN found — fields guessed from image text, please verify
                    </p>
                  )}
                  {result.subjects.length > 0 && (
                    <p className="text-sm text-[#52525B]">
                      Open Library subjects: {result.subjects.join(", ")}
                    </p>
                  )}
                </div>
              )}

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                  placeholder="Book title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  Author
                </label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                  placeholder="Author name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#71717A]">
                    Subject
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                    placeholder="e.g. Physics"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#71717A]">
                    Price (₹) — 0 to donate
                  </label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  Condition
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Like New", "Very Good", "Good", "Fair"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`rounded-md px-2 py-2 text-xs font-medium transition ${
                        condition === c
                          ? "bg-[#18181B] text-white"
                          : "border border-[#E4E4E7] bg-white text-[#18181B] hover:border-[#18181B] hover:bg-[#FAFAFA]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#71717A]">
                  Pickup Location
                </label>
                <input
                  value={meetup}
                  onChange={(e) => setMeetup(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                  placeholder="e.g. Lajpat Nagar Metro Station"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={publish}
                  disabled={stage === "listing" || !title.trim()}
                  className="flex-1 rounded-md bg-[#18181B] py-3 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 disabled:opacity-50"
                >
                  {stage === "listing" ? "Publishing…" : "Publish Listing"}
                </button>
                <button
                  onClick={reset}
                  className="rounded-md border border-[#E4E4E7] bg-white px-4 py-3 text-sm font-medium text-[#18181B] transition hover:border-[#18181B] hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
                >
                  Rescan
                </button>
              </div>
            </div>
          )}

          {/* Done */}
          {stage === "done" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                🎉
              </div>
              <div>
                <p className="text-[24px] font-bold leading-[32px] text-[#18181B]">
                  Listing Published!
                </p>
                <p className="mt-1 text-sm text-[#52525B]">
                  Saved to MongoDB — visible in the marketplace now
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}