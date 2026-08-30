# 📖 User Guide & Complete Documentation (Level 7 — Founder Belt)

> **Skill Endorsement Network**: A Sybil-Resistant, On-Chain Reputation Graph Powered by Stellar Soroban Smart Contracts  
> **Live Production App**: [https://skill-endorsement-network.netlify.app/](https://skill-endorsement-network.netlify.app/)  
> **GitHub Repository**: [https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network](https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network)  

---

## 🚀 Getting Started

### 1. Connecting Your Wallet
1. Open the live application at [https://skill-endorsement-network.netlify.app/](https://skill-endorsement-network.netlify.app/).
2. Click **Connect Wallet** in the top navigation header.
3. Select your preferred Stellar wallet provider via `StellarWalletsKit`:
   - **Freighter Wallet** (Recommended for browser extension)
   - **Albedo** (Web-based signing, works on all devices)
   - **Hana Wallet**
   - **xBull Wallet**
4. Approve the connection in your wallet popup. The app will immediately load your Stellar address and live XLM balance.

---

## 👤 User Profile & Skill Management

### Registering Your On-Chain Identity
1. Navigate to the **Profile** dashboard or click **Register Profile**.
2. Enter your display name, optional domain/bio, and avatar URL.
3. Click **Register Profile** to invoke the `register_profile` smart contract method on Stellar Soroban.
4. Once confirmed, your base reputation score starts at **100 Points**.

### Adding & Managing Skill Records
1. In your profile view, click **Add Skill**.
2. Enter the skill name (e.g. `Soroban`, `Rust`, `TypeScript`, `Security Audit`, `UI/UX Design`).
3. Select the primary skill domain category.
4. Confirm transaction signing in your wallet. The skill record is registered permanently to your on-chain storage.

---

## 🤝 Reputation-Weighted Endorsements (Anti-Sybil)

### How Trust-Weighted Endorsements Work
- When User A endorses User B's skill, the `endorsement_engine` smart contract executes an atomic cross-contract call to `profile_registry` to retrieve User A's real-time reputation score.
- **Weight Calculation Formula**:
  $$\text{Endorsement Weight} = \max\left(\left\lfloor\frac{\text{Endorser Reputation}}{10}\right\rfloor, 1\right)$$
- **Protocol-Enforced Invariants**:
  - ❌ **Self-Endorsements Blocked**: A user cannot endorse their own skills (`endorser != endorsee`).
  - ❌ **Duplicate Endorsements Blocked**: An endorser cannot endorse the exact same skill twice for the same user.
  - ✅ **Active Profile Required**: Both the endorser and the recipient must have initialized on-chain profiles.
  - 📈 **Reputation Feedback**: Each valid endorsement increases both the endorsee's specific skill score and their overall network reputation score.

---

## 💻 Developer & SDK Integration Guide

### Using the Canonical TypeScript SDK Services

The application exports modular, type-safe service classes in `src/services/` for easy third-party integration:

```typescript
import { ProfileService, EndorsementService, WalletService } from '@/services';

// 1. Check wallet connection
const isConnected = await WalletService.isConnected();
const activeAddress = await WalletService.getPublicKey();

// 2. Fetch on-chain profile data
const profile = await ProfileService.getProfile(activeAddress);
console.log(`Reputation: ${profile.reputationScore}, Skills: ${profile.skillCount}`);

// 3. Query skill records
const skills = await ProfileService.getSkills(activeAddress);

// 4. Submit an endorsement transaction
const txResult = await EndorsementService.endorseSkill({
  endorser: activeAddress,
  endorsee: "GDT35B5P3C7AGZ7CEXIPE64GJDCV65JCAYY7I5ONQZUMPMSC576MW6NF",
  skillName: "Soroban",
  message: "Outstanding smart contract architecture and security best practices."
});

console.log(`Transaction Confirmed on Mainnet! Hash: ${txResult.hash}`);
```

---

## 📊 Analytics, Telemetry & Real-Time Monitoring

- **Live RPC Health**: Monitored continuously via the `NetworkStatusBar.tsx` component.
- **Telemetry Metrics Tracked**:
  - Mainnet RPC Latency (P50, P90, P95)
  - Active Ledger Sequence & Status
  - Gas / Stroops Consumption per Contract Invocation
  - Real-Time Event Stream from Soroban Contract Topics (`endorse`, `profile_created`, `skill_added`)

---

## 🌐 Community, Support & Resources

- **Mainnet Application**: [https://skill-endorsement-network.netlify.app/](https://skill-endorsement-network.netlify.app/)
- **GitHub Repository**: [ashishh-tech/Stellar-Skill-Endorsement-Network](https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network)
- **Monthly Growth Report**: [`docs/monthly_growth_report.md`](monthly_growth_report.md)
- **Mainnet 50+ Users Proof**: [`docs/mainnet_users_proof.md`](mainnet_users_proof.md)
- **Mainnet Transaction Activity**: [`docs/mainnet_transaction_proof.md`](mainnet_transaction_proof.md)
- **Security Audit Report**: [`docs/security_audit_report.md`](security_audit_report.md)
- **User Feedback Excel**: [`docs/user_feedback_responses.xlsx`](user_feedback_responses.xlsx)
- **Twitter / X Community**: [https://x.com/StellarSkills](https://x.com/StellarSkills)
- **GitHub Discussions**: [Community Discussions](https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network/discussions)
