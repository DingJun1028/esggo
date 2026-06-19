import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import {
    Zap, Database, Link, Activity, AlertCircle, CheckCircle,
    RefreshCw, Settings, ExternalLink, Server, Cloud, Globe,
    ArrowRight, Wifi, WifiOff, Shield, Clock, BarChart3
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface IntegrationService {
    id: string;
    name: string;
    category: 'erp' | 'crm' | 'reporting' | 'monitoring' | 'ai';
    status: 'connected' | 'disconnected' | 'error' | 'syncing';
    lastSync: number;
    dataPoints: number;
    errorCount: number;
    description: string;
}

const INTEGRATION_SERVICES: IntegrationService[] = [
    {
        id: 'sap-erp',
        name: 'SAP ERP',
        category: 'erp',
        status: 'connected',
        lastSync: Date.now() - 300000, // 5 minutes ago
        dataPoints: 125000,
        errorCount: 0,
        description: '企業資源規劃系統集成'
    },
    {
        id: 'salesforce-crm',
        name: 'Salesforce CRM',
        category: 'crm',
        status: 'connected',
        lastSync: Date.now() - 600000, // 10 minutes ago
        dataPoints: 89000,
        errorCount: 2,
        description: '客戶關係管理數據同步'
    },
    {
        id: 'oracle-reporting',
        name: 'Oracle Reporting',
        category: 'reporting',
        status: 'syncing',
        lastSync: Date.now() - 120000, // 2 minutes ago
        dataPoints: 67000,
        errorCount: 0,
        description: '財務報表自動生成系統'
    },
    {
        id: 'datadog-monitoring',
        name: 'DataDog Monitoring',
        category: 'monitoring',
        status: 'connected',
        lastSync: Date.now() - 180000, // 3 minutes ago
        dataPoints: 45000,
        errorCount: 1,
        description: '實時監控與告警系統'
    },
    {
        id: 'openai-gpt',
        name: 'OpenAI GPT-4',
        category: 'ai',
        status: 'connected',
        lastSync: Date.now() - 60000, // 1 minute ago
        dataPoints: 23000,
        errorCount: 0,
        description: 'AI 分析與洞察生成'
    },
    {
        id: 'microsoft-dynamics',
        name: 'Microsoft Dynamics',
        category: 'erp',
        status: 'error',
        lastSync: Date.now() - 3600000, // 1 hour ago
        dataPoints: 0,
        errorCount: 15,
        description: '企業動態管理系統'
    }
];

export const IntegrationHub: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { addAuditLog, awardXp } = useCompany();

    const [services, setServices] = useState<IntegrationService[]>(INTEGRATION_SERVICES);
    const [selectedService, setSelectedService] = useState<IntegrationService | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Calculate overall health metrics
    const healthMetrics = useMemo(() => {
        const totalServices = services.length;
        const connectedServices = services.filter(s => s.status === 'connected').length;
        const syncingServices = services.filter(s => s.status === 'syncing').length;
        const errorServices = services.filter(s => s.status === 'error').length;
        const totalDataPoints = services.reduce((sum, s) => sum + s.dataPoints, 0);
        const totalErrors = services.reduce((sum, s) => sum + s.errorCount, 0);

        const healthScore = Math.round(((connectedServices + syncingServices * 0.5) / totalServices) * 100);

        return {
            healthScore,
            connectedServices,
            totalServices,
            totalDataPoints,
            totalErrors,
            uptime: 99.7 // Mock uptime percentage
        };
    }, [services]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
            case 'error': return <AlertCircle className="w-4 h-4 text-rose-400" />;
            case 'disconnected': return <WifiOff className="w-4 h-4 text-gray-400" />;
            default: return <Wifi className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'border-emerald-500/30 bg-emerald-500/5';
            case 'syncing': return 'border-blue-500/30 bg-blue-500/5';
            case 'error': return 'border-rose-500/30 bg-rose-500/5';
            case 'disconnected': return 'border-gray-500/30 bg-gray-500/5';
            default: return 'border-gray-500/30 bg-gray-500/5';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'erp': return <Database className="w-4 h-4" />;
            case 'crm': return <Users className="w-4 h-4" />;
            case 'reporting': return <BarChart3 className="w-4 h-4" />;
            case 'monitoring': return <Activity className="w-4 h-4" />;
            case 'ai': return <Zap className="w-4 h-4" />;
            default: return <Server className="w-4 h-4" />;
        }
    };

    const refreshAllServices = async () => {
        setIsRefreshing(true);
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 2000));

        setServices(prev => prev.map(service => ({
            ...service,
            lastSync: Date.now(),
            status: Math.random() > 0.1 ? 'connected' : 'error' as any,
            dataPoints: service.dataPoints + Math.floor(Math.random() * 1000)
        })));

        addAuditLog('集成服務刷新', '所有外部服務狀態已更新');
        awardXp(50);
        setIsRefreshing(false);
    };

    const reconnectService = async (serviceId: string) => {
        setServices(prev => prev.map(service =>
            service.id === serviceId
                ? { ...service, status: 'syncing' as any }
                : service
        ));

        // Simulate reconnection
        await new Promise(resolve => setTimeout(resolve, 1500));

        setServices(prev => prev.map(service =>
            service.id === serviceId
                ? { ...service, status: 'connected' as any, lastSync: Date.now(), errorCount: 0 }
                : service
        ));

        addAuditLog(`服務重連: ${serviceId}`, '服務已成功重連');
    };

    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    };

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader
                    icon={Link}
                    title={{ zh: '集成中樞 (Integration Hub)', en: 'Integration Hub' }}
                    description={{ zh: '外部系統連接與數據管道管理', en: 'External Systems & Data Pipeline Management.' }}
                    language={language}
                    tag={{ zh: '數據流 v2.8', en: 'DATAFLOW_v2.8' }}
                />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
                {/* 1. 系統健康總覽 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-4 bg-slate-950 border-white/10 rounded-[2rem] text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{isZh ? '系統健康度' : 'System Health'}</h3>
                        <div className="text-3xl font-mono font-black text-white mb-2">{healthMetrics.healthScore}%</div>
                        <div className="text-sm text-gray-400">{isZh ? '正常運行' : 'Operational'}</div>
                    </div>

                    <div className="glass-bento p-4 bg-slate-900/60 border-white/10 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            {isZh ? '健康指標' : 'Health Metrics'}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">{isZh ? '連接服務' : 'Connected'}</span>
                                <span className="text-sm font-mono text-emerald-400">{healthMetrics.connectedServices}/{healthMetrics.totalServices}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">{isZh ? '數據點' : 'Data Points'}</span>
                                <span className="text-sm font-mono text-blue-400">{healthMetrics.totalDataPoints.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">{isZh ? '錯誤數' : 'Errors'}</span>
                                <span className="text-sm font-mono text-rose-400">{healthMetrics.totalErrors}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">{isZh ? '正常運行時間' : 'Uptime'}</span>
                                <span className="text-sm font-mono text-purple-400">{healthMetrics.uptime}%</span>
                            </div>
                        </div>

                        <button
                            onClick={refreshAllServices}
                            disabled={isRefreshing}
                            className="w-full py-3 bg-emerald-500 text-black font-black text-sm uppercase rounded-xl shadow-lg hover:bg-emerald-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            {isRefreshing ? (isZh ? '刷新中...' : 'Refreshing...') : (isZh ? '刷新所有' : 'Refresh All')}
                        </button>
                    </div>
                </div>

                {/* 2. 服務集成狀態 (6/12) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 flex flex-col bg-slate-950 border-white/10 min-h-0 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><Server className="w-3.5 h-3.5 text-blue-400" /> Integration_Status_Matrix</h3>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-500">
                                    <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                                    {healthMetrics.connectedServices}
                                </div>
                                <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-500">
                                    <RefreshCw className="w-2.5 h-2.5 text-blue-400" />
                                    {services.filter(s => s.status === 'syncing').length}
                                </div>
                                <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-500">
                                    <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
                                    {services.filter(s => s.status === 'error').length}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-auto space-y-3">
                            {services.map(service => (
                                <div
                                    key={service.id}
                                    className={`glass-bento p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer group ${
                                        getStatusColor(service.status)
                                    }`}
                                    onClick={() => setSelectedService(service)}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(service.status)}
                                            <div>
                                                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{service.name}</h4>
                                                <div className="text-[10px] text-gray-500 uppercase font-black">{service.category}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getCategoryIcon(service.category)}
                                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-sm font-mono font-bold text-white">{service.dataPoints.toLocaleString()}</div>
                                            <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '數據點' : 'Data Points'}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-mono font-bold text-white">{service.errorCount}</div>
                                            <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '錯誤' : 'Errors'}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-mono font-bold text-white">{formatTimeAgo(service.lastSync)}</div>
                                            <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '上次同步' : 'Last Sync'}</div>
                                        </div>
                                    </div>

                                    {service.status === 'error' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                reconnectService(service.id);
                                            }}
                                            className="w-full mt-3 py-2 bg-rose-500 text-white font-bold text-[10px] uppercase rounded-xl hover:bg-rose-400 transition-all"
                                        >
                                            {isZh ? '重新連接' : 'Reconnect'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. 數據管道視覺化 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
                    {selectedService ? (
                        <div className="flex-1 glass-bento p-4 flex flex-col bg-slate-900/60 border-white/10 min-h-0 rounded-[2rem]">
                            <div className="flex items-center gap-3 mb-4">
                                {getCategoryIcon(selectedService.category)}
                                <div>
                                    <h4 className="text-sm font-bold text-white">{selectedService.name}</h4>
                                    <div className="text-[10px] text-gray-500 uppercase font-black">{selectedService.category}</div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '服務描述' : 'Description'}</div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">{selectedService.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                        <div className="text-lg font-mono font-bold text-white">{selectedService.dataPoints.toLocaleString()}</div>
                                        <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '數據點' : 'Data Points'}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                        <div className="text-lg font-mono font-bold text-white">{selectedService.errorCount}</div>
                                        <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '錯誤' : 'Errors'}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '連接狀態' : 'Connection Status'}</div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(selectedService.status)}
                                        <span className="text-sm font-medium text-white capitalize">{selectedService.status}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">
                                        {isZh ? '上次同步' : 'Last sync'}: {formatTimeAgo(selectedService.lastSync)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '數據流管道' : 'Data Pipeline'}</div>
                                    <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Cloud className="w-4 h-4 text-blue-400" />
                                            <span className="text-[10px] font-bold text-blue-400">{isZh ? '數據源' : 'Data Source'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <ArrowRight className="w-3 h-3 text-gray-600" />
                                            <span className="text-[10px] text-gray-400">{isZh ? 'API 轉換' : 'API Transform'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Database className="w-4 h-4 text-emerald-400" />
                                            <span className="text-[10px] font-bold text-emerald-400">{isZh ? 'ESG 數據庫' : 'ESG Database'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 glass-bento p-4 flex flex-col items-center justify-center bg-slate-900/40 border-white/5 min-h-0 rounded-[2rem] text-center">
                            <Server className="w-12 h-12 text-gray-600 mb-4" />
                            <div className="text-sm text-gray-500">{isZh ? '選擇一個服務查看詳情' : 'Select a service to view details'}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};