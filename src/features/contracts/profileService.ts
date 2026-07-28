import { invokeContract, queryContract, scVal } from './client';
import { STELLAR_CONFIG } from '@/config/stellar';
import * as StellarSdk from '@stellar/stellar-sdk';

const REGISTRY = () => STELLAR_CONFIG.contracts.profileRegistry;

// ─── Profile Functions ───────────────────────────────────

export async function registerProfile(caller: string, name: string): Promise<string> {
  return invokeContract({
    contractId: REGISTRY(),
    method: 'register_profile',
    args: [scVal.address(caller), scVal.string(name)],
    caller,
  });
}

export async function updateProfile(caller: string, name: string): Promise<string> {
  return invokeContract({
    contractId: REGISTRY(),
    method: 'update_profile',
    args: [scVal.address(caller), scVal.string(name)],
    caller,
  });
}

export async function getProfile(userAddress: string) {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_profile',
    args: [scVal.address(userAddress)],
  });
  if (!result) return null;

  return parseProfile(result);
}

export async function hasProfile(userAddress: string): Promise<boolean> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'has_profile',
    args: [scVal.address(userAddress)],
  });
  if (!result) return false;
  return result.value() as boolean;
}

export async function getReputation(userAddress: string): Promise<number> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_reputation',
    args: [scVal.address(userAddress)],
  });
  if (!result) return 0;
  return result.value() as number;
}

// ─── Skill Functions ─────────────────────────────────────

export async function addSkill(
  caller: string,
  skillName: string,
  category: string
): Promise<string> {
  return invokeContract({
    contractId: REGISTRY(),
    method: 'add_skill',
    args: [scVal.address(caller), scVal.string(skillName), scVal.string(category)],
    caller,
  });
}

export async function getSkills(userAddress: string): Promise<string[]> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_skills',
    args: [scVal.address(userAddress)],
  });
  if (!result) return [];

  try {
    const vec = result.value() as StellarSdk.xdr.ScVal[];
    return vec.map((v) => v.value()?.toString() || '');
  } catch {
    return [];
  }
}

export async function getSkill(userAddress: string, skillName: string) {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_skill',
    args: [scVal.address(userAddress), scVal.string(skillName)],
  });
  if (!result) return null;
  return parseSkillRecord(result);
}

// ─── Admin Functions ─────────────────────────────────────

export async function getUserCount(): Promise<number> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_user_count',
    args: [],
  });
  if (!result) return 0;
  return result.value() as number;
}

export async function getVersion(): Promise<number> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'version',
    args: [],
  });
  if (!result) return 0;
  return result.value() as number;
}

// ─── Parse Helpers ───────────────────────────────────────

function parseProfile(scval: StellarSdk.xdr.ScVal) {
  try {
    const fields = (scval.value() as StellarSdk.xdr.ScMapEntry[]);
    const map = new Map<string, StellarSdk.xdr.ScVal>();
    fields.forEach((entry) => {
      const key = entry.key().value()?.toString() || '';
      map.set(key, entry.val());
    });

    return {
      owner: StellarSdk.Address.fromScVal(map.get('owner')!).toString(),
      name: map.get('name')?.value()?.toString() || '',
      role: parseRole(map.get('role')),
      reputation: (map.get('reputation')?.value() as number) || 0,
      skillCount: (map.get('skill_count')?.value() as number) || 0,
      endorsementCount: (map.get('endorsement_count')?.value() as number) || 0,
      createdAt: Number(map.get('created_at')?.value() || 0),
      updatedAt: Number(map.get('updated_at')?.value() || 0),
    };
  } catch {
    return null;
  }
}

function parseRole(scval: StellarSdk.xdr.ScVal | undefined): string {
  if (!scval) return 'User';
  try {
    const val = scval.value()?.toString() || 'User';
    return val;
  } catch {
    return 'User';
  }
}

function parseSkillRecord(scval: StellarSdk.xdr.ScVal) {
  try {
    const fields = (scval.value() as StellarSdk.xdr.ScMapEntry[]);
    const map = new Map<string, StellarSdk.xdr.ScVal>();
    fields.forEach((entry) => {
      const key = entry.key().value()?.toString() || '';
      map.set(key, entry.val());
    });

    return {
      owner: StellarSdk.Address.fromScVal(map.get('owner')!).toString(),
      name: map.get('name')?.value()?.toString() || '',
      category: map.get('category')?.value()?.toString() || '',
      endorsements: (map.get('endorsements')?.value() as number) || 0,
      weightedScore: (map.get('weighted_score')?.value() as number) || 0,
      createdAt: Number(map.get('created_at')?.value() || 0),
    };
  } catch {
    return null;
  }
}
