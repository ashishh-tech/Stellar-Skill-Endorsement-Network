'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { STELLAR_CONFIG, getExplorerContractUrl } from '@/config/stellar';
import { ExternalLink, Github, Shield, Terminal, BookOpen, Layers, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-surface-1/90 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-lg font-bold text-white tracking-tight">
                Skill<span className="gradient-text">Net</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              A trust-weighted, Sybil-resistant on-chain reputation graph powered by Stellar Soroban smart contracts.
              Verifiable skill proofs and cryptographic endorsements for the decentralized web.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Stellar Testnet
              </span>
              <span>·</span>
              <span>Soroban v21</span>
              <span>·</span>
              <span>Open Source MIT</span>
            </div>
          </div>

          {/* Col 2: Smart Contracts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-stellar-400" />
              Soroban Contracts
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={getExplorerContractUrl(STELLAR_CONFIG.contracts.profileRegistry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-stellar-300 transition-colors flex items-center gap-1"
                >
                  <span>ProfileRegistry</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
              <li>
                <a
                  href={getExplorerContractUrl(STELLAR_CONFIG.contracts.endorsementEngine)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-stellar-300 transition-colors flex items-center gap-1"
                >
                  <span>EndorsementEngine</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
              <li>
                <a
                  href={STELLAR_CONFIG.friendbotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent-orange transition-colors flex items-center gap-1"
                >
                  <span>Friendbot XLM Faucet</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Ecosystem & Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-accent-orange" />
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors">
                  Reputation Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/activity" className="text-gray-400 hover:text-white transition-colors">
                  Live Soroban Event Stream
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="text-gray-400 hover:text-white transition-colors">
                  Transaction Lifecycle Pipeline
                </Link>
              </li>
              <li>
                <a
                  href="https://developers.stellar.org/docs/smart-contracts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Soroban Docs</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Stellar Skill Endorsement Network. Built with Stellar Soroban, Rust, & Next.js.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
