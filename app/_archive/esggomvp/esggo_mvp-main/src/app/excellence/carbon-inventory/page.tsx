'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    Cloud,
    Leaf,
    TrendingDown,
    ShieldCheck,
    Database,
    Wind,
    Binary,
    Zap,
    Layers,
    Cpu,
    Activity,
    Target,
    ChevronRight,
    Search,
    ArrowDownRight
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import FunnelChart from '@/components/charts/FunnelChart';
import ServiceJourney from '@/components/ServiceJourney';
import { OmniBase } from '@/core/OmniBase';

/**
 * 🌿 Excellence 2.2: Carbon Inventory Management (v2 — 5T Sealing Edition)
 * 
 * 功能亮點：
 * - 5T 合規審計漏斗：展示從原始排放到淨零的轉化路徑。
 * - 實時數據溯源：整合 OmniBase 深度掃描與 Hash Lock 驗證。
 * - 上善若水設計：液態玻璃容器與動態 Sentient Aura。
 */
export default function CarbonInventoryPage() {
    const { t, locale } = useLanguage();
    const [totalEmissions, setTotalEmissions] = useState(0);
    const [offsetValue, setOffsetValue] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [auditLog, setAuditLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCarbonData = async () => {
            setIsLoading(true);
            try {
                // 🔬 Simulate 5T Deep Scan for Carbon Atoms
                const mockAtom = {
                    uuid: 'CARBON-ATOM-Q1-2026',
                    type: 'Intelligence',
                    payload: { total: 4500, offsets: 1200 },
                    evidence: { transparent: true, traceable: true, trackable: true, tangible: true }
                } as any;

                const scanResult = await OmniBase.scanDeep(mockAtom);
                setTotalEmissions(scanResult.health * 50); // Normalized scale
                setOffsetValue(1200);
                setAuditLog(scanResult.auditLog);
                setIsVerified(scanResult.resilience > 80);
            } catch (error) {
                console.error('Carbon scan failed:', error);
                // 🔬 Simulate Excellence Domain Scan
                const mockAtom = {
                    uuid: 'EXCELLENCE-ATOM-CARBON-001',
                    type: 'Excellence',
                    payload: { total: 1250, offsets: 400 },
                    evidence: { transparent: true, traceable: true, trackable: true, tangible: true }
                } as any;

                const scanResult = await OmniBase.scanDeep(mockAtom);
                setTotalEmissions(1250);
                setOffsetValue(400);
                setAuditLog(scanResult.auditLog);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCarbonData();
    }, []);

    const carbonFunnelData = [
        { value: 5800, name: t.charts.carbon.total, fill: '#63a6b0' },
        { value: 4200, name: t.charts.carbon.renewable, fill: '#4ade80' },
        { value: 2100, name: t.charts.carbon.efficiency, fill: '#facc15' },
        { value: 850, name: t.charts.carbon.credits, fill: '#3b82f6' },
        { value: 250, name: t.charts.carbon.net, fill: '#ffd700' },
    ];

    const carbonVitals = [
        { label: t.vitals.environmental, val: 82, icon: <Zap size={16} />, color: 'text-aqua', bg: 'bg-aqua/10' },
        { label: t.vitals.renewable, val: 45, icon: <Cpu size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: t.vitals.reduction_rate, val: 12, icon: <Activity size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: t.vitals.coverage, val: 100, icon: <ShieldCheck size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ];

    const funnelData = [ // New funnelData definition
        { value: 100, name: t.charts.initial_state, fill: '#63a6b0' },
        { value: 80, name: t.charts.data_ingestion, fill: '#4ade80' },
        { value: 60, name: t.charts.validation, fill: '#facc15' },
        { value: 40, name: t.charts.audit, fill: '#3b82f6' },
        { value: 20, name: t.charts.final_seal, fill: '#ffd700' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={t.pages.carbon_inventory.title}
                subtitle={t.pages.carbon_inventory.subtitle}
                category={t.nav.excellence}
            />

            <ServiceJourney currentStepId="transparent" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* 💓 Core Excellence Control */}
                <div className="xl:col-span-1 p-8 rounded-[3rem] bg-[var(--theme-card-bg)] border border-[var(--theme-glass-border)] liquid-glass relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] shadow-2xl">
                    <div className="absolute top-0 left-0 p-8 opacity-[0.03]">
                        <Layers size={250} className="text-aqua" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                        <motion.div
                            animate={{ rotate: [0, 90, 180, 270, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="size-52 rounded-full border border-aqua/20 flex items-center justify-center relative bg-[var(--theme-surface)]/40 backdrop-blur-3xl"
                        >
                            <div className="absolute inset-2 rounded-full border border-aqua/40 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-aqua mb-2">{t.vitals.integrity}</p>
                                    <h2 className="text-5xl font-black text-[var(--theme-text-main)] italic tracking-tighter">
                                        {isLoading ? '...' : 92}
                                        <span className="text-sm font-normal not-italic opacity-50 ml-1">%</span>
                                    </h2>
                                    <p className="text-[8px] font-bold text-[var(--theme-text-muted)] mt-2 uppercase tracking-widest">Excellence Core v12.0</p>
                                </div>
                            </div>

                            {/* Scanning Line */}
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aqua/50 to-transparent z-20"
                            />
                        </motion.div>

                        <div className="mt-12 w-full space-y-4">
                            <div className="p-5 rounded-2xl bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] flex items-center justify-between group hover:bg-aqua/5 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-aqua/20 text-aqua">
                                        <Target size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-main)]">{t.vitals.resilience}</span>
                                        <span className="text-[8px] font-bold text-[var(--theme-text-muted)]">Stable Analysis Mode</span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-aqua" />
                            </div>
                            <div className="p-5 rounded-2xl bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] flex items-center justify-between group hover:bg-[#ffd700]/5 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-[#ffd700]/20 text-[#ffd700]">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-main)]">{t.vitals.lock}</span>
                                        <span className="text-[8px] font-bold text-[var(--theme-text-muted)]">5T Compliant Storage</span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-[#ffd700]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📊 High-Performance Charts */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {carbonVitals.map((v, i) => (
                            <motion.div key={v.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-[2rem] bg-[var(--theme-card-bg)] border border-[var(--theme-glass-border)] relative overflow-hidden group hover:border-aqua/30 transition-all flex flex-col justify-between shadow-md"
                            >
                                <div className={`size-8 rounded-xl ${v.bg} ${v.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
                                    {v.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-[var(--theme-text-main)] italic mb-1">
                                        {v.val}<span className="text-sm opacity-50">%</span>
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-sub)]">{v.label}</p>
                                </div>
                                <div className="mt-3 h-1 w-full rounded-full bg-[var(--theme-surface-2)] overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${v.val}%` }}
                                        transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                                        className={`h-full rounded-full ${v.color.replace('text-', 'bg-')}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                        <div className="flex-1 bg-[var(--theme-card-bg)] border border-[var(--theme-glass-border)] rounded-[3rem] p-4 shadow-lg overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[var(--theme-glass-border)] flex justify-between items-center">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--theme-text-main)]">{t.charts.funnel_title}</h4>
                                <p className="text-[9px] text-[var(--theme-text-muted)] uppercase mt-1">{t.charts.funnel_subtitle}</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="size-2 rounded-full bg-aqua animate-pulse" />
                                <div className="size-2 rounded-full bg-emerald-500" />
                                <div className="size-2 rounded-full bg-amber-500" />
                            </div>
                        </div>
                        <div className="flex-1 min-h-[350px]">
                            <FunnelChart data={carbonFunnelData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 📋 Audit Log & Blockchain Evidence */}
            <div className="p-10 rounded-[3rem] bg-[var(--theme-card-bg)] border border-[var(--theme-glass-border)] liquid-glass shadow-xl">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-aqua/10 text-aqua">
                            <Binary size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-[var(--theme-text-main)]">5T Immutable Audit Trail</h4>
                            <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest mt-1">Real-time ledger entries provided by OmniNexus</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-glass-border)] text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] hover:text-aqua transition-colors flex items-center gap-2">
                            <Search size={12} /> Verify All
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                        {auditLog.map((log, idx) => (
                            <div key={idx} className="p-4 bg-[var(--theme-surface-2)]/20 border border-[var(--theme-glass-border)] rounded-2xl flex items-center justify-between group hover:border-aqua/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-mono text-aqua opacity-50">#{(idx + 1).toString().padStart(3, '0')}</span>
                                    <p className="text-[10px] font-medium text-[var(--theme-text-sub)] font-mono">{log}</p>
                                </div>
                                <ArrowDownRight size={14} className="text-gray-600 group-hover:text-aqua transition-colors" />
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-3xl bg-[var(--theme-surface)]/40 border border-[var(--theme-glass-border)] space-y-6">
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-aqua mb-3">Sealing Stats</p>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-[var(--theme-text-muted)]">Atomic Weight</span>
                                    <span className="text-[var(--theme-text-main)] font-black">42.5 kg/unit</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-[var(--theme-text-muted)]">Hash Protocol</span>
                                    <span className="text-[var(--theme-text-main)] font-black">SHA-256</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-[var(--theme-text-muted)]">Block Depth</span>
                                    <span className="text-[var(--theme-text-main)] font-black">1,024 Peaks</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-[var(--theme-glass-border)]">
                            <button className="w-full py-4 rounded-2xl bg-aqua/10 border border-aqua/20 text-[10px] font-black uppercase tracking-[0.2em] text-aqua hover:bg-aqua hover:text-black transition-all">
                                Download Integrity Certify
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
