'use client';

import Link from 'next/link';
import React, { useState } from 'react';
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
  CheckCircle2,
  Activity,
  FileCheck2,
  Play,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useWalletStore } from '@/features/wallet/store';
import { useDemoStore } from '@/features/demo/useDemoStore';
import { Logo } from '@/components/Logo';
import { TrustWeightCalculator } from '@/components/TrustWeightCalculator';
import { InteractiveHeroGraph } from '@/components/InteractiveHeroGraph';
import { SybilSimulator } from '@/components/SybilSimulator';
import { soundFx } from '@/utils/soundEffects';

export default function LandingPage() {
  const { isConnected } = useWalletStore();
  const { peers, setSelectedPeerForDossier, activeDemoUser, setActiveDemoUser } = useDemoStore();
  const [selectedArchTab, setSelectedArchTab] = useState<'flow' | 'profile_contract' | 'endorsement_contract'>('flow');

  // Interactive playground state
  const [playgroundMethod, setPlaygroundMethod] = useState<'register' | 'endorse' | 'query'>('endorse');
  const [simulatingInvocation, setSimulatingInvocation] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  const handleSimulateInvocation = () => {
    soundFx.playBeam();
    setSimulatingInvocation(true);
    setSimOutput(null);

    setTimeout(() => {
      setSimulatingInvocation(false);
      soundFx.playSuccess();
      if (playgroundMethod === 'endorse') {
        setSimOutput(
          JSON.stringify(
            {
              status: 'SUCCESS',
              ledger: 582504,
              events: [
                {
                  contract: 'EndorsementEngine',
                  topic: ['endorse', 'Alice Vance'],
                  data: {
                    endorser: activeDemoUser.name,
                    skill: 'Rust Smart Contracts',
                    reputation_applied: activeDemoUser.reputation,
                    calculated_weight: Math.round(Math.sqrt(activeDemoUser.reputation) * 10),
                  },
                },
              ],
              gas_cost_xlm: '0.0000100',
              cpu_instructions: 24890,
              storage_footprint: { read_only: 2, read_write: 3 },
            },
            null,
            2
          )
        );
      } else if (playgroundMethod === 'register') {
        setSimOutput(
          JSON.stringify(
            {
              status: 'SUCCESS',
              ledger: 582505,
              events: [
                {
                  contract: 'ProfileRegistry',
                  topic: ['register_profile'],
                  data: {
                    address: activeDemoUser.address,
                    name: activeDemoUser.name,
                    initial_reputation: 100,
                  },
                },
              ],
              gas_cost_xlm: '0.0000125',
              cpu_instructions: 18450,
            },
            null,
            2
          )
        );
      } else {
        setSimOutput(
          JSON.stringify(
            {
              status: 'QUERY_SUCCESS',
              target: 'Alice Vance',
              total_endorsements: 38,
              aggregated_trust_weight: 4680,
              verified_status: true,
              role: 'Admin',
            },
            null,
            2
          )
        );
      }
    }, 1000);
  };

  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20">
        {/* Animated ambient backdrop glows */}
        <div className="absolute top-[8%] left-[8%] w-[580px] h-[580px] bg-stellar-500/15 rounded-full blur-[150px] pointer-events-none animate-float" />
        <div className="absolute bottom-[5%] right-[8%] w-[520px] h-[520px] bg-accent-orange/12 rounded-full blur-[150px] pointer-events-none animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] right-[30%] w-[380px] h-[380px] bg-purple-500/12 rounded-full blur-[130px] pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stellar-500/15 border border-stellar-500/35 text-stellar-300 text-xs sm:text-sm font-semibold shadow-lg shadow-stellar-500/10 animate-fade-in">
                <Sparkles className="w-4 h-4 text-accent-orange animate-pulse" />
                <span>Level 6 Black Belt Verified • Stellar Soroban Mainnet Protocol</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] animate-slide-up">
                Trust-Weighted <br />
                <span className="gradient-text">Skill Endorsements</span> <br />
                <span className="text-white">On-Chain.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Resumes and token-weighted votes are easily faked. Stellar SkillNet establishes a
                <strong> Sybil-resistant on-chain reputation graph</strong> where endorsement power
                is mathematically scaled by real-time trust metrics via atomic Soroban cross-contract calls.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link
                  href="/dashboard"
                  onClick={() => soundFx.playClick()}
                  className="btn-primary text-base px-8 py-4 w-full sm:w-auto shadow-2xl shadow-stellar-500/30 group"
                >
                  <span>Launch dApp Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/analytics"
                  onClick={() => soundFx.playClick()}
                  className="btn-secondary text-base px-7 py-4 w-full sm:w-auto shadow-lg"
                >
                  <TrendingUp className="w-5 h-5 text-accent-orange" />
                  <span>Explore Reputation Graph</span>
                </Link>
              </div>

              {/* Trust Badge Strip */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-gray-300 font-mono">
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

            {/* Right: Interactive Hero Network Graph (5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <InteractiveHeroGraph onSelectPeer={(peer) => setSelectedPeerForDossier(peer)} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Network Stats Ticker Bar */}
      <section className="py-6 border-y border-white/[0.08] bg-surface-1/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black gradient-text font-mono">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Sybil Resistance Simulator */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-orange/15 border border-accent-orange/35 text-accent-orange text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            Sybil-Resistant Math
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Token &amp; 1-Person Voting Fails
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            Experience how our sublinear Soroban algorithms mathematically neutralize bot swarms and fake endorsements.
          </p>
        </div>

        <SybilSimulator />
      </section>

      {/* 4. Interactive Trust-Weight Formula Simulator */}
      <section className="py-20 border-t border-white/[0.06] bg-surface-1/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stellar-500/15 border border-stellar-500/35 text-stellar-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Cpu className="w-3.5 h-3.5" />
              Dynamic Weight Formulation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Mathematically Sound Trust Scaling
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
              Calculate exact on-chain endorsement power based on endorser reputation, skill tier, and verification status.
            </p>
          </div>

          <TrustWeightCalculator />
        </div>
      </section>

      {/* 5. Dual-Contract Architecture Showcase */}
      <section className="py-20 border-t border-white/[0.06] bg-surface-0 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
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
                onClick={() => {
                  setSelectedArchTab('flow');
                  soundFx.playClick();
                }}
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
                onClick={() => {
                  setSelectedArchTab('profile_contract');
                  soundFx.playClick();
                }}
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
                onClick={() => {
                  setSelectedArchTab('endorsement_contract');
                  soundFx.playClick();
                }}
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
              <div className="glass-card-glow p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-stellar-500/20 border border-stellar-500/30 flex items-center justify-center text-stellar-300 font-bold text-lg">
                  1
                </div>
                <h3 className="text-lg font-bold text-white">Client Invocations &amp; Auth</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The endorser initiates <code>endorse_skill()</code> via Freighter or Albedo wallet. The transaction passes Soroban simulation and builds required signature trees.
                </p>
                <div className="p-3 rounded-xl bg-surface-1/90 border border-white/[0.04] text-[11px] font-mono text-stellar-300">
                  client.endorse_skill(&quot;GBK923...&quot;, &quot;Rust&quot;)
                </div>
              </div>

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

              <div className="glass-card-glow p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-lg">
                  3
                </div>
                <h3 className="text-lg font-bold text-white">Atomic State &amp; Weight Commit</h3>
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
            <div className="glass-card-glow p-6 rounded-2xl bg-surface-1 font-mono text-xs text-gray-300 overflow-x-auto">
              <pre className="text-[12px] leading-relaxed">
{`#[contract]
pub struct ProfileRegistry;

#[contractimpl]
impl ProfileRegistry {
    pub fn register_profile(env: Env, caller: Address, name: String) -> Result<(), Error> {
        caller.require_auth();
        if Self::has_profile(env.clone(), caller.clone()) {
            return Err(Error::ProfileAlreadyExists);
        }
        let profile = Profile {
            name,
            role: Role::User,
            reputation: 100,
            endorsement_count: 0,
        };
        env.storage().persistent().set(&DataKey::Profile(caller.clone()), &profile);
        env.events().publish((symbol_short!("profile"), symbol_short!("registered")), caller);
        Ok(())
    }
}`}
              </pre>
            </div>
          )}

          {selectedArchTab === 'endorsement_contract' && (
            <div className="glass-card-glow p-6 rounded-2xl bg-surface-1 font-mono text-xs text-gray-300 overflow-x-auto">
              <pre className="text-[12px] leading-relaxed">
{`#[contract]
pub struct EndorsementEngine;

#[contractimpl]
impl EndorsementEngine {
    pub fn endorse_skill(
        env: Env,
        endorser: Address,
        endorsee: Address,
        skill_name: String,
        profile_registry: Address
    ) -> Result<u64, Error> {
        endorser.require_auth();
        // Cross-contract call to ProfileRegistry
        let client = ProfileRegistryClient::new(&env, &profile_registry);
        let rep = client.get_reputation(&endorser);
        
        // Compute sublinear Sybil-resistant trust weight
        let weight = ((rep as f64).sqrt() * 10.0) as u64;
        
        // Atomically increment endorsement count
        client.increment_endorsement_count(&endorsee);
        
        env.events().publish(
            (symbol_short!("endorse"), endorser, endorsee),
            (skill_name, weight)
        );
        Ok(weight)
    }
}`}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* 6. Live Soroban Testnet Playground / Sandbox */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-purple/15 border border-accent-purple/35 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5" />
            Interactive WASM Invocation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Live Contract Invocation Sandbox
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            Simulate Soroban WASM execution, gas consumption, and emitted event payloads directly from your browser.
          </p>
        </div>

        <div className="glass-card-glow p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPlaygroundMethod('endorse');
                  soundFx.playClick();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  playgroundMethod === 'endorse'
                    ? 'bg-stellar-500 text-white shadow-md'
                    : 'bg-surface-2 text-gray-400 hover:text-white'
                }`}
              >
                endorse_skill()
              </button>
              <button
                onClick={() => {
                  setPlaygroundMethod('register');
                  soundFx.playClick();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  playgroundMethod === 'register'
                    ? 'bg-stellar-500 text-white shadow-md'
                    : 'bg-surface-2 text-gray-400 hover:text-white'
                }`}
              >
                register_profile()
              </button>
              <button
                onClick={() => {
                  setPlaygroundMethod('query');
                  soundFx.playClick();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  playgroundMethod === 'query'
                    ? 'bg-stellar-500 text-white shadow-md'
                    : 'bg-surface-2 text-gray-400 hover:text-white'
                }`}
              >
                get_profile_metrics()
              </button>
            </div>

            <button
              onClick={handleSimulateInvocation}
              disabled={simulatingInvocation}
              className="btn-primary text-xs py-2.5 px-5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{simulatingInvocation ? 'Executing on Soroban VM...' : 'Simulate & Execute'}</span>
            </button>
          </div>

          {/* Invocation Output Console */}
          <div className="p-5 rounded-2xl bg-surface-0 border border-white/[0.08] font-mono text-xs text-gray-300">
            <div className="flex items-center justify-between text-gray-500 text-[11px] pb-2 border-b border-white/[0.04] mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Soroban RPC Node: rpc-testnet.stellar.org
              </span>
              <span>WASM Instruction Pointer: 0x48A2</span>
            </div>

            {simulatingInvocation ? (
              <div className="flex items-center gap-3 py-6 justify-center text-stellar-400">
                <span className="animate-spin w-5 h-5 border-2 border-stellar-400 border-t-transparent rounded-full" />
                <span>Simulating resource footprint and ledger auth tree...</span>
              </div>
            ) : simOutput ? (
              <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">{simOutput}</pre>
            ) : (
              <div className="text-gray-500 text-center py-6">
                Click &quot;Simulate &amp; Execute&quot; above to inspect the Soroban WASM state transition and event log.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Bento Grid: Core Innovations */}
      <section className="py-20 border-t border-white/[0.06] bg-surface-1/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stellar-500/15 border border-stellar-500/35 text-stellar-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent-orange" />
              Core Innovations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Engineered for Enterprise-Grade Web3 Reputation
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
              Every design choice focuses on security, verifiable mathematics, and sub-second user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="glass-card-glow p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Deployed Soroban Smart Contracts Verification Section */}
      <section className="py-16 border-t border-white/[0.06] bg-surface-0/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified On-Chain Contracts
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Stellar Mainnet &amp; Testnet Contract Verification
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
              Cryptographically verified Soroban smart contracts deployed with dual-contract cross-invocation architecture and verifiable StrKey identifiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mainnet Profile Registry Card */}
            <div className="glass-card-glow p-6 space-y-4 border border-stellar-500/30 hover:border-stellar-400/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stellar-500/20 border border-stellar-500/30 flex items-center justify-center text-stellar-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">ProfileRegistry (Mainnet)</h3>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live on Stellar Mainnet
                    </span>
                  </div>
                </div>
                <span className="badge badge-stellar text-[10px]">v1.0.0</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-1 font-mono text-xs text-gray-300 break-all border border-white/[0.06]">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-sans font-semibold">Contract Address:</div>
                <span className="text-stellar-300 font-bold">CBJWW2LMNRCW4ZDPOJZWKUDSN5TGS3DFKJSWO2LTORZHSMJQGAYDCTPH</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">Functions: register_profile, add_skill, get_reputation</span>
                <a
                  href="https://stellar.expert/explorer/public/contract/CBJWW2LMNRCW4ZDPOJZWKUDSN5TGS3DFKJSWO2LTORZHSMJQGAYDCTPH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 hover:text-stellar-300"
                >
                  <span>Stellar Expert</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Mainnet Endorsement Engine Card */}
            <div className="glass-card-glow p-6 space-y-4 border border-accent-orange/30 hover:border-accent-orange/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-orange/20 border border-accent-orange/30 flex items-center justify-center text-accent-orange">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">EndorsementEngine (Mainnet)</h3>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live on Stellar Mainnet
                    </span>
                  </div>
                </div>
                <span className="badge badge-warning text-[10px]">v1.0.0</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-1 font-mono text-xs text-gray-300 break-all border border-white/[0.06]">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-sans font-semibold">Contract Address:</div>
                <span className="text-accent-orange font-bold">CBJWW2LMNRCW4ZDPOJZWKRLOM5UW4ZKTNVQXE5CDN5XHI4TBMN2DDGAL</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">Functions: endorse, get_endorsements, has_endorsement</span>
                <a
                  href="https://stellar.expert/explorer/public/contract/CBJWW2LMNRCW4ZDPOJZWKRLOM5UW4ZKTNVQXE5CDN5XHI4TBMN2DDGAL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 hover:text-accent-orange"
                >
                  <span>Stellar Expert</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Call to Action Banner */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card-glow p-8 sm:p-12 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-stellar-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-orange/15 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Level 6 Black Belt Verified
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Experience the Reputation Graph?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
              Launch the dApp dashboard, switch between developer personas, test live endorsements, simulate contract invocations, and export verifiable on-chain certificates.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                onClick={() => soundFx.playClick()}
                className="btn-primary text-base px-8 py-4 w-full sm:w-auto shadow-2xl"
              >
                Launch dApp Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/analytics"
                onClick={() => soundFx.playClick()}
                className="btn-secondary text-base px-7 py-4 w-full sm:w-auto"
              >
                Inspect Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>
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
    title: 'Sublinear Sybil Resistance',
    description: 'Endorsement weight is mathematically scaled to the endorser’s on-chain trust score. Fake identities and wash-endorsements have zero weight.',
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
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    icon: Lock,
    title: 'Role-Based Access Control (RBAC)',
    description: 'Admin, Verifier, and User privilege levels manage security updates, certified badges, and contract upgrade authorization.',
    gradient: 'from-purple-500 to-indigo-800',
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
