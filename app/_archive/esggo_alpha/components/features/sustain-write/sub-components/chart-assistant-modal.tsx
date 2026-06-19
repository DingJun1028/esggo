"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    BarChart3,
    Sparkles,
    Loader2
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    Area
} from "recharts";

interface ChartAssistantModalProps {
    showChartModal: boolean;
    setShowChartModal: (show: boolean) => void;
    isChartGenerating: boolean;
    chartData: any[];
    title: string;
    chartModifier: string;
    setChartModifier: (val: string) => void;
    handleModifyChart: () => void;
}

export function ChartAssistantModal({
    showChartModal,
    setShowChartModal,
    isChartGenerating,
    chartData,
    title,
    chartModifier,
    setChartModifier,
    handleModifyChart,
}: ChartAssistantModalProps) {
    return (
        <AnimatePresence>
            {showChartModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        onClick={() => setShowChartModal(false)}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl glass-effect rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] border-white/50"
                    >
                        {/* Chart Preview Side */}
                        <div className="flex-1 p-10 flex flex-col bg-slate-50/30">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                                        <BarChart3 className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI 數據視覺化協助</h3>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">智慧識別與數據洞察</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center min-h-0">
                                <div className="flex-1 w-full relative bg-white/50 border border-white rounded-[2.5rem] p-8 shadow-inner overflow-hidden mb-8">
                                    {isChartGenerating && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-[2.5rem] space-y-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
                                                <Sparkles className="w-12 h-12 text-emerald-500 animate-bounce relative z-10" />
                                            </div>
                                            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest animate-pulse">正在重新建模數據...</span>
                                        </div>
                                    )}
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }}
                                                dx={-10}
                                            />
                                            <ReTooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <motion.div
                                                                initial={{ scale: 0.9, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                className="bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-3xl shadow-2xl border border-white/10 max-w-[220px]"
                                                            >
                                                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                                                                    5T Protocol Node
                                                                </div>
                                                                <div className="text-2xl font-black mb-1">{payload[0].value} <span className="text-[10px] opacity-40 font-bold ml-1 uppercase">tCO2e</span></div>
                                                                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <span className="text-[8px] font-black opacity-30 uppercase tracking-widest">Hash</span>
                                                                        <span className="text-[9px] font-mono text-emerald-300 truncate font-bold">0x7f2...8a9</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <span className="text-[8px] font-black opacity-30 uppercase tracking-widest">Time</span>
                                                                        <span className="text-[9px] font-mono font-bold text-slate-300">09:36:46Z</span>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#10b981"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorChart)"
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-start gap-5 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 backdrop-blur-sm group hover:bg-emerald-50 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Sparkles className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">AI 數據趨勢洞察</div>
                                        <p className="text-[13px] font-bold text-emerald-800 leading-relaxed">
                                            數據顯示在 Q3 至 Q4 期間有顯著成長，這可能與您在「{title}」提及的綠能轉型政策相關。建議在報告中標註此一轉折點。
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Interaction Side */}
                        <div className="w-full md:w-[420px] bg-white border-l border-slate-100 p-10 flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">AI 互動儀表板</div>
                                <button
                                    onClick={() => setShowChartModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 active:scale-90"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">展示維度</label>
                                            <select className="w-full bg-slate-50 p-4 rounded-2xl text-[11px] font-black border border-slate-100 outline-none hover:border-emerald-500 transition-colors">
                                                <option value="area">趨勢面積圖</option>
                                                <option value="bar">對比長條圖</option>
                                                <option value="pie">佔比圓餅圖</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">品牌主色</label>
                                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                                <input type="color" defaultValue="#10b981" className="w-full h-[36px] bg-transparent rounded-xl cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">模擬情境增長率 (%)</label>
                                        <input type="range" min="0" max="100" defaultValue="20" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                        <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1 uppercase tracking-tighter">
                                            <span>Conserv / 0%</span>
                                            <span>Aggressive / 100%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-slate-500">修正指令 (Custom Prompt)</label>
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                        <textarea
                                            value={chartModifier}
                                            onChange={(e) => setChartModifier(e.target.value)}
                                            placeholder="例如：標註顯著成長點，並與行業平均水平進行對比..."
                                            className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-[13px] font-bold text-slate-800 focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none shadow-inner"
                                        />
                                    </div>

                                    <button
                                        onClick={handleModifyChart}
                                        disabled={isChartGenerating}
                                        className="group relative w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black text-xs shadow-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10 flex items-center justify-center gap-4 uppercase tracking-[0.2em]">
                                            {isChartGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                            {isChartGenerating ? "Processing..." : "更新 AI 視覺化"}
                                        </div>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">推薦動作 (AI Presets)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            "對比去年數據", "標註 ESG 目標", "優化配色方案", "生成預測模型"
                                        ].map((label, idx) => (
                                            <button
                                                key={idx}
                                                className="py-3.5 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all active:scale-95 text-center"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 mt-8 border-t border-slate-100">
                                <button className="group relative w-full h-16 bg-emerald-600 text-white rounded-[2rem] font-black text-base shadow-2xl shadow-emerald-600/30 overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative z-10">插入至報告段落</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
