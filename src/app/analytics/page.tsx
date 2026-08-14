'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Award, Users, TrendingUp, ShieldCheck, Crown, Medal, Trophy } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-stellar-400" />
          Network Reputation Analytics
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Visual metrics of on-chain reputation growth, skill distribution, and endorsement weighting
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card-glow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent-orange/15 flex items-center justify-center">
              <Award className="w-5 h-5 text-accent-orange" />
            </div>
            <h3 className="text-sm font-semibold text-gray-300">Top Skill Categories</h3>
          </div>
          <div className="space-y-3 mt-4">
            <AnimatedProgressBar label="Programming (Rust / TS)" percentage={85} count="142 endorsements" color="from-stellar-500 to-stellar-400" />
            <AnimatedProgressBar label="Blockchain (Soroban / Stellar)" percentage={72} count="98 endorsements" color="from-accent-orange to-amber-400" />
            <AnimatedProgressBar label="Security & Auditing" percentage={48} count="64 endorsements" color="from-accent-emerald to-emerald-400" />
            <AnimatedProgressBar label="DevOps & CI/CD" percentage={35} count="45 endorsements" color="from-violet-500 to-purple-400" />
          </div>
        </div>

        <div className="glass-card-glow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-stellar-500/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-stellar-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-300">Trust Distribution</h3>
          </div>
          <div className="space-y-3 mt-4">
            <AnimatedProgressBar label="Level 3 Verified (>200 Rep)" percentage={25} count="Tier 1 Accounts" color="from-accent-amber to-yellow-400" />
            <AnimatedProgressBar label="Level 2 Endorsed (120-200 Rep)" percentage={45} count="Tier 2 Accounts" color="from-stellar-500 to-stellar-300" />
            <AnimatedProgressBar label="Level 1 Base (100 Rep)" percentage={30} count="New Accounts" color="from-gray-500 to-gray-400" />
          </div>
        </div>

        <div className="glass-card-glow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent-emerald/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent-emerald" />
            </div>
            <h3 className="text-sm font-semibold text-gray-300">Security Metrics</h3>
          </div>
          <div className="space-y-3 mt-4">
            <StatRow label="Self-Endorsement Block Rate" value="100%" icon="🛡️" />
            <StatRow label="Duplicate Prevention Rate" value="100%" icon="🔒" />
            <StatRow label="Inter-Contract Call Success" value="100%" icon="⚡" />
            <StatRow label="Soroban Storage Model" value="Instance/Persistent" icon="💾" />
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-card-glow p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-stellar-400" />
          On-Chain Reputation Graph Preview
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-500 uppercase border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Account / Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Reputation Score</th>
                <th className="py-3 px-4">Endorsements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {LEADERBOARD_MOCK.map((user, i) => (
                <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="py-4 px-4">
                    <RankBadge rank={i + 1} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${AVATAR_COLORS[i][0]}, ${AVATAR_COLORS[i][1]})`,
                        }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-white group-hover:text-stellar-300 transition-colors">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`badge ${
                      user.role === 'Admin' ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
                      : user.role === 'Verifier' ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20'
                      : 'bg-stellar-500/10 text-stellar-400 border-stellar-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-accent-orange">{user.score}</span>
                      <div className="w-16 h-1.5 rounded-full bg-surface-1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-stellar-500 to-accent-orange"
                          style={{ width: `${(user.score / 400) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">{user.endorsements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ----------- Animated Progress Bar ----------- */
function AnimatedProgressBar({ label, percentage, count, color }: {
  label: string; percentage: number; count: string; color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(percentage); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div ref={ref}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-500">{count}</span>
      </div>
      <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden">
        <div
          className={`bg-gradient-to-r ${color} h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

/* ----------- Stat Row ----------- */
function StatRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/[0.04] text-xs">
      <span className="text-gray-400 flex items-center gap-2">
        <span>{icon}</span>
        {label}
      </span>
      <span className="text-white font-mono font-semibold">{value}</span>
    </div>
  );
}

/* ----------- Rank Badge ----------- */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
        <Crown className="w-4 h-4 text-amber-400" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gray-400/15 border border-gray-400/25 flex items-center justify-center">
        <Medal className="w-4 h-4 text-gray-300" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-lg bg-orange-700/15 border border-orange-700/25 flex items-center justify-center">
        <Trophy className="w-4 h-4 text-orange-400" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center text-xs font-bold text-gray-400">
      #{rank}
    </div>
  );
}

const AVATAR_COLORS = [
  ['#5c7cfa', '#ff6b35'],
  ['#748ffc', '#20c997'],
  ['#f06595', '#f59f00'],
  ['#20c997', '#5c7cfa'],
];

const LEADERBOARD_MOCK = [
  { name: 'Alice (Core Architect)', role: 'Admin', score: 320, endorsements: 18 },
  { name: 'Bob (Soroban Dev)', role: 'Verifier', score: 245, endorsements: 12 },
  { name: 'Charlie (Auditor)', role: 'User', score: 190, endorsements: 8 },
  { name: 'Diana (Security Lead)', role: 'User', score: 165, endorsements: 6 },
];
