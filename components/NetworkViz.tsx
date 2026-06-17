"use client";
import { BookOpen, FileText, Users, Lightbulb, GraduationCap, Sparkles } from "lucide-react";

const NODES = [
  { x: 50, y: 42, label: "Books",       icon: BookOpen,       size: 48 },
  { x: 80, y: 15, label: "Notes",       icon: FileText,       size: 40 },
  { x: 18, y: 20, label: "Mentors",     icon: Users,          size: 40 },
  { x: 78, y: 72, label: "Students",    icon: Users,          size: 44 },
  { x: 22, y: 68, label: "Groups",      icon: Lightbulb,      size: 38 },
  { x: 50, y: 88, label: "Success",     icon: GraduationCap,  size: 42 },
];

const EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 3], [1, 5],
  [2, 3], [2, 4], [3, 5], [4, 5], [0, 4], [1, 2],
];

export default function NetworkViz() {
  return (
    <div className="relative h-64 w-full select-none overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] sm:h-72">
      {/* Embedded keyframe styles */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(2); }
        }
        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
        @keyframes flow {
          to { stroke-dashoffset: -8; }
        }
        .animate-flow {
          stroke-dasharray: 4 4;
          stroke-dashoffset: 0;
          animation: flow 2s linear infinite;
        }
      `}</style>

      {/* Connection lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#D4D4D8"
            strokeWidth="0.4"
            opacity={0.7}
            className="animate-flow"
          />
        ))}
      </svg>

      {/* Nodes */}
      {NODES.map((n, i) => {
        const Icon = n.icon;
        return (
          <div
            key={i}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="animate-breathe flex items-center justify-center rounded-full border border-[#E4E4E7] bg-white shadow-sm"
              style={{ width: n.size, height: n.size }}
            >
              <Icon size={n.size * 0.45} className="text-[#52525B]" />
            </div>
            <span className="text-[10px] font-medium text-[#71717A] whitespace-nowrap">
              {n.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}