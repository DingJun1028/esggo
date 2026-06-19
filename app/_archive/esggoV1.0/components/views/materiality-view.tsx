"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Target,
    Zap,
    ShieldCheck,
    Info,
    ChevronRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { MaterialityIssue } from "@/lib/types/ncb-types";
import ZKPAuditBadge from "@/components/ui/zkp-audit-badge";

const MOCK_ISSUES: MaterialityIssue[] = [
    {
        id: "M-001",
        topic: "氣候變遷與極端氣候風險管理",
        category: "E",
        description: "針對極端天氣對供應鏈造成的營運中斷風險進行量化分析與韌性評估。",
        gri_mapping: ["GRI 302", "GRI 305"],
        currentImpact: 8.5,
        stakeholderImpact: 9.2,
        futureImpact: 9.8,
        trend: 'up',
        confidence: 0.98
    },
    {
        id: "M-002",
        topic: "職業安全衛生與健康管理",
        category: "S",
        description: "維護員工與包商在作業場所的安全保障與職業病預防措施。",
        gri_mapping: ["GRI 403"],
        currentImpact: 7.2,
        stakeholderImpact: 8.5,
        futureImpact: 7.5,
        trend: 'stable',
        confidence: 0.95
    },
    {
        id: "M-003",
        topic: "供應鏈人權盡職調查",
        category: "S",
        description: "針對外部龐大供應鏈的人權狀況進行定期查核與不當行為糾正機制之建立。",
        gri_mapping: ["GRI 408", "GRI 414"],
        currentImpact: 6.5,
        stakeholderImpact: 7.8,
        futureImpact: 8.9,
        trend: 'up',
        confidence: 0.92
    },
    {
        id: "M-004",
        topic: "資訊安全與隱私權保護",
        category: "G",
        description: "強化數位轉型過程中的數據資產保護與反網路攻擊能力建設。",
        gri_mapping: ["GRI 418"],
        currentImpact: 5.8,
        stakeholderImpact: 6.5,
        futureImpact: 9.5,
        trend: 'up',
        confidence: 0.99
    }
];

export function MaterialityView() {
    const [isPropheticMode, setIsPropheticMode] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<MaterialityIssue | null>(null);

    return (
        <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto min-h-screen">
            {/* Header with Prophetic Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-black tracking-tighter text-stitch-text uppercase">
                            重大性矩陣分析 <span className="text-stitch-muted">/ Materiality Prophecy</span>
                        </h1>
                        <ZKPAuditBadge level="L3" />
                    </div>
                    <p className="text-stitch-muted font-medium">
                        基於 5T 存證鏈之巨量數據引擎，自動預測未來 12 個月之戰略風險變動動態。
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-black/5 shadow-minimal">
                    <span className="text-xs font-bold text-stitch-muted ml-2">預測模式 (Prophetic Mode)</span>
                    <button
                        onClick={() => setIsPropheticMode(!isPropheticMode)}
                        className={`relative w-14 h-7 rounded-full transition-all duration-500 shadow-inner ${isPropheticMode ? 'bg-stitch-primary' : 'bg-stitch-muted/20'}`}
                    >
                        <motion.div
                            animate={{ x: isPropheticMode ? 28 : 4 }}
                            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-minimal flex items-center justify-center"
                        >
                            {isPropheticMode ? <Zap className="w-3 h-3 text-stitch-primary" /> : <ChevronRight className="w-3 h-3 text-stitch-muted" />}
                        </motion.div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Matrix Visualization */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <GlassCard className="p-10 aspect-square md:aspect-video relative overflow-hidden bg-white/50 border-black/5 shadow-inner">
                        {/* Matrix Background Axis */}
                        <div className="absolute inset-x-10 bottom-10 h-0.5 bg-black/10 flex items-center justify-end">
                            <span className="text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em] translate-y-6">對業務經營之影響度 (Impact on Business)</span>
                        </div>
                        <div className="absolute inset-y-10 left-10 w-0.5 bg-black/10 flex flex-col items-center justify-start">
                            <span className="text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em] -rotate-90 origin-left -translate-x-6 whitespace-nowrap">對利害關係人之顯著度 (Stakeholder Significance)</span>
                        </div>

                        {/* Matrix Cells */}
                        <div className="absolute inset-10 grid grid-cols-1 md:grid-cols-2 grid-rows-2 opacity-5 pointer-events-none">
                            <div className="border-r border-b border-black"></div>
                            <div className="border-b border-black"></div>
                            <div className="border-r border-black"></div>
                            <div className="border-black"></div>
                        </div>

                        {/* Matrix Plot Points */}
                        <AnimatePresence mode="popLayout">
                            {MOCK_ISSUES.map((issue) => {
                                const x = (issue.currentImpact || 5) * 10;
                                const y = (issue.stakeholderImpact || 5) * 10;
                                const futureImpact = (issue.futureImpact || 5) * 10;

                                return (
                                    <motion.div
                                        key={`${issue.id}-${isPropheticMode}`}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            x: isPropheticMode ? `${futureImpact}%` : `${x}%`,
                                            y: isPropheticMode ? `${100 - futureImpact}%` : `${100 - y}%`
                                        }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                        className="absolute cursor-pointer group"
                                        style={{ left: '-12px', top: '-12px', zIndex: selectedIssue?.id === issue.id ? 50 : 10 }}
                                        onClick={() => setSelectedIssue(issue)}
                                    >
                                        <div className={`p-4 rounded-full shadow-minimal border-4 border-white transition-all group-hover:scale-125 ${issue.category === 'E' ? 'bg-green-500' :
                                            issue.category === 'S' ? 'bg-blue-500' :
                                                'bg-purple-500'
                                            }`}>
                                            {isPropheticMode && issue.trend === 'up' && (
                                                <motion.div
                                                    animate={{ scale: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="absolute inset-0 bg-white/60 rounded-full"
                                                />
                                            )}
                                            <Target className="w-4 h-4 text-white" />
                                        </div>
                                        {/* Tooltip-like Label */}
                                        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-minimal opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap z-50">
                                            <p className="text-xs font-black text-stitch-text">{issue.topic}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="optimal" styleType="soft" className="text-[9px] px-1.5">{issue.category}</Badge>
                                                <span className="text-[9px] font-bold text-stitch-muted tracking-tighter">Impact: {isPropheticMode ? issue.futureImpact : issue.currentImpact}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </GlassCard>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-6 px-10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-minimal" />
                            <span className="text-[10px] font-black text-stitch-text-muted uppercase tracking-widest">Environment (E)</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-minimal" />
                            <span className="text-[10px] font-black text-stitch-text-muted uppercase tracking-widest">Social (S)</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-purple-500 shadow-minimal" />
                            <span className="text-[10px] font-black text-stitch-text-muted uppercase tracking-widest">Governance (G)</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="flex flex-col gap-6">
                    <GlassCard className="p-8 flex flex-col gap-6 bg-stitch-text text-white shadow-minimal relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
                        <h3 className="text-xs font-black flex items-center gap-2 uppercase tracking-widest">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            AI 戰略預測動態 (Prophecy)
                        </h3>
                        <div className="flex flex-col gap-5">
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                <p className="text-xs font-black mb-1.5 text-white/90 underline decoration-emerald-400 underline-offset-4">資安風險路徑現正走強</p>
                                <p className="text-[10px] text-white/60 leading-relaxed font-medium">
                                    預計未來半年內，雲端供應鏈安全與隱私規範將成標竿對齊之重，建議提前校準與合規進度，分數將從 6.5 升至 9.5。
                                </p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                <p className="text-xs font-black mb-1.5 text-white/90">氣候變遷揭露已成核心主軸</p>
                                <p className="text-[10px] text-white/60 leading-relaxed font-medium">
                                    基於 5T+ZKP 的實時對接顯示，環境領域數據之信賴度達 98%，已超越同產業標竿領先地位。
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Issue Detail (If selected) */}
                    <AnimatePresence mode="wait">
                        {selectedIssue ? (
                            <motion.div
                                key={selectedIssue.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <GlassCard className="p-8 flex flex-col gap-6 border-t-4 border-t-stitch-primary shadow-minimal">
                                    <div className="flex justify-between items-start">
                                        <Badge variant={selectedIssue.category === 'E' ? 'optimal' : 'critical'} styleType="soft" className="px-3 py-1 text-[10px] font-black">
                                            {selectedIssue.category} CATEGORY
                                        </Badge>
                                        <button onClick={() => setSelectedIssue(null)} className="text-stitch-muted hover:text-stitch-text transition-colors p-1 bg-stitch-shallow-gray rounded-full">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h4 className="text-xl font-black text-stitch-text leading-tight">{selectedIssue.topic}</h4>
                                    <p className="text-xs text-stitch-text-muted leading-relaxed font-medium">
                                        {selectedIssue.description}
                                    </p>

                                    <div className="flex flex-col gap-3 pt-6 border-t border-black/5">
                                        <div className="flex justify-between items-center bg-stitch-shallow-gray p-3 rounded-xl">
                                            <span className="text-[10px] font-black text-stitch-muted uppercase tracking-widest">GRI MAPPING</span>
                                            <div className="flex gap-1.5">
                                                {selectedIssue.gri_mapping.map(m => (
                                                    <span key={m} className="px-2 py-0.5 bg-white rounded-md text-[9px] font-black border border-black/5">{m}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-stitch-shallow-gray p-3 rounded-xl">
                                            <span className="text-[10px] font-black text-stitch-muted uppercase tracking-widest">ZK-Confidence</span>
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="text-xs font-black">{(selectedIssue.confidence! * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-stitch-text text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black/90 transition-all shadow-minimal active:scale-95">
                                        查看完整分析報告
                                    </button>
                                </GlassCard>
                            </motion.div>
                        ) : (
                            <div className="p-10 border-2 border-dashed border-black/5 rounded-[32px] flex flex-col items-center justify-center text-center gap-4 bg-stitch-shallow-gray/30">
                                <div className="p-4 bg-white rounded-2xl shadow-minimal border border-black/5">
                                    <Info className="w-8 h-8 text-stitch-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-stitch-text uppercase tracking-widest mb-1">請選取議題點</p>
                                    <p className="text-[10px] font-bold text-stitch-muted leading-relaxed px-4">
                                        點擊矩陣中的落點，查看該議題之詳細說明、GRI 對標與 ZKP 信賴值。
                                    </p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
