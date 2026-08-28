'use client';

import React, { useState, useEffect } from 'react';
import { useDemoStore } from '@/features/demo/useDemoStore';
import { Globe, Sparkles, Zap, ShieldCheck, Volume2, VolumeX, Users } from 'lucide-react';
import { soundFx } from '@/utils/soundEffects';

export function NetworkStatusBar() {
  const { isDemoMode, toggleDemoMode, peers, activeDemoUser, setActiveDemoUser } = useDemoStore();
  const [blockHeight, setBlockHeight] = useState(582498);
  const [latency, setLatency] = useState(38);
  const [soundActive, setSoundActive] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  useEffect(() => {
    setSoundActive(soundFx.isEnabled());
    const interval = setInterval(() => {
      setBlockHeight((prev) => prev + 1);
      setLatency(32 + Math.floor(Math.random() * 18));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAudio = () => {
    const next = soundFx.toggle();
    setSoundActive(next);
  };

  return (
    <div className="w-full bg-surface-1/95 border-b border-white/[0.08] backdrop-blur-xl px-4 py-1.5 text-xs text-gray-400 z-40 relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Testnet Status & Block Height */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-gray-200 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stellar-400" />
              Stellar Soroban Testnet
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
            <span>Ledger:</span>
            <span className="text-stellar-300 font-bold">#{blockHeight.toLocaleString()}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-gray-400 text-[11px]">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Avg Fee: <strong className="text-gray-200 font-mono">0.00001 XLM</strong></span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-gray-400 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>RPC Latency: <strong className="text-emerald-400 font-mono">{latency}ms</strong></span>
          </div>
        </div>

        {/* Right: Quick Persona Switcher, Audio, & Demo Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona selector quick dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-surface-3 border border-white/[0.08] text-gray-300 hover:text-white transition-all text-[11px] font-medium"
              title="Switch demo persona for testing"
            >
              <Users className="w-3 h-3 text-stellar-400" />
              <span className="hidden sm:inline text-gray-400">Persona:</span>
              <span className="text-white font-semibold">{activeDemoUser.name.split(' ')[0]}</span>
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-1.5 w-64 bg-surface-2/95 border border-white/[0.12] rounded-xl shadow-2xl backdrop-blur-2xl py-1.5 z-50 animate-slide-down">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-gray-400 border-b border-white/[0.06]">
                  Select Reviewer Persona
                </div>
                {peers.map((peer) => (
                  <button
                    key={peer.address}
                    onClick={() => {
                      setActiveDemoUser(peer);
                      setShowPersonaMenu(false);
                      soundFx.playClick();
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-3 transition-colors ${
                      activeDemoUser.address === peer.address
                        ? 'bg-stellar-500/15 text-stellar-300 font-semibold'
                        : 'text-gray-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{peer.name}</div>
                      <div className="text-[10px] text-gray-400">{peer.role} • {peer.reputation} pts</div>
                    </div>
                    {activeDemoUser.address === peer.address && (
                      <span className="w-2 h-2 rounded-full bg-stellar-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`p-1.5 rounded-lg border transition-all text-xs ${
              soundActive
                ? 'bg-stellar-500/20 text-stellar-300 border-stellar-500/40 shadow-sm shadow-stellar-500/20'
                : 'bg-surface-2 text-gray-500 border-white/[0.08] hover:text-gray-300'
            }`}
            title={soundActive ? 'Audio FX: ON (Click to Mute)' : 'Audio FX: OFF (Click to Enable)'}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 text-stellar-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => {
              toggleDemoMode();
              soundFx.playClick();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              isDemoMode
                ? 'bg-gradient-to-r from-accent-orange/20 to-amber-500/20 text-accent-orange border-accent-orange/40 shadow-sm shadow-accent-orange/20'
                : 'bg-surface-3 text-gray-400 border-white/[0.08] hover:text-white'
            }`}
            title="Toggle interactive demo mode for instant reviewer evaluation"
          >
            <Sparkles className="w-3 h-3" />
            <span>{isDemoMode ? 'Demo Mode Active' : 'Enable Demo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
