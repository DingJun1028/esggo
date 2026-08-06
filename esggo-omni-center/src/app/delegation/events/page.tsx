'use client';

import React, { useState } from 'react';
import DelegationEventStream from '@/components/delegation/DelegationEventStream';
import DelegationMetricsOverview from '@/components/delegation/DelegationMetricsOverview';

/**
 * ==========================================
 * 委派事件總線 · 即時觀測頁面（對齊 RWD / 全端 / 雙向同步）
 * ==========================================
 *
 * 路徑：/delegation/events?delegationId=xxx
 * 提供委派生命週期事件的響應式即時觀測（EventSource → SSE 端點）。
 */

export default function DelegationEventsPage() {
  // 支援從網址 ?delegationId= 直接帶入（client-only 讀取，避免 useSearchParams 的 Suspense 要求）
  const [connectedId, setConnectedId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('delegationId') ?? '';
    }
    return '';
  });
  const [input, setInput] = useState<string>(connectedId);

  const connect = (id: string) => {
    const trimmed = id.trim();
    setConnectedId(trimmed);
    const params = new URLSearchParams(window.location.search);
    if (trimmed) params.set('delegationId', trimmed);
    else params.delete('delegationId');
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            委派事件總線 · 即時觀測
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            對齊平台不變量：全域・全端・全量・RWD・雙向同步。經 EventSource 訂閱委派生命週期事件。
          </p>
        </header>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Delegation ID
          </label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') connect(input);
              }}
              placeholder="輸入 delegationId 以訂閱即時事件"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 font-mono text-sm"
            />
            <button
              onClick={() => connect(input)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition"
            >
              連線
            </button>
          </div>
        </div>

        {connectedId ? (
          <>
            <DelegationMetricsOverview delegationId={connectedId} />
            <DelegationEventStream delegationId={connectedId} />
          </>
        ) : (
          <>
            <DelegationMetricsOverview />
            <div className="text-center text-gray-500 py-16 bg-white/5 rounded-2xl border border-white/10">
              請輸入 delegationId 以開啟即時事件串流
            </div>
          </>
        )}
      </div>
    </div>
  );
}
