'use client';

import React, { useState } from 'react';
import { Shield, Zap, Sparkles, Sliders, ArrowRight, CheckCircle2 } from 'lucide-react';

export function TrustWeightCalculator() {
  const [endorserRep, setEndorserRep] = useState(250);
  const [skillRarity, setSkillRarity] = useState(2); // 1: Common, 2: Advanced, 3: Expert
  const [hasCrossVerified, setHasCrossVerified] = useState(true);

  // Trust weight calculation formula:
  // BaseWeight = floor(sqrt(EndorserRep) * 8)
  // RarityMultiplier = 1.0 + (skillRarity - 1) * 0.25
  // CrossVerifiedBonus = hasCrossVerified ? 1.2 : 1.0
  const baseWeight = Math.floor(Math.sqrt(endorserRep) * 8);
  const rarityMultiplier = 1.0 + (skillRarity - 1) * 0.25;
  const verifiedMultiplier = hasCrossVerified ? 1.2 : 1.0;
  const finalWeight = Math.round(baseWeight * rarityMultiplier * verifiedMultiplier);

  return (
    <div className="glass-card-glow p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5" />
            Interactive Protocol Sandbox
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Trust-Weighted Endorsement Simulator
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Test how Soroban smart contracts mathematically prevent Sybil attacks and wash-endorsements.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-1/80 border border-white/[0.08] shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-medium">Computed Trust Weight</div>
            <div className="text-2xl sm:text-3xl font-black gradient-text font-mono">
              +{finalWeight} pts
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slider 1: Endorser Reputation */}
        <div className="p-4 rounded-2xl bg-surface-1/60 border border-white/[0.04] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-300">Endorser Reputation</span>
            <span className="font-mono font-bold text-stellar-400">{endorserRep} Rep</span>
          </div>
          <input
            type="range"
            min="50"
            max="1000"
            step="10"
            value={endorserRep}
            onChange={(e) => setEndorserRep(Number(e.target.value))}
            className="w-full accent-stellar-500 cursor-pointer h-2 bg-surface-3 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>50 (Newbie)</span>
            <span>500 (Master)</span>
            <span>1000 (Core)</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Soroban queries <code>ProfileRegistry::get_reputation()</code> on-chain via cross-contract call.
          </p>
        </div>

        {/* Option 2: Skill Tier */}
        <div className="p-4 rounded-2xl bg-surface-1/60 border border-white/[0.04] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-300">Skill Complexity Tier</span>
            <span className="font-mono font-bold text-accent-orange">
              {skillRarity === 1 ? 'Tier 1 (Base)' : skillRarity === 2 ? 'Tier 2 (Advanced)' : 'Tier 3 (Mastery)'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[
              { level: 1, label: 'Base' },
              { level: 2, label: 'Advanced' },
              { level: 3, label: 'Mastery' },
            ].map((tier) => (
              <button
                key={tier.level}
                onClick={() => setSkillRarity(tier.level)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                  skillRarity === tier.level
                    ? 'bg-accent-orange/20 text-accent-orange border-accent-orange/40 shadow-sm'
                    : 'bg-surface-2 text-gray-400 border-white/[0.04] hover:text-white'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Tier multiplier ({rarityMultiplier.toFixed(2)}x) rewards specialized smart contract skills.
          </p>
        </div>

        {/* Option 3: Verifier Bonus */}
        <div className="p-4 rounded-2xl bg-surface-1/60 border border-white/[0.04] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-gray-300">Role-Based Verification</span>
              <span className="font-mono font-bold text-accent-emerald">
                {hasCrossVerified ? '+20% Boost' : 'Standard'}
              </span>
            </div>
            <button
              onClick={() => setHasCrossVerified(!hasCrossVerified)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                hasCrossVerified
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-surface-2 text-gray-400 border-white/[0.04] hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verifier Role Endorsement</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Verified auditor signatures receive additional consensus confidence weighting.
          </p>
        </div>
      </div>

      {/* Formula breakdown banner */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-stellar-400 shrink-0" />
          <span>Formula: <code>Weight = floor(sqrt(Rep) * 8) * TierMult * VerifierMult</code></span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sublinear square-root curve guarantees Sybil resistance</span>
        </div>
      </div>
    </div>
  );
}
