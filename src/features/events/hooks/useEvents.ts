'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getContractEvents } from '@/features/contracts/client';
import { STELLAR_CONFIG } from '@/config/stellar';

export interface ContractEvent {
  id: string;
  type: string;
  topic: string[];
  value: string;
  ledger: number;
  timestamp: number;
  contractId: string;
}

const POLL_INTERVAL = 6000; // 6 seconds (roughly one Stellar ledger)

export function useContractEvents(contractIds?: string[]) {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [lastLedger, setLastLedger] = useState<number | undefined>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const ids = contractIds || [
    STELLAR_CONFIG.contracts.profileRegistry,
    STELLAR_CONFIG.contracts.endorsementEngine,
  ].filter(Boolean);

  const fetchEvents = useCallback(async () => {
    if (ids.length === 0) return;

    try {
      const allEvents: ContractEvent[] = [];

      for (const contractId of ids) {
        const rawEvents = await getContractEvents(contractId, lastLedger);

        for (const event of rawEvents) {
          const parsed: ContractEvent = {
            id: event.id || `${event.ledger}-${Math.random()}`,
            type: event.type || 'contract',
            topic: event.topic?.map((t) => {
              try {
                return t.value()?.toString() || '';
              } catch {
                return '';
              }
            }) || [],
            value: (() => {
              try {
                return event.value?.value()?.toString() || '';
              } catch {
                return '';
              }
            })(),
            ledger: event.ledger || 0,
            timestamp: Date.now(),
            contractId,
          };
          allEvents.push(parsed);
        }

        if (rawEvents.length > 0) {
          const maxLedger = Math.max(...rawEvents.map((e) => e.ledger || 0));
          if (maxLedger > 0) {
            setLastLedger(maxLedger + 1);
          }
        }
      }

      if (allEvents.length > 0) {
        setEvents((prev) => {
          const newEvents = [...allEvents, ...prev].slice(0, 200);
          // Deduplicate by id
          const seen = new Set<string>();
          return newEvents.filter((e) => {
            if (seen.has(e.id)) return false;
            seen.add(e.id);
            return true;
          });
        });
      }
    } catch (err) {
      console.error('Event polling error:', err);
    }
  }, [ids, lastLedger]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    setIsPolling(true);
    fetchEvents(); // Initial fetch
    intervalRef.current = setInterval(fetchEvents, POLL_INTERVAL);
  }, [fetchEvents]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return {
    events,
    isPolling,
    startPolling,
    stopPolling,
    refresh: fetchEvents,
  };
}

export function getEventLabel(topic: string[]): string {
  if (topic.includes('register')) return '📝 Profile Registered';
  if (topic.includes('endorse')) return '🤝 Skill Endorsed';
  if (topic.includes('add') && topic.includes('skill')) return '🎯 Skill Added';
  if (topic.includes('update')) return '✏️ Profile Updated';
  if (topic.includes('set') && topic.includes('role')) return '🔐 Role Changed';
  if (topic.includes('admin')) return '👑 Admin Transfer';
  if (topic.includes('init')) return '🚀 Contract Initialized';
  if (topic.includes('upgrade')) return '⬆️ Contract Upgraded';
  return '📋 Contract Event';
}
