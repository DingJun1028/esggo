'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * OmniAgent Stream Hook
 * ─────────────────────
 * React hook that subscribes to the OmniAgentBus SSE stream.
 * Provides real-time event feed, connection status, and mission tracking.
 *
 * 5T Protocol: T5 Trackable — lifecycle-aware frontend propagation.
 */

export interface StreamEvent {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface MissionProgress {
  mission: string;
  status: 'running' | 'complete' | 'error';
  startedAt: string;
  completedAt?: string;
  totalProcessed?: number;
  error?: string;
}

export interface UseOmniAgentStreamResult {
  events: StreamEvent[];
  isConnected: boolean;
  connectionError: string | null;
  activeMissions: MissionProgress[];
  lastSeal: StreamEvent | null;
  agentActivity: Map<string, StreamEvent>;
  reconnect: () => void;
  clearEvents: () => void;
}

const MAX_EVENTS = 100;

export function useOmniAgentStream(): UseOmniAgentStreamResult {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [activeMissions, setActiveMissions] = useState<MissionProgress[]>([]);
  const [lastSeal, setLastSeal] = useState<StreamEvent | null>(null);
  const [agentActivity, setAgentActivity] = useState<Map<string, StreamEvent>>(new Map());

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectFunctionRef = useRef<(() => void) | null>(null); // NEW: Ref to hold the connect function

  const processEvent = useCallback((evt: StreamEvent) => {
    setEvents(prev => [evt, ...prev].slice(0, MAX_EVENTS));

    switch (evt.event) {
      case 'MISSION_START':
        setActiveMissions(prev => [
          ...prev.filter(m => m.mission !== String(evt.payload.mission)),
          {
            mission: String(evt.payload.mission),
            status: 'running',
            startedAt: evt.timestamp,
          },
        ]);
        break;

      case 'MISSION_COMPLETE':
        setActiveMissions(prev =>
          prev.map(m =>
            m.mission === String(evt.payload.mission)
              ? {
                  ...m,
                  status: 'complete' as const,
                  completedAt: evt.timestamp,
                  totalProcessed: Number(evt.payload.totalSealed || evt.payload.totalMigrated || evt.payload.totalSynced || evt.payload.totalProcessed || 0),
                }
              : m
          )
        );
        break;

      case 'AGENT_ERROR':
        setActiveMissions(prev =>
          prev.map(m =>
            m.status === 'running'
              ? { ...m, status: 'error' as const, error: String(evt.payload.error) }
              : m
          )
        );
        break;

      case '5T_SEAL':
        setLastSeal(evt);
        break;

      case 'AGENT_TASK':
        setAgentActivity(prev => {
          const next = new Map(prev);
          next.set(String(evt.payload.agent), evt);
          return next;
        });
        break;
    }
  }, []); // <--- Dependency array is empty, uses state setters

  const connect = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const es = new EventSource('/api/omni-agent-api/stream');
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
      };

      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as StreamEvent;
          processEvent(data);
        } catch {
          // Skip malformed messages
        }
      };

      // Listen to specific event types
      const eventTypes = [
        'MISSION_START', 'MISSION_COMPLETE', 'AGENT_TASK',
        'AGENT_ERROR', 'COMMAND_ISSUED', '5T_SEAL',
        'SCHEDULE_TRIGGERED', 'SCHEDULE_COMPLETE', 'SCHEDULE_ERROR',
      ];

      for (const type of eventTypes) {
        es.addEventListener(type, (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data) as StreamEvent;
            processEvent(data);
          } catch {
            // Skip malformed messages
          }
        });
      }

      es.onerror = () => {
        setIsConnected(false);
        setConnectionError('Connection lost. Reconnecting...');
        es.close();

        // Auto-reconnect with backoff
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        // NEW: Call the function via connectFunctionRef.current
        reconnectTimeoutRef.current = setTimeout(() => connectFunctionRef.current?.(), 5000);
      };
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
    }
  }, [processEvent]); // <--- Dependency array now has processEvent

  // NEW: Update the ref whenever the connect function instance changes
  useEffect(() => {
    connectFunctionRef.current = connect;
  }, [connect]);

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    connect();
  }, [connect]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setActiveMissions([]);
    setLastSeal(null);
    setAgentActivity(new Map());
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => connect(), 0); // Call connect asynchronously
    return () => {
      clearTimeout(timeoutId); // Clear the timeout if component unmounts
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  return {
    events,
    isConnected,
    connectionError,
    activeMissions,
    lastSeal,
    agentActivity,
    reconnect,
    clearEvents,
  };
}
