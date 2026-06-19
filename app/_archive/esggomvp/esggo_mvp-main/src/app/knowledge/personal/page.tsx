'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Tag, User, Copy, Download, Trash2, Edit, ExternalLink, Database, Sparkles, Hash, Clock, Shield, Archive, Star, Zap, FileText, Settings, Share2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 📚 UserPersonalKnowledgeBase - 用戶個人知識庫
 * 用戶的專屬知識庫，使用 UUID 區分不同的知識條目
 */

interface KnowledgeEntry {
    id: string;
    uuid: string;
    title: string;
    content: string;
    domain: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
    accessCount: number;
    isFavorite: boolean;
    isCrystallized: boolean;
    source?: string;
}

// 模擬用戶個人知識庫數據
const mockUserKnowledge: KnowledgeEntry[] = [
    {
        id: 'ukb-001',
        uuid: 'ukb-uuid-001-1111-2222-3333-444455556666',
        title: '我的 GRI 報告學習筆記',
        content: 'GRI Standards 學習筆記，包含對 Universal Standards 2021 版本的詳細解說和實際應用心得。這些知識幫助我更好地理解永續報告的核心概念。',
        domain: 'ESG',
        tags: ['GRI', 'Reporting', 'Learning', 'Notes'],
        createdAt: Date.now() - 86400000 * 90,
        updatedAt: Date.now() - 86400000 * 5,
        accessCount: 156,
        isFavorite: true,
        isCrystallized: true
    },
    {
        id: 'ukb-002',
        uuid: 'ukb-uuid-002-5555-6666-7777-888899990000',
        title: '碳足跡計算練習',
        content: '記錄個人和家用碳足跡計算的練習過程。使用 GHG Protocol 方法論進行計算，並記錄了每個月的碳排放數據追蹤。',
        domain: 'Environment',
        tags: ['Carbon', 'Footprint', 'Calculator', 'Personal'],
        createdAt: Date.now() - 86400000 * 60,
        updatedAt: Date.now() - 86400000 * 10,
        accessCount: 89,
        isFavorite: true,
        isCrystallized: false
    },
    {
        id: 'ukb-003',
        uuid: 'ukb-uuid-003-aaaa-bbbb-cccc-ddddeeeeffff',
        title: 'ESG 投資策略研究',
        content: '個人對 ESG 投資策略的研究筆記。包括 MSCI ESG Ratings 方法論、Sustainalytics 風險評估，以及如何將 ESG因素納入投資決策流程。',
        domain: 'Finance',
        tags: ['ESG Investment', 'Portfolio', 'MSCI', 'Strategy'],
        createdAt: Date.now() - 86400000 * 45,
        updatedAt: Date.now() - 86400000 * 3,
        accessCount: 234,
        isFavorite: false,
        isCrystallized: true
    },
    {
        id: 'ukb-004',
        uuid: 'ukb-uuid-004-1111-2222-3333-44445555aaaa',
        title: '永續發展目標 SDG 學習資源',
        content: '聯合國永續發展目標（SDGs）的學習資源整理。包含 17 個目標的詳細說明、指標定義、以及相關的國際框架參考。',
        domain: 'Social',
        tags: ['SDGs', 'UN', 'Goals', 'Learning'],
        createdAt: Date.now() - 86400000 * 30,
        updatedAt: Date.now() - 86400000 * 1,
        accessCount: 345,
        isFavorite: true,
        isCrystallized: true
    },
    {
        id: 'ukb-005',
        uuid: 'ukb-uuid-005-7777-8888-9999-000011112222',
        title: '氣候變遷風險評估框架',
        content: '學習 TCFD 氣候相關財務揭露框架的心得。涵蓋治理、風險管理、策略和指標與目標四大支柱的實務應用。',
        domain: 'Governance',
        tags: ['TCFD', 'Climate', 'Risk', 'Disclosure'],
        createdAt: Date.now() - 86400000 * 20,
        updatedAt: Date.now(),
        accessCount: 178,
        isFavorite: false,
        isCrystallized: false
    }
];

import { UserKnowledgeBase } from '@/core/user-knowledge-base';

// 整合真實與模擬知識庫數據
const getCombinedKnowledge = (): KnowledgeEntry[] => {
    // 從 UserKnowledgeBase 獲取真實數據並轉換格式
    const realKnowledge = UserKnowledgeBase.getLibrary().map((atom, index) => ({
        id: "ukb-real-" + index,
        uuid: atom.uuid,
        title: atom.payload.title || '未命名知識',
        content: atom.payload.content || '',
        domain: atom.domainRef || 'ESG',
        tags: atom.payload.tags || [],
        createdAt: atom.timestamp || Date.now(),
        updatedAt: atom.timestamp || Date.now(),
        accessCount: 1,
        isFavorite: true,
        isCrystallized: atom.status === 'Trustworthy'
    }));

    // 為了展示豐富度，保留部分模擬數據
    return [...realKnowledge, ...mockUserKnowledge];
};

const domains = ['ESG', 'Environment', 'Social', 'Governance', 'Climate', 'Finance', 'Risk', 'Compliance'];

export default function UserPersonalKnowledgePage() {
    const { t, locale } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [filterCrystallized, setFilterCrystallized] = useState(false);

    // 獲取最新知識庫數據
    const [knowledgeData] = useState<KnowledgeEntry[]>(getCombinedKnowledge());

    // 知識庫統計
    const stats = useMemo(() => {
        return {
            total: knowledgeData.length,
            favorites: knowledgeData.filter(k => k.isFavorite).length,
            crystallized: knowledgeData.filter(k => k.isCrystallized).length
        };
    }, [knowledgeData]);

    // 過濾知識條目
    const filteredEntries = useMemo(() => {
        return knowledgeData.filter(entry => {
            const matchesSearch = searchQuery === '' ||
                entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesDomain = selectedDomain === 'all' || entry.domain === selectedDomain;

            const matchesFavorite = !showFavoritesOnly || entry.isFavorite;

            const matchesCrystallized = !filterCrystallized || entry.isCrystallized;

            return matchesSearch && matchesDomain && matchesFavorite && matchesCrystallized;
        });
    }, [searchQuery, selectedDomain, showFavoritesOnly, filterCrystallized]);

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
                title={locale === 'zh-TW' ? "個人知識庫" : "Personal Knowledge Base"}
                subtitle={locale === 'zh-TW'
                    ? "您的專屬知識聖殿，使用 UUID 區分知識條目"
                    : "Your personal knowledge sanctuary, distinguished by UUID"}
                category="Knowledge"
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
                                placeholder={locale === 'zh-TW' ? "搜尋您的知識條目..." : "Search your knowledge entries..."}
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm focus:border-aqua outline-none transition-all"
                            />
                        </div>

                        {/* 篩選按鈕 */}
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                className={`px-6 py-3 rounded-full border text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 ${showFavoritesOnly
                                    ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400'
                                    : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                            >
                                <Star size={14} />
                                {locale === 'zh-TW' ? '收藏' : 'Favorites'}
                            </button>

                            <button
                                onClick={() => setFilterCrystallized(!filterCrystallized)}
                                className={`px-6 py-3 rounded-full border text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 ${filterCrystallized
                                    ? 'bg-purple-400/20 text-purple-400 border-purple-400'
                                    : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                            >
                                <Zap size={14} />
                                {locale === 'zh-TW' ? '結晶化' : 'Crystallized'}
                            </button>

                            <select
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-xs font-black tracking-widest uppercase focus:border-aqua outline-none transition-all"
                            >
                                <option value="all">{locale === 'zh-TW' ? '全部領域' : 'All Domains'}</option>
                                {domains.map(domain => (
                                    <option key={domain} value={domain}>{domain}</option>
                                ))}
                            </select>
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
                                <p className="text-2xl font-black">{stats.total}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '知識條目' : 'Knowledge Entries'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="liquid-glass p-6 border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center">
                                <Star size={24} className="text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{stats.favorites}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '收藏' : 'Favorites'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="liquid-glass p-6 border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-purple-400/20 flex items-center justify-center">
                                <Zap size={24} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{stats.crystallized}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '結晶化' : 'Crystallized'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="liquid-glass p-6 border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-blue-400/20 flex items-center justify-center">
                                <Hash size={24} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{knowledgeData.reduce((sum, e) => sum + e.accessCount, 0)}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {locale === 'zh-TW' ? '總存取' : 'Total Access'}
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
                                            {entry.isFavorite && (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-yellow-400/20 text-yellow-400">
                                                    <Star size={10} className="inline mr-1" />
                                                    {locale === 'zh-TW' ? '收藏' : 'Favorite'}
                                                </span>
                                            )}
                                            {entry.isCrystallized && (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-purple-400/20 text-purple-400">
                                                    <Zap size={10} className="inline mr-1" />
                                                    {locale === 'zh-TW' ? '結晶' : 'Crystallized'}
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
                                            {entry.source && (
                                                <p className="text-[10px] text-purple-400 flex items-center gap-1 justify-end mt-1">
                                                    <Archive size={10} />
                                                    {locale === 'zh-TW' ? '來自共享庫' : 'From Shared'}
                                                </p>
                                            )}
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
                                                className="p-3 rounded-full bg-white/5 hover:bg-yellow-400/20 transition-colors"
                                                title={locale === 'zh-TW' ? '收藏' : 'Add to Favorites'}
                                            >
                                                <Star size={16} />
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
                                            {entry.accessCount} {locale === 'zh-TW' ? '次存取' : 'accesses'}
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
                            className="liquid-glass border border-white/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${getDomainColor(selectedEntry.domain)}`}>
                                        {selectedEntry.domain}
                                    </span>
                                    {selectedEntry.isFavorite && (
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-yellow-400/20 text-yellow-400">
                                            <Star size={10} className="inline mr-1" />
                                            {locale === 'zh-TW' ? '收藏' : 'Favorite'}
                                        </span>
                                    )}
                                    {selectedEntry.isCrystallized && (
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-purple-400/20 text-purple-400">
                                            <Zap size={10} className="inline mr-1" />
                                            {locale === 'zh-TW' ? '結晶' : 'Crystallized'}
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
                                <div className="text-gray-300 leading-relaxed max-w-none whitespace-pre-wrap font-serif">
                                    {selectedEntry.content}
                                </div>
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
                            </div>

                            <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                                <button className="flex-1 py-4 rounded-full bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <Edit size={16} />
                                    {locale === 'zh-TW' ? '編輯' : 'Edit'}
                                </button>
                                <button className="flex-1 py-4 rounded-full bg-white/5 hover:bg-yellow-400/20 transition-all flex items-center justify-center gap-2">
                                    <Star size={16} />
                                    {locale === 'zh-TW' ? '收藏' : 'Favorite'}
                                </button>
                                <button className="flex-1 py-4 rounded-full bg-white/5 hover:bg-purple-400/20 transition-all flex items-center justify-center gap-2">
                                    <Zap size={16} />
                                    {locale === 'zh-TW' ? '結晶化' : 'Crystallize'}
                                </button>
                                <button className="flex-1 py-4 rounded-full bg-white/5 hover:bg-green-400/20 transition-all flex items-center justify-center gap-2">
                                    <Share2 size={16} />
                                    {locale === 'zh-TW' ? '分享' : 'Share'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
