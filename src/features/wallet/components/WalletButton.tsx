'use client';

import React, { useState } from 'react';
import { useWalletStore } from '../store';
import { connectWallet, formatAddress, WALLET_OPTIONS, type WalletId } from '../service';
import { LogOut, Wallet, ChevronDown, ExternalLink, Copy, Check } from 'lucide-react';
import { getExplorerAccountUrl } from '@/config/stellar';

export function WalletButton() {
  const { address, isConnected, isConnecting, walletType, error, disconnect, clearError } =
    useWalletStore();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async (walletId: WalletId) => {
    try {
      await connectWallet(walletId);
      setShowModal(false);
    } catch {
      // Error is already set in the store
    }
  };

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 bg-surface-2/80 border border-white/[0.08] rounded-xl px-4 py-2.5 
                     hover:border-stellar-500/30 transition-all duration-200 group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-200 group-hover:text-white">
            {formatAddress(address)}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 top-full mt-2 w-64 glass-card p-2 z-50 animate-slide-down">
              <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                <p className="text-xs text-gray-500 mb-1">Connected via {walletType}</p>
                <p className="text-sm font-mono text-gray-300 truncate">{address}</p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Address'}
              </button>

              <a
                href={getExplorerAccountUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </a>

              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        className="btn-primary flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {/* Wallet Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowModal(false); clearError(); }} />
          <div className="relative glass-card w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-1">Connect Wallet</h2>
            <p className="text-sm text-gray-400 mb-6">
              Choose a Stellar wallet to connect to the Skill Endorsement Network.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              {WALLET_OPTIONS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-surface-1/60 border border-white/[0.06]
                             hover:border-stellar-500/30 hover:bg-surface-2/60 transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-gray-200 group-hover:text-white">
                      {wallet.name}
                    </p>
                    <p className="text-xs text-gray-500">{wallet.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setShowModal(false); clearError(); }}
              className="mt-4 w-full btn-ghost text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
