"use client";
import { ReactNode } from "react";

// ── Badge ──────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  violet:  "bg-violet-500/15 text-violet-300 border-violet-500/25",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  amber:   "bg-amber-500/15 text-amber-300 border-amber-500/25",
  blue:    "bg-blue-500/15 text-blue-300 border-blue-500/25",
  rose:    "bg-rose-500/15 text-rose-300 border-rose-500/25",
  slate:   "bg-white/6 text-white/45 border-white/10",
  cyan:    "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
};
export const Badge = ({
  children, color = "violet",
}: { children: ReactNode; color?: string }) => (
  <span className={`badge ${BADGE_COLORS[color] ?? BADGE_COLORS.violet}`}>
    {children}
  </span>
);

// ── Card ───────────────────────────────────────────────────────
export const Card = ({
  children, className = "", hover = false, onClick, padding = "p-5",
}: {
  children: ReactNode; className?: string;
  hover?: boolean; onClick?: () => void; padding?: string;
}) => (
  <div
    onClick={onClick}
    className={`glass ${padding} ${hover ? "glass-hover cursor-pointer" : ""} ${className}`}
  >
    {children}
  </div>
);

// Alias for backward compat
export const GlassCard = Card;

// ── Avatar ─────────────────────────────────────────────────────
const AVATAR_SIZES: Record<string, string> = {
  xs: "w-6 h-6 text-[9px]",
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};
const AVATAR_GRADS: Record<string, string> = {
  violet:  "from-violet-600 to-violet-400",
  emerald: "from-emerald-600 to-emerald-400",
  blue:    "from-blue-600 to-blue-400",
  amber:   "from-amber-600 to-amber-400",
};
export const Avatar = ({
  initials, size = "md", gradient = "violet",
}: { initials: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; gradient?: string }) => (
  <div className={`${AVATAR_SIZES[size]} rounded-full bg-gradient-to-br ${AVATAR_GRADS[gradient] ?? AVATAR_GRADS.violet} flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg`}>
    {initials}
  </div>
);

// ── Star rating ────────────────────────────────────────────────
export const StarRating = ({ rating }: { rating: number }) => (
  <span className="text-amber-400 font-semibold text-sm">
    {"★".repeat(Math.floor(rating))}
    {"☆".repeat(5 - Math.floor(rating))}
    {" "}
    <span className="text-amber-300/80">{rating.toFixed(1)}</span>
  </span>
);

// ── Section label (Evalyze-style) ──────────────────────────────
export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="section-label mb-3">{children}</p>
);

// ── Section header ─────────────────────────────────────────────
export const SectionHeader = ({ label }: { label: string }) => (
  <p className="caption uppercase tracking-widest mb-3">{label}</p>
);

// ── Divider ────────────────────────────────────────────────────
export const Divider = ({ className = "" }: { className?: string }) => (
  <hr className={`divider ${className}`} />
);

// ── Empty state ────────────────────────────────────────────────
export const EmptyState = ({
  icon, title, desc,
}: { icon: string; title: string; desc: string }) => (
  <div className="text-center py-16 space-y-2">
    <div className="text-4xl mb-3">{icon}</div>
    <p className="heading-md text-white">{title}</p>
    <p className="body-sm">{desc}</p>
  </div>
);

// ── Skeleton ───────────────────────────────────────────────────
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`shimmer rounded-xl ${className}`} />
);

// ── Stat card (Evalyze-style) ──────────────────────────────────
export const StatCard = ({
  value, label, icon,
}: { value: string | number; label: string; icon?: string }) => (
  <div className="stat-card">
    {icon && <div className="text-2xl mb-1">{icon}</div>}
    <div className="heading-md text-white">{value}</div>
    <div className="caption mt-0.5">{label}</div>
  </div>
);

// ── Chip / filter pill ─────────────────────────────────────────
export const Chip = ({
  children, active, onClick,
}: { children: ReactNode; active?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`chip ${active ? "chip-active" : ""}`}
  >
    {children}
  </button>
);
