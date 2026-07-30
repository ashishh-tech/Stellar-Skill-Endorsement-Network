import * as StellarSdk from '@stellar/stellar-sdk';
import { STELLAR_CONFIG, TX_TIMEOUT } from '@/config/stellar';
import { signTransaction } from './wallet';

export const rpc = new StellarSdk.rpc.Server(STELLAR_CONFIG.rpcUrl);

export interface InvokeContractOptions {
  contractId: string;
  method: string;
  args?: StellarSdk.xdr.ScVal[];
  caller: string;
}

/**
 * Build, simulate, sign, and submit a Soroban contract invocation using @stellar/stellar-sdk
 */
export async function invokeContract({
  contractId,
  method,
  args = [],
  caller,
}: InvokeContractOptions): Promise<string> {
  // 1. Load source account
  const account = await rpc.getAccount(caller);

  // 2. Build transaction using StellarSdk.Contract and TransactionBuilder
  const contract = new StellarSdk.Contract(contractId);
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(TX_TIMEOUT)
    .build();

  // 3. Simulate transaction
  const simResponse = await rpc.simulateTransaction(tx);
  if (StellarSdk.rpc.Api.isSimulationError(simResponse)) {
    const errorMessage = 'error' in simResponse ? String(simResponse.error) : 'Simulation failed';
    throw new Error(`Simulation failed: ${errorMessage}`);
  }

  // 4. Assemble transaction
  const assembledTx = StellarSdk.rpc.assembleTransaction(tx, simResponse).build();

  // 5. Sign transaction
  const signedXdr = await signTransaction(assembledTx.toXDR());
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    STELLAR_CONFIG.networkPassphrase
  );

  // 6. Submit transaction
  const sendResponse = await rpc.sendTransaction(signedTx);
  if (sendResponse.status === 'ERROR') {
    throw new Error(`Submission failed: ${sendResponse.errorResult?.toString() || 'Unknown error'}`);
  }

  // 7. Poll confirmation
  const txHash = sendResponse.hash;
  let getResponse = await rpc.getTransaction(txHash);
  const startTime = Date.now();

  while (getResponse.status === 'NOT_FOUND') {
    if (Date.now() - startTime > TX_TIMEOUT * 1000) {
      throw new Error('Transaction confirmation timeout');
    }
    await new Promise((r) => setTimeout(r, 2000));
    getResponse = await rpc.getTransaction(txHash);
  }

  if (getResponse.status === 'SUCCESS') {
    return txHash;
  } else {
    throw new Error(`Transaction failed with status: ${getResponse.status}`);
  }
}

/**
 * ScVal argument constructors for Soroban calls
 */
export const scVal = {
  address: (addr: string) => StellarSdk.Address.fromString(addr).toScVal(),
  string: (str: string) => StellarSdk.xdr.ScVal.scvString(str),
  u32: (n: number) => StellarSdk.xdr.ScVal.scvU32(n),
  bool: (b: boolean) => StellarSdk.xdr.ScVal.scvBool(b),
  bytes32: (hex: string) => {
    const bytes = Buffer.from(hex, 'hex');
    return StellarSdk.xdr.ScVal.scvBytes(bytes);
  },
};

/**
 * Read-only contract query using StellarSdk.Contract and simulateTransaction
 */
export async function queryContract({
  contractId,
  method,
  args = [],
}: {
  contractId: string;
  method: string;
  args?: StellarSdk.xdr.ScVal[];
}): Promise<StellarSdk.xdr.ScVal | null> {
  try {
    const account = new StellarSdk.Account(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
      '0'
    );

    const contract = new StellarSdk.Contract(contractId);
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    const simResponse = await rpc.simulateTransaction(tx);

    if (StellarSdk.rpc.Api.isSimulationError(simResponse)) {
      return null;
    }

    if (StellarSdk.rpc.Api.isSimulationSuccess(simResponse) && simResponse.result) {
      return simResponse.result.retval;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get events emitted by a contract
 */
export async function getContractEvents(
  contractId: string,
  startLedger?: number
): Promise<StellarSdk.rpc.Api.EventResponse[]> {
  try {
    const latestLedger = await rpc.getLatestLedger();
    const start = startLedger || Math.max(latestLedger.sequence - 1000, 1);

    const response = await rpc.getEvents({
      startLedger: start,
      filters: [
        {
          type: 'contract',
          contractIds: [contractId],
        },
      ],
      limit: 50,
    });

    return response.events || [];
  } catch {
    return [];
  }
}
