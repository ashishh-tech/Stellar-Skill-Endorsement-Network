import { invokeContract, queryContract, scVal } from './contract';
import { STELLAR_CONFIG } from '@/config/stellar';
import * as StellarSdk from '@stellar/stellar-sdk';

const ENGINE = () => STELLAR_CONFIG.contracts.endorsementEngine;

export interface EndorsementRecordData {
  endorser: string;
  endorsee: string;
  skillName: string;
  weight: number;
  message: string;
  timestamp: number;
}

// ─── Endorsement Engine Contract Functions (matches contract lib.rs) ───

/**
 * endorse contract call — performs inter-contract endorsement
 */
export async function endorse(
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
export const endorseSkill = endorse;

/**
 * has_endorsement / hasEndorsement contract call
 */
export async function has_endorsement(
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
  return Boolean(result.value());
}
export const hasEndorsement = has_endorsement;

/**
 * get_endorsement / getEndorsement contract call
 */
export async function get_endorsement(
  endorser: string,
  endorsee: string,
  skillName: string
): Promise<EndorsementRecordData | null> {
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
export const getEndorsement = get_endorsement;

/**
 * get_total_endorsements / getTotalEndorsements contract call
 */
export async function get_total_endorsements(): Promise<number> {
  const result = await queryContract({
    contractId: ENGINE(),
    method: 'get_total_endorsements',
    args: [],
  });
  if (!result) return 0;
  return Number(result.value());
}
export const getTotalEndorsements = get_total_endorsements;

/**
 * get_profile_registry / getProfileRegistry contract call
 */
export async function get_profile_registry(): Promise<string> {
  const result = await queryContract({
    contractId: ENGINE(),
    method: 'get_profile_registry',
    args: [],
  });
  if (!result) return '';
  try {
    return StellarSdk.Address.fromScVal(result).toString();
  } catch {
    return '';
  }
}
export const getProfileRegistry = get_profile_registry;

/**
 * version contract call
 */
export async function version(): Promise<number> {
  const result = await queryContract({
    contractId: ENGINE(),
    method: 'version',
    args: [],
  });
  if (!result) return 0;
  return Number(result.value());
}
export const getEngineVersion = version;

// ─── ScVal Parser ───

function parseEndorsement(scval: StellarSdk.xdr.ScVal): EndorsementRecordData | null {
  try {
    const fields = scval.value() as StellarSdk.xdr.ScMapEntry[];
    const map = new Map<string, StellarSdk.xdr.ScVal>();
    fields.forEach((entry) => {
      const key = entry.key().value()?.toString() || '';
      map.set(key, entry.val());
    });

    return {
      endorser: StellarSdk.Address.fromScVal(map.get('endorser')!).toString(),
      endorsee: StellarSdk.Address.fromScVal(map.get('endorsee')!).toString(),
      skillName: map.get('skill_name')?.value()?.toString() || '',
      weight: Number(map.get('weight')?.value() || 0),
      message: map.get('message')?.value()?.toString() || '',
      timestamp: Number(map.get('timestamp')?.value() || 0),
    };
  } catch {
    return null;
  }
}
