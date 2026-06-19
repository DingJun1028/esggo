"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ChevronRight,
    FileText,
    CheckCircle2,
    Circle,
    BookOpen,
    ShieldCheck,
    Paperclip,
    Info,
    ArrowRight,
    Lock,
    Sparkles,
    RefreshCw
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/context/auth-context";
import { FirestoreService } from "@/lib/services/firestore-service";
import { createOmniHeart, reforgeHeart, IOmniHeart, getTrinityContext } from "@/lib/omni-heart";
import { OmniTrinityShield } from "@/components/ui/omni-trinity-shield";
import { TrinityBreakdown } from "@/components/ui/trinity-breakdown";

interface FrameworkSection {
    id: string;
    title: string;
    status: "completed" | "in-progress" | "pending";
    guidance: {
        why: string;
        what: string;
    };
    evidenceCount: number;
    omniHeart: IOmniHeart;
}

const INITIAL_MOCK_SECTIONS: FrameworkSection[] = [
    {
        id: "305-1",
        title: "GRI 305-1: 直接 (範疇 1) 溫室氣體排放",
        status: "in-progress",
        guidance: {
            why: "量化組織直接控制下產生的排放，是評估氣候風險與減碳績效的首要基礎。",
            what: "需揭露總排放量（以 CO2e 為單位），並註明計算基準、採用的排放係數與 GWP 值。"
        },
        evidenceCount: 2,
        omniHeart: createOmniHeart("Environment", "Carbon", "Evidence_Vault_v3")
    },
    {
        id: "305-2",
        title: "GRI 305-2: 能源間接 (範疇 2) 溫室氣體排放",
        status: "pending",
        guidance: {
            why: "反映組織外購能源產生的間接影響，有助於評估能源採購策略與轉型機會。",
            what: "提供位置基準 (Location-based) 與市場基準 (Market-based) 的排放數據。"
        },
        evidenceCount: 0,
        omniHeart: createOmniHeart("Environment", "Carbon", "Pending_Scan")
    },
    {
        id: "302-1",
        title: "GRI 302-1: 組織內部的能源消耗量",
        status: "completed",
        guidance: {
            why: "追踪實體能源使用是提升資源效率、降低營運成本的關鍵路徑。",
            what: "包含非再生與再生能源消耗緦量（以焦耳或瓦時為單位）。"
        },
        evidenceCount: 5,
        omniHeart: createOmniHeart("Environment", "Energy", "IoT_Historical_Record")
    }
];

export function ReportBuilderView() {
    const { user } = useAuth();
    const [sections, setSections] = useState<FrameworkSection[]>(INITIAL_MOCK_SECTIONS);
    const [selectedId, setSelectedId] = useState("305-1");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSealing, setIsSealing] = useState(false);

    const selectedSection = sections.find(s => s.id === selectedId)!;

    const handleSaveDraft = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await FirestoreService.saveReport({
                userId: user.uid,
                title: selectedSection.title,
                standard: "GRI",
                status: 'draft',
                chapters: {
                    [selectedId]: {
                        chapterId: selectedId,
                        content: content,
                        evidenceIds: []
                    }
                }
            });
            // Simulate updating the heart trace path
            const updatedSections = sections.map(s => {
                if (s.id === selectedId) {
                    s.omniHeart.C_Tag.hooks.onTransfer("Cloud_Draft_Saved");
                    return { ...s };
                }
                return s;
            });
            setSections(updatedSections);
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinalize = async () => {
        if (!user) return;
        setIsSealing(true);
        try {
            // Simulate a deep ZKP Sealing process
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newHeart = reforgeHeart(selectedSection.omniHeart, "Omni_Seal_Authority_v3");
            const updatedSections = sections.map(s => {
                if (s.id === selectedId) {
                    return { ...s, status: "completed" as const, omniHeart: newHeart };
                }
                return s;
            });
            setSections(updatedSections);

            await FirestoreService.saveReport({
                userId: user.uid,
                title: selectedSection.title,
                standard: "GRI",
                status: 'In Progress',
                chapters: {
                    [selectedId]: {
                        chapterId: selectedId,
                        content: content,
                        evidenceIds: []
                    }
                }
            });

            alert("5T 存證密封成功！該章節誠信分值已提升至 " + getTrinityContext(newHeart).divinity + "%");
        } catch (error) {
            console.error("Finalize failed", error);
            alert("存證失敗，請檢查網路連線或權限。");
        } finally {
            setIsSealing(false);
        }
    };

    return (
        <div className="flex flex-1 w-full max-w-7xl mx-auto h-[calc(100vh-8rem)] overflow-hidden gap-6 p-6">
            {/* Sidebar Navigation */}
            <GlassCard className="w-80 flex flex-col border-stone-200/50 bg-stone-50/50 rounded-[32px] overflow-hidden">
                <div className="p-6 border-b border-stone-100 bg-white">
                    <Badge variant="optimal" styleType="soft" className="mb-2 bg-primary-teal-start/10 text-primary-teal-start border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                        REPORT_STRUCTURE
                    </Badge>
                    <h2 className="text-xl font-black text-stitch-text tracking-tighter uppercase font-headline">GRI_Framework</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setSelectedId(section.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-[20px] transition-all group text-left",
                                selectedId === section.id
                                    ? "bg-white shadow-xl border border-stone-200"
                                    : "hover:bg-white/40"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {section.status === "completed" ? (
                                    <CheckCircle2 className="w-4 h-4 text-primary-teal-start" />
                                ) : (
                                    <Circle className={cn("w-4 h-4", section.status === "in-progress" ? "text-amber-500 animate-pulse" : "text-stone-300")} />
                                )}
                                <span className={cn(
                                    "text-[11px] font-black tracking-tight leading-tight",
                                    selectedId === section.id ? "text-stitch-text" : "text-stone-500"
                                )}>
                                    {section.title.split(":")[0]}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-primary-teal-start opacity-70">
                                    {getTrinityContext(section.omniHeart).divinity}%
                                </span>
                                <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", selectedId === section.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} />
                            </div>
                        </button>
                    ))}
                </div>
                <div className="p-6 bg-stone-100/50">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Global Progress</span>
                        <span className="text-sm font-black text-stitch-text tracking-tighter">33%</span>
                    </div>
                    <Progress value={33} className="h-1.5 bg-stone-200" indicatorClassName="bg-primary-teal-start" />
                </div>
            </GlassCard>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-20">
                {/* Guidance Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassCard className="p-8 border-primary-teal-start/10 bg-primary-teal-start/[0.02] rounded-[32px] relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-primary-teal-start text-white flex items-center justify-center font-black">?</div>
                            <span className="text-[10px] font-black text-primary-teal-start uppercase tracking-widest">Why it matters / 專業意義</span>
                        </div>
                        <p className="text-xs font-bold text-stitch-text leading-relaxed">
                            {selectedSection.guidance.why}
                        </p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-teal-start/5 rounded-full blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-primary-teal-start/10 transition-colors" />
                    </GlassCard>

                    <GlassCard className="p-8 border-amber-500/10 bg-amber-50/20 rounded-[32px] relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">i</div>
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">What to express / 披露內容</span>
                        </div>
                        <p className="text-xs font-bold text-stitch-text leading-relaxed">
                            {selectedSection.guidance.what}
                        </p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-amber-500/10 transition-colors" />
                    </GlassCard>
                </div>

                {/* Workspace */}
                <GlassCard className="flex-1 p-10 border-stone-200/50 rounded-[40px] bg-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-[24px] bg-white border border-stone-100 flex items-center justify-center relative shadow-sm overflow-hidden group">
                                <OmniTrinityShield heart={selectedSection.omniHeart} size="sm" className="scale-125" />
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-primary-teal-start" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-stitch-text tracking-tighter uppercase font-headline leading-none mb-2">
                                    WORKSPACE <span className="text-stone-200 mx-2">/</span>
                                    <span className="text-primary-teal-start text-base underline decoration-4 underline-offset-8">{selectedSection.id.replace("-", "_")}_CORE</span>
                                </h3>
                                <div className="flex items-center gap-3">
                                    <Badge variant="optimal" styleType="soft" className="text-primary-teal-start border-primary-teal-start/20 font-black text-[9px] uppercase tracking-widest">
                                        Trinity: {getTrinityContext(selectedSection.omniHeart).divinity}%
                                    </Badge>
                                    <div className="h-4 w-px bg-stone-200" />
                                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-tighter">
                                        HASH: {selectedSection.omniHeart.A_Tagging.hash_lock.slice(0, 16)}...
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSaving || isSealing || !user}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 text-[10px] font-black uppercase text-stone-500 hover:bg-stone-200 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                                {isSaving ? "儲存中..." : "雲端存證草案"}
                            </button>
                            <button
                                onClick={handleFinalize}
                                disabled={isSaving || isSealing || !user}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 group overflow-hidden relative",
                                    selectedSection.status === "completed"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-black text-white hover:bg-zinc-800"
                                )}
                            >
                                <div className="relative z-10 flex items-center gap-2">
                                    {isSealing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-primary-teal-start group-hover:scale-110 transition-transform" />}
                                    <span className="text-[11px] font-black uppercase tracking-widest">
                                        {isSealing ? "執行 5T 封裝中..." : selectedSection.status === "completed" ? "5T 封裝已密封" : "5T 存證密封"}
                                    </span>
                                </div>
                                {isSealing && (
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">披露文本</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-64 p-8 bg-stone-50 border border-stone-100 rounded-[32px] text-sm font-bold text-stitch-text placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-primary-teal-start/5 focus:border-primary-teal-start/20 transition-all resize-none"
                                placeholder="請輸入關於範疇一排放之專業級說明內容..."
                            />
                        </div>

                        {/* Trinity Integrity Breakdown */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Trinity Integrity Analysis / 誠信體系剖析</label>
                                <Badge variant="optimal" styleType="soft" className="bg-stone-100 text-stone-500 text-[8px] font-black border-none uppercase tracking-widest">
                                    NCBDB Chain Sync: Active
                                </Badge>
                            </div>
                            <TrinityBreakdown heart={selectedSection.omniHeart} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Linked Evidence / 關聯 5T 存證</label>
                                <span className="text-[9px] font-black text-primary-teal-start uppercase tracking-widest">{selectedSection.evidenceCount} Nodes Synced</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "p-6 rounded-[24px] border flex items-center justify-center gap-3 transition-all cursor-pointer group relative overflow-hidden",
                                            i < selectedSection.evidenceCount
                                                ? "bg-white border-stone-200 shadow-sm"
                                                : "bg-stone-50 border-dashed border-stone-200 hover:bg-white hover:border-solid"
                                        )}
                                    >
                                        {i < selectedSection.evidenceCount ? (
                                            <>
                                                <div className="flex items-center gap-3 relative z-10">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-stitch-text uppercase tracking-widest">Node_{i + 1}_Verified</span>
                                                </div>
                                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3 relative z-10">
                                                    <Paperclip className="w-4 h-4 text-stone-300 group-hover:text-primary-teal-start transition-colors" />
                                                    <span className="text-[10px] font-bold text-stone-300 group-hover:text-primary-teal-start transition-colors uppercase tracking-widest">Attach Node</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="mt-20 flex justify-between items-center bg-stone-50/50 backdrop-blur-md p-4 rounded-3xl border border-stone-200/50">
                        <button className="px-6 py-2 text-[10px] font-black uppercase text-stone-400 hover:text-stitch-text transition-colors flex items-center gap-2">
                            Previous Section
                        </button>
                        <div className="flex gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i === 1 ? "bg-primary-teal-start" : "bg-stone-200")} />
                            ))}
                        </div>
                        <button className="px-8 py-3 rounded-2xl bg-stitch-text text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">
                            Next Step <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
