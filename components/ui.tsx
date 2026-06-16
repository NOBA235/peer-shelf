"use client";
import { ReactNode } from "react";

// ── Badge ──────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  violet:  "bg-violet-50 text-violet-700 border-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber:   "bg-amber-50 text-amber-700 border-amber-200",
  blue:    "bg-blue-50 text-blue-700 border-blue-200",
  rose:    "bg-rose-50 text-rose-700 border-rose-200",
  slate:   "bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]",
  cyan:    "bg-cyan-50 text-cyan-700 border-cyan-200",
};
export const Badge = ({
  children,
  color = "violet",
}: {
  children: ReactNode;
  color?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
      BADGE_COLORS[color] ?? BADGE_COLORS.violet
    }`}
  >
    {children}
  </span>
);

// ── Card ───────────────────────────────────────────────────────
export const Card = ({
  children,
  className = "",
  hover = false,
  onClick,
  padding = "p-5",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: string;
}) => (
  <div
    onClick={onClick}
    className={`rounded-xl border border-[#E4E4E7] bg-white ${padding} ${
      hover ? "cursor-pointer transition hover:border-[#18181B] hover:bg-[#FAFAFA]" : ""
    } ${className}`}
  >
    {children}
  </div>
);

// Alias for backward compat
export const GlassCard = Card;

// ── Avatar ─────────────────────────────────────────────────────
const AVATAR_SIZES: Record<string, string> = {
  xs: "h-6 w-6 text-[9px]",
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export const Avatar = ({
  initials,
  size = "md",
  gradient = "violet",
}: {
  initials: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  gradient?: string;
}) => {
  // Use a simple solid background based on gradient (ignore gradient prop, use a static color)
  const bgColor = {
    violet: "bg-violet-100 text-violet-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  }[gradient] || "bg-[#F4F4F5] text-[#52525B]";

  return (
    <div
      className={`${AVATAR_SIZES[size]} rounded-full flex items-center justify-center font-semibold ${bgColor} flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

// ── Star rating ────────────────────────────────────────────────
export const StarRating = ({ rating }: { rating: number }) => (
  <span className="text-amber-500 text-sm font-semibold">
    {"★".repeat(Math.floor(rating))}
    {"☆".repeat(5 - Math.floor(rating))}
    {" "}
    <span className="text-amber-600/80">{rating.toFixed(1)}</span>
  </span>
);

// ── Section label ──────────────────────────────────────────────
export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#71717A]">
    {children}
  </p>
);

// ── Section header ─────────────────────────────────────────────
export const SectionHeader = ({ label }: { label: string }) => (
  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#71717A]">
    {label}
  </p>
);

// ── Divider ────────────────────────────────────────────────────
export const Divider = ({ className = "" }: { className?: string }) => (
  <hr className={`border-t border-[#E4E4E7] ${className}`} />
);

// ── Empty state ────────────────────────────────────────────────
export const EmptyState = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => (
  <div className="py-16 text-center space-y-2">
    <div className="mb-3 text-4xl">{icon}</div>
    <p className="text-[24px] font-bold leading-[32px] text-[#18181B]">{title}</p>
    <p className="text-sm text-[#52525B]">{desc}</p>
  </div>
);

// ── Skeleton ───────────────────────────────────────────────────
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-[#F4F4F5] ${className}`} />
);

// ── Stat card ──────────────────────────────────────────────────
export const StatCard = ({
  value,
  label,
  icon,
}: {
  value: string | number;
  label: string;
  icon?: string;
}) => (
  <div className="rounded-md border border-[#E4E4E7] bg-white p-4 text-center">
    {icon && <div className="mb-1 text-2xl">{icon}</div>}
    <div className="text-[24px] font-bold leading-[32px] text-[#18181B]">{value}</div>
    <div className="mt-0.5 text-xs text-[#71717A]">{label}</div>
  </div>
);

// ── Chip / filter pill ─────────────────────────────────────────
export const Chip = ({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2 ${
      active
        ? "border-[#18181B] bg-[#F4F4F5] text-[#18181B]"
        : "border-[#E4E4E7] bg-white text-[#52525B] hover:border-[#18181B] hover:bg-[#FAFAFA]"
    }`}
  >
    {children}
  </button>
);