import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: 'TESTNET' | 'MAINNET';
  walletType: string | null;
  error: string | null;

  // Actions
  connect: (address: string, walletType: string) => void;
  disconnect: () => void;
  setConnecting: (connecting: boolean) => void;
  setNetwork: (network: 'TESTNET' | 'MAINNET') => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      isConnecting: false,
      network: 'TESTNET',
      walletType: null,
      error: null,

      connect: (address: string, walletType: string) =>
        set({
          address,
          isConnected: true,
          isConnecting: false,
          walletType,
          error: null,
        }),

      disconnect: () =>
        set({
          address: null,
          isConnected: false,
          isConnecting: false,
          walletType: null,
          error: null,
        }),

      setConnecting: (connecting: boolean) =>
        set({ isConnecting: connecting }),

      setNetwork: (network: 'TESTNET' | 'MAINNET') =>
        set({ network }),

      setError: (error: string | null) =>
        set({ error, isConnecting: false }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'skill-endorsement-wallet',
      partialize: (state) => ({
        address: state.address,
        isConnected: state.isConnected,
        walletType: state.walletType,
        network: state.network,
      }),
    }
  )
);
