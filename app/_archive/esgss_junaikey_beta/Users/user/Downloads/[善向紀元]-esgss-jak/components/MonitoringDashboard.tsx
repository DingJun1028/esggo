// 監控儀表板元件
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import {
    Activity, AlertTriangle, CheckCircle, XCircle,
    TrendingUp, Cpu, HardDrive, Wifi, BarChart3,
    Clock, Users, Zap, Shield, Eye, Download,
    RefreshCw, Settings, Filter
} from 'lucide-react';
import { monitoringService, SystemHealth, PerformanceMetrics, MonitoringEvent } from '../services/monitoring';
import { useResponsive } from '../hooks/useResponsive';

interface MonitoringDashboardProps {
    language: Language;
    isOpen: boolean;
    onClose: () => void;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
    language,
    isOpen,
    onClose
}) => {
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [metrics, setMetrics] = useState<PerformanceMetrics>({});
    const [events, setEvents] = useState<MonitoringEvent[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'events' | 'system'>('overview');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const { isMobile } = useResponsive();

    const isZh = language === 'zh-TW';

    useEffect(() => {
        if (!isOpen) return;

        const updateData = async () => {
            try {
                const [healthData, metricsData, eventsData] = await Promise.all([
                    monitoringService.getSystemHealth(),
                    monitoringService.getPerformanceMetrics(),
                    monitoringService.getRecentEvents(50)
                ]);

                setHealth(healthData);
                setMetrics(metricsData);
                setEvents(eventsData);
            } catch (error) {
                console.error('Failed to fetch monitoring data:', error);
            }
        };

        updateData();

        let interval: NodeJS.Timeout;
        if (autoRefresh) {
            interval = setInterval(updateData, 30000); // 每30秒更新
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isOpen, autoRefresh]);

    const getStatusColor = (status: SystemHealth['status']) => {
        switch (status) {
            case 'healthy': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            case 'error': return 'text-red-500';
            case 'critical': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status: SystemHealth['status']) => {
        switch (status) {
            case 'healthy': return <CheckCircle className="w-5 h-5" />;
            case 'warning': return <AlertTriangle className="w-5 h-5" />;
            case 'error': return <XCircle className="w-5 h-5" />;
            case 'critical': return <XCircle className="w-5 h-5" />;
            default: return <Activity className="w-5 h-5" />;
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${Math.round(ms)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const getEventTypeColor = (type: MonitoringEvent['type']) => {
        switch (type) {
            case 'error': return 'bg-red-100 text-red-800 border-red-200';
            case 'performance': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'user_action': return 'bg-green-100 text-green-800 border-green-200';
            case 'security': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'system': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`${isMobile ? 'w-full h-full' : 'max-w-6xl w-full max-h-[90vh]'} bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col`}>
                {/* 標題欄 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {isZh ? '系統監控儀表板' : 'System Monitoring Dashboard'}
                        </h2>
                        {health && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(health.status)} bg-opacity-10`}>
                                {getStatusIcon(health.status)}
                                <span className="capitalize">{health.status}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`p-2 rounded-lg transition-colors ${
                                autoRefresh
                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}
                            title={autoRefresh ? (isZh ? '停用自動更新' : 'Disable auto refresh') : (isZh ? '啟用自動更新' : 'Enable auto refresh')}
                        >
                            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 標籤頁 */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {[
                        { id: 'overview', label: isZh ? '總覽' : 'Overview', icon: BarChart3 },
                        { id: 'performance', label: isZh ? '效能' : 'Performance', icon: TrendingUp },
                        { id: 'system', label: isZh ? '系統' : 'System', icon: Cpu },
                        { id: 'events', label: isZh ? '事件' : 'Events', icon: Activity }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 內容區域 */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* 系統狀態卡片 */}
                            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isZh ? '系統狀態' : 'System Status'}
                                        </p>
                                        <p className={`text-2xl font-bold ${getStatusColor(health?.status || 'healthy')}`}>
                                            {health?.status === 'healthy' ? (isZh ? '正常' : 'Healthy') :
                                             health?.status === 'warning' ? (isZh ? '警告' : 'Warning') :
                                             health?.status === 'error' ? (isZh ? '錯誤' : 'Error') :
                                             (isZh ? '嚴重' : 'Critical')}
                                        </p>
                                    </div>
                                    <Activity className={`w-8 h-8 ${getStatusColor(health?.status || 'healthy')}`} />
                                </div>
                            </div>

                            {/* 效能指標卡片 */}
                            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isZh ? 'LCP' : 'LCP'}
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {metrics.LCP ? formatDuration(metrics.LCP) : '--'}
                                        </p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>

                            {/* 記憶體使用卡片 */}
                            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isZh ? '記憶體使用' : 'Memory Usage'}
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {health?.memory.percentage ? `${Math.round(health.memory.percentage)}%` : '--'}
                                        </p>
                                    </div>
                                    <HardDrive className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            {/* 事件計數卡片 */}
                            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isZh ? '今日事件' : 'Today Events'}
                                        </p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {events.filter(e => {
                                                const today = new Date();
                                                const eventDate = new Date(e.timestamp);
                                                return eventDate.toDateString() === today.toDateString();
                                            }).length}
                                        </p>
                                    </div>
                                    <Activity className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isZh ? '效能指標' : 'Performance Metrics'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(metrics).map(([key, value]) => (
                                    <div key={key} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{key}</span>
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                {typeof value === 'number' && value > 1000 ? formatDuration(value) :
                                                 typeof value === 'number' ? Math.round(value) : value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && health && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isZh ? '系統健康狀態' : 'System Health'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 服務狀態 */}
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                                        {isZh ? '服務狀態' : 'Service Status'}
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries(health.services).map(([service, status]) => (
                                            <div key={service} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                    {service}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {status ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                    <span className={`text-sm ${status ? 'text-green-600' : 'text-red-600'}`}>
                                                        {status ? (isZh ? '正常' : 'Up') : (isZh ? '異常' : 'Down')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 系統資源 */}
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                                        {isZh ? '系統資源' : 'System Resources'}
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {isZh ? '記憶體使用' : 'Memory Usage'}
                                                </span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {formatBytes(health.memory.used)} / {formatBytes(health.memory.total)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${health.memory.percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {isZh ? 'CPU使用率' : 'CPU Usage'}
                                                </span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {Math.round(health.cpu.usage)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${health.cpu.usage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {isZh ? '最近事件' : 'Recent Events'}
                                </h3>

                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700">
                                        <option value="all">{isZh ? '全部' : 'All'}</option>
                                        <option value="error">{isZh ? '錯誤' : 'Errors'}</option>
                                        <option value="performance">{isZh ? '效能' : 'Performance'}</option>
                                        <option value="security">{isZh ? '安全性' : 'Security'}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {events.slice().reverse().map(event => (
                                    <div
                                        key={event.id}
                                        className={`p-4 rounded-lg border ${getEventTypeColor(event.type)} dark:bg-opacity-20`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium uppercase tracking-wide">
                                                        {event.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(event.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium">{event.action}</p>
                                                {Object.keys(event.data).length > 0 && (
                                                    <div className="mt-2 text-xs opacity-75">
                                                        <pre className="whitespace-pre-wrap">
                                                            {JSON.stringify(event.data, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 底部操作欄 */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {isZh ? '最後更新：' : 'Last updated: '}
                        {health ? new Date(health.lastChecked).toLocaleString() : '--'}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                // 導出監控數據
                                const dataStr = JSON.stringify({
                                    health,
                                    metrics,
                                    events: events.slice(-100)
                                }, null, 2);
                                const blob = new Blob([dataStr], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `monitoring-data-${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {isZh ? '導出數據' : 'Export Data'}
                        </button>

                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isZh ? '關閉' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};