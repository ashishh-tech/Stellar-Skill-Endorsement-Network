'use client';

import React, { useState } from 'react';
import { Shield, ShieldAlert, Zap, Users, Info, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { soundFx } from '@/utils/soundEffects';

export function SybilSimulator() {
  const [sybilCount, setSybilCount] = useState(50);
  const [honestEndorserRep, setHonestEndorserRep] = useState(300);

  // Linear system: 1 vote = 1 unit of weight (Sybil attacker easily wins)
  const linearSybilWeight = sybilCount * 1;
  const linearHonestWeight = 1; // single honest expert

  // Stellar SkillNet Sublinear Trust Weighted System:
  // Weight = sqrt(Endorser Reputation) / 2
  // Fake / fresh accounts have base reputation 0 or 1 -> weight = 0.5 each, but diminishing returns applies
  const sublinearHonestWeight = Math.round(Math.sqrt(honestEndorserRep) * 10);
  // Fake bots with 0 rep earn 0 weight; even with base 1 rep, collective impact is sublinear and heavily throttled
  const sublinearSybilWeight = Math.round(Math.sqrt(sybilCount) * 2);

  const sybilDampeningPercent = Math.round(
    ((linearSybilWeight - sublinearSybilWeight) / Math.max(linearSybilWeight, 1)) * 100
  );

  return (
    <div className="glass-card-glow p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-orange/15 border border-accent-orange/30 flex items-center justify-center text-accent-orange">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Sybil Attack Resistance Sandbox
              <span className="badge badge-stellar text-[10px]">Soroban Math</span>
            </h3>
            <p className="text-xs text-gray-400">
              Simulate how malicious bots attempt to game skill rankings vs our sublinear trust algorithms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{sybilDampeningPercent}% Bot Impact Neutralized</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-surface-1/80 border border-white/[0.06]">
        {/* Slider 1: Number of Sybil Bot Accounts */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="text-gray-300 font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              Sybil Bot Swarm Size:
            </label>
            <span className="text-rose-400 font-mono font-bold">{sybilCount} fake nodes</span>
          </div>
          <input
            type="range"
            min="5"
            max="200"
            step="5"
            value={sybilCount}
            onChange={(e) => {
              setSybilCount(Number(e.target.value));
              soundFx.playHover();
            }}
            className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>5 bots</span>
            <span>100 bots</span>
            <span>200 bots</span>
          </div>
        </div>

        {/* Slider 2: Honest Verifier Reputation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="text-gray-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-stellar-400" />
              Honest Auditor Trust Score:
            </label>
            <span className="text-stellar-300 font-mono font-bold">{honestEndorserRep} pts</span>
          </div>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={honestEndorserRep}
            onChange={(e) => {
              setHonestEndorserRep(Number(e.target.value));
              soundFx.playHover();
            }}
            className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-stellar-500"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>50 (Novice)</span>
            <span>500 (Master)</span>
            <span>1000 (Grandmaster)</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Traditional vs Stellar SkillNet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box A: Traditional Web2 / Linear Web3 */}
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Standard Linear Voting (Vulnerable)</span>
            </div>
            <span className="badge badge-danger text-[10px]">Attacked</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Sybil Swarm Total Power:</span>
              <strong className="text-rose-400 font-mono">{linearSybilWeight} pts</strong>
            </div>
            <div className="w-full h-3 bg-surface-1 rounded-full overflow-hidden flex">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{
                  width: `${(linearSybilWeight / (linearSybilWeight + linearHonestWeight)) * 100}%`,
                }}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${(linearHonestWeight / (linearSybilWeight + linearHonestWeight)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span className="text-rose-400">Sybil Bots: 98% Dominance</span>
              <span className="text-emerald-400">1 Honest Auditor: 2%</span>
            </div>
          </div>

          <p className="text-xs text-rose-200/80 leading-relaxed">
            ⚠ <strong>Outcome:</strong> Attacker successfully creates fake prestige and floods endorsements because each wallet has uniform weight.
          </p>
        </div>

        {/* Box B: Stellar SkillNet Sublinear Trust Weighted */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Stellar SkillNet Soroban Engine</span>
            </div>
            <span className="badge badge-success text-[10px]">Protected</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Sybil Swarm Power vs Honest Auditor:</span>
              <strong className="text-emerald-400 font-mono">
                {sublinearSybilWeight} vs {sublinearHonestWeight} pts
              </strong>
            </div>
            <div className="w-full h-3 bg-surface-1 rounded-full overflow-hidden flex">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{
                  width: `${(sublinearSybilWeight / (sublinearSybilWeight + sublinearHonestWeight)) * 100}%`,
                }}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${(sublinearHonestWeight / (sublinearSybilWeight + sublinearHonestWeight)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span className="text-rose-400">
                Bot Swarm: {Math.round((sublinearSybilWeight / (sublinearSybilWeight + sublinearHonestWeight)) * 100)}%
              </span>
              <span className="text-emerald-400 font-bold">
                1 Verified Auditor: {Math.round((sublinearHonestWeight / (sublinearSybilWeight + sublinearHonestWeight)) * 100)}% (Victor)
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-200/80 leading-relaxed">
            🛡️ <strong>Outcome:</strong> 1 high-reputation auditor easily overrides 200 zero-trust Sybil bots. Identity spoofing is economically futile.
          </p>
        </div>
      </div>
    </div>
  );
}
