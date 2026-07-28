import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { WalletButton } from '@/features/wallet/components/WalletButton';
import { useWalletStore } from '@/features/wallet/store';

describe('WalletButton Component', () => {
  beforeEach(() => {
    useWalletStore.getState().disconnect();
  });

  it('renders connect wallet button when disconnected', () => {
    render(<WalletButton />);
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
  });

  it('opens wallet modal when connect button is clicked', () => {
    render(<WalletButton />);
    const button = screen.getByText(/Connect Wallet/i);
    fireEvent.click(button);
    expect(screen.getByText(/Choose a Stellar wallet/i)).toBeInTheDocument();
    expect(screen.getByText('Freighter')).toBeInTheDocument();
    expect(screen.getByText('Albedo')).toBeInTheDocument();
  });

  it('renders formatted address when wallet is connected', () => {
    useWalletStore.getState().connect('GAAZI4TCR3TY5OJHCTJC2A4AFL5AGXLND6B5EGIK7R5A46VLO3M7QBBB', 'freighter');
    render(<WalletButton />);
    expect(screen.getByText(/GAAZI4...M7QBBB/i)).toBeInTheDocument();
  });
});
