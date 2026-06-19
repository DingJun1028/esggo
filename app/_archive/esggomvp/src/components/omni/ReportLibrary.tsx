'use client';

import { useState, useMemo } from 'react';
import { ReportsGrid } from '@/components/omni/liquid-glass/ReportsGrid';
import { ReportCard } from '@/components/omni/liquid-glass/ReportCard';
import { ReportStatus } from '@/components/omni/liquid-glass/ReportCard';
import {
    ALL_REPORTS,
    getReportsByCategory,
    getReportStats,
    ReportCategory,
} from '@/core/dtos/report-schema.dto';
import {
    Sparkles, Search, Leaf, Users, Building2,
    LayoutGrid, Activity, FileText, Flame, ShieldCheck,
    Factory, Zap, Droplets, Recycle, BatteryCharging, Sun,
    HeartPulse, GraduationCap, Globe, Scale, Boxes,
    ShieldAlert, CheckSquare, Award, Lock, Database,
    Network, BarChart2, CloudLightning, TreePine, ShoppingCart,
    RefreshCw, Target, Landmark, TrendingDown, BadgeCheck,
    Microscope, FileSearch, Wind, PackageSearch, Home,
    Star, AlertOctagon, HandHeart, HardHat, TrendingUp,
    Lightbulb, PieChart, Heart, UserCheck, ShieldOff,
    UserCog, Wallet, ClipboardCheck, Shield, Receipt,
    ArrowLeft, Grid3X3, Maximize2, Columns
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// 圖示映射表（完整版）
const ICON_MAP: Record<string, React.ElementType> = {
    FileText, Flame, ShieldCheck, Users, Building2,
    Activity, Factory, Zap, Droplets, Recycle, BatteryCharging, Sun,
    HeartPulse, GraduationCap, Globe, Scale, Boxes,
    ShieldAlert, CheckSquare, Award, Lock, Database,
    Network, BarChart2, CloudLightning, TreePine, ShoppingCart,
    RefreshCw, Target, Landmark, TrendingDown, BadgeCheck,
    Microscope, FileSearch, Wind, PackageSearch, Home,
    Star, AlertOctagon, HardHat, TrendingUp,
    Lightbulb, PieChart, Heart, UserCheck, Leaf,
    UserCog, Wallet, ClipboardCheck, Shield, Receipt,
};

const CATEGORY_TABS: Array<{ id: ReportCategory; label: string; labelEn: string; icon: React.ElementType; color: string }> = [
    { id: 'ALL', label: '全部報告', labelEn: 'All Reports', icon: LayoutGrid, color: 'text-white' },
    { id: 'ENV', label: '環境', labelEn: 'Environmental', icon: Leaf, color: 'text-emerald-400' },
    { id: 'SOC', label: '社會', labelEn: 'Social', icon: Users, color: 'text-sky-400' },
    { id: 'GOV', label: '治理', labelEn: 'Governance', icon: Building2, color: 'text-violet-400' },
];

const CATEGORY_COLORS: Record<ReportCategory, string> = {
    ALL: 'border-white/20',
    ENV: 'border-emerald-500/50',
    SOC: 'border-sky-500/50',
    GOV: 'border-violet-500/50',
};

export type LayoutDensity = 'COMPACT' | 'FOCUSED' | 'DISTRIBUTED';

export function ReportLibrary() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<ReportCategory>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [density, setDensity] = useState<LayoutDensity>('FOCUSED');

    const stats = useMemo(() => getReportStats(), []);

    const filteredReports = useMemo(() => {
        let reports = getReportsByCategory(activeCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            reports = reports.filter(r =>
                r.name.toLowerCase().includes(q) ||
                r.name_en.toLowerCase().includes(q) ||
                (r.standardRef?.toLowerCase().includes(q) ?? false)
            );
        }
        return reports;
    }, [activeCategory, searchQuery]);

    return (
        <div className="w-full text-white selection:bg-omni-primary/30">
            {/* 🛸 頂部 Hero & 統計 Banner */}
            <header className="relative px-6 sm:px-10 pt-10 pb-8 border-b border-white/5 overflow-hidden">
                {/* 背景裝飾 */}
                <div className="absolute inset-0 bg-gradient-to-br from-omni-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-omni-primary/5 blur-3xl rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-omni-primary/10 border border-omni-primary/20 text-[10px] font-black tracking-[0.3em] uppercase text-omni-primary mb-4">
                        <Sparkles size={10} />
                        Omni Report Forge · v2.0.0
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-2">
                        REPORTS <span className="text-omni-primary" style={{ textShadow: '0 0 40px var(--theme-primary-muted)' }}>CENTER</span>
                    </h1>
                    <p className="text-white/40 text-sm leading-relaxed font-medium max-w-xl">
                        ESG Go # 善向永續報告中心 — 管理 200+ 種 ESG 報告，以「英碼繁博」核心協定確保數據透明與絕對真理。
                    </p>
                </motion.div>

                {/* 📊 統計 Chips */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 flex flex-wrap gap-4 mt-8"
                >
                    <StatChip label="報告總數" value={stats.total} color="text-white" />
                    <StatChip label="進行中 Active" value={stats.active} color="text-emerald-400" dot="bg-emerald-400" />
                    <StatChip label="草稿 Draft" value={stats.draft} color="text-white/60" dot="bg-white/30" />
                    <StatChip label="待審閱 Pending" value={stats.pending} color="text-amber-400" dot="bg-amber-400" />
                    <div className="w-px h-8 bg-white/10 self-center mx-2" />
                    <StatChip label="ENV 環境" value={stats.env} color="text-emerald-400" />
                    <StatChip label="SOC 社會" value={stats.soc} color="text-sky-400" />
                    <StatChip label="GOV 治理" value={stats.gov} color="text-violet-400" />
                </motion.div>
            </header>

            {/* 🔍 搜尋欄 + 分類 Tabs */}
            <div className="px-6 sm:px-10 py-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-white/5 sticky top-0 bg-[#050510]/95 backdrop-blur-xl z-20">
                {/* Category Tabs */}
                <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                    {CATEGORY_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeCategory === tab.id;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveCategory(tab.id)}
                                whileTap={{ scale: 0.97 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${isActive
                                    ? 'bg-omni-primary/20 text-omni-primary border border-omni-primary/30'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={13} className={isActive ? 'text-omni-primary' : tab.color} />
                                <span className="hidden sm:block">{tab.label}</span>
                                <span className="sm:hidden">{tab.labelEn.split(' ')[0]}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* 搜尋欄 + 密度切換 */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    {/* Density Switcher */}
                    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
                        <button
                            onClick={() => setDensity('COMPACT')}
                            className={`p-2 rounded-lg transition-all ${density === 'COMPACT' ? 'bg-omni-primary text-white shadow-lg shadow-omni-primary/20' : 'text-white/30 hover:text-white/60'}`}
                            title="Compact Density"
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            onClick={() => setDensity('FOCUSED')}
                            className={`p-2 rounded-lg transition-all ${density === 'FOCUSED' ? 'bg-omni-primary text-white shadow-lg shadow-omni-primary/20' : 'text-white/30 hover:text-white/60'}`}
                            title="Focused view"
                        >
                            <Columns size={16} />
                        </button>
                        <button
                            onClick={() => setDensity('DISTRIBUTED')}
                            className={`p-2 rounded-lg transition-all ${density === 'DISTRIBUTED' ? 'bg-omni-primary text-white shadow-lg shadow-omni-primary/20' : 'text-white/30 hover:text-white/60'}`}
                            title="Distributed View"
                        >
                            <Maximize2 size={16} />
                        </button>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="搜尋報告名稱、標準..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-omni-primary/40 focus:bg-white/8 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* 📊 報告網格 */}
            <main className="px-6 sm:px-10 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-black tracking-[0.5em] uppercase text-white/20 border-l-2 border-omni-primary pl-4">
                        {activeCategory === 'ALL' ? 'All Reports' : CATEGORY_TABS.find(t => t.id === activeCategory)?.labelEn} · {filteredReports.length} 份
                    </h2>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-xs text-white/40 hover:text-white transition-colors"
                        >
                            清除搜尋
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {filteredReports.length > 0 ? (
                        <motion.div
                            key={`${activeCategory}-${searchQuery}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={
                                density === 'COMPACT' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3' :
                                    density === 'DISTRIBUTED' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' :
                                        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            }>
                                {filteredReports.map((report) => (
                                    <ReportCard
                                        key={report.id}
                                        uuid={report.id}
                                        title={report.name}
                                        subtitle={report.name_en}
                                        version={report.version}
                                        status={report.status as ReportStatus}
                                        icon={ICON_MAP[report.icon] || FileText}
                                        category={report.category}
                                        completionRate={report.completionRate}
                                        standardRef={report.standardRef}
                                        stitchId={`rep-card-${report.id}`}
                                        onClick={() => router.push(`/omni/reports/${report.id}`)}
                                        compact={density === 'COMPACT'}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 text-center"
                        >
                            <Search size={40} className="text-white/10 mb-4" />
                            <p className="text-white/30 text-sm font-mono">找不到符合「{searchQuery}」的報告</p>
                            <button onClick={() => setSearchQuery('')} className="mt-4 text-xs text-omni-primary hover:underline">
                                清除搜尋條件
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 📡 底部狀態列 */}
            <footer className="px-6 sm:px-10 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-[10px] font-mono text-white/20">
                    <p>PROTOCOL: OMNI-REPORTS-CORE v2.0</p>
                    <p>SYNC_STATUS: RESONATING WITH NCB · SCHEMA_REGISTRY: {Object.keys({}).length > 0 ? 'ACTIVE' : 'READY'}</p>
                </div>
                <div className="flex gap-8 text-[10px] font-black tracking-widest uppercase text-white/30">
                    <span className="hover:text-omni-primary cursor-pointer transition-colors">Documentation</span>
                    <span className="hover:text-omni-primary cursor-pointer transition-colors">API Reference</span>
                    <span className="hover:text-omni-primary cursor-pointer transition-colors">Support</span>
                </div>
            </footer>
        </div>
    );
}

function StatChip({ label, value, color, dot }: {
    label: string;
    value: number;
    color: string;
    dot?: string;
}) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 hover:border-white/15 transition-colors">
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />}
            <span className="text-[10px] text-white/30 font-mono">{label}</span>
            <span className={`text-sm font-black ${color}`}>{value}</span>
        </div>
    );
}
