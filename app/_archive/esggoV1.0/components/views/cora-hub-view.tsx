"use client";

import React, { useState, useEffect } from "react";
import {
    FileText,
    Search,
    BookOpen,
    Layout,
    History,
    Star,
    ChevronRight,
    ChevronDown,
    Hash,
    Eye,
    PenTool,
    Zap,
    ShieldCheck,
    BrainCircuit,
    Settings,
    MoreVertical,
    Plus,
    FolderPlus,
    ArrowRight,
    MessageSquare,
    Network,
    Activity,
    Box
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

// Mock Data for Cora Hub
const MOCK_PAGES = [
    { id: "p1", title: "ESG 核心願景與戰略", type: "file", level: 0 },
    {
        id: "p2", title: "法規合規指南", type: "folder", level: 0, children: [
            { id: "p2-1", title: "GRI 305 碳排放標準", type: "file", level: 1 },
            { id: "p2-2", title: "SASB 商業倫理準則", type: "file", level: 1 },
        ]
    },
    { id: "p3", title: "2024 年度永續報告 (草案)", type: "file", level: 0, favorite: true },
    { id: "p4", title: "供應鏈 5T 存證記錄", type: "file", level: 0 },
];

const MOCK_OUTLINE = [
    { id: "o1", title: "1. 數據溯源概覽", level: 1 },
    { id: "o2", title: "2. 5T 協議執行詳情", level: 1 },
    { id: "o3", title: "2.1 誠信核閱 (Truthful)", level: 2 },
    { id: "o4", title: "2.2 隱私封裝 (ZKP)", level: 2 },
    { id: "o5", title: "3. 未來合規風險預估", level: 1 },
];

export function CoraHubView() {
    const [activeTab, setActiveTab] = useState<"pages" | "outline" | "search">("pages");
    const [selectedPage, setSelectedPage] = useState<any>(MOCK_PAGES[0]);
    const [viewMode, setViewMode] = useState<"preview" | "markdown">("preview");
    const [isWikiActive, setIsWikiActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [isCoraWikiAnalyzing, setIsCoraWikiAnalyzing] = useState(false);
    const [wikiReport, setWikiReport] = useState<any>(null);

    const startAnalysis = async () => {
        setIsCoraWikiAnalyzing(true);
        try {
            const fileRes = await fetch("/api/workspace/files");
            const { files } = await fileRes.json();

            const { OmniService } = await import("@/lib/services/omni-service");
            const report = await OmniService.callFlow("workspaceFlow", { files });

            setWikiReport(report);
        } catch (error) {
            console.error("Workspace analysis failed:", error);
            setWikiReport({
                summary: "分析過程中發生錯誤，無法完成全域掃描。",
                techStack: ["Error"],
                readiness: 0,
                recommendations: ["請檢查後端服務連線狀態。"]
            });
        } finally {
            setIsCoraWikiAnalyzing(false);
        }
    };

    return (
        <div className="flex h-full bg-[#0a0a0a] text-white/90 overflow-hidden font-sans selection:bg-primary/30">
            {/* Sidebar - Navigation & Intel */}
            <div className="w-[300px] border-r border-white/5 bg-black/40 flex flex-col backdrop-blur-xl">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-sm font-black tracking-widest uppercase">Cora 智能中心</h1>
                </div>

                {/* Tab Controls */}
                <div className="px-4 flex gap-1 bg-white/5 mx-4 rounded-lg p-1">
                    {[
                        { id: "pages", label: "頁面", icon: Layout },
                        { id: "outline", label: "大綱", icon: Hash },
                        { id: "search", label: "搜索", icon: Search }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60"
                            )}
                        >
                            <tab.icon className="w-3 h-3" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <ScrollArea className="flex-1 mt-4 px-4 overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === "pages" && (
                            <motion.div
                                key="pages"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-1"
                            >
                                {MOCK_PAGES.map((page) => (
                                    <PageItem key={page.id} page={page} active={selectedPage.id === page.id} onClick={() => setSelectedPage(page)} />
                                ))}
                            </motion.div>
                        )}

                        {activeTab === "outline" && (
                            <motion.div
                                key="outline"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" /> 當前文件導覽
                                </div>
                                {MOCK_OUTLINE.map((item) => (
                                    <div key={item.id} className={cn(
                                        "group flex items-center gap-3 py-1 cursor-pointer transition-colors",
                                        item.level === 1 ? "ml-0" : "ml-4"
                                    )}>
                                        <div className={cn(
                                            "text-[11px] font-bold tracking-tight transition-all",
                                            item.level === 1 ? "text-white/70" : "text-white/40 group-hover:text-white/60"
                                        )}>
                                            {item.title}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === "search" && (
                            <motion.div
                                key="search"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <Input
                                        placeholder="多關鍵字搜索 (空格分隔)..."
                                        className="pl-10 h-10 border-white/5 bg-white/5 text-xs font-bold leading-none placeholder:text-white/10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {searchQuery ? (
                                    <div className="space-y-4">
                                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">搜尋結果 (包含 "{searchQuery}")</div>
                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                                            <div className="text-xs font-bold text-blue-400">GRI 305 碳排放標準.md</div>
                                            <p className="text-[10px] text-white/40 leading-relaxed">...確保數據在 <span className="text-white">5T 協議</span> 下的真實性，並對標 <span className="text-white">GRI</span> 國際準則...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center">
                                        <Search className="w-10 h-10 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">輸入關鍵字開始全文檢索</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ScrollArea>

                <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
                    <Button variant="wireframe" className="w-full justify-start gap-3 h-10 border-white/5 bg-white/5 hover:bg-white/10 group">
                        <Plus className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest">新建永續筆記</span>
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-background relative border-r border-white/5">
                <div className="h-[72px] border-b border-white/5 flex items-center justify-between px-8 bg-black/10">
                    <div className="flex items-center gap-4">
                        <Badge variant="primary" styleType="soft" className="text-[9px] font-black tracking-widest uppercase py-1">主權存證版本 V4</Badge>
                        <h2 className="text-sm font-bold tracking-tight text-white/90">{selectedPage?.title}.md</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                            <button
                                onClick={() => setViewMode("preview")}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                                    viewMode === "preview" ? "bg-white text-black" : "text-white/40 hover:text-white/60"
                                )}
                            >
                                預覽模式
                            </button>
                            <button
                                onClick={() => setViewMode("markdown")}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                                    viewMode === "markdown" ? "bg-white text-black" : "text-white/40 hover:text-white/60"
                                )}
                            >
                                源碼模式
                            </button>
                        </div>
                        <Separator orientation="vertical" className="h-6 bg-white/10 mx-2" />
                        <Button variant="wireframe" className="text-white/20 hover:text-white transition-colors w-8 h-8 px-0">
                            <Star className={cn("w-4 h-4", selectedPage?.favorite ? "text-yellow-500 fill-yellow-500" : "")} />
                        </Button>
                        <Button variant="wireframe" className="text-white/20 hover:text-white transition-colors w-8 h-8 px-0">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-12 custom-scrollbar">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "prose prose-invert prose-slate max-w-none",
                                viewMode === "markdown" ? "font-mono text-white/60 leading-relaxed text-sm whitespace-pre-wrap translate-y-2 opacity-50 bg-white/5 p-10 rounded-3xl border border-white/10" : "font-sans"
                            )}
                        >
                            {viewMode === "markdown" ? (
                                `# ${selectedPage.title}

## 1. 數據溯源概覽
在此章節中，我們將探討如何利用 5T 子協議進行全流程數據存證。

## 2. 5T 協議執行詳情
### 2.1 誠信核閱 (Truthful)
每一筆碳排數據皆需通過 Hash Lock 鎖定。

### 2.2 隱私封裝 (ZKP)
採用零知識證明技術確保商業敏感數據不被洩露。`
                            ) : (
                                <>
                                    <h1 className="text-5xl font-black text-white tracking-tighter mb-8 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">{selectedPage?.title}</h1>
                                    <div className="flex items-center gap-6 mb-12 py-4 border-y border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">身份已驗證</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-blue-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">M1 智能同步中</span>
                                        </div>
                                    </div>

                                    <section className="space-y-6">
                                        <h2 className="text-2xl font-black text-white/90 underline decoration-blue-500/50 decoration-4 underline-offset-8 mb-10">1. 數據溯源概覽</h2>
                                        <p className="text-lg text-white/60 leading-loose">
                                            在此章節中，我們將探討如何利用 <span className="text-white font-bold bg-white/10 px-2 py-1 rounded">5T 子協議</span> 進行全流程數據存證。這不僅是技術實踐，更是企業主權的體現。
                                        </p>

                                        <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 my-10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-10 -mt-10" />
                                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-400 mb-6">專家洞察: Cora</h3>
                                            <p className="text-sm text-white/40 italic leading-relaxed">
                                                &quot;真正的數據治理不應僅停留在存儲層面，而是在於每一層級的『可解釋性』與『防偽性』。&quot;
                                            </p>
                                        </div>

                                        <h2 className="text-2xl font-black text-white/90 mb-10 mt-20">2. 5T 協議執行詳情</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">2.1 誠信核閱 (Truthful)</h4>
                                                <p className="text-xs text-white/40 leading-relaxed">每一筆碳排數據皆需通過 Hash Lock 鎖定，確保不可篡改。</p>
                                            </div>
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-pointer text-right">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">2.2 隱私封裝 (ZKP)</h4>
                                                <p className="text-xs text-white/40 leading-relaxed">採用零知識證明技術確保商業敏感數據不被洩露。</p>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between group">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">文件結束 | 誠信密封</p>
                                        <Button variant="wireframe" className="gap-3 group-hover:gap-6 transition-all text-blue-400 font-black uppercase text-[10px] tracking-widest">
                                            下一步: 法規缺口分析 <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </ScrollArea>
            </div>

            {/* Right Pane - Cora Intel & Tools */}
            <div className="w-[380px] bg-black/40 border-l border-white/5 flex flex-col backdrop-blur-3xl relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute top-1/4 -right-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">情報匯總中心</span>
                    </div>
                    <Button variant="wireframe" className="text-white/20 w-8 h-8 px-0">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 p-8 overflow-x-hidden">
                    <div className="space-y-10">
                        {/* CoraWiki Experimental Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <BrainCircuit className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-xs font-black uppercase tracking-widest">CoraWiki <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded ml-2">測試版</span></h3>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 relative overflow-hidden">
                                <p className="text-[11px] text-white/50 leading-relaxed mb-6">
                                    一鍵解析工作區隱性結構，建立專屬於 AI 輔助決策的知識鏈條與架構報告。
                                </p>

                                {isCoraWikiAnalyzing ? (
                                    <div className="space-y-4 py-4">
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-blue-400">
                                            <span>正在解析工作區架構...</span>
                                            <span>76%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-blue-500"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "76%" }}
                                            />
                                        </div>
                                    </div>
                                ) : wikiReport ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-blue-400" />
                                                <span className="text-[10px] font-black uppercase text-blue-300">工作區全域分析報告</span>
                                            </div>
                                            <p className="text-[10px] text-white/60 leading-relaxed font-bold">
                                                {wikiReport.summary}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-3 bg-black/20 rounded-lg">
                                                    <div className="text-sm font-black text-white">{wikiReport.readiness}%</div>
                                                    <div className="text-[8px] font-bold text-white/20 uppercase">合規率</div>
                                                </div>
                                                <div className="text-center p-3 bg-black/20 rounded-lg">
                                                    <div className="text-sm font-black text-white">{wikiReport.techStack.length}</div>
                                                    <div className="text-[8px] font-bold text-white/20 uppercase">技術模塊</div>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">優先技術建議</div>
                                                {wikiReport.recommendations.map((rec: string, i: number) => (
                                                    <div key={i} className="text-[10px] text-blue-300/80 mb-1 flex gap-2">
                                                        <span>•</span> {rec}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Button onClick={() => setWikiReport(null)} variant="wireframe" className="w-full text-white/20 text-[9px] font-black uppercase tracking-widest">重置分析</Button>
                                    </motion.div>
                                ) : (
                                    <Button
                                        onClick={startAnalysis}
                                        className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
                                    >
                                        開始全域架構分析
                                    </Button>
                                )}
                            </div>
                        </section>

                        {/* Plan Constraint Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-xs font-black uppercase tracking-widest">Plan 執行約束 <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded ml-2">核心</span></h3>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: "測試與功能同步開發", active: true },
                                    { label: "每模塊具備 E2E 測項", active: true },
                                    { label: "零知識證明 (ZKP) 驗證", active: false },
                                    { label: "5T 誠信路徑檢查", active: false }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                        <span className={cn("text-xs font-bold transition-colors", item.active ? "text-white/80" : "text-white/20")}>{item.label}</span>
                                        <div className={cn(
                                            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                                            item.active ? "bg-indigo-500 border-indigo-400 text-white" : "border-white/10"
                                        )}>
                                            {item.active && <ShieldCheck className="w-3 h-3" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 border-dashed">
                                <p className="text-[10px] text-white/30 leading-relaxed italic text-center">
                                    &quot;強制性 Plan 約束可確保 AI 生成之執行計劃具備可驗收性與高主權安全係數。&quot;
                                </p>
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">快速協作功能</div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3 hover:bg-white/[0.05] transition-all cursor-pointer group">
                                    <MessageSquare className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">加入對話</span>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3 hover:bg-white/[0.05] transition-all cursor-pointer group">
                                    <Network className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">知識地圖</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </ScrollArea>

                {/* Status Bar */}
                <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Cora 核心同步: 正常</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">版本 V4.3.1</span>
                </div>
            </div>
        </div>
    );
}

function PageItem({ page, active, onClick }: { page: any, active?: boolean, onClick: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-1">
            <div
                onClick={() => {
                    if (page.type === "folder") setIsOpen(!isOpen);
                    onClick();
                }}
                className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all",
                    active ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/60",
                    page.level > 0 && "ml-4"
                )}
            >
                <div className="flex items-center gap-2">
                    {page.type === "folder" ? (
                        isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                    ) : (
                        <div className="w-3 h-3" />
                    )}
                    {page.type === "folder" ? <FolderPlus className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <span className="text-xs font-bold truncate flex-1 tracking-tight">{page.title}</span>
                {page.favorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                <Button variant="wireframe" className="opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity px-0 flex items-center justify-center">
                    <MoreVertical className="w-3 h-3" />
                </Button>
            </div>

            {page.type === "folder" && isOpen && page.children && (
                <div className="space-y-1">
                    {page.children.map((child: any) => (
                        <PageItem key={child.id} page={child} active={false} onClick={onClick} />
                    ))}
                </div>
            )}
        </div>
    );
}

function ServiceExplanationCard({
    title,
    description,
    icon,
    features,
    color,
    actionText,
    onAction
}: any) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-surface-container/30 border border-outline-variant hover:border-outline transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-on-surface-variant/10 group-hover:text-primary/20 transition-colors">
                {React.cloneElement(icon, { size: 120, strokeWidth: 0.5 })}
            </div>

            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-8 shadow-xl border border-outline-variant">
                    {React.cloneElement(icon, { className: "text-primary" })}
                </div>

                <h3 className="text-2xl font-black text-on-surface tracking-tighter mb-4 uppercase">{title}</h3>
                <p className="text-on-surface-variant/70 text-sm leading-relaxed mb-10 max-w-sm font-medium">
                    {description}
                </p>

                <div className="space-y-3 mb-12">
                    {features.map((f: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[11px] font-black text-on-surface/40 uppercase tracking-widest">{f}</span>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={onAction}
                    className="bg-primary text-on-primary hover:bg-primary/90 px-8 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] group/btn"
                >
                    {actionText}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
