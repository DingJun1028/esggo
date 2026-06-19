"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Sparkles,
    Zap,
    Target,
    ArrowRight,
    ChevronRight,
    Coins,
    TrendingUp,
    Leaf,
    Globe,
    ShieldCheck,
    ExternalLink,
    ArrowUpRight,
    Star,
    Layers,
    Cpu,
    Briefcase,
    Loader2,
    RefreshCw
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/context/app-context";
import { chatWithESGAssistant } from "@/app/actions";


// --- Types ---
interface AdvisorySolution {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: 'emerald' | 'blue' | 'amber' | 'purple';
    tags: string[];
    impact: string;
    impactLabel: string;
}

const colorMap = {
    emerald: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-600',
        accent: 'bg-emerald-500',
        border: 'border-emerald-200',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        shadow: 'shadow-emerald-500/20'
    },
    blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        accent: 'bg-blue-500',
        border: 'border-blue-200',
        gradient: 'from-blue-500/20 to-indigo-500/20',
        shadow: 'shadow-blue-500/20'
    },
    amber: {
        bg: 'bg-amber-100',
        text: 'text-amber-600',
        accent: 'bg-amber-500',
        border: 'border-amber-200',
        gradient: 'from-amber-500/20 to-orange-500/20',
        shadow: 'shadow-amber-500/20'
    },
    purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        accent: 'bg-purple-500',
        border: 'border-purple-200',
        gradient: 'from-purple-500/20 to-rose-500/20',
        shadow: 'shadow-purple-500/20'
    }
};

export function AdvisoryView() {
    const { t, language } = useTranslation();
    const { auditRecords, globalEsgData } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isMatchLoading, setIsMatchLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const solutions: AdvisorySolution[] = [
        {
            id: "green-finance",
            title: t.advisory.greenFinanceAlliance,
            description: "針對專利減碳技術與綠色基礎設施的專享利息補貼與融資專案。",
            icon: Coins,
            color: "emerald",
            tags: ["Sustainable Debt", "Green Loan"],
            impact: "+24%",
            impactLabel: "CapEx Efficiency"
        },
        {
            id: "supply-chain",
            title: "供應鏈轉型策略",
            description: "輔導二級與三級供應商進行能源診斷與低碳供應鏈重組，降低範疇三排放。",
            icon: TrendingUp,
            color: "blue",
            tags: ["Scope 3", "Supplier Audit"],
            impact: "-18%",
            impactLabel: "Logistics Emission"
        },
        {
            id: "carbon-trading",
            title: "碳權交易路徑",
            description: "整合國際碳匯市場，提供高品質自願減量額度與交易流動性，加速淨零目標。",
            icon: Leaf,
            color: "purple",
            tags: ["VCM", "Offsets"],
            impact: "Net Zero",
            impactLabel: "Alignment Velocity"
        }
    ];

    const handleStrategyMatch = async () => {
        const solution = solutions.find(s => s.id === selectedSolution);
        setIsMatchLoading(true);
        setAiResult(null);
        try {
            const context = solution
                ? `策略方案：${solution.title} — ${solution.description} Tags: ${solution.tags.join(', ')}`
                : undefined;
            const result = await chatWithESGAssistant(
                [{
                    role: 'user', content: language === 'zh'
                        ? `請針對我們企業目前的 ESG 合規狀況（合規率 ${auditRecords.length > 0 ? '已有存證記錄' : '尚無存證'}），分析${solution ? '「' + solution.title + '」方案的' : '最適合的永續融資與碳交易'}具體行動步驟，請用條列方式給出 3-5 項策略建議。`
                        : `Based on our ESG compliance status (${auditRecords.length > 0 ? 'Evidence records present' : 'No evidence yet'}), analyze the specific action steps for ${solution ? solution.title : 'green finance and carbon trading'} and give 3-5 strategic recommendations in bullet points.`
                }],
                'compliance',
                language,
                false,
                context
            );
            if (result.success) {
                setAiResult(result.text);
            } else {
                setAiResult(language === 'zh' ? '【系統提示】AI 分析暫時無法取得，請稍後再試。' : '[System] AI analysis temporarily unavailable. Please try again.');
            }
        } catch {
            setAiResult(language === 'zh' ? '【系統提示】連線失敗，請稍後再試。' : '[System] Connection failed. Please try again.');
        } finally {
            setIsMatchLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#fdfdfd] overflow-hidden">
            {/* Header Area */}
            <div className="bg-white/40 backdrop-blur-md border-b border-slate-200/50 p-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-slate-900 text-white font-black px-3 py-1 text-[9px] tracking-widest uppercase">
                            AI Advisory Console v2.4
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                        {t.advisory.title}
                    </h1>
                    <p className="text-slate-500 max-w-2xl leading-relaxed">
                        {t.advisory.subtitle}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-[1400px] mx-auto space-y-8 pb-12">

                    {/* Primary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-8 h-80 animate-pulse flex flex-col gap-6">
                                    <Skeleton className="w-14 h-14 rounded-2xl" />
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-24 w-full" />
                                    <div className="mt-auto flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-4" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            solutions.map((solution, i) => {
                                const complianceRate = globalEsgData?.complianceRate || 0;
                                const isEligible =
                                    solution.id === "green-finance" ? (complianceRate > 80) :
                                        solution.id === "carbon-trading" ? (complianceRate > 85) :
                                            solution.id === "supply-chain" ? (auditRecords.length > 5) : false;

                                return (
                                    <GlassCard
                                        key={solution.id}
                                        className={cn(
                                            "relative p-8 h-full flex flex-col group cursor-pointer border-transparent",
                                            selectedSolution === solution.id ? "ring-2 ring-primary bg-primary/5 shadow-xl" : "bg-white"
                                        )}
                                        onClick={() => setSelectedSolution(solution.id)}
                                    >
                                        {isEligible && (
                                            <div className="absolute top-6 right-6">
                                                <div className="bg-emerald-500 text-white font-bold text-[9px] px-3 py-1 rounded-full animate-pulse tracking-widest uppercase shadow-lg shadow-emerald-500/20">
                                                    {t.advisory.eligible}
                                                </div>
                                            </div>
                                        )}

                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 shadow-sm",
                                            colorMap[solution.color].bg,
                                            colorMap[solution.color].text
                                        )}>
                                            <solution.icon className="w-7 h-7" />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                                            {solution.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                                            {solution.description}
                                        </p>

                                        <div className="space-y-6">
                                            <div className="flex flex-wrap gap-2">
                                                {solution.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 uppercase tracking-tighter">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t.advisory.impact}</span>
                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                                                        <Target className="w-4 h-4" />
                                                        <span className="text-sm">{solution.impact} {solution.impactLabel}</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                );
                            })
                        )}
                    </div>

                    {/* Secondary Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* AI Matcher */}
                        <GlassCard className="p-10 bg-slate-900 border-none relative overflow-hidden group shadow-2xl" noHover>
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                <Cpu className="w-64 h-64 text-white" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full space-y-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2 border border-emerald-500/20">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white tracking-tight mb-4">
                                        {t.advisory.strategyMatching}
                                    </h4>
                                    <p className="text-slate-400 leading-relaxed max-w-md">
                                        {t.advisory.strategyDesc}
                                    </p>
                                    {!selectedSolution && (
                                        <p className="text-amber-400/70 text-xs font-bold mt-2 uppercase tracking-widest">
                                            {language === 'zh' ? '↑ 請先選擇一個方案卡片' : '↑ Select a solution card above first'}
                                        </p>
                                    )}
                                </div>

                                {/* AI Result */}
                                <AnimatePresence>
                                    {aiResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white/10 border border-white/20 rounded-2xl p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-medium"
                                        >
                                            {aiResult}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-auto pt-4 flex gap-4">
                                    <button
                                        onClick={handleStrategyMatch}
                                        disabled={isMatchLoading}
                                        className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-[1.25rem] font-bold text-sm tracking-tight hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 group disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isMatchLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : aiResult ? (
                                            <RefreshCw className="w-4 h-4" />
                                        ) : (
                                            <Sparkles className="w-4 h-4" />
                                        )}
                                        {isMatchLoading
                                            ? (language === 'zh' ? 'AI 分析中...' : 'Analyzing...')
                                            : aiResult
                                                ? (language === 'zh' ? '重新匹配' : 'Re-match')
                                                : t.advisory.executeMatch
                                        }
                                    </button>
                                    <button className="px-6 py-4 bg-white/5 border border-white/10 text-white/70 rounded-[1.25rem] font-bold text-sm hover:bg-white/10 transition-all">
                                        Settings
                                    </button>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Partner Showcase */}
                        <GlassCard className="p-10 border-slate-100 flex flex-col justify-between bg-white shadow-xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.advisory.partnerNetwork}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Active Sync</span>
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
                                    {t.advisory.greenFinanceAlliance}
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                    {t.advisory.allianceDesc} 目前已整合超過 12 家主流金融機構之專屬產品。
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full bg-slate-50 border-4 border-white flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm relative group cursor-pointer hover:z-10 transition-all hover:-translate-y-1">
                                                <Briefcase className="w-4 h-4 opacity-30" />
                                            </div>
                                        ))}
                                        <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-20">
                                            +12
                                        </div>
                                    </div>
                                    <button className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
                                        {t.advisory.browseDirectory}
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-slate-700">Top Rated Partner: HSBC Sustainable Finance</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded">
                                        1.8% APY Pref.
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-slate-900 text-slate-400 px-8 py-3 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>Compliance-Grade Advisory</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Cross-Border Tax Logic v3.1</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span>Engine: L-Inference-Pro</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-emerald-500">Node Status: Verified</span>
                </div>
            </div>
        </div>
    );
}
