"use client";
import { Camera, Zap, Upload } from "lucide-react";
import { SectionLabel } from "../ui";

interface Props {
  onOpenScanner: () => void;
}

export default function ScanSection({ onOpenScanner }: Props) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center sm:py-24">
      {/* Badge / label */}
      <SectionLabel>Book Scanner</SectionLabel>

      {/* Headline */}
      <h1 className="mt-3 max-w-md text-2xl font-bold tracking-tight text-[#18181B] sm:text-3xl">
        Scan any textbook, list it instantly
      </h1>
      <p className="mt-3 max-w-sm text-sm text-[#52525B]">
        Point your camera at a book cover. We extract the title, author, and
        let you set a price in under 30 seconds.
      </p>

      {/* Scan trigger */}
      <button
        onClick={onOpenScanner}
        className="group mt-10 flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#D4D4D8] bg-white px-6 py-10 transition hover:border-[#18181B] hover:bg-[#FAFAFA]"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5] transition group-hover:bg-[#18181B]">
          <Camera className="h-6 w-6 text-[#52525B] transition group-hover:text-white" />
        </div>
        <span className="text-sm font-semibold text-[#18181B]">
          Tap to open camera or upload
        </span>
        <span className="text-xs text-[#71717A]">
          Works with ISBN barcodes & cover photos
        </span>
      </button>

      {/* How it works – 3 clean steps */}
      <div className="mt-14 grid w-full max-w-lg grid-cols-1 gap-6 text-left sm:grid-cols-3 sm:text-center">
        {[
          {
            icon: Camera,
            title: "Snap a photo",
            desc: "Take a picture of any textbook cover or barcode.",
          },
          {
            icon: Zap,
            title: "Instant metadata",
            desc: "We read the ISBN, fetch real title & author details.",
          },
          {
            icon: Upload,
            title: "List in seconds",
            desc: "Set price, condition, and publish. Done.",
          },
        ].map((step) => (
          <div key={step.title}>
            <step.icon className="h-6 w-6 text-[#18181B]" />
            <h3 className="mt-2 text-sm font-semibold text-[#18181B]">{step.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#71717A]">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Primary CTA */}
      <button
        onClick={onOpenScanner}
        className="mt-10 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#18181B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
      >
        <Camera size={18} />
        Open Scanner
      </button>
    </div>
  );
}