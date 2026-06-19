'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { OmniGlassCard } from '@/components/omni/liquid-glass/OmniGlassCard';
import { OmniBadge } from '@/components/omni/UI/OmniBadge';
import { OmniInputGroup } from '@/components/omni/UI/OmniInputGroup';
import { OmniTable } from '@/components/omni/liquid-glass/OmniTable';
import { OmniFunnel, OmniFunnelStep } from '@/components/omni/Visualizations/FunnelChart';
import { Shield, Activity, Lock, Database, Zap, BookOpen, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🗺️ Omni-Library Showcase Page
 * 展示標準萬能元件庫的所有元件與狀態。
 */
export default function OmniLibraryShowcase() {
    const [inputValue, setInputValue] = useState('');
    const [areaValue, setAreaValue] = useState('');

    return (
        <div className="min-h-screen bg-omni-surface p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
                <PageHeader
                    title="Omni-Element UI/UX Library"
                    subtitle="標準版萬能元件庫預覽。所有元件皆遵循 5T 協議並整合 UUID 溯源機制。"
                    category="DEVELOPER CORE"
                />

                {/* Section: Badges */}
                <section className="space-y-6">
                    <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                        <Zap size={16} className="text-omni-primary" />
                        Standard Badges (5T Micro-feedback)
                    </h2>
                    <div className="flex flex-wrap gap-4 p-8 bg-omni-glass-bg border border-omni-glass-border rounded-[2.5rem]">
                        <OmniBadge label="Traceable" type="primary" icon={<Activity size={10} />} pulse />
                        <OmniBadge label="Trustworthy" type="accent" icon={<Lock size={10} />} />
                        <OmniBadge label="Sealed" type="success" icon={<Shield size={10} />} />
                        <OmniBadge label="Corrupted" type="danger" icon={<Zap size={10} />} />
                        <OmniBadge label="Draft" type="muted" />
                    </div>
                </section>

                {/* Section: Cards */}
                <section className="space-y-6">
                    <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                        <Database size={16} className="text-omni-primary" />
                        Asset Containers (Liquid Glass)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <OmniGlassCard
                            uuid="ucc-card-draft-001"
                            title="草稿態：碳排放數據"
                            subtitle="SCOPE 1 EMISSION DATA"
                            stability={45}
                        >
                            <p className="text-sm text-omni-text-main leading-relaxed">
                                這是一張處於草稿狀態的元件卡片。左側邊緣顯示為藍色，穩定度較低。
                            </p>
                        </OmniGlassCard>

                        <OmniGlassCard
                            uuid="ucc-card-sealed-999"
                            title="封存態：永續績效證明"
                            subtitle="ESG PERFORMANCE CERTIFICATE"
                            stability={100}
                            isSealed={true}
                        >
                            <div className="space-y-2">
                                <p className="text-sm text-omni-text-main leading-relaxed">
                                    這是一張已封存的元件卡片。具備「永恆金」狀態環與 SHA-256 視覺符號。
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <OmniBadge label="Audit Passed" type="success" pulse />
                                    <OmniBadge label="Immutable" type="accent" />
                                </div>
                            </div>
                        </OmniGlassCard>
                    </div>
                </section>

                {/* Section: Inputs */}
                <section className="space-y-6">
                    <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                        <BookOpen size={16} className="text-omni-primary" />
                        Adaptive Inputs (Service via Learning)
                    </h2>
                    <div className="grid grid-cols-1 gap-8 p-10 bg-omni-glass-bg border border-omni-glass-border rounded-[2.5rem]">
                        <OmniInputGroup
                            id="test-input"
                            label="資產名稱"
                            placeholder="請輸入資產名稱..."
                            value={inputValue}
                            onChange={setInputValue}
                            guidance="資產名稱應簡潔有力，代表該 5T 資料原子的核心業務價值。"
                            knowedgePoint="UUID 將自動根據名稱與時間戳生成的種子來顯化。"
                        />

                        <OmniInputGroup
                            id="test-area"
                            label="方法學描述"
                            type="textarea"
                            placeholder="請詳細描述數據計算邏輯..."
                            value={areaValue}
                            onChange={setAreaValue}
                            guidance="詳盡的方法學描述能顯著提升 Traceable 指標的分數。請包含資料來源、計算公式與任何假設條件。"
                            knowedgePoint="[5T:Transparent] 算法的透明性是誠信閉環的基礎。"
                        />
                    </div>
                </section>

                {/* Section: Table (4D Data Layer) */}
                <section className="space-y-6">
                    <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                        <Database size={16} className="text-omni-primary" />
                        Hyper-Data Layer (OmniTable 4D)
                    </h2>
                    <OmniTable
                        title="萬能資產智庫"
                        subtitle="INTELLIGENT ATOM REPOSITORY"
                        data={[
                            { uuid: 'atom-001', timestamp: Date.now(), is_frozen: false, data: { name: 'Q1 碳排放統計', value: '1,240 tCO2e', location: '台北總部' } } as any,
                            { uuid: 'atom-002', timestamp: Date.now() - 100000, is_frozen: true, data: { name: '綠能採購證明', value: '500 MWh', location: '台中廠區' } } as any,
                        ]}
                        columns={[
                            { key: 'name', header: '資產名稱' },
                            { key: 'value', header: '量化指標' },
                            { key: 'location', header: '溯源節點' }
                        ]}
                        onSeal={(uuid: string) => alert(`🧊 執行琥珀封存：${uuid}`)}
                    />
                </section>

                {/* Section: Funnel (5T Transformation) */}
                <section className="space-y-6">
                    <h2 className="text-sm font-black text-omni-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                        <Wind size={16} className="text-omni-primary" />
                        Resonance Path (OmniFunnel 5T)
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <OmniFunnel
                            totalStability={78}
                            steps={[
                                { id: 't1', label: 'Tangible', value: 95, indicator: 'Tangible' },
                                { id: 't2', label: 'Traceable', value: 82, indicator: 'Traceable' },
                                { id: 't3', label: 'Trackable', value: 70, indicator: 'Trackable' },
                                { id: 't4', label: 'Transparent', value: 65, indicator: 'Transparent' },
                                { id: 't5', label: 'Trustworthy', value: 50, indicator: 'Trustworthy' },
                            ]}
                        />
                        <div className="space-y-4 p-8">
                            <h4 className="text-xs font-black text-omni-primary uppercase tracking-widest">5T_Vortex_Logic</h4>
                            <p className="text-sm text-omni-text-main leading-relaxed">
                                數據從初次感知的 **Tangible** 階段流入，每一層過濾都將資料提純，
                                最終只有通過 **Trustworthy** 維度驗證的原子才能顯化為「永恆封存資產」。
                            </p>
                            <div className="flex gap-2">
                                <OmniBadge label="Filter: Harmony" type="primary" />
                                <OmniBadge label="Seal: Amber" type="accent" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
