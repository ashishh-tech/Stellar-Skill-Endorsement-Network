import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-0/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Skill Endorsement Network — Built on Stellar Soroban</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stellar-400 transition-colors"
            >
              Stellar
            </a>
            <a
              href="https://soroban.stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stellar-400 transition-colors"
            >
              Soroban
            </a>
            <a
              href="https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stellar-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
