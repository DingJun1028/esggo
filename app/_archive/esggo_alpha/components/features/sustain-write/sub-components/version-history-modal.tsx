"use client";

import { Clock, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function VersionHistoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const versions = [
        { id: "v1.4", time: "今天 10:23", user: "Omni-Sphere AI", desc: "自動修復 GRI 302 數值偏誤 (Hash Locked)" },
        { id: "v1.3", time: "昨天 16:45", user: "王永續 (您)", desc: "更新第二章公司治理架備圖與敘事" },
        { id: "v1.2", time: "昨天 09:12", user: "Omni-Sphere AI", desc: "初步整合 2024 年電力報表數據" },
        { id: "v1.1", time: "2024-04-20 14:30", user: "林專員 (共同編輯)", desc: "加入董事會多元化指標清單" },
        { id: "v1.0", time: "2024-04-18 10:00", user: "系統建立", desc: "根據範本產生初始報告結構" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
                    >
                        <div className="p-6 md:p-8 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Version History</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Report Edits & Attribution</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
                                {versions.map((ver, i) => (
                                    <div key={i} className="relative pl-6 group">
                                        <div className={cn(
                                            "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center transition-colors",
                                            i === 0 ? "bg-emerald-500" : "bg-slate-300"
                                        )}>
                                            {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                        </div>
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-slate-800">{ver.id}</span>
                                                <Badge className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest px-1.5 py-0 border-none",
                                                    ver.user.includes("AI") ? "bg-sky-100 text-sky-700" : (i === 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600")
                                                )}>
                                                    {ver.user.includes("AI") ? "AI Automation" : "User Edit"}
                                                </Badge>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">{ver.time}</span>
                                        </div>
                                        <div className="text-xs font-bold text-slate-600 leading-relaxed mb-2">
                                            {ver.desc}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black">
                                            <span className="text-slate-400">由</span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded",
                                                ver.user.includes("AI") ? "bg-sky-50 text-sky-600" : "bg-slate-100 text-slate-700"
                                            )}>{ver.user}</span>
                                            <span className="text-slate-400">完成</span>
                                        </div>

                                        {i === 0 && (
                                            <div className="mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[10px] font-bold text-emerald-800">
                                                目前的最新版本，已於 5T 協議進行存證備份。
                                            </div>
                                        )}
                                        {i !== 0 && (
                                            <button className="hidden mt-2 group-hover:inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">
                                                <RefreshCw className="w-3 h-3" /> 回復此版本
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">保留所有編輯紀錄至 180 天</span>
                            <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all">關閉</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
