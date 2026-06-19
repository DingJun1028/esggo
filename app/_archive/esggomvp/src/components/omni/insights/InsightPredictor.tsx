'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Zap, Info, ChevronRight } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

/**
 * 🔭 InsightPredictor (永續趨勢預測引擎)
 * 基於現有 5T 資產進行情境模擬。
 * 支援「激進」、「穩健」、「保守」三種路徑的 ROI 與碳排預測。
 */
export const InsightPredictor: React.FC = () => {
    const [scenario, setScenario] = useState<'aggressive' | 'steady' | 'conservative'>('steady');

    const scenarioData = {
        aggressive: { carbon: '-45%', roi: '+12.5%', cost: 'High', color: 'text-omni-primary' },
        steady: { carbon: '-25%', roi: '+8.2%', cost: 'Medium', color: 'text-blue-500' },
        conservative: { carbon: '-10%', roi: '+4.5%', cost: 'Low', color: 'text-amber-500' },
    };

    const data = scenarioData[scenario];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
                {(['aggressive', 'steady', 'conservative'] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setScenario(s)}
                        className={`
              px-6 py-2 rounded-xl font-bold transition-all border
              ${scenario === s
                                ? 'bg-omni-primary text-white border-omni-primary shadow-lg shadow-omni-primary/20 scale-105'
                                : 'bg-white/5 text-omni-text-muted border-omni-glass-border hover:border-omni-primary/50'}
            `}
                    >
                        {s === 'aggressive' ? '🚀 激進轉型' : s === 'steady' ? '⚖️ 穩健發展' : '🛡️ 保守過渡'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LiquidGlassContainer className="p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                            <TrendingDown size={20} />
                        </div>
                        <span className="text-[10px] font-mono text-omni-text-muted">EXPECTED_CARBON</span>
                    </div>
                    <h4 className="text-xs font-bold text-omni-text-muted uppercase tracking-widest">碳排減量目標</h4>
                    <div className={`text-4xl font-black mt-2 ${data.color}`}>{data.carbon}</div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] text-green-500 font-bold">
                        <Zap size={12} /> 比基準點優化
                    </div>
                </LiquidGlassContainer>

                <LiquidGlassContainer className="p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-mono text-omni-text-muted">ESTIMATED_ROI</span>
                    </div>
                    <h4 className="text-xs font-bold text-omni-text-muted uppercase tracking-widest">永續投資回報 (ROI)</h4>
                    <div className="text-4xl font-black mt-2 text-omni-text-main">{data.roi}</div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] text-omni-primary font-bold">
                        <Target size={12} /> 達成機率 78%
                    </div>
                </LiquidGlassContainer>

                <LiquidGlassContainer className="p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Info size={20} />
                        </div>
                        <span className="text-[10px] font-mono text-omni-text-muted">RESOURCES_CAP</span>
                    </div>
                    <h4 className="text-xs font-bold text-omni-text-muted uppercase tracking-widest">預估執行難度</h4>
                    <div className="text-4xl font-black mt-2 text-omni-text-main">{data.cost}</div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] text-omni-text-sub font-bold">
                        <ChevronRight size={12} /> 點擊查看資源清單
                    </div>
                </LiquidGlassContainer>
            </div>

            <LiquidGlassContainer className="p-8 border-dashed border-omni-primary/30">
                <h4 className="text-lg font-black text-omni-text-main mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-omni-primary" /> AI 決策建議 (Omni-Insight)
                </h4>
                <p className="text-sm text-omni-text-sub leading-relaxed italic">
                    「根據現有 {scenario} 路徑分析，建議優先完成 Scope 2 的能效轉換。您的 5T 資產已封印，數據可信度極高。執行此方案預計可在 2027 年達成碳中和平衡點。」
                </p>
            </LiquidGlassContainer>
        </div>
    );
};
