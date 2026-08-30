# 🤝 Contributing to Skill Endorsement Network

Thank you for your interest in contributing to the **Skill Endorsement Network** on Stellar Soroban! We welcome contributions from developers, designers, security auditors, and community members across the global Web3 ecosystem.

---

## 🧭 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please be respectful, constructive, and collaborative in all issues, pull requests, and discussions.

---

## 🛠️ Development Setup & Workflow

### Prerequisites
- **Node.js**: v18.17.0+ or v20+
- **Rust & Cargo**: v1.78.0+
- **Soroban CLI / Stellar CLI**: `@stellar/cli` v22+
- **Target**: `wasm32-unknown-unknown` target for Rust:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```

### Local Setup
```bash
# 1. Clone the repository
git clone https://github.com/ashishh-tech/Stellar-Skill-Endorsement-Network.git
cd Stellar-Skill-Endorsement-Network

# 2. Install Node dependencies
npm install

# 3. Build & Test Smart Contracts
cargo test --workspace
cargo build --workspace --target wasm32-unknown-unknown --release

# 4. Run Frontend Unit Tests
npm test

# 5. Start Next.js Development Server
npm run dev
```

---

## 🧪 Testing Guidelines

Before opening a pull request, ensure all tests pass:

```bash
# Run Rust smart contract tests (20 tests)
cargo test

# Run frontend Vitest suite (12 tests)
npm test

# Run TypeScript typecheck
npx tsc --noEmit
```

---

## 📜 Commit Message Conventions

We follow Conventional Commits standard:
- `feat(...)`: A new feature
- `fix(...)`: A bug fix
- `docs(...)`: Documentation changes
- `test(...)`: Adding or refactoring tests
- `refactor(...)`: Code changes that neither fix bugs nor add features
- `chore(...)`: Maintenance tasks, dependencies, lockfiles

---

## 🚀 Pull Request Checklist

- [ ] Fork the repository and create a feature branch (`git checkout -b feature/amazing-feature`)
- [ ] Ensure all Rust unit tests pass (`cargo test`)
- [ ] Ensure all TypeScript and frontend tests pass (`npm test`)
- [ ] Ensure code compiles cleanly with no unhandled warnings
- [ ] Update documentation and user guide if modifying contract interfaces or UI flows
- [ ] Submit pull request with descriptive title and summary of changes.
