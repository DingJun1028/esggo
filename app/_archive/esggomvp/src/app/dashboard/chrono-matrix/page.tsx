"use client";

import React, { useState, useEffect } from "react";
import {
    CalendarDays,
    Clock,
    CheckCircle2,
    AlertCircle,
    BellRing,
    ArrowRight,
    TrendingUp,
    Activity,
    Droplets // 代表水位的流動
} from "lucide-react";

/**
 * Chrono-Matrix & Omni-Progress Sphere
 * 核心視角：將枯燥的行事曆轉化為「萬能時空曆」，並以漂浮的「水位球」即時顯示全域進度。
 */
export default function ChronoMatrixPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // 模擬 2026 年 3 月
    const [progress, setProgress] = useState(0);

    // 模擬水位上升動畫
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(82); // 目標水位 82%
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // 模擬重大的關鍵節點 (Deadlines)
    const deadLines = [
        { date: "2026-03-10", title: "Scope 1&2 盤查數據截止", dept: "E-Zone", status: "completed" },
        { date: "2026-03-15", title: "KPMG 期中確信審查", dept: "All", status: "pending", urgent: true },
        { date: "2026-03-25", title: "水資源管理問卷填報", dept: "E-Zone", status: "pending" },
        { date: "2026-03-31", title: "Q1 社會責任指標彙整", dept: "S-Zone", status: "pending" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans relative overflow-hidden">

            {/* 頂部：全景進度水位球 (Omni-Progress Sphere) */}
            <div className="absolute top-0 right-0 p-8 pointer-events-none z-10 w-full flex justify-end">
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/40 flex items-center gap-6 pointer-events-auto transform hover:scale-105 transition-transform cursor-pointer group">

                    <div className="relative w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-inner">
                        {/* 水位動畫區塊 */}
                        <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-[#63a6b0] to-[#88c2cb] transition-all duration-1000 ease-out flex items-center justify-center overflow-hidden"
                            style={{ height: `${progress}%` }}
            >
                        {/* 模擬水波紋 (CSS 動畫可以在 global.css 實現，這裡用透明度疊加) */}
                        <div className="absolute w-[200%] h-[200%] -top-[100%] -left-[50%] bg-[#ffffff20] rounded-[40%] animate-spin-slow"></div>
                        <div className="absolute w-[200%] h-[200%] -top-[120%] -left-[50%] bg-[#ffffff10] rounded-[45%] animate-spin-slow-reverse"></div>
                    </div>
                    {/* 百分比數字疊加在最上層 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-bold text-slate-800 drop-shadow-md z-10 mix-blend-plus-lighter">
                        <span className="text-2xl">{progress}%</span>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-[#63a6b0]" />
                        全域報告進度 (Omni-Progress)
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        較上週提升 14%
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="text-xs font-medium bg-[#63a6b0]/10 text-[#63a6b0] px-3 py-1.5 rounded-lg text-center">E-Zone: 92%</div>
                        <div className="text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-center">S-Zone: 68%</div>
                    </div>
                </div>
            </div>
        </div>

      {/* 主體：萬能時空曆 (The Chrono-Matrix) */ }
    <div className="max-w-7xl mx-auto pt-20">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <CalendarDays className="w-8 h-8 text-[#63a6b0]" />
                萬能時空曆
            </h1>
            <p className="text-slate-500 mt-2 text-lg">The Chrono-Matrix & Sentient Chase Net</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* 左側：日曆網格 (模擬) */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-800">2026年 3月</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">今日</button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            新增時空節點
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* 簡化版日曆網格顯示 */}
                    <div className="grid grid-cols-7 gap-4 text-center mb-4">
                        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                            <div key={day} className="text-sm font-semibold text-slate-400">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-4">
                        {/* 產生 31 天的格子 */}
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                            // 檢查是否有 deadline 在這一天
                            const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
                  const hasDeadline = deadLines.find(d => d.date === dateStr);

                        return (
                        <div
                            key={day}
                            className={`
                        aspect-square rounded-2xl p-2 border relative transition-all cursor-pointer hover:shadow-md
                        ${hasDeadline
                            ? (hasDeadline.urgent ? 'border-rose-200 bg-rose-50/30 hover:border-rose-400' : 'border-[#63a6b0]/30 bg-[#63a6b0]/5 hover:border-[#63a6b0]')
                            : 'border-slate-100 bg-white hover:border-slate-300'}
                      `}
                    >
                        <span className={`text-sm font-medium ${hasDeadline ? 'text-slate-900' : 'text-slate-500'}`}>{day}</span>

                    {/* 如果有事件，顯示氣泡指示器 */}
                    {hasDeadline && (
                        <div className="absolute inset-x-2 bottom-2">
                            <div className={`w-full h-1.5 rounded-full ${hasDeadline.status === 'completed' ? 'bg-[#63a6b0]' : (hasDeadline.urgent ? 'bg-rose-500 animate-pulse' : 'bg-amber-400')}`}></div>
                        </div>
                      )}
            </div>
            );
                })}
        </div>
    </div>
          </div >

        {/* 右側：感知催辦網 (Sentient Chase Net) */ }
        < div className = "space-y-6" >
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                {/* 飾邊光暈 */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#63a6b0] blur-3xl opacity-20 rounded-full pointer-events-none"></div>

                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#63a6b0]" />
                    感知催辦中心
                </h3>

                <div className="space-y-4 relative z-10">
                    {/* 催辦任務卡片 */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-500/20 text-rose-300">緊急 (High Priority)</span>
                            <span className="text-xs text-slate-400">3天後到期</span>
                        </div>
                        <h4 className="font-semibold text-slate-100 mb-1">KPMG 期中確信審查</h4>
                        <p className="text-sm text-slate-400 mb-4">缺少 7 筆高雄廠的用水與廢棄物單據。</p>

                        <button className="w-full py-2 bg-[#63a6b0] hover:bg-[#528f98] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                            <BellRing className="w-4 h-4" />
                            一鍵發送智能催辦
                        </button>
                    </div>

                    {/* 狀態列 */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="text-sm text-slate-300 font-medium mb-3">AI 守護者狀態</div>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-slate-400">
                                <CheckCircle2 className="w-4 h-4 text-[#63a6b0]" />
                                已攔截 12 筆異常填寫數值
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-400">
                                <CheckCircle2 className="w-4 h-4 text-[#63a6b0]" />
                                自動寄出 4 封逾期提醒通知信
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

    {/* 近期事件列表 */ }
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-4">即將到來的時空節點</h3>
               <div className="space-y-4">
                 {deadLines.filter(d => d.status === 'pending').map((d, i) => (
                   <div key={i} className="flex gap-4 group cursor-pointer">
                     <div className="flex flex-col items-center">
                       <div className={`w-3 h-3 rounded-full mt-1.5 ${d.urgent ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-amber-400'}`}></div>
                       <div className="w-0.5 h-full bg-slate-100 mt-2 group-last:hidden"></div>
                     </div>
                     <div className="pb-4">
                       <div className="text-sm font-semibold text-slate-900">{d.title}</div>
                       <div className="text-xs text-slate-500 mt-0.5">{d.date} · {d.dept}</div>
                     </div>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-2 py-2 text-sm font-medium text-[#63a6b0] bg-[#63a6b0]/10 hover:bg-[#63a6b0]/20 rounded-xl transition-colors flex items-center justify-center gap-1">
                 檢視完整清單 <ArrowRight className="w-4 h-4" />
               </button>
            </div >
          </div >
        </div >

      </div >
    </div >
  );
}
