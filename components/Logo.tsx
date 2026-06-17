import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({
  size = 36,
  className = "",
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer box */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="12"
        fill="#18181B"
      />

      {/* Books */}
      <rect
        x="16"
        y="16"
        width="8"
        height="28"
        rx="2"
        fill="white"
      />

      <rect
        x="28"
        y="12"
        width="8"
        height="32"
        rx="2"
        fill="white"
      />

      <rect
        x="40"
        y="18"
        width="8"
        height="26"
        rx="2"
        fill="white"
      />

      {/* Shelf */}
      <rect
        x="14"
        y="48"
        width="36"
        height="4"
        rx="2"
        fill="white"
      />
    </svg>
  );
}