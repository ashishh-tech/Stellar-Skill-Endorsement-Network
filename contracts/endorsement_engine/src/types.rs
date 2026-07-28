use soroban_sdk::contracttype;

/// Represents a single endorsement on-chain
#[contracttype]
#[derive(Clone, Debug)]
pub struct Endorsement {
    pub endorser: soroban_sdk::Address,
    pub endorsee: soroban_sdk::Address,
    pub skill_name: soroban_sdk::String,
    pub weight: u32,
    pub message: soroban_sdk::String,
    pub timestamp: u64,
}

/// Storage keys for endorsement engine
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    ProfileRegistry,
    Endorsement(soroban_sdk::Address, soroban_sdk::Address, soroban_sdk::String),
    EndorsementsByEndorsee(soroban_sdk::Address),
    EndorsementsByEndorser(soroban_sdk::Address),
    TotalEndorsements,
    Version,
    Paused,
}
