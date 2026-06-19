"use client";

import React from "react";
import { motion } from "motion/react";
import {
    Database,
    Globe,
    ShieldCheck,
    Wind,
    Target,
    BarChart,
    FileSearch,
    Zap,
    ExternalLink,
    CheckCircle2,
    GitMerge,
    Link,
    Activity
} from "lucide-react";

const DATABASES = [
    {
        id: "gri",
        name: "GRI (全球永續報告準則)",
        description: "最廣泛使用的通用報告框架，涵蓋經濟、環境與社會之重大性揭露項目。",
        icon: Globe,
        color: "blue",
        status: "Connected",
        coverage: "98%",
        mapping: ["SASB", "EU Taxonomy", "SDGs"]
    },
    {
        id: "sasb",
        name: "SASB (永續會計準則)",
        description: "行業特定之財務重大性標準，專注於投資者關注之關鍵指標與價值創造。",
        icon: BarChart,
        color: "teal",
        status: "Live Sync",
        coverage: "100%",
        mapping: ["GRI", "TCFD"]
    },
    {
        id: "tcfd",
        name: "TCFD (氣候相關財務揭露)",
        description: "分析氣候風險與機遇之財務影響架構，強化對氣候韌性之評估與揭露。",
        icon: Wind,
        color: "indigo",
        status: "Connected",
        coverage: "85%",
        mapping: ["ISO 14064", "SBTi"]
    },
    {
        id: "sdgs",
        name: "UN SDGs (聯合國永續目標)",
        description: "企業與全球永續共榮之願景，包含 17 項核心永續發展目標之映射。",
        icon: Target,
        color: "orange",
        status: "Connected",
        coverage: "92%",
        mapping: ["GRI", "CDP"]
    },
    {
        id: "iso14064",
        name: "ISO 14064-1 (GHG)",
        description: "組織溫室氣體排放量計算之國際標準，確保從源頭數據到排放因子之準確度。",
        icon: ShieldCheck,
        color: "emerald",
        status: "Verified",
        coverage: "95%",
        mapping: ["TCFD", "CDP"]
    },
    {
        id: "cdp",
        name: "CDP (碳揭露專案審核)",
        description: "全球領先的氣候透明度披露平台，重點關注碳排放、森林與水資源安全。",
        icon: FileSearch,
        color: "rose",
        status: "Connected",
        coverage: "88%",
        mapping: ["TCFD", "SBTi"]
    },
    {
        id: "eu-taxonomy",
        name: "EU Taxonomy (歐盟分類法)",
        description: "綠色金融活動之分類標準，定義符合綠色轉型路徑之核心揭露指標。",
        icon: Zap,
        color: "amber",
        status: "Connected",
        coverage: "75%",
        mapping: ["GRI", "SBTi"]
    },
    {
        id: "sbti",
        name: "SBTi (科學基礎減量目標)",
        description: "設定與巴黎協定路徑一致之減量目標，實現升溫控制在 1.5°C 內之氣候承諾。",
        icon: Database,
        color: "violet",
        status: "Connected",
        coverage: "90%",
        mapping: ["ISO 14064", "TCFD"]
    }
];

export function ESGDatabaseView() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Database className="w-8 h-8 text-stitch-teal-start" />
                        ESG 知識架構資料庫 (Knowledge Hub)
                    </h2>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-stitch-teal-start/10 text-stitch-teal-start border border-stitch-teal-start/20">
                        <span className="w-2 h-2 rounded-full bg-stitch-teal-start " />
                        <span className="text-xs font-black uppercase tracking-widest">Active Linkage: 8/8</span>
                    </div>
                </div>
                <p className="text-stitch-muted text-lg max-w-2xl font-medium">
                    Omni 數據庫已完成各大國際報告框架之邏輯對接，實現「一次輸入，多方生成」的全自動化合規轉換流程。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DATABASES.map((db, idx) => (
                    <motion.div
                        key={db.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative p-6 rounded-[32px] bg-white border border-stitch-border hover:border-stitch-teal-start transition-all shadow-minimal hover:shadow-minimal flex flex-col h-full overflow-hidden"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />

                        <div className="p-4 rounded-lg bg-stitch-shallow-gray text-stitch-muted mb-6 group-hover:scale-110 transition-transform w-fit">
                            <db.icon className="w-8 h-8" />
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-black tracking-tight">{db.name}</h3>
                            <button className="text-stitch-muted hover:text-stitch-teal-start">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-stitch-muted mb-6 leading-relaxed min-h-[48px] font-medium">
                            {db.description}
                        </p>

                        {/* Mapping Path */}
                        <div className="mb-6 flex-grow">
                            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-stitch-muted uppercase tracking-widest">
                                <GitMerge className="w-3 h-3 text-stitch-teal-start" />
                                自動化映射關聯性
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {db.mapping.map(m => (
                                    <span key={m} className="px-2 py-1 rounded-lg bg-stitch-shallow-gray border border-stitch-border text-[9px] font-bold text-stitch-muted group-hover:border-stitch-teal-start/30 transition-colors">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-stitch-border flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{db.status}</span>
                            </div>
                            <div className="text-[10px] font-black text-stitch-muted uppercase tracking-widest">
                                合規率: <span className="text-stitch-text">{db.coverage}</span>
                            </div>
                        </div>

                        {db.status === "Live Sync" && (
                            <div className="absolute top-6 right-6 flex items-center gap-1.5 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-stitch-critical " />
                                <span className="text-[8px] font-black text-stitch-critical uppercase tracking-tighter">Live</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* AI Strategic Alignment Assistant Extension */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 rounded-[48px] bg-gradient-to-br from-stitch-teal-start via-stitch-teal-dark to-black text-white relative overflow-hidden group shadow-minimal"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/10 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-stitch-teal-light/10 rounded-full blur-3xl -ml-20 -mb-20" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-minimal">
                                <Zap className="w-6 h-6 text-white " />
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tighter">
                                Strategic AI Linkage <span className="text-stitch-teal-start font-normal not-italic opacity-60 ml-2">Active</span>
                            </h3>
                        </div>
                        <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl font-medium">
                            系統偵測到當前數據異動：<span className="text-white font-black underline decoration-stitch-teal-start underline-offset-4">GRI 302-1</span> 的能源數據現已自動映射至 <span className="text-white font-black">TCFD 氣候韌性矩陣</span> 與 <span className="text-white font-black">ISO 14064-1 排放盤查報告</span>。
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-4 rounded-lg bg-white text-black font-black hover:bg-stitch-teal-light hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-minimal uppercase tracking-widest text-xs">
                                查看自動映射報告
                            </button>
                            <button className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-black hover:bg-white/20 transition-all flex items-center gap-2 uppercase tracking-widest text-xs">
                                <Link className="w-4 h-4" />
                                手動校調映射規則
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 shadow-inner">
                        <h4 className="text-[10px] font-black mb-6 flex items-center gap-2 opacity-60 uppercase tracking-widest">
                            <Activity className="w-4 h-4" /> 即時映射數據動態
                        </h4>
                        <div className="space-y-6">
                            {[
                                { label: "跨準則連貫性指標", value: "94%", color: "bg-stitch-teal-start" },
                                { label: "自動對譯章節數量", value: "862 章", color: "bg-indigo-400" },
                                { label: "關鍵缺失揭露提示", value: "12 項", color: "bg-orange-400" },
                            ].map((item, id) => (
                                <div key={id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-tight">{item.label}</span>
                                        <span className="text-sm font-black">{item.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: item.value.includes('%') ? item.value : '70%' }}
                                            className={`h-full ${item.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

