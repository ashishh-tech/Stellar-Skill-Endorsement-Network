'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Shield, Users, Zap, Award, GitBranch, Lock, CheckCircle, Globe, Layers } from 'lucide-react';
import { useWalletStore } from '@/features/wallet/store';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  const { isConnected } = useWalletStore();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Animated background orbs */}
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-stellar-500/8 rounded-full blur-[140px] animate-float" />
        <div className="absolute bottom-[-5%] right-[10%] w-[400px] h-[400px] bg-accent-orange/6 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-stellar-700/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(92, 124, 250, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(92, 124, 250, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-400 text-sm font-medium mb-8 animate-fade-in">
                <Zap className="w-4 h-4" />
                Powered by Stellar Soroban Smart Contracts
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 animate-slide-up">
                <span className="text-white">Trust-Weighted</span>
                <br />
                <span className="gradient-text">Skill Endorsements</span>
                <br />
                <span className="text-white">On-Chain</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Build your professional reputation graph with Sybil-resistant,
                trust-weighted endorsements. Every endorsement is permanent,
                auditable, and weighted by the endorser&apos;s on-chain reputation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link href={isConnected ? '/dashboard' : '/dashboard'} className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  {isConnected ? 'Go to Dashboard' : 'Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/activity" className="btn-secondary text-lg px-8 py-4">
                  View Live Activity
                </Link>
              </div>
            </div>

            {/* Right: Animated Network Visualization */}
            <div className="hidden lg:flex items-center justify-center">
              <NetworkVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-6 border-y border-white/[0.04] bg-surface-1/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Stellar Testnet Deployed</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-stellar-400" />
              <span>Sybil-Resistant by Design</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent-orange" />
              <span>Immutable Audit Trail</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent-emerald" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Skill Endorsement Network?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Traditional endorsements are meaningless. Ours are verifiable, weighted by trust, and permanently recorded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="glass-card-hover p-6 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-white/[0.04] relative">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-1/20 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-xs font-semibold uppercase tracking-wider mb-4">
              Getting Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Four simple steps to build your trust-weighted on-chain reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center group relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-stellar-500/30 to-transparent" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stellar-500 to-accent-orange mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-stellar-500/20">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-semibold uppercase tracking-wider mb-4">
              Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Dual-Contract Architecture
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Two Soroban smart contracts communicate via cross-contract calls to form a trust-weighted endorsement graph.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card-glow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-stellar-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-stellar-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">ProfileRegistry</h3>
                  <p className="text-xs text-gray-500">Contract #1</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>User registration with RBAC (Admin / User / Verifier)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Skill management with categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Reputation score storage (base: 100)</span>
                </li>
              </ul>
            </div>

            <div className="glass-card-glow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-orange/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-accent-orange" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">EndorsementEngine</h3>
                  <p className="text-xs text-gray-500">Contract #2</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Cross-contract reputation queries in real-time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Trust-weighted endorsement calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Self-endorsement and duplicate prevention</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cross-contract call arrow */}
          <div className="flex items-center justify-center my-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-2 border border-white/[0.06] text-xs text-gray-400">
              <Layers className="w-4 h-4 text-stellar-400" />
              <span>Inter-Contract Calls via Soroban cross_contract_call</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center group">
                <AnimatedStatValue value={stat.value} />
                <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/[0.04] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-stellar-500/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Logo size={64} className="mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Build Your On-Chain Reputation?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Connect your Stellar wallet, create a profile, and start giving and receiving trust-weighted skill endorsements today.
          </p>
          <Link href="/dashboard" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Launch Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ----------- Animated Stat Value ----------- */
function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`text-3xl font-bold gradient-text mb-1 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {value}
    </div>
  );
}

/* ----------- Network Visualization ----------- */
function NetworkVisualization() {
  return (
    <div className="relative w-[420px] h-[420px]">
      {/* Outer rotating ring */}
      <div className="absolute inset-0 animate-orbit">
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none" className="w-full h-full">
          <circle cx="210" cy="210" r="190" stroke="url(#viz-ring)" strokeWidth="1" strokeDasharray="8 8" opacity="0.3" />
          <defs>
            <linearGradient id="viz-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5c7cfa" />
              <stop offset="100%" stopColor="#ff6b35" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Central Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-float">
          <Logo size={100} />
        </div>
      </div>

      {/* Orbiting Nodes */}
      {ORBIT_NODES.map((node, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            animationDelay: `${node.delay}s`,
            animationDuration: `${5 + i}s`,
          }}
        >
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${node.bg} border ${node.border} backdrop-blur-md shadow-lg`}>
            <div className={`w-2 h-2 rounded-full ${node.dot}`} />
            <span className="text-xs font-medium text-gray-200 whitespace-nowrap">{node.label}</span>
          </div>
        </div>
      ))}

      {/* Connecting lines from nodes to center (decorative SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 420 420">
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c7cfa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <line x1="210" y1="210" x2="65" y2="80" stroke="url(#line-grad)" strokeWidth="1" />
        <line x1="210" y1="210" x2="360" y2="65" stroke="url(#line-grad)" strokeWidth="1" />
        <line x1="210" y1="210" x2="380" y2="260" stroke="url(#line-grad)" strokeWidth="1" />
        <line x1="210" y1="210" x2="320" y2="380" stroke="url(#line-grad)" strokeWidth="1" />
        <line x1="210" y1="210" x2="50" y2="300" stroke="url(#line-grad)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ----------- Constants ----------- */

const ORBIT_NODES = [
  { x: 5, y: 12, label: 'Rust', bg: 'bg-surface-2/80', border: 'border-stellar-500/20', dot: 'bg-stellar-400', delay: 0 },
  { x: 72, y: 5, label: 'Soroban', bg: 'bg-surface-2/80', border: 'border-accent-orange/20', dot: 'bg-accent-orange', delay: 1.2 },
  { x: 80, y: 52, label: 'Rep: 245', bg: 'bg-surface-2/80', border: 'border-accent-amber/20', dot: 'bg-accent-amber', delay: 0.6 },
  { x: 65, y: 85, label: 'Verified ✓', bg: 'bg-surface-2/80', border: 'border-accent-emerald/20', dot: 'bg-accent-emerald', delay: 1.8 },
  { x: 2, y: 65, label: 'TypeScript', bg: 'bg-surface-2/80', border: 'border-stellar-500/20', dot: 'bg-stellar-300', delay: 2.4 },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Sybil-Resistant',
    description: 'Endorsement weight scales with the endorser\'s on-chain reputation. Gaming the system requires earning real trust first.',
    gradient: 'from-stellar-500/20 to-stellar-600/20',
  },
  {
    icon: Users,
    title: 'Inter-Contract Trust Graph',
    description: 'Two smart contracts communicate in real-time — the endorsement engine queries live reputation scores from the profile registry.',
    gradient: 'from-accent-emerald/20 to-emerald-500/20',
  },
  {
    icon: Award,
    title: 'Weighted Reputation',
    description: 'Every endorsement carries weight proportional to the endorser\'s reputation score. Higher trust = stronger endorsements.',
    gradient: 'from-accent-orange/20 to-amber-500/20',
  },
  {
    icon: Lock,
    title: 'Immutable & Auditable',
    description: 'All endorsements are permanently recorded on the Stellar blockchain with full event history and audit trail.',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    icon: GitBranch,
    title: 'Smart Contract RBAC',
    description: 'Role-based access control with Admin, User, and Verifier roles. Upgradeable contracts with admin-only controls.',
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    icon: Zap,
    title: 'Real-Time Events',
    description: 'Live activity feed streams contract events from the Soroban RPC. See endorsements happen in real-time.',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
];

const STEPS = [
  { title: 'Connect Wallet', description: 'Link your Stellar wallet (Freighter, Albedo, or others)' },
  { title: 'Create Profile', description: 'Register your on-chain identity with skills' },
  { title: 'Endorse Skills', description: 'Endorse other users\' skills with trust-weighted backing' },
  { title: 'Build Reputation', description: 'Grow your on-chain reputation graph over time' },
];

const STATS = [
  { value: '2', label: 'Smart Contracts' },
  { value: '4+', label: 'Inter-Contract Calls' },
  { value: '∞', label: 'On-Chain Events' },
  { value: '<5s', label: 'Tx Confirmation' },
];
