'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
// EMM IDE — Environment + Model Monitor
// Solid Card Design System (Teal #009EB0 / Gold #D4AF37 / ZKP Blue #3B82F6)
// ═══════════════════════════════════════════════════════════════

interface EnvMetrics {
  platform: string;
  arch: string;
  hostname: string;
  uptime_seconds: number;
  cpu: {
    model: string;
    cores: number;
    load_average_1m: string;
    load_average_5m: string;
    load_average_15m: string;
    usage_percent: number;
  };
  memory: {
    total_mb: number;
    used_mb: number;
    free_mb: number;
    usage_percent: number;
    process_rss_mb: number;
    process_heap_mb: number;
  };
}

interface GatewayMetrics {
  version: string;
  node_version: string;
  process_uptime_seconds: number;
  ws_clients: number;
  skills_loaded: number;
  skills_transcended: number;
  providers: {
    gemini: boolean;
    groq: boolean;
    openrouter: boolean;
    free_models: number;
    telegram: boolean;
  };
}

interface ModelStatus {
  groq?: {
    ok: boolean;
    models_available?: number;
    rate_limit?: string;
    status?: number;
    error?: string;
  };
  openrouter?: {
    ok: boolean;
    free_models_available?: number;
    top_free?: string[];
    status?: number;
    error?: string;
  };
}

interface TelegramStatus {
  connected: boolean;
  token_prefix?: string;
}

interface SonnarAggregate {
  crawlCount: number;
  lastCrawl: string | null;
  jobsActive: number;
  sourcesMonitored: number;
  alertsActive: number;
  signalStrength: number;
  newItems: number;
}

interface EMMMetrics {
  timestamp: number;
  gateway: {
    environment: EnvMetrics;
    gateway: GatewayMetrics;
    models: ModelStatus;
    telegram: TelegramStatus;
  } | null;
  gatewayError: string | null;
  sonnar: SonnarAggregate;
  gatewayUrl: string;
}

interface SSEMetrics {
  ts: number;
  cpu_load: string;
  mem_percent: number;
  proc_rss_mb: number;
  ws_clients: number;
  uptime: number;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${ok ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]'}`} />
  );
}

function ProgressBar({ percent, color = 'teal' }: { percent: number; color?: string }) {
  const colorMap: Record<string, string> = {
    teal: 'bg-[#009EB0]',
    gold: 'bg-[#D4AF37]',
    blue: 'bg-[#3B82F6]',
    red: 'bg-red-500',
  };
  const clamped = Math.min(100, Math.max(0, percent));
  const barColor = clamped > 80 ? colorMap.red : colorMap[color] || colorMap.teal;
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

function Card({ title, icon, children, accent = 'teal' }: { title: string; icon: string; children: React.ReactNode; accent?: string }) {
  const borderMap: Record<string, string> = {
    teal: 'border-l-[#009EB0]',
    gold: 'border-l-[#D4AF37]',
    blue: 'border-l-[#3B82F6]',
  };
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 border-l-4 ${borderMap[accent] || borderMap.teal} p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MetricRow({ label, value, sub: _sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-slate-700 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );
}

export default function EMMIDEDashboard() {
  const [metrics, setMetrics] = useState<EMMMetrics | null>(null);
  const [sseData, setSseData] = useState<SSEMetrics[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gatewayAvailable, setGatewayAvailable] = useState(true);
  const [evolution, setEvolution] = useState({ level: 1, xp: 0, nextXp: 120 });
  const [evolving, setEvolving] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/emm/metrics', { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: EMMMetrics = await res.json();
      setMetrics(data);
      setGatewayAvailable(!data.gatewayError);
      setLastUpdate(new Date());
      setError(data.gatewayError);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
    }
  }, []);

  const connectSSERef = useRef<(() => void) | null>(null);

  const connectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    const es = new EventSource('/api/emm/metrics/stream');
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => {
      setConnected(false);
      es.close();
      setTimeout(() => connectSSERef.current?.(), 10000);
    };
    es.onmessage = (event) => {
      try {
        const data: SSEMetrics = JSON.parse(event.data);
        setSseData(prev => [...prev.slice(-59), data]);
        setLastUpdate(new Date());
      } catch {}
    };
  }, []);

  connectSSERef.current = connectSSE;

  useEffect(() => {
    fetchMetrics();
    connectSSE();
    const poll = setInterval(fetchMetrics, 30000);
    return () => {
      clearInterval(poll);
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [fetchMetrics, connectSSE]);

  const renderSparkline = (data: number[], color: string) => {
    if (data.length < 2) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const w = 120;
    const h = 32;
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width={w} height={h} className="mt-2">
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      </svg>
    );
  };

  const env = metrics?.gateway?.environment;
  const gw = metrics?.gateway?.gateway;
  const models = metrics?.gateway?.models;
  const telegram = metrics?.gateway?.telegram;
  const sonnar = metrics?.sonnar;
  const cpuHistory = sseData.map(d => parseFloat(d.cpu_load) || 0);
  const memHistory = sseData.map(d => d.mem_percent);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#009EB0] flex items-center justify-center text-white font-bold text-lg">E</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">EMM IDE — ESGGO ∞ Evolution</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Environment + Model Monitor · 永續發展無限進化</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StatusDot ok={connected} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{connected ? 'SSE Live' : 'Reconnecting...'}</span>
            </div>
            <StatusDot ok={gatewayAvailable} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{gatewayAvailable ? 'Gateway OK' : 'Gateway Offline'}</span>
            {lastUpdate && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {lastUpdate.toLocaleTimeString('zh-TW')}
              </span>
            )}
            <button onClick={fetchMetrics} className="px-3 py-1.5 text-xs bg-[#009EB0] text-white rounded-lg hover:bg-[#007d8f] transition-colors">
              Refresh
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-3 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-xs text-yellow-600 dark:text-yellow-400">
            Remote Gateway: {error} | Local Sonnar API: Active
          </div>
        )}

        {/* ESGGO EMM 進化 */}
        <div className="mt-4 rounded-xl border border-[#3B82F6]/40 bg-[#3B82F6]/10 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">🧬 ESGGO EMM 進化</div>
            <div className="flex gap-4 mt-1">
              <div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">LEVEL</div>
                <div className="text-xl font-bold text-[#D4AF37]">{evolution.level}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">XP</div>
                <div className="text-xl font-bold text-[#009EB0]">{evolution.xp}/{evolution.nextXp}</div>
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              if (evolving) return;
              setEvolving(true);
              try {
                await new Promise(r => setTimeout(r, 500));
                setEvolution(prev => {
                  const xp = prev.xp + 20;
                  let level = prev.level;
                  let nextXp = prev.nextXp;
                  while (xp >= nextXp) { level += 1; nextXp = Math.floor(nextXp * 1.2); }
                  return { level, xp: xp % nextXp, nextXp };
                });
              } finally { setEvolving(false); }
            }}
            disabled={evolving}
            className="px-4 py-2 rounded-lg text-xs font-bold border transition-colors disabled:opacity-70"
            style={{
              background: evolving ? '#E2E8F0' : 'rgba(59,130,246,0.15)',
              color: '#3B82F6',
              borderColor: 'rgba(59,130,246,0.5)',
            }}
          >
            {evolving ? '🧬 進化中...' : '🧬 啟動 EMM 進化'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Environment Card */}
        <Card title="Environment" icon="🖥️" accent="teal">
          {env ? (
            <>
              <MetricRow label="Platform" value={`${env.platform} / ${env.arch}`} />
              <MetricRow label="Hostname" value={env.hostname} />
              <MetricRow label="Uptime" value={formatUptime(env.uptime_seconds)} />
              <MetricRow label="CPU" value={env.cpu.model} />
              <MetricRow label="Cores" value={env.cpu.cores} />
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">CPU Load</span>
                  <span className="font-mono">{env.cpu.usage_percent}%</span>
                </div>
                <ProgressBar percent={env.cpu.usage_percent} color="teal" />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>1m: {env.cpu.load_average_1m}</span>
                  <span>5m: {env.cpu.load_average_5m}</span>
                  <span>15m: {env.cpu.load_average_15m}</span>
                </div>
              </div>
              {renderSparkline(cpuHistory, '#009EB0')}
            </>
          ) : (
            <div className="text-xs text-gray-400 animate-pulse">Waiting for gateway...</div>
          )}
        </Card>

        {/* Memory Card */}
        <Card title="Memory" icon="💾" accent="gold">
          {env ? (
            <>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">System RAM</span>
                  <span className="font-mono">{env.memory.usage_percent}%</span>
                </div>
                <ProgressBar percent={env.memory.usage_percent} color="gold" />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Used: {formatMB(env.memory.used_mb)}</span>
                  <span>Total: {formatMB(env.memory.total_mb)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <MetricRow label="Process RSS" value={formatMB(env.memory.process_rss_mb)} />
                <MetricRow label="Process Heap" value={formatMB(env.memory.process_heap_mb)} />
                <MetricRow label="Free" value={formatMB(env.memory.free_mb)} />
              </div>
              {renderSparkline(memHistory, '#D4AF37')}
            </>
          ) : (
            <div className="text-xs text-gray-400 animate-pulse">Waiting for gateway...</div>
          )}
        </Card>

        {/* Gateway Card */}
        <Card title="Gateway" icon="⚡" accent="blue">
          {gw ? (
            <>
              <MetricRow label="Version" value={gw.version} />
              <MetricRow label="Node" value={gw.node_version} />
              <MetricRow label="Uptime" value={formatUptime(gw.process_uptime_seconds)} />
              <MetricRow label="WS Clients" value={gw.ws_clients} />
              <MetricRow label="Skills" value={`${gw.skills_loaded} (${gw.skills_transcended} transcended)`} />
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Groq</span>
                  <StatusDot ok={gw.providers.groq} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Gemini</span>
                  <StatusDot ok={gw.providers.gemini} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">OpenRouter</span>
                  <StatusDot ok={gw.providers.openrouter} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Telegram</span>
                  <StatusDot ok={gw.providers.telegram} />
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Free Models</span>
                  <span className="text-sm font-mono font-semibold text-emerald-500">{gw.providers.free_models}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-400 animate-pulse">Waiting for gateway...</div>
          )}
        </Card>

        {/* AI Models Card */}
        <Card title="AI Models" icon="🧠" accent="teal">
          {models?.groq ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <StatusDot ok={models.groq.ok} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Groq {models.groq.ok ? 'Online' : 'Error'}
                </span>
              </div>
              {models.groq.ok && (
                <>
                  <MetricRow label="Models" value={models.groq.models_available || 4} />
                  <MetricRow label="Rate Limit" value={models.groq.rate_limit || '30 req/min'} />
                  <div className="mt-2">
                    <span className="text-[10px] text-gray-400">Primary Models:</span>
                    <div className="mt-1 space-y-1">
                      {['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it', 'mixtral-8x7b-32768'].map((m, i) => (
                        <div key={i} className="text-[10px] font-mono bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 truncate">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {models.groq.error && (
                <div className="text-xs text-red-500 mt-2">{models.groq.error}</div>
              )}
            </>
          ) : (
            <div className="text-xs text-gray-400">No Groq data</div>
          )}
          {models?.openrouter && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <StatusDot ok={models.openrouter.ok} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  OpenRouter {models.openrouter.ok ? 'Online' : 'Error'}
                </span>
              </div>
              {models.openrouter.ok && (
                <>
                  <MetricRow label="Free Models" value={models.openrouter.free_models_available || 0} />
                  <div className="mt-2">
                    <span className="text-[10px] text-gray-400">Top Free Models:</span>
                    <div className="mt-1 space-y-1">
                      {(models.openrouter.top_free || []).slice(0, 3).map((m, i) => (
                        <div key={i} className="text-[10px] font-mono bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 truncate">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {models.openrouter.error && (
                <div className="text-xs text-red-500 mt-2">{models.openrouter.error}</div>
              )}
            </div>
          )}
        </Card>

        {/* Telegram Card */}
        <Card title="Telegram Bot" icon="📱" accent="blue">
          {telegram ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <StatusDot ok={telegram.connected} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {telegram.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {telegram.connected && (
                <MetricRow label="Token" value={telegram.token_prefix || 'N/A'} />
              )}
            </>
          ) : (
            <div className="text-xs text-gray-400">No data</div>
          )}
        </Card>

        {/* Sonar Card */}
        <Card title="Sonar" icon="📡" accent="gold">
          {sonnar ? (
            <>
              <MetricRow label="Crawl Runs" value={sonnar.crawlCount} />
              <MetricRow label="Jobs Active" value={`${sonnar.jobsActive} / ${sonnar.sourcesMonitored}`} />
              <MetricRow label="Last Crawl" value={sonnar.lastCrawl ? new Date(sonnar.lastCrawl).toLocaleString('zh-TW') : 'Never'} />
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Signal Strength</span>
                  <span className="text-sm font-mono">{sonnar.signalStrength}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">New Items</span>
                  <span className="text-sm font-mono">{sonnar.newItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Active Alerts</span>
                  <span className="text-sm font-mono">{sonnar.alertsActive}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-400">Loading...</div>
          )}
        </Card>
      </div>

      <div className="max-w-7xl mx-auto mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        EMM IDE v2.0 | Sonnar API: Active | SSE {connected ? 'Connected' : 'Disconnected'} | Gateway: {metrics?.gatewayUrl || 'N/A'}
      </div>
    </div>
  );
}