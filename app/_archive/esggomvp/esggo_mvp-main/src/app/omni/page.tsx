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
    Lock,
    Shield
} from "lucide-react";
import { getAllReports } from '@/core/ncb/report-actions';
import { IReportMetadata } from '@/core/types/omni-types';
import { TrustBadgeGroup } from '@/components/omni/verification/TrustBadgeGroup';
import { HeartNetworkBadge } from "@/components/omni/nexus/HeartNetworkBadge";
import { OmniMangaTutorial } from "@/components/omni/UI/OmniMangaTutorial";
import { cn } from "@/lib/utils";
import { Radio } from "lucide-react";
import { ReconCenter } from "@/core/omni-recon-center";
import { IntelCard5T } from "@/components/omni/recon/IntelCard5T";
import { IIntelNode5T } from "@/types/omni/recon.types";

const HUB_MANGA_PANELS = [
    {
        id: 1,
        src: '/assets/manga/hub-panel-1.png',
        title: '萬能起點',
        description: '從數據煉金到淨零轉型，在這裡開啟您的全域永續旅程。',
        pill: 'GENESIS'
    },
    {
        id: 2,
        src: '/assets/manga/hub-panel-2.png',
        title: '5T 封印',
        description: '每一份資產皆經過 5T 協議雜湊封印，確保絕對誠信與不可篡改。',
        pill: 'SEAL'
    },
    {
        id: 3,
        src: '/assets/manga/hub-panel-3.png',
        title: '全域監控',
        description: '即時掌控系統負載與資產成長，洞察永續發展的動能。',
        pill: 'OVERSIGHT'
    },
    {
        id: 4,
        src: '/assets/manga/hub-panel-4.png',
        title: '無界樞紐',
        description: '一鍵穿梭至 BI、聚落與碳盤查，實現無縫的跨領域管理。',
        pill: 'NAVIGATE'
    }
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
    const [reconIntel, setReconIntel] = useState<IIntelNode5T[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoad((prev: number) => {
                const delta = Math.floor(Math.random() * 5) - 2;
                return Math.min(Math.max(prev + delta, 0), 100);
            });
        }, 5000);

        const fetchData = async () => {
            try {
                const data = await getAllReports();
                setReports(data || []);
                
                // 🛰️ 獲取最新 3 筆戰略偵情
                const mockSources = [
                    { title: 'UN Plastic Treaty v2.0', insight: 'Global mandatory recycling quotas incoming.', risk_score: 75 },
                    { title: 'ISSB S1/S2 Mandatory Adoption', insight: 'IFRS S1/S2 now legal requirement.', risk_score: 88 },
                    { title: 'EU CBAM Expansion', insight: 'Extended scope to hydrogen.', risk_score: 92 }
                ];
                const reconNodes = mockSources.map((s, idx) => 
                    ReconCenter.ingestingIntelSync(s, idx === 0 ? 'S1' : idx === 1 ? 'S2' : 'S1')
                );
                setReconIntel(reconNodes);
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
        return reports.filter((r: IReportMetadata) =>
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

    const journeySteps = [
        { name: 'Data Forge', active: true, href: '/omni/reports/data-forge' },
        { name: 'Resonance', active: true, href: '/omni/reports/verification' },
        { name: 'Foundry', active: true, href: '/omni/reports/factory' },
        { name: 'Agora', active: true, href: '/omni/reports/agora' },
        { name: 'Analytics', active: true, href: '/omni/bi-analytics' },
    ];

    return (
        <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 theme-aqua">
            {/* 🌌 Top Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 flex items-center gap-4">
                        Omni Hypercenter 
                        <span className="text-[0.65rem] bg-[#63a6b0]/10 text-[#63a6b0] px-3 py-1 rounded-full border border-[#63a6b0]/20 font-mono font-bold uppercase tracking-widest">
                            v2.2.0-AQUA
                        </span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        管理跨領域 ESG 報告資產。遵循<span className="text-[#63a6b0] font-bold mx-1">「英碼繁博」</span>與 5T 協議，確保數據透明與絕對誠信。
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/omni/reports/data-forge/edit">
                        <button className="px-6 py-3 bg-[#63a6b0] text-white font-bold text-sm rounded-2xl hover:bg-[#4a8a94] transition-all flex items-center gap-3 shadow-[0_8px_20px_rgba(99,166,176,0.3)] hover:scale-105 active:scale-95 duration-300">
                            <PlusIcon size={20} /> 煉製新資產
                        </button>
                    </Link>
                </div>
            </header>

            {/* 🗺️ Interactive Journey Map */}
            <div className="flex items-center justify-between px-10 py-6 bg-white border border-[#63a6b0]/10 rounded-[2rem] shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#63a6b0]/5 to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite]" />
                {journeySteps.map((step, idx) => (
                    <React.Fragment key={step.name}>
                        <Link href={step.href}>
                            <div className="flex flex-col items-center gap-2 group/step cursor-pointer">
                                <div className={cn(
                                    "size-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
                                    step.active ? "bg-[#63a6b0] text-white shadow-lg shadow-[#63a6b0]/30" : "bg-slate-100 text-slate-400 border border-slate-200"
                                )}>
                                    {idx + 1}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    step.active ? "text-[#63a6b0]" : "text-slate-300"
                                )}>
                                    {step.name}
                                </span>
                            </div>
                        </Link>
                        {idx < journeySteps.length - 1 && (
                            <div className="flex-1 h-px bg-slate-100 mx-4 relative">
                                <motion.div 
                                    className="absolute inset-0 bg-[#63a6b0]/30"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* 📖 漫畫教學導引 - Global Manifestation */}
            <div className="relative z-10">
                <OmniMangaTutorial 
                    title="Omni Hypercenter：全域樞紐導引" 
                    subtitle="The Heart of Universal Sustainability" 
                    panels={HUB_MANGA_PANELS} 
                />
            </div>

            {/* 📊 Integrated Analytics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.slice(0, 3).map((stat, idx) => (
                    <LiquidGlassContainer
                        key={idx}
                        glowColor={stat.glow === 'aqua' ? '#63a6b0' as any : stat.glow as any}
                        intensity="medium"
                        className="p-6 flex items-center gap-5 bg-white/80 border-[#63a6b0]/10 group hover:border-[#63a6b0]/30 transition-all duration-500"
                    >
                        <div className={cn(
                            "size-14 rounded-[1.25rem] flex items-center justify-center border transition-all duration-500 group-hover:scale-110",
                            stat.glow === 'aqua' ? "bg-[#63a6b0]/10 border-[#63a6b0]/20 text-[#63a6b0]" : cn(stat.bg, stat.color, "border-current/10")
                        )}>
                            <stat.icon size={28} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                                <span className={cn(
                                    "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
                                    stat.glow === 'aqua' ? "text-[#63a6b0] bg-[#63a6b0]/5" : "text-slate-400 bg-slate-50"
                                )}>{stat.sub}</span>
                            </div>
                        </div>
                    </LiquidGlassContainer>
                ))}
                
                {/* 💫 Heart Network Resonance Portal */}
                <HeartNetworkBadge />
            </section>

            {/* 🛰️ Strategic Reconnaissance Hub (New Section) */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic tracking-tight">
                        <div className="p-2 bg-[#63a6b0]/10 rounded-lg">
                            <Shield size={24} className="text-[#63a6b0]" />
                        </div>
                        Strategic Reconnaissance Hub
                    </h3>
                    <Link href="/omni/recon">
                        <button className="flex items-center gap-2 text-xs font-black uppercase text-[#63a6b0] hover:underline tracking-widest">
                            進入指揮部 (Command Center) <ArrowUpRight size={14} />
                        </button>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reconIntel.map((intel) => (
                        <IntelCard5T key={intel.uuid} intel={intel} />
                    ))}
                    {reconIntel.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                            <span className="text-xs font-mono text-slate-300 animate-pulse flex items-center justify-center gap-2">
                                <Radio size={14} className="animate-ping" /> SCANNING GLOBAL FREQUENCIES...
                            </span>
                        </div>
                    )}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 🧬 Sentient Asset Matrix (Middle Section - Reports) */}
                <section className="lg:col-span-2 space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic tracking-tight">
                            <div className="p-2 bg-[#63a6b0]/10 rounded-lg">
                                <History size={24} className="text-[#63a6b0]" />
                            </div>
                            Sentient Asset Matrix
                        </h3>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#63a6b0]/60" />
                            <input
                                type="text"
                                placeholder="搜尋 UUID 或資產名稱..."
                                className="bg-white border border-[#63a6b0]/20 rounded-2xl py-2.5 pl-11 pr-5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#63a6b0]/30 w-full sm:w-72 transition-all shadow-sm placeholder:text-slate-300"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <div className="size-10 border-4 border-[#63a6b0]/10 border-t-[#63a6b0] rounded-full animate-spin" />
                                    <span className="text-xs font-mono text-[#63a6b0] animate-pulse">SYNCHRONIZING NEXUS...</span>
                                </div>
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map((report: IReportMetadata, idx: number) => (
                                    <motion.div
                                        key={report.uuid}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.08, type: "spring", stiffness: 100 }}
                                        className="group"
                                    >
                                        <LiquidGlassContainer className="p-5 hover:border-[#63a6b0]/40 transition-all cursor-pointer bg-white/90 border-[#63a6b0]/10 hover:shadow-xl hover:shadow-[#63a6b0]/5">
                                            <div className="flex items-center justify-between gap-6">
                                                <div className="flex-1 min-w-0 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[0.6rem] font-black text-white bg-[#63a6b0] px-2.5 py-1 rounded-full uppercase tracking-widest">
                                                            {report.domain}
                                                        </span>
                                                        <h4 className="text-base font-bold text-slate-900 truncate group-hover:text-[#63a6b0] transition-colors duration-300">{report.name}</h4>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{report.description}</p>
                                                    <div className="flex items-center gap-4 text-[0.65rem] font-mono text-slate-400">
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                                                            <Lock size={12} className="text-[#63a6b0]" /> 
                                                            <span className="text-slate-600">UUID:</span>
                                                            <span className="text-amber-600 font-bold">{report.uuid}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Activity size={12} className="text-[#63a6b0]" />
                                                            <span>Last Sync: Just Now</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-4 min-w-[120px]">
                                                    <div className={cn(
                                                        "text-[0.6rem] font-black uppercase px-3 py-1 rounded-full shadow-sm border",
                                                        report.status === 'Published' 
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                            : "bg-amber-50 text-amber-600 border-amber-100"
                                                    )}>
                                                        {report.status}
                                                    </div>
                                                    <TrustBadgeGroup
                                                        size="md"
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
                                                <div className="p-2 rounded-full group-hover:bg-[#63a6b0]/10 transition-colors">
                                                    <ChevronRight className="size-6 text-slate-300 group-hover:text-[#63a6b0] group-hover:translate-x-1 transition-all duration-300" />
                                                </div>
                                            </div>
                                        </LiquidGlassContainer>
                                    </motion.div>
                                ))
                            ) : (
                                <LiquidGlassContainer className="py-24 flex flex-col items-center justify-center text-center opacity-60 bg-white/50 border-dashed border-2 border-slate-200">
                                    <Database size={48} className="mb-4 text-slate-300" />
                                    <p className="text-base font-bold text-slate-400">未發現匹配的永續資產</p>
                                    <p className="text-xs text-slate-300 mt-1 font-mono">Searching Sentinel Ledger...</p>
                                </LiquidGlassContainer>
                            )}
                        </AnimatePresence>
                        <Link href="/omni/reports" className="block text-center pt-4 group">
                            <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#63a6b0] group-hover:underline tracking-widest">
                                進入報告中心檔案館 (Full Archive) 
                                <div className="p-1 bg-[#63a6b0]/10 rounded-full group-hover:scale-125 transition-transform duration-300">
                                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </span>
                        </Link>
                    </div>
                </section>

                {/* 📖 Universal Module Directory (Bottom Section - UUID Mapping) */}
                <section className="lg:col-span-1 space-y-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic tracking-tight">
                        <div className="p-2 bg-[#63a6b0]/10 rounded-lg">
                            <LayoutGrid size={24} className="text-[#63a6b0]" />
                        </div>
                        Module Directory
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        {Object.values(OMNI_MODULES).filter(m => m.domain !== 'Hub' && m.status !== 'PLANNED').slice(0, 8).map((module, idx) => (
                            <Link key={module.uuid} href={module.route}>
                                <div className="group p-4 rounded-2xl border border-slate-200 bg-white hover:bg-[#63a6b0]/5 hover:border-[#63a6b0]/30 transition-all duration-500 shadow-sm hover:shadow-lg hover:shadow-[#63a6b0]/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-800 group-hover:text-[#63a6b0] transition-colors duration-300">{module.name}</span>
                                        <span className={cn(
                                            "text-[0.6rem] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
                                            (module.domain as string) === 'Governance' ? "bg-indigo-50 text-indigo-500 border-indigo-100" :
                                            (module.domain as string) === 'Excellence' ? "bg-emerald-50 text-emerald-500 border-emerald-100" :
                                            "bg-[#63a6b0]/10 text-[#63a6b0] border-[#63a6b0]/20"
                                        )}>
                                            {module.domain}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[0.7rem] font-mono text-slate-400">
                                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300 italic">
                                            <span>ID:</span>
                                            <span className="group-hover:text-[#63a6b0]">{module.uuid}</span>
                                        </div>
                                        {module.status === 'ACTIVE' ? (
                                            <div className="flex items-center gap-1.5 text-emerald-500 font-bold group-hover:scale-110 transition-transform">
                                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span>LIVE</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                                                <div className="size-1.5 rounded-full bg-amber-500" />
                                                <span>DEV</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="p-8 bg-gradient-to-br from-[#63a6b0]/20 via-[#63a6b0]/5 to-white rounded-[2.5rem] border border-[#63a6b0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#63a6b0]/10 transition-all duration-700">
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                                英碼繁博協定 
                                <div className="p-1.5 bg-amber-100 rounded-lg">
                                    <Zap size={18} className="text-amber-500" />
                                </div>
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                所有的功能代碼（英碼）與業務敘事（繁博）皆已通過 UUID 鏡像映射。這不僅是管理介面，更是永續誠信的底層法規。
                            </p>
                            <div className="pt-2">
                                <span className="text-[0.6rem] font-mono font-bold text-[#63a6b0] uppercase tracking-[0.3em]">Sentinel Shield Guaranteed</span>
                            </div>
                        </div>
                        <ShieldCheck size={120} className="absolute -bottom-8 -right-8 opacity-[0.03] -rotate-12 group-hover:scale-125 group-hover:rotate-0 transition-all duration-1000 text-[#63a6b0]" />
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
