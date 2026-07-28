'use client';

import React, { useState } from 'react';
import { useContractEvents, getEventLabel } from '@/features/events/hooks/useEvents';
import { Activity, Filter, RefreshCw, ExternalLink, Zap } from 'lucide-react';
import { getExplorerContractUrl, truncateAddress } from '@/config/stellar';

export default function ActivityPage() {
  const { events, isPolling, refresh } = useContractEvents();
  const [filter, setFilter] = useState<'all' | 'endorse' | 'profile' | 'skill'>('all');

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'endorse') return e.topic.some((t) => t.includes('endorse'));
    if (filter === 'profile') return e.topic.some((t) => t.includes('profile') || t.includes('register'));
    if (filter === 'skill') return e.topic.some((t) => t.includes('skill'));
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-stellar-400" />
            Live Activity Feed
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time event stream from Stellar Soroban RPC ledger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isPolling ? 'RPC Stream Active' : 'Polling Paused'}
          </div>

          <button
            onClick={() => refresh()}
            className="btn-secondary p-2.5 rounded-xl hover:bg-surface-4"
            title="Refresh events"
          >
            <RefreshCw className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/[0.06] pb-3 overflow-x-auto">
        <Filter className="w-4 h-4 text-gray-500 shrink-0 mr-1" />
        <FilterTab active={filter === 'all'} onClick={() => setFilter('all')} label="All Events" />
        <FilterTab active={filter === 'endorse'} onClick={() => setFilter('endorse')} label="Endorsements" />
        <FilterTab active={filter === 'profile'} onClick={() => setFilter('profile')} label="Profiles" />
        <FilterTab active={filter === 'skill'} onClick={() => setFilter('skill')} label="Skills" />
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-300 mb-1">No Events Found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Events stream automatically as transactions execute on Stellar Testnet. Submit a profile or endorsement to see live logs!
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="glass-card-hover p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-stellar-500/10 border border-stellar-500/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Activity className="w-5 h-5 text-stellar-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">
                      {getEventLabel(event.topic)}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      Ledger #{event.ledger}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-1 truncate max-w-md">
                    {event.value || JSON.stringify(event.topic)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs text-gray-500">
                <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                {event.contractId && (
                  <a
                    href={getExplorerContractUrl(event.contractId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-stellar-400 transition-colors font-mono"
                  >
                    <span>{truncateAddress(event.contractId)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FilterTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-stellar-500/20 text-stellar-300 border border-stellar-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
      }`}
    >
      {label}
    </button>
  );
}
