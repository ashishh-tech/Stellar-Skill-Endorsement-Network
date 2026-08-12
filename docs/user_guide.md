# 📖 User Guide & Technical Documentation

> **Complete Operational Guide for Users, Developers & Community Members**

---

## 🚀 Getting Started

### 1. Connecting Your Wallet
1. Open [Skill Endorsement Network Live App](https://skill-endorsement-network.netlify.app/).
2. Click **Connect Wallet** in the top right header.
3. Select your preferred Stellar wallet provider:
   - **Freighter Wallet** (Recommended)
   - **Albedo**
   - **Hana Wallet**
   - **xBull Wallet**
4. Confirm wallet connection popup.

---

## 👤 User Profile & Skill Registration

### Registering Your On-Chain Identity
1. Navigate to the **Profile** dashboard.
2. Enter your display name and optional bio/avatar.
3. Click **Register Profile** to submit the `register_profile` transaction to Soroban.
4. Once confirmed, your base reputation score starts at **100 Points**.

### Adding Skill Records
1. Under **Skills Section**, click **Add Skill**.
2. Enter the skill name (e.g. `Soroban`, `Rust`, `Next.js`, `UI/UX`).
3. Select the primary category and submit transaction.

---

## 🤝 Endorsing Skills (Sybil-Resistant)

### How Reputation-Weighted Endorsements Work
- When you endorse another user's skill, the `endorsement_engine` smart contract queries your live reputation score from `profile_registry`.
- **Weight Calculation**: `Weight = max(Endorser Reputation / 10, 1)`.
- **Guards Enforced**:
  - ❌ You cannot endorse yourself (Self-endorsement rejected).
  - ❌ You cannot endorse the same skill twice for the same user.
  - ✅ Both parties must hold active on-chain profiles.

---

## 🛠️ Developer & API Reference

### Interacting via TypeScript SDK Service

```typescript
import { ProfileService, EndorsementService } from '@/services';

// Fetch profile data
const profile = await ProfileService.getProfile(userAddress);

// Submit endorsement transaction
const txHash = await EndorsementService.endorseSkill({
  endorser: userAddress,
  endorsee: targetAddress,
  skillName: 'Soroban',
  message: 'Excellent smart contract engineer!'
});
```

---

## 🌐 Community & Support

- **Twitter / X Announcement**: [View Official Launch Post on X](https://x.com/StellarSkills/status/1825000000000000000)
- **GitHub Repository**: [ashishh-tech/Stellar-Skill-Endorsement-Network](https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network)
- **Community Contribution**: [Join Discussion & Core Contribution](https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network/discussions)
