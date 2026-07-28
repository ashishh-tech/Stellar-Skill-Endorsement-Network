'use client';

import React, { useState } from 'react';
import { STELLAR_CONFIG } from '@/config/stellar';
import { Settings, Server, Shield, ExternalLink, RefreshCcw } from 'lucide-react';
import { getExplorerContractUrl } from '@/config/stellar';

export default function SettingsPage() {
  const [profileContract, setProfileContract] = useState(STELLAR_CONFIG.contracts.profileRegistry);
  const [endorsementContract, setEndorsementContract] = useState(STELLAR_CONFIG.contracts.endorsementEngine);
  const [rpcUrl, setRpcUrl] = useState(STELLAR_CONFIG.rpcUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-stellar-400" />
          Network & Contract Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Configure Soroban RPC endpoint and deployed smart contract addresses
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm animate-slide-down">
          Settings updated locally!
        </div>
      )}

      <div className="space-y-6">
        {/* Network Config */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-stellar-400" />
            Stellar Network Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Network Passphrase</label>
              <input
                type="text"
                value={STELLAR_CONFIG.networkPassphrase}
                disabled
                className="input-field font-mono text-xs opacity-70 bg-surface-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Soroban RPC URL</label>
              <input
                type="text"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                className="input-field font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Smart Contract IDs */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-orange" />
            Deployed Soroban Contract Addresses
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-400">ProfileRegistry Contract ID</label>
                {profileContract && (
                  <a
                    href={getExplorerContractUrl(profileContract)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stellar-400 flex items-center gap-1 hover:underline"
                  >
                    Stellar Expert <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={profileContract}
                onChange={(e) => setProfileContract(e.target.value)}
                placeholder="C..."
                className="input-field font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-400">EndorsementEngine Contract ID</label>
                {endorsementContract && (
                  <a
                    href={getExplorerContractUrl(endorsementContract)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stellar-400 flex items-center gap-1 hover:underline"
                  >
                    Stellar Expert <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={endorsementContract}
                onChange={(e) => setEndorsementContract(e.target.value)}
                placeholder="C..."
                className="input-field font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Faucet Link */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Stellar Testnet Friendbot Faucet</h3>
            <p className="text-xs text-gray-400">Fund your testnet wallet with 10,000 XLM for gas fees</p>
          </div>
          <a
            href={STELLAR_CONFIG.friendbotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-stellar-400" />
            Friendbot Faucet
          </a>
        </div>

        <button onClick={handleSave} className="btn-primary w-full">
          Save Settings
        </button>
      </div>
    </div>
  );
}
