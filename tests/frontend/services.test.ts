import { describe, it, expect, vi } from 'vitest';
import {
  connectWallet,
  formatAddress,
  isFreighterConnected,
  getFreighterAddress,
} from '@/services/wallet';
import {
  register_profile,
  get_profile,
  has_profile,
  get_reputation,
  add_skill,
  get_skills,
  get_user_count,
  version as profileVersion,
} from '@/services/profile';
import {
  endorse,
  get_endorsement,
  has_endorsement,
  get_total_endorsements,
  get_profile_registry,
  version as endorsementVersion,
} from '@/services/endorsement';

vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn().mockResolvedValue({ isConnected: true }),
  requestAccess: vi.fn().mockResolvedValue({ address: 'GAAZI4TCR3TY5OJHCTJC2A4AFL5AGXLND6B5EGIK7R5A46VLO3M7QBBB' }),
  getAddress: vi.fn().mockResolvedValue({ address: 'GAAZI4TCR3TY5OJHCTJC2A4AFL5AGXLND6B5EGIK7R5A46VLO3M7QBBB' }),
  signTransaction: vi.fn().mockResolvedValue({ signedTxXdr: 'AAAA...SIGNED' }),
}));

describe('Frontend Services Integration Suite', () => {
  describe('Wallet Integration Service', () => {
    it('connects to Freighter wallet successfully', async () => {
      const address = await connectWallet('freighter');
      expect(address).toBe('GAAZI4TCR3TY5OJHCTJC2A4AFL5AGXLND6B5EGIK7R5A46VLO3M7QBBB');
    });

    it('checks freighter connection status', async () => {
      const connected = await isFreighterConnected();
      expect(connected).toBe(true);
    });

    it('retrieves freighter address', async () => {
      const address = await getFreighterAddress();
      expect(address).toBe('GAAZI4TCR3TY5OJHCTJC2A4AFL5AGXLND6B5EGIK7R5A46VLO3M7QBBB');
    });

    it('formats wallet address correctly', () => {
      expect(formatAddress(null)).toBe('Not connected');
      expect(formatAddress('GAAZI4TCR3TY5OJHCTJC2A4AFL5AGXLND6B5EGIK7R5A46VLO3M7QBBB')).toBe('GAAZI4...M7QBBB');
    });
  });

  describe('Profile Registry Service Contract Functions', () => {
    it('exposes contract functions matching lib.rs', () => {
      expect(typeof register_profile).toBe('function');
      expect(typeof get_profile).toBe('function');
      expect(typeof has_profile).toBe('function');
      expect(typeof get_reputation).toBe('function');
      expect(typeof add_skill).toBe('function');
      expect(typeof get_skills).toBe('function');
      expect(typeof get_user_count).toBe('function');
      expect(typeof profileVersion).toBe('function');
    });
  });

  describe('Endorsement Engine Service Contract Functions', () => {
    it('exposes contract functions matching lib.rs', () => {
      expect(typeof endorse).toBe('function');
      expect(typeof get_endorsement).toBe('function');
      expect(typeof has_endorsement).toBe('function');
      expect(typeof get_total_endorsements).toBe('function');
      expect(typeof get_profile_registry).toBe('function');
      expect(typeof endorsementVersion).toBe('function');
    });
  });
});
