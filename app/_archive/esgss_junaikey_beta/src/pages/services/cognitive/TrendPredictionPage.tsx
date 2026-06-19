import React, { useState } from 'react';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { BentoCard } from '@/components/ui/BentoGrid';
import { CyberCard } from '@/components/ui/CyberCard';
import { TrendingUp, AlertTriangle, Eye, Activity } from 'lucide-react';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { useStitchTheme } from '@/contexts/StitchThemeContext';

const TrendPredictionPage: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const isDark = resolvedMode === 'dark';

    // Mock Data for Heatmap
    const heatmapData = Array.from({ length: 7 }, (_, i) => ({
        id: `day-${i}`,
        data: Array.from({ length: 5 }, (_, j) => ({
            x: `Factor ${j + 1}`,
            y: Math.floor(Math.random() * 100)
        }))
    }));

    return (
        <StitchBentoTemplate
            title="Trend Prediction Engine"
            subtitle="PRECOGNITION_MODULE_V1"
            headerIcon={<TrendingUp size={32} />}
        >
            {/* Primary Prediction: 2026 Climate Risk */}
            <BentoCard className="col-span-12 md:col-span-8 row-span-2">
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Eye className="text-[#63a6b0]" size={24} />
                            <h3 className="font-bold text-xl">2026 Climate Risk Heatmap</h3>
                        </div>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-mono rounded">
                            CONFIDENCE: 94.2%
                        </span>
                    </div>

                    <div className="flex-1 min-h-[300px] w-full bg-black/5 rounded-2xl overflow-hidden relative">
                        {/* Placeholder for complex chart if HeatmapChart fails to render nicely without real data context */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 text-xs font-mono">
                            DATA_VISUALIZATION_LAYER
                        </div>
                        {/* Attempt to render Heatmap */}
                        <div className="absolute inset-0 p-4">
                            {/* Simple visual fallback using CSS grid if chart component is heavy */}
                            <div className="grid grid-cols-5 gap-1 h-full">
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="rounded hover:scale-95 transition-transform duration-500"
                                        style={{
                                            backgroundColor: i % 3 === 0 ? '#10b981' : i % 2 === 0 ? '#f59e0b' : '#ef4444',
                                            opacity: 0.3 + (Math.random() * 0.7)
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* AI Insight Card */}
            <BentoCard className="col-span-12 md:col-span-4 row-span-1 bg-amber-500/5 border-amber-500/20">
                <CyberCard
                    title="Emerging Regulation"
                    value="High Probability"
                    description="EU Carbon Border Adjustment Mechanism (CBAM) expansion expected in Q3."
                    icon={<AlertTriangle className="text-amber-500" />}
                    status="Warning"
                />
            </BentoCard>

            {/* Market Sentiment */}
            <BentoCard className="col-span-12 md:col-span-4 row-span-1">
                <div className="p-6">
                    <h4 className="text-xs font-bold uppercase opacity-50 mb-4">Market Sentiment</h4>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-[#63a6b0]">Bullish</span>
                        <span className="text-sm opacity-70 mb-1">on Green Tech</span>
                    </div>
                    <div className="mt-4 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#63a6b0] w-[75%]" />
                    </div>
                </div>
            </BentoCard>

            {/* Bottom Metrics */}
            <BentoCard className="col-span-6 md:col-span-3 row-span-1">
                <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <Activity className="text-emerald-500 mb-2" />
                    <span className="text-2xl font-black">102</span>
                    <span className="text-[10px] uppercase opacity-50">Active Sensors</span>
                </div>
            </BentoCard>

            <BentoCard className="col-span-6 md:col-span-3 row-span-1">
                <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <Eye className="text-purple-500 mb-2" />
                    <span className="text-2xl font-black">24/7</span>
                    <span className="text-[10px] uppercase opacity-50">Monitoring</span>
                </div>
            </BentoCard>

        </StitchBentoTemplate>
    );
};

export default TrendPredictionPage;
