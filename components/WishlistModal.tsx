"use client";
import { useState } from "react";
import { Avatar } from "./ui";
import { createWishlistItem, WishlistDoc } from "@/lib/api";
import {
  X,
  Bookmark,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

export default function WishlistModal({ onClose, onCreated }: Props) {
  const [stage, setStage] = useState<"form" | "searching" | "match">("form");
  const [result, setResult] = useState<WishlistDoc | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    subject: "",
    curriculum: "",
    grade: "",
  });

  const submit = async () => {
    if (!form.title.trim()) {
      setError("Please enter a resource name");
      return;
    }
    setError("");
    setStage("searching");
    try {
      const item = await createWishlistItem(form);
      await new Promise((r) => setTimeout(r, 1800));
      setResult(item);
      setStage("match");
      onCreated?.();
    } catch {
      setError("Something went wrong. Please try again.");
      setStage("form");
    }
  };

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18181B]/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E4E4E7] p-5 sm:p-6">
          <div className="pr-4">
            <div className="flex items-center gap-2">
              <Bookmark size={20} className="text-[#18181B]" />
              <h2 className="text-lg font-bold text-[#18181B] sm:text-xl">
                Request a Resource
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-[#71717A]">
              We&apos;ll match you with nearby students who have what you need.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#A1A1AA] transition hover:bg-[#F4F4F5] hover:text-[#18181B]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content – increased gaps and padding */}
        <div className="space-y-6 p-5 sm:p-6">
          {stage === "form" && (
            <div className="space-y-5">
              <div className="space-y-4">
                <InputField
                  label="Resource Name"
                  value={form.title}
                  onChange={(v) => updateField("title", v)}
                  placeholder="e.g. Physical Chemistry by O.P. Tandon"
                />
                <InputField
                  label="Subject"
                  value={form.subject}
                  onChange={(v) => updateField("subject", v)}
                  placeholder="e.g. Chemistry"
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Curriculum / Exam"
                    value={form.curriculum}
                    onChange={(v) => updateField("curriculum", v)}
                    placeholder="CBSE, NEET…"
                  />
                  <InputField
                    label="Grade / Year"
                    value={form.grade}
                    onChange={(v) => updateField("grade", v)}
                    placeholder="Class 12"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                onClick={submit}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18181B] py-3 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              >
                <Search size={16} />
                Search Network
              </button>
            </div>
          )}

          {stage === "searching" && (
            <div className="flex flex-col items-center gap-6 py-10">
              <div className="relative">
                <Loader2 size={48} className="animate-spin text-[#18181B]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search size={20} className="text-[#18181B]" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-[#18181B]">
                  Searching for matches…
                </p>
                <p className="text-xs text-[#71717A]">
                  Looking through listings near you
                </p>
              </div>
            </div>
          )}

          {stage === "match" && result && (
            <div className="space-y-5">
              {result.status === "match" && (
                <>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 text-center sm:p-6">
                    <CheckCircle2 size={32} className="mx-auto mb-3 text-emerald-600" />
                    <h3 className="text-lg font-bold text-emerald-700">Match Found!</h3>
                    <p className="mt-1 text-sm text-emerald-700/80">
                      A student nearby has the exact resource you need.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-[#E4E4E7] bg-white p-4 sm:p-5">
                    <Avatar
                      initials={result.matchName?.slice(0, 2).toUpperCase() ?? "ST"}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#18181B]">{result.matchName}</p>
                      <p className="text-sm text-[#52525B]">{result.title}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
                        <MapPin size={12} />
                        {result.matchDistance} away
                      </div>
                    </div>
                  </div>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white transition hover:bg-emerald-700">
                    Contact Seller
                    <ArrowRight size={16} />
                  </button>
                </>
              )}

              {result.status === "potential" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 text-center sm:p-6">
                    <Sparkles size={32} className="mx-auto mb-3 text-amber-600" />
                    <h3 className="text-lg font-bold text-amber-700">
                      {result.matchCount} Potential Match{result.matchCount !== 1 && "es"}
                    </h3>
                    <p className="mt-1 text-sm text-amber-700/80">
                      We found listings that might work — added to your wishlist.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4E4E7] bg-white py-3 text-sm font-medium text-[#18181B] transition hover:bg-[#FAFAFA]"
                  >
                    View in Wishlist
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {result.status === "searching" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 text-center sm:p-6">
                    <Search size={32} className="mx-auto mb-3 text-blue-600" />
                    <h3 className="text-lg font-bold text-blue-700">Added to Wishlist</h3>
                    <p className="mt-1 text-sm text-blue-700/80">
                      No matches yet — we&apos;ll notify you when one appears.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4E4E7] bg-white py-3 text-sm font-medium text-[#18181B] transition hover:bg-[#FAFAFA]"
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

// Tiny reusable input — untouched
function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
      />
    </div>
  );
}