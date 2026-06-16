"use client";

const NODES = [
  { x: 50, y: 45, label: "Books", icon: "📚", size: 42 },
  { x: 80, y: 18, label: "Notes", icon: "📝", size: 36 },
  { x: 18, y: 22, label: "Mentors", icon: "🌟", size: 36 },
  { x: 78, y: 72, label: "Students", icon: "👥", size: 38 },
  { x: 22, y: 68, label: "Study Groups", icon: "💡", size: 34 },
  { x: 50, y: 88, label: "Success", icon: "🎓", size: 38 },
];
const EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 3],
  [1, 5],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [0, 4],
  [1, 2],
];

export default function NetworkViz() {
  return (
    <div className="relative h-72 w-full select-none overflow-hidden rounded-lg border border-[#E4E4E7] bg-white">
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
            stroke="#E4E4E7"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />
        ))}
      </svg>

      {NODES.map((n, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center gap-0.5"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-base"
            style={{
              width: n.size,
              height: n.size,
              fontSize: n.size * 0.42,
            }}
          >
            {n.icon}
          </div>
          <span className="text-[8px] font-medium text-[#71717A] whitespace-nowrap">
            {n.label}
          </span>
        </div>
      ))}
    </div>
  );
}