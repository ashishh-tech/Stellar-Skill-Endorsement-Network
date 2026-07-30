import { invokeContract, queryContract, scVal } from './contract';
import { STELLAR_CONFIG } from '@/config/stellar';
import * as StellarSdk from '@stellar/stellar-sdk';

const REGISTRY = () => STELLAR_CONFIG.contracts.profileRegistry;

export interface UserProfileData {
  owner: string;
  name: string;
  role: string;
  reputation: number;
  skillCount: number;
  endorsementCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface SkillRecordData {
  owner: string;
  name: string;
  category: string;
  endorsements: number;
  weightedScore: number;
  createdAt: number;
}

// ─── Profile Registry Contract Functions (matches contract lib.rs) ───

/**
 * register_profile / registerProfile contract call
 */
export async function register_profile(caller: string, name: string): Promise<string> {
  return invokeContract({
    contractId: REGISTRY(),
    method: 'register_profile',
    args: [scVal.address(caller), scVal.string(name)],
    caller,
  });
}
export const registerProfile = register_profile;

/**
 * update_profile / updateProfile contract call
 */
export async function update_profile(caller: string, name: string): Promise<string> {
  return invokeContract({
    contractId: REGISTRY(),
    method: 'update_profile',
    args: [scVal.address(caller), scVal.string(name)],
    caller,
  });
}
export const updateProfile = update_profile;

/**
 * get_profile / getProfile contract call
 */
export async function get_profile(userAddress: string): Promise<UserProfileData | null> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_profile',
    args: [scVal.address(userAddress)],
  });
  if (!result) return null;
  return parseProfile(result);
}
export const getProfile = get_profile;

/**
 * has_profile / hasProfile contract call
 */
export async function has_profile(userAddress: string): Promise<boolean> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'has_profile',
    args: [scVal.address(userAddress)],
  });
  if (!result) return false;
  return Boolean(result.value());
}
export const hasProfile = has_profile;

/**
 * get_reputation / getReputation contract call
 */
export async function get_reputation(userAddress: string): Promise<number> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_reputation',
    args: [scVal.address(userAddress)],
  });
  if (!result) return 0;
  return Number(result.value());
}
export const getReputation = get_reputation;

/**
 * add_skill / addSkill contract call
 */
export async function add_skill(
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
export const addSkill = add_skill;

/**
 * get_skills / getSkills contract call
 */
export async function get_skills(userAddress: string): Promise<string[]> {
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
export const getSkills = get_skills;

/**
 * get_skill / getSkill contract call
 */
export async function get_skill(userAddress: string, skillName: string): Promise<SkillRecordData | null> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_skill',
    args: [scVal.address(userAddress), scVal.string(skillName)],
  });
  if (!result) return null;
  return parseSkillRecord(result);
}
export const getSkill = get_skill;

/**
 * record_endorsement / recordEndorsement contract call
 */
export async function record_endorsement(
  caller: string,
  endorsee: string,
  skillName: string,
  weight: number
): Promise<string> {
  return invokeContract({
    contractId: REGISTRY(),
    method: 'record_endorsement',
    args: [
      scVal.address(caller),
      scVal.address(endorsee),
      scVal.string(skillName),
      scVal.u32(weight),
    ],
    caller,
  });
}
export const recordEndorsement = record_endorsement;

/**
 * get_user_count / getUserCount contract call
 */
export async function get_user_count(): Promise<number> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'get_user_count',
    args: [],
  });
  if (!result) return 0;
  return Number(result.value());
}
export const getUserCount = get_user_count;

/**
 * version contract call
 */
export async function version(): Promise<number> {
  const result = await queryContract({
    contractId: REGISTRY(),
    method: 'version',
    args: [],
  });
  if (!result) return 0;
  return Number(result.value());
}
export const getVersion = version;

// ─── ScVal Parsers ───

function parseProfile(scval: StellarSdk.xdr.ScVal): UserProfileData | null {
  try {
    const fields = scval.value() as StellarSdk.xdr.ScMapEntry[];
    const map = new Map<string, StellarSdk.xdr.ScVal>();
    fields.forEach((entry) => {
      const key = entry.key().value()?.toString() || '';
      map.set(key, entry.val());
    });

    return {
      owner: StellarSdk.Address.fromScVal(map.get('owner')!).toString(),
      name: map.get('name')?.value()?.toString() || '',
      role: map.get('role')?.value()?.toString() || 'User',
      reputation: Number(map.get('reputation')?.value() || 0),
      skillCount: Number(map.get('skill_count')?.value() || 0),
      endorsementCount: Number(map.get('endorsement_count')?.value() || 0),
      createdAt: Number(map.get('created_at')?.value() || 0),
      updatedAt: Number(map.get('updated_at')?.value() || 0),
    };
  } catch {
    return null;
  }
}

function parseSkillRecord(scval: StellarSdk.xdr.ScVal): SkillRecordData | null {
  try {
    const fields = scval.value() as StellarSdk.xdr.ScMapEntry[];
    const map = new Map<string, StellarSdk.xdr.ScVal>();
    fields.forEach((entry) => {
      const key = entry.key().value()?.toString() || '';
      map.set(key, entry.val());
    });

    return {
      owner: StellarSdk.Address.fromScVal(map.get('owner')!).toString(),
      name: map.get('name')?.value()?.toString() || '',
      category: map.get('category')?.value()?.toString() || '',
      endorsements: Number(map.get('endorsements')?.value() || 0),
      weightedScore: Number(map.get('weighted_score')?.value() || 0),
      createdAt: Number(map.get('created_at')?.value() || 0),
    };
  } catch {
    return null;
  }
}
