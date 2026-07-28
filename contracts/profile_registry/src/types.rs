use soroban_sdk::contracttype;

/// Roles for RBAC-based access control
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum Role {
    Admin,
    User,
    Verifier,
}

/// A user profile stored on-chain
#[contracttype]
#[derive(Clone, Debug)]
pub struct UserProfile {
    pub owner: soroban_sdk::Address,
    pub name: soroban_sdk::String,
    pub role: Role,
    pub reputation: u32,
    pub skill_count: u32,
    pub endorsement_count: u32,
    pub created_at: u64,
    pub updated_at: u64,
}

/// A skill registered by a user
#[contracttype]
#[derive(Clone, Debug)]
pub struct SkillRecord {
    pub owner: soroban_sdk::Address,
    pub name: soroban_sdk::String,
    pub category: soroban_sdk::String,
    pub endorsements: u32,
    pub weighted_score: u32,
    pub created_at: u64,
}

/// Storage key enumeration for all contract data
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Profile(soroban_sdk::Address),
    Skill(soroban_sdk::Address, soroban_sdk::String),
    SkillList(soroban_sdk::Address),
    UserCount,
    Version,
    EndorsementEngine,
}
