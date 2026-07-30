export const STELLAR_CONFIG = {
  networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  explorerUrl: 'https://stellar.expert/explorer/testnet',
  friendbotUrl: 'https://friendbot.stellar.org',
  contracts: {
    profileRegistry: process.env.NEXT_PUBLIC_PROFILE_REGISTRY_CONTRACT_ID || 'CAAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQC526',
    endorsementEngine: process.env.NEXT_PUBLIC_ENDORSEMENT_ENGINE_CONTRACT_ID || 'CABAEAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAFNSZ',
  },
} as const;

export const NETWORK_DETAILS = {
  network: 'TESTNET' as const,
  networkUrl: STELLAR_CONFIG.rpcUrl,
  networkPassphrase: STELLAR_CONFIG.networkPassphrase,
};

export const TX_TIMEOUT = 30; // seconds

export function getExplorerTxUrl(txHash: string): string {
  return `${STELLAR_CONFIG.explorerUrl}/tx/${txHash}`;
}

export function getExplorerContractUrl(contractId: string): string {
  return `${STELLAR_CONFIG.explorerUrl}/contract/${contractId}`;
}

export function getExplorerAccountUrl(accountId: string): string {
  return `${STELLAR_CONFIG.explorerUrl}/account/${accountId}`;
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
