import * as StellarSdk from '@stellar/stellar-sdk';
import { STELLAR_CONFIG, TX_TIMEOUT } from '@/config/stellar';
import { signTransaction } from '@/features/wallet/service';
import { useTransactionStore, TxStatus } from '@/features/transactions/store';

const rpc = new StellarSdk.rpc.Server(STELLAR_CONFIG.rpcUrl);

/**
 * Build, simulate, sign, and submit a Soroban contract invocation.
 * Returns the transaction hash upon success.
 */
export async function invokeContract({
  contractId,
  method,
  args = [],
  caller,
}: {
  contractId: string;
  method: string;
  args?: StellarSdk.xdr.ScVal[];
  caller: string;
}): Promise<string> {
  const txStore = useTransactionStore.getState();
  const txId = `${method}-${Date.now()}`;

  txStore.addTransaction({
    id: txId,
    method,
    contractId,
    status: 'pending' as TxStatus,
    timestamp: Date.now(),
  });

  try {
    // 1. Load source account
    const account = await rpc.getAccount(caller);

    // 2. Build the transaction
    if (!contractId || !StellarSdk.StrKey.isValidContract(contractId)) {
      throw new Error('Contract ID is missing or invalid. Please configure NEXT_PUBLIC_PROFILE_REGISTRY_CONTRACT_ID and NEXT_PUBLIC_ENDORSEMENT_ENGINE_CONTRACT_ID.');
    }
    const contract = new StellarSdk.Contract(contractId);
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '100000', // 0.01 XLM max fee
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(TX_TIMEOUT)
      .build();

    // 3. Simulate the transaction
    txStore.updateTransaction(txId, { status: 'simulating' as TxStatus });
    const simResponse = await rpc.simulateTransaction(tx);

    if (StellarSdk.rpc.Api.isSimulationError(simResponse)) {
      const errorMessage = 'error' in simResponse ? String(simResponse.error) : 'Simulation failed';
      throw new Error(`Simulation failed: ${errorMessage}`);
    }

    // 4. Assemble the transaction with simulation results
    const assembledTx = StellarSdk.rpc.assembleTransaction(tx, simResponse).build();

    // 5. Sign with wallet
    txStore.updateTransaction(txId, { status: 'signing' as TxStatus });
    const signedXdr = await signTransaction(assembledTx.toXDR());
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      STELLAR_CONFIG.networkPassphrase
    );

    // 6. Submit the transaction
    txStore.updateTransaction(txId, { status: 'submitting' as TxStatus });
    const sendResponse = await rpc.sendTransaction(signedTx);

    if (sendResponse.status === 'ERROR') {
      throw new Error(`Submission failed: ${sendResponse.errorResult?.toString() || 'Unknown error'}`);
    }

    // 7. Poll for confirmation
    txStore.updateTransaction(txId, {
      status: 'processing' as TxStatus,
      hash: sendResponse.hash,
    });

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
      txStore.updateTransaction(txId, {
        status: 'confirmed' as TxStatus,
        hash: txHash,
      });
      return txHash;
    } else {
      throw new Error(`Transaction failed with status: ${getResponse.status}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    txStore.updateTransaction(txId, {
      status: 'failed' as TxStatus,
      error: message,
    });
    throw error;
  }
}

/**
 * Build ScVal types for contract arguments
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
 * Query a contract (read-only, no signing needed)
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
    if (!contractId || !StellarSdk.StrKey.isValidContract(contractId)) {
      return null;
    }
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
 * Poll for contract events
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
