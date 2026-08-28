'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDemoStore } from '@/features/demo/useDemoStore';
import { Logo } from '@/components/Logo';
import { Sparkles, Zap, Shield, Award, ArrowRight, Play } from 'lucide-react';
import { soundFx } from '@/utils/soundEffects';

interface InteractiveHeroGraphProps {
  onSelectPeer: (peer: any) => void;
}

export function InteractiveHeroGraph({ onSelectPeer }: InteractiveHeroGraphProps) {
  const { peers } = useDemoStore();
  const [activeNode, setActiveNode] = useState(0);
  const [firingBeam, setFiringBeam] = useState<{ from: number; to: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through peers unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveNode((prev) => {
        const next = (prev + 1) % Math.min(peers.length, 5);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [peers.length, isHovered]);

  const handleFireEndorsementBeam = (targetIdx: number) => {
    soundFx.playBeam();
    setFiringBeam({ from: activeNode, to: targetIdx });
    setTimeout(() => {
      setFiringBeam(null);
      soundFx.playSuccess();
    }, 1200);
  };

  const displayPeers = peers.slice(0, 5);

  return (
    <div
      className="relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer ambient pulsing glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-stellar-500/20 via-accent-orange/15 to-accent-emerald/20 blur-2xl animate-pulse-glow" />

      {/* Orbiting Ring 1 */}
      <div className="absolute inset-0 animate-orbit pointer-events-none">
        <svg viewBox="0 0 480 480" className="w-full h-full">
          <circle
            cx="240"
            cy="240"
            r="210"
            stroke="url(#hero-ring-1)"
            strokeWidth="1.5"
            strokeDasharray="6 14"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="hero-ring-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5c7cfa" />
              <stop offset="50%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#20c997" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Orbiting Ring 2 (Counter-spin) */}
      <div className="absolute inset-8 animate-counter-spin pointer-events-none opacity-30">
        <svg viewBox="0 0 480 480" className="w-full h-full">
          <circle
            cx="240"
            cy="240"
            r="160"
            stroke="url(#hero-ring-2)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <defs>
            <linearGradient id="hero-ring-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7048e8" />
              <stop offset="100%" stopColor="#15aabf" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* SVG Connecting Trust Lines & Firing Beams */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="active-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c7cfa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="idle-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c7cfa" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#20c997" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center-to-node links */}
        {displayPeers.map((_, i) => {
          const angle = (i * 2 * Math.PI) / displayPeers.length - Math.PI / 2;
          const radius = 165;
          const x = 240 + radius * Math.cos(angle);
          const y = 240 + radius * Math.sin(angle);
          const isActive = activeNode === i;

          return (
            <g key={i}>
              <line
                x1="240"
                y1="240"
                x2={x}
                y2={y}
                stroke={isActive ? 'url(#active-line)' : 'url(#idle-line)'}
                strokeWidth={isActive ? '2.5' : '1'}
                strokeDasharray={isActive ? 'none' : '4 6'}
                filter={isActive ? 'url(#glow)' : undefined}
              />
              {isActive && (
                <circle cx={x} cy={y} r="6" fill="#ff6b35" className="animate-ping" opacity="0.6" />
              )}
            </g>
          );
        })}

        {/* Inter-node peer-to-peer mesh lines */}
        {displayPeers.map((_, i) => {
          const angle1 = (i * 2 * Math.PI) / displayPeers.length - Math.PI / 2;
          const nextIdx = (i + 1) % displayPeers.length;
          const angle2 = (nextIdx * 2 * Math.PI) / displayPeers.length - Math.PI / 2;
          const radius = 165;
          const x1 = 240 + radius * Math.cos(angle1);
          const y1 = 240 + radius * Math.sin(angle1);
          const x2 = 240 + radius * Math.cos(angle2);
          const y2 = 240 + radius * Math.sin(angle2);

          return (
            <line
              key={`mesh-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          );
        })}

        {/* Dynamic Beam Particle when Firing Endorsement */}
        {firingBeam && (
          <line
            x1="240"
            y1="240"
            x2={
              240 +
              165 *
                Math.cos(
                  (firingBeam.to * 2 * Math.PI) / displayPeers.length - Math.PI / 2
                )
            }
            y2={
              240 +
              165 *
                Math.sin(
                  (firingBeam.to * 2 * Math.PI) / displayPeers.length - Math.PI / 2
                )
            }
            stroke="#ff6b35"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Central Soroban VM Core */}
      <div className="absolute z-20 flex flex-col items-center justify-center text-center p-5 rounded-3xl bg-surface-1/95 border-2 border-stellar-500/50 shadow-2xl shadow-stellar-500/30 backdrop-blur-2xl animate-float">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-stellar-500/30 blur-md animate-pulse" />
          <Logo size={46} className="relative z-10" />
        </div>
        <div className="text-[10px] font-black text-stellar-300 font-mono tracking-wider mt-1.5 flex items-center gap-1">
          <span>SOROBAN VM</span>
        </div>
        <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>CONSENSUS</span>
        </div>
      </div>

      {/* Orbiting Peer Cards */}
      {displayPeers.map((peer, i) => {
        const angle = (i * 2 * Math.PI) / displayPeers.length - Math.PI / 2;
        const radius = 165;
        const x = 240 + radius * Math.cos(angle);
        const y = 240 + radius * Math.sin(angle);
        const isSelected = activeNode === i;

        return (
          <div
            key={peer.address}
            onClick={() => {
              setActiveNode(i);
              soundFx.playClick();
              onSelectPeer(peer);
            }}
            style={{
              left: `${(x / 480) * 100}%`,
              top: `${(y / 480) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-30 cursor-pointer p-2.5 sm:p-3 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${
              isSelected
                ? 'bg-surface-2/95 border-accent-orange shadow-xl shadow-accent-orange/30 scale-110 ring-2 ring-accent-orange/40'
                : 'bg-surface-1/90 border-white/[0.12] hover:border-stellar-400 hover:scale-105 hover:bg-surface-2'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${
                    isSelected
                      ? 'from-accent-orange via-amber-500 to-stellar-500'
                      : 'from-stellar-500 to-stellar-700'
                  } flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md`}
                >
                  {peer.name.charAt(0)}
                </div>
                {peer.verifiedStatus && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-surface-1 flex items-center justify-center">
                    <span className="text-[8px] text-white">✓</span>
                  </div>
                )}
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                  <span>{peer.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-accent-orange font-mono font-semibold">
                  <span>{peer.reputation}</span>
                  <span className="text-gray-400 font-normal">Trust pts</span>
                </div>
              </div>
            </div>

            {/* Quick mini-action when selected */}
            {isSelected && (
              <div className="mt-2 pt-1.5 border-t border-white/[0.08] flex items-center justify-between gap-1 text-[10px]">
                <span className="text-stellar-300 font-medium truncate max-w-[70px]">
                  {peer.skills[0]?.name || 'Rust'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFireEndorsementBeam((i + 1) % displayPeers.length);
                  }}
                  className="px-1.5 py-0.5 rounded bg-accent-orange/20 hover:bg-accent-orange/30 text-accent-orange font-bold text-[9px] flex items-center gap-0.5"
                  title="Simulate Endorsement Transaction"
                >
                  <Zap className="w-2.5 h-2.5" />
                  <span>Endorse</span>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Interactive Helper Banner at bottom */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-surface-1/90 border border-white/[0.1] text-[10px] text-gray-400 font-mono backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap shadow-lg">
        <Sparkles className="w-3 h-3 text-accent-orange animate-pulse" />
        <span>Click any node to inspect on-chain dossier</span>
      </div>
    </div>
  );
}
