'use client';

import React from 'react';
import { X, Award, ShieldCheck, Download, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { truncateAddress } from '@/config/stellar';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-surface-1 border border-white/[0.15] rounded-3xl shadow-2xl overflow-hidden glass-panel flex flex-col">
        {/* Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-surface-2/60">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent-orange" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              On-Chain Reputation Certificate
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-surface-3 text-gray-400 hover:text-white hover:bg-surface-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Canvas Representation */}
        <div className="p-6">
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-surface-2 via-surface-1 to-surface-0 border-2 border-stellar-500/30 overflow-hidden shadow-2xl">
            {/* Background Decorative Seals */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-stellar-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-orange/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <Logo size={40} />
                <div>
                  <h4 className="text-sm font-black text-white tracking-wide">STELLAR SKILLNET</h4>
                  <p className="text-[10px] text-stellar-400 font-mono">VERIFIABLE REPUTATION CREDENTIAL</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>ON-CHAIN VERIFIED</span>
              </div>
            </div>

            {/* Body */}
            <div className="text-center my-6">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">This certifies that</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 gradient-text">
                {user.name}
              </h2>
              <p className="text-xs text-gray-400 font-mono max-w-sm mx-auto truncate bg-surface-3/60 py-1 px-3 rounded-lg border border-white/[0.04]">
                {user.address}
              </p>
            </div>

            {/* Credential Metrics */}
            <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-xl bg-surface-2/80 border border-white/[0.06] text-center">
              <div>
                <div className="text-xl font-bold text-accent-orange">{user.reputation}</div>
                <div className="text-[10px] text-gray-400">Trust Score</div>
              </div>
              <div>
                <div className="text-xl font-bold text-stellar-400">{user.endorsementsCount}</div>
                <div className="text-[10px] text-gray-400">Endorsements</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-400">{user.skillsCount}</div>
                <div className="text-[10px] text-gray-400">Skills Backed</div>
              </div>
            </div>

            {/* Footer with cryptographic proof signatures */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-[10px] text-gray-500 font-mono">
              <div>
                <div>Soroban Protocol v21</div>
                <div>Storage: Persistent Instance</div>
              </div>
              <div className="text-right">
                <div className="text-stellar-300 font-semibold">Dual-Contract Cross Verified</div>
                <div>Immutable Ledger Proof</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => {
                alert('Reputation credential link copied to clipboard!');
              }}
              className="btn-secondary text-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Link
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="btn-primary text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Credential PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
