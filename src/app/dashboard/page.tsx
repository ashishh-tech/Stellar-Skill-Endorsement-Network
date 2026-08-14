'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWalletStore } from '@/features/wallet/store';
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
  CheckCircle,
  AlertCircle,
  Wallet,
  Shield,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

interface ProfileData {
  owner: string;
  name: string;
  role: string;
  reputation: number;
  skillCount: number;
  endorsementCount: number;
  createdAt: number;
  updatedAt: number;
}

export default function DashboardPage() {
  const { address, isConnected } = useWalletStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [totalEndorsements, setTotalEndorsements] = useState(0);
  const [reputation, setReputation] = useState(0);

  // Form states
  const [profileName, setProfileName] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [endorseeAddress, setEndorseeAddress] = useState('');
  const [endorseSkillName, setEndorseSkillName] = useState('');
  const [endorseMessage, setEndorseMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadProfile = useCallback(async () => {
    if (!address) return;
    try {
      const exists = await hasProfile(address);
      if (exists) {
        const p = await getProfile(address);
        if (p) setProfile(p as ProfileData);
        const s = await getSkills(address);
        setSkills(s);
        const r = await getReputation(address);
        setReputation(r);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }, [address]);

  const loadStats = useCallback(async () => {
    try {
      const count = await getUserCount();
      setUserCount(count);
      const endCount = await getTotalEndorsements();
      setTotalEndorsements(endCount);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadProfile();
      loadStats();
    }
  }, [isConnected, address, loadProfile, loadStats]);

  const handleRegister = async () => {
    if (!address || !profileName.trim()) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      await registerProfile(address, profileName.trim());
      setStatusMessage({ type: 'success', text: 'Profile registered successfully! Transaction confirmed on Stellar Testnet.' });
      setProfileName('');
      await loadProfile();
      await loadStats();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to register profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!address || !skillName.trim() || !skillCategory.trim()) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      await addSkill(address, skillName.trim(), skillCategory.trim());
      setStatusMessage({ type: 'success', text: `Skill "${skillName}" added successfully!` });
      setSkillName('');
      setSkillCategory('');
      await loadProfile();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to add skill' });
    } finally {
      setLoading(false);
    }
  };

  const handleEndorse = async () => {
    if (!address || !endorseeAddress.trim() || !endorseSkillName.trim()) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      await endorseSkill(address, endorseeAddress.trim(), endorseSkillName.trim(), endorseMessage.trim() || 'Great work!');
      setStatusMessage({ type: 'success', text: 'Endorsement submitted! Inter-contract call executed successfully.' });
      setEndorseeAddress('');
      setEndorseSkillName('');
      setEndorseMessage('');
      await loadStats();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to endorse' });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-md mx-auto">
          {/* Animated empty state */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-stellar-500/10 to-accent-orange/10 animate-pulse" />
            <div className="absolute inset-3 rounded-full bg-surface-1 flex items-center justify-center">
              <div className="animate-float">
                <Logo size={56} />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">Connect a Stellar wallet to access your dashboard, manage your profile, and endorse skills.</p>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-stellar-400" />
              <span>Freighter</span>
            </div>
            <span className="text-gray-700">·</span>
            <div className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-accent-orange" />
              <span>Albedo</span>
            </div>
            <span className="text-gray-700">·</span>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-accent-amber" />
              <span>xBull</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <User className="w-8 h-8 text-stellar-400" />
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your on-chain profile, skills, and endorsements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Your Reputation" value={reputation} color="text-stellar-400" bgColor="from-stellar-500/10 to-stellar-600/10" />
        <StatCard icon={Star} label="Your Skills" value={skills.length} color="text-accent-orange" bgColor="from-accent-orange/10 to-amber-500/10" />
        <StatCard icon={Users} label="Total Users" value={userCount} color="text-accent-emerald" bgColor="from-accent-emerald/10 to-emerald-500/10" />
        <StatCard icon={Zap} label="Total Endorsements" value={totalEndorsements} color="text-accent-amber" bgColor="from-accent-amber/10 to-yellow-500/10" />
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 animate-slide-down ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
          <p className="text-sm">{statusMessage.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        {!profile ? (
          <div className="glass-card-glow p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-stellar-400" />
              Create Your Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Display Name</label>
                <input
                  type="text"
                  placeholder="Enter your display name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="input-field"
                  maxLength={50}
                />
              </div>
              <button onClick={handleRegister} disabled={loading || !profileName.trim()} className="btn-primary w-full">
                {loading ? 'Registering...' : 'Register Profile'}
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card-glow p-6">
            <div className="flex items-center gap-4 mb-5">
              {/* Avatar gradient based on address */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${addressToColor(address || '', 0)}, ${addressToColor(address || '', 4)})`,
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{profile.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="badge-stellar">{profile.role}</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Reputation Meter */}
            <div className="mb-5 p-4 rounded-xl bg-surface-1/60 border border-white/[0.04]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Reputation Score</span>
                <span className="text-lg font-bold gradient-text">{profile.reputation}</span>
              </div>
              <div className="w-full bg-surface-0 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-stellar-500 via-accent-orange to-accent-amber h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((profile.reputation / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>0</span>
                <span>100</span>
                <span>200</span>
                <span>300</span>
                <span>500+</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                <span className="text-sm text-gray-400">Skills Registered</span>
                <span className="text-sm text-white font-medium">{profile.skillCount}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">Endorsements Received</span>
                <span className="text-sm text-white font-medium">{profile.endorsementCount}</span>
              </div>
            </div>

            {/* Skills List */}
            {skills.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-gray-500 mb-2">Your Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="badge-stellar">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Skill Section */}
        {profile && (
          <div className="glass-card-glow p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-accent-emerald" />
              Add New Skill
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g., Rust, Soroban, TypeScript"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="input-field"
                  maxLength={30}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Programming, Blockchain"
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="input-field"
                  maxLength={30}
                />
              </div>
              <button onClick={handleAddSkill} disabled={loading || !skillName.trim() || !skillCategory.trim()} className="btn-primary w-full">
                {loading ? 'Adding Skill...' : 'Add Skill'}
              </button>
            </div>
          </div>
        )}

        {/* Endorsement Section */}
        <div className="glass-card-glow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-accent-amber" />
            Endorse a Skill
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Endorse another user&apos;s skill. Your endorsement weight is determined by your on-chain reputation score
            via an inter-contract call between the endorsement engine and profile registry.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Endorsee Address</label>
              <input
                type="text"
                placeholder="Endorsee Stellar address (G...)"
                value={endorseeAddress}
                onChange={(e) => setEndorseeAddress(e.target.value)}
                className="input-field font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Skill to Endorse</label>
              <input
                type="text"
                placeholder="Skill name to endorse"
                value={endorseSkillName}
                onChange={(e) => setEndorseSkillName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Message (Optional)</label>
              <input
                type="text"
                placeholder="Endorsement message"
                value={endorseMessage}
                onChange={(e) => setEndorseMessage(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <button
            onClick={handleEndorse}
            disabled={loading || !endorseeAddress.trim() || !endorseSkillName.trim()}
            className="btn-primary mt-4"
          >
            {loading ? 'Endorsing...' : 'Submit Endorsement'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------- Helper: address → deterministic color ----------- */
function addressToColor(addr: string, offset: number): string {
  const PALETTE = ['#5c7cfa', '#748ffc', '#ff6b35', '#f59f00', '#20c997', '#f06595', '#4c6ef5'];
  let hash = 0;
  for (let i = 0; i < addr.length; i++) {
    hash = addr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash + offset) % PALETTE.length];
}

/* ----------- Stat Card ----------- */
function StatCard({ icon: Icon, label, value, color, bgColor }: {
  icon: React.ElementType; label: string; value: number | string; color: string; bgColor: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bgColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
