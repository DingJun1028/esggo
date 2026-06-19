import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, ChevronRight, X, Zap, ShieldCheck, Cpu } from 'lucide-react';
import { useI18n } from '../../utils/i18n';

interface MasterOrbGuideProps {
    resonance?: number;
    activeView?: string;
}

export const MasterOrbGuide: React.FC<MasterOrbGuideProps> = ({ resonance = 0, activeView = 'overview' }) => {
    const { t, language } = useI18n();
    const isZh = language === 'zh-TW';
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showBubble, setShowBubble] = useState(false);

    // Aqua & Eternal Gold Theme Colors
    const AQUA_CYAN = '#63a6b0';
    const ETERNAL_GOLD = '#ffd700';

    const getContextualMessage = () => {
        if (activeView === 'spirit') {
            return isZh
                ? '你的「北極星」正在指引方向。透過調整 E/S/G 滑桿，你可以感知個人價值與企業目標的共鳴。'
                : 'Your North Star is guiding the way. Adjust the ESG sliders to perceive the resonance between your values and corporate goals.';
        }
        if (activeView === 'avatar') {
            return isZh
                ? '數位分身是你主權力量的容器。提升屬性將解鎖更高階的 AI 代理權限。'
                : 'The Digital Avatar is the vessel of your sovereign power. Level up attributes to unlock advanced AI agency.';
        }
        return isZh
            ? '歡迎回到主控中心。我是你的數位導師，隨時協助你優化 5T 協議狀態。'
            : 'Welcome back to the Personal Hub. I am your digital mentor, ready to help you optimize (5T) protocol states.';
    };

    useEffect(() => {
        setMessage(getContextualMessage());
        // Auto-show bubble on change or entry
        const timer = setTimeout(() => setShowBubble(true), 1500);
        return () => clearTimeout(timer);
    }, [activeView, isZh]);

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
            {/* Dialogue Bubble */}
            <AnimatePresence>
                {showBubble && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 max-w-[280px] bg-slate-900/80 backdrop-blur-2xl border border-[#63a6b0]/30 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative group"
                    >
                        <button
                            onClick={() => setShowBubble(false)}
                            className="absolute -top-2 -right-2 p-1 bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={10} className="text-white/50" />
                        </button>
                        <p className="text-[12px] text-white leading-relaxed font-medium">
                            {message}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-[9px] font-black text-[#63a6b0] uppercase tracking-widest">Master Orb Guide</span>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="text-[9px] font-bold text-[#ffd700] flex items-center gap-1 hover:underline"
                            >
                                {isZh ? '查看更多' : 'Detail'} <ChevronRight size={10} />
                            </button>
                        </div>
                        {/* Triangle Tail */}
                        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-slate-900/80 rotate-45 border-r border-b border-[#63a6b0]/30" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Master Orb (主控光球) */}
            <div className="relative">
                <motion.button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setShowBubble(false);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative size-16 rounded-full bg-gradient-to-tr from-[#63a6b0] to-[#ffd700] p-0.5 shadow-[0_0_30px_rgba(99,166,176,0.5)] group overflow-hidden"
                >
                    <div className="w-full h-full bg-[#050c14] rounded-full flex items-center justify-center relative overflow-hidden">
                        {/* Internal FX */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#63a6b0]/10 to-transparent" />

                        <Sparkles
                            className={`text-[#63a6b0] w-6 h-6 transition-transform duration-500 ${isOpen ? 'rotate-90 scale-125' : 'group-hover:rotate-12'}`}
                        />

                        {/* Glow Eye */}
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute size-2 bg-white rounded-full blur-[1px] shadow-[0_0_10px_white]"
                        />
                    </div>

                    {/* Outer Rings */}
                    <div className="absolute inset-[-4px] rounded-full border border-[#63a6b0]/20 animate-spin-slow" />
                    <div className="absolute inset-[-8px] rounded-full border border-[#63a6b0]/10 animate-spin-reverse-slow" />
                </motion.button>

                {/* Status Indicator */}
                <div className="absolute top-0 right-0 size-4 bg-[#63a6b0] rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg">
                    <div className="size-1.5 bg-white rounded-full animate-ping" />
                </div>
            </div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed top-0 right-0 w-[400px] h-screen bg-slate-950/80 backdrop-blur-3xl border-l border-[#63a6b0]/20 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] z-[200] p-10 overflow-y-auto"
                    >
                        <header className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                                    Master <span className="text-[#63a6b0]">Orb</span> Center
                                </h2>
                                <p className="text-[10px] text-[#63a6b0] font-black uppercase tracking-[0.2em]">個人數位導師服務</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="text-white/40" />
                            </button>
                        </header>

                        <div className="space-y-8">
                            {/* Philosophy Section */}
                            <div className="p-6 bg-[#63a6b0]/5 border border-[#63a6b0]/20 rounded-3xl relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 size-32 bg-[#ffd700]/5 rounded-full blur-3xl" />
                                <h3 className="text-xs font-black uppercase text-[#ffd700] mb-4 flex items-center gap-2">
                                    <ShieldCheck size={14} /> 自然共鳴律
                                </h3>
                                <p className="text-sm text-white/80 leading-relaxed italic">
                                    「道法自然，系統毅然，上善若水，善向永續。」
                                </p>
                            </div>

                            {/* Resonance Progress */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#63a6b0]">全域共鳴度 Total Resonance</span>
                                    <span className="text-xl font-black text-white">{resonance.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${resonance}%` }}
                                        className="h-full bg-gradient-to-r from-[#63a6b0] to-[#ffd700]"
                                    />
                                </div>
                                <p className="text-[10px] text-white/30 leading-relaxed">
                                    {isZh
                                        ? '共鳴度反映了你當前身心靈（E/S/G）與組織目標的校準程度。'
                                        : 'Resonance reflects the alignment between your Mind/Body/Spirit (E/S/G) and organizational goals.'}
                                </p>
                            </div>

                            {/* Quick Insights */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase text-white/40 tracking-widest">即時洞察 Insights</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { icon: <Zap size={14} />, label: isZh ? '提升環境認知' : 'Boost Eco-Awareness', color: 'emerald' },
                                        { icon: <MessageSquare size={14} />, label: isZh ? '強化社群共鳴' : 'Strengthen Community', color: 'blue' },
                                        { icon: <Cpu size={14} />, label: isZh ? '優化治理邏輯' : 'Optimize Governance', color: 'purple' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                                            <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-[#63a6b0] group-hover:scale-110 transition-transform">
                                                {item.icon}
                                            </div>
                                            <span className="text-[11px] font-bold text-white/80">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <footer className="mt-12 pt-8 border-t border-white/5 text-center">
                            <p className="text-[10px] text-white/20 uppercase tracking-tighter">
                                以終為始 • 始終如一 • 善向永續
                            </p>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
