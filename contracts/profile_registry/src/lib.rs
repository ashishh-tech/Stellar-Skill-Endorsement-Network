#![no_std]

mod types;

#[cfg(test)]
mod test;

use soroban_sdk::{
    contract, contractimpl, log, symbol_short, vec, Address, Env, String, Vec,
};
use types::{DataKey, Role, SkillRecord, UserProfile};

const VERSION: u32 = 1;
const BASE_REPUTATION: u32 = 100;
const MAX_SKILLS_PER_USER: u32 = 50;

#[contract]
pub struct ProfileRegistryContract;

#[contractimpl]
impl ProfileRegistryContract {
    // ─── Initialization ───────────────────────────────────────

    /// Initialize the contract with an admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::UserCount, &0u32);
        env.storage().instance().set(&DataKey::Version, &VERSION);

        // Extend TTL for instance storage — 30 days minimum, 90 days max
        env.storage()
            .instance()
            .extend_ttl(30 * 24 * 60 * 12, 90 * 24 * 60 * 12);

        env.events()
            .publish((symbol_short!("init"),), admin.clone());
        log!(&env, "ProfileRegistry initialized with admin: {:?}", admin);
    }

    // ─── Profile Management ──────────────────────────────────

    /// Register a new user profile
    pub fn register_profile(env: Env, user: Address, name: String) {
        user.require_auth();

        let key = DataKey::Profile(user.clone());
        if env.storage().persistent().has(&key) {
            panic!("profile already exists");
        }

        let profile = UserProfile {
            owner: user.clone(),
            name: name.clone(),
            role: Role::User,
            reputation: BASE_REPUTATION,
            skill_count: 0,
            endorsement_count: 0,
            created_at: env.ledger().timestamp(),
            updated_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &profile);
        env.storage()
            .persistent()
            .extend_ttl(&key, 30 * 24 * 60 * 12, 90 * 24 * 60 * 12);

        // Initialize empty skill list
        let skill_list_key = DataKey::SkillList(user.clone());
        let empty_list: Vec<String> = vec![&env];
        env.storage().persistent().set(&skill_list_key, &empty_list);

        // Increment user count
        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::UserCount)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::UserCount, &(count + 1));

        env.events()
            .publish((symbol_short!("register"), symbol_short!("profile")), (user.clone(), name));
        log!(&env, "Profile registered for: {:?}", user);
    }

    /// Get a user's profile
    pub fn get_profile(env: Env, user: Address) -> UserProfile {
        let key = DataKey::Profile(user.clone());
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("profile not found"))
    }

    /// Check if a profile exists
    pub fn has_profile(env: Env, user: Address) -> bool {
        let key = DataKey::Profile(user);
        env.storage().persistent().has(&key)
    }

    /// Get a user's reputation score
    pub fn get_reputation(env: Env, user: Address) -> u32 {
        let key = DataKey::Profile(user);
        let profile: UserProfile = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("profile not found"));
        profile.reputation
    }

    /// Update a user's profile name
    pub fn update_profile(env: Env, user: Address, name: String) {
        user.require_auth();

        let key = DataKey::Profile(user.clone());
        let mut profile: UserProfile = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("profile not found"));

        profile.name = name.clone();
        profile.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&key, &profile);

        env.events()
            .publish((symbol_short!("update"), symbol_short!("profile")), (user, name));
    }

    // ─── Skill Management ────────────────────────────────────

    /// Add a skill to a user's profile
    pub fn add_skill(env: Env, user: Address, skill_name: String, category: String) {
        user.require_auth();

        // Verify profile exists
        let profile_key = DataKey::Profile(user.clone());
        let mut profile: UserProfile = env
            .storage()
            .persistent()
            .get(&profile_key)
            .unwrap_or_else(|| panic!("profile not found"));

        if profile.skill_count >= MAX_SKILLS_PER_USER {
            panic!("max skills reached");
        }

        // Check skill doesn't already exist
        let skill_key = DataKey::Skill(user.clone(), skill_name.clone());
        if env.storage().persistent().has(&skill_key) {
            panic!("skill already exists");
        }

        let skill = SkillRecord {
            owner: user.clone(),
            name: skill_name.clone(),
            category: category.clone(),
            endorsements: 0,
            weighted_score: 0,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&skill_key, &skill);
        env.storage()
            .persistent()
            .extend_ttl(&skill_key, 30 * 24 * 60 * 12, 90 * 24 * 60 * 12);

        // Update skill list
        let skill_list_key = DataKey::SkillList(user.clone());
        let mut skills: Vec<String> = env
            .storage()
            .persistent()
            .get(&skill_list_key)
            .unwrap_or_else(|| vec![&env]);
        skills.push_back(skill_name.clone());
        env.storage().persistent().set(&skill_list_key, &skills);

        // Update profile skill count
        profile.skill_count += 1;
        profile.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&profile_key, &profile);

        env.events().publish(
            (symbol_short!("add"), symbol_short!("skill")),
            (user, skill_name, category),
        );
    }

    /// Get a specific skill record
    pub fn get_skill(env: Env, user: Address, skill_name: String) -> SkillRecord {
        let skill_key = DataKey::Skill(user, skill_name);
        env.storage()
            .persistent()
            .get(&skill_key)
            .unwrap_or_else(|| panic!("skill not found"))
    }

    /// Get all skill names for a user
    pub fn get_skills(env: Env, user: Address) -> Vec<String> {
        let skill_list_key = DataKey::SkillList(user);
        env.storage()
            .persistent()
            .get(&skill_list_key)
            .unwrap_or_else(|| vec![&env])
    }

    // ─── Endorsement Integration (called by endorsement_engine) ───

    /// Record an endorsement received — updates skill & profile scores.
    /// This function is intended to be called by the endorsement_engine contract.
    pub fn record_endorsement(
        env: Env,
        caller: Address,
        endorsee: Address,
        skill_name: String,
        weight: u32,
    ) {
        caller.require_auth();

        // Update the skill record
        let skill_key = DataKey::Skill(endorsee.clone(), skill_name.clone());
        let mut skill: SkillRecord = env
            .storage()
            .persistent()
            .get(&skill_key)
            .unwrap_or_else(|| panic!("skill not found"));

        skill.endorsements += 1;
        skill.weighted_score += weight;
        env.storage().persistent().set(&skill_key, &skill);

        // Update endorsee's profile reputation
        let profile_key = DataKey::Profile(endorsee.clone());
        let mut profile: UserProfile = env
            .storage()
            .persistent()
            .get(&profile_key)
            .unwrap_or_else(|| panic!("profile not found"));

        profile.endorsement_count += 1;
        // Reputation grows by weight / 10 (diminishing returns)
        profile.reputation += weight / 10;
        profile.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&profile_key, &profile);

        env.events().publish(
            (symbol_short!("endorse"), symbol_short!("record")),
            (endorsee, skill_name, weight),
        );
    }

    // ─── RBAC & Admin ────────────────────────────────────────

    /// Set a user's role (Admin only)
    pub fn set_role(env: Env, admin: Address, user: Address, role: Role) {
        admin.require_auth();
        Self::require_admin(&env, &admin);

        let key = DataKey::Profile(user.clone());
        let mut profile: UserProfile = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("profile not found"));

        profile.role = role.clone();
        profile.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&key, &profile);

        env.events()
            .publish((symbol_short!("set"), symbol_short!("role")), (user, role));
    }

    /// Get the admin address
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("not initialized"))
    }

    /// Transfer admin role
    pub fn transfer_admin(env: Env, current_admin: Address, new_admin: Address) {
        current_admin.require_auth();
        Self::require_admin(&env, &current_admin);

        env.storage()
            .instance()
            .set(&DataKey::Admin, &new_admin);

        env.events().publish(
            (symbol_short!("admin"), symbol_short!("xfer")),
            (current_admin, new_admin),
        );
    }

    // ─── Contract Metadata & Upgrade ─────────────────────────

    /// Get total registered users
    pub fn get_user_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::UserCount)
            .unwrap_or(0)
    }

    /// Get contract version
    pub fn version(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::Version)
            .unwrap_or(VERSION)
    }

    /// Upgrade contract (Admin only)
    pub fn upgrade(env: Env, admin: Address, new_wasm_hash: soroban_sdk::BytesN<32>) {
        admin.require_auth();
        Self::require_admin(&env, &admin);

        env.deployer().update_current_contract_wasm(new_wasm_hash);

        let ver: u32 = env
            .storage()
            .instance()
            .get(&DataKey::Version)
            .unwrap_or(VERSION);
        env.storage()
            .instance()
            .set(&DataKey::Version, &(ver + 1));

        env.events()
            .publish((symbol_short!("upgrade"),), ver + 1);
    }

    /// Extend instance TTL
    pub fn extend_ttl(env: Env) {
        env.storage()
            .instance()
            .extend_ttl(30 * 24 * 60 * 12, 90 * 24 * 60 * 12);
    }

    // ─── Internal helpers ────────────────────────────────────

    fn require_admin(env: &Env, addr: &Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("not initialized"));
        if *addr != admin {
            panic!("not admin");
        }
    }
}
