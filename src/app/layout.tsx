import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skill Endorsement Network | Stellar Soroban dApp',
  description:
    'A trust-weighted, on-chain reputation graph for skill endorsements powered by Stellar Soroban smart contracts.',
  keywords: ['Stellar', 'Soroban', 'blockchain', 'skill endorsement', 'reputation', 'web3'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-0">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
