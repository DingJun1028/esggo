'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Tag, Globe, Users, Copy, Download, Trash2, Edit, ExternalLink, Database, Cpu, Sparkles, Hash, Clock, Shield } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 📚 AgentSharedKnowledgeBase - 代理共享知識庫
 * 跨代理共享的知識庫，使用 UUID 區分不同的知識條目
 */

interface KnowledgeEntry {
    id: string;
    uuid: string;
    title: string;
    content: string;
    domain: string;
    tags: string[];
    author: string;
    authorId: string;
    createdAt: number;
    updatedAt: number;
    accessCount: number;
    isPublic: boolean;
    sharedAgents: string[];
}

// 模擬共享知識庫數據
const mockSharedKnowledge: KnowledgeEntry[] = [
    {
        id: 'kb-001',
        uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        title: 'GRI Standards 基礎指南',
        content: 'GRI 全球報告倡議組織標準是全球最廣泛使用的永續報告框架。本知識庫包含 GRI Universal Standards 的核心概念和解釋。',
        domain: 'ESG',
        tags: ['GRI', 'Reporting', 'Standards', 'Sustainability'],
        author: 'Dr. Thoth',
        authorId: 'agent-thoth-001',
        createdAt: Date.now() - 86400000 * 30,
        updatedAt: Date.now() - 86400000 * 5,
        accessCount: 1250,
        isPublic: true,
        sharedAgents: ['agent-analyst-001', 'agent-auditor-001']
    },
    {
        id: 'kb-002',
        uuid: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
        title: '碳盤查方法論',
        content: 'ISO 14064 溫室氣體盤查標準提供了組織和項目層面的溫室氣體排放與移除的量化、監測和報告的原則和要求。',
        domain: 'Environment',
        tags: ['Carbon', 'ISO 14064', 'GHG', 'Climate'],
        author: 'EcoSentinel',
        authorId: 'agent-eco-001',
        createdAt: Date.now() - 86400000 * 20,
        updatedAt: Date.now() - 86400000 * 2,
        accessCount: 890,
        isPublic: true,
        sharedAgents: ['agent-analyst-001']
    },
    {
        id: 'kb-003',
        uuid: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
        title: 'SASB 產業分類標準',
        content: 'SASB 可持續發展會計標準委員會提供了77個行業的特定行業標準，幫助企業披露對投資者重要的永續相關財務信息。',
        domain: 'Governance',
        tags: ['SASB', 'Industry', 'Financial', 'Disclosure'],
        author: 'FinanceOracle',
        authorId: 'agent-fin-001',
        createdAt: Date.now() - 86400000 * 15,
        updatedAt: Date.now() - 86400000 * 1,
        accessCount: 567,
        isPublic: true,
        sharedAgents: ['agent-auditor-001', 'agent-analyst-001', 'agent-compliance-001']
    },
    {
        id: 'kb-004',
        uuid: 'd4e5f6a7-b8c9-0123-def0-456789012345',
        title: 'ESG 評級機構比較分析',
        content: '詳細比較 MSCI、Sustainalytics、ISS ESG、CDP 等主要 ESG 評級機構的評估方法和權重差異。',
        domain: 'ESG',
        tags: ['ESG Rating', 'MSCI', 'Sustainalytics', 'CDP'],
        author: 'RatingAnalyzer',
        authorId: 'agent-rate-001',
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now(),
        accessCount: 423,
        isPublic: false,
        sharedAgents: ['agent-analyst-001', 'agent-strategy-001']
    }
];

const domains = ['ESG', 'Environment', 'Social', 'Governance', 'Climate', 'Finance', 'Risk', 'Compliance'];

export default function AgentSharedKnowledgePage() {
    const { t, locale } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
    const [knowledgeEntries] = useState<KnowledgeEntry[]>(mockSharedKnowledge);

    // 過濾知識條目
    const filteredEntries = useMemo(() => {
        return knowledgeEntries.filter(entry => {
            const matchesSearch = searchQuery === '' || 
                entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesDomain = selectedDomain === 'all' || entry.domain === selectedDomain;
            
            return matchesSearch && matchesDomain;
        });
    }, [knowledgeEntries, searchQuery, selectedDomain]);

    // 格式化日期
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // 獲取領域顏色
    const getDomainColor = (domain: string) => {
        const colors: Record<string, string> = {
            'ESG': 'bg-aqua/20 text-aqua',
            'Environment': 'bg-emerald-400/20 text-emerald-400',
            'Social': 'bg-pink-400/20 text-pink-400',
            'Governance': 'bg-purple-400/20 text-purple-400',
            'Climate': 'bg-blue-400/20 text-blue-400',
            'Finance': 'bg-yellow-400/20 text-yellow-400',
            'Risk': 'bg-red-400/20 text-red-400',
            'Compliance': 'bg-orange-400/20 text-orange-400',
        };
        return colors[domain] || 'bg-gray-400/20 text-gray-400';
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-aqua pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "代理共享知識庫" : "Agent Shared Knowledge Base"}
                subtitle={locale === 'zh-TW' ? "跨代理共享的知識庫，讓知識在不同代理間流轉" : "Cross-agent shared knowledge base, enabling knowledge flow between agents"}
                category="Agency"
            />

            <main className="max-w-7xl mx-auto px-6 mt-12">
                {/* 🔍 搜尋和篩選區域 */}
                <div className="liquid-glass border border-white/10 rounded-[3rem] p-8 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* 搜尋框 */}
                        <div className="flex-1 relative">
                            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={locale === 'zh-TW' ? "搜尋知識條目..." : "Search knowledge entries..."}
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm focus:border-aqua outline-none transition-all"
                            />
                        </div>

                        {/* 領域篩選 */}
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={() => setSelectedDomain('all')}
                                className={`px-6 py-3 rounded-full border text-xs font-black tracking-widest uppercase transition-all ${
                                    selectedDomain === 'all' 
                                    ? 'bg-aqua text-black border-aqua' 
                                    : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                }`}
                            >
                                {locale === 'zh-TW' ? '全部' : 'All'}
                            </button>
                            {domains.map(domain => (
                                <button
                                    key={domain}
                                    onClick={() => setSelectedDomain(domain)}
                                    className={`px-6 py-3 rounded-full border text-xs font-black tracking-widest uppercase transition-all ${
                                        selectedDomain === domain 
                                        ? getDomainColor(domain) + ' border-current'
                                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                                >
                                    {domain}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 📊 統計資訊 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="liquid-glass p-6 border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-aqua/20 flex items-center justify-center">
                                <Database size={24} className="text-aqua" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{knowledgeEntries.length}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '知識條目' : 'Knowledge Entries'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="liquid-glass p-6 border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-emerald-400/20 flex items-center justify-center">
                                <Globe size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{knowledgeEntries.filter(e => e.isPublic).length}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '公開條目' : 'Public Entries'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="liquid-glass p-6 border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-purple-400/20 flex items-center justify-center">
                                <Users size={24} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{new Set(knowledgeEntries.flatMap(e => e.sharedAgents)).size}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '共享代理數' : 'Shared Agents'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="liquid-glass p-6 border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-blue-400/20 flex items-center justify-center">
                                <Cpu size={24} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{knowledgeEntries.reduce((sum, e) => sum + e.accessCount, 0).toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '總存取次數' : 'Total Access'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📚 知識條目列表 */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredEntries.map((entry) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="liquid-glass p-6 border border-white/10 rounded-3xl hover:border-aqua/30 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* 左側：標題和內容 */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${getDomainColor(entry.domain)}`}>
                                                {entry.domain}
                                            </span>
                                            {entry.isPublic && (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-green-400/20 text-green-400">
                                                    <Globe size={10} className="inline mr-1" />
                                                    {locale === 'zh-TW' ? '公開' : 'Public'}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                                <Hash size={10} />
                                                {entry.uuid.substring(0, 8)}...
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-2 group-hover:text-aqua transition-colors">
                                            {entry.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                            {entry.content}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {entry.tags.map((tag) => (
                                                <span 
                                                    key={tag}
                                                    className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 flex items-center gap-1"
                                                >
                                                    <Tag size={10} />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 右側：元數據和操作 */}
                                    <div className="flex flex-col items-end gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 flex items-center gap-1 justify-end">
                                                <Clock size={10} />
                                                {formatDate(entry.updatedAt)}
                                            </p>
                                            <p className="text-[10px] text-gray-600 mt-1">
                                                {locale === 'zh-TW' ? '作者' : 'Author'}: {entry.author}
                                            </p>
                                            <p className="text-[10px] text-gray-600 flex items-center gap-1 justify-end">
                                                <Users size={10} />
                                                {entry.sharedAgents.length} {locale === 'zh-TW' ? '個代理共享' : 'agents shared'}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedEntry(entry)}
                                                className="p-3 rounded-full bg-white/5 hover:bg-aqua/20 transition-colors"
                                                title={locale === 'zh-TW' ? '查看詳情' : 'View Details'}
                                            >
                                                <BookOpen size={16} />
                                            </button>
                                            <button
                                                className="p-3 rounded-full bg-white/5 hover:bg-blue-400/20 transition-colors"
                                                title={locale === 'zh-TW' ? '複製知識' : 'Copy Knowledge'}
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                className="p-3 rounded-full bg-white/5 hover:bg-green-400/20 transition-colors"
                                                title={locale === 'zh-TW' ? '匯出' : 'Export'}
                                            >
                                                <Download size={16} />
                                            </button>
                                        </div>

                                        <div className="text-[10px] text-gray-700 font-mono">
                                            {entry.accessCount.toLocaleString()} {locale === 'zh-TW' ? '次存取' : 'accesses'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredEntries.length === 0 && (
                        <div className="p-12 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center opacity-30">
                            <BookOpen size={64} className="mb-4" />
                            <p className="text-[10px] font-black tracking-widest uppercase">
                                {locale === 'zh-TW' ? '尚未有知識條目' : 'No Knowledge Entries'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {locale === 'zh-TW' ? '點擊下方按鈕建立第一個知識條目' : 'Click the button below to create your first entry'}
                            </p>
                        </div>
                    )}
                </div>

                {/* + 新增按鈕 */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="size-16 rounded-full bg-aqua text-black font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-aqua/30"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </main>

            {/* 📝 新增知識條目 Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="liquid-glass border border-white/10 rounded-[3rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '建立知識條目' : 'Create Knowledge Entry'}
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-3 rounded-full bg-white/5 hover:bg-white/20 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase block mb-3">
                                        {locale === 'zh-TW' ? '標題' : 'Title'}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aqua outline-none transition-all"
                                        placeholder={locale === 'zh-TW' ? '輸入知識條目標題...' : 'Enter knowledge title...'}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase block mb-3">
                                        {locale === 'zh-TW' ? '內容' : 'Content'}
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aqua outline-none transition-all resize-none"
                                        placeholder={locale === 'zh-TW' ? '輸入知識內容...' : 'Enter knowledge content...'}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase block mb-3">
                                            {locale === 'zh-TW' ? '領域' : 'Domain'}
                                        </label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aqua outline-none transition-all">
                                            {domains.map(domain => (
                                                <option key={domain} value={domain}>{domain}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase block mb-3">
                                            {locale === 'zh-TW' ? '標籤' : 'Tags'}
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aqua outline-none transition-all"
                                            placeholder={locale === 'zh-TW' ? '輸入標籤，用逗號分隔' : 'Enter tags, comma separated'}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isPublic"
                                        className="size-5 rounded border-white/20 bg-white/5 text-aqua focus:ring-aqua"
                                    />
                                    <label htmlFor="isPublic" className="text-sm text-gray-400 flex items-center gap-2">
                                        <Globe size={14} />
                                        {locale === 'zh-TW' ? '設為公開' : 'Make Public'}
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-4 rounded-full border border-white/10 text-gray-500 font-black uppercase tracking-widest text-sm hover:bg-white/5 transition-all"
                                    >
                                        {locale === 'zh-TW' ? '取消' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 rounded-full bg-aqua text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Sparkles size={16} />
                                        {locale === 'zh-TW' ? '建立' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 📖 知識條目詳情 Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setSelectedEntry(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="liquid-glass border border-white/10 rounded-[3rem] p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${getDomainColor(selectedEntry.domain)}`}>
                                        {selectedEntry.domain}
                                    </span>
                                    {selectedEntry.isPublic && (
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-green-400/20 text-green-400">
                                            <Globe size={10} className="inline mr-1" />
                                            {locale === 'zh-TW' ? '公開' : 'Public'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    className="p-3 rounded-full bg-white/5 hover:bg-white/20 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <h2 className="text-3xl font-black mb-4">{selectedEntry.title}</h2>

                            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Sparkles size={14} />
                                    {selectedEntry.author}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {formatDate(selectedEntry.createdAt)}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Database size={14} />
                                    {selectedEntry.accessCount} {locale === 'zh-TW' ? '次存取' : 'accesses'}
                                </span>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 mb-6">
                                <p className="text-gray-300 leading-relaxed">{selectedEntry.content}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase block mb-3">
                                        <Hash size={12} className="inline mr-1" />
                                        UUID
                                    </label>
                                    <div className="bg-white/5 rounded-xl px-4 py-3 font-mono text-sm text-gray-400 flex items-center justify-between">
                                        <span>{selectedEntry.uuid}</span>
                                        <button className="p-2 hover:text-aqua transition-colors">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase block mb-3">
                                        <Tag size={12} className="inline mr-1" />
                                        {locale === 'zh-TW' ? '標籤' : 'Tags'}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedEntry.tags.map((tag) => (
                                            <span 
                                                key={tag}
                                                className="px-4 py-2 bg-white/5 rounded-full text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase block mb-3">
                                        <Users size={12} className="inline mr-1" />
                                        {locale === 'zh-TW' ? '共享代理' : 'Shared Agents'}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedEntry.sharedAgents.map((agent) => (
                                            <span 
                                                key={agent}
                                                className="px-4 py-2 bg-purple-400/10 text-purple-400 rounded-full text-sm flex items-center gap-2"
                                            >
                                                <Cpu size={12} />
                                                {agent}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                                <button className="flex-1 py-4 rounded-full bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <Edit size={16} />
                                    {locale === 'zh-TW' ? '編輯' : 'Edit'}
                                </button>
                                <button className="flex-1 py-4 rounded-full bg-white/5 hover:bg-blue-400/20 transition-all flex items-center justify-center gap-2">
                                    <Copy size={16} />
                                    {locale === 'zh-TW' ? '複製到個人知識庫' : 'Copy to Personal KB'}
                                </button>
                                <button className="flex-1 py-4 rounded-full bg-white/5 hover:bg-green-400/20 transition-all flex items-center justify-center gap-2">
                                    <ExternalLink size={16} />
                                    {locale === 'zh-TW' ? '查看來源' : 'View Source'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
