'use client';

// ============================================================
// 一代理 思考 (Agent Thought Stream Panel)
// app/components/ThoughtStreamPanel.tsx
// 訂閱 OmniAgentBus 同步思考流 SSE 端點
//   GET /api/agent/<id>/thought/stream?runId=<optional>
// 即時顯示代理推理過程（對齊 5T hashLock 溯源）。
// 提供「試推理」(真實 autoPair 管線) 與「模擬思考」(demo 發布) 兩顆按鈕。
// ============================================================
import { useEffect, useRef, useState, useCallback } from 'react';
import { Brain, Radio, Zap, Sparkles, Loader2 } from 'lucide-react';

interface ThoughtEvent {
  type: 'connected' | 'thought';
  agentId?: string;
  runId?: string | null;
  step?: number;
  content?: string;
  topic?: string;
}

export default function ThoughtStreamPanel({
  agentId = 'gemma4-local',
  runId,
}: {
  agentId?: string;
  runId?: string;
}) {
  const [events, setEvents] = useState<ThoughtEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState<'none' | 'real' | 'demo'>('none');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEvents([]);
    setConnected(false);
    const qs = runId ? `?runId=${encodeURIComponent(runId)}` : '';
    const es = new EventSource(
      `/api/agent/${encodeURIComponent(agentId)}/thought/stream${qs}`,
    );
    es.onopen = () => setConnected(true);
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as ThoughtEvent;
        setEvents((prev) => [...prev, data]);
      } catch {
        /* 忽略非 JSON 幀 */
      }
    };
    es.onerror = () => setConnected(false);
    return () => es.close();
  }, [agentId, runId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [events]);

  const triggerReal = useCallback(async () => {
    setBusy('real');
    try {
      await fetch('/api/tags/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'auto',
          entityType: 'note',
          entityId: 'ui-thought-demo',
          content:
            'Our factory reduced carbon emissions by 40 percent through solar panel installation and water recycling programs.',
        }),
      });
    } finally {
      setBusy('none');
    }
  }, []);

  const triggerDemo = useCallback(async () => {
    setBusy('demo');
    try {
      await fetch(`/api/agent/${encodeURIComponent(agentId)}/thought/demo`, {
        method: 'POST',
      });
    } finally {
      setBusy('none');
    }
  }, [agentId]);

  const thoughts = events.filter((e) => e.type === 'thought');

  return (
    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex flex-col min-h-[420px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <Brain className="text-accentPurple" size={18} /> 一代理 思考
          <span className="text-xs text-textSecondary font-normal">(Agent Thought Stream)</span>
        </h3>
        <span
          className={`text-xs font-mono px-2 py-1 rounded-full border ${
            connected
              ? 'bg-accentGreen/10 text-accentGreen border-accentGreen/20'
              : 'bg-accentGold/10 text-accentGold border-accentGold/20'
          }`}
        >
          {connected ? '● LIVE' : '○ 連線中'}
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
        {events.length === 0 && (
          <div className="text-center text-textSecondary py-12">
            <Radio className="mx-auto mb-3 animate-pulse text-accentPurple" size={26} />
            <p className="text-sm">監聽 {agentId} 之同步思考流…</p>
            <p className="text-xs mt-1 text-textSecondary/70">點擊下方按鈕觸發推理以觀察思考片段</p>
          </div>
        )}

        {events.map((ev, i) =>
          ev.type === 'connected' ? (
            <div key={i} className="text-xs font-mono text-textSecondary border-b border-borderColor pb-2">
              ⚡ 已連線 · {ev.topic}
            </div>
          ) : (
            <div
              key={i}
              className="bg-primary/50 border border-borderColor rounded-xl p-4 animate-[fadeIn_0.4s_ease-out]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-accentPurple px-2 py-0.5 rounded-md border border-accentPurple/30 bg-accentPurple/10">
                  STEP {ev.step ?? '?'}
                </span>
                {ev.runId && (
                  <span className="text-[10px] font-mono text-textSecondary">runId: {ev.runId}</span>
                )}
              </div>
              <p className="text-sm text-textPrimary whitespace-pre-wrap leading-relaxed">{ev.content}</p>
            </div>
          ),
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={triggerReal}
          disabled={busy !== 'none'}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#63a6b0] to-[#8b5cf6] text-white text-sm font-medium py-2.5 px-4 hover:opacity-90 disabled:opacity-50 transition"
        >
          {busy === 'real' ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          {busy === 'real' ? '推論中…' : '試推理 (真實管線)'}
        </button>
        <button
          onClick={triggerDemo}
          disabled={busy !== 'none'}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-accentPurple/40 text-accentPurple text-sm font-medium py-2.5 px-4 hover:bg-accentPurple/10 disabled:opacity-50 transition"
        >
          {busy === 'demo' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {busy === 'demo' ? '模擬中…' : '模擬思考'}
        </button>
      </div>

      {thoughts.length > 0 && (
        <p className="mt-2 text-right text-[10px] font-mono text-textSecondary">
          已接收 {thoughts.length} 段思考 · agent={agentId}
        </p>
      )}
    </div>
  );
}
