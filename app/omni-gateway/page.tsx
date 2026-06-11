'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity, Wifi, WifiOff, Zap, Shield, Globe, Server,
  Terminal, Play, RefreshCw, GitBranch, AlertTriangle,
  CheckCircle, Clock, Cpu, Database, ArrowRight, Sparkles
} from 'lucide-react';

const GATEWAY_URL = process.env.NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL || 'http://161.118.248.180:8642';
const GATEWAY_KEY = process.env.NEXT_PUBLIC_GATEWAY_KEY || 'hermes_gold_2026';

interface GatewayStatus {
  status: string; version: string; gateway_name: string;
  providers: { gemini: boolean; openrouter: boolean; free_models: number };
  websocket: { enabled: boolean; clients: number };
  skills: { total: number; transcended: number };
  uptime_seconds: number;
  memory: { used_mb: string; rss_mb: string };
  endpoints: string[];
}

interface WsEvent { type: string; source: string; payload: any; timestamp: number; }
interface Skill { id: string; name: string; origin: string; model: string; esgDomain: string; fiveT: string; status: string; }

const apiHeaders = { 'Content-Type': 'application/json', 'X-Omni-Token': GATEWAY_KEY };

// ── Status Indicator ──
const Dot = ({ ok, pulse }: { ok: boolean; pulse?: boolean }) => (
  <span className="relative flex h-2.5 w-2.5">
    {ok && pulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${ok ? 'bg-emerald-400' : 'bg-red-400'}`} />
  </span>
);

const FiveTBadge = ({ tag }: { tag: string }) => {
  const map: Record<string, string> = { T1: 'bg-cyan-100 text-cyan-700', T2: 'bg-green-100 text-green-700', T3: 'bg-purple-100 text-purple-700', T4: 'bg-red-100 text-red-700', T5: 'bg-orange-100 text-orange-700' };
  return <span className={`px-1.5 py-0.5 rounded text-xs font-black font-mono ${map[tag] || 'bg-gray-100 text-gray-600'}`}>{tag}</span>;
};

export default function GatewayDashboard() {
  const [status, setStatus]       = useState<GatewayStatus | null>(null);
  const [skills, setSkills]       = useState<Skill[]>([]);
  const [wsEvents, setWsEvents]   = useState<WsEvent[]>([]);
  const [wsConnected, setWsConn]  = useState(false);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<'overview'|'skills'|'stream'|'jules'>('overview');
  const [streamOutput, setStream] = useState('');
  const [julesInput, setJulesIn]  = useState('');
  const [julesOutput, setJulesOut] = useState<any>(null);
  const [busy, setBusy]           = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const r = await fetch(`${GATEWAY_URL}/status`, { signal: AbortSignal.timeout(3000) });
      if (r.ok) setStatus(await r.json());
    } catch { setStatus(null); }
    setLoading(false);
  }, []);

  const fetchSkills = useCallback(async () => {
    try {
      const r = await fetch(`${GATEWAY_URL}/skills`);
      if (r.ok) { const d = await r.json(); setSkills(d.skills || []); }
    } catch {}
  }, []);

  // WebSocket connection
  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const ws = new WebSocket(GATEWAY_URL.replace(/^http/, 'ws'));
    wsRef.current = ws;
    ws.onopen = () => setWsConn(true);
    ws.onclose = () => { setWsConn(false); setTimeout(connectWS, 3000); };
    ws.onmessage = (e) => {
      try {
        const evt: WsEvent = JSON.parse(e.data);
        setWsEvents(prev => [evt, ...prev].slice(0, 50));
        if (logRef.current) logRef.current.scrollTop = 0;
      } catch {}
    };
  }, []);

  useEffect(() => {
    fetchStatus(); fetchSkills(); connectWS();
    const t = setInterval(fetchStatus, 10000);
    return () => { clearInterval(t); wsRef.current?.close(); };
  }, [fetchStatus, fetchSkills, connectWS]);

  const handleStream = async () => {
    setBusy(true); setStream('');
    try {
      const r = await fetch(`${GATEWAY_URL}/stream`, {
        method: 'POST', headers: apiHeaders,
        body: JSON.stringify({ task: { id: `task_${Date.now()}`, taskType: 'gri_report_draft', title: 'ESG 永續揭露測試', prompt: 'GRI 305-1 範疇一直接排放揭露' }, skillId: 'gri_report_draft' }),
      });
      const reader = r.body!.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = dec.decode(value).split('\n');
        for (const l of lines) {
          if (l.startsWith('data:')) {
            try { const d = JSON.parse(l.slice(5)); if (d.text) setStream(p => p + d.text); } catch {}
          }
        }
      }
    } catch (e: any) { setStream(`錯誤：${e.message}`); }
    setBusy(false);
  };

  const handleJules = async () => {
    if (!julesInput) return;
    setBusy(true); setJulesOut(null);
    try {
      const r = await fetch(`${GATEWAY_URL}/omni-jules`, {
        method: 'POST', headers: apiHeaders,
        body: JSON.stringify({ failureReason: julesInput, sourceTaskId: genId('task'), context: 'ESGGO Platform Test' }),
      });
      setJulesOut(await r.json());
    } catch (e: any) { setJulesOut({ error: e.message }); }
    setBusy(false);
  };

  const genId = (p: string) => `${p}_${Date.now()}`;
  const uptime = status ? `${Math.floor(status.uptime_seconds / 3600)}h ${Math.floor((status.uptime_seconds % 3600) / 60)}m` : '--';

  const eventColor: Record<string, string> = {
    OBSERVE: 'text-cyan-400', INTENT: 'text-violet-400', MANIFEST: 'text-emerald-400',
    SEAL: 'text-amber-400', HEAL: 'text-red-400', CONNECTED: 'text-blue-400',
    SWARM: 'text-purple-400', RELAY: 'text-slate-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 font-mono">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
            <Server className="text-violet-300" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">OmniAgent Gateway</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-violet-500/20 text-violet-300 border border-violet-500/30">v3.0</span>
            </div>
            <p className="text-xs text-slate-500">Hermes Origin → ESGGO Evolved · {GATEWAY_URL}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
            {wsConnected ? <Wifi size={14} className="text-emerald-400" /> : <WifiOff size={14} className="text-red-400" />}
            <span className="text-xs">{wsConnected ? `WS Connected · ${wsEvents.length} events` : 'WS Offline'}</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${status ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
            <Dot ok={!!status} pulse={!!status} />
            {status ? 'Gateway Online' : 'Gateway Offline'}
          </div>
          <button onClick={fetchStatus} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { icon: <Activity size={16}/>, label: 'Uptime', value: uptime, color: 'text-emerald-400' },
          { icon: <Cpu size={16}/>, label: 'Memory', value: status ? `${status.memory.used_mb}MB` : '--', color: 'text-blue-400' },
          { icon: <Wifi size={16}/>, label: 'WS Clients', value: status?.websocket.clients ?? '--', color: 'text-violet-400' },
          { icon: <GitBranch size={16}/>, label: 'Skills', value: status ? `${status.skills.transcended}/${status.skills.total}` : '--', color: 'text-amber-400' },
          { icon: <Globe size={16}/>, label: 'Free Models', value: status?.providers.free_models ?? '--', color: 'text-cyan-400' },
        ].map(k => (
          <div key={k.label} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className={`${k.color} mb-2`}>{k.icon}</div>
            <div className="text-xs text-slate-500 mb-1">{k.label}</div>
            <div className="text-lg font-black text-white">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-800">
        {(['overview','skills','stream','jules'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 -mb-px ${tab === t ? 'text-violet-400 border-violet-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
            {t === 'overview' ? '總覽' : t === 'skills' ? '技能庫' : t === 'stream' ? '串流測試' : 'OmniJules'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">

          {tab === 'overview' && (
            <>
              {/* Provider Status */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">AI 提供商狀態</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Google Gemini', ok: status?.providers.gemini, sub: 'Primary · gemini-1.5-flash' },
                    { name: 'OpenRouter', ok: status?.providers.openrouter, sub: `${status?.providers.free_models || 0} 免費模型 · 含 Hermes 3 405B` },
                    { name: 'Mock Templates', ok: true, sub: 'Fallback · Always available' },
                  ].map(p => (
                    <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
                      <div className="flex items-center gap-3">
                        <Dot ok={!!p.ok} />
                        <div>
                          <p className="text-sm font-bold text-white">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.sub}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-black ${p.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.ok ? '✓ Active' : '✗ Offline'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Endpoints */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">API 端點</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(status?.endpoints || ['/health','/status','/models','/skills','/execute','/stream','/omni-jules','/evolve','/swarm/broadcast']).map(ep => (
                    <div key={ep} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/40">
                      <span className="text-emerald-400 text-xs font-black">●</span>
                      <code className="text-xs text-slate-300">{ep}</code>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'skills' && (
            <div className="space-y-2">
              {skills.map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-violet-500/40 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white">{s.name}</span>
                        <FiveTBadge tag={s.fiveT} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <code className="text-violet-400">{s.origin}</code>
                        <ArrowRight size={10} />
                        <code className="text-emerald-400">{s.id}</code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">Model: {s.model}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-black ${s.status === 'transcended' ? 'bg-violet-900/40 text-violet-300' : 'bg-blue-900/40 text-blue-300'}`}>
                        {s.status === 'transcended' ? '✨ 超越' : '✓ 已吸收'}
                      </span>
                      <span className="text-xs text-slate-600">ESG: {s.esgDomain}</span>
                    </div>
                  </div>
                </div>
              ))}
              {skills.length === 0 && (
                <div className="text-center py-12 text-slate-600">
                  <GitBranch size={32} className="mx-auto mb-3 opacity-30" />
                  <p>Gateway 離線，無法載入技能庫</p>
                </div>
              )}
            </div>
          )}

          {tab === 'stream' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">SSE 串流測試 — GRI 報告生成</h3>
                <p className="text-xs text-slate-500 mb-4">觸發 <code>/stream</code> 端點，使用 Server-Sent Events 實時串流 AI 回應</p>
                <button onClick={handleStream} disabled={busy}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-sm font-black transition-all">
                  <Play size={14} className={busy ? 'animate-pulse' : ''} />
                  {busy ? '串流中...' : '啟動串流 (GRI 305-1)'}
                </button>
              </div>
              {streamOutput && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700">
                  <pre className="text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">{streamOutput}</pre>
                </div>
              )}
            </div>
          )}

          {tab === 'jules' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Shield size={18} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">OmniJules 萬能果因協議</h3>
                    <p className="text-xs text-slate-500">前身：Google Jules · 9步驟自動修復引擎</p>
                  </div>
                </div>
                <textarea
                  value={julesInput}
                  onChange={e => setJulesIn(e.target.value)}
                  placeholder="描述故障原因，例如：ZKP 校驗失敗，Scope 3 數據缺少 350 tCO2e..."
                  className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-violet-500"
                />
                <button onClick={handleJules} disabled={busy || !julesInput}
                  className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white text-sm font-black transition-all">
                  <Zap size={14} />
                  {busy ? 'OmniJules 修復中...' : '觸發 Karma Protocol'}
                </button>
              </div>
              {julesOutput && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                  {julesOutput.error ? (
                    <p className="text-red-400 text-sm">{julesOutput.error}</p>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span className="text-xs font-black text-emerald-400">HEALED · {julesOutput.provider}</span>
                      </div>
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed border-t border-slate-800 pt-3">{julesOutput.healingReport}</pre>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <span className="text-xs text-slate-600">Hash Lock:</span>
                        <code className="text-xs text-violet-400 font-mono">{julesOutput.hash_lock?.slice(0,24)}...</code>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* OmniAgentBus Live Feed */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">OmniAgentBus 即時訊號</h3>
              <span className="text-xs text-slate-600">{wsEvents.length} events</span>
            </div>
            <div ref={logRef} className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {wsEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-700">
                  <Activity size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">等待訊號...</p>
                </div>
              ) : wsEvents.map((e, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-900/60 text-xs">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-black ${eventColor[e.type] || 'text-slate-400'}`}>{e.type}</span>
                    <span className="text-slate-600">{e.source}</span>
                  </div>
                  <span className="text-slate-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
