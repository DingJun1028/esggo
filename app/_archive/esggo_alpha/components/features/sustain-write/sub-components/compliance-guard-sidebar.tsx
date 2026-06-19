"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Loader2,
    Scan,
    CheckCircle2,
    AlertCircle,
    ShieldAlert,
    Target,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAppContext } from "@/lib/context/app-context";
import { getComplianceIndicators } from "@/lib/compliance-engine";

interface ComplianceGuardSidebarProps {
    showComplianceGuard: boolean;
    setShowComplianceGuard: (show: boolean) => void;
    isComplianceChecking: boolean;
    handleCheckCompliance: () => void;
    alignedIndicators: string[];
    toggleIndicator: (id: string) => void;
    traceId?: string;
    integrityCheck?: { status: string; mark: string; protocol: string; timestamp: string; } | null;
}

export function ComplianceGuardSidebar({
    showComplianceGuard,
    setShowComplianceGuard,
    isComplianceChecking,
    handleCheckCompliance,
    alignedIndicators,
    toggleIndicator,
    traceId,
    integrityCheck,
}: ComplianceGuardSidebarProps) {
    const { auditRecords } = useAppContext();

    // Create dynamic indicators matching TaiwanFSC or default
    const dynamicIndicators = React.useMemo(() => {
        const verifiedNodes = auditRecords
            .filter((r: any) => r.status === "Verified" || r.status === "Synced")
            .map((r: any) => r.category || 'ALL');

        if (auditRecords.length > 0) verifiedNodes.push('ALL');

        return getComplianceIndicators(verifiedNodes as string[], 'TaiwanFSC');
    }, [auditRecords]);
    return (
        <AnimatePresence>
            {showComplianceGuard && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-0 -right-[320px] w-72 bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-[2.5rem] p-6 shadow-2xl z-50 hidden xl:block"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-800">Compliance Guard</h4>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">對標指標追蹤</div>
                            </div>
                        </div>
                        <button onClick={() => setShowComplianceGuard(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="relative p-6 bg-slate-900 rounded-[2rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] animate-pulse" />
                            <div className="relative flex flex-col items-center text-center">
                                <Target className="w-8 h-8 text-emerald-400 mb-2 animate-pulse" />
                                <div className="text-[24px] font-black text-white font-mono leading-none">
                                    {dynamicIndicators.length > 0 
                                        ? Math.min(100, Math.round((alignedIndicators.length / dynamicIndicators.length) * 100)) 
                                        : 0}%
                                </div>
                                <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-2">Compliance Score</div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckCompliance}
                            disabled={isComplianceChecking}
                            className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                        >
                            {isComplianceChecking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scan className="w-3.5 h-3.5" />}
                            進行合規性分析
                        </button>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">應揭露指標</span>
                                <span className={cn("text-[10px] font-black", alignedIndicators.length >= dynamicIndicators.length ? "text-emerald-600" : "text-amber-600")}>
                                    {alignedIndicators.length}/{dynamicIndicators.length}
                                </span>
                            </div>

                            {dynamicIndicators.map((ind) => {
                                const isAligned = alignedIndicators.includes(ind.id) || ind.progress === 100;
                                return (
                                    <button
                                        key={ind.id}
                                        onClick={() => toggleIndicator(ind.id)}
                                        className={cn(
                                            "w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 group relative overflow-hidden",
                                            isAligned
                                                ? "bg-emerald-50 border-emerald-200"
                                                : "bg-slate-50 border-slate-100 hover:border-emerald-100"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all",
                                            isAligned ? "bg-emerald-500 border-emerald-500 scale-110" : "border-slate-300"
                                        )}>
                                            {isAligned && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={cn("text-[11px] font-black truncate", isAligned ? "text-emerald-900" : "text-slate-700")}>
                                                {ind.id}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 truncate">{ind.req}</div>
                                        </div>
                                        <div className="absolute inset-y-0 right-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                    </button>
                                )
                            })}
                        </div>

                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 relative">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">合規建議</span>
                            </div>
                            <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                                目前文本中缺少關於「利害關係人議合」的具體流程描述。建議使用左側「共寫提示」來補足此部分，以符合 GRI 2-29 標準。
                            </p>
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        </div>

                        {/* 5T Integrity Section */}
                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-sky-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">5T 內部誠信追蹤</span>
                            </div>

                            {integrityCheck ? (
                                <div className="space-y-4">
                                    <div className="bg-slate-900 rounded-[1.5rem] p-4 text-white relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
                                        <div className="relative flex items-center justify-between mb-2">
                                            <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Mark: {integrityCheck.mark}</div>
                                            <div className="flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="text-[8px] font-bold text-slate-400">Protocol: {integrityCheck.protocol}</div>
                                            <div className="text-[8px] font-bold text-slate-500 font-mono italic">Verified</div>
                                        </div>
                                        {traceId && (
                                            <div className="mt-3 pt-3 border-t border-white/5">
                                                <div className="text-[7px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">Omni-Trace ID</div>
                                                <div className="text-[9px] font-mono text-slate-300 break-all">{traceId}</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-1">
                                        <p className="text-[9px] font-bold text-slate-400 leading-tight">
                                            此內容已通過 V8.1 SEAL 高信任密封。所有改寫歷程與數據連結均已存檔於內部 5T 審計軌跡，可隨時供確信機構查核。
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[1.5rem] p-6 text-center">
                                    <p className="text-[10px] font-bold text-slate-400">尚未產生 5T 誠信標記</p>
                                    <div className="text-[8px] font-medium text-slate-400 mt-1">執行 AI 協作將自動啟動密封程序</div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
