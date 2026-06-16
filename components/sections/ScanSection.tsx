"use client";
import { SectionLabel } from "../ui";

interface Props { onOpenScanner: () => void; }

export default function ScanSection({ onOpenScanner }: Props) {
  return (
    <div className="space-y-8 pt-8">
      <div className="text-center space-y-2">
        <SectionLabel>Powered by Google Cloud Vision + Open Library</SectionLabel>
        <h1 className="heading-lg text-white">Book Scanner</h1>
        <p className="body-md max-w-sm mx-auto">
          Take a photo of any textbook. We OCR the cover, extract the ISBN,
          and look up real metadata from Open Library.
        </p>
      </div>

      {/* Tap target */}
      <div
        onClick={onOpenScanner}
        className="relative overflow-hidden border-2 border-dashed border-violet-500/25 rounded-3xl h-56 sm:h-64 flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-500/4 transition-all group"
      >
        {[
          ["top-3 left-3",    "border-t-2 border-l-2"],
          ["top-3 right-3",   "border-t-2 border-r-2"],
          ["bottom-3 left-3", "border-b-2 border-l-2"],
          ["bottom-3 right-3","border-b-2 border-r-2"],
        ].map(([pos, b], i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 ${b} border-violet-500/40 rounded-sm`} />
        ))}
        <div className="w-20 h-20 bg-violet-600/15 group-hover:bg-violet-600/25 rounded-full flex items-center justify-center text-4xl transition-all group-hover:scale-110">
          📸
        </div>
        <div className="text-center mt-4 space-y-1">
          <p className="font-bold text-white">Tap to open camera or upload</p>
          <p className="body-sm">Cover photo or ISBN barcode both work</p>
        </div>
      </div>

      {/* Honest step-by-step */}
      <div className="space-y-2">
        <p className="caption uppercase tracking-widest">Exactly what happens</p>
        {[
          ["1", "Your photo is sent to Google Cloud Vision API",          "OCR extracts all visible text from the image"],
          ["2", "We scan the text for an ISBN-10 or ISBN-13 number",     "Works from barcode area or printed text on cover"],
          ["3", "ISBN is sent to Open Library (free, no key needed)",    "Returns real title, author, publisher, subjects"],
          ["4", "If no ISBN found, we guess from the largest text lines","You can edit everything before publishing"],
          ["5", "You review, adjust price + condition, then publish",     "Listing is saved to MongoDB and appears in marketplace"],
        ].map(([step, title, desc]) => (
          <div key={step as string} className="glass glass-hover p-4 flex gap-3">
            <div className="w-7 h-7 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center caption font-bold text-violet-400 flex-shrink-0 mt-0.5">
              {step}
            </div>
            <div>
              <p className="body-sm font-medium text-white">{title}</p>
              <p className="caption mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* What's needed */}
      <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4 space-y-2">
        <p className="body-sm font-semibold text-blue-300">What you need in .env.local</p>
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <span className="caption text-blue-400 font-mono">GOOGLE_CLOUD_VISION_API_KEY</span>
            <span className="caption">— Required for OCR</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="caption text-emerald-400 font-mono">Open Library API</span>
            <span className="caption">— Free, no key needed</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="caption text-emerald-400 font-mono">MONGODB_URI</span>
            <span className="caption">— Required to save the listing</span>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenScanner}
        className="btn-primary w-full"
        style={{ padding: "1rem" }}
      >
        📷 Open Scanner
      </button>
    </div>
  );
}
