'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Shield,
  Users,
  Zap,
  Award,
  GitBranch,
  Lock,
  CheckCircle,
  Globe,
  Layers,
  Sparkles,
  Cpu,
  Code2,
  Share2,
  TrendingUp,
  Terminal,
  Database,
  Search,
} from 'lucide-react';
import { useWalletStore } from '@/features/wallet/store';
import { useDemoStore } from '@/features/demo/useDemoStore';
import { Logo } from '@/components/Logo';
import { TrustWeightCalculator } from '@/components/TrustWeightCalculator';
import { truncateAddress } from '@/config/stellar';

export default function LandingPage() {
  const { isConnected } = useWalletStore();
  const { peers, setSelectedPeerForDossier } = useDemoStore();
  const [selectedArchTab, setSelectedArchTab] = useState<'flow' | 'profile_contract' | 'endorsement_contract'>('flow');

  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-20">
        {/* Animated ambient backdrop glows */}
        <div className="absolute top-[5%] left-[10%] w-[550px] h-[550px] bg-stellar-500/12 rounded-full blur-[140px] pointer-events-none animate-float" />
        <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-accent-orange/10 rounded-full blur-[140px] pointer-events-none animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] right-[35%] w-[350px] h-[350px] bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(92, 124, 250, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(92, 124, 250, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Text & CTA Content (7 cols) */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stellar-500/15 border border-stellar-500/30 text-stellar-300 text-xs sm:text-sm font-semibold shadow-lg shadow-stellar-500/10 animate-fade-in">
                <Sparkles className="w-4 h-4 text-accent-orange animate-pulse" />
                <span>Next-Gen Stellar Soroban Smart Contract Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] animate-slide-up">
                Trust-Weighted <br />
                <span className="gradient-text">Skill Endorsements</span> <br />
                <span className="text-white">On-Chain.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Traditional resume endorsements are easily faked. Stellar SkillNet establishes a
                <strong> Sybil-resistant on-chain reputation graph</strong> where endorsement weights
                are mathematically scaled by the endorser&apos;s real-time reputation score via Soroban cross-contract calls.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link
                  href="/dashboard"
                  className="btn-primary text-base px-8 py-4 w-full sm:w-auto shadow-xl shadow-stellar-500/25 group"
                >
                  <span>Launch dApp Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/analytics"
                  className="btn-secondary text-base px-7 py-4 w-full sm:w-auto"
                >
                  <TrendingUp className="w-5 h-5 text-accent-orange" />
                  <span>Explore Reputation Graph</span>
                </Link>
              </div>

              {/* Trust Badge Strip */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-gray-400 font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Dual Contract Inter-Calling</span>
                </div>
                <div className="flex items-center gap-1.5 text-stellar-300">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Sublinear Sybil Resistance</span>
                </div>
                <div className="flex items-center gap-1.5 text-accent-orange">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Real-Time Soroban RPC</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Interactive Network Visualizer (5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <InteractiveHeroGraph onSelectPeer={(peer) => setSelectedPeerForDossier(peer)} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Network Stats Ticker Bar */}
      <section className="py-6 border-y border-white/[0.08] bg-surface-1/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black gradient-text font-mono">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Trust-Weight Formula Simulator */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-orange/15 border border-accent-orange/30 text-accent-orange text-xs font-bold uppercase tracking-wider mb-3">
            Sybil-Resistant Mechanics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Mathematically Sound Trust Scaling
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            No spam, no self-endorsements, no bots. How our Soroban contracts protect integrity.
          </p>
        </div>

        <TrustWeightCalculator />
      </section>

      {/* 4. Dual-Contract Architecture Showcase (Tabbed Rust Code & Inter-Call Visualizer) */}
      <section className="py-20 border-t border-white/[0.06] bg-surface-1/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Code2 className="w-3.5 h-3.5" />
              Soroban Rust Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Dual-Contract Inter-Invocation Design
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
              Explore how <code>ProfileRegistry</code> and <code>EndorsementEngine</code> communicate atomically on the Stellar VM.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center mb-8">
            <div className="p-1 bg-surface-2 border border-white/[0.08] rounded-2xl flex gap-1">
              <button
                onClick={() => setSelectedArchTab('flow')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedArchTab === 'flow'
                    ? 'bg-stellar-500 text-white shadow-lg shadow-stellar-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                Cross-Contract Workflow
              </button>
              <button
                onClick={() => setSelectedArchTab('profile_contract')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedArchTab === 'profile_contract'
                    ? 'bg-stellar-500 text-white shadow-lg shadow-stellar-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                ProfileRegistry.rs
              </button>
              <button
                onClick={() => setSelectedArchTab('endorsement_contract')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedArchTab === 'endorsement_contract'
                    ? 'bg-stellar-500 text-white shadow-lg shadow-stellar-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                EndorsementEngine.rs
              </button>
            </div>
          </div>

          {/* Architecture Content */}
          {selectedArchTab === 'flow' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Step 1 */}
              <div className="glass-card-glow p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-stellar-500/20 border border-stellar-500/30 flex items-center justify-center text-stellar-300 font-bold text-lg">
                  1
                </div>
                <h3 className="text-lg font-bold text-white">Client Invocations & Auth</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The endorser initiates <code>endorse_skill()</code> via Freighter or Albedo wallet. The transaction passes Soroban simulation and builds required signature trees.
                </p>
                <div className="p-3 rounded-xl bg-surface-1/90 border border-white/[0.04] text-[11px] font-mono text-stellar-300">
                  client.endorse_skill(&quot;GBK923...&quot;, &quot;Rust&quot;)
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-card-glow p-6 space-y-4 relative">
                <div className="w-12 h-12 rounded-2xl bg-accent-orange/20 border border-accent-orange/30 flex items-center justify-center text-accent-orange font-bold text-lg">
                  2
                </div>
                <h3 className="text-lg font-bold text-white">Inter-Contract Reputation Lookup</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  <code>EndorsementEngine</code> uses Soroban&apos;s <code>Env::invoke_contract()</code> to cross-call <code>ProfileRegistry::get_reputation()</code> and retrieve live trust scores.
                </p>
                <div className="p-3 rounded-xl bg-surface-1/90 border border-white/[0.04] text-[11px] font-mono text-accent-orange">
                  ProfileRegistryClient::new(&amp;env, &amp;profile_id)
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-card-glow p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-emerald/20 border border-accent-emerald/30 flex items-center justify-center text-emerald-300 font-bold text-lg">
                  3
                </div>
                <h3 className="text-lg font-bold text-white">Atomic State & Weight Commit</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Endorsement weights are mathematically aggregated. <code>ProfileRegistry::increment_endorsement_count()</code> is executed atomically and events stream to Soroban RPC.
                </p>
                <div className="p-3 rounded-xl bg-surface-1/90 border border-white/[0.04] text-[11px] font-mono text-emerald-400">
                  env.events().publish((symbol!(&quot;endorse&quot;), ...))
                </div>
              </div>
            </div>
          )}

          {selectedArchTab === 'profile_contract' && (
            <div className="glass-card p-6 font-mono text-xs overflow-x-auto bg-surface-1/95 border border-white/[0.08] rounded-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-gray-400">
                <span>contracts/profile_registry/src/lib.rs</span>
                <span className="text-stellar-400">Soroban Rust Contract #1</span>
              </div>
              <pre className="text-gray-300 leading-relaxed">
{`#[contractimpl]
impl ProfileRegistry {
    /// Registers a new on-chain identity with initial base reputation (100)
    pub fn register_profile(env: Env, owner: Address, name: String) -> Result<ProfileData, Error> {
        owner.require_auth();
        if Self::has_profile(env.clone(), owner.clone()) {
            return Err(Error::ProfileAlreadyExists);
        }
        let profile = ProfileData {
            owner: owner.clone(),
            name,
            role: Role::User,
            reputation: 100,
            skill_count: 0,
            endorsement_count: 0,
        };
        env.storage().persistent().set(&DataKey::Profile(owner.clone()), &profile);
        env.events().publish((symbol_short!("reg_prof"), owner), profile.reputation);
        Ok(profile)
    }

    pub fn get_reputation(env: Env, owner: Address) -> u32 {
        Self::get_profile(env, owner).map(|p| p.reputation).unwrap_or(0)
    }
}`}
              </pre>
            </div>
          )}

          {selectedArchTab === 'endorsement_contract' && (
            <div className="glass-card p-6 font-mono text-xs overflow-x-auto bg-surface-1/95 border border-white/[0.08] rounded-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-gray-400">
                <span>contracts/endorsement_engine/src/lib.rs</span>
                <span className="text-accent-orange">Soroban Rust Contract #2</span>
              </div>
              <pre className="text-gray-300 leading-relaxed">
{`#[contractimpl]
impl EndorsementEngine {
    /// Executes a trust-weighted endorsement via inter-contract call
    pub fn endorse_skill(
        env: Env,
        endorser: Address,
        endorsee: Address,
        skill: String,
        message: String,
    ) -> Result<Endorsement, Error> {
        endorser.require_auth();
        if endorser == endorsee {
            return Err(Error::SelfEndorsementNotAllowed);
        }

        // Cross-contract call: Query endorser reputation from ProfileRegistry
        let profile_client = ProfileRegistryClient::new(&env, &get_profile_contract(&env)?);
        let endorser_rep = profile_client.get_reputation(&endorser);
        if endorser_rep == 0 {
            return Err(Error::EndorserHasNoProfile);
        }

        // Sublinear trust weight calculation: sqrt(rep) * 8
        let weight = calculate_trust_weight(endorser_rep);
        let endorsement = Endorsement { endorser, endorsee, skill, weight, message };
        
        // Save persistent record & notify RPC
        save_endorsement(&env, &endorsement);
        env.events().publish((symbol_short!("endorse"), endorser), (endorsee, weight));
        Ok(endorsement)
    }
}`}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* 5. Core Platform Capabilities Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stellar-500/15 border border-stellar-500/30 text-stellar-300 text-xs font-bold uppercase tracking-wider mb-3">
            Core Highlights
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Stellar Soroban Dominance
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            Every feature is engineered for high throughput, cryptographic trust, and seamless user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={i} className="glass-card-hover p-6 group space-y-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-stellar-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Quick Leaderboard Teaser */}
      <section className="py-20 border-t border-white/[0.06] bg-surface-1/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-amber/15 border border-accent-amber/30 text-accent-amber text-xs font-bold uppercase tracking-wider mb-2">
                On-Chain Graph Preview
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Top Endorsed Developers
              </h2>
            </div>
            <Link href="/analytics" className="btn-secondary text-xs sm:text-sm flex items-center gap-1.5 self-start sm:self-auto">
              <span>View Full Leaderboard & Graph</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {peers.slice(0, 3).map((peer, idx) => (
              <div
                key={peer.address}
                onClick={() => setSelectedPeerForDossier(peer)}
                className="glass-card-hover p-5 cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stellar-500 to-accent-orange flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-stellar-500/20 group-hover:scale-105 transition-transform">
                    {peer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-stellar-300 transition-colors">
                      {peer.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-gray-300 font-medium">
                        {peer.role}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {truncateAddress(peer.address, 6)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-t border-white/[0.04]">
                  <span className="text-gray-400">Reputation Score</span>
                  <span className="font-bold gradient-text text-sm">{peer.reputation}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {peer.skills.slice(0, 2).map((s, sIdx) => (
                    <span key={sIdx} className="badge badge-stellar text-[10px]">
                      {s.name}
                    </span>
                  ))}
                  {peer.skills.length > 2 && (
                    <span className="text-[10px] text-gray-500 self-center">
                      +{peer.skills.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="py-24 relative overflow-hidden text-center border-t border-white/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-stellar-500/5 via-transparent to-surface-0 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Logo size={64} className="mx-auto animate-float" />
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Build Your On-Chain Reputation?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto">
            Connect with Freighter, Albedo, or test immediately via our interactive Reviewer Demo mode.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-4 shadow-xl shadow-stellar-500/30">
              Open dApp Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Interactive Hero Network Graph ----------------- */
function InteractiveHeroGraph({ onSelectPeer }: { onSelectPeer: (peer: any) => void }) {
  const { peers } = useDemoStore();
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % peers.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [peers.length]);

  return (
    <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
      {/* Outer spinning ring */}
      <div className="absolute inset-0 animate-orbit pointer-events-none">
        <svg viewBox="0 0 420 420" className="w-full h-full">
          <circle
            cx="210"
            cy="210"
            r="190"
            stroke="url(#hero-ring-grad)"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            opacity="0.35"
          />
          <defs>
            <linearGradient id="hero-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5c7cfa" />
              <stop offset="50%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#20c997" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Central Brand Core */}
      <div className="absolute z-20 flex flex-col items-center justify-center text-center p-6 rounded-full bg-surface-1/90 border-2 border-stellar-500/40 shadow-2xl backdrop-blur-xl animate-float">
        <Logo size={52} />
        <div className="text-[10px] font-black text-stellar-300 font-mono mt-1">SOROBAN VM</div>
      </div>

      {/* Orbiting Peer Nodes */}
      {peers.slice(0, 5).map((peer, i) => {
        const angle = (i * 2 * Math.PI) / 5;
        const radius = 145;
        const x = 210 + radius * Math.cos(angle);
        const y = 210 + radius * Math.sin(angle);
        const isSelected = activeNode === i;

        return (
          <div
            key={peer.address}
            onClick={() => onSelectPeer(peer)}
            style={{
              left: `${(x / 420) * 100}%`,
              top: `${(y / 420) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-30 cursor-pointer p-2.5 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
              isSelected
                ? 'bg-surface-2 border-accent-orange shadow-lg shadow-accent-orange/25 scale-110'
                : 'bg-surface-1/80 border-white/[0.1] hover:border-stellar-400 hover:scale-105'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-stellar-500 to-accent-orange flex items-center justify-center text-xs font-bold text-white shrink-0">
                {peer.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">{peer.name}</div>
                <div className="text-[10px] text-accent-orange font-mono font-semibold">
                  {peer.reputation} Rep
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* SVG Connecting Trust Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="trust-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c7cfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {peers.slice(0, 5).map((_, i) => {
          const angle = (i * 2 * Math.PI) / 5;
          const radius = 145;
          const x = 210 + radius * Math.cos(angle);
          const y = 210 + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1="210"
              y1="210"
              x2={x}
              y2={y}
              stroke="url(#trust-line)"
              strokeWidth="1.5"
              strokeDasharray={activeNode === i ? 'none' : '4 4'}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ----------------- Constants ----------------- */
const STATS = [
  { value: '2', label: 'Dual Soroban Contracts' },
  { value: '100%', label: 'Sybil-Resistant Cross Verification' },
  { value: '<3s', label: 'Stellar Testnet Finality' },
  { value: '0.00001', label: 'Average Gas (XLM)' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Sybil-Resistant Endorsements',
    description: 'Endorsement weight is mathematically locked to the endorser’s on-chain trust score. Fake identities and wash-endorsements have zero weight.',
    gradient: 'from-stellar-500 to-stellar-700',
  },
  {
    icon: GitBranch,
    title: 'Cross-Contract Soroban Invocation',
    description: 'The Endorsement Engine dynamically calls the Profile Registry on-chain in real-time to compute trust weighting with atomic guarantees.',
    gradient: 'from-accent-orange to-amber-600',
  },
  {
    icon: Award,
    title: 'Verifiable On-Chain Credentials',
    description: 'Every skill backed by peers is permanently registered on the Stellar blockchain, generating cryptographically auditable proof certificates.',
    gradient: 'from-accent-emerald to-teal-700',
  },
  {
    icon: Lock,
    title: 'Role-Based Access Control (RBAC)',
    description: 'Admin, Verifier, and User privilege levels manage security updates, certified badges, and contract upgrade authorization.',
    gradient: 'from-accent-purple to-indigo-800',
  },
  {
    icon: Zap,
    title: 'Real-Time Ledger RPC Streaming',
    description: 'Live activity feed connects directly to Soroban RPC endpoints, instantly capturing endorsement events and state mutations.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'Interactive Reputation Graph',
    description: 'Visual explorer mapping peer-to-peer trust links, category specialties, and historical contribution trajectories.',
    gradient: 'from-cyan-500 to-blue-600',
  },
];
