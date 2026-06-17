import React from 'react';

interface LogoProps {
  colorClass?: string;
  isTransparent?: boolean;
}

export default function Logo({ colorClass = "text-primary-600 dark:text-white", isTransparent = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg
        className={`w-9 h-9 transition-transform duration-300 hover:rotate-12`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="qLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-500, #6366f1)" />
            <stop offset="50%" stopColor="var(--color-secondary-500, #a855f7)" />
            <stop offset="100%" stopColor="var(--color-accent-500, #06b6d4)" />
          </linearGradient>
        </defs>

        {/* The loop of the Q */}
        <circle
          cx="45"
          cy="45"
          r="30"
          stroke="url(#qLogoGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          className="drop-shadow-lg"
        />

        {/* Node structure tail representing Culture Graph connections */}
        <path
          d="M 62 62 L 85 85"
          stroke="url(#qLogoGradient)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Sub-node at the tail end */}
        <circle
          cx="85"
          cy="85"
          r="6"
          fill="var(--color-accent-400, #22d3ee)"
          className="animate-pulse"
        />
      </svg>
      <span className={`font-display text-2xl font-bold tracking-normal ${colorClass}`}>
        Qultre
      </span>
    </div>
  );
}
