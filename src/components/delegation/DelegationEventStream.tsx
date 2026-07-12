'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface DelegationEventView {
  type: string;
  delegationId?: string;
  hashLock?: string;
  ts?: number;
  payload?: Record<string, unknown>;
  raw?: string;
}

interface DelegationEventStreamProps {
  delegationId: string;
  /** 最多保留的顯示筆數 */
  maxEvents?: number;
  className?: string;
}

type ConnState = 'connecting' | 'open' | 'closed' | 'error';

/**
 * 委派事件即時串流面板（對齊 RWD / 全端 / 雙向同步）
 * 經 EventSource 訂閱 GET /api/delegation/events/stream，響應式呈現即時事件。
 */
export const DelegationEventStream: React.FC<DelegationEventStreamProps> = ({
  delegationId,
  maxEvents = 200,
  className = '',
}) => {
  const [events, setEvents] = useState<DelegationEventView[]>([]);
  const [conn, setConn] = useState<ConnState>('connecting');
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!delegationId) return;
    setConn('connecting');
    setEvents([]);

    const es = new EventSource(
      `/api/delegation/events/stream?delegationId=${encodeURIComponent(delegationId)}`
    );
    esRef.current = es;

    es.onopen = () => setConn('open');
    es.onmessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as DelegationEventView;
        setEvents((prev) => [data, ...prev].slice(0, maxEvents));
      } catch {
        setEvents((prev) =>
          [
            { type: 'raw', raw: e.data } as DelegationEventView,
            ...prev,
          ].slice(0, maxEvents)
        );
      }
    };
    // EventSource 在連線中斷時會自動重連（雙向同步韌性）
    es.onerror = () => setConn('error');

    return () => {
      es.close();
      esRef.current = null;
      setConn('closed');
    };
  }, [delegationId, maxEvents]);

  const connColor =
    conn === 'open'
      ? 'text-green-400'
      : conn === 'error'
      ? 'text-red-400'
      : 'text-yellow-400';

  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/5 backdrop-blur-lg p-4 sm:p-6 flex flex-col gap-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-purple-300">委派事件即時串流</h3>
          <p className="text-xs text-gray-400 font-mono break-all">
            delegationId: {delegationId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-mono ${connColor}`}>
            ●{' '}
            {conn === 'open'
              ? '已連線'
              : conn === 'error'
              ? '重連中'
              : conn === 'closed'
              ? '已關閉'
              : '連線中'}
          </span>
        </div>
      </div>

      <div className="h-80 overflow-y-auto rounded-xl bg-black/30 p-3 font-mono text-sm space-y-2">
        {events.length === 0 ? (
          <div className="text-gray-500">等待事件…</div>
        ) : (
          events.map((ev, i) => (
            <div
              key={`${ev.ts ?? i}-${i}`}
              className="border-b border-white/5 pb-2 last:border-0"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-purple-300 font-semibold break-all">
                  {ev.type}
                </span>
                {ev.hashLock && (
                  <span
                    className="text-teal-300 text-xs"
                    title={`HashLock: ${ev.hashLock}`}
                  >
                    🔒 {ev.hashLock.substring(0, 10)}…
                  </span>
                )}
              </div>
              {ev.ts && (
                <div className="text-gray-500 text-xs">
                  {new Date(ev.ts).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DelegationEventStream;
