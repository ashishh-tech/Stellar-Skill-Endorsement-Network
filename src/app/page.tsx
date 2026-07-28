'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Users, Zap, Award, GitBranch, Lock } from 'lucide-react';
import { useWalletStore } from '@/features/wallet/store';

export default function LandingPage() {
  const { isConnected } = useWalletStore();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Background Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-stellar-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-orange/8 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
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

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
              Build your professional reputation graph with Sybil-resistant,
              trust-weighted endorsements. Every endorsement is permanent,
              auditable, and weighted by the endorser&apos;s on-chain reputation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link href={isConnected ? '/dashboard' : '/dashboard'} className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                {isConnected ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/activity" className="btn-secondary text-lg px-8 py-4">
                View Live Activity
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stellar-500/20 to-stellar-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-stellar-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stellar-500 to-accent-orange mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    icon: Shield,
    title: 'Sybil-Resistant',
    description: 'Endorsement weight scales with the endorser\'s on-chain reputation. Gaming the system requires earning real trust first.',
  },
  {
    icon: Users,
    title: 'Inter-Contract Trust Graph',
    description: 'Two smart contracts communicate in real-time — the endorsement engine queries live reputation scores from the profile registry.',
  },
  {
    icon: Award,
    title: 'Weighted Reputation',
    description: 'Every endorsement carries weight proportional to the endorser\'s reputation score. Higher trust = stronger endorsements.',
  },
  {
    icon: Lock,
    title: 'Immutable & Auditable',
    description: 'All endorsements are permanently recorded on the Stellar blockchain with full event history and audit trail.',
  },
  {
    icon: GitBranch,
    title: 'Smart Contract RBAC',
    description: 'Role-based access control with Admin, User, and Verifier roles. Upgradeable contracts with admin-only controls.',
  },
  {
    icon: Zap,
    title: 'Real-Time Events',
    description: 'Live activity feed streams contract events from the Soroban RPC. See endorsements happen in real-time.',
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
