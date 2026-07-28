'use client';

import React, { useState } from 'react';
import { useWalletStore } from '../store';
import { connectWallet, formatAddress, WALLET_OPTIONS, type WalletId } from '../service';
import { LogOut, Wallet, ChevronDown, ExternalLink, Copy, Check, X } from 'lucide-react';
import { getExplorerAccountUrl } from '@/config/stellar';

export function WalletButton() {
  const { address, isConnected, isConnecting, walletType, error, disconnect, clearError } =
    useWalletStore();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);

  const handleConnect = async (walletId: WalletId) => {
    try {
      setConnectingWalletId(walletId);
      await connectWallet(walletId);
      setShowModal(false);
    } catch {
      // Error is already set in the store
    } finally {
      setConnectingWalletId(null);
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

      {/* Wallet Selection Modal — fixed overlay that always centers on screen */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ padding: '16px' }}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => { setShowModal(false); clearError(); }}
          />

          {/* Modal card — positioned relative to viewport, never scrolled away */}
          <div
            className="relative z-[10000] w-full animate-fade-in"
            style={{ maxWidth: '420px' }}
          >
            <div
              className="rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl shadow-black/60"
              style={{ overflow: 'hidden' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Connect Wallet</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Choose a Stellar wallet to get started
                  </p>
                </div>
                <button
                  onClick={() => { setShowModal(false); clearError(); }}
                  className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mx-5 mb-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Wallet Options */}
              <div className="px-5 pb-4 space-y-1.5">
                {WALLET_OPTIONS.map((wallet) => {
                  const isThisConnecting = connectingWalletId === wallet.id;
                  return (
                    <button
                      key={wallet.id}
                      onClick={() => handleConnect(wallet.id)}
                      disabled={isConnecting}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed group relative
                                 ${wallet.popular
                                   ? 'bg-stellar-500/[0.08] border-stellar-500/20 hover:border-stellar-500/40 hover:bg-stellar-500/[0.12]'
                                   : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.06]'
                                 }`}
                    >
                      {/* Wallet Icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0
                                      ${wallet.popular
                                        ? 'bg-stellar-500/20'
                                        : 'bg-white/[0.05]'
                                      }`}>
                        {wallet.icon}
                      </div>

                      {/* Wallet Info */}
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-gray-200 group-hover:text-white">
                            {wallet.name}
                          </p>
                          {wallet.popular && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-stellar-500/20 text-stellar-400 border border-stellar-500/30">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{wallet.description}</p>
                      </div>

                      {/* Loading / Arrow */}
                      <div className="flex-shrink-0">
                        {isThisConnecting ? (
                          <div className="w-4 h-4 border-2 border-stellar-400/30 border-t-stellar-400 rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                <p className="text-[11px] text-gray-500 text-center">
                  No wallet?{' '}
                  <a
                    href="https://freighter.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stellar-400 hover:text-stellar-300 underline underline-offset-2"
                  >
                    Get Freighter
                  </a>
                  {' '}— the most popular Stellar wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
