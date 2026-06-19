"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    BookOpen,
    ChevronRight,
    Sparkles,
    Zap,
    FileText,
    ShieldCheck,
    Database,
    Search,
    PlayCircle,
    Lightbulb,
    ExternalLink,
    Info,
    Lock
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Chapter {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

export function LearningCenterView() {
    const { t } = useTranslation();
    const [activeChapter, setActiveChapter] = useState("intro");

    const chapters: Chapter[] = [
        {
            id: "intro",
            title: t.learningCenter.chapters.intro,
            icon: <Sparkles className="w-5 h-5" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-emerald-900 mb-2">歡迎來到 ESG GO 學習中心</h3>
                            <p className="text-emerald-700 leading-relaxed">
                                ESG GO 是一個專為企業設計的數位永續治理平台。我們結合了 **AI 多代理人技術** 與 **5T 誠信協議 (Traceable, Transparent, Tangible, Trustworthy, Trackable)**，協助企業以最高標準完成 ESG 揭露與數據管理。
                            </p>
                        </div>
                        <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-200 opacity-50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2">加速揭露流程</h4>
                            <p className="text-sm text-slate-500">透過 AI 自動化與範本引導，將原本需要數月的報告書撰寫縮短至數週。</p>
                        </div>
                        <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-orange-600">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2">確保數據真實</h4>
                            <p className="text-sm text-slate-500">所有寫入 EvidenceVault 的數據皆經過 5T 存證，符合 ISSA 5000 國際審計標準。</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "gettingStarted",
            title: t.learningCenter.chapters.gettingStarted,
            icon: <PlayCircle className="w-5 h-5" />,
            content: (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900">快速開始您的永續之旅</h3>
                    <div className="space-y-4">
                        {[
                            { step: "01", title: "建立企業個資檔案", desc: "在「個資檔案」視圖中設定公司基本資訊、產業別與追蹤年度。" },
                            { step: "02", title: "匯入原始數據", desc: "前往「數據源」使用 OmniSrc 上傳 CSV 或串接 API 數據。" },
                            { step: "03", title: "選擇報告範本", desc: "啟動「永續撰寫」並從範本庫選擇合適的 GRI 或 TCFD 框架。" },
                            { step: "04", title: "AI 協作撰寫", desc: "利用 AI 助手生成章節草稿，並連結已存證的數據點。" }
                        ].map((s, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="text-2xl font-black text-slate-200">{s.step}</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{s.title}</h4>
                                    <p className="text-sm text-slate-500">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: "reportWriting",
            title: t.learningCenter.chapters.reportWriting,
            icon: <FileText className="w-5 h-5" />,
            content: (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900">高效報告撰寫技巧</h3>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> AI 提問詞 (Prompt) 建議
                            </h4>
                            <div className="space-y-3 font-mono text-sm opacity-90">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 italic">
                                    "請根據我上傳的溫室氣體數據，撰寫 2024 年範疇二減量成果章節，並引用 5T 存證編號。"
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 italic">
                                    "分析本年度與去年同期的能源效率差異，並生成一個水瀑圖來視覺化改善點。"
                                </div>
                            </div>
                        </div>
                        <FileText className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 text-blue-800 border border-blue-100">
                        <Info className="w-5 h-5 mt-0.5 shrink-0" />
                        <p className="text-sm">
                            **提示：** 在撰寫視圖中，點擊內容區塊右側的小圖標，可以直接開啟「智核」或「數據源」進行即時對標。
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "dataIntegration",
            title: t.learningCenter.chapters.dataIntegration,
            icon: <Database className="w-5 h-5" />,
            content: (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900">數據串接與自動化</h3>
                    <p className="text-slate-500">ESG GO 支援將異質數據源轉換為結構化 ESG 指標。</p>
                    <div className="flex flex-col gap-4">
                        <div className="p-5 border border-slate-200 rounded-2xl hover:border-emerald-500 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-900 group-hover:text-emerald-600">CSV/Excel 智能映射</h4>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-sm text-slate-400">AI 自動辨識欄位並對標 GRI 指標編號。</p>
                        </div>
                        <div className="p-5 border border-slate-200 rounded-2xl hover:border-emerald-500 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-900 group-hover:text-emerald-600">ERP/HR 系統 API 串接</h4>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-sm text-slate-400">即時同步企業內部數據，確保揭露的及時性 (Timeliness)。</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "trustProtocol",
            title: t.learningCenter.chapters.trustProtocol,
            icon: <ShieldCheck className="w-5 h-5" />,
            content: (
                <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl text-white">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3 italic">
                            <Lock className="w-6 h-6 text-emerald-400" /> THE 5T PROTOCOL
                        </h3>
                        <div className="space-y-6">
                            {[
                                { t: "Traceable (真)", d: "每一項 ESG 數據皆與 Evidence Vault 中的原始憑證精確關聯。" },
                                { t: "Transparent (善)", d: "符合國際標準的透明度檢查，主動掃描「綠標/綠漂 (Greenwashing)」風險。" },
                                { t: "Tangible (美)", d: "抽象數據轉化為具體的治理指標，並結合 Skeleton Loader 提升用戶感知效能。" },
                                { t: "Trustworthy (信)", d: "核心數據套用 SHA-256 哈希鎖定，並具備 ADK Integrity Proof 雜湊證明。" },
                                { t: "Trackable (通)", d: "利用 Firebase Data Connect 記錄每一筆 AuditRecord 的編輯軌跡。" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-emerald-400 shrink-0">
                                        {item.t.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{item.t}</div>
                                        <div className="text-sm text-white/60">{item.d}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0 space-y-1">
                    <div className="px-3 mb-6">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.learningCenter.title}</h1>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">{t.learningCenter.manual}</p>
                    </div>

                    <div className="space-y-1">
                        {chapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => setActiveChapter(chapter.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
                                    activeChapter === chapter.id
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                {chapter.icon}
                                {chapter.title}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-2">
                            <Search className="w-3 h-3" /> 找不到答案？
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                            開啟右下角的「AI 顧問」，輸入「/help」即可獲得針對您當前頁面的操作指引。
                        </p>
                    </div>
                </div>

                {/* Right: Content Area */}
                <div className="flex-1 min-w-0 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-10 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeChapter}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                                        {chapters.find(c => c.id === activeChapter)?.title}
                                    </h2>
                                    <div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100">
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {chapters.find(c => c.id === activeChapter)?.content}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
