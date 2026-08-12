'use client';

import * as StellarSdk from '@stellar/stellar-sdk';
import { STELLAR_CONFIG, TX_TIMEOUT } from '@/config/stellar';

// ─── Fee Sponsorship Service ─────────────────────────────
// Implements gasless transactions using Stellar's native FeeBumpTransaction.
// A sponsor account pays the transaction fee on behalf of the user,
// enabling zero-cost onboarding for new users.

export interface SponsorConfig {
  /** Sponsor's secret key (server-side only in production) */
  sponsorSecretKey: string;
  /** Maximum fee the sponsor is willing to pay (in stroops) */
  maxFee: string;
  /** Network passphrase */
  networkPassphrase: string;
}

export interface FeeBumpResult {
  /** Whether the transaction was sponsored */
  sponsored: boolean;
  /** The fee bump transaction hash */
  feeBumpTxHash: string;
  /** The inner transaction hash */
  innerTxHash: string;
  /** Sponsor's public key */
  sponsorAddress: string;
  /** Fee paid by sponsor (in stroops) */
  feePaid: string;
  /** Submission result */
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  /** Ledger number */
  ledger?: number;
}

// Default sponsor configuration (uses environment variables)
const DEFAULT_SPONSOR_CONFIG: SponsorConfig = {
  sponsorSecretKey: process.env.NEXT_PUBLIC_FEE_SPONSOR_SECRET || '',
  maxFee: process.env.NEXT_PUBLIC_FEE_SPONSOR_MAX_FEE || '10000000', // 1 XLM max
  networkPassphrase:
    STELLAR_CONFIG.networkPassphrase ||
    'Test SDF Network ; September 2015',
};

/**
 * Check if fee sponsorship is available (sponsor key configured)
 */
export function isSponsorshipAvailable(): boolean {
  return DEFAULT_SPONSOR_CONFIG.sponsorSecretKey.length > 0;
}

/**
 * Get the sponsor's public address
 */
export function getSponsorAddress(): string | null {
  if (!isSponsorshipAvailable()) return null;
  try {
    const keypair = StellarSdk.Keypair.fromSecret(
      DEFAULT_SPONSOR_CONFIG.sponsorSecretKey
    );
    return keypair.publicKey();
  } catch {
    return null;
  }
}

/**
 * Create a Fee Bump Transaction wrapping an inner transaction.
 *
 * This is the core of Stellar's gasless transaction pattern:
 * 1. User signs the inner transaction normally
 * 2. Sponsor wraps it in a FeeBumpTransaction and pays the fee
 * 3. The fee bump tx is submitted to the network
 *
 * @param innerTxXdr - The signed inner transaction as XDR string
 * @param config - Optional sponsor configuration override
 * @returns The fee bump transaction envelope XDR
 */
export function createFeeBumpTransaction(
  innerTxXdr: string,
  config: Partial<SponsorConfig> = {}
): string {
  const cfg = { ...DEFAULT_SPONSOR_CONFIG, ...config };

  if (!cfg.sponsorSecretKey) {
    throw new Error('Fee sponsor secret key not configured');
  }

  const sponsorKeypair = StellarSdk.Keypair.fromSecret(cfg.sponsorSecretKey);

  // Deserialize the inner transaction from XDR
  const innerTx = StellarSdk.TransactionBuilder.fromXDR(
    innerTxXdr,
    cfg.networkPassphrase
  );

  // Build the fee bump transaction
  const feeBumpTx = StellarSdk.TransactionBuilder.buildFeeBumpTransaction(
    sponsorKeypair,
    cfg.maxFee,
    innerTx as StellarSdk.Transaction,
    cfg.networkPassphrase
  );

  // Sponsor signs the fee bump transaction
  feeBumpTx.sign(sponsorKeypair);

  return feeBumpTx.toXDR();
}

/**
 * Submit a fee bump (sponsored) transaction to the Stellar network.
 *
 * @param feeBumpTxXdr - The signed fee bump transaction XDR
 * @returns Submission result with status and hashes
 */
export async function submitSponsoredTransaction(
  feeBumpTxXdr: string
): Promise<FeeBumpResult> {
  const server = new StellarSdk.rpc.Server(STELLAR_CONFIG.rpcUrl);

  const feeBumpTx = StellarSdk.TransactionBuilder.fromXDR(
    feeBumpTxXdr,
    STELLAR_CONFIG.networkPassphrase
  ) as StellarSdk.FeeBumpTransaction;

  try {
    const response = await server.sendTransaction(feeBumpTx);

    if (response.status === 'PENDING') {
      // Poll for completion
      const result = await pollTransactionStatus(
        server,
        response.hash,
        TX_TIMEOUT
      );

      return {
        sponsored: true,
        feeBumpTxHash: response.hash,
        innerTxHash: feeBumpTx.innerTransaction.hash().toString('hex'),
        sponsorAddress: feeBumpTx.feeSource,
        feePaid: feeBumpTx.fee,
        status: result.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
        ledger: result.ledger,
      };
    }

    return {
      sponsored: true,
      feeBumpTxHash: response.hash,
      innerTxHash: feeBumpTx.innerTransaction.hash().toString('hex'),
      sponsorAddress: feeBumpTx.feeSource,
      feePaid: feeBumpTx.fee,
      status: response.status === 'ERROR' ? 'FAILED' : 'PENDING',
    };
  } catch (error) {
    console.error('Sponsored transaction submission failed:', error);
    throw error;
  }
}

/**
 * End-to-end sponsored transaction flow:
 * 1. Takes a user-signed inner transaction
 * 2. Wraps it in a fee bump transaction
 * 3. Submits to the network
 *
 * @param innerTxXdr - User's signed transaction XDR
 * @returns Full result including both tx hashes
 */
export async function sponsorAndSubmit(
  innerTxXdr: string
): Promise<FeeBumpResult> {
  const feeBumpXdr = createFeeBumpTransaction(innerTxXdr);
  return submitSponsoredTransaction(feeBumpXdr);
}

/**
 * Check if a transaction was fee-bumped (sponsored)
 */
export function isSponsoredTransaction(txXdr: string): boolean {
  try {
    const tx = StellarSdk.TransactionBuilder.fromXDR(
      txXdr,
      STELLAR_CONFIG.networkPassphrase
    );
    return tx instanceof StellarSdk.FeeBumpTransaction;
  } catch {
    return false;
  }
}

/**
 * Calculate the estimated sponsorship cost for a transaction
 * @param operationCount - Number of operations in the transaction
 * @returns Estimated fee in stroops
 */
export function estimateSponsorshipCost(operationCount: number = 1): {
  feeStroops: number;
  feeXlm: string;
} {
  const baseFee = 100; // 100 stroops per operation
  const totalStroops = baseFee * operationCount;
  return {
    feeStroops: totalStroops,
    feeXlm: (totalStroops / 10_000_000).toFixed(7),
  };
}

// ─── Internal Helpers ────────────────────────────────────

async function pollTransactionStatus(
  server: StellarSdk.rpc.Server,
  hash: string,
  timeoutSeconds: number
): Promise<{ status: string; ledger?: number }> {
  const deadline = Date.now() + timeoutSeconds * 1000;

  while (Date.now() < deadline) {
    try {
      const result = await server.getTransaction(hash);

      if (result.status === 'SUCCESS') {
        return { status: 'SUCCESS', ledger: result.ledger };
      }
      if (result.status === 'FAILED') {
        return { status: 'FAILED' };
      }
    } catch {
      // Transaction not yet found, keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return { status: 'PENDING' };
}
