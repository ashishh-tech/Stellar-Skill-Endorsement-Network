/* eslint-disable @typescript-eslint/no-explicit-any */
// Global type declarations for Stellar wallet APIs

// @stellar/freighter-api module types are provided by the npm package itself.
// No need to declare window.freighterApi — we use the proper npm import pattern.

declare module '@albedo-link/intent' {
  interface AlbedoPublicKeyResult {
    pubkey: string;
  }
  interface AlbedoTxResult {
    signed_envelope_xdr: string;
  }
  const albedo: {
    publicKey: (opts: Record<string, unknown>) => Promise<AlbedoPublicKeyResult>;
    tx: (opts: { xdr: string; network: string }) => Promise<AlbedoTxResult>;
  };
  export default albedo;
}
