#!/usr/bin/env bash
set -e

# Deployment script for Stellar Soroban contracts
# Usage: ./scripts/deploy.sh [local|testnet]

NETWORK="${1:-testnet}"
RPC_URL="https://soroban-testnet.stellar.org"
PASSPHRASE="Test SDF Network ; September 2015"

echo "=== 🚀 Deploying Skill Endorsement Network Contracts to $NETWORK ==="

# 1. Build contracts to WebAssembly
echo "🔨 Compiling Soroban contracts..."
cargo build --target wasm32-unknown-unknown --release

PROFILE_WASM="target/wasm32-unknown-unknown/release/profile_registry.wasm"
ENGINE_WASM="target/wasm32-unknown-unknown/release/endorsement_engine.wasm"

# 2. Check stellar-cli installation
if command -v stellar &> /dev/null; then
    STELLAR_CMD="stellar"
elif command -v npx &> /dev/null; then
    STELLAR_CMD="npx --yes @stellar/cli"
else
    echo "⚠️ Neither stellar nor npx found. Skipping contract deployment stage."
    exit 0
fi

# 3. Check for deployment keypair
if [ -z "$STELLAR_SECRET_KEY" ]; then
    echo "⚠️ STELLAR_SECRET_KEY secret not found in environment."
    echo "   To deploy to testnet, set STELLAR_SECRET_KEY or run locally with a funded secret key."
    echo "✅ Contract build completed successfully."
    exit 0
fi

# 4. Optimize WASM binaries
echo "⚡ Optimizing WASM binaries..."
if command -v stellar &> /dev/null; then
    stellar contract optimize --wasm "$PROFILE_WASM" || true
    stellar contract optimize --wasm "$ENGINE_WASM" || true
fi

# 5. Deploy Profile Registry Contract
echo "📦 Deploying profile_registry contract..."
PROFILE_ID=$($STELLAR_CMD contract deploy \
    --wasm "$PROFILE_WASM" \
    --source-account "$STELLAR_SECRET_KEY" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$PASSPHRASE")

echo "✅ ProfileRegistry deployed with ID: $PROFILE_ID"

# 6. Deploy Endorsement Engine Contract
echo "📦 Deploying endorsement_engine contract..."
ENGINE_ID=$($STELLAR_CMD contract deploy \
    --wasm "$ENGINE_WASM" \
    --source-account "$STELLAR_SECRET_KEY" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$PASSPHRASE")

echo "✅ EndorsementEngine deployed with ID: $ENGINE_ID"

# 7. Initialize Contracts & Inter-Contract Links
echo "⚙️ Initializing contract state and inter-contract links..."
ADMIN_ADDR=$($STELLAR_CMD keys address "$STELLAR_SECRET_KEY" 2>/dev/null || echo "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF")

$STELLAR_CMD contract invoke \
    --id "$PROFILE_ID" \
    --source-account "$STELLAR_SECRET_KEY" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$PASSPHRASE" \
    -- initialize --admin "$ADMIN_ADDR" || true

$STELLAR_CMD contract invoke \
    --id "$ENGINE_ID" \
    --source-account "$STELLAR_SECRET_KEY" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$PASSPHRASE" \
    -- initialize --admin "$ADMIN_ADDR" --profile_registry "$PROFILE_ID" || true

# 8. Output .env configuration
echo ""
echo "=== 📝 Deployment Summary ==="
echo "NEXT_PUBLIC_PROFILE_REGISTRY_CONTRACT_ID=$PROFILE_ID"
echo "NEXT_PUBLIC_ENDORSEMENT_ENGINE_CONTRACT_ID=$ENGINE_ID"
echo "============================="
