#![no_std]

mod types;

#[cfg(test)]
mod test;

use soroban_sdk::{
    contract, contractclient, contractimpl, log, symbol_short, vec, Address, Env, String, Vec,
};
use types::{DataKey, Endorsement};

const VERSION: u32 = 1;
const MIN_ENDORSEMENT_WEIGHT: u32 = 1;

// ─── Inter-contract client interface ─────────────────────
// Uses Soroban's contractclient macro to generate a cross-contract client
#[contractclient(name = "ProfileRegistryClient")]
pub trait ProfileRegistryInterface {
    fn has_profile(env: &Env, user: &Address) -> bool;
    fn get_reputation(env: &Env, user: &Address) -> u32;
    fn record_endorsement(
        env: &Env,
        caller: &Address,
        endorsee: &Address,
        skill_name: &String,
        weight: &u32,
    );
}

#[contract]
pub struct EndorsementEngineContract;

#[contractimpl]
impl EndorsementEngineContract {
    // ─── Initialization ───────────────────────────────────────

    /// Initialize the endorsement engine with admin and profile registry contract ID
    pub fn initialize(env: Env, admin: Address, profile_registry: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::ProfileRegistry, &profile_registry);
        env.storage()
            .instance()
            .set(&DataKey::TotalEndorsements, &0u32);
        env.storage()
            .instance()
            .set(&DataKey::Version, &VERSION);
        env.storage().instance().set(&DataKey::Paused, &false);

        env.storage()
            .instance()
            .extend_ttl(30 * 24 * 60 * 12, 90 * 24 * 60 * 12);

        env.events().publish(
            (symbol_short!("init"),),
            (admin.clone(), profile_registry),
        );
        log!(&env, "EndorsementEngine initialized");
    }

    // ─── Core Endorsement Logic ──────────────────────────────

    /// Endorse a user's skill. Performs real inter-contract calls to
    /// profile_registry to verify profiles, get endorser weight, and update endorsee score.
    pub fn endorse(
        env: Env,
        endorser: Address,
        endorsee: Address,
        skill_name: String,
        message: String,
    ) {
        endorser.require_auth();
        Self::require_not_paused(&env);

        // Guard: Self-endorsement blocked
        if endorser == endorsee {
            panic!("cannot endorse yourself");
        }

        // Guard: Duplicate endorsement blocked
        let endorsement_key =
            DataKey::Endorsement(endorser.clone(), endorsee.clone(), skill_name.clone());
        if env.storage().persistent().has(&endorsement_key) {
            panic!("duplicate endorsement");
        }

        // Inter-contract call setup
        let registry_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::ProfileRegistry)
            .unwrap_or_else(|| panic!("not initialized"));

        let registry = ProfileRegistryClient::new(&env, &registry_addr);

        // Inter-contract call 1: Verify endorser has profile
        let endorser_has_profile = registry.has_profile(&endorser);
        if !endorser_has_profile {
            panic!("endorser has no profile");
        }

        // Inter-contract call 2: Verify endorsee has profile
        let endorsee_has_profile = registry.has_profile(&endorsee);
        if !endorsee_has_profile {
            panic!("endorsee has no profile");
        }

        // Inter-contract call 3: Get endorser's reputation for weighting
        let endorser_reputation = registry.get_reputation(&endorser);
        let weight = core::cmp::max(endorser_reputation / 10, MIN_ENDORSEMENT_WEIGHT);

        // Inter-contract call 4: Record endorsement in profile registry
        registry.record_endorsement(
            &env.current_contract_address(),
            &endorsee,
            &skill_name,
            &weight,
        );

        // Store endorsement record locally
        let endorsement = Endorsement {
            endorser: endorser.clone(),
            endorsee: endorsee.clone(),
            skill_name: skill_name.clone(),
            weight,
            message: message.clone(),
            timestamp: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&endorsement_key, &endorsement);
        env.storage()
            .persistent()
            .extend_ttl(&endorsement_key, 30 * 24 * 60 * 12, 90 * 24 * 60 * 12);

        // Update per-user endorsement lists
        Self::append_endorsement_by_endorsee(&env, &endorsee, &endorsement);
        Self::append_endorsement_by_endorser(&env, &endorser, &endorsement);

        // Increment global counter
        let total: u32 = env
            .storage()
            .instance()
            .get(&DataKey::TotalEndorsements)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TotalEndorsements, &(total + 1));

        // Emit endorsement event
        env.events().publish(
            (symbol_short!("endorse"), symbol_short!("skill")),
            (endorser, endorsee, skill_name, weight, message),
        );
    }

    // ─── Query Functions ─────────────────────────────────────

    pub fn get_endorsement(
        env: Env,
        endorser: Address,
        endorsee: Address,
        skill_name: String,
    ) -> Endorsement {
        let key = DataKey::Endorsement(endorser, endorsee, skill_name);
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("endorsement not found"))
    }

    pub fn has_endorsement(
        env: Env,
        endorser: Address,
        endorsee: Address,
        skill_name: String,
    ) -> bool {
        let key = DataKey::Endorsement(endorser, endorsee, skill_name);
        env.storage().persistent().has(&key)
    }

    pub fn get_total_endorsements(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::TotalEndorsements)
            .unwrap_or(0)
    }

    pub fn get_profile_registry(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::ProfileRegistry)
            .unwrap_or_else(|| panic!("not initialized"))
    }

    // ─── Admin Functions ─────────────────────────────────────

    pub fn set_paused(env: Env, admin: Address, paused: bool) {
        admin.require_auth();
        Self::require_admin(&env, &admin);
        env.storage().instance().set(&DataKey::Paused, &paused);

        env.events()
            .publish((symbol_short!("paused"),), paused);
    }

    pub fn set_profile_registry(env: Env, admin: Address, new_registry: Address) {
        admin.require_auth();
        Self::require_admin(&env, &admin);
        env.storage()
            .instance()
            .set(&DataKey::ProfileRegistry, &new_registry);

        env.events()
            .publish((symbol_short!("registry"),), new_registry);
    }

    pub fn version(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::Version)
            .unwrap_or(VERSION)
    }

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
    }

    pub fn extend_ttl(env: Env) {
        env.storage()
            .instance()
            .extend_ttl(30 * 24 * 60 * 12, 90 * 24 * 60 * 12);
    }

    // ─── Internal Helpers ────────────────────────────────────

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

    fn require_not_paused(env: &Env) {
        let paused: bool = env
            .storage()
            .instance()
            .get(&DataKey::Paused)
            .unwrap_or(false);
        if paused {
            panic!("contract is paused");
        }
    }

    fn append_endorsement_by_endorsee(env: &Env, endorsee: &Address, endorsement: &Endorsement) {
        let key = DataKey::EndorsementsByEndorsee(endorsee.clone());
        let mut list: Vec<Endorsement> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| vec![env]);
        list.push_back(endorsement.clone());
        env.storage().persistent().set(&key, &list);
    }

    fn append_endorsement_by_endorser(env: &Env, endorser: &Address, endorsement: &Endorsement) {
        let key = DataKey::EndorsementsByEndorser(endorser.clone());
        let mut list: Vec<Endorsement> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| vec![env]);
        list.push_back(endorsement.clone());
        env.storage().persistent().set(&key, &list);
    }
}
