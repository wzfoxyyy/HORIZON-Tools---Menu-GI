import React from 'react';

interface HorizonLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const HorizonLogo: React.FC<HorizonLogoProps> = ({
  className = '',
  size = 36,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Black Hole Vector Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Subtle gradient for accretion disk rings */}
          <linearGradient id="bhDiskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8ecf8" />
            <stop offset="50%" stopColor="#adb2cc" />
            <stop offset="100%" stopColor="#6e738c" />
          </linearGradient>
          <linearGradient id="bhEventHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Back portion of the accretion disk (behind the singularity) */}
        <ellipse
          cx="60"
          cy="58"
          rx="54"
          ry="15"
          transform="rotate(-15 60 58)"
          stroke="url(#bhDiskGrad)"
          strokeWidth="4"
          strokeDasharray="180"
          strokeDashoffset="0"
          opacity="0.85"
        />
        <ellipse
          cx="60"
          cy="58"
          rx="47"
          ry="11.5"
          transform="rotate(-15 60 58)"
          stroke="url(#bhDiskGrad)"
          strokeWidth="2.5"
          opacity="0.65"
        />
        <ellipse
          cx="60"
          cy="58"
          rx="41"
          ry="8.5"
          transform="rotate(-15 60 58)"
          stroke="url(#bhDiskGrad)"
          strokeWidth="1.5"
          opacity="0.45"
        />

        {/* Outer event horizon subtle glow ring */}
        <circle
          cx="60"
          cy="58"
          r="26"
          stroke="url(#bhEventHorizon)"
          strokeWidth="2"
          fill="none"
        />

        {/* Central Singularity: Pure Black Void */}
        <circle
          cx="60"
          cy="58"
          r="24"
          fill="#020204"
          stroke="#262838"
          strokeWidth="1.5"
        />

        {/* Front portion of accretion disk / ring cutting across in front */}
        <path
          d="M 12 70 C 25 76, 50 78, 75 72 C 95 67, 108 58, 114 52"
          stroke="url(#bhDiskGrad)"
          strokeWidth="4.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 20 73 C 35 78, 55 80, 75 75 C 92 70, 102 63, 108 57"
          stroke="url(#bhDiskGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 28 75 C 42 79, 60 80, 75 77 C 88 73, 96 68, 100 63"
          stroke="url(#bhDiskGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Optional Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-base text-[#d8dceb] leading-tight font-sans">
            HORIZON
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[#7d8299] font-semibold uppercase leading-none mt-0.5">
            TOOLS
          </span>
        </div>
      )}
    </div>
  );
};
