"use client";
import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  BookOpen,
  Sparkles,
  RotateCcw,
} from "lucide-react";
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

  // Editable listing fields
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
        setError(
          err instanceof Error ? err.message : "Scan failed. Please try again."
        );
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
      setError(
        err instanceof Error ? err.message : "Failed to publish listing."
      );
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18181B]/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-start justify-between border-b border-[#E4E4E7] p-5">
          <div>
            <div className="flex items-center gap-2">
              <Camera size={20} className="text-[#18181B]" />
              <h2 className="text-lg font-bold text-[#18181B] sm:text-xl">
                Scan a Book
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-[#71717A]">
              {stage === "idle" && "Point at a textbook cover or barcode"}
              {stage === "scanning" && "Extracting text and metadata…"}
              {stage === "result" &&
                (result?.isbn
                  ? "ISBN detected — review the details"
                  : "No ISBN found — please verify")}
              {stage === "error" && "Scan failed"}
              {stage === "listing" && "Publishing your listing…"}
              {stage === "done" && "Listing published"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#A1A1AA] transition hover:bg-[#F4F4F5] hover:text-[#18181B]"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Content ──────────────────────────────────── */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Idle state — file picker */}
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
              <button
                onClick={() => fileInput.current?.click()}
                className="flex w-full flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[#D4D4D8] p-10 text-center transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5]">
                  <Upload size={24} className="text-[#52525B]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#18181B]">
                    Take or upload a photo
                  </p>
                  <p className="mt-1 text-sm text-[#71717A]">
                    Cover or ISBN barcode works best
                  </p>
                </div>
              </button>
              <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  How it works
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                  Your photo is processed by OCR to detect text and ISBN. We
                  then fetch real book metadata so you don&apos;t have to type it
                  all. You can edit everything before publishing.
                </p>
              </div>
            </div>
          )}

          {/* Scanning state */}
          {stage === "scanning" && (
            <div className="space-y-5">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-40 w-full rounded-xl border border-[#E4E4E7] object-cover"
                />
              )}
              <div className="flex flex-col items-center gap-4 py-4">
                <Loader2
                  size={40}
                  className="animate-spin text-[#18181B]"
                />
                <p className="text-sm font-medium text-[#52525B]">
                  Scanning with OCR…
                </p>
                <div className="flex items-center gap-2 text-xs text-[#71717A]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#18181B]" />
                  This takes a few seconds
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {stage === "error" && (
            <div className="space-y-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-full rounded-xl border border-[#E4E4E7] object-cover opacity-60"
                />
              )}
              <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <AlertCircle size={20} className="mt-0.5 text-rose-600" />
                <div>
                  <p className="text-sm font-semibold text-rose-700">
                    Scan failed
                  </p>
                  <p className="mt-1 text-sm text-rose-600">{error}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#18181B] py-2.5 text-sm font-medium text-white transition hover:bg-[#27272A]"
                >
                  <RotateCcw size={16} />
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setStage("result");
                    setError("");
                  }}
                  className="flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-medium text-[#18181B] transition hover:bg-[#FAFAFA]"
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
                  className="h-32 w-full rounded-xl border border-[#E4E4E7] object-cover"
                />
              )}

              {result && (
                <div
                  className={`rounded-xl border p-4 ${
                    result.isbn
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-amber-200 bg-amber-50/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.isbn ? (
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 text-emerald-600"
                      />
                    ) : (
                      <AlertCircle
                        size={18}
                        className="mt-0.5 text-amber-600"
                      />
                    )}
                    <div>
                      {result.isbn ? (
                        <p className="text-sm font-medium text-emerald-700">
                          ISBN {result.isbn} detected — metadata verified
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-amber-700">
                          No ISBN found — please verify details below
                        </p>
                      )}
                      {result.subjects.length > 0 && (
                        <p className="mt-1 text-xs text-[#52525B]">
                          Subjects: {result.subjects.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-rose-600">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                    placeholder="e.g. NCERT Chemistry Part 1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    Author
                  </label>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                    placeholder="e.g. NCERT"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                      Subject
                    </label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                      placeholder="Physics"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                      Price (₹)
                    </label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                      inputMode="numeric"
                      placeholder="0 = free"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    Condition
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["Like New", "Very Good", "Good", "Fair"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCondition(c)}
                        className={`rounded-lg px-2 py-2 text-xs font-medium transition ${
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    Pickup Location
                  </label>
                  <div className="relative mt-1">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
                    />
                    <input
                      value={meetup}
                      onChange={(e) => setMeetup(e.target.value)}
                      className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2 pl-9 pr-3 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
                      placeholder="e.g. Library entrance"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={publish}
                  disabled={stage === "listing" || !title.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#18181B] py-2.5 text-sm font-medium text-white transition hover:bg-[#27272A] disabled:opacity-50"
                >
                  {stage === "listing" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Publish Listing
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-medium text-[#18181B] transition hover:bg-[#FAFAFA]"
                >
                  <RotateCcw size={16} />
                  Rescan
                </button>
              </div>
            </div>
          )}

          {/* Done state */}
          {stage === "done" && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#18181B]">
                  Listing Published
                </p>
                <p className="mt-1 text-sm text-[#52525B]">
                  Your book is now visible in the marketplace.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}