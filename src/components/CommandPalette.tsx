'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/features/demo/useDemoStore';
import {
  Search,
  LayoutDashboard,
  Activity,
  ArrowLeftRight,
  BarChart3,
  Settings,
  User,
  Zap,
  Sparkles,
  X,
  ExternalLink,
  Award,
} from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { peers, setSelectedPeerForDossier, toggleDemoMode } = useDemoStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Live Activity Feed', href: '/activity', icon: Activity, category: 'Navigation' },
    { label: 'Transaction Center', href: '/transactions', icon: ArrowLeftRight, category: 'Navigation' },
    { label: 'Analytics & Leaderboard', href: '/analytics', icon: BarChart3, category: 'Navigation' },
    { label: 'Contract Settings', href: '/settings', icon: Settings, category: 'Navigation' },
  ];

  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPeers = peers.filter(
    (peer) =>
      peer.name.toLowerCase().includes(query.toLowerCase()) ||
      peer.skills.some((s) => s.name.toLowerCase().includes(query.toLowerCase())) ||
      peer.role.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectNav = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleSelectPeer = (peer: typeof peers[0]) => {
    setOpen(false);
    setSelectedPeerForDossier(peer);
    router.push('/analytics');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-surface-1 border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden glass-panel">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, users, skills, contracts... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Navigations */}
          {filteredNav.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 px-3 py-1 tracking-wider">
                Pages
              </div>
              <div className="space-y-1">
                {filteredNav.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleSelectNav(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-stellar-500/10 hover:border-stellar-500/20 border border-transparent transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-stellar-400" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-stellar-300">Jump →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Profiles */}
          {filteredPeers.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 px-3 py-1 tracking-wider">
                Reputation Graph Dossiers
              </div>
              <div className="space-y-1">
                {filteredPeers.map((peer) => (
                  <button
                    key={peer.address}
                    onClick={() => handleSelectPeer(peer)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-accent-orange/10 hover:border-accent-orange/20 border border-transparent transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-surface-3 flex items-center justify-center text-xs font-bold text-white">
                        {peer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-1.5">
                          {peer.name}
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-3 text-gray-400">
                            {peer.role}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>Rep: <strong className="text-accent-orange">{peer.reputation}</strong></span>
                          <span>·</span>
                          <span>{peer.skills.length} skills</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-accent-orange opacity-0 group-hover:opacity-100 transition-opacity">
                      Inspect Dossier →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredPeers.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No matching pages or profiles found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-surface-0/60 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-white/[0.1] font-mono">↑↓</kbd>
            <span>Navigate</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-white/[0.1] font-mono">ENTER</kbd>
            <span>Select</span>
          </div>
          <span>Stellar Soroban SkillNet</span>
        </div>
      </div>
    </div>
  );
}
