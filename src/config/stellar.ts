export const STELLAR_CONFIG = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'MAINNET',
  networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Public Global Stellar Network ; September 2015',
  rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://mainnet.sorobanrpc.com',
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon.stellar.org',
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://stellar.expert/explorer/public',
  friendbotUrl: 'https://friendbot.stellar.org',
  contracts: {
    profileRegistry: process.env.NEXT_PUBLIC_PROFILE_REGISTRY_CONTRACT_ID || 'CCAGR3Y42J34T3Z5PROFILE3REGISTRY3MAINNET3STELLAR3SOROBAN',
    endorsementEngine: process.env.NEXT_PUBLIC_ENDORSEMENT_ENGINE_CONTRACT_ID || 'CCAGR3Y42J34T3Z5ENDORSEMENT3ENGINE3MAINNET3STELLAR3SOROBAN',
  },
  testnetContracts: {
    profileRegistry: 'CA3D52A56B26A4D789B1C56F987D1234567890ABCDEF1234567890ABCDEF1234',
    endorsementEngine: 'CB7E89F01234567890ABCDEF1234567890ABCDEF1234567890ABCDEF12345678',
  }
} as const;

export const NETWORK_DETAILS = {
  network: STELLAR_CONFIG.network,
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
