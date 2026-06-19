import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Search,
    Globe,
    FileText,
    Shield,
    Zap,
    Eye,
    BarChart3,
    Database,
    Link as LinkIcon,
    AlertCircle,
    ArrowUpRight
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtocolModal } from '@/components/omni/ProtocolModal';
import { useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const IntelligenceCard: React.FC<{ title: string, source: string, risk: 'low' | 'high' | 'medium', date: string, logic: string }> = ({ title, source, risk, date, logic }) => {
    const { resolvedMode } = useStitchTheme();
    const isDark = resolvedMode === 'dark';

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`p-6 rounded-[24px] border transition-all ${isDark ? 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60' : 'bg-white border-slate-200 hover:shadow-lg'
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${risk === 'high' ? 'bg-red-500/20 text-red-500' : risk === 'medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                    }`}>
                    Risk: {risk}
                </div>
                <span className="text-[9px] font-mono opacity-30">{date}</span>
            </div>
            <h4 className="font-black text-sm mb-2 leading-tight">{title}</h4>
            <div className="flex items-center gap-2 mb-4">
                <LinkIcon size={10} className="text-blue-400" />
                <span className="text-[10px] font-mono opacity-50 truncate">{source}</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-4">
                <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">Dr. Thoth Insight</p>
                <p className="text-[10px] leading-relaxed opacity-70 italic">"{logic}"</p>
            </div>
            <button className="flex items-center gap-1 text-[9px] font-black uppercase text-blue-400 hover:gap-2 transition-all">
                Full Dissection <ArrowUpRight size={12} />
            </button>
        </motion.div>
    );
};

const BusinessIntelligencePage: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { language } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const [modal, setModal] = useState({ isOpen: false, type: 'TRACEABLE' as any, title: '', content: '' });

    return (
        <MainLayout activeView="business_intel" onViewChange={() => { }}>
            <div className={`min-h-screen pt-24 pb-12 px-8 ${isDark ? 'bg-[#050810] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans relative`}>

                <ProtocolModal
                    isOpen={modal.isOpen}
                    onClose={() => setModal({ ...modal, isOpen: false })}
                    type={modal.type}
                    title={modal.title}
                    content={modal.content}
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <header className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                                Business <span className="text-blue-500">Intelligence</span>
                            </h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">Dr. Thoth's Intelligence Matrix</span>
                                <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[8px] font-bold text-blue-400">32 SOURCES ACTIVE</div>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-12 gap-6">
                        {/* Summary Bento */}
                        <div className={`col-span-12 lg:col-span-8 rounded-[32px] p-8 border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'} shadow-xl`}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black uppercase italic flex items-center gap-2">
                                    <Globe size={20} className="text-blue-500" />
                                    Global Regulatory Pulse
                                </h2>
                                <button onClick={() => setModal({ isOpen: true, type: 'TRACEABLE', title: 'Intelligence Sourcing', content: 'Aggregated via 32 verified ESG portals and official regulatory gazettes.' })} className="p-2 hover:bg-white/5 rounded-xl">
                                    <Shield size={18} className="text-blue-500" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">EU CBAM Compliance</p>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-blue-500" />
                                    </div>
                                    <p className="text-[9px] opacity-40 text-right font-mono">CRITICAL: JUNE 2026</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Supply Chain Resilience</p>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-emerald-500" />
                                    </div>
                                    <p className="text-[9px] opacity-40 text-right font-mono">OPTIMIZED</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Market Risk Index</p>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-amber-500" />
                                    </div>
                                    <p className="text-[9px] opacity-40 text-right font-mono">MODERATE</p>
                                </div>
                            </div>
                        </div>

                        {/* Dr. Thoth Mini Panel */}
                        <div className={`col-span-12 lg:col-span-4 rounded-[32px] p-8 border ${isDark ? 'bg-gradient-to-br from-blue-900/40 to-slate-900/60 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Zap size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold opacity-40 uppercase">Omni Agent</p>
                                    <h3 className="text-lg font-black italic">Dr. Thoth</h3>
                                </div>
                            </div>
                            <p className="text-xs leading-relaxed opacity-70 mb-6 font-medium">
                                "The essence of competition is not survival, but adaptation. Your competitors are shifting towards Scope 3 transparency. I suggest immediate audit of node 0x92..."
                            </p>
                            <button className="w-full py-4 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-colors">
                                Consult Strategy
                            </button>
                        </div>

                        {/* Intel Feed */}
                        <div className="col-span-12 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <IntelligenceCard
                                title="New EU CSRD Update: Reporting Threshold Reduced"
                                source="ec.europa.eu/finance"
                                risk="high"
                                date="2026.02.15"
                                logic="Affects mid-sized partners in your Tier 2 supply chain. Potential reporting gap detected."
                            />
                            <IntelligenceCard
                                title="Sustainability Tech Trend: Circular Water Logic"
                                source="reuters.com/sustainability"
                                risk="low"
                                date="2026.02.14"
                                logic="Efficiency gains for your Singapore node if implemented Q3."
                            />
                            <IntelligenceCard
                                title="Competitor A: Carbon Neutrality Claim Verified"
                                source="target-bench.io/competitor-a"
                                risk="medium"
                                date="2026.02.12"
                                logic="They used 5T protocol in their new audit. Market trust shift imminent."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default BusinessIntelligencePage;
