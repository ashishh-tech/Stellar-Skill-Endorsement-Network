'use client';

import React, { useState } from 'react';
import { useDemoStore } from '@/features/demo/useDemoStore';
import {
  X,
  Award,
  ShieldCheck,
  ExternalLink,
  Users,
  Star,
  CheckCircle,
  TrendingUp,
  Calendar,
  Sparkles,
  Send,
} from 'lucide-react';
import { truncateAddress } from '@/config/stellar';

export function ProfileDossierModal() {
  const { selectedPeerForDossier, setSelectedPeerForDossier, submitDemoEndorsement, activeDemoUser } = useDemoStore();
  const [activeTab, setActiveTab] = useState<'skills' | 'received' | 'given'>('skills');
  const [quickEndorseSkill, setQuickEndorseSkill] = useState('');
  const [quickMessage, setQuickMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedPeerForDossier) return null;

  const peer = selectedPeerForDossier;

  const handleQuickEndorse = () => {
    if (!quickEndorseSkill.trim()) return;
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const res = submitDemoEndorsement(peer.address, quickEndorseSkill.trim(), quickMessage.trim());
      setStatusMsg({ type: 'success', text: res.message });
      setQuickEndorseSkill('');
      setQuickMessage('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to submit endorsement' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-surface-1 border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden glass-panel max-h-[90vh] flex flex-col">
        {/* Header with gradient banner */}
        <div className="relative p-6 bg-gradient-to-r from-stellar-500/20 via-surface-2 to-accent-orange/20 border-b border-white/[0.08]">
          <button
            onClick={() => setSelectedPeerForDossier(null)}
            className="absolute top-5 right-5 p-2 rounded-xl bg-surface-3/80 text-gray-400 hover:text-white hover:bg-surface-4 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stellar-500 to-accent-orange flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-stellar-500/20">
              {peer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{peer.name}</h2>
                <span className={`badge ${
                  peer.role === 'Admin'
                    ? 'badge-warning'
                    : peer.role === 'Verifier'
                    ? 'badge-success'
                    : 'badge-stellar'
                }`}>
                  {peer.role}
                </span>
                {peer.verifiedStatus && (
                  <span className="badge badge-purple flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Signer
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{peer.bio}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-mono">
                <span>{truncateAddress(peer.address, 10)}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Joined {peer.joinedAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reputation Meter & Highlights */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-surface-2/60 border-b border-white/[0.06]">
          <div className="text-center p-2 rounded-xl bg-surface-1/50 border border-white/[0.04]">
            <div className="text-xl font-bold gradient-text">{peer.reputation}</div>
            <div className="text-[11px] text-gray-400 font-medium">Reputation Score</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-surface-1/50 border border-white/[0.04]">
            <div className="text-xl font-bold text-white">{peer.receivedEndorsementsCount}</div>
            <div className="text-[11px] text-gray-400 font-medium">Endorsements In</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-surface-1/50 border border-white/[0.04]">
            <div className="text-xl font-bold text-accent-emerald">{peer.givenEndorsementsCount}</div>
            <div className="text-[11px] text-gray-400 font-medium">Endorsements Out</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/[0.06]">
          <button
            onClick={() => setActiveTab('skills')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'skills'
                ? 'border-stellar-400 text-stellar-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Registered Skills ({peer.skills.length})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'received'
                ? 'border-stellar-400 text-stellar-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Endorsement Backing
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'skills' && (
            <div className="space-y-3">
              {peer.skills.map((skill, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-surface-2/70 border border-white/[0.06] hover:border-stellar-500/30 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{skill.name}</span>
                        <span className="badge badge-stellar text-[10px]">{skill.category}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span>{skill.endorsementsCount} Endorsements</span>
                        <span>·</span>
                        <span className="text-accent-orange font-semibold">+{skill.totalWeight} Trust Weight</span>
                      </div>
                    </div>
                  </div>

                  {/* Endorsers list preview */}
                  {skill.endorsers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-2">
                      <div className="text-[11px] font-medium text-gray-400">Verified Peer Endorsers:</div>
                      {skill.endorsers.map((endorser, eIdx) => (
                        <div key={eIdx} className="flex items-center justify-between text-xs bg-surface-1/80 p-2 rounded-xl border border-white/[0.04]">
                          <div>
                            <span className="font-medium text-white">{endorser.name}</span>
                            <p className="text-gray-400 text-[11px] mt-0.5">&quot;{endorser.message}&quot;</p>
                          </div>
                          <span className="text-accent-amber font-mono font-bold text-xs shrink-0 ml-2">
                            +{endorser.weight} w
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'received' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-400 bg-surface-2 p-3 rounded-xl border border-white/[0.06]">
                Endorsements in Stellar SkillNet use Soroban cross-contract calls to verify the endorser&apos;s active reputation at execution time, preventing Sybil spoofing.
              </div>
              {peer.skills.flatMap((s) => s.endorsers.map((e) => ({ ...e, skill: s.name }))).length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No individual endorser message log attached yet.
                </div>
              ) : (
                peer.skills
                  .flatMap((s) => s.endorsers.map((e) => ({ ...e, skill: s.name })))
                  .map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-2/80 border border-white/[0.06] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{item.name}</span>
                          <span className="text-xs text-stellar-400">for {item.skill}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">&quot;{item.message}&quot;</p>
                        <span className="text-[10px] text-gray-500">{item.date}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-accent-orange">+{item.weight}</span>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Quick Endorse Section */}
          {activeDemoUser.address !== peer.address && (
            <div className="mt-6 pt-4 border-t border-white/[0.08]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-orange" />
                Quick Endorse {peer.name}
              </h4>

              {statusMsg && (
                <div className={`mb-3 p-3 rounded-xl text-xs border ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Skill name (e.g., Rust, Soroban)"
                  value={quickEndorseSkill}
                  onChange={(e) => setQuickEndorseSkill(e.target.value)}
                  className="input-field py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Verification note (optional)"
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  className="input-field py-2 text-xs"
                />
              </div>
              <button
                onClick={handleQuickEndorse}
                disabled={isSubmitting || !quickEndorseSkill.trim()}
                className="btn-primary w-full mt-2 py-2 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Simulating Inter-Contract Call...' : `Endorse with your Rep (${activeDemoUser.reputation})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
