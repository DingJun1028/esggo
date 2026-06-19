import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCircle,
    Cpu,
    Zap,
    Shield,
    MessageSquare,
    Database,
    Activity,
    Search,
    Lock,
    Eye,
    ChevronRight,
    Sparkles,
    BookOpen,
    Target
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtocolModal } from '@/components/omni/ProtocolModal';
import { useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const PersonalityRadar: React.FC = () => {
    // Mock personality data
    const points = [
        { label: 'Precision', val: 98 },
        { label: 'Creativity', val: 45 },
        { label: 'Empathy', val: 72 },
        { label: 'Efficiency', val: 89 },
        { label: 'Resilience', val: 65 },
    ];

    return (
        <div className="relative w-full aspect-square flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] opacity-20">
                {[20, 40, 60, 80, 100].map(r => (
                    <circle key={r} cx="50" cy="50" r={r / 2} fill="none" stroke="currentColor" strokeWidth="0.5" />
                ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/20 blur-xl animate-pulse" />
                <UserCircle size={40} className="text-[#8b5cf6] relative z-10" />
            </div>
            {points.map((p, i) => {
                const angle = (i * (360 / points.length)) - 90;
                const x = 50 + 40 * Math.cos(angle * (Math.PI / 180));
                const y = 50 + 40 * Math.sin(angle * (Math.PI / 180));
                return (
                    <div key={p.label} className="absolute text-[8px] font-black uppercase tracking-tighter opacity-40 text-center"
                        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                        {p.label}<br /><span className="text-[#8b5cf6]">{p.val}%</span>
                    </div>
                );
            })}
        </div>
    );
};

const AgenticTwinPage: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t, language } = useLanguage();
    const isDark = resolvedMode === 'dark';
    const [selectedTab, setSelectedTab] = useState('soul');

    const [modal, setModal] = useState({ isOpen: false, type: 'TRANSPARENT' as any, title: '', content: '' });

    const open5T = (type: any, title: string, content: string) => {
        setModal({ isOpen: true, type, title, content });
    };

    return (
        <MainLayout activeView="avatar" onViewChange={() => { }}>
            <div className={`min-h-screen pt-24 pb-12 px-8 ${isDark ? 'bg-[#050810] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans relative overflow-hidden`}>

                {/* 5T Protocol Modal */}
                <ProtocolModal
                    isOpen={modal.isOpen}
                    onClose={() => setModal({ ...modal, isOpen: false })}
                    type={modal.type}
                    title={modal.title}
                    content={modal.content}
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <header className="mb-12">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-[#8b5cf6]/20 rounded-2xl text-[#8b5cf6]">
                                    <Sparkles size={32} className="animate-pulse" />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                                        Agentic <span className="text-[#8b5cf6]">Twin</span>
                                    </h1>
                                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">The Second Self • 5T Certified Agent</p>
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    <div className="grid grid-cols-12 gap-8 items-start">

                        {/* Left: Soul Chamber & Radar */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            <div className={`rounded-[32px] p-8 border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'} shadow-2xl relative overflow-hidden`}>
                                <div className="absolute top-4 right-4 text-[9px] font-mono opacity-20">UUID: AL-99-X-TR</div>
                                <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
                                    <Target size={18} className="text-[#8b5cf6]" />
                                    Soul Radar
                                </h2>
                                <PersonalityRadar />
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold opacity-40 uppercase mb-1">Spirit Rank</p>
                                        <p className="text-lg font-black text-[#8b5cf6]">Archmage XII</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold opacity-40 uppercase mb-1">Resonance</p>
                                        <p className="text-lg font-black text-emerald-400">98.2%</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-6 rounded-[24px] bg-gradient-to-r from-[#8b5cf6] to-indigo-600 text-white font-black uppercase tracking-[0.2em] shadow-lg shadow-[#8b5cf6]/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                                <Cpu size={20} />
                                Trigger Soul Sync
                            </button>
                        </div>

                        {/* Right: Functional Tabs / Bento Hub */}
                        <div className="col-span-12 lg:col-span-8">
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {['soul', 'forge', 'agency', 'converter'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`py-4 rounded-2xl border font-black uppercase text-[10px] tracking-widest transition-all ${selectedTab === tab
                                            ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6] shadow-inner'
                                            : isDark ? 'bg-slate-900/40 border-white/5 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
                                            }`}
                                    >
                                        {tab.replace(/^\w/, c => c.toUpperCase())}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {selectedTab === 'soul' && (
                                        <>
                                            <div className={`col-span-2 rounded-[28px] p-6 border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200'} relative overflow-hidden`}>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h3 className="text-lg font-black italic">Soul Imprinting Ceremony</h3>
                                                        <p className="text-xs opacity-50">Waking up the spirit from zero data.</p>
                                                    </div>
                                                    <button onClick={() => open5T('TRANSPARENT', 'Algorithm: Soul Mapping', 'Interactive context mapping based on NLP frequency.')} className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                                                        <Shield size={16} />
                                                    </button>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-slate-950/50 border border-white/5 font-mono text-xs text-indigo-300 leading-relaxed mb-4">
                                                    <span className="text-slate-600 italic">// Dialogue Stream: ID_9921</span><br />
                                                    &gt; How would you handle a supply chain conflict under CBAM?<br />
                                                    &gt; <span className="text-emerald-400">"Prioritize transparency and local sourcing resilience."</span><br />
                                                    <span className="text-amber-500">Mapping Intent: 94% Alignment</span>
                                                </div>
                                                <div className="flex gap-4">
                                                    <input className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#8b5cf6]/50" placeholder="Type to resonate..." />
                                                    <button className="px-4 py-2 bg-[#8b5cf6] rounded-xl text-xs font-black uppercase">Send</button>
                                                </div>
                                            </div>
                                            <div className={`p-6 rounded-[28px] border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Lock size={16} /></div>
                                                    <h4 className="font-bold text-sm">Prompt Sanctum</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {['The Ethics Core', 'Strategic Tone-I', 'EU Regulatory Map'].map(p => (
                                                        <li key={p} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5 group">
                                                            <span className="text-[10px] font-bold opacity-60">{p}</span>
                                                            <div className="flex gap-2">
                                                                <button className="p-1 opacity-0 group-hover:opacity-100"><Activity size={12} /></button>
                                                                <button className="p-1 opacity-40 hover:opacity-100"><Shield size={12} className="text-amber-500" /></button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className={`p-6 rounded-[28px] border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><BookOpen size={16} /></div>
                                                    <h4 className="font-bold text-sm">Knowledge Vault</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Case-01', 'ISO-14064', 'GRI-302', 'CBAM-Ref'].map(k => (
                                                        <span key={k} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black tracking-widest border border-white/5 opacity-60">#{k}</span>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-white/5">
                                                    <p className="text-[10px] opacity-40">12 Fragments stored in UUID-AL-99</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedTab === 'forge' && (
                                        <div className="col-span-2 p-12 text-center opacity-20 italic">
                                            <Zap size={64} className="mx-auto mb-4" />
                                            <p className="font-black uppercase tracking-[0.4em]">Skill Forge Initializing...</p>
                                        </div>
                                    )}
                                    {/* Additional tabs logic for Agency and Converter... */}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Footer Ticker */}
                <div className={`fixed bottom-0 left-0 right-0 h-10 border-t ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-slate-200'} backdrop-blur-xl z-10 flex items-center px-6 overflow-hidden`}>
                    <div className="flex gap-12 font-mono text-[8px] font-bold uppercase tracking-[0.5em] animate-marquee whitespace-nowrap opacity-40">
                        <span>AGENT_ACTIVE_UUID_AL99XTR</span>
                        <span className="text-[#8b5cf6]">5T_TRACKING_ENABLED</span>
                        <span>SOUL_RESONANCE_STABLE</span>
                        <span className="text-emerald-500">TRUST_LOCKED_256</span>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AgenticTwinPage;
