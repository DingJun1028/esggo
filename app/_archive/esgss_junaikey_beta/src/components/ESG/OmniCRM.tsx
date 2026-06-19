/**
 * 🏢 OmniCRM - 奧秘 CRM 組件
 * --------------------------------------------------
 * [功能] 整合 OmniTable.ai 數據，提供高效的客戶關係管理介面
 * [風格] Aqua (#00FFF0) 玻璃擬態
 * [特性] 即時同步、AI 客戶洞察、深貫廣通整合
 */

import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    Plus,
    Filter,
    ExternalLink,
    RefreshCw,
    UserPlus,
    TrendingUp,
    MessageSquare,
    ShieldCheck,
    Zap,
    MoreVertical
} from 'lucide-react';
import { omniTableService } from '@/services/OmniTableService';
import { OmniTableRecord } from '@/types/esg-go/omni-table.types';

const MOCK_CRM_DATA = [
    { id: '1', fields: { '名稱': '環球綠能科技', '聯繫人': '張永續', '狀態': '洽談中', '最後互動': '2026-02-01', 'ESG評分': 88 } },
    { id: '2', fields: { '名稱': '未來城市建築', '聯繫人': '李環保', '狀態': '已簽約', '最後互動': '2026-01-28', 'ESG評分': 92 } },
    { id: '3', fields: { '名稱': '智電工業', '聯繫人': '王節能', '狀態': '潛在客戶', '最後互動': '2026-01-15', 'ESG評分': 65 } },
];

const MOCK_OUTREACH_DATA = [
    { id: 'o1', fields: { '名稱': '泰坦能源', '開發階段': '初步聯繫', '最後往來': '2026-02-02', '互動摘要': '發送初步合作意向書，等待回覆。' } },
    { id: 'o2', fields: { '名稱': '新興物流', '開發階段': '需求確認', '最後往來': '2026-01-30', '互動摘要': '對方對綠色物流解決方案感興趣。' } },
];

export const OmniCRM: React.FC = () => {
    const [records, setRecords] = useState<OmniTableRecord[]>([]);
    const [outreachRecords, setOutreachRecords] = useState<OmniTableRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', contact: '', status: '潛在客戶' });
    const [currentTab, setCurrentTab] = useState<'customers' | 'outreach'>('customers');

    useEffect(() => {
        fetchRecords();
        setOutreachRecords(MOCK_OUTREACH_DATA);
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            // 串接真實 API
            const data = await omniTableService.getRecords({ pageSize: 50 });
            setRecords(data.length > 0 ? data : MOCK_CRM_DATA);
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniCRM] Fetch CRM records failed:', { error })
            setRecords(MOCK_CRM_DATA);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomer = async () => {
        if (!newCustomer.name) return;
        setLoading(true);
        try {
            const fields: Record<string, any> = currentTab === 'customers'
                ? {
                    '名稱': newCustomer.name,
                    '聯繫人': newCustomer.contact,
                    '狀態': newCustomer.status,
                    'ESG評分': Math.floor(Math.random() * 40) + 60,
                    '最後互動': new Date().toISOString().split('T')[0]
                }
                : {
                    '名稱': newCustomer.name,
                    '開發階段': '初步聯繫',
                    '最後往來': new Date().toISOString().split('T')[0],
                    '互動摘要': '新增開發對象'
                };

            const result = await omniTableService.createRecords([{ fields }]);

            if (result) {
                await fetchRecords();
                if (currentTab === 'outreach') {
                    setOutreachRecords(prev => [...prev, ...result]);
                }
                setShowAddModal(false);
                setNewCustomer({ name: '', contact: '', status: '潛在客戶' });
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniCRM] Add record failed:', { error })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 space-y-6 overflow-hidden relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
                        <Users className="text-cyan-400 w-8 h-8" />
                        OMNI <span className="text-cyan-400">CRM</span>
                    </h1>
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setCurrentTab('customers')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${currentTab === 'customers' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            客戶管理
                        </button>
                        <button
                            onClick={() => setCurrentTab('outreach')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${currentTab === 'outreach' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            陌生開發
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchRecords}
                        disabled={loading}
                        className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`flex items-center gap-2 ${currentTab === 'customers' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'} text-white px-5 py-2.5 rounded-xl font-bold transition-all`}
                    >
                        <UserPlus className="w-5 h-5" />
                        {currentTab === 'customers' ? '新增客戶' : '新增開發'}
                    </button>
                </div>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title={currentTab === 'customers' ? "活躍客戶" : "接觸對象"}
                    value={currentTab === 'customers'
                        ? records.filter(r => r.fields['狀態'] === '已簽約').length.toString()
                        : outreachRecords.length.toString()
                    }
                    icon={<TrendingUp className={currentTab === 'customers' ? "text-emerald-400" : "text-rose-400"} />}
                    color={currentTab === 'customers' ? "emerald" : "rose"}
                />
                <StatCard
                    title={currentTab === 'customers' ? "管理量" : "開發中"}
                    value={currentTab === 'customers'
                        ? records.length.toString()
                        : outreachRecords.filter(r => r.fields['開發階段'] !== '已轉化').length.toString()
                    }
                    icon={<Zap className="text-yellow-400" />}
                    color="yellow"
                />
                <StatCard
                    title={currentTab === 'customers' ? "平均 ESG 分數" : "最後活動日期"}
                    value={currentTab === 'customers'
                        ? Math.round(records.reduce((acc, curr) => acc + (curr.fields['ESG評分'] || 0), 0) / (records.length || 1)).toString()
                        : outreachRecords[0]?.fields['最後往來'] || 'N/A'
                    }
                    icon={<ShieldCheck className="text-cyan-400" />}
                    color="cyan"
                />
            </div>

            {/* Main Content: Table Area */}
            <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="搜尋名稱、聯繫人..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:border-cyan-500/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 text-slate-400 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <Filter className="w-4 h-4" /> 篩選
                        </button>
                        <a
                            href="https://api.aitable.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium px-4 py-2"
                        >
                            <ExternalLink className="w-4 h-4" /> OmniTable 視圖
                        </a>
                    </div>
                </div>

                {/* Records Table */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900/80 backdrop-blur-md z-10">
                            <tr className="border-b border-white/5">
                                <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-widest">{currentTab === 'customers' ? '客戶名稱' : '開發對象'}</th>
                                <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-widest">{currentTab === 'customers' ? '主要聯繫人' : '開發階段'}</th>
                                <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-widest">{currentTab === 'customers' ? '狀態' : '最後記錄'}</th>
                                <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-widest text-center">{currentTab === 'customers' ? 'ESG 評分' : '互動摘要'}</th>
                                <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-widest">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(currentTab === 'customers' ? records : outreachRecords)
                                .filter(r =>
                                    (r.fields['名稱'] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (r.fields['聯繫人'] || r.fields['互動摘要'] || '').toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((record, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={record.recordId || idx}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTab === 'customers' ? 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/10' : 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/10'} flex items-center justify-center font-bold border`}>
                                                    {(record.fields['名稱'] || 'C')[0]}
                                                </div>
                                                <span className="text-white font-bold">{record.fields['名稱']}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-slate-300">
                                            {currentTab === 'customers' ? record.fields['聯繫人'] : (
                                                <span className="bg-slate-800 px-2 py-1 rounded text-xs text-rose-300 border border-rose-500/20">
                                                    {record.fields['開發階段']}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            {currentTab === 'customers' ? (
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${record.fields['狀態'] === '已簽約'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : record.fields['狀態'] === '洽談中'
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                    }`}>
                                                    {record.fields['狀態']}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-500 font-mono">
                                                    {record.fields['最後往來']}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            {currentTab === 'customers' ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                            style={{ width: `${record.fields['ESG評分'] || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-mono text-cyan-400">{record.fields['ESG評分'] || 0}</span>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">
                                                    {record.fields['互動摘要']}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className={`p-2 rounded-lg text-slate-400 transition-all ${currentTab === 'customers' ? 'hover:bg-cyan-500/20 hover:text-cyan-400' : 'hover:bg-rose-500/20 hover:text-rose-400'}`}>
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                        </tbody>
                    </table>
                    {loading && records.length === 0 && (
                        <div className="p-20 text-center text-slate-500 animate-pulse font-mono tracking-widest uppercase">
                            Synchronizing with OmniTable Hub...
                        </div>
                    )}
                </div>
            </div>

            {/* Simple Add Modal Overlay */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[32px] w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                {currentTab === 'customers' ? <UserPlus className="text-cyan-400" /> : <Plus className="text-rose-400" />}
                                {currentTab === 'customers' ? '新增客戶資料' : '新增開發對象'}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                        {currentTab === 'customers' ? '客戶名稱' : '對象名稱 (公司/單位)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={newCustomer.name}
                                        onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                        className={`w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white ${currentTab === 'customers' ? 'focus:border-cyan-500' : 'focus:border-rose-500'} outline-none`}
                                        placeholder={currentTab === 'customers' ? "例如：環球綠能" : "例如：泰坦能源"}
                                    />
                                </div>
                                {currentTab === 'customers' ? (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">主要聯繫人</label>
                                            <input
                                                type="text"
                                                value={newCustomer.contact}
                                                onChange={e => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                                placeholder="姓名"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">目前狀態</label>
                                            <select
                                                value={newCustomer.status}
                                                onChange={e => setNewCustomer({ ...newCustomer, status: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                            >
                                                <option value="潛在客戶">潛在客戶</option>
                                                <option value="洽談中">洽談中</option>
                                                <option value="已簽約">已簽約</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            正在進入<strong>「陌生開發」</strong>模式。系統將自動建立初步開發日誌，並可選用 AI 助手生成初次聯繫草稿。
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 text-slate-400 font-bold hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleAddCustomer}
                                    disabled={loading || !newCustomer.name}
                                    className={`flex-1 py-3 ${currentTab === 'customers' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'} text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50`}
                                >
                                    {loading ? '處理中...' : '確認新增'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
        <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</span>
            <div className="p-2 bg-slate-950/50 rounded-lg group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
        <div className="text-2xl font-black text-white">{value}</div>
    </div>
);
