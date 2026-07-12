'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface DelegationEventView {
  type: string;
  delegationId?: string;
  hashLock?: string;
  ts?: number;
  payload?: Record<string, unknown>;
  raw?: string;
  /** 事件來源：client / test / server 等（經 SSE 即時幀帶出，供區分本端/外部） */
  source?: string;
  /** 由本端經雙向同步回寫、再經 SSE 迴路返回的事件（閉環標記） */
  self?: boolean;
}

interface DelegationEventStreamProps {
  delegationId: string;
  /** 最多保留的顯示筆數 */
  maxEvents?: number;
  className?: string;
}

type ConnState = 'connecting' | 'open' | 'closed' | 'error';

const RESUME_KEY = (id: string) => `delegation-stream:${id}:lastId`;

/**
 * 委派事件即時串流面板（對齊 RWD / 全端 / 雙向同步 / 全量）
 * - 經 EventSource 訂閱 GET /api/delegation/events/stream，server→client 即時推送。
 * - 斷點續傳：將最後收到的 SSE id 存於 localStorage，重載時以 ?sinceId= 續傳（全量不漏）。
 * - 雙向同步：提供回寫輸入框，經 POST /api/delegation/events 寫回同一 omni-agent-bus，
 *   事件會經 SSE 迴路回到本面板，形成 client↔server 雙向閉環。
 */
export const DelegationEventStream: React.FC<DelegationEventStreamProps> = ({
  delegationId,
  maxEvents = 200,
  className = '',
}) => {
  const [events, setEvents] = useState<DelegationEventView[]>([]);
  const [conn, setConn] = useState<ConnState>('connecting');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!delegationId) return;
    setConn('connecting');
    setEvents([]);

    // 斷點續傳：讀取上次游標（全新連線 EventSource 不會自動帶 Last-Event-ID）
    const sinceId =
      typeof window !== 'undefined' ? localStorage.getItem(RESUME_KEY(delegationId)) : null;
    const url =
      `/api/delegation/events/stream?delegationId=${encodeURIComponent(delegationId)}` +
      (sinceId ? `&sinceId=${encodeURIComponent(sinceId)}` : '');

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => setConn('open');
    es.onmessage = (e: MessageEvent) => {
      // 記錄最後游標，供重載續傳
      if (e.lastEventId && typeof window !== 'undefined') {
        localStorage.setItem(RESUME_KEY(delegationId), e.lastEventId);
      }
      try {
        const data = JSON.parse(e.data) as DelegationEventView;
        // 雙向同步閉環標記：本端經 POST 回寫的事件，其來源為 'client'，
        // 經 SSE 迴路返回時由 source 欄位識別（取代脆弱的 note 文字比對）
        const isSelf = data.source === 'client';
        setEvents((prev) =>
          [{ ...data, self: isSelf }, ...prev].slice(0, maxEvents)
        );
      } catch {
        setEvents((prev) =>
          [{ type: 'raw', raw: e.data } as DelegationEventView, ...prev].slice(0, maxEvents)
        );
      }
    };
    // EventSource 在連線中斷時會自動重連（雙向同步韌性，原生亦帶 Last-Event-ID）
    es.onerror = () => setConn('error');

    return () => {
      es.close();
      esRef.current = null;
      setConn('closed');
    };
  }, [delegationId, maxEvents]);

  const handleSend = async () => {
    const text = note.trim();
    if (!text || sending) return;
    setSending(true);
    setSendStatus(null);
    try {
      const res = await fetch('/api/delegation/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delegationId,
          type: 'delegation.client.sync',
          payload: { note: text, clientTs: Date.now() },
        }),
      });
      const json = (await res.json()) as { success?: boolean; hashLock?: string; error?: string };
      if (res.ok && json.success) {
        setSendStatus(`✓ 已回寫並經 SSE 迴路返回 (🔒 ${String(json.hashLock).substring(0, 10)}…)`);
        setNote('');
      } else {
        setSendStatus(`✗ 回寫失敗：${json.error ?? res.status}`);
      }
    } catch (err) {
      setSendStatus(`✗ 回寫異常：${err instanceof Error ? err.message : 'network'}`);
    } finally {
      setSending(false);
    }
  };

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

      {/* 雙向同步回寫：client → bus → SSE 閉環 */}
      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-3">
        <label className="text-xs text-gray-400">
          雙向同步回寫（client → bus → 經 SSE 返回）
        </label>
        <div className="flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSend();
            }}
            placeholder="輸入同步訊號，例如：確認收悉"
            className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={sending || !note.trim()}
            className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-purple-400"
          >
            {sending ? '傳送中…' : '傳送'}
          </button>
        </div>
        {sendStatus && <div className="text-xs text-teal-300 font-mono">{sendStatus}</div>}
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
                  {ev.self && (
                    <span className="ml-2 rounded bg-amber-500/20 px-1 text-[10px] text-amber-300">
                      本端傳送
                    </span>
                  )}
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
