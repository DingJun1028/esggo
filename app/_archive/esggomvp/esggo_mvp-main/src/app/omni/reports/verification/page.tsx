'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Scale, Info, Lock, Play } from 'lucide-react';
import { StandardCalculator } from '@/components/omni/verification/StandardCalculator';
import { TrustBadgeGroup, Trust5TStatus } from '@/components/omni/verification/TrustBadgeGroup';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { sealReport } from '@/core/ncb/report-actions';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';

const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
    { id: '1', title: '原始數據', description: '企業往往面臨數據失真或漂綠質疑，缺乏一個具備公信力的驗算基準。', color: 'danger' },
    { id: '2', title: '零幻覺驗算', description: '所有轉換公式皆經由 Dr. Thoth 零幻覺驗算，確保運算邏輯清晰無誤且可追溯。', color: 'primary' },
    { id: '3', title: '5T 查核心法', description: '數據每經過一項查驗便會點亮一枚 5T 信任徽章 (Traceable, Transparent 等)。', color: 'accent' },
    { id: '4', title: '琥珀封存', description: '驗證無誤的數據最終會透過區塊鏈級 Hash Lock 封裝，成為永恆真理的黃金標準。', color: 'success' }
];

/**
 * 👑 Verification Sanctum Page (驗算聖殿首頁)
 * 展示 Epic 3 的成果：零幻覺驗算、5T 信任徽章與 Hash Lock 封印。
 */
export default function VerificationSanctumPage() {
    const [isSealing, setIsSealing] = useState(false);
    const [sealHash, setSealHash] = useState<string | null>(null);

    // 模擬已載入的資產數據
    const mockAsset = {
        uuid: 'atom-vct-777888',
        name: '2050 淨零路徑情境分析 A',
        domain: 'Sanctum',
        status: sealHash ? 'Published' : 'Draft',
        scenarios: [
            { id: 'S1', label: '激進減碳', roi: '12.5%', carbon: '20,000' },
            { id: 'S2', label: '穩健投資', roi: '8.2%', carbon: '35,000' }
        ]
    };

    const handleSeal = async () => {
        setIsSealing(true);
        const result = await sealReport(mockAsset.uuid);
        if (result.success) {
            setSealHash(result.hash!);
        }
        setIsSealing(false);
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 bg-omni-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-[#1D1D1F]">驗算聖殿 <span className="text-omni-primary">(Verification Sanctum)</span></h1>
                            <p className="text-omni-text-sub mt-2">數據的真理在此被鎖定。零幻覺驗算與 5T 封印對焦。</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSeal}
                    disabled={isSealing || !!sealHash}
                    className={`
            px-8 py-4 rounded-[20px] font-black flex items-center gap-2 transition-all
            ${sealHash
                            ? 'bg-green-500 text-white cursor-default shadow-lg shadow-green-500/20'
                            : 'bg-omni-primary text-white hover:scale-105 active:scale-95 shadow-xl shadow-omni-primary/30'}
          `}
                >
                    {isSealing ? '密封中...' : sealHash ? <><Lock size={18} /> 資產已封印</> : <><Play size={18} /> 執行 Hash Lock 封印</>}
                </button>
            </header>

            <div className="mb-6">
                <OmniComicStrip panels={comicPanels} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左側：資產狀態、5T 徽章與時空印記 */}
                <div className="lg:col-span-1 space-y-6">
                    <LiquidGlassContainer className="p-6 space-y-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xs font-black text-omni-primary uppercase tracking-widest mb-4">5T 誠信維度 (5T Integrity)</h3>
                            <TrustBadgeGroup
                                status={{
                                    tangible: true,
                                    traceable: true,
                                    trackable: true,
                                    transparent: true,
                                    trustworthy: !!sealHash
                                }}
                            />
                        </div>

                        {/* 琥珀封存背景裝飾 */}
                        {sealHash && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.05 }}
                                className="absolute inset-0 bg-omni-accent pointer-events-none"
                            />
                        )}
                    </LiquidGlassContainer>

                    <LiquidGlassContainer className="p-6 bg-omni-surface-2 border-none">
                        <h3 className="text-xs font-black text-omni-text-muted uppercase tracking-widest mb-4">4D 時空特徵 (4D Spacetime Anchor)</h3>
                        <div className="space-y-3 font-mono text-[10px]">
                            <div className="flex justify-between">
                                <span className="text-omni-text-sub">LAT/LNG_XYZ</span>
                                <span className="text-omni-primary">25.03/121.56/42</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-omni-text-sub">HYPER_PHASE_W</span>
                                <span className="text-omni-primary">1.00042777</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-omni-glass-border">
                                <span className="text-omni-text-sub">VERIFICATION</span>
                                <span className="text-green-500 font-bold">MATCHED</span>
                            </div>
                        </div>
                    </LiquidGlassContainer>

                    <div className="p-6 bg-omni-primary/5 border border-dashed border-omni-primary/30 rounded-2xl">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-omni-primary mb-2 uppercase tracking-tighter">
                            <Info size={16} /> Dr. Thoth: Amber Freeze Protocol
                        </h4>
                        <p className="text-[11px] text-omni-text-main leading-relaxed italic opacity-80">
                            「當數據被琥珀封存，它便不再是流動的資訊，而是永恆的結晶。4D 座標確保了這顆結晶在時空矩陣中的唯一位置。」
                        </p>
                    </div>
                </div>

                {/* 右側：驗算路徑展示 */}
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-black text-omni-text-main mb-6 uppercase tracking-tight">
                            <Scale size={20} className="text-omni-primary" /> 零幻覺驗算分析廊 (Zero-Hallucination Lab)
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <StandardCalculator
                                title="2050 碳排預估 (激進情境)"
                                formula="E = (B * Growth) * (1 - Efficiency)"
                                steps={[
                                    { label: '基準碳排 (Baseline)', value: '1,000,000', unit: 'tCO2e', description: '2025 實測數據' },
                                    { label: '產業成長系數 (Growth)', value: '1.05', unit: 'rate', description: '基於市場趨勢預測' },
                                    { label: '能效提升率 (Efficiency)', value: '0.98', unit: 'rate', description: '導入 AI 節能後的預估值' }
                                ]}
                                result={{ value: '1,029,000', unit: 'tCO2e' }}
                            />

                            <StandardCalculator
                                title="永續投資回報率 (ROI) 演化"
                                formula="ROI = (Net Impact / Investment) * 100"
                                steps={[
                                    { label: '淨影響力價值 (Net Impact)', value: '25,000,000', unit: 'TWD', description: '包含社會價值轉化' },
                                    { label: '總投資額 (Investment)', value: '200,000,000', unit: 'TWD', description: '包含軟硬體購置' }
                                ]}
                                result={{ value: '12.5', unit: '%' }}
                            />
                        </div>

                        {sealHash && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-8 p-6 rounded-3xl bg-green-500/10 border border-green-500/30 flex items-center justify-between"
                            >
                                <div>
                                    <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Blockchain Hash Lock Secured</div>
                                    <code className="text-xs font-mono text-green-700 break-all">{sealHash}</code>
                                </div>
                                <ShieldCheck size={40} className="text-green-500 opacity-50" />
                            </motion.div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
