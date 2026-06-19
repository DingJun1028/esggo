import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TiffanyButton } from '../components/tiffany/TiffanyButton';
import { TiffanyInput } from '../components/tiffany/TiffanyInput';
import { TiffanyTag } from '../components/tiffany/TiffanyTag';
import { ServiceJourney } from '../components/tiffany/ServiceJourney';
import { LogicGate } from '../components/tiffany/LogicGate';
import { WisdomMentor } from '../components/tiffany/WisdomMentor';
import { useOmniTheme } from '../omni/infrastructure/ui/OmniThemeProvider';
import { LearningJourneySVG } from '../components/tiffany/LearningJourneySVG';
import { LogicGatePopup } from '../components/tiffany/LogicGatePopup';
import { Sparkles, LayoutGrid, Layers, Cpu, Sun, Moon, Bot, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInfoOne } from '../omni/hooks/useInfoOne';

const TiffanyShowcase: React.FC = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [isLogicGateOpen, setIsLogicGateOpen] = useState(false);
    const { theme, toggleTheme } = useOmniTheme();
    const { status, crystal, arvoStatus, visuals, isProcessing, triggerOptimization } = useInfoOne();

    const journeyNodes = [
        { id: '1', x: 20, y: 50, label: 'Start', isCompleted: true },
        { id: '2', x: 120, y: 120, label: 'Phase 1', isCompleted: true },
        { id: '3', x: 220, y: 80, label: 'Phase 2', isCompleted: false },
        { id: '4', x: 320, y: 150, label: 'End', isCompleted: false },
    ];

    return (
        <div className="min-h-screen text-[var(--tiffany-text)] p-4 md:p-12 font-sans selection:bg-[#81D8D0]/30 transition-colors duration-500">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#81D8D0]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                {/* Header Section */}
                <header className="h-20 fixed top-0 left-0 right-0 px-8 flex justify-between items-center z-50 backdrop-blur-md bg-white/40 dark:bg-black/40 border-b border-[var(--tiffany-border)] transition-colors duration-500">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[var(--tiffany-glass-bg)] border border-[var(--tiffany-border)] text-[#81D8D0] shadow-glow">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight text-[var(--tiffany-text)] uppercase italic leading-none">
                                    Tiffany <span className="text-[#81D8D0]">& 5T 系統</span>
                                </h1>
                                <p className="text-[10px] text-[var(--tiffany-text-secondary)] font-bold mt-1 uppercase tracking-widest leading-none">
                                    Premium Design System v1.0.4
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-[var(--tiffany-glass-bg)] border border-[var(--tiffany-border)] text-[#81D8D0] hover:bg-[#81D8D0] hover:text-slate-950 transition-all"
                        >
                            {theme === 'sun' ? <Moon size={18} /> : <Sun size={18} />}
                        </motion.button>
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--tiffany-text-secondary)]">TRUTH RESONANCE</span>
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-1 bg-[var(--tiffany-border)] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#81D8D0]" style={{ width: '85%' }} />
                                </div>
                                <span className="text-[10px] font-black text-[#81D8D0]">85%</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Add spacing for fixed header */}
                <div className="h-24" />

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Atomic Components */}
                    <section className="lg:col-span-8 space-y-12">

                        {/* 01 Buttons */}
                        <div className="space-y-8 bg-[var(--color-bg)] p-8 rounded-3xl border border-[var(--color-border)] liquid-crystal-panel">
                            <div className="flex items-center gap-2 border-b border-[var(--tiffany-border)] pb-4">
                                <LayoutGrid className="w-5 h-5 text-[#81D8D0]" />
                                <h2 className="text-2xl font-black text-[var(--tiffany-text)] uppercase tracking-tight">01 原子組件：交互按鈕</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <div className="flex flex-col gap-4">
                                    <span className="text-[10px] text-[var(--tiffany-text-secondary)] font-black uppercase tracking-widest">主要操作</span>
                                    <TiffanyButton variant="primary" className="w-full">Tiffany Glow</TiffanyButton>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-[10px] text-[var(--tiffany-text-secondary)] font-black uppercase tracking-widest">次要玻璃美學</span>
                                    <TiffanyButton variant="secondary" className="w-full">Frosted Logic</TiffanyButton>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-[10px] text-[var(--tiffany-text-secondary)] font-black uppercase tracking-widest">受限狀態</span>
                                    <TiffanyButton variant="locked" className="w-full">Protocol Lock</TiffanyButton>
                                </div>
                            </div>
                        </div>

                        {/* 02 Input */}
                        <div className="space-y-8 bg-[var(--color-bg)] p-8 rounded-3xl border border-[var(--color-border)] liquid-crystal-panel">
                            <div className="flex items-center gap-2 border-b border-[var(--tiffany-border)] pb-4">
                                <Layers className="w-5 h-5 text-[#81D8D0]" />
                                <h2 className="text-2xl font-black text-[var(--tiffany-text)] uppercase tracking-tight">02 智能組件：數據錄入</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <TiffanyInput
                                    label="量子身份狀態"
                                    placeholder="請輸入主權位址..."
                                    value={address}
                                    onChange={setAddress}
                                />
                                <TiffanyInput
                                    label="協議違規提示"
                                    placeholder="0xINVALID"
                                    error="SHA-256 驗證不匹配 (Hash Lock)"
                                    value="0xINVALID"
                                    onChange={() => { }}
                                />
                            </div>
                        </div>

                        {/* 03 5T Tags */}
                        <div className="space-y-8 bg-[var(--color-bg)] p-8 rounded-3xl border border-[var(--color-border)] liquid-crystal-panel">
                            <div className="flex items-center gap-2 border-b border-[var(--tiffany-border)] pb-4">
                                <Cpu className="w-5 h-5 text-[#81D8D0]" />
                                <h2 className="text-2xl font-black text-[var(--tiffany-text)] uppercase tracking-tight">03 協議標籤 (5T Protcol Tags)</h2>
                            </div>
                            <div className="flex flex-wrap gap-6">
                                <TiffanyTag type="tangible" value={98} code="T-01" label="有形資產 (Tangible)" />
                                <TiffanyTag type="trustworthy" label="網絡共識 (Trustworthy)" code="T-05" />
                                <TiffanyTag type="trackable" label="端到端追踪 (Trackable)" code="T-03" />
                            </div>
                        </div>

                        {/* 04 Service Journey */}
                        <div className="space-y-6 liquid-crystal-panel p-8 rounded-3xl">
                            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                <Sparkles className="w-4 h-4 text-[#81D8D0]" />
                                <h2 className="text-xl font-bold text-[var(--color-text-primary)] uppercase tracking-widest">04 服務旅程 (Journey)</h2>
                            </div>
                            <div className="h-64">
                                <LearningJourneySVG nodes={journeyNodes} activeNodeId="3" />
                            </div>
                        </div>

                        {/* 06 Omni-Truth Dashboard */}
                        <div className="space-y-8 bg-[var(--color-bg)] p-8 rounded-3xl border border-[var(--color-border)] liquid-crystal-panel relative overflow-hidden">
                            {/* Dynamic Background based on Crystal Purity */}
                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                                style={{
                                    background: `radial-gradient(circle at 70% 30%, ${visuals.resonanceColor || '#81D8D0'}20, transparent 70%)`,
                                    opacity: visuals.glowIntensity || 0.1
                                }}
                            />

                            <div className="flex items-center gap-2 border-b border-[var(--tiffany-border)] pb-4 relative z-10">
                                <Sparkles className="w-5 h-5 text-[#81D8D0]" />
                                <h2 className="text-2xl font-black text-[var(--tiffany-text)] uppercase tracking-tight">06 全知真理儀表板 (Omni-Truth)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                {/* Status Panel */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[var(--tiffany-text-secondary)]">生命週期狀態</span>
                                        <TiffanyTag type="tangible" label={status} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[var(--tiffany-text-secondary)]">ARVO 真相驗證</span>
                                        <span className={`text-sm font-black px-2 py-1 rounded ${arvoStatus === 'VERIFIED' ? 'text-emerald-400 bg-emerald-950/30' : 'text-amber-400 bg-amber-950/30'}`}>
                                            {arvoStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[var(--tiffany-text-secondary)]">水晶純度</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-[#81D8D0]">
                                                {crystal ? (crystal.purity * 100).toFixed(1) + '%' : 'N/A'}
                                            </span>
                                            {crystal?.hash && (
                                                <span className="text-[10px] text-[var(--tiffany-text-secondary)] border border-[var(--tiffany-border)] px-1 rounded">
                                                    HASH: {crystal.hash.substring(0, 6)}...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Panel */}
                                <div className="flex flex-col justify-end gap-4">
                                    <div className="p-4 rounded-xl bg-black/20 border border-[var(--tiffany-border)] min-h-[80px] text-xs font-mono text-[var(--tiffany-text-secondary)]">
                                        {isProcessing ? '⚡ Omni-Core Optimizing...' : 'System Ready. Waiting for truth verification.'}
                                        {crystal && <div className="mt-2 text-[#81D8D0]">💎 Omni-Crystal Generated: {crystal.id}</div>}
                                    </div>

                                    <TiffanyButton
                                        variant={isProcessing ? 'locked' : 'primary'}
                                        onClick={triggerOptimization}
                                        disabled={isProcessing}
                                        className="w-full"
                                    >
                                        {isProcessing ? '正在驗證...' : '執行 Omni-Truth 優化循環'}
                                    </TiffanyButton>
                                </div>
                            </div>
                        </div>

                    </section>

                    {/* Right Column: Logic & AI */}
                    <aside className="lg:col-span-4 space-y-12">

                        {/* 05 Logic Gate */}
                        <div className="space-y-8 bg-[var(--color-bg)] p-8 rounded-3xl border border-[var(--color-border)] liquid-crystal-panel">
                            <div className="flex items-center gap-2 border-b border-[var(--tiffany-border)] pb-4">
                                <Cpu className="w-5 h-5 text-[#81D8D0]" />
                                <h2 className="text-2xl font-black text-[var(--tiffany-text)] uppercase tracking-tight">05 協議狀態機</h2>
                            </div>
                            <div className="space-y-6">
                                <LogicGate status="pass" />
                                <TiffanyButton
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => setIsLogicGateOpen(true)}
                                >
                                    開啟 4+1 信任層
                                </TiffanyButton>
                            </div>
                        </div>

                        {/* Wisdom Mentor */}
                        <div className="space-y-8 bg-[var(--color-bg)] p-8 rounded-3xl border border-[var(--color-border)] liquid-crystal-panel">
                            <div className="flex items-center gap-2 border-b border-[var(--tiffany-border)] pb-4">
                                <Bot className="w-5 h-5 text-[#81D8D0]" />
                                <h2 className="text-2xl font-black text-[var(--tiffany-text)] uppercase tracking-tight">智慧導師助手</h2>
                            </div>
                            <WisdomMentor />
                        </div>

                    </aside>

                </main>

                {/* Footer */}
                <footer className="border-t border-[var(--tiffany-border)] pt-12 pb-8 flex flex-col md:flex-row items-center justify-between text-[var(--tiffany-text-secondary)] text-[10px] font-black tracking-[0.4em] uppercase">
                    <span>Tiffany & 5T 設計系統 • 主權版本 2026.1.31</span>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#81D8D0] shadow-[0_0_5px_#81D8D0]" /> 響應式：已激活</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#81D8D0] shadow-[0_0_5px_#81D8D0]" /> 最佳實踐：已啟用</span>
                    </div>
                </footer>
            </div>

            <LogicGatePopup
                isOpen={isLogicGateOpen}
                onClose={() => setIsLogicGateOpen(false)}
                assetData={{
                    uuid: 'SHOWCASE-96-TRUST',
                    hash: '0x81d8d0...f96',
                    source: 'TIFFANY_SHOWCASE',
                    timestamp: '2026-01-31'
                }}
            />
        </div>
    );
};

export default TiffanyShowcase;
