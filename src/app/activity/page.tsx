'use client';

import React, { useState } from 'react';
import { useDemoStore } from '@/features/demo/useDemoStore';
import { useContractEvents } from '@/features/events/hooks/useEvents';
import {
  Activity,
  Filter,
  RefreshCw,
  ExternalLink,
  Zap,
  Award,
  User,
  Star,
  Search,
  CheckCircle2,
  Code2,
  X,
  Radio,
  Sliders,
} from 'lucide-react';
import { getExplorerContractUrl, getExplorerTxUrl, truncateAddress } from '@/config/stellar';

export default function ActivityPage() {
  const { events: liveEvents, isPolling, refresh } = useContractEvents();
  const { events: demoEvents, isDemoMode } = useDemoStore();

  const [filter, setFilter] = useState<'all' | 'endorse' | 'profile' | 'skill'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Combine demo and live events
  const combinedEvents = isDemoMode ? demoEvents : liveEvents;

  const filteredEvents = combinedEvents.filter((e: any) => {
    const topicStr = Array.isArray(e.topic) ? e.topic.join(' ').toLowerCase() : (e.type || '').toLowerCase();
    const titleStr = (e.title || e.description || '').toLowerCase();
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'endorse'
        ? topicStr.includes('endorse')
        : filter === 'profile'
        ? topicStr.includes('profile') || topicStr.includes('register')
        : filter === 'skill'
        ? topicStr.includes('skill')
        : true;

    const matchesSearch =
      searchQuery === '' ||
      titleStr.includes(searchQuery.toLowerCase()) ||
      (e.actor && e.actor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.skill && e.skill.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header with Live RPC Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-stellar-400" />
            Live Activity Feed &amp; Soroban Stream
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time event stream decoded directly from the Stellar Testnet ledger RPC
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>RPC Stream: Active</span>
          </div>

          <button
            onClick={() => refresh()}
            className="btn-secondary p-2.5 rounded-xl hover:bg-surface-4"
            title="Poll fresh ledger events"
          >
            <RefreshCw className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar & Search Box */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-gray-500 shrink-0 mr-1" />
          <FilterTab active={filter === 'all'} onClick={() => setFilter('all')} label="All Events" count={combinedEvents.length} />
          <FilterTab active={filter === 'endorse'} onClick={() => setFilter('endorse')} label="Endorsements" />
          <FilterTab active={filter === 'profile'} onClick={() => setFilter('profile')} label="Profiles" />
          <FilterTab active={filter === 'skill'} onClick={() => setFilter('skill')} label="Skills" />
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, accounts, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {/* 3. Streaming Events Feed List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="glass-card p-16 text-center space-y-3">
            <Activity className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-lg font-bold text-gray-300">No Matching Events Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No transactions match your current search or filter query.
            </p>
          </div>
        ) : (
          filteredEvents.map((event: any, index: number) => {
            const isEndorse = (event.type || '').includes('endorse') || (event.topic || []).some((t: string) => t.includes('endorse'));
            const isSkill = (event.type || '').includes('skill') || (event.topic || []).some((t: string) => t.includes('skill'));
            const isProfile = (event.type || '').includes('profile') || (event.topic || []).some((t: string) => t.includes('profile') || t.includes('register'));

            return (
              <div
                key={event.id || index}
                onClick={() => setSelectedEvent(event)}
                className="glass-card-hover p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Event Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isEndorse
                        ? 'bg-accent-orange/15 border-accent-orange/30 text-accent-orange'
                        : isSkill
                        ? 'bg-accent-emerald/15 border-accent-emerald/30 text-accent-emerald'
                        : 'bg-stellar-500/15 border-stellar-500/30 text-stellar-300'
                    }`}
                  >
                    {isEndorse ? (
                      <Award className="w-5 h-5" />
                    ) : isSkill ? (
                      <Star className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white group-hover:text-stellar-300 transition-colors">
                        {event.title || 'Soroban Contract Event'}
                      </span>
                      <span className="badge badge-stellar text-[10px]">
                        Ledger #{event.ledger || 582492}
                      </span>
                      {event.weight && (
                        <span className="badge badge-warning text-[10px]">
                          +{event.weight} Weight
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      {event.description || event.value || 'Decoded event payload logged to ledger'}
                    </p>
                  </div>
                </div>

                {/* Right: Timestamp & Action */}
                <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0 self-end sm:self-auto font-mono">
                  <span>{new Date(event.timestamp || Date.now()).toLocaleTimeString()}</span>
                  <button className="btn-secondary py-1 px-2.5 text-[11px] group-hover:border-stellar-500/40">
                    Inspect Payload →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Event Inspection Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-surface-1 border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden glass-panel flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-surface-2/60">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-stellar-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Soroban RPC Event Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-xl bg-surface-3 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-gray-500">Event Title:</span>
                  <span className="text-white font-bold">{selectedEvent.title || 'Contract Event'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-gray-500">Ledger Sequence:</span>
                  <span className="text-stellar-300 font-bold">#{selectedEvent.ledger}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-gray-500">Contract ID:</span>
                  <span className="text-gray-300">{truncateAddress(selectedEvent.contractId || '', 10)}</span>
                </div>
                {selectedEvent.txHash && (
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-gray-500">Transaction:</span>
                    <a
                      href={getExplorerTxUrl(selectedEvent.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-orange hover:underline flex items-center gap-1"
                    >
                      <span>{selectedEvent.txHash.slice(0, 10)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Decoded Payload Block */}
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Decoded Event Payload (JSON)
                </div>
                <pre className="p-4 rounded-xl bg-surface-0 border border-white/[0.06] text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
                  {JSON.stringify(selectedEvent.payload || selectedEvent, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
        active
          ? 'bg-stellar-500/20 text-stellar-300 border-stellar-500/40'
          : 'bg-surface-2 text-gray-400 border-white/[0.04] hover:text-white'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-stellar-500/30 text-stellar-200 font-bold">
          {count}
        </span>
      )}
    </button>
  );
}
