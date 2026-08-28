'use client';

import React, { useState } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Sparkles, CheckCircle2, Copy, Check, ExternalLink, QrCode } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { truncateAddress } from '@/config/stellar';
import { soundFx } from '@/utils/soundEffects';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    address: string;
    reputation: number;
    skillsCount: number;
    endorsementsCount: number;
    role: string;
  };
}

export function CertificateModal({ isOpen, onClose, user }: CertificateModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(
      `https://stellar-skillnet.network/credentials/${user.address}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getTierBadge = (rep: number) => {
    if (rep >= 300) return { label: 'Level 5 • Blue Belt Master', color: 'from-blue-500 to-indigo-600', border: 'border-blue-400' };
    if (rep >= 200) return { label: 'Level 4 • Purple Belt Senior', color: 'from-purple-500 to-pink-600', border: 'border-purple-400' };
    if (rep >= 100) return { label: 'Level 3 • Green Belt Verified', color: 'from-emerald-500 to-teal-600', border: 'border-emerald-400' };
    return { label: 'Level 2 • Apprentice', color: 'from-amber-500 to-orange-600', border: 'border-amber-400' };
  };

  const tier = getTierBadge(user.reputation);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-surface-1 border border-white/[0.15] rounded-3xl shadow-2xl overflow-hidden glass-panel flex flex-col animate-slide-up">
        {/* Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-surface-2/80">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent-orange" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              On-Chain Reputation Credential
            </h3>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-surface-3 text-gray-400 hover:text-white hover:bg-surface-4 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Card */}
        <div className="p-6">
          <div className="relative p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-surface-2 via-surface-1 to-surface-0 border-2 border-stellar-500/40 overflow-hidden shadow-2xl relative">
            {/* Holographic Iridescent Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-stellar-500/10 via-accent-orange/10 to-accent-emerald/10 opacity-70 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-stellar-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-orange/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08] relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-2xl bg-surface-2 border border-white/[0.1]">
                  <Logo size={36} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-wide">STELLAR SKILLNET</h4>
                  <p className="text-[10px] text-stellar-400 font-mono">SOROBAN REPUTATION PROTOCOL</p>
                </div>
              </div>

              {/* Belt Tier Ribbon */}
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-[10px] font-extrabold shadow-md border ${tier.border} flex items-center gap-1`}>
                <Sparkles className="w-3 h-3" />
                <span>{tier.label}</span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="text-center my-6 relative z-10">
              <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">
                This certifies that
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 gradient-text">
                {user.name}
              </h2>
              <div className="inline-flex items-center gap-2 bg-surface-3/80 py-1.5 px-3 rounded-xl border border-white/[0.06] text-xs font-mono text-stellar-300">
                <span>{truncateAddress(user.address)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-sans font-semibold">Verified Signer</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-2xl bg-surface-2/80 border border-white/[0.08] text-center relative z-10 backdrop-blur-md">
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-accent-orange font-mono">{user.reputation}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Trust Weight</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-stellar-400 font-mono">{user.endorsementsCount}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Endorsements</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-emerald-400 font-mono">{user.skillsCount}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Verified Skills</div>
              </div>
            </div>

            {/* Cryptographic Verification Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-[10px] text-gray-400 font-mono relative z-10">
              <div>
                <div className="text-gray-300 font-semibold">Stellar Soroban WASM v21</div>
                <div>Storage: Persistent Instance</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Dual-Contract Atomic Audit</span>
                </div>
                <div>Contract: CDLZ3562...89AB</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 mt-6">
            <button
              onClick={handleCopyLink}
              className="btn-secondary text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Credential Link!' : 'Copy Verification Link'}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playSuccess();
                window.print();
              }}
              className="btn-primary text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Credential Badge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
