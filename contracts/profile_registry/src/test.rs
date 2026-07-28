#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

fn setup_env() -> (Env, Address, ProfileRegistryContractClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(ProfileRegistryContract, ());
    let client = ProfileRegistryContractClient::new(&env, &contract_id);
    let admin = Address::generate(&env);
    client.initialize(&admin);
    (env, admin, client)
}

#[test]
fn test_initialize() {
    let (_env, admin, client) = setup_env();
    assert_eq!(client.get_admin(), admin);
    assert_eq!(client.version(), VERSION);
    assert_eq!(client.get_user_count(), 0);
}

#[test]
#[should_panic(expected = "already initialized")]
fn test_double_initialize() {
    let (env, _admin, client) = setup_env();
    let admin2 = Address::generate(&env);
    client.initialize(&admin2);
}

#[test]
fn test_register_profile() {
    let (env, _admin, client) = setup_env();
    let user = Address::generate(&env);
    let name = String::from_str(&env, "Alice");

    client.register_profile(&user, &name);

    let profile = client.get_profile(&user);
    assert_eq!(profile.name, name);
    assert_eq!(profile.reputation, BASE_REPUTATION);
    assert_eq!(profile.skill_count, 0);
    assert_eq!(client.get_user_count(), 1);
    assert!(client.has_profile(&user));
}

#[test]
#[should_panic(expected = "profile already exists")]
fn test_duplicate_profile() {
    let (env, _admin, client) = setup_env();
    let user = Address::generate(&env);
    let name = String::from_str(&env, "Alice");

    client.register_profile(&user, &name);
    client.register_profile(&user, &name); // Should panic
}

#[test]
fn test_add_and_get_skill() {
    let (env, _admin, client) = setup_env();
    let user = Address::generate(&env);
    let name = String::from_str(&env, "Bob");
    client.register_profile(&user, &name);

    let skill = String::from_str(&env, "Rust");
    let category = String::from_str(&env, "Programming");
    client.add_skill(&user, &skill, &category);

    let skill_record = client.get_skill(&user, &skill);
    assert_eq!(skill_record.name, skill);
    assert_eq!(skill_record.category, category);
    assert_eq!(skill_record.endorsements, 0);

    let skills = client.get_skills(&user);
    assert_eq!(skills.len(), 1);

    let profile = client.get_profile(&user);
    assert_eq!(profile.skill_count, 1);
}

#[test]
#[should_panic(expected = "skill already exists")]
fn test_duplicate_skill() {
    let (env, _admin, client) = setup_env();
    let user = Address::generate(&env);
    client.register_profile(&user, &String::from_str(&env, "Charlie"));

    let skill = String::from_str(&env, "Solidity");
    let cat = String::from_str(&env, "Blockchain");
    client.add_skill(&user, &skill, &cat);
    client.add_skill(&user, &skill, &cat); // Should panic
}

#[test]
fn test_record_endorsement() {
    let (env, _admin, client) = setup_env();
    let endorsee = Address::generate(&env);
    let caller = Address::generate(&env);
    client.register_profile(&endorsee, &String::from_str(&env, "Diana"));

    let skill = String::from_str(&env, "Soroban");
    let cat = String::from_str(&env, "Blockchain");
    client.add_skill(&endorsee, &skill, &cat);

    client.record_endorsement(&caller, &endorsee, &skill, &150);

    let skill_record = client.get_skill(&endorsee, &skill);
    assert_eq!(skill_record.endorsements, 1);
    assert_eq!(skill_record.weighted_score, 150);

    let profile = client.get_profile(&endorsee);
    assert_eq!(profile.endorsement_count, 1);
    assert_eq!(profile.reputation, BASE_REPUTATION + 15); // 150/10
}

#[test]
fn test_set_role() {
    let (env, admin, client) = setup_env();
    let user = Address::generate(&env);
    client.register_profile(&user, &String::from_str(&env, "Eve"));

    client.set_role(&admin, &user, &Role::Verifier);
    let profile = client.get_profile(&user);
    assert_eq!(profile.role, Role::Verifier);
}

#[test]
#[should_panic(expected = "not admin")]
fn test_set_role_non_admin() {
    let (env, _admin, client) = setup_env();
    let user = Address::generate(&env);
    let faker = Address::generate(&env);
    client.register_profile(&user, &String::from_str(&env, "Frank"));
    client.set_role(&faker, &user, &Role::Admin); // Should panic
}

#[test]
fn test_update_profile() {
    let (env, _admin, client) = setup_env();
    let user = Address::generate(&env);
    client.register_profile(&user, &String::from_str(&env, "Grace"));

    let new_name = String::from_str(&env, "Grace Updated");
    client.update_profile(&user, &new_name);

    let profile = client.get_profile(&user);
    assert_eq!(profile.name, new_name);
}

#[test]
fn test_transfer_admin() {
    let (env, admin, client) = setup_env();
    let new_admin = Address::generate(&env);

    client.transfer_admin(&admin, &new_admin);
    assert_eq!(client.get_admin(), new_admin);
}

#[test]
fn test_get_reputation() {
    let (env, _admin, client) = setup_env();
    let user = Address::generate(&env);
    client.register_profile(&user, &String::from_str(&env, "Hank"));

    assert_eq!(client.get_reputation(&user), BASE_REPUTATION);
}
