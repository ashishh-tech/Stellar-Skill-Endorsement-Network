import { create } from 'zustand';

export type TxStatus =
  | 'pending'
  | 'simulating'
  | 'signing'
  | 'submitting'
  | 'processing'
  | 'confirmed'
  | 'failed';

export interface Transaction {
  id: string;
  method: string;
  contractId: string;
  status: TxStatus;
  hash?: string;
  error?: string;
  timestamp: number;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  clearTransactions: () => void;
  getRecentTransactions: (count?: number) => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions].slice(0, 100), // Keep last 100
    })),

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    })),

  clearTransactions: () => set({ transactions: [] }),

  getRecentTransactions: (count = 10) => {
    return get().transactions.slice(0, count);
  },
}));

export function getTxStatusLabel(status: TxStatus): string {
  const labels: Record<TxStatus, string> = {
    pending: 'Preparing',
    simulating: 'Simulating',
    signing: 'Awaiting Signature',
    submitting: 'Submitting',
    processing: 'Confirming',
    confirmed: 'Confirmed',
    failed: 'Failed',
  };
  return labels[status];
}

export function getTxStatusColor(status: TxStatus): string {
  const colors: Record<TxStatus, string> = {
    pending: 'text-amber-400',
    simulating: 'text-stellar-400',
    signing: 'text-purple-400',
    submitting: 'text-blue-400',
    processing: 'text-stellar-400 animate-pulse',
    confirmed: 'text-emerald-400',
    failed: 'text-rose-400',
  };
  return colors[status];
}
