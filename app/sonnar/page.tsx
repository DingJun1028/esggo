'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────

interface Source {
  id: string;
  sourceId: string;
  sourceName: string;
  enabled: boolean;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  lastItemsFound?: number;
}

interface RadarSignal {
  source: { id: string; name: string };
  signalStrength: number;
  newItems: number;
  changedItems: number;
  anomaly: boolean;
  anomalyType?: string;
  topics: string[];
  lastUpdate: string;
}

interface Topic {
  topic: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  sources: string[];
}

interface Alert {
  id: string;
  sourceName: string;
  alertType: string;
  severity: string;
  title: string;
  summary: string;
  acknowledged: boolean;
  createdAt: string;
}

interface WSEvent {
  type: 'crawl_complete' | 'alert_new' | 'signal_update' | 'heartbeat';
  data: Record<string, unknown>;
  ts: number;
}

// ─── Constants ────────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-blue-400 text-white',
};

const REGION_LABELS: Record<string, string> = {
  TW: '🇹🇼 台灣', EU: '🇪🇺 歐盟', INT: '🌍 國際', US: '🇺🇸 美國', AP: '🌏 亞太', '3P': '📊 第三方',
};

const REGION_COLORS: Record<string, string> = {
  TW: 'bg-teal-500', EU: 'bg-blue-500', INT: 'bg-purple-500', US: 'bg-amber-500', AP: 'bg-pink-500', '3P': 'bg-cyan-500',
};

const TREND_ICONS: Record<string, string> = { up: '↑', down: '↓', stable: '→' };

// ─── CSS Bar Chart (zero deps) ────────────────────────────────

function BarChart({ data, maxVal, color }: { data: number[]; maxVal: number; color: string }) {
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 ${color} rounded-t transition-all duration-500`}
          style={{ height: maxVal > 0 ? `${(v / maxVal) * 100}%` : '0%', minHeight: v > 0 ? '2px' : '0' }}
          title={`${v}`}
        />
      ))}
    </div>
  );
}

// ─── Timeline sparkline ───────────────────────────────────────

function Sparkline({ data, color = 'text-teal-400' }: { data: number[]; color?: string }) {
  if (data.length < 2) return <span className="text-xs text-gray-500">--</span>;
  const max = Math.max(...data);
  const step = 100 / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${100 - (max > 0 ? (v / max) * 90 : 0)}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className={`w-full h-8 ${color}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────

export default function SonnarDashboard() {
  const [sources, setSources] = useState<Source[]>([]);
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'crawl' | 'alerts'>('overview');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [wsConnected, setWsConnected] = useState(false);
  const [wsEvents, setWsEvents] = useState<WSEvent[]>([]);

  // Signal history (for sparklines) — keep last 20 ticks per source
  const signalHistory = useRef<Record<string, number[]>>({});

  // ─── WebSocket ──────────────────────────────────────────────
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      try {
        const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${proto}//${location.host}/gateway/sonnar/ws`);

        ws.onopen = () => setWsConnected(true);
        ws.onclose = () => {
          setWsConnected(false);
          reconnectTimer = setTimeout(connect, 5000);
        };
        ws.onerror = () => ws?.close();

        ws.onmessage = (ev) => {
          try {
            const event: WSEvent = JSON.parse(ev.data);
            setWsEvents(prev => [...prev.slice(-49), event]); // keep last 50

            if (event.type === 'crawl_complete' || event.type === 'signal_update') {
              // Refresh data on crawl completion
              fetchStatus();
            }
            if (event.type === 'alert_new') {
              fetchStatus();
            }
          } catch { /* ignore bad messages */ }
        };
      } catch {
        reconnectTimer = setTimeout(connect, 5000);
      }
    };

    connect();
    return () => {
      ws?.close();
      clearTimeout(reconnectTimer);
    };
  }, []);

  // ─── Fetch ──────────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const [crawlRes, radarRes, alertsRes] = await Promise.all([
        fetch('/api/sonnar/crawl'),
        fetch('/api/sonnar/radar'),
        fetch('/api/sonnar/alerts'),
      ]);
      const crawlData = await crawlRes.json();
      const radarData = await radarRes.json();
      const alertsData = await alertsRes.json();

      if (crawlData.success) setSources(crawlData.data.jobs || []);
      if (radarData.success) {
        const sigs = radarData.data.signals || [];
        setSignals(sigs);
        setTopics(radarData.data.topicsAggregated || []);

        // Update signal history for sparklines
        sigs.forEach((s: RadarSignal) => {
          const hist = signalHistory.current[s.source.id] || [];
          signalHistory.current[s.source.id] = [...hist.slice(-19), s.signalStrength];
        });
      }
      if (alertsData.success) setAlerts(alertsData.data.alerts || []);
    } catch (err) {
      console.error('[Sonar] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    // Fallback polling if WS not connected
    const interval = setInterval(() => {
      if (!wsConnected) fetchStatus();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus, wsConnected]);

  // ─── Actions ────────────────────────────────────────────────
  const triggerCrawl = async (sourceId: string) => {
    setCrawling(sourceId);
    try {
      await fetch('/api/sonnar/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });
      setTimeout(fetchStatus, 2000);
    } catch (err) {
      console.error('[Sonar] Crawl error:', err);
    } finally {
      setCrawling(null);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch('/api/sonnar/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, action: 'acknowledge' }),
      });
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    } catch (err) {
      console.error('[Sonar] Ack error:', err);
    }
  };

  // ─── Derived data ───────────────────────────────────────────
  const regionCounts = signals.reduce<Record<string, number>>((acc, s) => {
    const region = s.source.id.split('-')[0].toUpperCase();
    const key = ['TW', 'EU', 'INT', 'US', 'AP'].includes(region) ? region : '3P';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const maxRegionCount = Math.max(...Object.values(regionCounts), 1);

  const topicBarData = topics.slice(0, 10).map(t => t.count);
  const maxTopicCount = Math.max(...topicBarData, 1);

  const unackAlerts = alerts.filter(a => !a.acknowledged);
  const criticalAlerts = unackAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  const filteredSignals = regionFilter === 'all'
    ? signals
    : signals.filter(s => {
        const region = s.source.id.split('-')[0].toUpperCase();
        const key = ['TW', 'EU', 'INT', 'US', 'AP'].includes(region) ? region : '3P';
        return key === regionFilter;
      });

  // ─── Render ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">ESGSonar 初始化中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ─── Header ─── */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-lg font-bold">S</div>
            <div>
              <h1 className="text-xl font-bold">ESGSonar</h1>
              <p className="text-xs text-gray-400">ESG 法規信號雷達 — 20 源監控</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* WS status */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs text-gray-400">{wsConnected ? 'WS 即時' : '輪詢 30s'}</span>
            </div>
            {/* Critical alerts badge */}
            {criticalAlerts.length > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white animate-pulse">
                {criticalAlerts.length} 嚴重
              </span>
            )}
            {/* Event log dot */}
            {wsEvents.length > 0 && (
              <span className="text-xs text-gray-500">事件: {wsEvents.length}</span>
            )}
          </div>
        </div>
      </header>

      {/* ─── Tabs ─── */}
      <nav className="border-b border-gray-800 px-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          {(['overview', 'crawl', 'alerts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-teal-400 text-teal-400' : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab === 'overview' && '信號雷達'}
              {tab === 'crawl' && '爬蟲控制'}
              {tab === 'alerts' && `異常警報${unackAlerts.length > 0 ? ` (${unackAlerts.length})` : ''}`}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* ═══ Overview Tab ═══ */}
        {activeTab === 'overview' && (
          <>
            {/* ─── Summary KPI Row ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <p className="text-xs text-gray-400 mb-1">監控來源</p>
                <p className="text-2xl font-bold text-teal-400">{signals.length}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <p className="text-xs text-gray-400 mb-1">異常信號</p>
                <p className="text-2xl font-bold text-orange-400">{signals.filter(s => s.anomaly).length}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <p className="text-xs text-gray-400 mb-1">未讀警報</p>
                <p className="text-2xl font-bold text-red-400">{unackAlerts.length}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <p className="text-xs text-gray-400 mb-1">主題數</p>
                <p className="text-2xl font-bold text-blue-400">{topics.length}</p>
              </div>
            </div>

            {/* ─── Region Distribution Chart ─── */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="font-semibold mb-4">來源區域分布</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(REGION_LABELS).map(([key, label]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <div className="h-20 flex items-end justify-center">
                      <div
                        className={`w-8 ${REGION_COLORS[key] || 'bg-gray-500'} rounded-t transition-all duration-500`}
                        style={{ height: `${((regionCounts[key] || 0) / maxRegionCount) * 100}%`, minHeight: regionCounts[key] ? '4px' : '0' }}
                      />
                    </div>
                    <p className="text-sm font-medium mt-1">{regionCounts[key] || 0}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Region Filter ─── */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRegionFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${regionFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >全部</button>
              {Object.entries(REGION_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setRegionFilter(key)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${regionFilter === key ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >{label}</button>
              ))}
            </div>

            {/* ─── Signal Cards (with sparkline) ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSignals.map(signal => (
                <div
                  key={signal.source.id}
                  className={`rounded-xl border p-5 ${
                    signal.anomaly ? 'border-orange-500/50 bg-orange-500/5' : 'border-gray-800 bg-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm truncate">{signal.source.name}</h3>
                    {signal.anomaly && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">⚠ 異常</span>
                    )}
                  </div>

                  {/* Sparkline */}
                  <Sparkline data={signalHistory.current[signal.source.id] || []} />

                  {/* Signal bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>信號強度</span>
                      <span>{signal.signalStrength}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          signal.signalStrength > 80 ? 'bg-red-500' :
                          signal.signalStrength > 50 ? 'bg-yellow-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${signal.signalStrength}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-gray-400 mt-2">
                    <span>新增: <span className="text-green-400">{signal.newItems}</span></span>
                    <span>變動: <span className="text-yellow-400">{signal.changedItems}</span></span>
                  </div>

                  {signal.topics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {signal.topics.slice(0, 4).map(t => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ─── Topic Bar Chart ─── */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="font-semibold mb-4">ESG 主題趨勢</h3>
              {topics.length > 0 ? (
                <div className="space-y-3">
                  {/* Bar chart */}
                  <BarChart data={topicBarData} maxVal={maxTopicCount} color="bg-teal-500" />
                  {/* Labels */}
                  <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(topics.length, 10)}, 1fr)` }}>
                    {topics.slice(0, 10).map(t => (
                      <div key={t.topic} className="text-center">
                        <span className="text-xs text-gray-300">{t.topic}</span>
                        <span className="block text-xs text-gray-500">{TREND_ICONS[t.trend]} {t.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">尚無主題資料</p>
              )}
            </div>

            {/* ─── WS Event Log ─── */}
            {wsEvents.length > 0 && (
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h3 className="font-semibold mb-3 text-sm">即時事件流</h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {wsEvents.slice(-10).reverse().map((ev, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="text-gray-600">{new Date(ev.ts).toLocaleTimeString()}</span>
                      <span className={`px-1.5 py-0.5 rounded text-gray-300 ${
                        ev.type === 'alert_new' ? 'bg-red-800' :
                        ev.type === 'crawl_complete' ? 'bg-green-800' : 'bg-gray-800'
                      }`}>{ev.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══ Crawl Control Tab ═══ */}
        {activeTab === 'crawl' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">爬蟲控制</h2>
              <button
                onClick={async () => {
                  setCrawling('all');
                  try {
                    await fetch('/api/sonnar/crawl', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ all: true }),
                    });
                    setTimeout(fetchStatus, 3000);
                  } finally { setCrawling(null); }
                }}
                disabled={crawling !== null}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
              >
                {crawling === 'all' ? '執行中...' : '全部執行'}
              </button>
            </div>

            {/* Group by region */}
            {['tw', 'eu', 'int', 'us', 'ap', '3p'].map(region => {
              const regionSources = sources.filter(s => s.sourceId.startsWith(region));
              if (regionSources.length === 0) return null;
              return (
                <div key={region}>
                  <h3 className="text-xs font-medium text-gray-400 uppercase mb-2">{REGION_LABELS[region.toUpperCase()] || region}</h3>
                  <div className="space-y-2">
                    {regionSources.map(source => (
                      <div key={source.sourceId} className="flex items-center justify-between p-3 rounded-xl border border-gray-800 bg-gray-900">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{source.sourceName}</h4>
                            <span className={`w-1.5 h-1.5 rounded-full ${source.enabled ? 'bg-green-400' : 'bg-gray-600'}`} />
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            運行 {source.totalRuns} 次 · 成功 {source.successfulRuns} · 失敗 {source.failedRuns}
                            {source.lastItemsFound !== undefined && ` · 上次 ${source.lastItemsFound} 項`}
                          </div>
                        </div>
                        <button
                          onClick={() => triggerCrawl(source.sourceId)}
                          disabled={crawling !== null || !source.enabled}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg text-xs transition-colors"
                        >
                          {crawling === source.sourceId ? '爬取中...' : '立即爬取'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ Alerts Tab ═══ */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">異常警報</h2>
              <span className="text-sm text-gray-400">未讀: {unackAlerts.length} / 共 {alerts.length}</span>
            </div>

            {/* Severity filter tabs */}
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                <button
                  key={sev}
                  className="px-3 py-1 rounded-lg text-xs bg-gray-800 text-gray-400 hover:bg-gray-700"
                >
                  {sev === 'all' ? '全部' : sev.toUpperCase()}
                  {sev !== 'all' && ` (${alerts.filter(a => a.severity === sev).length})`}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-opacity ${
                    alert.acknowledged ? 'border-gray-800 bg-gray-900/50 opacity-60' : 'border-gray-800 bg-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${SEVERITY_COLORS[alert.severity] || 'bg-gray-600'}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">{alert.sourceName}</span>
                        <span className="text-xs text-gray-500">{alert.alertType}</span>
                        <span className="text-xs text-gray-600">{new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{alert.summary}</p>
                    </div>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors shrink-0"
                      >確認</button>
                    )}
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-12 text-gray-500">目前無異常警報 ✅</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
