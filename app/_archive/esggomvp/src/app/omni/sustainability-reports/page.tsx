'use client';

import React, { useState, useEffect } from 'react';
import { OmniTable } from "@/components/omni/liquid-glass/OmniTable";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { OmniComicStrip, ComicPanel } from "@/components/omni/cards/OmniComicStrip";
import { DigitalReportViewer } from "@/components/omni/reports/DigitalReportViewer";
import { OMNI_MODULES } from "@/config/omni-modules";
import { Shield, Plus, Building, FileText, CheckCircle2, Factory, Server, Fingerprint, RefreshCcw, Lock } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

type ReportStatus = 'Drafting' | 'Verifying' | 'Done';

interface ReportData {
    uuid: string;
    payload: { title: string; type: string; progress: number; status: ReportStatus };
    tags: { semantic: string }[];
    isFrozen: boolean;
    originHash: string;
    impactMetric: string;
}

export default function SustainabilityReportsPage() {
    const moduleInfo = OMNI_MODULES.SUSTAINABILITY_REPORTS;

    const [reports, setReports] = useState<ReportData[]>([
        {
            uuid: 'rep-001',
            payload: { title: '2025 年度溫室氣體盤查報告', type: 'Env', progress: 100, status: 'Done' },
            tags: [{ semantic: '#GRI-Standard' }, { semantic: '#ISO-14064' }],
            isFrozen: true,
            originHash: '0xabc...def',
            impactMetric: '完全對齊 GRI 2024 更新準則，數據溯源鏈條完整。'
        },
        {
            uuid: 'rep-002',
            payload: { title: '供應鏈永續影響力報告', type: 'Social', progress: 45, status: 'Drafting' },
            tags: [{ semantic: '#SupplyChain' }],
            isFrozen: false,
            originHash: '0x123...456',
            impactMetric: '正從 Impact Village 同步協力廠商數據中。'
        }
    ]);

    const [isForging, setIsForging] = useState(false);
    const [forgeStep, setForgeStep] = useState(0);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
        { id: '1', title: '1. 數據採集 (Traceable)', description: '自動橋接 IoT 傳感器與 ERP 系統，確保所有碳排原始指紋皆可溯源。', color: 'primary' },
        { id: '2', title: '2. 框架映射 (Transparent)', description: '將邊緣數據 100% 映射至 GRI 與 SASB 國際準則，消除綠漂疑慮。', color: 'accent' },
        { id: '3', title: '3. 零幻覺驗算 (Trustworthy)', description: '透過 Dr. Thoth 本質提純機制，執行無死角的公式驗算與雜湊封印。', color: 'success' },
        { id: '4', title: '4. 永續傳法 (Transcendent)', description: '一鍵鑄造法遵級的 500 頁永續報告，將無形影響力化為企業真實護城河。', color: 'primary' }
    ];

    const forgeReport = () => {
        setIsForging(true);
        setForgeStep(1);

        // Simulation of 5T automated report generation
        setTimeout(() => setForgeStep(2), 1500); // Trace Data
        setTimeout(() => setForgeStep(3), 3000); // Verify Hash
        setTimeout(() => {
            const newReport: ReportData = {
                uuid: `rep-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                payload: {
                    title: 'Q1 2026 TCFD 氣候風險評估報告',
                    type: 'Governance',
                    progress: 100,
                    status: 'Done'
                },
                tags: [{ semantic: '#TCFD' }, { semantic: '#Risk-Analysis' }],
                isFrozen: true,
                originHash: '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                impactMetric: 'Gnosis 預測模型已套用，風險分析準確度 99.8%'
            };
            setReports([newReport, ...reports]);
            setIsForging(false);
            setForgeStep(0);
        }, 4500);
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400 w-fit">
                        <Shield size={10} />
                        {moduleInfo.domain} Core · {moduleInfo.uuid}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic text-slate-900 dark:text-white uppercase mt-2">
                        Sustainability <span className="text-indigo-500">Reports</span> Forge
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-2xl mt-2 leading-relaxed">
                        {moduleInfo.description} — 透過 JunAiKey 與 5T 協議，將離散數據自動鑄造為不可篡改的永續報告資產。
                    </p>
                </div>

                <button
                    onClick={forgeReport}
                    disabled={isForging}
                    className="flex justify-center items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                    {isForging ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Forging...
                        </>
                    ) : (
                        <>
                            <Plus size={16} /> 鑄造新報告 (Forge)
                        </>
                    )}
                </button>
            </div>

            {/* OmniComicStrip Section */}
            <div className="mb-4">
                <OmniComicStrip panels={comicPanels} />
            </div>

            {/* Forge Simulation Area */}
            <AnimatePresence>
                {isForging && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <LiquidGlassContainer glowColor="indigo" intensity="medium" className="p-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2 mb-6">
                                <Server size={14} /> Agentic Forge in Progress
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className={`p-4 rounded-xl border ${forgeStep >= 1 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <Building size={20} />
                                        {forgeStep >= 1 && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">1. IoT Data Harvesting</h4>
                                    <p className="text-xs opacity-70">Collecting Scope 1/2 emissions data from Omni Sensors...</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${forgeStep >= 2 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <Factory size={20} />
                                        {forgeStep >= 2 && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">2. Scope 3 Matrix</h4>
                                    <p className="text-xs opacity-70">Synthesizing supply chain impact metrics via Gnosis Engine...</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${forgeStep >= 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <CheckCircle2 size={20} />
                                        {forgeStep >= 3 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">3. Hash Lock 5T Sealing</h4>
                                    <p className="text-xs opacity-70">Applying Zero Hallucination Validation and freezing asset...</p>
                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table Area */}
            <div className="w-full">
                <OmniTable
                    title="報告資產庫 (Asset Ledger)"
                    subtitle="已通過審計的 5T 永續紀錄"
                    columns={[
                        { key: 'title', header: '報告名稱 (Report Title)' },
                        {
                            key: 'type',
                            header: '類型 (Category)',
                            render: (val) => (
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                    {val}
                                </span>
                            )
                        },
                        {
                            key: 'progress',
                            header: '完成進度 (Progress)',
                            render: (val: number, row: any) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden w-24">
                                        <div
                                            className={`h-full ${row.status === 'Done' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${val}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{val}%</span>
                                </div>
                            )
                        },
                        {
                            key: 'status',
                            header: '狀態 (Status)',
                            render: (val: ReportStatus) => {
                                const styles = {
                                    'Done': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                                    'Verifying': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                                    'Drafting': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                                };
                                return (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[val]}`}>
                                        {val}
                                    </span>
                                );
                            }
                        },
                        {
                            key: 'action',
                            header: '',
                            render: (_, row: any) => (
                                row.status === 'Done' ? (
                                    <button
                                        onClick={() => setSelectedReportId(row.uuid)}
                                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <FileText size={14} /> View
                                    </button>
                                ) : (
                                    <button disabled className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg opacity-50 cursor-not-allowed flex items-center gap-2">
                                        <FileText size={14} /> Processing
                                    </button>
                                )
                            )
                        }
                    ]}
                    data={reports as any}
                />
            </div>

            <AnimatePresence>
                {selectedReportId && (
                    <DigitalReportViewer reportId={selectedReportId} onClose={() => setSelectedReportId(null)} />
                )}
            </AnimatePresence>

            <div className="text-center mt-12 mb-8 text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">
                Service is Learning · Knowledge is Asset
            </div>
        </div>
    );
}
