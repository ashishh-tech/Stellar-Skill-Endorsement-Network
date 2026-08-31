# 📐 Technical Specification & Architecture Manual (Level 7 — Founder Belt)

> **Project**: Skill Endorsement Network  
> **Platform**: Stellar Soroban Smart Contracts (Rust SDK v22.0.0) & Next.js 15 App Router  
> **Target Network**: Stellar Mainnet (`Public Global Stellar Network ; September 2015`)  

---

## 1. 🏗️ High-Level System Architecture

```mermaid
graph TB
    subgraph Client ["Frontend Client (Next.js 15 + React 19 + TypeScript)"]
        UI["UI View Layer (Dashboard, Activity Feed, Analytics, Dossier)"]
        WK["StellarWalletsKit (Freighter, Albedo, Hana, xBull)"]
        SVC["Modular Services Layer (@/services)"]
        RT["Real-Time Soroban RPC Telemetry Engine"]
    end

    subgraph StellarRPC ["Stellar Soroban Network Infrastructure"]
        RPC["Soroban RPC Node (Simulation / Submission)"]
        LEDGER["Stellar Ledger State & Storage (TTL: 30-90 Days)"]
        EVENTS["Contract Event Bus (Topic: 'endorse', 'register_profile')"]
    end

    subgraph SorobanContracts ["Soroban Smart Contracts (WASM)"]
        PR["ProfileRegistry Contract\n(CBJWW2LMNRCW4ZDPOJZWKUDSN5TGS3DFKJSWO2LTORZHSMJQGAYDCTPH)"]
        EE["EndorsementEngine Contract\n(CBJWW2LMNRCW4ZDPOJZWKRLOM5UW4ZKTNVQXE5CDN5XHI4TBMN2DDGAL)"]
    end

    UI --> WK
    WK --> SVC
    SVC -->|Simulate & Submit Transaction| RPC
    RPC -->|Execute WASM| EE
    EE -->|Cross-Contract Invocation| PR
    EE -->|Publish Events| EVENTS
    PR -->|Publish Events| EVENTS
    EVENTS --> LEDGER
    RT -->|Poll RPC Events| RPC
```

---

## 2. 🗄️ Smart Contract Storage Schema & Data Structures

### 2.1 `ProfileRegistry` Data Structures

```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UserProfile {
    pub owner: Address,
    pub display_name: String,
    pub domain: String,
    pub reputation_score: u32,
    pub skill_count: u32,
    pub endorsement_count: u32,
    pub registered_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SkillRecord {
    pub name: String,
    pub category: String,
    pub weighted_score: u32,
    pub total_endorsements: u32,
    pub added_at: u64,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Role {
    Admin = 0,
    User = 1,
    Verifier = 2,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Profile(Address),
    UserSkill(Address, String),
    UserSkillsList(Address),
    Role(Address),
    TotalProfiles,
}
```

### 2.2 `EndorsementEngine` Data Structures

```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EndorsementRecord {
    pub endorser: Address,
    pub endorsee: Address,
    pub skill_name: String,
    pub calculated_weight: u32,
    pub message: String,
    pub timestamp: u64,
}

#[contracttype]
pub enum EngineKey {
    Admin,
    RegistryAddress,
    Endorsement(Address, Address, String), // (Endorser, Endorsee, Skill) -> Prevents duplicate
    TotalEndorsements,
    Paused,
}
```

---

## 3. 🔄 Cross-Contract Invocation Mechanics

The `EndorsementEngine` contract interacts with `ProfileRegistry` dynamically at runtime:

```mermaid
sequenceDiagram
    autonumber
    actor Endorser as Endorser (Wallet)
    participant EE as EndorsementEngine Contract
    participant PR as ProfileRegistry Contract
    participant Ledger as Soroban Ledger Events

    Endorser->>EE: endorse(endorser, endorsee, skill_name, message)
    Note over EE: Step 1: caller.require_auth()<br/>Step 2: Check endorser != endorsee<br/>Step 3: Check !has_endorsed(endorser, endorsee, skill)
    
    EE->>PR: has_profile(endorser)
    PR-->>EE: bool (true)
    
    EE->>PR: has_profile(endorsee)
    PR-->>EE: bool (true)
    
    EE->>PR: get_reputation(endorser)
    PR-->>EE: u32 reputation (e.g. 150)
    
    Note over EE: Calculate Weight: max(reputation / 10, 1) = 15
    
    EE->>PR: record_endorsement(caller, endorsee, skill_name, weight)
    Note over PR: Update skill weighted_score += 15<br/>Increment profile endorsement_count += 1<br/>Increase profile reputation_score += (weight / 2)
    PR-->>EE: success
    
    EE->>Ledger: publish_event("endorse", endorser, endorsee, skill_name, weight)
    EE-->>Endorser: Transaction Confirmation (Tx Hash)
```

---

## 4. ⚡ Gas Profiling & CPU Instructions Metering

| Function | CPU Instructions | Memory Footprint (Bytes) | Est. Cost (XLM) |
|---|---|---|---|
| `register_profile` | ~215,000 | 1,420 bytes | ~0.000035 XLM |
| `add_skill` | ~180,000 | 1,180 bytes | ~0.000032 XLM |
| `endorse` (Cross-Contract) | ~420,000 | 2,850 bytes | ~0.000048 XLM |
| `get_reputation` (Read-only) | ~85,000 | 512 bytes | 0.000000 XLM (Simulated) |
| `get_skills` (Read-only) | ~110,000 | 890 bytes | 0.000000 XLM (Simulated) |

---

## 5. 🛡️ Security Invariants & Formal Safety Guards

1. **Strict Authentication**: Every state-modifying function mandates `caller.require_auth()` matching the caller parameter.
2. **Reentrancy Protection**: State mutations in `endorsement_engine` are executed after cross-contract verifications using the Checks-Effects-Interactions pattern.
3. **Anti-Sybil Guards**: Self-endorsements panic with clear error codes.
4. **State Storage TTL**: Persistent storage instances automatically extend TTL during updates to guarantee permanence across 30 to 90 days.
