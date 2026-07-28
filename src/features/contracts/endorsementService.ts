import { invokeContract, queryContract, scVal } from './client';
import { STELLAR_CONFIG } from '@/config/stellar';
import * as StellarSdk from '@stellar/stellar-sdk';

const ENGINE = () => STELLAR_CONFIG.contracts.endorsementEngine;

// ─── Endorsement Functions ───────────────────────────────

export async function endorseSkill(
  endorser: string,
  endorsee: string,
  skillName: string,
  message: string
): Promise<string> {
  return invokeContract({
    contractId: ENGINE(),
    method: 'endorse',
    args: [
      scVal.address(endorser),
      scVal.address(endorsee),
      scVal.string(skillName),
      scVal.string(message),
    ],
    caller: endorser,
  });
}

export async function hasEndorsement(
  endorser: string,
  endorsee: string,
  skillName: string
): Promise<boolean> {
  const result = await queryContract({
    contractId: ENGINE(),
    method: 'has_endorsement',
    args: [
      scVal.address(endorser),
      scVal.address(endorsee),
      scVal.string(skillName),
    ],
  });
  if (!result) return false;
  return result.value() as boolean;
}

export async function getEndorsement(
  endorser: string,
  endorsee: string,
  skillName: string
) {
  const result = await queryContract({
    contractId: ENGINE(),
    method: 'get_endorsement',
    args: [
      scVal.address(endorser),
      scVal.address(endorsee),
      scVal.string(skillName),
    ],
  });
  if (!result) return null;
  return parseEndorsement(result);
}

export async function getTotalEndorsements(): Promise<number> {
  const result = await queryContract({
    contractId: ENGINE(),
    method: 'get_total_endorsements',
    args: [],
  });
  if (!result) return 0;
  return result.value() as number;
}

export async function getEngineVersion(): Promise<number> {
  const result = await queryContract({
    contractId: ENGINE(),
    method: 'version',
    args: [],
  });
  if (!result) return 0;
  return result.value() as number;
}

// ─── Parse Helpers ───────────────────────────────────────

function parseEndorsement(scval: StellarSdk.xdr.ScVal) {
  try {
    const fields = (scval.value() as StellarSdk.xdr.ScMapEntry[]);
    const map = new Map<string, StellarSdk.xdr.ScVal>();
    fields.forEach((entry) => {
      const key = entry.key().value()?.toString() || '';
      map.set(key, entry.val());
    });

    return {
      endorser: StellarSdk.Address.fromScVal(map.get('endorser')!).toString(),
      endorsee: StellarSdk.Address.fromScVal(map.get('endorsee')!).toString(),
      skillName: map.get('skill_name')?.value()?.toString() || '',
      weight: (map.get('weight')?.value() as number) || 0,
      message: map.get('message')?.value()?.toString() || '',
      timestamp: Number(map.get('timestamp')?.value() || 0),
    };
  } catch {
    return null;
  }
}
