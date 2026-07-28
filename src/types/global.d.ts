interface FreighterApi {
  requestAccess: () => Promise<{ error?: string }>;
  getAddress: () => Promise<{ address: string; error?: string }>;
  signTransaction: (
    xdr: string,
    opts?: { networkPassphrase?: string }
  ) => Promise<{ signedTxXdr: string; error?: string }>;
}

interface Window {
  freighterApi?: FreighterApi;
}
