/**
 * 🎯 IntegrationHubPage - 系統整合樞紐儀表板
 * 
 * 功能：
 * - 全域整合狀態監控
 * - 模組狀態總覽
 * - 工作流程管理
 * - 事件流追蹤
 * - 跨模組數據同步
 * 
 * @version 1.0.0
 * @date 2026-02-08
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Network, Activity, Zap, ArrowRight, RefreshCw, Settings,
    Database, GitBranch, Bell, CheckCircle, AlertCircle,
    Play, Pause, Eye, MoreVertical, ChevronRight, Layers,
    Server, Globe, Briefcase, DollarSign, FileText, BrainCircuit
} from 'lucide-react';
import EsgServiceLayout from '@/components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { integrationHub, EventType, ModuleName } from '@/services/integration/ESGIntegrationHub';

// Types
interface ModuleStatus {
    name: string;
    icon: React.ElementType;
    status: 'active' | 'idle' | 'processing' | 'error';
    lastSync: string;
    pendingChanges: number;
    color: string;
}

interface WorkflowStatus {
    id: string;
    name: string;
    source: string;
    target: string;
    status: 'active' | 'paused' | 'completed';
    trigger: string;
    executions: number;
}

interface EventLog {
    id: string;
    type: string;
    source: string;
    target: string;
    timestamp: string;
    status: 'success' | 'pending' | 'error';
}

// Mock Data
const MODULE_STATUS: ModuleStatus[] = [
    { name: 'CRM 客戶管理', icon: Briefcase, status: 'active', lastSync: '2026-02-08 13:45', pendingChanges: 3, color: '#3b82f6' },
    { name: 'AGENCY 代理聯盟', icon: Globe, status: 'active', lastSync: '2026-02-08 13:44', pendingChanges: 1, color: '#22c55e' },
    { name: 'FINANCE 財務管理', icon: DollarSign, status: 'idle', lastSync: '2026-02-08 13:30', pendingChanges: 0, color: '#f59e0b' },
    { name: 'REPORT 報告書', icon: FileText, status: 'processing', lastSync: '2026-02-08 13:45', pendingChanges: 5, color: '#8b5cf6' },
    { name: 'OCR 文件解析', icon: Activity, status: 'active', lastSync: '2026-02-08 13:44', pendingChanges: 2, color: '#ec4899' },
    { name: 'ANALYTICS 分析', icon: BrainCircuit, status: 'active', lastSync: '2026-02-08 13:45', pendingChanges: 0, color: '#06b6d4' },
];

const WORKFLOW_STATUS: WorkflowStatus[] = [
    { id: 'crm_to_report', name: '客戶專案 → 報告書生成', source: 'CRM', target: 'REPORT', status: 'active', trigger: 'DATA_UPDATED', executions: 128 },
    { id: 'agency_to_finance', name: '代理分潤 → 財務核算', source: 'AGENCY', target: 'FINANCE', status: 'active', trigger: 'COMMISSION_CALCULATED', executions: 45 },
    { id: 'report_to_analytics', name: '報告書 → 數據分析', source: 'REPORT', target: 'ANALYTICS', status: 'active', trigger: 'REPORT_GENERATED', executions: 67 },
    { id: 'ocr_to_report', name: '文件解析 → 報告書萃取', source: 'OCR', target: 'REPORT', status: 'paused', trigger: 'DATA_CREATED', executions: 23 },
];

const EVENT_LOGS: EventLog[] = [
    { id: 'e1', type: 'DATA_UPDATED', source: 'CRM', target: 'REPORT', timestamp: '13:45:23', status: 'success' },
    { id: 'e2', type: 'COMMISSION_CALCULATED', source: 'AGENCY', target: 'FINANCE', timestamp: '13:45:12', status: 'success' },
    { id: 'e3', type: 'REPORT_GENERATED', source: 'REPORT', target: 'ANALYTICS', timestamp: '13:44:58', status: 'success' },
    { id: 'e4', type: 'SYNC_REQUIRED', source: 'OCR', target: 'REPORT', timestamp: '13:44:45', status: 'pending' },
    { id: 'e5', type: 'DATA_CREATED', source: 'FINANCE', target: 'CRM', timestamp: '13:44:30', status: 'error' },
];

/**
 * 🎯 IntegrationHubPage
 * 
 * 系統整合樞紐儀表板 - 統一管理所有模組的狀態與數據流
 */
const IntegrationHubPage: React.FC = () => {
    const core = useMemo(() => ComponentCoreFactory.create('IntegrationHubPage'), []);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'events' | 'sync'>('overview');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'idle': return 'bg-slate-500';
            case 'processing': return 'bg-amber-500 animate-pulse';
            case 'error': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="text-center">
                    <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">載入整合樞紐...</p>
                </div>
            </div>
        );
    }

    return (
        <EsgServiceLayout title="系統整合樞紐" activeId="integration_hub" progress={100}>
            <div data-uuid={core.uuid} data-timestamp={core.timestamp} className="animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Hub className="w-8 h-8 text-[#63a6b0]" />
                            系統整合樞紐
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">統一管理所有模組狀態、數據流與工作流程</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleRefresh}
                            className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all ${refreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300">重新整理</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#63a6b0]/20 border border-[#63a6b0]/50 rounded-xl hover:bg-[#63a6b0]/30 transition-all">
                            <Settings className="w-4 h-4 text-[#63a6b0]" />
                            <span className="text-sm text-[#63a6b0]">設定</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                    {[
                        { id: 'overview', label: '總覽', icon: Layers },
                        { id: 'workflows', label: '工作流程', icon: GitBranch },
                        { id: 'events', label: '事件流', icon: Bell },
                        { id: 'sync', label: '數據同步', icon: RefreshCw },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                                activeTab === tab.id 
                                    ? 'bg-[#63a6b0]/20 text-[#63a6b0] border border-[#63a6b0]/50' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="text-sm font-bold">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Module Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {MODULE_STATUS.map((module, index) => (
                                    <motion.div
                                        key={module.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="liquid-glass p-6 hover:bg-white/5 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: `${module.color}20` }}
                                                >
                                                    <module.icon className="w-6 h-6" style={{ color: module.color }} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-white">{module.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                                                        <span className="text-xs text-slate-500 capitalize">{module.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500">最後同步: {module.lastSync}</span>
                                            {module.pendingChanges > 0 && (
                                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                                                    {module.pendingChanges} 待處理
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Integration Flow Diagram */}
                            <div className="liquid-glass p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <Database className="w-5 h-5 text-[#63a6b0]" /> 整合數據流
                                </h3>
                                <div className="flex items-center justify-between px-8">
                                    {['CRM', 'AGENCY', 'REPORT', 'FINANCE', 'ANALYTICS'].map((module, index) => (
                                        <React.Fragment key={module}>
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">{module}</span>
                                                </div>
                                            </div>
                                            {index < 4 && (
                                                <ArrowRight className="w-8 h-8 text-[#63a6b0]" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'workflows' && (
                        <motion.div
                            key="workflows"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {WORKFLOW_STATUS.map((workflow, index) => (
                                <motion.div
                                    key={workflow.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="liquid-glass p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#63a6b0]/20 flex items-center justify-center">
                                                <GitBranch className="w-6 h-6 text-[#63a6b0]" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white">{workflow.name}</h3>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                    <span>{workflow.source}</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                    <span>{workflow.target}</span>
                                                    <span className="ml-2 px-2 py-0.5 bg-white/10 rounded">{workflow.trigger}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">執行次數</p>
                                                <p className="text-lg font-bold text-white">{workflow.executions}</p>
                                            </div>
                                            {workflow.status === 'active' ? (
                                                <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                                                    <Play className="w-3 h-3" /> 運行中
                                                </span>
                                            ) : workflow.status === 'paused' ? (
                                                <span className="flex items-center gap-2 px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs">
                                                    <Pause className="w-3 h-3" /> 已暫停
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                                    <CheckCircle className="w-3 h-3" /> 已完成
                                                </span>
                                            )}
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'events' && (
                        <motion.div
                            key="events"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="liquid-glass p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                        <Bell className="w-5 h-5 text-[#63a6b0]" /> 事件日誌
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> 成功
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <span className="w-2 h-2 rounded-full bg-amber-500" /> 待處理
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <span className="w-2 h-2 rounded-full bg-red-500" /> 錯誤
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {EVENT_LOGS.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                                        >
                                            <div className="flex items-center gap-4">
                                                {event.status === 'success' ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                ) : event.status === 'pending' ? (
                                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-bold text-white">{event.type}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {event.source} → {event.target} • {event.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                                                <Eye className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'sync' && (
                        <motion.div
                            key="sync"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="liquid-glass p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <RefreshCw className="w-5 h-5 text-[#63a6b0]" /> 數據同步管理
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'CRM → REPORT', direction: 'forward', pending: 3, lastSync: '13:45' },
                                        { name: 'AGENCY → FINANCE', direction: 'forward', pending: 1, lastSync: '13:44' },
                                        { name: 'REPORT → ANALYTICS', direction: 'forward', pending: 0, lastSync: '13:45' },
                                        { name: 'OCR → REPORT', direction: 'forward', pending: 2, lastSync: '13:44' },
                                    ].map((sync, index) => (
                                        <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-bold text-white">{sync.name}</span>
                                                <span className={`text-xs ${sync.pending > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                    {sync.pending > 0 ? `${sync.pending} 待同步` : '已同步' }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500">最後同步: {sync.lastSync}</span>
                                                <button className="px-3 py-1 bg-[#63a6b0]/20 text-[#63a6b0] rounded-lg text-xs hover:bg-[#63a6b0]/30 transition-all">
                                                    立即同步
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </EsgServiceLayout>
    );
};

export default IntegrationHubPage;
