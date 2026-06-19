"use client";

import React, { useState, useEffect, useMemo } from "react";
import { OMNI_MODULES } from "../../config/omni-modules";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import {
    Activity,
    Server,
    ArrowUpRight,
    Database,
    ShieldCheck,
    History,
    LayoutGrid,
    Zap,
    Search,
    ChevronRight,
    Lock
} from "lucide-react";
import { getAllReports } from '@/core/ncb/report-actions';
import { IReportMetadata } from '@/core/types/omni-types';
import { TrustBadgeGroup } from '@/components/omni/verification/TrustBadgeGroup';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';
import { cn } from "@/lib/utils";

const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
    { id: '1', title: '系統現狀', description: '傳統管理往往見樹不見林，企業難以從宏觀視角掌握全域的永續運作脈絡。', color: 'danger' },
    { id: '2', title: '超中心監控', description: 'Omni Hypercenter 提供全局的明亮視角，即時監控系統負載、活體資產與 5T 狀態。', color: 'primary' },
    { id: '3', title: '資產矩陣', description: '每一份永續報告皆被轉化為具備「英碼繁博」與 4D 時空座標的 5T 領域資產。', color: 'accent' },
    { id: '4', title: '無界樞紐', description: '作為永續資料庫的終極樞紐，自此處能一鍵穿梭至所有功能模塊，達成全域管理。', color: 'success' }
];

/**
 * 🛰️ Omni Hypercenter & Reports Hub (萬能量化超中心) - Light Theme
 */
export default function OmniHypercenter() {
    // Technical Stats
    const [load, setLoad] = useState(45);
    const [uptime] = useState(99.99);

    // Business Stats
    const [reports, setReports] = useState<IReportMetadata[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoad((prev) => {
                const delta = Math.floor(Math.random() * 5) - 2;
                return Math.min(Math.max(prev + delta, 0), 100);
            });
        }, 5000);

        const fetchData = async () => {
            try {
                const data = await getAllReports();
                setReports(data || []);
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        return () => clearInterval(interval);
    }, []);

    const filteredReports = useMemo(() => {
        return reports.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.uuid.includes(searchQuery)
        ).slice(0, 5); // Latest 5 for dashboard
    }, [reports, searchQuery]);

    const stats = [
        { label: '系統負載', value: `${load}%`, sub: 'Optimal', icon: Activity, color: 'text-omni-primary', glow: 'aqua', bg: 'bg-omni-primary/10' },
        { label: '連續運行', value: `${uptime}%`, sub: 'Stable', icon: Server, color: 'text-indigo-500', glow: 'indigo', bg: 'bg-indigo-500/10' },
        { label: '永續資產', value: reports.length, sub: 'Total Atoms', icon: Database, color: 'text-emerald-500', glow: 'emerald', bg: 'bg-emerald-500/10' },
        { label: '5T 覆蓋', value: '88%', sub: 'High Conf', icon: Zap, color: 'text-amber-500', glow: 'amber', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* 🌌 Top Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                        Omni Hypercenter <span className="text-xs bg-omni-primary/10 text-omni-primary px-2 py-1 rounded border border-omni-primary/20 font-mono">v2.1.0-INTEGRATED</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">管理 200+ 種 ESG 報告，以「英碼繁博」與 5T 協議確保數據透明與絕對真理。</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/omni/reports/data-forge/edit">
                        <button className="px-5 py-2.5 bg-omni-primary text-white font-black text-sm rounded-xl hover:bg-omni-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-omni-primary/20">
                            <PlusIcon size={18} /> 煉製新資產
                        </button>
                    </Link>
                </div>
            </header>

            {/* 📖 漫畫教學導引 */}
            <OmniComicStrip panels={comicPanels} />

            {/* 📊 Integrated Analytics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <LiquidGlassContainer
                        key={idx}
                        glowColor={stat.glow as any}
                        intensity="low"
                        className="p-5 flex items-center gap-4 bg-white"
                    >
                        <div className={cn("size-12 rounded-2xl flex items-center justify-center border border-slate-100", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                                <span className="text-[9px] text-slate-400 font-mono">{stat.sub}</span>
                            </div>
                        </div>
                    </LiquidGlassContainer>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 🧬 Sentient Asset Matrix (Middle Section - Reports) */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
                            <History size={20} className="text-omni-primary" /> Sentient Asset Matrix (資產矩陣)
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="搜尋 UUID 或資產名稱..."
                                className="bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-omni-primary/50 w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="size-8 border-2 border-slate-200 border-t-omni-primary rounded-full animate-spin" />
                                </div>
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map((report, idx) => (
                                    <motion.div
                                        key={report.uuid}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group"
                                    >
                                        <LiquidGlassContainer className="p-4 hover:border-omni-primary/30 transition-all cursor-pointer bg-white">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-[9px] font-mono text-omni-primary bg-omni-primary/10 px-1.5 py-0.5 rounded border border-omni-primary/20 uppercase">
                                                            {report.domain}
                                                        </span>
                                                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-omni-primary transition-colors">{report.name}</h4>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 truncate">{report.description}</p>
                                                    <div className="mt-2 text-[9px] font-mono text-slate-400 flex items-center gap-2">
                                                        <Lock size={10} className="text-omni-primary" /> UUID: <span className="text-amber-500">{report.uuid}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-3">
                                                    <div className={cn(
                                                        "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                                                        report.status === 'Published' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                                    )}>
                                                        {report.status}
                                                    </div>
                                                    <TrustBadgeGroup
                                                        size="sm"
                                                        showLabel={false}
                                                        status={{
                                                            tangible: true,
                                                            traceable: true,
                                                            trackable: true,
                                                            transparent: true,
                                                            trustworthy: report.status === 'Published'
                                                        }}
                                                    />
                                                </div>
                                                <ChevronRight className="size-5 text-slate-300 group-hover:text-omni-primary group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </LiquidGlassContainer>
                                    </motion.div>
                                ))
                            ) : (
                                <LiquidGlassContainer className="py-12 flex flex-col items-center justify-center text-center opacity-50 bg-white">
                                    <Database size={40} className="mb-4 text-slate-400" />
                                    <p className="text-sm text-slate-500">未發現匹配的永續資產</p>
                                </LiquidGlassContainer>
                            )}
                        </AnimatePresence>
                        <Link href="/omni/reports" className="block text-center pt-2">
                            <span className="text-[10px] font-black uppercase text-omni-primary hover:underline flex items-center justify-center gap-1 group">
                                進入報告中心檔案館 (Full Archive) <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </section>

                {/* 📖 Universal Module Directory (Bottom Section - UUID Mapping) */}
                <section className="lg:col-span-1 space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
                        <LayoutGrid size={20} className="text-omni-primary" /> Module Directory (目錄)
                    </h3>

                    <div className="space-y-3">
                        {Object.values(OMNI_MODULES).filter(m => m.domain !== 'Hub' && m.status !== 'PLANNED').slice(0, 6).map((module, idx) => (
                            <Link key={module.uuid} href={module.route}>
                                <div className="group p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-omni-primary/30 transition-all shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-800 group-hover:text-omni-primary transition-colors">{module.name}</span>
                                        <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono uppercase tracking-tighter">
                                            {module.domain}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[8.5px] font-mono text-slate-400">
                                        <span className="opacity-60 group-hover:opacity-100 transition-opacity">ID: {module.uuid}</span>
                                        {module.status === 'ACTIVE' ? (
                                            <span className="text-emerald-500 font-bold group-hover:animate-pulse">● LIVE</span>
                                        ) : (
                                            <span className="text-amber-500 font-bold">● DEV</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="p-6 bg-gradient-to-br from-omni-primary/10 to-transparent rounded-3xl border border-omni-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2 italic">英碼繁博協定 <Zap size={16} className="text-amber-500" /></h4>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-light">
                                所有的功能代碼（英碼）與業務敘事（繁博）皆已通過 UUID 鏡像映射。這不僅是管理介面，更是永續誠信的底層法規。
                            </p>
                        </div>
                        <ShieldCheck size={80} className="absolute -bottom-4 -right-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform text-omni-primary" />
                    </div>
                </section>
            </div>
        </div>
    );
}

function PlusIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
