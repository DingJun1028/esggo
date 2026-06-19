// 分析儀表板元件
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import {
    BarChart3, TrendingUp, Users, Eye, Clock, Target,
    Activity, Download, Filter, Calendar, PieChart,
    ArrowUp, ArrowDown, Minus, RefreshCw, Settings, X, CheckCircle, DollarSign, AlertTriangle
} from 'lucide-react';
import { analyticsService, AnalyticsMetrics, UserEvent, ABTest } from '../services/analytics';
import { useResponsive } from '../hooks/useResponsive';

interface AnalyticsDashboardProps {
    language: Language;
    isOpen: boolean;
    onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
    language,
    isOpen,
    onClose
}) => {
    const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
    const [events, setEvents] = useState<UserEvent[]>([]);
    const [abTests, setAbTests] = useState<ABTest[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'engagement' | 'conversion' | 'technical' | 'abtests'>('overview');
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const { isMobile } = useResponsive();

    const isZh = language === 'zh-TW';

    useEffect(() => {
        if (!isOpen) return;

        const updateData = () => {
            try {
                const metricsData = analyticsService.getMetrics();
                const eventsData = analyticsService.getEvents(100);
                const abTestsData = analyticsService.getABTests();

                setMetrics(metricsData);
                setEvents(eventsData);
                setAbTests(abTestsData);
            } catch (error) {
                console.error('Failed to fetch analytics data:', error);
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

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatPercentage = (value: number, total: number): string => {
        if (total === 0) return '0%';
        return ((value / total) * 100).toFixed(1) + '%';
    };

    const getChangeIndicator = (current: number, previous: number) => {
        if (previous === 0) return { icon: Minus, color: 'text-gray-500', text: '--' };

        const change = ((current - previous) / previous) * 100;
        const isPositive = change > 0;
        const isNegative = change < 0;

        return {
            icon: isPositive ? ArrowUp : isNegative ? ArrowDown : Minus,
            color: isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500',
            text: Math.abs(change).toFixed(1) + '%'
        };
    };

    const MetricCard: React.FC<{
        title: string;
        value: string | number;
        icon: React.ElementType;
        change?: { icon: React.ElementType; color: string; text: string };
        subtitle?: string;
    }> = ({ title, value, icon: Icon, change, subtitle }) => (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
                        )}
                    </div>
                </div>
                {change && (
                    <div className={`flex items-center gap-1 ${change.color}`}>
                        <change.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{change.text}</span>
                    </div>
                )}
            </div>
        </div>
    );

    if (!isOpen || !metrics) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`${isMobile ? 'w-full h-full' : 'max-w-7xl w-full max-h-[95vh]'} bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col`}>
                {/* 標題欄 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {isZh ? '分析儀表板' : 'Analytics Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* 時間範圍選擇器 */}
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as any)}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        >
                            <option value="24h">{isZh ? '24小時' : '24 Hours'}</option>
                            <option value="7d">{isZh ? '7天' : '7 Days'}</option>
                            <option value="30d">{isZh ? '30天' : '30 Days'}</option>
                        </select>

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
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 標籤頁 */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {[
                        { id: 'overview', label: isZh ? '總覽' : 'Overview', icon: BarChart3 },
                        { id: 'users', label: isZh ? '用戶' : 'Users', icon: Users },
                        { id: 'engagement', label: isZh ? '參與' : 'Engagement', icon: Activity },
                        { id: 'conversion', label: isZh ? '轉換' : 'Conversion', icon: Target },
                        { id: 'technical', label: isZh ? '技術' : 'Technical', icon: Settings },
                        { id: 'abtests', label: isZh ? 'A/B測試' : 'A/B Tests', icon: PieChart }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
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
                        <div className="space-y-6">
                            {/* 關鍵指標網格 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard
                                    title={isZh ? '活躍用戶' : 'Active Users'}
                                    value={formatNumber(metrics.activeUsers)}
                                    icon={Users}
                                    subtitle={isZh ? '過去24小時' : 'Last 24h'}
                                />

                                <MetricCard
                                    title={isZh ? '頁面瀏覽' : 'Page Views'}
                                    value={formatNumber(metrics.pageViews)}
                                    icon={Eye}
                                />

                                <MetricCard
                                    title={isZh ? '平均會話時長' : 'Avg. Session'}
                                    value={`${Math.round(metrics.sessionDuration / 1000 / 60)}m`}
                                    icon={Clock}
                                />

                                <MetricCard
                                    title={isZh ? '跳出率' : 'Bounce Rate'}
                                    value={`${metrics.bounceRate.toFixed(1)}%`}
                                    icon={TrendingUp}
                                />
                            </div>

                            {/* ESG特定指標 */}
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {isZh ? 'ESG參與指標' : 'ESG Engagement Metrics'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600 mb-2">
                                            {metrics.esgEngagementScore.toFixed(1)}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isZh ? '參與度評分' : 'Engagement Score'}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                            {metrics.carbonFootprintReduction.toFixed(0)}kg
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isZh ? '碳減排量' : 'Carbon Reduction'}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600 mb-2">
                                            {metrics.learningCompletionRate.toFixed(1)}%
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isZh ? '學習完成率' : 'Learning Completion'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isZh ? '用戶分析' : 'User Analytics'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard
                                    title={isZh ? '總用戶數' : 'Total Users'}
                                    value={formatNumber(metrics.totalUsers)}
                                    icon={Users}
                                />

                                <MetricCard
                                    title={isZh ? '新用戶' : 'New Users'}
                                    value={formatNumber(metrics.newUsers)}
                                    icon={TrendingUp}
                                />

                                <MetricCard
                                    title={isZh ? '回訪用戶' : 'Returning Users'}
                                    value={formatNumber(metrics.returningUsers)}
                                    icon={RefreshCw}
                                />

                                <MetricCard
                                    title={isZh ? '用戶參與率' : 'Engagement Rate'}
                                    value={`${metrics.engagementRate.toFixed(1)}%`}
                                    icon={Activity}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'engagement' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isZh ? '用戶參與分析' : 'User Engagement Analysis'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                                        {isZh ? '參與事件類型' : 'Engagement Event Types'}
                                    </h4>
                                    <div className="space-y-3">
                                        {['page_view', 'click', 'form_submit', 'engagement'].map(type => {
                                            const count = events.filter(e => e.eventType === type).length;
                                            const percentage = events.length > 0 ? (count / events.length) * 100 : 0;

                                            return (
                                                <div key={type} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                        {type.replace('_', ' ')}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-900 dark:text-white w-12 text-right">
                                                            {percentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                                        {isZh ? '設備類型分佈' : 'Device Type Distribution'}
                                    </h4>
                                    <div className="space-y-3">
                                        {['desktop', 'tablet', 'mobile'].map(device => {
                                            const count = events.filter(e => e.deviceInfo.deviceType === device).length;
                                            const percentage = events.length > 0 ? (count / events.length) * 100 : 0;

                                            return (
                                                <div key={device} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                        {device}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    device === 'desktop' ? 'bg-green-600' :
                                                                    device === 'tablet' ? 'bg-yellow-600' : 'bg-red-600'
                                                                }`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-900 dark:text-white w-12 text-right">
                                                            {percentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'conversion' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isZh ? '轉換分析' : 'Conversion Analysis'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard
                                    title={isZh ? '轉換率' : 'Conversion Rate'}
                                    value={`${metrics.conversionRate.toFixed(1)}%`}
                                    icon={Target}
                                />

                                <MetricCard
                                    title={isZh ? '目標完成' : 'Goal Completions'}
                                    value={formatNumber(metrics.goalCompletions)}
                                    icon={CheckCircle}
                                />

                                <MetricCard
                                    title={isZh ? '營收' : 'Revenue'}
                                    value={`$${formatNumber(metrics.revenue)}`}
                                    icon={DollarSign}
                                />

                                <MetricCard
                                    title={isZh ? '平均訂單價值' : 'Avg. Order Value'}
                                    value={`$${metrics.goalCompletions > 0 ? (metrics.revenue / metrics.goalCompletions).toFixed(0) : '0'}`}
                                    icon={TrendingUp}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'technical' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isZh ? '技術指標' : 'Technical Metrics'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard
                                    title={isZh ? '載入時間' : 'Load Time'}
                                    value={`${metrics.loadTime.toFixed(0)}ms`}
                                    icon={Clock}
                                />

                                <MetricCard
                                    title={isZh ? '錯誤率' : 'Error Rate'}
                                    value={`${metrics.errorRate.toFixed(2)}%`}
                                    icon={AlertTriangle}
                                />

                                <MetricCard
                                    title={isZh ? 'API響應時間' : 'API Response Time'}
                                    value={`${metrics.apiResponseTime.toFixed(0)}ms`}
                                    icon={Activity}
                                />

                                <MetricCard
                                    title={isZh ? 'Core Web Vitals' : 'Core Web Vitals'}
                                    value="檢查中"
                                    icon={Settings}
                                    subtitle={isZh ? 'LCP, FID, CLS' : 'LCP, FID, CLS'}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'abtests' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {isZh ? 'A/B測試' : 'A/B Tests'}
                                </h3>

                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    {isZh ? '創建測試' : 'Create Test'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {abTests.map(test => (
                                    <div key={test.id} className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {test.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {test.description}
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                test.status === 'running' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                test.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                test.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                            }`}>
                                                {test.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {test.variants.map(variant => (
                                                <div key={variant.id} className="bg-gray-50 dark:bg-gray-600 p-4 rounded">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {variant.name}
                                                        </span>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {variant.users} users
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        轉換率: {variant.users > 0 ? ((variant.conversions / variant.users) * 100).toFixed(1) : 0}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {test.winner && (
                                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <p className="text-sm text-green-800 dark:text-green-200">
                                                    🏆 {isZh ? '獲勝變體' : 'Winning Variant'}: {test.variants.find(v => v.id === test.winner)?.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {abTests.length === 0 && (
                                    <div className="text-center py-12">
                                        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {isZh ? '尚未創建任何A/B測試' : 'No A/B tests created yet'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 底部操作欄 */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {isZh ? '最後更新：' : 'Last updated: '}
                        {new Date().toLocaleString()}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                // 導出分析數據
                                const data = analyticsService.exportData();
                                const dataStr = JSON.stringify(data, null, 2);
                                const blob = new Blob([dataStr], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
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