import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import {
    Activity, TrendingUp, AlertTriangle, CheckCircle,
    Clock, Zap, Monitor, Users, BarChart3, RefreshCw
} from 'lucide-react';
import { useMonitoring } from '../services/monitoring';
import { useAnalytics } from '../services/analytics';
import { useProductionMonitoring } from '../src/utils/production-monitoring';

interface PerformanceMetrics {
    FCP: number | undefined;
    LCP: number | undefined;
    CLS: number | undefined;
    FID: number | undefined;
    TTFB: number | undefined;
    componentRenderTime: number | undefined;
    apiResponseTime: number | undefined;
    memoryUsage: number | undefined;
    errorRate: number | undefined;
}

interface CoreWebVitals {
    FCP: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    LCP: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    CLS: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    FID: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    TTFB: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
}

export const PerformanceDashboard: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { getPerformanceMetrics, getRecentEvents, getSystemHealth } = useMonitoring();
    const { getMetrics: getAnalyticsMetrics } = useAnalytics();
    const { trackPerformanceMetric, getStatus } = useProductionMonitoring();

    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const [systemHealth, setSystemHealth] = useState<any>(null);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [monitoringStatus, setMonitoringStatus] = useState<any>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = async () => {
        setIsRefreshing(true);
        try {
            const [perfMetrics, healthData, analyticsMetrics, monitorStatus] = await Promise.all([
                Promise.resolve(getPerformanceMetrics()),
                getSystemHealth(),
                Promise.resolve(getAnalyticsMetrics()),
                Promise.resolve(getStatus())
            ]);

            setMetrics(perfMetrics);
            setSystemHealth(healthData);
            setAnalyticsData(analyticsMetrics);
            setMonitoringStatus(monitorStatus);
        } catch (error) {
            console.error('Failed to load performance data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
        // 每30秒自動刷新
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const coreWebVitals: CoreWebVitals = useMemo(() => {
        const getRating = (metric: keyof PerformanceMetrics, good: number, poor: number) => {
            const value = metrics?.[metric];
            if (value === undefined) return { value: 0, rating: 'needs-improvement' as const };

            let rating: 'good' | 'needs-improvement' | 'poor' = 'good';
            if (metric === 'CLS') {
                // CLS: 越小越好
                rating = value <= good ? 'good' : value <= poor ? 'needs-improvement' : 'poor';
            } else {
                // 其他指標: 越小越好
                rating = value <= good ? 'good' : value <= poor ? 'needs-improvement' : 'poor';
            }

            return { value, rating };
        };

        return {
            FCP: getRating('FCP', 1800, 3000),
            LCP: getRating('LCP', 2500, 4000),
            CLS: getRating('CLS', 0.1, 0.25),
            FID: getRating('FID', 100, 300),
            TTFB: getRating('TTFB', 800, 1800)
        };
    }, [metrics]);

    const getRatingColor = (rating: string) => {
        switch (rating) {
            case 'good': return 'text-green-400';
            case 'needs-improvement': return 'text-yellow-400';
            case 'poor': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getRatingIcon = (rating: string) => {
        switch (rating) {
            case 'good': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'needs-improvement': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case 'poor': return <AlertTriangle className="w-4 h-4 text-red-400" />;
            default: return <Monitor className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatMetric = (value: number | undefined, unit: string = 'ms') => {
        if (value === undefined) return isZh ? '未測量' : 'Not measured';
        if (unit === 'ms') return `${Math.round(value)}ms`;
        if (unit === 's') return `${(value / 1000).toFixed(2)}s`;
        if (unit === 'MB') return `${(value / 1024 / 1024).toFixed(2)}MB`;
        return value.toString();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">
                        {isZh ? '效能監控儀表板' : 'Performance Monitoring Dashboard'}
                    </h2>
                </div>
                <button
                    onClick={loadData}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isZh ? '刷新' : 'Refresh'}
                </button>
            </div>

            {/* 監控狀態 */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    {isZh ? '監控狀態' : 'Monitoring Status'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${monitoringStatus?.initialized ? 'text-green-400' : 'text-red-400'}`}>
                            {monitoringStatus?.initialized ? '✓' : '✗'}
                        </div>
                        <div className="text-sm text-gray-400">
                            {isZh ? '本地監控' : 'Local Monitoring'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                            {monitoringStatus?.providers?.length || 0}
                        </div>
                        <div className="text-sm text-gray-400">
                            {isZh ? '外部服務' : 'External Services'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${systemHealth?.status === 'healthy' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {systemHealth?.status === 'healthy' ? '✓' : '⚠'}
                        </div>
                        <div className="text-sm text-gray-400">
                            {isZh ? '系統健康' : 'System Health'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                            {analyticsData?.activeUsers || 0}
                        </div>
                        <div className="text-sm text-gray-400">
                            {isZh ? '活躍用戶' : 'Active Users'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Web Vitals */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    {isZh ? 'Core Web Vitals' : 'Core Web Vitals'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(coreWebVitals).map(([metric, data]) => (
                        <div key={metric} className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-400">{metric}</span>
                                {getRatingIcon(data.rating)}
                            </div>
                            <div className={`text-xl font-bold ${getRatingColor(data.rating)}`}>
                                {metric === 'CLS' ? data.value.toFixed(3) : formatMetric(data.value)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {data.rating === 'good' && (isZh ? '良好' : 'Good')}
                                {data.rating === 'needs-improvement' && (isZh ? '需改進' : 'Needs Improvement')}
                                {data.rating === 'poor' && (isZh ? '較差' : 'Poor')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 效能指標 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-bento p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        {isZh ? '效能指標' : 'Performance Metrics'}
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{isZh ? '組件渲染時間' : 'Component Render Time'}</span>
                            <span className="text-white font-medium">{formatMetric(metrics?.componentRenderTime)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{isZh ? 'API響應時間' : 'API Response Time'}</span>
                            <span className="text-white font-medium">{formatMetric(metrics?.apiResponseTime)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{isZh ? '記憶體使用量' : 'Memory Usage'}</span>
                            <span className="text-white font-medium">{formatMetric(metrics?.memoryUsage, 'MB')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{isZh ? '錯誤率' : 'Error Rate'}</span>
                            <span className="text-white font-medium">{metrics?.errorRate ? `${metrics.errorRate.toFixed(2)}%` : '0%'}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        {isZh ? '用戶分析' : 'User Analytics'}
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{isZh ? '總用戶數' : 'Total Users'}</span>
                            <span className="text-white font-medium">{analyticsData?.totalUsers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{isZh ? '活躍用戶' : 'Active Users'}</span>
                            <span className="text-white font-medium">{analyticsData?.activeUsers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{isZh ? '新用戶' : 'New Users'}</span>
                            <span className="text-white font-medium">{analyticsData?.newUsers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{isZh ? '平均會話時長' : 'Avg. Session Duration'}</span>
                            <span className="text-white font-medium">{formatMetric(analyticsData?.sessionDuration, 's')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 系統健康狀態 */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-purple-400" />
                    {isZh ? '系統健康狀態' : 'System Health Status'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                            {Math.round(systemHealth?.uptime / 1000 / 60) || 0}
                        </div>
                        <div className="text-sm text-gray-400">
                            {isZh ? '運行時間(分鐘)' : 'Uptime (min)'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                            {systemHealth?.memory.percentage || 0}%
                        </div>
                        <div className="text-sm text-gray-400">
                            {isZh ? '記憶體使用率' : 'Memory Usage'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                            {systemHealth?.cpu.usage || 0}%
                        </div>
                        <div className="text-sm text-gray-400">
                            {isZh ? 'CPU使用率' : 'CPU Usage'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${systemHealth?.services.database ? 'text-green-400' : 'text-red-400'}`}>
                            {systemHealth?.services.database ? '✓' : '✗'}
                        </div>
                        <div className="text-sm text-gray-400">
                            {isZh ? '資料庫' : 'Database'}
                        </div>
                    </div>
                </div>
            </div>

            {/* 最近事件 */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-400" />
                    {isZh ? '最近事件' : 'Recent Events'}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {getRecentEvents(10).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                    event.type === 'error' ? 'bg-red-400' :
                                    event.type === 'performance' ? 'bg-blue-400' :
                                    event.type === 'user_action' ? 'bg-green-400' :
                                    'bg-gray-400'
                                }`} />
                                <div>
                                    <div className="text-sm font-medium text-white">{event.action}</div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(event.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">{event.category}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};