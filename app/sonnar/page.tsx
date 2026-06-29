'use client';

import { useState, useEffect, useCallback } from 'react';

interface Source {
  id: string;
  name: string;
  enabled: boolean;
  lastRun?: string;
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

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-blue-400 text-white',
};

const TREND_ICONS: Record<string, string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

export default function SonnarDashboard() {
  const [sources, setSources] = useState<Source[]>([]);
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'crawl' | 'alerts'>('overview');

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

      if (crawlData.success) setSources(crawlData.data.jobs);
      if (radarData.success) {
        setSignals(radarData.data.signals);
        setTopics(radarData.data.topicsAggregated);
      }
      if (alertsData.success) setAlerts(alertsData.data.alerts);
    } catch (err) {
      console.error('[Sonar] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const triggerCrawl = async (sourceId: string) => {
    setCrawling(sourceId);
    try {
      const res = await fetch('/api/sonnar/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(fetchStatus, 2000);
      }
    } catch (err) {
      console.error('[Sonar] Crawl trigger error:', err);
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
      console.error('[Sonar] Acknowledge error:', err);
    }
  };

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
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-lg font-bold">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold">ESGSonar</h1>
              <p className="text-xs text-gray-400">ESG 法規信號雷達</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-400">即時監控中</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-gray-800 px-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          {(['overview', 'crawl', 'alerts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab === 'overview' && '信號雷達'}
              {tab === 'crawl' && '爬蟲控制'}
              {tab === 'alerts' && `異常警報${alerts.filter(a => !a.acknowledged).length > 0 ? ` (${alerts.filter(a => !a.acknowledged).length})` : ''}`}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Signal Strength Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {signals.map(signal => (
                <div
                  key={signal.source.id}
                  className={`rounded-xl border p-5 ${
                    signal.anomaly
                      ? 'border-orange-500/50 bg-orange-500/5'
                      : 'border-gray-800 bg-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{signal.source.name}</h3>
                    {signal.anomaly && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                        ⚠ 異常
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>信號強度</span>
                      <span>{signal.signalStrength}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          signal.signalStrength > 80 ? 'bg-red-500' :
                          signal.signalStrength > 50 ? 'bg-yellow-500' :
                          'bg-teal-500'
                        }`}
                        style={{ width: `${signal.signalStrength}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>新增: <span className="text-green-400">{signal.newItems}</span></span>
                    <span>變動: <span className="text-yellow-400">{signal.changedItems}</span></span>
                  </div>
                  {signal.topics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {signal.topics.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Topics Trending */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="font-semibold mb-4">ESG 主題趨勢</h3>
              <div className="space-y-3">
                {topics.map(t => (
                  <div key={t.topic} className="flex items-center gap-4">
                    <span className="text-2xl w-8 text-center">{TREND_ICONS[t.trend]}</span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm">{t.topic}</span>
                        <span className="text-sm text-gray-400">{t.count} 筆</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${Math.min(t.count * 4, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Crawl Control Tab */}
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
                  } finally {
                    setCrawling(null);
                  }
                }}
                disabled={crawling !== null}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
              >
                {crawling === 'all' ? '執行中...' : '全部執行'}
              </button>
            </div>

            <div className="space-y-3">
              {sources.map(source => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-900"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{source.sourceName}</h3>
                      <span className={`w-2 h-2 rounded-full ${source.enabled ? 'bg-green-400' : 'bg-gray-600'}`} />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      ID: {source.sourceId} | 運行: {source.totalRuns} 次 | 成功: {source.successfulRuns} | 失敗: {source.failedRuns}
                    </div>
                    {source.lastItemsFound !== undefined && (
                      <div className="text-xs text-gray-500 mt-1">
                        上次發現: {source.lastItemsFound} 項目
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => triggerCrawl(source.sourceId)}
                    disabled={crawling !== null || !source.enabled}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg text-sm transition-colors"
                  >
                    {crawling === source.sourceId ? '爬取中...' : '立即爬取'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">異常警報</h2>
              <span className="text-sm text-gray-400">
                未讀: {alerts.filter(a => !a.acknowledged).length} / 共 {alerts.length}
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-opacity ${
                    alert.acknowledged
                      ? 'border-gray-800 bg-gray-900/50 opacity-60'
                      : 'border-gray-800 bg-gray-900'
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
                      </div>
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{alert.summary}</p>
                    </div>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors shrink-0"
                      >
                        確認
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  目前無異常警報
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
