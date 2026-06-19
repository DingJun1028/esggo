'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Tag, User, Copy, Download, Trash2, Edit, ExternalLink, Database, Cpu, Sparkles, Hash, Clock, Shield, UserCircle, Archive, Filter, Star, Zap } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 📚 AgentPersonalKnowledgeBase - 代理個人知識庫
 * 每個代理的專屬知識庫，使用 UUID 區分不同的知識條目
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

interface Agent {
    id: string;
    uuid: string;
    name: string;
    role: string;
    personality: string;
    knowledgeCount: number;
    avatarColor: string;
}

// 模擬代理數據
const mockAgents: Agent[] = [
    {
        id: 'agent-001',
        uuid: 'agent-uuid-001-aaaa-bbbb-cccc-dddd11112222',
        name: 'Thoth',
        role: 'SENTINEL',
        personality: 'STOIC',
        knowledgeCount: 156,
        avatarColor: '#00ffff'
    },
    {
        id: 'agent-002',
        uuid: 'agent-uuid-002-eeee-ffff-1111-222233334444',
        name: 'EcoSentinel',
        role: 'ANALYST',
        personality: 'ANALYTICAL',
        knowledgeCount: 89,
        avatarColor: '#10b981'
    },
    {
        id: 'agent-003',
        uuid: 'agent-uuid-003-5555-6666-7777-888899990000',
        name: 'FinanceOracle',
        role: 'AUDITOR',
        personality: 'EMPATHETIC',
        knowledgeCount: 234,
        avatarColor: '#8b5cf6'
    },
    {
        id: 'agent-004',
        uuid: 'agent-uuid-004-aaaa-bbbb-cccc-dddd55556666',
        name: 'RatingAnalyzer',
        role: 'SHEPHERD',
        personality: 'ENTHUSIASTIC',
        knowledgeCount: 67,
        avatarColor: '#f59e0b'
    }
];

// 模擬個人知識庫數據
const mockPersonalKnowledge: Record<string, KnowledgeEntry[]> = {
    'agent-001': [
        {
            id: 'pk-001',
            uuid: 'pk-uuid-001-1111-2222-3333-444455556666',
            title: 'GRI Standards 深度解讀',
            content: 'GRI Universal Standards 2021 版本帶來了重大更新，特別是雙重重要性原則（Double Materiality）的引入。本知識條目包含對標準結構的詳細解釋和實際應用案例。',
            domain: 'ESG',
            tags: ['GRI', 'Reporting', 'Standards', 'Double Materiality'],
            createdAt: Date.now() - 86400000 * 60,
            updatedAt: Date.now() - 86400000 * 10,
            accessCount: 567,
            isFavorite: true,
            isCrystallized: true,
            source: 'shared-kb-001'
        },
        {
            id: 'pk-002',
            uuid: 'pk-uuid-002-7777-8888-9999-000011112222',
            title: '碳中和路徑圖繪製方法',
            content: '基於 Science Based Targets (SBTi) 方法論，系統性繪製企業碳中和路徑圖。包含範疇一、二、三排放的計算框架和減排策略。',
            domain: 'Environment',
            tags: ['Carbon', 'Net Zero', 'SBTi', 'Climate'],
            createdAt: Date.now() - 86400000 * 45,
            updatedAt: Date.now() - 86400000 * 5,
            accessCount: 234,
            isFavorite: true,
            isCrystallized: false
        },
        {
            id: 'pk-003',
            uuid: 'pk-uuid-003-aaaa-bbbb-cccc-ddddeeeeffff',
            title: 'ESG 投資評估框架',
            content: '整合 MSCI、Sustainalytics、ISS ESG 等評級機構的評估方法，建立全面的 ESG 投資評估框架。',
            domain: 'Finance',
            tags: ['ESG Investment', 'MSCI', 'Sustainalytics', 'Portfolio'],
            createdAt: Date.now() - 86400000 * 30,
            updatedAt: Date.now() - 86400000 * 1,
            accessCount: 189,
            isFavorite: false,
            isCrystallized: true
        }
    ],
    'agent-002': [
        {
            id: 'pk-004',
            uuid: 'pk-uuid-004-1111-2222-3333-44445555aaaa',
            title: 'ISO 14001 環境管理系統',
            content: 'ISO 14001:2015 環境管理系統標準的完整解析，包括 PDCA 循環、風險評估和合規義務。',
            domain: 'Environment',
            tags: ['ISO 14001', 'EMS', 'Environmental', 'Certification'],
            createdAt: Date.now() - 86400000 * 40,
            updatedAt: Date.now() - 86400000 * 15,
            accessCount: 345,
            isFavorite: true,
            isCrystallized: false
        },
        {
            id: 'pk-005',
            uuid: 'pk-uuid-005-2222-3333-4444-55556667bbbb',
            title: 'GHG Protocol 溫室氣體核算',
            content: 'GHG Protocol 企業核算與報告標準的詳細指南，涵蓋範疇一、二、三的計算方法和邊界設定。',
            domain: 'Environment',
            tags: ['GHG Protocol', 'Carbon', 'Scope 1-3', 'Inventory'],
            createdAt: Date.now() - 86400000 * 25,
            updatedAt: Date.now() - 86400000 * 3,
            accessCount: 456,
            isFavorite: false,
            isCrystallized: true
        }
    ],
    'agent-003': [
        {
            id: 'pk-006',
            uuid: 'pk-uuid-006-3333-4444-5555-66667778cccc',
            title: 'IFRS S1 & S2 永續財務揭露',
            content: 'IFRS S1 一般永續財務揭露標準和 IFRS S2 氣候相關揭露標準的完整解讀。',
            domain: 'Governance',
            tags: ['IFRS', 'S1', 'S2', 'TCFD'],
            createdAt: Date.now() - 86400000 * 35,
            updatedAt: Date.now() - 86400000 * 7,
            accessCount: 678,
            isFavorite: true,
            isCrystallized: true,
            source: 'shared-kb-002'
        }
    ],
    'agent-004': [
        {
            id: 'pk-007',
            uuid: 'pk-uuid-007-4444-5555-6666-77778889dddd',
            title: 'CDP 碳揭露問卷分析',
            content: 'CDP 氣候變遷、水安全和森林問卷的填寫指南和評分方法論分析。',
            domain: 'Environment',
            tags: ['CDP', 'Disclosure', 'Climate', 'Water', 'Forest'],
            createdAt: Date.now() - 86400000 * 20,
            updatedAt: Date.now() - 86400000 * 2,
            accessCount: 234,
            isFavorite: false,
            isCrystallized: false
        }
    ]
};

const domains = ['ESG', 'Environment', 'Social', 'Governance', 'Climate', 'Finance', 'Risk', 'Compliance'];

export default function AgentPersonalKnowledgePage() {
    const { t, locale } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState<string>('all');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(mockAgents[0]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [filterCrystallized, setFilterCrystallized] = useState(false);

    // 獲取當前代理的知識庫
    const currentKnowledge = useMemo(() => {
        if (!selectedAgent) return [];
        return mockPersonalKnowledge[selectedAgent.id] || [];
    }, [selectedAgent]);

    // 過濾知識條目
    const filteredEntries = useMemo(() => {
        return currentKnowledge.filter(entry => {
            const matchesSearch = searchQuery === '' || 
                entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesDomain = selectedDomain === 'all' || entry.domain === selectedDomain;
            
            const matchesFavorite = !showFavoritesOnly || entry.isFavorite;
            
            const matchesCrystallized = !filterCrystallized || entry.isCrystallized;
            
            return matchesSearch && matchesDomain && matchesFavorite && matchesCrystallized;
        });
    }, [currentKnowledge, searchQuery, selectedDomain, showFavoritesOnly, filterCrystallized]);

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

    // 計算代理統計
    const agentStats = useMemo(() => {
        if (!selectedAgent) return { total: 0, favorites: 0, crystallized: 0 };
        const knowledge = currentKnowledge;
        return {
            total: knowledge.length,
            favorites: knowledge.filter(k => k.isFavorite).length,
            crystallized: knowledge.filter(k => k.isCrystallized).length
        };
    }, [selectedAgent, currentKnowledge]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-aqua pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "代理個人知識庫" : "Agent Personal Knowledge Base"}
                subtitle={locale === 'zh-TW' ? "每個代理的專屬知識聖殿，使用 UUID 區分知識條目" : "Each agent's personal knowledge sanctuary, distinguished by UUID"}
                category="Agency"
            />

            <main className="max-w-7xl mx-auto px-6 mt-12">
                {/* 🤖 代理選擇區域 */}
                <div className="liquid-glass border border-white/10 rounded-[3rem] p-6 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <User size={16} className="text-gray-500" />
                        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                            {locale === 'zh-TW' ? '選擇代理' : 'Select Agent'}
                        </span>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {mockAgents.map(agent => (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent)}
                                className={`flex-shrink-0 p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                                    selectedAgent?.id === agent.id 
                                    ? 'bg-white/10 border-aqua' 
                                    : 'bg-white/5 border-white/5 hover:border-white/20'
                                }`}
                            >
                                <div 
                                    className="size-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
                                    style={{ backgroundColor: agent.avatarColor + '33' }}
                                >
                                    <UserCircle size={24} style={{ color: agent.avatarColor }} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold">{agent.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">{agent.role}</p>
                                    <p className="text-[8px] text-gray-600 font-mono mt-1">{agent.uuid.substring(0, 12)}...</p>
                                </div>
                                <div className="ml-4 text-right">
                                    <p className="text-xl font-black text-aqua">{agent.knowledgeCount}</p>
                                    <p className="text-[8px] text-gray-500 uppercase">
                                        {locale === 'zh-TW' ? '知識' : 'Knowledge'}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

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

                        {/* 篩選按鈕 */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                className={`px-6 py-3 rounded-full border text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 ${
                                    showFavoritesOnly 
                                    ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400' 
                                    : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                }`}
                            >
                                <Star size={14} />
                                {locale === 'zh-TW' ? '收藏' : 'Favorites'}
                            </button>
                            
                            <button
                                onClick={() => setFilterCrystallized(!filterCrystallized)}
                                className={`px-6 py-3 rounded-full border text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 ${
                                    filterCrystallized 
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
                {selectedAgent && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="liquid-glass p-6 border border-white/10 rounded-3xl">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-aqua/20 flex items-center justify-center" style={{ backgroundColor: selectedAgent.avatarColor + '33' }}>
                                    <Database size={24} style={{ color: selectedAgent.avatarColor }} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black">{agentStats.total}</p>
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
                                    <p className="text-2xl font-black">{agentStats.favorites}</p>
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
                                    <p className="text-2xl font-black">{agentStats.crystallized}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                        {locale === 'zh-TW' ? '結晶化' : 'Crystallized'}
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
                                    <p className="text-2xl font-black">{selectedAgent.uuid.substring(0, 8)}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                        Agent UUID
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                {locale === 'zh-TW' ? '選擇其他代理或新增知識條目' : 'Select another agent or add new entries'}
                            </p>
                        </div>
                    )}
                </div>

                {/* + 新增按鈕 */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        onClick={() => setShowAddModal(true)}
                        disabled={!selectedAgent}
                        className="size-16 rounded-full bg-aqua text-black font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-aqua/30 disabled:opacity-30 disabled:hover:scale-100"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </main>

            {/* 📝 新增知識條目 Modal */}
            <AnimatePresence>
                {showAddModal && selectedAgent && (
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
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-black uppercase tracking-widest">
                                        {locale === 'zh-TW' ? '建立知識條目' : 'Create Knowledge Entry'}
                                    </h2>
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-500">
                                        {selectedAgent.name}
                                    </span>
                                </div>
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
                                        id="importFromShared"
                                        className="size-5 rounded border-white/20 bg-white/5 text-aqua focus:ring-aqua"
                                    />
                                    <label htmlFor="importFromShared" className="text-sm text-gray-400 flex items-center gap-2">
                                        <Archive size={14} />
                                        {locale === 'zh-TW' ? '從共享知識庫匯入' : 'Import from Shared Knowledge Base'}
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
                                {selectedEntry.source && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-purple-400">
                                            <Archive size={14} />
                                            {locale === 'zh-TW' ? '來自共享庫' : 'From Shared KB'}
                                        </span>
                                    </>
                                )}
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
                                    <ExternalLink size={16} />
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
