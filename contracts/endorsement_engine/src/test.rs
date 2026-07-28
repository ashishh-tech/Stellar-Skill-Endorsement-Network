#![cfg(test)]

use super::*;
use profile_registry::ProfileRegistryContract;
use profile_registry::ProfileRegistryContractClient;
use soroban_sdk::{testutils::Address as _, Env, String};

fn setup_env() -> (
    Env,
    Address,
    EndorsementEngineContractClient<'static>,
    Address, // profile_registry contract address
) {
    let env = Env::default();
    env.mock_all_auths();

    // Deploy profile_registry contract
    let registry_id = env.register(ProfileRegistryContract, ());
    let registry_client = ProfileRegistryContractClient::new(&env, &registry_id);
    let admin = Address::generate(&env);
    registry_client.initialize(&admin);

    // Deploy endorsement_engine contract
    let engine_id = env.register(EndorsementEngineContract, ());
    let engine_client = EndorsementEngineContractClient::new(&env, &engine_id);
    engine_client.initialize(&admin, &registry_id);

    (env, admin, engine_client, registry_id)
}

#[test]
fn test_initialize_engine() {
    let (_env, _admin, client, registry_id) = setup_env();
    assert_eq!(client.version(), VERSION);
    assert_eq!(client.get_total_endorsements(), 0);
    assert_eq!(client.get_profile_registry(), registry_id);
}

#[test]
#[should_panic(expected = "already initialized")]
fn test_double_initialize_engine() {
    let (env, _admin, client, registry_id) = setup_env();
    let admin2 = Address::generate(&env);
    client.initialize(&admin2, &registry_id);
}

#[test]
fn test_endorse_skill() {
    let (env, _admin, engine_client, registry_id) = setup_env();
    let registry = ProfileRegistryContractClient::new(&env, &registry_id);

    // Create endorser and endorsee profiles
    let endorser = Address::generate(&env);
    let endorsee = Address::generate(&env);
    registry.register_profile(&endorser, &String::from_str(&env, "Alice"));
    registry.register_profile(&endorsee, &String::from_str(&env, "Bob"));

    // Add skill to endorsee
    let skill = String::from_str(&env, "Rust");
    let category = String::from_str(&env, "Programming");
    registry.add_skill(&endorsee, &skill, &category);

    // Endorse
    let message = String::from_str(&env, "Great Rust developer!");
    engine_client.endorse(&endorser, &endorsee, &skill, &message);

    // Verify endorsement was recorded
    assert!(engine_client.has_endorsement(&endorser, &endorsee, &skill));
    assert_eq!(engine_client.get_total_endorsements(), 1);

    let endorsement = engine_client.get_endorsement(&endorser, &endorsee, &skill);
    assert_eq!(endorsement.endorser, endorser);
    assert_eq!(endorsement.endorsee, endorsee);
    assert_eq!(endorsement.skill_name, skill);
    // Weight should be endorser_reputation / 10 = 100 / 10 = 10
    assert_eq!(endorsement.weight, 10);
}

#[test]
#[should_panic(expected = "cannot endorse yourself")]
fn test_self_endorsement_blocked() {
    let (env, _admin, engine_client, registry_id) = setup_env();
    let registry = ProfileRegistryContractClient::new(&env, &registry_id);

    let user = Address::generate(&env);
    registry.register_profile(&user, &String::from_str(&env, "SelfEndorser"));
    let skill = String::from_str(&env, "Hacking");
    registry.add_skill(&user, &skill, &String::from_str(&env, "Misc"));

    engine_client.endorse(
        &user,
        &user,
        &skill,
        &String::from_str(&env, "I'm great!"),
    );
}

#[test]
#[should_panic(expected = "duplicate endorsement")]
fn test_duplicate_endorsement_blocked() {
    let (env, _admin, engine_client, registry_id) = setup_env();
    let registry = ProfileRegistryContractClient::new(&env, &registry_id);

    let endorser = Address::generate(&env);
    let endorsee = Address::generate(&env);
    registry.register_profile(&endorser, &String::from_str(&env, "Alice"));
    registry.register_profile(&endorsee, &String::from_str(&env, "Bob"));

    let skill = String::from_str(&env, "Soroban");
    registry.add_skill(&endorsee, &skill, &String::from_str(&env, "Blockchain"));

    let msg = String::from_str(&env, "Good work");
    engine_client.endorse(&endorser, &endorsee, &skill, &msg);
    engine_client.endorse(&endorser, &endorsee, &skill, &msg); // Should panic
}

#[test]
#[should_panic(expected = "endorser has no profile")]
fn test_endorser_no_profile() {
    let (env, _admin, engine_client, registry_id) = setup_env();
    let registry = ProfileRegistryContractClient::new(&env, &registry_id);

    let endorser = Address::generate(&env); // No profile
    let endorsee = Address::generate(&env);
    registry.register_profile(&endorsee, &String::from_str(&env, "Bob"));
    let skill = String::from_str(&env, "Test");
    registry.add_skill(&endorsee, &skill, &String::from_str(&env, "Cat"));

    engine_client.endorse(
        &endorser,
        &endorsee,
        &skill,
        &String::from_str(&env, "msg"),
    );
}

#[test]
#[should_panic(expected = "endorsee has no profile")]
fn test_endorsee_no_profile() {
    let (env, _admin, engine_client, registry_id) = setup_env();
    let registry = ProfileRegistryContractClient::new(&env, &registry_id);

    let endorser = Address::generate(&env);
    let endorsee = Address::generate(&env); // No profile
    registry.register_profile(&endorser, &String::from_str(&env, "Alice"));

    let skill = String::from_str(&env, "Test");
    engine_client.endorse(
        &endorser,
        &endorsee,
        &skill,
        &String::from_str(&env, "msg"),
    );
}

#[test]
fn test_endorsement_weight_scales_with_reputation() {
    let (env, _admin, engine_client, registry_id) = setup_env();
    let registry = ProfileRegistryContractClient::new(&env, &registry_id);

    let high_rep = Address::generate(&env);
    let endorsee1 = Address::generate(&env);
    let endorsee2 = Address::generate(&env);
    let low_rep = Address::generate(&env);

    registry.register_profile(&high_rep, &String::from_str(&env, "HighRep"));
    registry.register_profile(&endorsee1, &String::from_str(&env, "Endorsee1"));
    registry.register_profile(&endorsee2, &String::from_str(&env, "Endorsee2"));
    registry.register_profile(&low_rep, &String::from_str(&env, "LowRep"));

    let skill = String::from_str(&env, "Stellar");
    let cat = String::from_str(&env, "Blockchain");
    registry.add_skill(&endorsee1, &skill, &cat);
    registry.add_skill(&endorsee2, &skill, &cat);

    let booster = Address::generate(&env);
    let unused_skill = String::from_str(&env, "unused");
    registry.add_skill(&high_rep, &unused_skill, &cat);
    registry.record_endorsement(&booster, &high_rep, &unused_skill, &500);

    let msg = String::from_str(&env, "Endorsed");
    engine_client.endorse(&high_rep, &endorsee1, &skill, &msg);
    engine_client.endorse(&low_rep, &endorsee2, &skill, &msg);

    let e1 = engine_client.get_endorsement(&high_rep, &endorsee1, &skill);
    let e2 = engine_client.get_endorsement(&low_rep, &endorsee2, &skill);

    assert!(e1.weight > e2.weight);
}
