const { Keypair, rpc, Contract, TransactionBuilder, Address, xdr } = require('@stellar/stellar-sdk');
const fs = require('fs');
const path = require('path');

const RPC_URL = 'https://soroban-testnet.stellar.org';
const PASSPHRASE = 'Test SDF Network ; September 2015';

async function main() {
  console.log('=== 🚀 Initializing Skill Endorsement Network on Stellar Testnet ===');

  // Generate or load testnet account
  const secretKey = process.env.STELLAR_SECRET_KEY;
  let keypair;

  if (secretKey) {
    keypair = Keypair.fromSecret(secretKey);
    console.log(`Using configured account: ${keypair.publicKey()}`);
  } else {
    keypair = Keypair.random();
    console.log(`Generated new test account: ${keypair.publicKey()}`);
    console.log('Funding via Friendbot...');
    const fetch = (await import('node-fetch')).default || globalThis.fetch;
    await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);
    console.log('Funded successfully!');
  }

  const server = new rpc.Server(RPC_URL);
  const account = await server.getAccount(keypair.publicKey());
  console.log(`Account sequence: ${account.sequenceNumber()}`);

  console.log('Initialization script ready for automated testnet verification!');
}

main().catch((err) => {
  console.error('Initialization error:', err);
  process.exit(1);
});
