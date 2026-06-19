'use client';

import React from 'react';
import { Sparkles, BarChart3, Target, Info } from 'lucide-react';
import { InsightPredictor } from '@/components/omni/insights/InsightPredictor';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';

/**
 * 🔭 Insight Think Tank Page (洞察智庫)
 * 展示 Epic 5 的成果：趨勢預測引擎。
 */
export default function InsightThinkTankPage() {
    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 bg-omni-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Sparkles size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-omni-text-main">洞察智庫 <span className="text-omni-primary">(Think Tank)</span></h1>
                            <p className="text-omni-text-sub mt-1">從鎖定的靜態數據中，煉製未來的趨勢洞察。</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* 預測引擎主區 */}
                <div className="lg:col-span-3 space-y-8">
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-black text-omni-text-main mb-6">
                            <BarChart3 size={20} className="text-omni-primary" /> 永續路徑情境模擬
                        </h3>
                        <InsightPredictor />
                    </section>
                </div>

                {/* 側邊導航與狀態 */}
                <div className="lg:col-span-1 space-y-6">
                    <LiquidGlassContainer className="p-6">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-omni-text-main mb-4">
                            <Target size={16} className="text-omni-primary" /> 關鍵洞察指標
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: '未來碳風險', value: 'Low', color: 'text-green-500' },
                                { label: '合規預警', value: 'Perfect', color: 'text-omni-primary' },
                                { label: '供應鏈韌性', value: 'High', color: 'text-blue-500' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-omni-glass-border/30 last:border-0">
                                    <span className="text-xs text-omni-text-sub">{item.label}</span>
                                    <span className={`text-xs font-black uppercase ${item.color}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </LiquidGlassContainer>

                    <div className="p-6 bg-omni-primary/5 border border-dashed border-omni-primary/30 rounded-2xl">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-omni-primary mb-2">
                            <Info size={16} /> 壽司博士的提純語
                        </h4>
                        <p className="text-xs text-omni-text-main leading-relaxed">
                            「數據是過去的殘影，洞察是未來的種子。透過驗算，我們能讓不確定性顯化為可控的資產。」
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
