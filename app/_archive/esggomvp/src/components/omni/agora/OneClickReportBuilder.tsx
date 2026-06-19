'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, CheckCircle2, Loader2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    icon: any;
}

/**
 * 🏗️ OneClickReportBuilder (一鍵報告鑄造引擎)
 * 將已封印之 5T 永續資產轉化為正式報告 (Web/PDF)。
 * 提供模板選擇與自動填充。
 */
export const OneClickReportBuilder: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const templates: ReportTemplate[] = [
        { id: 'gri', name: 'GRI 永續準則簡報', description: '符合全球報告倡議組織標準的結構化報告。', icon: ShieldCheck },
        { id: 'investor', name: 'ESG 投資人摘要', description: '針對資本市場設計的高價值影響力概要。', icon: Sparkles },
        { id: 'impact', name: '社會價值影響力報告', description: '深度解析行為與社會收益之因果鏈。', icon: FileText },
    ];

    const handleStartBuild = () => {
        setStep(2);
        setTimeout(() => setStep(3), 2000);
    };

    return (
        <LiquidGlassContainer className="p-8">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-omni-text-main">選擇顯化範本</h3>
                            <p className="text-omni-text-sub mt-2 text-sm">請選擇一個最適合您發布場景的永續報告範本。</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {templates.map((tmpl) => (
                                <div
                                    key={tmpl.id}
                                    onClick={() => setSelectedTemplate(tmpl.id)}
                                    className={`
                    p-6 rounded-3xl border cursor-pointer transition-all duration-300
                    ${selectedTemplate === tmpl.id
                                            ? 'bg-omni-primary/10 border-omni-primary shadow-lg shadow-omni-primary/10'
                                            : 'bg-black/5 border-transparent hover:border-omni-glass-border'}
                  `}
                                >
                                    <div className={`size-12 rounded-2xl mb-4 flex items-center justify-center ${selectedTemplate === tmpl.id ? 'bg-omni-primary text-white' : 'bg-omni-surface-2 text-omni-text-muted'}`}>
                                        <tmpl.icon size={24} />
                                    </div>
                                    <h4 className="font-bold text-omni-text-main mb-2">{tmpl.name}</h4>
                                    <p className="text-xs text-omni-text-sub leading-relaxed">{tmpl.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <button
                                disabled={!selectedTemplate}
                                onClick={handleStartBuild}
                                className="px-12 py-4 bg-omni-primary text-white rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-omni-primary/20 disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                            >
                                <Sparkles size={20} /> 開始鑄造報告
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 flex flex-col items-center justify-center space-y-6"
                    >
                        <div className="relative">
                            <Loader2 size={64} className="text-omni-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="size-8 bg-omni-primary rounded-full animate-ping opacity-20" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="text-xl font-black text-omni-text-main">資料資產鑄造中...</h4>
                            <div className="flex items-center gap-2 text-xs text-omni-text-muted mt-2 font-mono">
                                <span className="animate-pulse">TRACE</span> → <span className="animate-pulse">VERIFY</span> → <span className="animate-pulse">SEAL</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 py-4"
                    >
                        <div className="size-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white shadow-2xl shadow-green-500/30">
                            <CheckCircle2 size={40} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-omni-text-main uppercase tracking-tight">鑄造成功 !</h3>
                            <p className="text-omni-text-sub mt-2">您的 5T 永續報告已顯化為數位資產。</p>
                        </div>

                        <div className="p-4 bg-omni-primary/5 border border-divider-1 rounded-2xl max-w-sm mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-omni-primary/10 rounded-lg flex items-center justify-center text-omni-primary">
                                    <FileText size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-omni-text-main">ESGo_Report_2026.pdf</p>
                                    <p className="text-[10px] text-omni-text-muted">Size: 4.2 MB · 5T Verified</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-omni-primary/10 rounded-full text-omni-primary transition-colors">
                                <Download size={20} />
                            </button>
                        </div>

                        <div className="flex justify-center gap-4 pt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2.5 rounded-xl border border-omni-glass-border font-bold text-omni-text-main hover:bg-omni-surface-2 transition-colors"
                            >
                                回範本選擇
                            </button>
                            <button className="px-8 py-2.5 bg-omni-primary text-white rounded-xl font-black flex items-center gap-2">
                                進入發布廣場 <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LiquidGlassContainer>
    );
};
