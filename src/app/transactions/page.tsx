'use client';

import React from 'react';
import {
  useTransactionStore,
  getTxStatusLabel,
  getTxStatusColor,
  type Transaction,
} from '@/features/transactions/store';
import { ArrowLeftRight, ExternalLink, CheckCircle2, XCircle, Clock, Loader2, Trash2 } from 'lucide-react';
import { getExplorerTxUrl, truncateAddress } from '@/config/stellar';

export default function TransactionsPage() {
  const { transactions, clearTransactions } = useTransactionStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-stellar-400" />
            Transaction Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Production transaction lifecycle monitoring, signing state, and Stellar Expert verification
          </p>
        </div>

        {transactions.length > 0 && (
          <button
            onClick={() => clearTransactions()}
            className="btn-ghost flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-300 mb-1">No Transactions Recorded</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Execute a contract call from the Dashboard to monitor simulation, wallet signing, and ledger confirmation in real-time.
            </p>
          </div>
        ) : (
          transactions.map((tx) => (
            <TransactionCard key={tx.id} tx={tx} />
          ))
        )}
      </div>
    </div>
  );
}

function TransactionCard({ tx }: { tx: Transaction }) {
  const statusColor = getTxStatusColor(tx.status);
  const isPending = ['pending', 'simulating', 'signing', 'submitting', 'processing'].includes(tx.status);

  return (
    <div className="glass-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <StatusIcon status={tx.status} />
          <div>
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-white capitalize">{tx.method.replace('_', ' ')}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/[0.08] ${statusColor}`}>
                {getTxStatusLabel(tx.status)}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-1">
              Target Contract: {truncateAddress(tx.contractId, 8)}
            </p>
            {tx.error && (
              <p className="text-xs text-rose-400 mt-2 font-mono bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                {tx.error}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0">
          <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
          {tx.hash && (
            <a
              href={getExplorerTxUrl(tx.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-xs hover:border-stellar-500/30"
            >
              <span>View Tx</span>
              <ExternalLink className="w-3 h-3 text-stellar-400" />
            </a>
          )}
        </div>
      </div>

      {/* Lifecycle Progress Bar */}
      {isPending && (
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <div className="w-full bg-surface-1 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-stellar-500 to-accent-orange h-full transition-all duration-500 animate-pulse"
              style={{
                width:
                  tx.status === 'pending'
                    ? '20%'
                    : tx.status === 'simulating'
                    ? '40%'
                    : tx.status === 'signing'
                    ? '60%'
                    : tx.status === 'submitting'
                    ? '80%'
                    : '95%',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: Transaction['status'] }) {
  switch (status) {
    case 'confirmed':
      return <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />;
    case 'failed':
      return <XCircle className="w-6 h-6 text-rose-400 shrink-0" />;
    default:
      return <Loader2 className="w-6 h-6 text-stellar-400 animate-spin shrink-0" />;
  }
}
