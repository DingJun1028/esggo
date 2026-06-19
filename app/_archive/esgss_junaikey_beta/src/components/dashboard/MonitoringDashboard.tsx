/**
 * Monitoring Dashboard - 監控儀表板
 * Anti-gravity Design System
 * 
 * 功能：
 * - 系統監控
 * - 性能指標
 * - 錯誤追蹤
 * - 日誌查看
 * - 告警管理
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';
import { AntiGravityCard, AntiGravityGrid } from '@/components/layout/AntiGravityLayout';

// 監控指標類型
interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
}

// 日誌條目類型
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  details?: string;
}

// 告警類型
interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

// 系統狀態類型
interface SystemStatus {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
}

// 模擬監控指標
const mockMetrics: Metric[] = [
  {
    id: '1',
    name: 'CPU 使用率',
    value: 45,
    unit: '%',
    status: 'normal',
    trend: 'stable',
    change: 0,
  },
  {
    id: '2',
    name: '內存使用率',
    value: 68,
    unit: '%',
    status: 'warning',
    trend: 'up',
    change: 5,
  },
  {
    id: '3',
    name: '磁盤使用率',
    value: 72,
    unit: '%',
    status: 'warning',
    trend: 'up',
    change: 2,
  },
  {
    id: '4',
    name: '網絡流量',
    value: 125,
    unit: 'Mbps',
    status: 'normal',
    trend: 'down',
    change: -15,
  },
  {
    id: '5',
    name: '響應時間',
    value: 245,
    unit: 'ms',
    status: 'normal',
    trend: 'stable',
    change: 0,
  },
  {
    id: '6',
    name: '錯誤率',
    value: 0.5,
    unit: '%',
    status: 'normal',
    trend: 'down',
    change: -0.2,
  },
];

// 模擬日誌
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60),
    level: 'info',
    message: '用戶登錄成功',
    source: 'auth-service',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    level: 'warning',
    message: '內存使用率超過 65%',
    source: 'system-monitor',
    details: '當前內存使用率為 68%，建議檢查系統負載',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    level: 'info',
    message: '數據庫連接池已擴展',
    source: 'database-service',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    level: 'error',
    message: 'API 請求超時',
    source: 'api-gateway',
    details: '請求 /api/v1/data 在 5000ms 後超時',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    level: 'debug',
    message: '緩存命中率: 85%',
    source: 'cache-service',
  },
];

// 模擬告警
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: '內存使用率過高',
    message: '系統內存使用率已達到 68%，超過警告閾值',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    acknowledged: false,
  },
  {
    id: '2',
    type: 'error',
    title: 'API 請求超時',
    message: 'API 網關檢測到多個請求超時',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    acknowledged: true,
  },
  {
    id: '3',
    type: 'info',
    title: '系統備份完成',
    message: '每日系統備份已成功完成',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    acknowledged: true,
  },
];

// 系統狀態
const systemStatus: SystemStatus = {
  cpu: 45,
  memory: 68,
  disk: 72,
  network: 125,
  uptime: 30 * 24 * 60 * 60, // 30 天
};

// 獲取指標狀態顏色
const getMetricStatusColor = (status: Metric['status']) => {
  switch (status) {
    case 'normal':
      return 'text-green-400';
    case 'warning':
      return 'text-yellow-400';
    case 'critical':
      return 'text-red-400';
    default:
      return 'text-white/60';
  }
};

// 獲取指標狀態背景
const getMetricStatusBg = (status: Metric['status']) => {
  switch (status) {
    case 'normal':
      return 'bg-green-400/10 border-green-400/30';
    case 'warning':
      return 'bg-yellow-400/10 border-yellow-400/30';
    case 'critical':
      return 'bg-red-400/10 border-red-400/30';
    default:
      return 'bg-white/10 border-white/30';
  }
};

// 獲取日誌級別顏色
const getLogLevelColor = (level: LogEntry['level']) => {
  switch (level) {
    case 'info':
      return 'text-blue-400 bg-blue-400/10';
    case 'warning':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'error':
      return 'text-red-400 bg-red-400/10';
    case 'debug':
      return 'text-gray-400 bg-gray-400/10';
    default:
      return 'text-white/60 bg-white/10';
  }
};

// 獲取告警類型顏色
const getAlertTypeColor = (type: Alert['type']) => {
  switch (type) {
    case 'info':
      return 'border-blue-400/50 bg-blue-400/10';
    case 'warning':
      return 'border-yellow-400/50 bg-yellow-400/10';
    case 'error':
      return 'border-red-400/50 bg-red-400/10';
    case 'critical':
      return 'border-red-600/50 bg-red-600/10';
    default:
      return 'border-white/20 bg-white/10';
  }
};

// 格式化時間
const formatTime = (date: Date, language: 'zh-TW' | 'en') => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return language === 'zh-TW' ? '剛剛' : 'Just now';
  if (minutes < 60) return language === 'zh-TW' ? `${minutes} 分鐘前` : `${minutes} min ago`;
  if (hours < 24) return language === 'zh-TW' ? `${hours} 小時前` : `${hours} hours ago`;
  return language === 'zh-TW' ? `${days} 天前` : `${days} days ago`;
};

// 格式化運行時間
const formatUptime = (seconds: number, language: 'zh-TW' | 'en') => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  if (language === 'zh-TW') {
    return `${days} 天 ${hours} 小時 ${minutes} 分鐘`;
  }
  return `${days}d ${hours}h ${minutes}m`;
};

// 主組件
const MonitoringDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');
  const [metrics, setMetrics] = useState<Metric[]>(mockMetrics);
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('all');

  // 過濾日誌
  const filteredLogs = logs.filter((log) => {
    if (selectedLogLevel === 'all') return true;
    return log.level === selectedLogLevel;
  });

  // 確認告警
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  // 清除告警
  const handleClearAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  // 刷新數據
  const handleRefresh = () => {
    // 模擬數據刷新
    setMetrics((prev) =>
      prev.map((metric) => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
      }))
    );
  };

  // 自動刷新
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 每 30 秒刷新一次

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/start')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/80"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {language === 'zh-TW' ? '監控中心' : 'Monitoring Center'}
                </h1>
                <p className="text-sm text-white/60">
                  {language === 'zh-TW' ? '實時監控系統性能和狀態' : 'Real-time system performance and status monitoring'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
              >
                {language === 'zh-TW' ? '刷新' : 'Refresh'}
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">
                  {language === 'zh-TW' ? '運行中' : 'Running'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* UUID Display */}
        <div className="mb-8">
          <UUIDDisplay
            uuid="550e8400-e29b-41d4-a716-446655440000"
            mode="full"
            showLabel={true}
            language={language}
          />
        </div>

        {/* System Status */}
        <div className={`p-6 rounded-2xl border mb-8 ${getMetricStatusBg(
          metrics.some((m) => m.status === 'critical') ? 'critical' :
          metrics.some((m) => m.status === 'warning') ? 'warning' : 'normal'
        )}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                {language === 'zh-TW' ? '系統狀態' : 'System Status'}
              </h2>
              <p className="text-sm text-white/70">
                {language === 'zh-TW' ? '運行時間：' : 'Uptime: '}{formatUptime(systemStatus.uptime, language)}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{systemStatus.cpu}%</div>
                <div className="text-xs text-white/60">CPU</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{systemStatus.memory}%</div>
                <div className="text-xs text-white/60">{language === 'zh-TW' ? '內存' : 'Memory'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{systemStatus.disk}%</div>
                <div className="text-xs text-white/60">{language === 'zh-TW' ? '磁盤' : 'Disk'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{systemStatus.network}</div>
                <div className="text-xs text-white/60">{language === 'zh-TW' ? '網絡' : 'Network'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === 'zh-TW' ? '性能指標' : 'Performance Metrics'}
          </h2>
          <AntiGravityGrid columns={3} gap={4}>
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className={`p-6 rounded-2xl border ${getMetricStatusBg(metric.status)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-white/60">{metric.name}</h3>
                  <div className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                    {metric.value}
                    <span className="text-sm ml-1">{metric.unit}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {metric.trend === 'up' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    )}
                    {metric.trend === 'down' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                        <polyline points="17 18 23 18 23 12" />
                      </svg>
                    )}
                    {metric.trend === 'stable' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                    <span className={`text-sm ${metric.change > 0 ? 'text-red-400' : metric.change < 0 ? 'text-green-400' : 'text-white/60'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        metric.status === 'normal' ? 'bg-green-400' :
                        metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </AntiGravityGrid>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'zh-TW' ? '告警' : 'Alerts'}
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border ${getAlertTypeColor(alert.type)} ${alert.acknowledged ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {alert.type === 'critical' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                        )}
                        {alert.type === 'error' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        )}
                        {alert.type === 'warning' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                        )}
                        {alert.type === 'info' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{alert.title}</h3>
                        <p className="text-sm text-white/70">{alert.message}</p>
                        <div className="text-xs text-white/40 mt-1">{formatTime(alert.timestamp, language)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
                        >
                          {language === 'zh-TW' ? '確認' : 'Acknowledge'}
                        </button>
                      )}
                      <button
                        onClick={() => handleClearAlert(alert.id)}
                        className="p-1 hover:bg-white/10 text-white/60 rounded-lg transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {language === 'zh-TW' ? '系統日誌' : 'System Logs'}
            </h2>
            <select
              value={selectedLogLevel}
              onChange={(e) => setSelectedLogLevel(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#607D8B]/50 transition-all"
            >
              <option value="all" className="bg-slate-900">
                {language === 'zh-TW' ? '所有級別' : 'All Levels'}
              </option>
              <option value="debug" className="bg-slate-900">
                Debug
              </option>
              <option value="info" className="bg-slate-900">
                Info
              </option>
              <option value="warning" className="bg-slate-900">
                Warning
              </option>
              <option value="error" className="bg-slate-900">
                Error
              </option>
            </select>
          </div>
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLogLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{log.message}</span>
                      <span className="text-xs text-white/40">{formatTime(log.timestamp, language)}</span>
                    </div>
                    <div className="text-sm text-white/60">
                      {log.source}
                      {log.details && ` • ${log.details}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MonitoringDashboard;
