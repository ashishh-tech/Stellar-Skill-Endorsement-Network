import { Logo } from '@/components/Logo';
import { Github, Globe, BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-0/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="text-base font-bold text-white">
                Skill<span className="text-stellar-400">Net</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              A Sybil-resistant, trust-weighted, on-chain reputation graph powered by Stellar Soroban smart contracts.
            </p>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ecosystem</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-stellar-400 transition-colors flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Stellar
                </a>
              </li>
              <li>
                <a
                  href="https://soroban.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-stellar-400 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Soroban Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Source */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Source Code</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-stellar-400 transition-colors flex items-center gap-2"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Skill Endorsement Network — Built on Stellar Soroban
          </p>
          <p className="text-xs text-gray-600">
            Testnet · v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
