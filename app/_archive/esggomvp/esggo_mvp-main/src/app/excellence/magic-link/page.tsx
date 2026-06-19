'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, FileText, CheckCircle, Zap, ShieldCheck, Link,
    Sparkles, Send, Activity, Info, HelpCircle, ArrowRight,
    Database, Fingerprint, Globe, History
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 💡 Magic Link Portal (供應鏈蟲洞)
 * 貫徹「服務即教學，知識即資產」：
 * 讓外部供應商在填報數據的過程中，理解 5T 協議的運作及數據如何轉化為資產。
 */
export default function MagicLinkPortal() {
    const { t, locale } = useLanguage();
    const [uploadState, setUploadState] = useState<'idle' | 'scanning' | 'extracted' | 'submitted'>('idle');
    const [hash, setHash] = useState('');
    const [showGuidance, setShowGuidance] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 模擬提取的數據
    const extractedData = {
        value: 45210,
        unit: 'kWh',
        period: '2026-10-01 ~ 2026-10-31',
        sourceName: 'Vietnam Facility A - Electricity Bill',
        factor: 0.495,
        formula: 'E = AD × EF'
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            simulateExtraction();
        }
    };

    const simulateExtraction = () => {
        setUploadState('scanning');
        // 模擬 OCR 解析、5T 驗證與 Hash 生成
        setTimeout(() => {
            const simulatedHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            setHash(simulatedHash);
            setUploadState('extracted');
        }, 3000);
    };

    const handleSubmit = () => {
        setUploadState('submitted');
    };

    return (
        <div className="min-h-screen transition-colors duration-300"
            style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                <div className="relative overflow-hidden pt-12 flex flex-col justify-center min-h-[calc(100vh-80px)]">

                    {/* Ambient Background */}
                    <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full opacity-5 blur-[100px] pointer-events-none"
                        style={{ backgroundColor: 'var(--primary)' }} />

                    <div className="max-w-4xl mx-auto w-full px-6 relative z-10">

                        {/* Top Header & Guidance Toggle */}
                        <div className="flex flex-col items-center text-center mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6 cursor-pointer hover:scale-105 transition-all"
                                style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.1)', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                                onClick={() => setShowGuidance(!showGuidance)}
                            >
                                <Sparkles size={12} />
                                {showGuidance ? 'Close Guidance' : 'Service as Learning: Active'}
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight" style={{ color: 'var(--foreground)' }}>
                                {locale === 'zh-TW' ? '供應鏈永續資料匯報' : 'Supply Chain Sustainability Report'}
                                <span className="text-primary">.</span>
                            </h1>
                            <p className="text-sm md:text-base max-w-xl mx-auto opacity-70 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                                {locale === 'zh-TW'
                                    ? '跨越邊界的數據蟲洞。上傳您的能源憑證，即刻將真實活動轉化為永續資產。'
                                    : 'A data wormhole across borders. Upload your energy certificates to instantly transform real-world activity into sustainable assets.'}
                            </p>
                        </div>

                        {/* Guidance Panel */}
                        <AnimatePresence>
                            {showGuidance && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mb-8"
                                >
                                    <div className="p-6 rounded-3xl border bg-primary/10 border-primary/30 backdrop-blur-md">
                                        <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Info size={16} /> 如何發揮您的影響力？
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed text-foreground/80">
                                            <div className="space-y-2">
                                                <p><b className="text-primary text-[11px]">1. 數據擷取 (Tangible):</b> 透過人工智慧 OCR 視覺技術，我們精準提取憑證上的活動量，確保數據具備物理真實性。</p>
                                                <p><b className="text-primary text-[11px]">2. 溯源印記 (Traceable):</b> 每一份文件都會被賦予唯一的數位指紋與 Hash Lock，確保其在供應鏈中的溯源路徑清晰可見。</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p><b className="text-primary text-[11px]">3. 5T 合規驗證:</b> 當您提交數據時，系統會自動在後端執行「零幻覺驗算」，確保排放計算公式與係數符合國際標準。</p>
                                                <p><b className="text-primary text-[11px]">4. 知識資產化:</b> 您的填報記錄將轉化為企業的永續資產，並為您贏得供應鏈誠信積分。</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Interaction Area */}
                        <div className="p-8 md:p-12 rounded-[3rem] border relative overflow-hidden transition-all duration-500 shadow-2xl"
                            style={{ backgroundColor: 'var(--theme-card-bg)', borderColor: 'var(--theme-glass-border)', backdropFilter: 'blur(20px)' }}>

                            <AnimatePresence mode="wait">

                                {uploadState === 'idle' && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-center"
                                    >
                                        <div
                                            onClick={handleUploadClick}
                                            className="w-full max-w-xl mx-auto aspect-[2/1] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all hover:border-primary/60 hover:bg-primary/5"
                                            style={{ borderColor: 'rgba(var(--primary-rgb), 0.2)', backgroundColor: 'rgba(var(--primary-rgb), 0.03)' }}
                                        >
                                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] transition-all duration-500"
                                                style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.1)', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}>
                                                <Upload size={32} />
                                            </div>
                                            <h3 className="text-xl font-black mb-2" style={{ color: 'var(--foreground)' }}>
                                                {locale === 'zh-TW' ? '投遞您的永續憑證' : 'Drop Your Sustainability Assets'}
                                            </h3>
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-4" style={{ color: 'var(--foreground)' }}>
                                                PDF · PNG · JPG (MAX 10MB)
                                            </p>
                                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-primary/60">
                                                <span className="flex items-center gap-1"><Database size={10} /> OCR Scanning</span>
                                                <span className="flex items-center gap-1"><ShieldCheck size={10} /> Hash Lock</span>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept=".pdf,image/*"
                                            onChange={handleFileChange}
                                        />
                                    </motion.div>
                                )}

                                {uploadState === 'scanning' && (
                                    <motion.div
                                        key="scanning"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="text-center py-16 space-y-10"
                                    >
                                        <div className="relative w-32 h-32 mx-auto">
                                            <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Zap className="text-primary animate-pulse" size={40} />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="font-black text-lg uppercase tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                                                {locale === 'zh-TW' ? '智慧神經網絡解析中' : 'OmniCore Neural Scanning'}
                                            </p>
                                            <div className="flex flex-col items-center gap-1 opacity-50">
                                                <p className="text-[10px] uppercase font-bold tracking-widest leading-relaxed">Extracting Activity Data & Generating Origin Hash...</p>
                                                <div className="w-48 h-[1px] bg-primary/30 relative overflow-hidden">
                                                    <motion.div
                                                        className="absolute inset-0 bg-primary"
                                                        animate={{ x: ['-100%', '100%'] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {uploadState === 'extracted' && (
                                    <motion.div
                                        key="extracted"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-16 pt-4 relative"
                                    >
                                        {/* Left Side: Extracted Identity */}
                                        <div className="flex-1 flex flex-col items-center text-center z-10">
                                            <div className="relative group mb-8">
                                                <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                <div className="w-40 h-52 rounded-2xl border-2 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[var(--theme-surface)]/80 backdrop-blur-xl border-[var(--theme-glass-border)] group-hover:border-primary/50 transition-all duration-500 shadow-xl">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                                                    <FileText size={48} className="mb-4 text-primary/60 group-hover:text-primary transition-colors" />
                                                    <div className="w-full space-y-2">
                                                        <div className="h-1 bg-[var(--theme-surface-2)] rounded w-full" />
                                                        <div className="h-1 bg-[var(--theme-surface-2)] rounded w-3/4" />
                                                        <div className="h-1 bg-[var(--theme-surface-2)] rounded w-5/6" />
                                                    </div>
                                                    <div className="absolute bottom-4 inset-x-4">
                                                        <span className="text-[8px] font-mono whitespace-nowrap opacity-40 uppercase tracking-tighter">verified_invoice_1026.pdf</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30">
                                                    <CheckCircle size={12} /> Data Anchored
                                                </div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">Verified by InfoOne Trust Engine</p>
                                            </div>
                                        </div>

                                        {/* Golden Thread Visual Link */}
                                        <div className="hidden md:flex flex-col items-center justify-center relative w-1 z-0">
                                            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] border-l border-dashed border-primary/40" />
                                            <motion.div
                                                className="w-2 h-2 rounded-full absolute bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]"
                                                animate={{ top: ['0%', '100%'] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            />
                                            <div className="rotate-90 whitespace-nowrap flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-primary bg-background px-4 py-1 rounded-full border border-primary/20">
                                                <Link size={10} strokeWidth={3} /> Golden Thread
                                            </div>
                                        </div>

                                        {/* Right Side: Data Transparency & Submit */}
                                        <div className="flex-1 text-left space-y-6 z-10 w-full">
                                            <div className="p-8 rounded-[2rem] border relative overflow-hidden group bg-primary/5 border-primary/20">
                                                <div className="absolute top-4 right-4 text-primary/40">
                                                    <HelpCircle size={16} className="cursor-help" onClick={() => alert("這是從您的憑證中自動提取的活動數據 (Activity Data)。")} />
                                                </div>
                                                <h4 className="text-[10px] uppercase tracking-widest font-black text-primary flex items-center gap-2 mb-4">
                                                    <Zap size={14} /> 活動數據解析 (Extracted AD)
                                                </h4>
                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <span className="text-5xl font-black text-[var(--theme-text-main)] tracking-tighter">{extractedData.value.toLocaleString()}</span>
                                                    <span className="text-lg font-bold opacity-60 text-[var(--theme-text-main)] leading-none">{extractedData.unit}</span>
                                                </div>
                                                <div className="pt-4 border-t border-primary/10 flex flex-col gap-2">
                                                    <div className="flex justify-between items-center text-[10px]">
                                                        <span className="text-[var(--theme-text-muted)] font-black uppercase tracking-widest">Period</span>
                                                        <span className="text-[var(--theme-text-sub)] font-mono">{extractedData.period}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px]">
                                                        <span className="text-[var(--theme-text-muted)] font-black uppercase tracking-widest">Formula</span>
                                                        <span className="text-primary font-mono font-bold">{extractedData.formula}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-2xl border bg-[var(--theme-surface)] border-[var(--theme-glass-border)] space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-[9px] uppercase tracking-[0.2em] font-black text-[var(--theme-text-muted)] flex items-center gap-2">
                                                        <ShieldCheck size={14} className="text-primary" /> Traceability Hash
                                                    </h4>
                                                    <button
                                                        onClick={() => setShowHistory(!showHistory)}
                                                        className="text-[9px] font-black underline uppercase tracking-widest text-primary/80 hover:text-primary transition-colors"
                                                    >
                                                        History
                                                    </button>
                                                </div>
                                                <p className="text-[10px] font-mono break-all leading-relaxed text-primary/80 bg-[var(--theme-surface-2)] p-4 rounded-xl border border-[var(--theme-glass-border)]">
                                                    {hash}
                                                </p>

                                                <AnimatePresence>
                                                    {showHistory && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="p-4 bg-[var(--theme-surface-2)]/60 rounded-xl border border-[var(--theme-glass-border)] space-y-3 shadow-inner"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                                                                <div>
                                                                    <p className="text-[9px] font-black uppercase text-foreground">Initial Upload @ Local Node</p>
                                                                    <p className="text-[8px] opacity-40">2026-10-31 15:42:10 UTC</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                                                                <div>
                                                                    <p className="text-[9px] font-black uppercase text-foreground">Hash Lock Generated (immutable)</p>
                                                                    <p className="text-[8px] opacity-40">2026-10-31 15:42:13 UTC</p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <button
                                                onClick={handleSubmit}
                                                className="w-full py-5 font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all duration-500 bg-primary text-black hover:bg-white hover:scale-[1.02] active:scale-95 shadow-[0_10px_40px_rgba(var(--primary-rgb),0.3)]"
                                            >
                                                <span className="flex items-center justify-center gap-3">
                                                    <Send size={18} /> 提交至企業核心節點
                                                </span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {uploadState === 'submitted' && (
                                    <motion.div
                                        key="submitted"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 bg-green-500/20 text-green-400 border border-green-500/40 relative">
                                            <div className="absolute inset-0 rounded-full animate-ping bg-green-500/10" />
                                            <ShieldCheck size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter" style={{ color: 'var(--foreground)' }}>
                                            Transmission Complete <span className="text-primary">!</span>
                                        </h2>
                                        <p className="text-sm max-w-lg mx-auto leading-relaxed mb-10 text-foreground/70">
                                            {locale === 'zh-TW'
                                                ? '感謝您的誠信填報。您的數據已轉化為企業級永續資產，並成功存儲於證據庫。系統已為您生成了一份專屬的「減碳賦能包」。'
                                                : 'Thank you for your integrity. Your data has been transformed into an enterprise-grade sustainability asset. We have generated a personal empowerment kit for you.'}
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button
                                                className="px-10 py-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[var(--theme-text-main)] hover:text-[var(--theme-bg)] transition-all shadow-xl hover:shadow-primary/20"
                                            >
                                                查看您的減碳大禮包
                                            </button>
                                            <button
                                                className="px-10 py-4 border border-[var(--theme-glass-border)] bg-[var(--theme-surface)] text-[var(--theme-text-main)] font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[var(--theme-surface-2)] transition-all shadow-md"
                                            >
                                                <span className="flex items-center gap-2"><Globe size={14} /> 瀏覽全球案例庫</span>
                                            </button>
                                        </div>
                                        <p className="mt-8 text-[9px] uppercase tracking-[0.5em] font-black text-primary/50">Service as Learning · Knowledge as Asset</p>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>

                        {/* Semantic Footer */}
                        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Activity size={14} className="text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Omni-Sprite <br className="md:hidden" /> Protocol v12.1</span>
                            </div>
                            <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Fingerprint size={14} className="text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Hash Lock <br className="md:hidden" /> Immutable Origin</span>
                            </div>
                            <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Globe size={14} className="text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global <br className="md:hidden" /> Compliance Ready</span>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
