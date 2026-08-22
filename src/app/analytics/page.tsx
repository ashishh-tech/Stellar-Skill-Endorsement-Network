'use client';

import React, { useState } from 'react';
import { useDemoStore } from '@/features/demo/useDemoStore';
import {
  BarChart3,
  Award,
  Users,
  TrendingUp,
  ShieldCheck,
  Crown,
  Medal,
  Trophy,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  Share2,
  Code2,
  Shield,
} from 'lucide-react';
import { truncateAddress } from '@/config/stellar';

export default function AnalyticsPage() {
  const { peers, setSelectedPeerForDossier } = useDemoStore();
  const [activeView, setActiveView] = useState<'leaderboard' | 'graph'>('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'reputation' | 'endorsements' | 'skills'>('reputation');

  // Filter & sort leaderboard
  const filteredPeers = peers
    .filter((peer) => {
      const matchesQuery =
        peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        peer.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        peer.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === 'all' ||
        peer.skills.some((s) => s.category.toLowerCase() === categoryFilter.toLowerCase());

      return matchesQuery && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'reputation') return b.reputation - a.reputation;
      if (sortBy === 'endorsements') return b.receivedEndorsementsCount - a.receivedEndorsementsCount;
      if (sortBy === 'skills') return b.skills.length - a.skills.length;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-stellar-400" />
            Network Reputation Intelligence & Leaderboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time on-chain reputation graph metrics, developer leaderboard, and trust distribution
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="p-1 bg-surface-2 border border-white/[0.08] rounded-2xl flex gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'leaderboard'
                ? 'bg-stellar-500 text-white shadow-md shadow-stellar-500/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Leaderboard Table
          </button>
          <button
            onClick={() => setActiveView('graph')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'graph'
                ? 'bg-stellar-500 text-white shadow-md shadow-stellar-500/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Interactive Graph
          </button>
        </div>
      </div>

      {/* 2. Intelligence Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Skill Categories */}
        <div className="glass-card-glow p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-orange/15 border border-accent-orange/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-accent-orange" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Skill Category Weight</h3>
              <p className="text-[11px] text-gray-500">Aggregate on-chain endorsement backing</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <ProgressBar label="Blockchain (Rust & Soroban)" percentage={88} count="3,960 pts" color="from-stellar-500 to-stellar-400" />
            <ProgressBar label="Security & Formal Verification" percentage={74} count="2,390 pts" color="from-accent-orange to-amber-400" />
            <ProgressBar label="Frontend (TypeScript & SDK)" percentage={62} count="1,880 pts" color="from-emerald-500 to-teal-400" />
            <ProgressBar label="Identity & Cryptography" percentage={45} count="1,640 pts" color="from-purple-500 to-indigo-400" />
          </div>
        </div>

        {/* Trust Tier Distribution */}
        <div className="glass-card-glow p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stellar-500/15 border border-stellar-500/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-stellar-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Reputation Tier Distribution</h3>
              <p className="text-[11px] text-gray-500">Active participants by trust tier</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <ProgressBar label="Tier 3: Master (>200 Rep)" percentage={35} count="2 Accounts" color="from-amber-400 to-orange-500" />
            <ProgressBar label="Tier 2: Endorsed (150-200 Rep)" percentage={45} count="3 Accounts" color="from-stellar-400 to-stellar-600" />
            <ProgressBar label="Tier 1: Base (100-150 Rep)" percentage={20} count="1 Account" color="from-gray-400 to-gray-600" />
          </div>
        </div>

        {/* Security & Soroban Footprint Metrics */}
        <div className="glass-card-glow p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent-emerald" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Smart Contract Security</h3>
              <p className="text-[11px] text-gray-500">Sybil defense and audit integrity</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-gray-400">Self-Endorsement Block</span>
              <span className="text-emerald-400 font-mono font-bold">100% Enforced</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-gray-400">Inter-Contract Atomicity</span>
              <span className="text-stellar-300 font-mono font-bold">Guaranteed</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-gray-400">Sybil Scaling Curve</span>
              <span className="text-accent-orange font-mono font-bold">Sublinear (√x)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-400">Storage TTL Protection</span>
              <span className="text-white font-mono font-bold">Instance &amp; Persistent</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Graph View or Leaderboard Table */}
      {activeView === 'graph' ? (
        <div className="glass-card-glow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-stellar-400" />
                Interactive On-Chain Reputation Graph Visualizer
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Click any node in the graph below to inspect their full on-chain reputation dossier.
              </p>
            </div>
            <span className="text-xs font-mono text-stellar-400">6 Connected Nodes</span>
          </div>

          <div className="relative w-full h-[500px] bg-surface-1/90 rounded-2xl border border-white/[0.06] overflow-hidden flex items-center justify-center">
            {/* Ambient graph grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(92, 124, 250, 0.4) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(92, 124, 250, 0.4) 1px, transparent 1px)
                `,
                backgroundSize: '32px 32px',
              }}
            />

            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="edge-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5c7cfa" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Alice -> Bob */}
              <line x1="25%" y1="30%" x2="70%" y2="35%" stroke="url(#edge-grad-1)" strokeWidth="2" strokeDasharray="4 4" />
              {/* Bob -> Charlie */}
              <line x1="70%" y1="35%" x2="60%" y2="75%" stroke="url(#edge-grad-1)" strokeWidth="2" />
              {/* Alice -> Charlie */}
              <line x1="25%" y1="30%" x2="60%" y2="75%" stroke="url(#edge-grad-1)" strokeWidth="2.5" />
              {/* Diana -> Alice */}
              <line x1="40%" y1="15%" x2="25%" y2="30%" stroke="url(#edge-grad-1)" strokeWidth="1.5" />
              {/* Elena -> Bob */}
              <line x1="85%" y1="65%" x2="70%" y2="35%" stroke="url(#edge-grad-1)" strokeWidth="1.5" />
              {/* Felix -> Charlie */}
              <line x1="20%" y1="70%" x2="60%" y2="75%" stroke="url(#edge-grad-1)" strokeWidth="1" />
            </svg>

            {/* Nodes Positions */}
            {[
              { peer: peers[0], top: '30%', left: '25%', color: 'from-stellar-500 to-stellar-600' },
              { peer: peers[1], top: '35%', left: '70%', color: 'from-accent-orange to-amber-600' },
              { peer: peers[2], top: '75%', left: '60%', color: 'from-accent-emerald to-teal-600' },
              { peer: peers[3], top: '15%', left: '40%', color: 'from-purple-500 to-indigo-600' },
              { peer: peers[4], top: '65%', left: '85%', color: 'from-cyan-500 to-blue-600' },
              { peer: peers[5], top: '70%', left: '20%', color: 'from-rose-500 to-pink-600' },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPeerForDossier(item.peer)}
                style={{ top: item.top, left: item.left, transform: 'translate(-50%, -50%)' }}
                className="absolute z-20 cursor-pointer group"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-lg font-bold text-white shadow-xl group-hover:scale-115 transition-transform border-2 border-white/20`}
                  >
                    {item.peer.name.charAt(0)}
                  </div>
                  <div className="mt-2 px-3 py-1 rounded-xl bg-surface-2/95 border border-white/[0.1] text-center shadow-lg backdrop-blur-md">
                    <div className="text-xs font-bold text-white whitespace-nowrap">
                      {item.peer.name}
                    </div>
                    <div className="text-[10px] text-accent-orange font-mono font-bold">
                      {item.peer.reputation} Rep
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Leaderboard Table View */
        <div className="glass-card-glow p-6 space-y-6">
          {/* Controls: Search & Category Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, skill, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs text-gray-500 font-medium shrink-0">Category:</span>
              {['all', 'blockchain', 'security', 'frontend', 'identity'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border ${
                    categoryFilter === cat
                      ? 'bg-stellar-500/20 text-stellar-300 border-stellar-500/40'
                      : 'bg-surface-2 text-gray-400 border-white/[0.04] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase border-b border-white/[0.08] bg-surface-1/50">
                <tr>
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Developer / Identity</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Reputation</th>
                  <th className="py-3.5 px-4">Top Skills</th>
                  <th className="py-3.5 px-4">Endorsements</th>
                  <th className="py-3.5 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredPeers.map((peer, idx) => (
                  <tr
                    key={peer.address}
                    onClick={() => setSelectedPeerForDossier(peer)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4">
                      <RankBadge rank={idx + 1} />
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stellar-500 to-accent-orange flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md">
                          {peer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-stellar-300 transition-colors flex items-center gap-2">
                            {peer.name}
                            {peer.verifiedStatus && (
                              <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {truncateAddress(peer.address, 6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`badge ${
                          peer.role === 'Admin'
                            ? 'badge-warning'
                            : peer.role === 'Verifier'
                            ? 'badge-success'
                            : 'badge-stellar'
                        }`}
                      >
                        {peer.role}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold gradient-text text-base">
                          {peer.reputation}
                        </span>
                        <div className="w-16 h-2 rounded-full bg-surface-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-stellar-500 to-accent-orange"
                            style={{ width: `${Math.min((peer.reputation / 400) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {peer.skills.slice(0, 2).map((s, sIdx) => (
                          <span key={sIdx} className="badge badge-stellar text-[10px]">
                            {s.name}
                          </span>
                        ))}
                        {peer.skills.length > 2 && (
                          <span className="text-[10px] text-gray-500 self-center">
                            +{peer.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-white">
                      {peer.receivedEndorsementsCount} in / {peer.givenEndorsementsCount} out
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button className="btn-secondary py-1.5 px-3 text-xs group-hover:border-stellar-500/40">
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------ Helper Components ------------ */

function ProgressBar({
  label,
  percentage,
  count,
  color,
}: {
  label: string;
  percentage: number;
  count: string;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-400 font-mono">{count}</span>
      </div>
      <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden">
        <div
          className={`bg-gradient-to-r ${color} h-full rounded-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
        <Crown className="w-4 h-4 text-amber-400" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-xl bg-gray-400/20 border border-gray-400/40 flex items-center justify-center">
        <Medal className="w-4 h-4 text-gray-300" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-xl bg-orange-700/20 border border-orange-700/40 flex items-center justify-center">
        <Trophy className="w-4 h-4 text-orange-400" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-xl bg-surface-3 flex items-center justify-center text-xs font-bold text-gray-400 font-mono">
      #{rank}
    </div>
  );
}
