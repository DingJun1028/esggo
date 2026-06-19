/**
 * 📊 Best Practice Planning Platform
 * 
 * 最佳實踐規劃平台
 * 
 * Core Features:
 * 1. Multi-Year Report Template Analysis (多年報告書範本分析)
 * 2. Best Practice Extraction & Benchmarking (最佳實踐萃取與對照)
 * 3. Industry Benchmarking (產業標竿對照)
 * 4. Gap Analysis & Recommendations (缺口分析與建議)
 * 5. Action Planning (行動規劃)
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Target, TrendingUp, BarChart3, PieChart, Radar,
    FileText, History, Search, Filter, Download, Upload,
    ChevronRight, ChevronDown, Star, Award, Zap, Brain,
    CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
    Layers, Globe, Building2, Users, Leaf, Factory,
    Scale, Shield, Clock, Sparkles, Lightbulb, RefreshCw,
    Grid, List, Eye, Edit3, Save, Share2, Printer,
    Rocket, AlertOctagon
} from 'lucide-react';
import { BestPractice, BenchmarkData, TemplateAnalysis, GapRecommendation } from '@/types/index.js';

// ============================================
// Types & Interfaces
// ============================================

// Local interfaces removed, using shared types from @/types/index.js

// ============================================
// Mock Data
// ============================================

const MOCK_BEST_PRACTICES: BestPractice[] = [
    {
        id: 'bp-001',
        category: 'environmental',
        title: 'ISO 14064-1 碳盤查系統化流程',
        description: '建立完整的溫室氣體盤查程序，涵蓋範疇一、二、三排放源',
        source: '台積電 2023 永續報告書',
        industry: '半導體',
        year: 2023,
        effectiveness: 95,
        applicability: 'high',
        metrics: ['碳排放量', '減排目標', '再生能源比例'],
        implementation: { difficulty: 'medium', timeline: '6-12個月', cost: 'medium' }
    },
    {
        id: 'bp-002',
        category: 'social',
        title: 'DEI 多元共融管理系統',
        description: '建立員工多元性數據追蹤與目標設定機制',
        source: '微軟 2023 Sustainability Report',
        industry: '科技業',
        year: 2023,
        effectiveness: 88,
        applicability: 'high',
        metrics: ['女性主管比例', '薪資公平比率', '員工滿意度'],
        implementation: { difficulty: 'easy', timeline: '3-6個月', cost: 'low' }
    },
    {
        id: 'bp-003',
        category: 'governance',
        title: '氣候相關財務揭露 (TCFD) 整合框架',
        description: '將 TCFD 四大核心要素整合至企業風險管理流程',
        source: '金融監督管理委員會',
        industry: '金融服務',
        year: 2023,
        effectiveness: 92,
        applicability: 'high',
        metrics: ['氣候風險評估', '情境分析', '財務影響量化'],
        implementation: { difficulty: 'hard', timeline: '12-18個月', cost: 'high' }
    },
    {
        id: 'bp-004',
        category: 'environmental',
        title: '科學基礎減碳目標 (SBTi) 設定方法論',
        description: '依據 SBTi 標準設定符合 1.5°C 溫控路徑的減排目標',
        source: 'Apple 2023 Environmental Progress Report',
        industry: '科技業',
        year: 2023,
        effectiveness: 97,
        applicability: 'high',
        metrics: ['減排幅度', '目標年份', '再生能源占比'],
        implementation: { difficulty: 'hard', timeline: '6-12個月', cost: 'medium' }
    },
    {
        id: 'bp-005',
        category: 'social',
        title: '供應商永續評估與輔導機制',
        description: '建立供應商 ESG 評估標準與分級輔導制度',
        source: 'Walmart 2023 ESG Report',
        industry: '零售',
        year: 2023,
        effectiveness: 85,
        applicability: 'medium',
        metrics: ['供應商合規率', '輔導覆蓋率', '稽核發現數'],
        implementation: { difficulty: 'medium', timeline: '12-24個月', cost: 'medium' }
    },
    {
        id: 'bp-006',
        category: 'governance',
        title: '永續資訊安全管理體系',
        description: '整合 ESG 數據管理與資訊安全管理，確保揭露可信度',
        source: '資誠永續發展服務',
        industry: '專業服務',
        year: 2023,
        effectiveness: 90,
        applicability: 'medium',
        metrics: ['資安事件數', '數據正確性', '稽核覆蓋率'],
        implementation: { difficulty: 'medium', timeline: '6-12個月', cost: 'medium' }
    }
];

const MOCK_BENCHMARK_DATA: BenchmarkData[] = [
    { category: '環境', metric: '碳排放密度 (tCO2e/百萬營收)', myCompany: 52, industryAvg: 68, topQuartile: 45, bestInClass: 32, trend: 'down' },
    { category: '環境', metric: '再生能源使用率 (%)', myCompany: 35, industryAvg: 42, topQuartile: 65, bestInClass: 85, trend: 'up' },
    { category: '環境', metric: '水資源回收率 (%)', myCompany: 28, industryAvg: 35, topQuartile: 50, bestInClass: 72, trend: 'stable' },
    { category: '社會', metric: '女性主管比例 (%)', myCompany: 32, industryAvg: 28, topQuartile: 38, bestInClass: 45, trend: 'up' },
    { category: '社會', metric: '員工訓練時數 (小時/人)', myCompany: 42, industryAvg: 38, topQuartile: 52, bestInClass: 68, trend: 'stable' },
    { category: '社會', metric: '工安事故率 (件/百萬工時)', myCompany: 0.8, industryAvg: 1.2, topQuartile: 0.5, bestInClass: 0.2, trend: 'down' },
    { category: '治理', metric: '獨立董事比例 (%)', myCompany: 45, industryAvg: 40, topQuartile: 50, bestInClass: 60, trend: 'stable' },
    { category: '治理', metric: 'ESG 稽核覆蓋率 (%)', myCompany: 78, industryAvg: 72, topQuartile: 95, bestInClass: 100, trend: 'up' },
    { category: '治理', metric: '永續資訊揭露完整性 (%)', myCompany: 82, industryAvg: 75, topQuartile: 92, bestInClass: 98, trend: 'up' }
];

const MOCK_TEMPLATE_ANALYSIS: TemplateAnalysis[] = [
    {
        year: 2023,
        framework: 'GRI Standards',
        completeness: 92,
        strengths: ['重大性議題鑑別流程完善', '碳排放揭露符合 TCFD', '供應商管理機制健全'],
        weaknesses: ['生物多樣性揭露不足', '範疇三排放盤查不完整', '人權盡職調查待加強'],
        bestPractices: ['導入科學基礎減碳目標', '建立內部碳定價機制', '推動供應商減碳倡議'],
        innovations: ['AI 輔助重大性議題分析', '即時碳排放監控系統', '員工 ESG 參與平台'],
        gaps: ['自然相關財務揭露 (TNFD)', '氣候情境分析深化', '生物多樣性指標建置']
    },
    {
        year: 2022,
        framework: 'GRI Standards',
        completeness: 85,
        strengths: ['公司治理揭露完整', '環境管理系統 ISO 14001 認證', '員工福利措施多元'],
        weaknesses: ['碳排放資訊不夠透明', '缺乏明確減排目標', '供應商 ESG 評估待建立'],
        bestPractices: ['首次完成範疇一、二盤查', '導入綠色採購政策', '建立廢棄物減量目標'],
        innovations: ['發行首本整合報告書', '成立永續發展委員會', '員工志工假制度'],
        gaps: ['範疇三排放盤查', 'SBTi 目標設定', 'TCFD 氣候風險揭露']
    },
    {
        year: 2021,
        framework: 'GRI Standards',
        completeness: 72,
        strengths: ['公司基本資料揭露', '環境政策制訂', '社会责任活動執行'],
        weaknesses: ['缺乏系統性永續規劃', '量化目標設定不足', '數據收集機制不完善'],
        bestPractices: ['首次發布永續報告書', '啟動溫室氣體盤查', '建立環境管理組織'],
        innovations: ['導入 ISO 14064-1', '成立 ESG 工作小組', '員工環保意識培訓'],
        gaps: ['系統性重大性分析', '減排目標設定', '供應商永續管理']
    }
];

const MOCK_GAP_RECOMMENDATIONS: GapRecommendation[] = [
    {
        id: 'gr-001',
        priority: 'critical',
        category: '環境',
        current: '再生能源使用率 35%',
        target: '再生能源使用率 65%',
        action: '參考 Apple SBTi 最佳實踐，制定 RE100 路徑圖，加速綠電採購與建置',
        timeline: '2025-2027',
        bestPracticeId: 'bp-004'
    },
    {
        id: 'gr-002',
        priority: 'critical',
        category: '治理',
        current: 'TNFD 生物多樣性揭露不足',
        target: '完成 TNFD 框架揭露',
        action: '參照台積電 TNFD 先導經驗，建立自然相關風險評估與生物多樣性指標',
        timeline: '2025-2026',
        bestPracticeId: 'bp-001'
    },
    {
        id: 'gr-003',
        priority: 'high',
        category: '社會',
        current: '範疇三排放覆蓋率 45%',
        target: '範疇三排放覆蓋率 85%',
        action: '參考 Microsoft Scope 3 Protocol，建立供應商碳排放申報機制與輔導計畫',
        timeline: '2025-2026',
        bestPracticeId: 'bp-001'
    },
    {
        id: 'gr-004',
        priority: 'high',
        category: '社會',
        current: '女性主管比例 32%',
        target: '女性主管比例 40%',
        action: '參照微軟 DEI 最佳實踐，制定多元晉升目標與培育計畫，建立友善工作環境',
        timeline: '2025-2027',
        bestPracticeId: 'bp-002'
    },
    {
        id: 'gr-005',
        priority: 'high',
        category: '治理',
        current: '氣候情境分析深度不足',
        target: '完成 2°C 及 1.5°C 情境分析',
        action: '參照金管會 TCFD 指引，建立氣候情境分析能力，量化財務影響',
        timeline: '2025-2026',
        bestPracticeId: 'bp-003'
    },
    {
        id: 'gr-006',
        priority: 'medium',
        category: '環境',
        current: '水資源回收率 28%',
        target: '水資源回收率 55%',
        action: '參考半導體業水資源管理最佳實踐，建置水回收系統與節水措施',
        timeline: '2026-2027',
        bestPracticeId: 'bp-004'
    },
    {
        id: 'gr-007',
        priority: 'medium',
        category: '環境',
        current: '廢棄物回收率 75%',
        target: '廢棄物回收率 90%',
        action: '導入循環經濟理念，建立廢棄物分類與資源化系統',
        timeline: '2026-2027',
        bestPracticeId: 'bp-001'
    },
    {
        id: 'gr-008',
        priority: 'medium',
        category: '社會',
        current: '供應商 ESG 評估覆蓋率 60%',
        target: '供應商 ESG 評估覆蓋率 95%',
        action: '參照 Walmart 供應商輔導機制，建立分級管理制度與獎勵措施',
        timeline: '2025-2027',
        bestPracticeId: 'bp-005'
    },
    {
        id: 'gr-009',
        priority: 'low',
        category: '治理',
        current: '獨立董事比例 45%',
        target: '獨立董事比例 55%',
        action: '檢視董事会组成，提升獨立董事比例多元化',
        timeline: '2026-2028',
        bestPracticeId: 'bp-003'
    },
    {
        id: 'gr-010',
        priority: 'low',
        category: '社會',
        current: '員工滿意度 78分',
        target: '員工滿意度 85分',
        action: '建立員工回饋機制，優化福利制度與職涯發展路徑',
        timeline: '2026-2027',
        bestPracticeId: 'bp-002'
    },
    {
        id: 'gr-011',
        priority: 'medium',
        category: '治理',
        current: 'ESG 資料數位化 70%',
        target: 'ESG 資料數位化 95%',
        action: '建置 ESG 資料管理平台，整合各系統數據，提升揭露效率與可信度',
        timeline: '2025-2026',
        bestPracticeId: 'bp-006'
    },
    {
        id: 'gr-012',
        priority: 'high',
        category: '環境',
        current: '碳中和目標 未設定',
        target: '2050 淨零排放目標',
        action: '依據 SBTi 淨零標準，制定中長期減碳路徑與里程碑',
        timeline: '2025-2026',
        bestPracticeId: 'bp-004'
    }
];

// ============================================
// Components
// ============================================

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    const colors: Record<string, string> = {
        governance: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        environmental: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        social: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
    const labels: Record<string, string> = {
        governance: '治理',
        environmental: '環境',
        social: '社會'
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${colors[category] || colors.governance}`}>
            {labels[category] || category}
        </span>
    );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    const colors: Record<string, string> = {
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    const labels: Record<string, string> = {
        critical: '緊急',
        high: '高',
        medium: '中',
        low: '低'
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${colors[priority] || colors.medium}`}>
            {labels[priority] || priority}
        </span>
    );
};

const TrendArrow: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return <span className="text-slate-400">—</span>;
};

// ============================================
// Main Component
// ============================================

const OmniBestPracticePlanningPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'benchmark' | 'analysis' | 'action'>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedYear, setSelectedYear] = useState<number>(2023);
    const [showActionModal, setShowActionModal] = useState(false);

    // Filtered best practices
    const filteredPractices = useMemo(() => {
        return MOCK_BEST_PRACTICES.filter(practice => {
            const matchesSearch = practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                practice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                practice.industry.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || practice.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    // Statistics
    const stats = useMemo(() => ({
        totalPractices: MOCK_BEST_PRACTICES.length,
        environmental: MOCK_BEST_PRACTICES.filter(p => p.category === 'environmental').length,
        social: MOCK_BEST_PRACTICES.filter(p => p.category === 'social').length,
        governance: MOCK_BEST_PRACTICES.filter(p => p.category === 'governance').length,
        avgEffectiveness: Math.round(MOCK_BEST_PRACTICES.reduce((sum, p) => sum + p.effectiveness, 0) / MOCK_BEST_PRACTICES.length)
    }), []);

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#0a1628] via-[#132744] to-[#0a1628] border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-gradient-to-br from-[#63a6b0] to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight italic">
                                    OmniBestPractice <span className="text-[#63a6b0]">Planning</span>
                                </h1>
                                <p className="text-xs text-slate-400 uppercase tracking-widest">最佳實踐規劃平台</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="bg-transparent text-sm outline-none"
                                >
                                    {MOCK_TEMPLATE_ANALYSIS.map(t => (
                                        <option key={t.year} value={t.year}>{t.year} 年度</option>
                                    ))}
                                </select>
                            </div>
                            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-[#0a1628]/50 border-b border-white/5 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1">
                        {[
                            { id: 'overview', label: '總覽 Overview', icon: Grid },
                            { id: 'benchmark', label: '標竿對照 Benchmark', icon: Trophy },
                            { id: 'analysis', label: '範本分析 Analysis', icon: FileText },
                            { id: 'action', label: '行動規劃 Action', icon: Target }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${activeTab === tab.id
                                    ? 'text-[#63a6b0] border-[#63a6b0] bg-[#63a6b0]/5'
                                    : 'text-slate-400 border-transparent hover:text-slate-200'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Stats Cards */}
                            <div className="grid grid-cols-5 gap-4">
                                {[
                                    { label: '最佳實踐庫', value: stats.totalPractices, icon: Star, color: 'from-amber-500 to-orange-600' },
                                    { label: '環境類', value: stats.environmental, icon: Leaf, color: 'from-emerald-500 to-green-600' },
                                    { label: '社會類', value: stats.social, icon: Users, color: 'from-cyan-500 to-blue-600' },
                                    { label: '治理類', value: stats.governance, icon: Scale, color: 'from-purple-500 to-indigo-600' },
                                    { label: '平均效益', value: `${stats.avgEffectiveness}%`, icon: TrendingUp, color: 'from-[#63a6b0] to-cyan-600' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                                    >
                                        <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-3xl font-black italic">{stat.value}</div>
                                        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Search & Filter */}
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="搜尋最佳實踐..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-[#63a6b0] outline-none transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    {['all', 'environmental', 'social', 'governance'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat
                                                ? 'bg-[#63a6b0] text-white'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            {cat === 'all' ? '全部' : cat === 'environmental' ? '環境' : cat === 'social' ? '社會' : '治理'}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#63a6b0]' : ''}`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#63a6b0]' : ''}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Best Practices Grid/List */}
                            <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-4'}>
                                {filteredPractices.map((practice, i) => (
                                    <motion.div
                                        key={practice.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#63a6b0]/50 transition-all cursor-pointer group ${viewMode === 'list' ? 'flex items-center gap-6' : ''}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <CategoryBadge category={practice.category} />
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-400 fill-current" />
                                                <span className="text-sm font-bold">{practice.effectiveness}%</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#63a6b0] transition-colors">{practice.title}</h3>
                                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{practice.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {practice.metrics.slice(0, 3).map((metric, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs">{metric}</span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>{practice.source}</span>
                                            <span>{practice.industry} • {practice.year}</span>
                                        </div>

                                        {viewMode === 'list' && (
                                            <div className="flex items-center gap-4 ml-auto">
                                                <div className="text-center">
                                                    <div className="text-xs text-slate-400">難度</div>
                                                    <div className="text-sm font-bold">{practice.implementation.difficulty === 'easy' ? '低' : practice.implementation.difficulty === 'medium' ? '中' : '高'}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs text-slate-400">時程</div>
                                                    <div className="text-sm font-bold">{practice.implementation.timeline}</div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#63a6b0]" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Benchmark Tab */}
                    {activeTab === 'benchmark' && (
                        <motion.div
                            key="benchmark"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-3 gap-6">
                                {/* Benchmark Chart */}
                                <div className="col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <BarChart3 className="text-[#63a6b0]" />
                                        產業標竿對照分析
                                    </h3>
                                    <div className="space-y-6">
                                        {MOCK_BENCHMARK_DATA.map((item, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold">{item.metric}</span>
                                                    <TrendArrow trend={item.trend} />
                                                </div>
                                                <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="absolute inset-y-0 left-0 bg-slate-600" style={{ width: `${(item.bestInClass / 100) * 100}%` }} />
                                                    <div className="absolute inset-y-0 left-0 bg-[#63a6b0]" style={{ width: `${(item.myCompany / 100) * 100}%` }} />
                                                    <div className="absolute inset-y-0 left-1/3 bg-emerald-500/50" style={{ width: `${(item.industryAvg / 100) * 100}%` }} />
                                                    <div className="absolute inset-y-0 left-2/3 bg-amber-500/50" style={{ width: `${(item.topQuartile / 100) * 100}%` }} />
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-400">
                                                    <span>0</span>
                                                    <span className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-[#63a6b0]" /> 我
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500/50" /> 產業平均
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-amber-500/50" /> 前25%
                                                        </span>
                                                    </span>
                                                    <span>100</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                                            <span className="text-sm font-bold text-emerald-400">優於產業平均</span>
                                        </div>
                                        <div className="text-4xl font-black text-white mb-2">
                                            {MOCK_BENCHMARK_DATA.filter(d => d.myCompany < d.industryAvg).length}
                                        </div>
                                        <div className="text-xs text-slate-400">項指標領先同業</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                                            <span className="text-sm font-bold text-amber-400">待改進項目</span>
                                        </div>
                                        <div className="text-4xl font-black text-white mb-2">
                                            {MOCK_BENCHMARK_DATA.filter(d => d.myCompany > d.topQuartile).length}
                                        </div>
                                        <div className="text-xs text-slate-400">項指標落後前25%</div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h4 className="text-sm font-bold mb-4">改善優先順序</h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: '再生能源使用率', gap: '-30%', priority: 'critical' },
                                                { label: '水資源回收率', gap: '-22%', priority: 'high' },
                                                { label: '女性主管比例', gap: '-6%', priority: 'medium' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <span className="text-sm">{item.label}</span>
                                                    <PriorityBadge priority={item.priority} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Analysis Tab */}
                    {activeTab === 'analysis' && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Year Selection */}
                            <div className="flex items-center gap-4 mb-6">
                                {MOCK_TEMPLATE_ANALYSIS.map(analysis => (
                                    <button
                                        key={analysis.year}
                                        onClick={() => setSelectedYear(analysis.year)}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedYear === analysis.year
                                            ? 'bg-[#63a6b0] text-white'
                                            : 'bg-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        {analysis.year} 年度
                                    </button>
                                ))}
                            </div>

                            {MOCK_TEMPLATE_ANALYSIS.filter(t => t.year === selectedYear).map(analysis => (
                                <div key={analysis.year} className="space-y-6">
                                    {/* Header Card */}
                                    <div className="bg-gradient-to-r from-[#63a6b0]/20 to-cyan-600/10 border border-[#63a6b0]/30 rounded-3xl p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-black italic">{analysis.year} 年度報告書分析</h2>
                                                <p className="text-slate-400">{analysis.framework} 框架</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-6xl font-black text-[#63a6b0]">{analysis.completeness}%</div>
                                                <div className="text-xs text-slate-400 uppercase tracking-widest">完整性評估</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#63a6b0] to-cyan-400 transition-all duration-1000"
                                                style={{ width: `${analysis.completeness}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Analysis Grid */}
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Strengths */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
                                                <CheckCircle className="w-5 h-5" />
                                                優勢 Strengths
                                            </h3>
                                            <ul className="space-y-3">
                                                {analysis.strengths.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Weaknesses */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400">
                                                <AlertTriangle className="w-5 h-5" />
                                                待加強 Weaknesses
                                            </h3>
                                            <ul className="space-y-3">
                                                {analysis.weaknesses.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Best Practices */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#63a6b0]">
                                                <Star className="w-5 h-5" />
                                                最佳實踐 Best Practices
                                            </h3>
                                            <ul className="space-y-3">
                                                {analysis.bestPractices.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#63a6b0] mt-2 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Gaps */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                                                <Lightbulb className="w-5 h-5" />
                                                缺口 Gaps
                                            </h3>
                                            <ul className="space-y-3">
                                                {analysis.gaps.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Innovations */}
                                    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400">
                                            <Zap className="w-5 h-5" />
                                            年度創新亮點 Innovations
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            {analysis.innovations.map((item, i) => (
                                                <div key={i} className="bg-white/5 rounded-xl p-4">
                                                    <span className="text-sm font-bold">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Action Tab */}
                    {activeTab === 'action' && (
                        <motion.div
                            key="action"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Action Summary */}
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    {
                                        label: '緊急',
                                        value: MOCK_GAP_RECOMMENDATIONS.filter(r => r.priority === 'critical').length,
                                        color: 'bg-red-500/20 text-red-400 border-red-500/30',
                                        icon: AlertOctagon
                                    },
                                    {
                                        label: '高優先',
                                        value: MOCK_GAP_RECOMMENDATIONS.filter(r => r.priority === 'high').length,
                                        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                                        icon: AlertTriangle
                                    },
                                    {
                                        label: '中優先',
                                        value: MOCK_GAP_RECOMMENDATIONS.filter(r => r.priority === 'medium').length,
                                        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                                        icon: Target
                                    },
                                    {
                                        label: '低優先',
                                        value: MOCK_GAP_RECOMMENDATIONS.filter(r => r.priority === 'low').length,
                                        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                                        icon: CheckCircle
                                    }
                                ].map((item, i) => (
                                    <div key={i} className={`rounded-2xl p-6 border ${item.color}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-xs uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <div className="text-4xl font-black mb-1">{item.value}</div>
                                        <div className="text-xs opacity-70">項建議待執行</div>
                                    </div>
                                ))}
                            </div>

                            {/* Action List */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                                <div className="p-6 border-b border-white/10">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Target className="text-[#63a6b0]" />
                                        行動建議清單
                                    </h3>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {MOCK_GAP_RECOMMENDATIONS.map((rec, i) => (
                                        <div key={rec.id} className="p-6 hover:bg-white/5 transition-all cursor-pointer group">
                                            <div className="flex items-start gap-4">
                                                <PriorityBadge priority={rec.priority} />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-white/10 rounded text-xs">{rec.category}</span>
                                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {rec.timeline}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4 mb-3">
                                                        <div>
                                                            <div className="text-xs text-slate-400 mb-1">現況</div>
                                                            <div className="text-sm">{rec.current}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-slate-400 mb-1">目標</div>
                                                            <div className="text-sm font-bold text-[#63a6b0]">{rec.target}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-slate-400 mb-1">建議行動</div>
                                                            <div className="text-sm">{rec.action}</div>
                                                        </div>
                                                    </div>
                                                    {rec.bestPracticeId && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-slate-500">參考最佳實踐：</span>
                                                            <button className="text-xs px-2 py-1 bg-[#63a6b0]/20 text-[#63a6b0] rounded hover:bg-[#63a6b0]/30 transition-colors flex items-center gap-1">
                                                                <Lightbulb className="w-3 h-3" />
                                                                查看詳情
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#63a6b0] transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex items-center justify-end gap-4">
                                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center gap-2 transition-all">
                                    <Save className="w-4 h-4" />
                                    儲存計畫
                                </button>
                                <button
                                    onClick={() => setShowActionModal(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-[#63a6b0] to-cyan-600 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    <Rocket className="w-4 h-4" />
                                    開始執行
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Action Modal */}
            <AnimatePresence>
                {showActionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowActionModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="size-16 rounded-2xl bg-gradient-to-br from-[#63a6b0] to-cyan-600 flex items-center justify-center mb-6 mx-auto">
                                <Rocket className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-center mb-2">確認執行計畫</h3>
                            <p className="text-center text-slate-400 mb-6">
                                確定要將 {MOCK_GAP_RECOMMENDATIONS.length} 項行動建議加入待辦清單嗎？
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowActionModal(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={() => {
                                        setShowActionModal(false);
                                        alert('已成功加入待辦清單！');
                                    }}
                                    className="flex-1 py-3 bg-gradient-to-r from-[#63a6b0] to-cyan-600 rounded-xl font-bold transition-all"
                                >
                                    確認
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OmniBestPracticePlanningPage;
