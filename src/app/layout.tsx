import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { NetworkStatusBar } from '@/components/NetworkStatusBar';
import { StarfieldBackground } from '@/components/StarfieldBackground';
import { CommandPalette } from '@/components/CommandPalette';
import { ProfileDossierModal } from '@/components/ProfileDossierModal';

export const metadata: Metadata = {
  title: 'Skill Endorsement Network | Stellar Soroban dApp',
  description:
    'A Sybil-resistant, trust-weighted on-chain reputation graph for skill endorsements powered by Stellar Soroban smart contracts.',
  keywords: ['Stellar', 'Soroban', 'blockchain', 'skill endorsement', 'reputation graph', 'smart contracts', 'web3', 'rust'],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-0 relative selection:bg-stellar-500/30 selection:text-white">
        <StarfieldBackground />
        <div className="flex flex-col min-h-screen relative z-10">
          <NetworkStatusBar />
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CommandPalette />
        <ProfileDossierModal />
      </body>
    </html>
  );
}
