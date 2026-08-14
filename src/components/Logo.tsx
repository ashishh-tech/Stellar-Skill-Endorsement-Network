import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Custom SVG logo for Skill Endorsement Network.
 * Depicts interconnected network nodes forming a stylized trust graph,
 * rendered in the Stellar blue → orange accent gradient.
 */
export function Logo({ size = 36, className = '' }: LogoProps) {
  const id = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SkillNet Logo"
    >
      <defs>
        {/* Primary gradient: Stellar blue → orange */}
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5c7cfa" />
          <stop offset="50%" stopColor="#748ffc" />
          <stop offset="100%" stopColor="#ff6b35" />
        </linearGradient>

        {/* Secondary glow gradient */}
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5c7cfa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#5c7cfa" stopOpacity="0" />
        </radialGradient>

        {/* Outer ring gradient */}
        <linearGradient id={`${id}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5c7cfa" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#4c6ef5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <circle cx="60" cy="60" r="56" fill={`url(#${id}-glow)`} />

      {/* Outer ring */}
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke={`url(#${id}-ring)`}
        strokeWidth="2.5"
        fill="none"
      />

      {/* Network connection lines */}
      <g stroke={`url(#${id}-grad)`} strokeWidth="2" strokeLinecap="round" opacity="0.5">
        {/* Center to outer nodes */}
        <line x1="60" y1="60" x2="35" y2="32" />
        <line x1="60" y1="60" x2="88" y2="35" />
        <line x1="60" y1="60" x2="90" y2="72" />
        <line x1="60" y1="60" x2="32" y2="78" />
        <line x1="60" y1="60" x2="60" y2="95" />

        {/* Inter-node connections (trust graph edges) */}
        <line x1="35" y1="32" x2="88" y2="35" />
        <line x1="88" y1="35" x2="90" y2="72" />
        <line x1="90" y1="72" x2="60" y2="95" />
        <line x1="60" y1="95" x2="32" y2="78" />
        <line x1="32" y1="78" x2="35" y2="32" />
      </g>

      {/* Outer network nodes */}
      <g>
        {/* Top-left node */}
        <circle cx="35" cy="32" r="7" fill="#1a1a25" stroke={`url(#${id}-grad)`} strokeWidth="2.5" />
        <circle cx="35" cy="32" r="3" fill="#5c7cfa" />

        {/* Top-right node */}
        <circle cx="88" cy="35" r="7" fill="#1a1a25" stroke={`url(#${id}-grad)`} strokeWidth="2.5" />
        <circle cx="88" cy="35" r="3" fill="#748ffc" />

        {/* Right node */}
        <circle cx="90" cy="72" r="7" fill="#1a1a25" stroke={`url(#${id}-grad)`} strokeWidth="2.5" />
        <circle cx="90" cy="72" r="3" fill="#ff6b35" />

        {/* Bottom node */}
        <circle cx="60" cy="95" r="7" fill="#1a1a25" stroke={`url(#${id}-grad)`} strokeWidth="2.5" />
        <circle cx="60" cy="95" r="3" fill="#f59f00" />

        {/* Left node */}
        <circle cx="32" cy="78" r="7" fill="#1a1a25" stroke={`url(#${id}-grad)`} strokeWidth="2.5" />
        <circle cx="32" cy="78" r="3" fill="#20c997" />
      </g>

      {/* Central hub node — larger, emphasized */}
      <circle cx="60" cy="60" r="14" fill="#1a1a25" stroke={`url(#${id}-grad)`} strokeWidth="3" />
      <circle cx="60" cy="60" r="8" fill={`url(#${id}-grad)`} opacity="0.9" />
      <circle cx="60" cy="60" r="4" fill="white" opacity="0.9" />
    </svg>
  );
}
