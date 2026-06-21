// lib/omni-hub/useRealtime.ts
// React Hook — 訂閱萬能中心即時事件

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

export interface RealtimeStatus {
  connected: boolean;
  lastEvent: string | null;
  lastEventAt: number | null;
  subscriberCount: number;
}

export function useRealtime(
  onEvent?: (event: { type: string; payload: unknown }) => void
): RealtimeStatus {
  const [status, setStatus] = useState<RealtimeStatus>({
    connected: false,
    lastEvent: null,
    lastEventAt: null,
    subscriberCount: 0,
  });
  const esRef = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (esRef.current?.readyState === EventSource.OPEN) return;

    const es = new EventSource('/api/hub/stream');
    esRef.current = es;

    es.addEventListener('connected', (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data);
        setStatus((s) => ({ ...s, connected: true, subscriberCount: data.subscribers || 0 }));
      } catch {
        setStatus((s) => ({ ...s, connected: true }));
      }
    });

    const handleRaw = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        const eventType = e.type || 'message';
        setStatus((s) => ({
          ...s,
          lastEvent: eventType,
          lastEventAt: Date.now(),
        }));
        onEventRef.current?.({ type: eventType, payload: data });
      } catch {
        // ignore parse errors
      }
    };

    // 訂閱所有可能的事件類型
    const eventTypes = [
      'facility:status',
      'facility:health',
      'memory:new',
      'memory:updated',
      'task:created',
      'task:status',
      'task:completed',
      'message:broadcast',
      'hub:sync',
    ];
    for (const type of eventTypes) {
      es.addEventListener(type, handleRaw);
    }

    es.onerror = () => {
      setStatus((s) => ({ ...s, connected: false }));
      // EventSource 會自動重連
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);

  return status;
}
