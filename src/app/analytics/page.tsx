'use client';

import React from 'react';
import { BarChart3, Award, Users, TrendingUp, ShieldCheck } from 'lucide-react';

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
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-accent-orange" />
            <h3 className="text-sm font-semibold text-gray-300">Top Skill Categories</h3>
          </div>
          <div className="space-y-3 mt-4">
            <ProgressBar label="Programming (Rust / TS)" percentage={85} count="142 endorsements" />
            <ProgressBar label="Blockchain (Soroban / Stellar)" percentage={72} count="98 endorsements" />
            <ProgressBar label="Security & Auditing" percentage={48} count="64 endorsements" />
            <ProgressBar label="DevOps & CI/CD" percentage={35} count="45 endorsements" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-stellar-400" />
            <h3 className="text-sm font-semibold text-gray-300">Trust Distribution</h3>
          </div>
          <div className="space-y-3 mt-4">
            <ProgressBar label="Level 3 Verified (>200 Rep)" percentage={25} count="Tier 1 Accounts" />
            <ProgressBar label="Level 2 Endorsed (120-200 Rep)" percentage={45} count="Tier 2 Accounts" />
            <ProgressBar label="Level 1 Base (100 Rep)" percentage={30} count="New Accounts" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-accent-emerald" />
            <h3 className="text-sm font-semibold text-gray-300">Security Metrics</h3>
          </div>
          <div className="space-y-3 mt-4">
            <StatRow label="Self-Endorsement Block Rate" value="100%" />
            <StatRow label="Duplicate Prevention Rate" value="100%" />
            <StatRow label="Inter-Contract Call Success" value="100%" />
            <StatRow label="Soroban Storage Model" value="Instance/Persistent" />
          </div>
        </div>
      </div>

      {/* Leaderboard Teaser */}
      <div className="glass-card p-6">
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
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-bold text-stellar-400">#{i + 1}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{user.name}</td>
                  <td className="py-3.5 px-4"><span className="badge-stellar">{user.role}</span></td>
                  <td className="py-3.5 px-4 font-mono font-bold text-accent-orange">{user.score}</td>
                  <td className="py-3.5 px-4">{user.endorsements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage, count }: { label: string; percentage: number; count: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-500">{count}</span>
      </div>
      <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-stellar-500 to-accent-orange h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/[0.04] text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-mono font-semibold">{value}</span>
    </div>
  );
}

const LEADERBOARD_MOCK = [
  { name: 'Alice (Core Architect)', role: 'Admin', score: 320, endorsements: 18 },
  { name: 'Bob (Soroban Dev)', role: 'Verifier', score: 245, endorsements: 12 },
  { name: 'Charlie (Auditor)', role: 'User', score: 190, endorsements: 8 },
  { name: 'Diana (Security Lead)', role: 'User', score: 165, endorsements: 6 },
];
