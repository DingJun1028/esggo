import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import {
    Download,
    Share2,
    ShieldCheck,
    BookOpen,
    BarChart3,
    Globe,
    Users,
    Scale,
    ChevronRight,
    Search,
    FileText,
    Sparkles
} from 'lucide-react';

interface DigitalReportViewerProps {
    reportId: string;
    onClose: () => void;
}

type Chapter = 'executive' | 'environment' | 'social' | 'governance' | 'compliance';

export function DigitalReportViewer({ reportId, onClose }: DigitalReportViewerProps) {
    const [activeChapter, setActiveChapter] = useState<Chapter>('executive');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => setIsExporting(false), 2500);
    };

    const chapters = [
        { id: 'executive', icon: <BookOpen size={18} />, label: 'Executive Summary' },
        { id: 'environment', icon: <Globe size={18} />, label: 'Scope 1-3 Emissions' },
        { id: 'social', icon: <Users size={18} />, label: 'Social Impact & Capital' },
        { id: 'governance', icon: <Scale size={18} />, label: 'Board Governance' },
        { id: 'compliance', icon: <ShieldCheck size={18} />, label: '5T Compliance Matrix (GRI/SASB)' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm"
        >
            <LiquidGlassContainer glowColor="indigo" intensity="high" className="w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0A0A0A]">

                {/* Header: The "Wow" Factor */}
                <header className="flex-shrink-0 flex flex-col md:flex-row items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <FileText size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 flex items-center gap-1">
                                    <ShieldCheck size={12} /> 5T Atom Sealing Valid
                                </span>
                                <span className="text-xs font-mono text-slate-500">ID: {reportId}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                                2026 企業永續報告書 <span className="text-indigo-500">(ESG Sustainability Report)</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <button className="p-3 text-slate-400 hover:text-indigo-500 transition-colors bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                            <Share2 size={20} />
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {isExporting ? '打包 500 頁 PDF 中...' : <><Download size={16} /> 下載完整 PDF (520頁)</>}
                        </button>
                        <button onClick={onClose} className="p-3 text-slate-400 hover:text-rose-500 transition-colors bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                            ✕
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Navigation */}
                    <nav className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A0A0A]/50 p-4 overflow-y-auto hidden md:block">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Interactive Index</div>
                        <div className="space-y-2">
                            {chapters.map((chap) => (
                                <button
                                    key={chap.id}
                                    onClick={() => setActiveChapter(chap.id as Chapter)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeChapter === chap.id
                                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                                        }`}
                                >
                                    {chap.icon}
                                    <span className="text-sm">{chap.label}</span>
                                    {activeChapter === chap.id && <ChevronRight size={14} className="ml-auto" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                            <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Sparkles size={12} /> AI Insight
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">
                                您的表現超越了 78% 的同業。建議將「水資源回收率」寫入年度財報亮點。
                            </p>
                        </div>
                    </nav>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-white dark:bg-[#111111]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeChapter}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-4xl mx-auto space-y-12"
                            >
                                {/* Executive Summary */}
                                {activeChapter === 'executive' && (
                                    <>
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">高階決策摘要 (Executive Summary)</h3>
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                                本報告涵蓋 2025-2026 年度之所有 ESG 影響力指標。基於 JunAiKey 5T 協議驗算，本公司成功降低碳強度達 15%，同時提升 ESG ROI 至 22.4%，展現將社會責任轉化為商業護城河的卓越能力。
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ESG ROI</div>
                                                <div className="text-4xl font-black text-indigo-500">22.4%</div>
                                                <div className="text-xs text-emerald-500 mt-2 font-bold">+4.1% YoY</div>
                                            </div>
                                            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Carbon Intensity</div>
                                                <div className="text-4xl font-black text-cyan-500">-15%</div>
                                                <div className="text-xs text-emerald-500 mt-2 font-bold">Scope 1+2 Validated</div>
                                            </div>
                                            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">TCFD Compliance</div>
                                                <div className="text-4xl font-black text-emerald-500">100%</div>
                                                <div className="text-xs text-emerald-500 mt-2 font-bold">Auditor Finalized</div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Compliance Matrix */}
                                {activeChapter === 'compliance' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">法遵合規對照表 (GRI / SASB / TCFD)</h3>
                                            <div className="relative">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input type="text" placeholder="Search Standards..." className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-indigo-500" />
                                            </div>
                                        </div>

                                        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                                                    <tr>
                                                        <th className="p-4 font-bold">GRI Standard</th>
                                                        <th className="p-4 font-bold">Disclosure Context</th>
                                                        <th className="p-4 font-bold">Corresponding SASB</th>
                                                        <th className="p-4 font-bold">Status</th>
                                                        <th className="p-4 font-bold">Verification Hash</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="p-4 font-mono font-bold">GRI 305-1</td>
                                                        <td className="p-4">Direct (Scope 1) GHG emissions</td>
                                                        <td className="p-4 font-mono text-xs">FB-AG-130a.1</td>
                                                        <td className="p-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs font-bold">Verified</span></td>
                                                        <td className="p-4 font-mono text-xs opacity-50">0x8f...2a1b</td>
                                                    </tr>
                                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="p-4 font-mono font-bold">GRI 305-2</td>
                                                        <td className="p-4">Energy indirect (Scope 2) GHG emissions</td>
                                                        <td className="p-4 font-mono text-xs">FB-AG-130a.1</td>
                                                        <td className="p-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs font-bold">Verified</span></td>
                                                        <td className="p-4 font-mono text-xs opacity-50">0xb4...e99c</td>
                                                    </tr>
                                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="p-4 font-mono font-bold">GRI 401-1</td>
                                                        <td className="p-4">New employee hires and employee turnover</td>
                                                        <td className="p-4 font-mono text-xs">CG-MR-310a.1</td>
                                                        <td className="p-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs font-bold">Verified</span></td>
                                                        <td className="p-4 font-mono text-xs opacity-50">0xcc...1f09</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-xs text-slate-500 italic text-right mt-4">
                                            * 本報告所有數據皆已通過第三方確信，符合金管會最新永續發展藍圖規範。
                                        </p>
                                    </div>
                                )}

                                {/* Placeholder for other chapters */}
                                {['environment', 'social', 'governance'].includes(activeChapter) && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <BarChart3 size={64} className="text-slate-200 dark:text-slate-800 mb-6" />
                                        <h4 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">載入進階深度報表中...</h4>
                                        <p className="text-slate-500">真實報告中，此處將自動生成高達百頁的圖表分析與趨勢對比。</p>
                                    </div>
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </LiquidGlassContainer>
        </motion.div>
    );
}
