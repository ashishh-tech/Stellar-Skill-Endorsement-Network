'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from '@/features/wallet/components/WalletButton';
import { Logo } from '@/components/Logo';
import { useDemoStore } from '@/features/demo/useDemoStore';
import {
  LayoutDashboard,
  Activity,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/analytics', label: 'Leaderboard & Graph', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDemoMode } = useDemoStore();

  const handleOpenSearch = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-surface-0/85 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]">
              <div className="absolute inset-0 rounded-full bg-stellar-500/20 blur-md group-hover:blur-lg transition-all" />
              <Logo size={38} className="relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tight flex items-center gap-1">
                Skill<span className="gradient-text">Net</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-stellar-500/20 text-stellar-300 font-mono font-bold ml-1 border border-stellar-500/30">
                  SOROBAN
                </span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono -mt-1 hidden sm:block">
                Trust Reputation Graph
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-surface-1/80 border border-white/[0.06] rounded-2xl">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link flex items-center gap-2 ${
                    isActive ? 'nav-link-active' : ''
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Wallet & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Hotkey Button */}
            <button
              onClick={handleOpenSearch}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2/80 hover:bg-surface-3 border border-white/[0.08] text-xs text-gray-400 hover:text-white transition-all shadow-sm"
              title="Global search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-1 border border-white/[0.1] text-[10px] font-mono text-gray-400">
                ⌘K
              </kbd>
            </button>

            <WalletButton />

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-surface-0/95 backdrop-blur-2xl animate-slide-down">
          <nav className="px-4 py-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-stellar-500/20 text-stellar-300 border border-stellar-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setMobileOpen(false);
                handleOpenSearch();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05]"
            >
              <Search className="w-5 h-5" />
              Search Network (⌘K)
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
