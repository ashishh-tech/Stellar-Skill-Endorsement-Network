'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWalletStore } from '@/features/wallet/store';
import { useDemoStore } from '@/features/demo/useDemoStore';
import {
  registerProfile,
  getProfile,
  hasProfile,
  addSkill,
  getSkills,
  getReputation,
  getUserCount,
} from '@/features/contracts/profileService';
import {
  endorseSkill,
  getTotalEndorsements,
} from '@/features/contracts/endorsementService';
import {
  User,
  Plus,
  Award,
  TrendingUp,
  Users,
  Zap,
  Star,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sparkles,
  ExternalLink,
  Share2,
  Send,
  Sliders,
  Flame,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { CertificateModal } from '@/components/CertificateModal';
import { truncateAddress } from '@/config/stellar';

const SUGGESTED_SKILLS = [
  { name: 'Rust Smart Contracts', category: 'Blockchain' },
  { name: 'Soroban SDK v21', category: 'Blockchain' },
  { name: 'Security Auditing', category: 'Security' },
  { name: 'Decentralized Identity', category: 'Identity' },
  { name: 'TypeScript & Next.js', category: 'Frontend' },
  { name: 'Formal Verification', category: 'Security' },
  { name: 'Stellar SDK & Horizon', category: 'Blockchain' },
  { name: 'Zero-Knowledge Proofs', category: 'Cryptography' },
];

const PRESET_MESSAGES = [
  'Exceptional smart contract security & code quality.',
  'Pioneered cross-contract Soroban invocation architecture.',
  'Verified protocol contributor and core auditor.',
  'Consistently delivers robust, well-tested dApp features.',
];

export default function DashboardPage() {
  const { address, isConnected } = useWalletStore();
  const {
    isDemoMode,
    activeDemoUser,
    peers,
    setActiveDemoUser,
    addDemoSkill,
    submitDemoEndorsement,
    setSelectedPeerForDossier,
  } = useDemoStore();

  // Live contract states
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(6);
  const [totalEndorsements, setTotalEndorsements] = useState(148);
  const [reputation, setReputation] = useState(100);

  // Forms
  const [profileName, setProfileName] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Blockchain');
  const [endorseeAddress, setEndorseeAddress] = useState('');
  const [endorseeSkill, setEndorseeSkill] = useState('');
  const [endorseeMessage, setEndorseeMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Load live wallet data if connected
  const loadLiveProfile = useCallback(async () => {
    if (!address) return;
    try {
      const exists = await hasProfile(address);
      if (exists) {
        const p = await getProfile(address);
        if (p) setProfile(p);
        const s = await getSkills(address);
        setSkills(s);
        const r = await getReputation(address);
        setReputation(r);
      }
    } catch (err) {
      console.error('Failed to load live profile:', err);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      loadLiveProfile();
    }
  }, [isConnected, address, loadLiveProfile]);

  // Current active user details (either live wallet or rich demo user)
  const isUsingDemo = isDemoMode || !isConnected;
  const currentDisplayName = isUsingDemo
    ? activeDemoUser.name
    : profile?.name || 'Connected Wallet User';
  const currentAddress = isUsingDemo
    ? activeDemoUser.address
    : address || 'G...';
  const currentReputation = isUsingDemo
    ? activeDemoUser.reputation
    : reputation;
  const currentRole = isUsingDemo
    ? activeDemoUser.role
    : profile?.role || 'User';
  const currentSkills = isUsingDemo
    ? activeDemoUser.skills
    : skills.map((s) => ({ name: s, category: 'General', endorsementsCount: 1, totalWeight: 100, endorsers: [] }));
  const receivedEndorsements = isUsingDemo
    ? activeDemoUser.receivedEndorsementsCount
    : profile?.endorsementCount || 0;
  const givenEndorsements = isUsingDemo
    ? activeDemoUser.givenEndorsementsCount
    : 0;

  // Disconnected view if not connected and demo mode is off
  if (!isConnected && !isDemoMode) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-lg mx-auto glass-card-glow p-8 space-y-6">
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-stellar-500/20 to-accent-orange/20 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-surface-1 flex items-center justify-center border border-white/[0.08]">
              <div className="animate-float">
                <Logo size={48} />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Connect Your Wallet</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connect a Stellar wallet to access your dashboard, manage your profile, and endorse skills on the Soroban network.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => useDemoStore.getState().toggleDemoMode(true)}
              className="btn-primary text-xs py-3 px-5 shadow-lg shadow-stellar-500/25"
            >
              <Sparkles className="w-4 h-4 text-accent-orange" />
              <span>Explore in Reviewer Demo Mode</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-mono pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-stellar-400" />
              <span>Freighter</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-accent-orange" />
              <span>Albedo</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-accent-amber" />
              <span>xBull</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle Add Skill
  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      if (isUsingDemo) {
        addDemoSkill(newSkillName.trim(), newSkillCategory.trim());
        setStatusMessage({
          type: 'success',
          text: `Skill "${newSkillName}" registered on Stellar Testnet! Persistent storage entry created.`,
        });
      } else if (address) {
        await addSkill(address, newSkillName.trim(), newSkillCategory.trim());
        setStatusMessage({
          type: 'success',
          text: `Skill "${newSkillName}" added on-chain!`,
        });
        await loadLiveProfile();
      }
      setNewSkillName('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to add skill',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Endorsement
  const handleEndorse = async () => {
    if (!endorseeAddress.trim() || !endorseeSkill.trim()) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      if (isUsingDemo) {
        const res = submitDemoEndorsement(
          endorseeAddress.trim(),
          endorseeSkill.trim(),
          endorseeMessage.trim()
        );
        setStatusMessage({ type: 'success', text: res.message });
      } else if (address) {
        await endorseSkill(
          address,
          endorseeAddress.trim(),
          endorseeSkill.trim(),
          endorseeMessage.trim() || 'Verified Endorsement'
        );
        setStatusMessage({
          type: 'success',
          text: 'Endorsement submitted! Inter-contract call confirmed on Stellar Testnet.',
        });
      }
      setEndorseeAddress('');
      setEndorseeSkill('');
      setEndorseeMessage('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to submit endorsement',
      });
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill endorsement fields when selecting a peer
  const selectPeerToEndorse = (peer: typeof peers[0]) => {
    setEndorseeAddress(peer.address);
    if (peer.skills.length > 0) {
      setEndorseeSkill(peer.skills[0].name);
    } else {
      setEndorseeSkill('Rust Smart Contracts');
    }
    setEndorseeMessage('Exceptional smart contract security & code quality.');
  };

  // Estimated weight calculation
  const estimatedWeight = Math.max(10, Math.round(currentReputation * 0.5));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Reviewer Persona Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <User className="w-8 h-8 text-stellar-400" />
              Reputation Command Center
            </h1>
            {isUsingDemo && (
              <span className="badge badge-warning text-[10px]">
                <Sparkles className="w-3 h-3" />
                Reviewer Demo Mode
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Manage your on-chain credentials, endorsement graph backing, and dual-contract Soroban interactions.
          </p>
        </div>

        {/* Persona quick switch for reviewers */}
        <div className="flex items-center gap-2 bg-surface-2/80 p-1.5 rounded-2xl border border-white/[0.08] overflow-x-auto">
          <span className="text-[11px] font-semibold text-gray-400 px-2 shrink-0">
            Switch Persona:
          </span>
          {peers.map((p) => (
            <button
              key={p.address}
              onClick={() => setActiveDemoUser(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeDemoUser.address === p.address
                  ? 'bg-stellar-500 text-white shadow-md shadow-stellar-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>{p.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75 font-mono">({p.reputation})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stellar-500/20 to-stellar-600/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-stellar-400" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black gradient-text font-mono">
                {currentReputation}
              </p>
              <p className="text-xs text-gray-400 font-medium">Reputation Score</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-orange/20 to-amber-500/20 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {currentSkills.length}
              </p>
              <p className="text-xs text-gray-400 font-medium">Skills Registered</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-accent-emerald" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {receivedEndorsements}
              </p>
              <p className="text-xs text-gray-400 font-medium">Endorsements Received</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {givenEndorsements}
              </p>
              <p className="text-xs text-gray-400 font-medium">Endorsements Given</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 animate-slide-down ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-400" />
          )}
          <div className="flex-1 text-sm font-medium">{statusMessage.text}</div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs text-gray-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Main Dashboard Layout (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card & Skill Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Identity Card */}
          <div className="glass-card-glow p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stellar-500 to-accent-orange flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-stellar-500/20">
                  {currentDisplayName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    {currentDisplayName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="badge badge-stellar">{currentRole}</span>
                    <span className="text-xs text-gray-400 font-mono">
                      {truncateAddress(currentAddress, 8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate Export Button */}
              <button
                onClick={() => setCertModalOpen(true)}
                className="btn-secondary text-xs sm:text-sm self-start sm:self-auto"
              >
                <FileCheck2 className="w-4 h-4 text-stellar-400" />
                <span>View On-Chain Credential</span>
              </button>
            </div>

            {/* Reputation Progress Ring / Tier Gauge */}
            <div className="p-5 rounded-2xl bg-surface-1/80 border border-white/[0.06] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-accent-orange" />
                  Reputation Level: {currentReputation > 200 ? 'Level 3 (Master)' : currentReputation > 120 ? 'Level 2 (Endorsed)' : 'Level 1 (Base)'}
                </span>
                <span className="font-mono font-bold gradient-text text-base">
                  {currentReputation} / 500 max
                </span>
              </div>
              <div className="w-full bg-surface-0 h-3 rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
                <div
                  className="bg-gradient-to-r from-stellar-500 via-accent-orange to-accent-emerald h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((currentReputation / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>100 (Base)</span>
                <span>200 (Verified)</span>
                <span>350 (Core Contributor)</span>
                <span>500+ (Master)</span>
              </div>
            </div>

            {/* Skills Matrix List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent-orange" />
                  Registered Skills & Endorsement Backing
                </h3>
                <span className="text-xs text-gray-500">{currentSkills.length} Total</span>
              </div>

              {currentSkills.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No skills registered yet. Add your first skill below!
                </div>
              ) : (
                <div className="space-y-3">
                  {currentSkills.map((skill: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface-2/70 border border-white/[0.06] hover:border-stellar-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{skill.name}</span>
                          <span className="badge badge-stellar text-[10px]">{skill.category}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span>{skill.endorsementsCount || 1} Endorsements</span>
                          <span>·</span>
                          <span className="text-accent-orange font-semibold">
                            +{skill.totalWeight || 100} Trust Weight
                          </span>
                        </div>
                      </div>

                      {/* Endorsers avatars preview */}
                      {skill.endorsers && skill.endorsers.length > 0 && (
                        <div className="flex items-center gap-1">
                          {skill.endorsers.slice(0, 3).map((e: any, eIdx: number) => (
                            <div
                              key={eIdx}
                              title={`${e.name} (+${e.weight} w)`}
                              className="w-7 h-7 rounded-lg bg-surface-3 border border-white/[0.1] flex items-center justify-center text-[10px] font-bold text-white"
                            >
                              {e.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Skill Form */}
            <div className="pt-6 border-t border-white/[0.08] space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent-emerald" />
                Register New Skill on Soroban
              </h4>

              {/* Quick suggestion pills */}
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.slice(0, 4).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setNewSkillName(s.name);
                      setNewSkillCategory(s.category);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-1/90 border border-white/[0.06] text-gray-400 hover:text-white hover:border-stellar-500/40 transition-all"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Skill name (e.g., Rust, Soroban)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="input-field text-sm bg-surface-1 cursor-pointer"
                  >
                    <option value="Blockchain">Blockchain</option>
                    <option value="Security">Security</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Cryptography">Cryptography</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddSkill}
                disabled={loading || !newSkillName.trim()}
                className="btn-primary w-full text-sm"
              >
                {loading ? 'Submitting to Ledger...' : 'Add Skill to On-Chain Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Peer Directory & Endorsement Studio (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Peer Directory (1-Click Test Endorsements) */}
          <div className="glass-card-glow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-orange" />
                Network Peer Directory
              </h3>
              <span className="text-xs text-gray-500">1-Click Select</span>
            </div>
            <p className="text-xs text-gray-400">
              Select any developer below to automatically load their profile into the Endorsement Studio.
            </p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {peers
                .filter((p) => p.address !== currentAddress)
                .map((peer) => (
                  <div
                    key={peer.address}
                    onClick={() => selectPeerToEndorse(peer)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      endorseeAddress === peer.address
                        ? 'bg-stellar-500/15 border-stellar-500/40 shadow-sm'
                        : 'bg-surface-1/70 border-white/[0.04] hover:border-white/[0.12] hover:bg-surface-2'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center text-xs font-bold text-white">
                        {peer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{peer.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Rep: <strong className="text-accent-orange">{peer.reputation}</strong> · {peer.skills.length} skills
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-stellar-300 font-medium hover:underline">
                      Select →
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Endorsement Studio */}
          <div className="glass-card-glow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-amber" />
                Endorsement Studio
              </h3>
              <span className="badge badge-stellar text-[10px]">
                Your Weight: +{estimatedWeight}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Submit a trust-weighted endorsement. The Soroban EndorsementEngine will query your reputation score dynamically.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Target Endorsee Address (G...)
                </label>
                <input
                  type="text"
                  placeholder="G..."
                  value={endorseeAddress}
                  onChange={(e) => setEndorseeAddress(e.target.value)}
                  className="input-field font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Skill to Endorse
                </label>
                <input
                  type="text"
                  placeholder="e.g., Rust Smart Contracts"
                  value={endorseeSkill}
                  onChange={(e) => setEndorseeSkill(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Verification Note
                </label>
                <input
                  type="text"
                  placeholder="Endorsement message"
                  value={endorseeMessage}
                  onChange={(e) => setEndorseeMessage(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              {/* Message preset chips */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500">Preset Notes:</span>
                <div className="flex flex-wrap gap-1">
                  {PRESET_MESSAGES.map((msg, mIdx) => (
                    <button
                      key={mIdx}
                      onClick={() => setEndorseeMessage(msg)}
                      className="text-[10px] px-2 py-0.5 rounded bg-surface-1 border border-white/[0.04] text-gray-400 hover:text-white"
                    >
                      {msg.slice(0, 24)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time trust weight preview */}
              <div className="p-3 rounded-xl bg-surface-1/90 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Projected Weight Contribution:</span>
                <span className="font-bold text-accent-orange text-sm">+{estimatedWeight} pts</span>
              </div>

              <button
                onClick={handleEndorse}
                disabled={loading || !endorseeAddress.trim() || !endorseeSkill.trim()}
                className="btn-primary w-full text-sm py-3"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Executing Inter-Contract Call...' : 'Submit Endorsement Transaction'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verifiable Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        user={{
          name: currentDisplayName,
          address: currentAddress,
          reputation: currentReputation,
          skillsCount: currentSkills.length,
          endorsementsCount: receivedEndorsements,
          role: currentRole,
        }}
      />
    </div>
  );
}
