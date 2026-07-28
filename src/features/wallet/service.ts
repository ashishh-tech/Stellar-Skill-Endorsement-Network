'use client';

import { STELLAR_CONFIG, truncateAddress } from '@/config/stellar';
import { useWalletStore } from './store';

// Wallet types supported
export const WALLET_OPTIONS = [
  {
    id: 'freighter',
    name: 'Freighter',
    icon: '🦊',
    description: 'Popular Stellar browser extension wallet',
  },
  {
    id: 'albedo',
    name: 'Albedo',
    icon: '🌟',
    description: 'Web-based Stellar wallet — no extension needed',
  },
  {
    id: 'xbull',
    name: 'xBull',
    icon: '🐂',
    description: 'Advanced Stellar wallet with multi-account support',
  },
  {
    id: 'hana',
    name: 'Hana Wallet',
    icon: '🌸',
    description: 'Modern Stellar & Soroban wallet',
  },
] as const;

export type WalletId = (typeof WALLET_OPTIONS)[number]['id'];

async function connectFreighter(): Promise<string> {
  const freighterApi = typeof window !== 'undefined' ? window.freighterApi : undefined;
  if (!freighterApi) {
    throw new Error('Freighter extension not detected. Please install Freighter wallet.');
  }

  const response = await freighterApi.requestAccess();
  if (response.error) {
    throw new Error(response.error);
  }

  const addressResponse = await freighterApi.getAddress();
  if (addressResponse.error) {
    throw new Error(addressResponse.error);
  }

  return addressResponse.address;
}

async function connectAlbedo(): Promise<string> {
  // Dynamic import Albedo
  const albedo = await import('@albedo-link/intent').catch(() => {
    throw new Error('Albedo wallet is not available. Please try another wallet.');
  });

  const result = await albedo.default.publicKey({});
  return result.pubkey;
}

export async function connectWallet(walletId: WalletId): Promise<string> {
  const store = useWalletStore.getState();
  store.setConnecting(true);
  store.clearError();

  try {
    let address: string;

    switch (walletId) {
      case 'freighter':
        address = await connectFreighter();
        break;
      case 'albedo':
        address = await connectAlbedo();
        break;
      case 'xbull':
      case 'hana':
        // These wallets use a similar API pattern
        throw new Error(`${walletId} wallet integration requires the wallet extension to be installed.`);
      default:
        throw new Error('Unknown wallet type');
    }

    store.connect(address, walletId);
    return address;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect wallet';
    store.setError(message);
    throw error;
  }
}

export async function signTransaction(xdr: string): Promise<string> {
  const store = useWalletStore.getState();
  const { walletType } = store;

  if (!walletType) {
    throw new Error('No wallet connected');
  }

  try {
    switch (walletType) {
      case 'freighter': {
        const freighterApi = typeof window !== 'undefined' ? window.freighterApi : undefined;
        if (!freighterApi) throw new Error('Freighter not available');

        const result = await freighterApi.signTransaction(xdr, {
          networkPassphrase: STELLAR_CONFIG.networkPassphrase,
        });
        if (result.error) throw new Error(result.error);
        return result.signedTxXdr;
      }
      case 'albedo': {
        const albedo = await import('@albedo-link/intent');
        const result = await albedo.default.tx({
          xdr,
          network: 'testnet',
        });
        return result.signed_envelope_xdr;
      }
      default:
        throw new Error(`Transaction signing not supported for ${walletType}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign transaction';
    store.setError(message);
    throw error;
  }
}

export function formatAddress(address: string | null): string {
  if (!address) return 'Not connected';
  return truncateAddress(address, 6);
}
