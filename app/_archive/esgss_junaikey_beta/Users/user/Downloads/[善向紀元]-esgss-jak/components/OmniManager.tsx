import React, { useState } from 'react';
import { Language } from '../types';
import {
    Settings, Database, Code, Shield, Activity,
    Zap, Server, Globe, Key, Monitor, FileText
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface SystemLog {
    id: string;
    timestamp: number;
    level: 'info' | 'warning' | 'error';
    message: string;
    source: string;
}

const SAMPLE_LOGS: SystemLog[] = [
    {
        id: '1',
        timestamp: Date.now() - 300000,
        level: 'info',
        message: 'AI 模型更新完成',
        source: 'Evolution Engine'
    },
    {
        id: '2',
        timestamp: Date.now() - 600000,
        level: 'warning',
        message: '資料庫連接池達到90%使用率',
        source: 'Database Monitor'
    },
    {
        id: '3',
        timestamp: Date.now() - 900000,
        level: 'error',
        message: '外部API服務暫時不可用',
        source: 'Integration Hub'
    }
];

export const OmniManager: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const {
        externalApiKeys, updateExternalApiKeys,
        auditLogs, addAuditLog
    } = useCompany();

    const [logs] = useState<SystemLog[]>(SAMPLE_LOGS);
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', name: isZh ? '總覽' : 'Overview', icon: Monitor },
        { id: 'apis', name: isZh ? 'API管理' : 'API Management', icon: Key },
        { id: 'data', name: isZh ? '資料管理' : 'Data Registry', icon: Database },
        { id: 'system', name: isZh ? '系統日誌' : 'System Logs', icon: FileText }
    ];

    const getLogLevelColor = (level: string) => {
        switch (level) {
            case 'error': return 'text-rose-400';
            case 'warning': return 'text-amber-400';
            case 'info': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader
                    icon={Settings}
                    title={{ zh: '萬能管理器 (OmniManager)', en: 'OmniManager' }}
                    description={{ zh: 'Nocode後台管理與系統監控', en: 'Nocode Backend & System Monitoring.' }}
                    language={language}
                    tag={{ zh: '系統控制 v5.1', en: 'SYSTEM_CONTROL_v5.1' }}
                />
            </div>

            {/* 標籤頁導航 */}
            <div className="shrink-0 border-b border-white/5">
                <div className="flex gap-1 p-2">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'bg-white text-black'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto p-2">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-12 gap-3">
                        {/* 系統狀態概覽 */}
                        <div className="col-span-12 lg:col-span-6">
                            <div className="glass-bento p-6 bg-slate-950 border-white/10 rounded-[2rem]">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-emerald-400" />
                                    {isZh ? '系統狀態' : 'System Status'}
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                                            <span className="text-white font-medium">{isZh ? '服務狀態' : 'Service Status'}</span>
                                        </div>
                                        <span className="text-emerald-400 font-mono">{isZh ? '正常運行' : 'Operational'}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Database className="w-4 h-4 text-blue-400" />
                                            <span className="text-white font-medium">{isZh ? '資料庫' : 'Database'}</span>
                                        </div>
                                        <span className="text-blue-400 font-mono">99.9% {isZh ? '正常運行時間' : 'Uptime'}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-4 h-4 text-purple-400" />
                                            <span className="text-white font-medium">{isZh ? 'AI 服務' : 'AI Services'}</span>
                                        </div>
                                        <span className="text-purple-400 font-mono">{isZh ? '活躍' : 'Active'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 快速操作 */}
                        <div className="col-span-12 lg:col-span-6">
                            <div className="glass-bento p-6 bg-slate-900/60 border-white/10 rounded-[2rem]">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-amber-400" />
                                    {isZh ? '快速操作' : 'Quick Actions'}
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all text-left">
                                        <div className="text-emerald-400 font-bold text-sm mb-1">{isZh ? '重新整理快取' : 'Refresh Cache'}</div>
                                        <div className="text-[10px] text-emerald-300">{isZh ? '清除系統快取' : 'Clear system cache'}</div>
                                    </button>

                                    <button className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all text-left">
                                        <div className="text-blue-400 font-bold text-sm mb-1">{isZh ? '備份資料' : 'Backup Data'}</div>
                                        <div className="text-[10px] text-blue-300">{isZh ? '建立完整備份' : 'Create full backup'}</div>
                                    </button>

                                    <button className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-all text-left">
                                        <div className="text-purple-400 font-bold text-sm mb-1">{isZh ? '系統診斷' : 'System Diagnostics'}</div>
                                        <div className="text-[10px] text-purple-300">{isZh ? '執行健康檢查' : 'Run health check'}</div>
                                    </button>

                                    <button className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all text-left">
                                        <div className="text-rose-400 font-bold text-sm mb-1">{isZh ? '緊急停止' : 'Emergency Stop'}</div>
                                        <div className="text-[10px] text-rose-300">{isZh ? '停止所有服務' : 'Stop all services'}</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'apis' && (
                    <div className="glass-bento p-6 bg-slate-950 border-white/10 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <Key className="w-5 h-5 text-emerald-400" />
                            {isZh ? 'API 金鑰管理' : 'API Key Management'}
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-xl">
                                <label className="text-sm font-medium text-white mb-2 block">OpenAI API Key</label>
                                <input
                                    type="password"
                                    value={externalApiKeys.openai}
                                    onChange={(e) => updateExternalApiKeys({ openai: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-500/50 focus:outline-none"
                                    placeholder="sk-..."
                                />
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl">
                                <label className="text-sm font-medium text-white mb-2 block">GitHub Token</label>
                                <input
                                    type="password"
                                    value={externalApiKeys.github}
                                    onChange={(e) => updateExternalApiKeys({ github: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-500/50 focus:outline-none"
                                    placeholder="ghp_..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="glass-bento p-6 bg-slate-950 border-white/10 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <Database className="w-5 h-5 text-blue-400" />
                            {isZh ? '萬能資料登錄簿' : 'Omni Data Registry'}
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-xl">
                                <h4 className="text-white font-medium mb-2">{isZh ? 'ESG 指標資料' : 'ESG Metrics Data'}</h4>
                                <div className="text-sm text-gray-400">
                                    {isZh ? '總計記錄' : 'Total Records'}: 1,247 |
                                    {isZh ? '最後更新' : 'Last Updated'}: 2026-01-04 22:36
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl">
                                <h4 className="text-white font-medium mb-2">{isZh ? '區塊鏈交易' : 'Blockchain Transactions'}</h4>
                                <div className="text-sm text-gray-400">
                                    {isZh ? '已驗證交易' : 'Verified Transactions'}: 892 |
                                    {isZh ? '網路狀態' : 'Network Status'}: {isZh ? '正常' : 'Healthy'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'system' && (
                    <div className="glass-bento p-6 bg-slate-950 border-white/10 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-purple-400" />
                            {isZh ? '系統日誌' : 'System Logs'}
                        </h3>

                        <div className="space-y-3 max-h-96 overflow-auto">
                            {[...logs, ...auditLogs.map(log => ({
                                id: log.id,
                                timestamp: log.timestamp,
                                level: 'info' as const,
                                message: log.action,
                                source: 'User Action'
                            }))].map(log => (
                                <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold uppercase ${getLogLevelColor(log.level)}`}>
                                                {log.level}
                                            </span>
                                            <span className="text-xs text-gray-400">{log.source}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-white">{log.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};