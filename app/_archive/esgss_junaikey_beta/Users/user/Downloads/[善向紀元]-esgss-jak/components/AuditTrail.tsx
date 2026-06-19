import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import {
    ShieldCheck, Clock, Hash, Link as LinkIcon, AlertCircle, X,
    FileCheck, Calendar, User, Code, Search, Filter, Eye,
    Database, Lock, CheckCircle2, DollarSign, Link
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface AuditLog {
    id: string;
    timestamp: number;
    action: string;
    user: string;
    details: string;
    hash: string;
    category: 'security' | 'data' | 'financial' | 'compliance' | 'system';
    severity: 'low' | 'medium' | 'high' | 'critical';
    blockchainHash?: string;
}

const SAMPLE_AUDIT_LOGS: AuditLog[] = [
    {
        id: 'log-1',
        timestamp: Date.now() - 300000,
        action: 'ESG數據更新',
        user: 'system',
        details: '環境指標數據已更新，Scope 1排放量: 125.4 tCO2e',
        hash: '0x8f7a1b2c3d4e5f6789abcdef0123456789abcdef',
        category: 'data',
        severity: 'medium',
        blockchainHash: '0xb1c2d3e4f567890123456789abcdef0123456789'
    },
    {
        id: 'log-2',
        timestamp: Date.now() - 600000,
        action: '用戶登入',
        user: 'jun',
        details: '管理員用戶成功登入系統',
        hash: '0x1a2b3c4d5e6f7890123456789abcdef0123456789',
        category: 'security',
        severity: 'low'
    },
    {
        id: 'log-3',
        timestamp: Date.now() - 900000,
        action: '碳權交易',
        user: 'system',
        details: '購買100單位碳權，價值$8,500',
        hash: '0x2b3c4d5e6f7890123456789abcdef0123456789',
        category: 'financial',
        severity: 'high',
        blockchainHash: '0xc2d3e4f567890123456789abcdef0123456789'
    },
    {
        id: 'log-4',
        timestamp: Date.now() - 1200000,
        action: '合規檢查',
        user: 'compliance-bot',
        details: 'GRI標準合規性檢查完成，所有指標均符合要求',
        hash: '0x3c4d5e6f7890123456789abcdef0123456789',
        category: 'compliance',
        severity: 'medium'
    }
];

export const AuditTrail: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { auditLogs: companyAuditLogs } = useCompany();

    const [logs] = useState<AuditLog[]>(SAMPLE_AUDIT_LOGS);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [filter, setFilter] = useState({
        category: 'all',
        severity: 'all',
        search: ''
    });

    // Combine company audit logs with sample logs
    const allLogs = useMemo(() => {
        return [...logs, ...companyAuditLogs.map(log => ({
            id: log.id,
            timestamp: log.timestamp,
            action: log.action,
            user: log.user,
            details: log.details,
            hash: log.hash,
            category: 'system' as const,
            severity: 'medium' as const,
            blockchainHash: (log.hash.startsWith('0x') ? log.hash : undefined) as string | undefined
        }))];
    }, [logs, companyAuditLogs]);

    const filteredLogs = useMemo(() => {
        return allLogs.filter(log => {
            const matchesCategory = filter.category === 'all' || log.category === filter.category;
            const matchesSeverity = filter.severity === 'all' || log.severity === filter.severity;
            const matchesSearch = !filter.search ||
                log.action.toLowerCase().includes(filter.search.toLowerCase()) ||
                log.details.toLowerCase().includes(filter.search.toLowerCase()) ||
                log.user.toLowerCase().includes(filter.search.toLowerCase());

            return matchesCategory && matchesSeverity && matchesSearch;
        });
    }, [allLogs, filter]);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'security': return <ShieldCheck className="w-4 h-4" />;
            case 'data': return <Database className="w-4 h-4" />;
            case 'financial': return <DollarSign className="w-4 h-4" />;
            case 'compliance': return <FileCheck className="w-4 h-4" />;
            case 'system': return <Code className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-rose-400 border-rose-500/30';
            case 'high': return 'text-orange-400 border-orange-500/30';
            case 'medium': return 'text-amber-400 border-amber-500/30';
            case 'low': return 'text-emerald-400 border-emerald-500/30';
            default: return 'text-gray-400 border-gray-500/30';
        }
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    const truncateHash = (hash: string) => {
        if (hash.length <= 12) return hash;
        return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
    };

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader
                    icon={ShieldCheck}
                    title={{ zh: '稽核軌跡 (Audit Trail)', en: 'Audit Trail' }}
                    description={{ zh: '區塊鏈哈希流與不可變操作日誌', en: 'Blockchain Hashes & Immutable Operation Logs.' }}
                    language={language}
                    tag={{ zh: '區塊鏈 v4.2', en: 'BLOCKCHAIN_v4.2' }}
                />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
                {/* 1. 篩選器與統計 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-4 bg-slate-950 border-white/10 rounded-[2rem] text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{isZh ? '總日誌數' : 'Total Logs'}</h3>
                        <div className="text-3xl font-mono font-black text-white mb-2">{allLogs.length}</div>
                        <div className="text-sm text-gray-400">{isZh ? '不可變記錄' : 'Immutable Records'}</div>
                    </div>

                    {/* 篩選器 */}
                    <div className="glass-bento p-4 bg-slate-900/60 border-white/10 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <Filter className="w-4 h-4 text-blue-400" />
                            {isZh ? '篩選器' : 'Filters'}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">{isZh ? '類別' : 'Category'}</label>
                                <select
                                    value={filter.category}
                                    onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none"
                                >
                                    <option value="all">{isZh ? '全部' : 'All'}</option>
                                    <option value="security">{isZh ? '安全' : 'Security'}</option>
                                    <option value="data">{isZh ? '數據' : 'Data'}</option>
                                    <option value="financial">{isZh ? '財務' : 'Financial'}</option>
                                    <option value="compliance">{isZh ? '合規' : 'Compliance'}</option>
                                    <option value="system">{isZh ? '系統' : 'System'}</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">{isZh ? '嚴重性' : 'Severity'}</label>
                                <select
                                    value={filter.severity}
                                    onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none"
                                >
                                    <option value="all">{isZh ? '全部' : 'All'}</option>
                                    <option value="critical">{isZh ? '關鍵' : 'Critical'}</option>
                                    <option value="high">{isZh ? '高' : 'High'}</option>
                                    <option value="medium">{isZh ? '中' : 'Medium'}</option>
                                    <option value="low">{isZh ? '低' : 'Low'}</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">{isZh ? '搜尋' : 'Search'}</label>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={filter.search}
                                        onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                                        placeholder={isZh ? '搜尋操作...' : 'Search actions...'}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 日誌列表 (6/12) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 flex flex-col bg-slate-950 border-white/10 min-h-0 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-emerald-400" /> Immutable_Audit_Logs</h3>
                            <div className="text-sm text-gray-400">
                                {isZh ? '顯示' : 'Showing'} {filteredLogs.length} {isZh ? '條記錄' : 'records'}
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-auto space-y-3">
                            {filteredLogs.map(log => (
                                <div
                                    key={log.id}
                                    className={`glass-bento p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer group ${selectedLog?.id === log.id
                                            ? 'border-white/30 bg-white/5'
                                            : 'border-white/10 bg-slate-900/40'
                                        }`}
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-xl ${getSeverityColor(log.severity)}`}>
                                                {getCategoryIcon(log.category)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                                                    {log.action}
                                                </h4>
                                                <div className="text-[10px] text-gray-500 uppercase font-black mt-1">
                                                    {log.user} • {formatTimestamp(log.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[8px] text-gray-500 uppercase font-black mb-1">
                                                {log.severity}
                                            </div>
                                            {log.blockchainHash && (
                                                <div className="flex items-center gap-1 text-[8px] text-emerald-400 uppercase font-black">
                                                    <Link className="w-3 h-3" />
                                                    {isZh ? '鏈上' : 'On-chain'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-gray-400 mb-3 line-clamp-2">{log.details}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-mono text-gray-500">
                                            Hash: {truncateHash(log.hash)}
                                        </div>
                                        <button className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {isZh ? '詳情' : 'Details'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. 日誌詳情與區塊鏈驗證 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
                    {selectedLog ? (
                        <div className="flex-1 glass-bento p-4 flex flex-col bg-slate-900/60 border-white/10 min-h-0 rounded-[2rem]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl ${getSeverityColor(selectedLog.severity)}`}>
                                    {getCategoryIcon(selectedLog.category)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{selectedLog.action}</h4>
                                    <div className="text-[10px] text-gray-500 uppercase font-black">{selectedLog.category}</div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '操作詳情' : 'Action Details'}</div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">{selectedLog.details}</p>
                                </div>

                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '執行者' : 'Executed By'}</div>
                                    <div className="text-sm font-mono text-white">{selectedLog.user}</div>
                                    <div className="text-[10px] text-gray-500 mt-1">{formatTimestamp(selectedLog.timestamp)}</div>
                                </div>

                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '嚴重性等級' : 'Severity Level'}</div>
                                    <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${getSeverityColor(selectedLog.severity)}`}>
                                        {selectedLog.severity}
                                    </div>
                                </div>

                                {selectedLog.blockchainHash && (
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '區塊鏈驗證' : 'Blockchain Verification'}</div>
                                        <div className="bg-black/40 rounded-xl p-3 border border-emerald-500/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                <div className="text-[10px] font-bold text-emerald-400 uppercase">{isZh ? '已驗證' : 'Verified'}</div>
                                            </div>
                                            <div className="text-[8px] font-mono text-gray-400 break-all">
                                                {selectedLog.blockchainHash}
                                            </div>
                                            <div className="text-[8px] text-emerald-400 mt-2 uppercase font-black">
                                                {isZh ? '此記錄已永久存儲在區塊鏈上' : 'This record is permanently stored on blockchain'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '數據完整性哈希' : 'Data Integrity Hash'}</div>
                                    <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                                        <div className="text-[8px] font-mono text-gray-400 break-all">
                                            {selectedLog.hash}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 glass-bento p-4 flex flex-col items-center justify-center bg-slate-900/40 border-white/5 min-h-0 rounded-[2rem] text-center">
                            <FileCheck className="w-12 h-12 text-gray-600 mb-4" />
                            <div className="text-sm text-gray-500">{isZh ? '選擇一個日誌查看詳情' : 'Select a log to view details'}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};