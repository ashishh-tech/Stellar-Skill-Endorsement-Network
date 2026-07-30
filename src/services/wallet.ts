'use client';

import { STELLAR_CONFIG, truncateAddress } from '@/config/stellar';

export const WALLET_OPTIONS = [
  {
    id: 'freighter',
    name: 'Freighter',
    icon: '🦊',
    description: 'Popular Stellar browser extension wallet',
    popular: true,
  },
  {
    id: 'albedo',
    name: 'Albedo',
    icon: '🌟',
    description: 'Web-based Stellar wallet — no extension needed',
    popular: false,
  },
  {
    id: 'xbull',
    name: 'xBull',
    icon: '🐂',
    description: 'Advanced Stellar wallet with multi-account support',
    popular: false,
  },
  {
    id: 'hana',
    name: 'Hana Wallet',
    icon: '🌸',
    description: 'Modern Stellar & Soroban wallet',
    popular: false,
  },
] as const;

export type WalletId = (typeof WALLET_OPTIONS)[number]['id'];

/**
 * Connect to Freighter wallet using @stellar/freighter-api
 */
export async function connectFreighter(): Promise<string> {
  const freighterApi = await import('@stellar/freighter-api').catch(() => {
    throw new Error(
      'Freighter wallet not detected. Please install the Freighter browser extension from https://freighter.app'
    );
  });

  const connectionResult = await freighterApi.isConnected();
  if (!connectionResult.isConnected) {
    throw new Error(
      'Freighter extension is not installed. Please install it from https://freighter.app and refresh the page.'
    );
  }

  const accessResult = await freighterApi.requestAccess();
  if (accessResult.error) {
    throw new Error(accessResult.error);
  }

  return accessResult.address;
}

/**
 * Check if Freighter is connected
 */
export async function isFreighterConnected(): Promise<boolean> {
  try {
    const freighterApi = await import('@stellar/freighter-api');
    const result = await freighterApi.isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
}

/**
 * Get Freighter address if connected
 */
export async function getFreighterAddress(): Promise<string | null> {
  try {
    const freighterApi = await import('@stellar/freighter-api');
    const result = await freighterApi.getAddress();
    if (result.error) return null;
    return result.address;
  } catch {
    return null;
  }
}

/**
 * Connect to Albedo wallet
 */
export async function connectAlbedo(): Promise<string> {
  const albedo = await import('@albedo-link/intent').catch(() => {
    throw new Error('Albedo wallet is not available. Please try another wallet.');
  });

  const result = await albedo.default.publicKey({});
  return result.pubkey;
}

/**
 * Unified wallet connection entrypoint
 */
export async function connectWallet(walletId: WalletId): Promise<string> {
  switch (walletId) {
    case 'freighter':
      return await connectFreighter();
    case 'albedo':
      return await connectAlbedo();
    case 'xbull':
    case 'hana':
      throw new Error(`${walletId} wallet integration requires the wallet extension to be installed.`);
    default:
      throw new Error('Unknown wallet type');
  }
}

/**
 * Sign XDR transaction with connected wallet
 */
export async function signTransaction(xdr: string, walletType: WalletId = 'freighter'): Promise<string> {
  switch (walletType) {
    case 'freighter': {
      const freighterApi = await import('@stellar/freighter-api');
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
}

export function formatAddress(address: string | null): string {
  if (!address) return 'Not connected';
  return truncateAddress(address, 6);
}
