"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { BarChart3, Users, Globe2, Activity } from "lucide-react";

export default function IntelligenceCenterPage() {
    const [uuid] = useState(uuidv4());

    return (
        <div className="min-h-screen bg-[#071520] text-white p-8 animate-in fade-in duration-700" data-omni-uuid={uuid}>
            <header className="max-w-7xl mx-auto mb-12 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Global Intelligence · 商情偵情中心
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400">
                    善向永續村 商情資料庫
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    整合全球 ESG 關鍵指標、法規動態、利害關係人聲量，為您的決策提供精確導航。
                </p>
                <div className="mt-4 text-[10px] text-gray-500 font-mono">
                    Session UUID: {uuid}
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <LiquidGlassContainer className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-emerald-400">
                        <Globe2 size={24} />
                        <h3 className="font-bold">全球法規預警</h3>
                    </div>
                    <div className="text-3xl font-black mb-2">12</div>
                    <p className="text-xs text-gray-400">本季度新增法規變更</p>
                </LiquidGlassContainer>

                <LiquidGlassContainer className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-blue-400">
                        <BarChart3 size={24} />
                        <h3 className="font-bold">產業標準指數</h3>
                    </div>
                    <div className="text-3xl font-black mb-2">87.5</div>
                    <p className="text-xs text-gray-400">符合 GRI/SASB 標準</p>
                </LiquidGlassContainer>

                <LiquidGlassContainer className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                        <Users size={24} />
                        <h3 className="font-bold">社會聲量情感</h3>
                    </div>
                    <div className="text-3xl font-black mb-2">+42%</div>
                    <p className="text-xs text-gray-400">品牌正面討論度成長</p>
                </LiquidGlassContainer>

                <LiquidGlassContainer className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-rose-400">
                        <Activity size={24} />
                        <h3 className="font-bold">氣候風險影響</h3>
                    </div>
                    <div className="text-3xl font-black mb-2">High</div>
                    <p className="text-xs text-gray-400">極端氣候風險評級</p>
                </LiquidGlassContainer>
            </main>

            <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                <LiquidGlassContainer className="p-8 flex flex-col h-full">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Globe2 className="text-blue-400" />
                        商情內容擷取與清洗
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                        輸入任意永續相關文章網址，系統將自動過濾廣告與無關資訊，提取純淨內容並可全開閱讀或收藏至「善向圖書室」。
                    </p>

                    <div className="flex gap-4 mb-6">
                        <input
                            type="url"
                            placeholder="https://example.com/esg-news..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                        <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                            萃取
                        </button>
                    </div>

                    <div className="flex-1 border border-dashed border-gray-600 p-8 rounded-xl bg-gray-900/50 flex items-center justify-center flex-col text-gray-500">
                        <Activity className="animate-pulse mb-4 opacity-50" size={32} />
                        等待輸入網址進行清洗與萃取...
                    </div>
                </LiquidGlassContainer>

                <LiquidGlassContainer className="p-8 flex items-center justify-center flex-col min-h-[400px]">
                    <h2 className="text-2xl font-bold mb-4">即時威脅矩陣圖</h2>
                    <p className="text-gray-400 mb-8 border border-dashed border-gray-600 p-8 rounded-xl bg-gray-900/50">
                        (視覺化資料分析模組載入中...)
                    </p>
                </LiquidGlassContainer>
            </div>

            {/* Global Background Glows */}
            <div className={`fixed -top-40 -left-40 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-[0]`} />
            <div className={`fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-[0]`} />
        </div>
    );
}
