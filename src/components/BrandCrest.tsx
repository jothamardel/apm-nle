import React from "react";

export function BrandCrest({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Civic Shield in APM Deep Forest Green & Gold */}
      <path
        d="M32 3L57 12.5V31C57 46.8 46.4 56.5 32 61C17.6 56.5 7 46.8 7 31V12.5L32 3Z"
        fill="#0B3D2E"
        stroke="#D4A017"
        strokeWidth="2.5"
      />
      {/* White Inner Crest Arch */}
      <path
        d="M32 9L51 16.2V30.8C51 43.1 42.8 50.8 32 54.5C21.2 50.8 13 43.1 13 30.8V16.2L32 9Z"
        fill="#146C43"
        fillOpacity="0.45"
        stroke="#FAF9F5"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      {/* Rising Sun / Reset Emblem */}
      <circle cx="32" cy="28" r="9" fill="#E6B42C" />
      <path
        d="M19 37C23.5 33.5 27.6 32 32 32C36.4 32 40.5 33.5 45 37"
        stroke="#FAF9F5"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M22 43.5H42"
        stroke="#E6B42C"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <text
        x="32"
        y="31"
        textAnchor="middle"
        fill="#0B3D2E"
        fontSize="8.5"
        fontWeight="800"
        fontFamily="sans-serif"
      >
        NLE
      </text>
    </svg>
  );
}

