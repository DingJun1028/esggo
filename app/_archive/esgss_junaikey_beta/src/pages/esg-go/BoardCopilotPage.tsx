import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, TrendingUp, AlertTriangle, Gavel, CheckCircle2, XCircle, ArrowRight, DollarSign } from 'lucide-react';
import { boardCopilotService } from '@/services/esg-go/BoardCopilotService';
import { BoardBrief } from '@/types/esg_go_schema';

const BoardCopilotPage: React.FC = () => {
    const [brief, setBrief] = useState<BoardBrief | null>(null);

    useEffect(() => {
        setBrief(boardCopilotService.getLatestBrief());
    }, []);

    if (!brief) return null;

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-[#63a6b0]/30 p-8 pb-32">
            <header className="max-w-5xl mx-auto mb-10 border-b border-white/5 pb-8">
                <div className="flex items-center gap-3 text-[#FFD700] mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Bot size={12} /> Executive Decision Support
                    </span>
                    <span className="text-xs font-mono opacity-60 text-slate-400">| {brief.period}</span>
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tight italic">
                    Board <span className="text-[#FFD700]">Copilot</span> Lite <br />
                    <span className="text-2xl text-white/40 not-italic font-light">決策輔助摘要</span>
                </h1>
            </header>

            <main className="max-w-5xl mx-auto">
                {/* 1. Decision Request (The "Ask") */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2rem] p-8 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 text-white/5 rotate-12 -translate-y-4 translate-x-4">
                        <Bot size={200} />
                    </div>

                    <h2 className="text-sm font-bold text-[#FFD700] uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                        <Gavel size={16} /> Decision Required
                    </h2>

                    <h3 className="text-3xl font-black italic text-white mb-6 relative z-10 max-w-2xl leading-tight">
                        {brief.decisionRequest.title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 mb-8">
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Context</h4>
                            <p className="text-sm leading-relaxed text-slate-200">{brief.decisionRequest.context}</p>
                        </div>
                        <div className="bg-[#FFD700]/10 p-6 rounded-2xl border border-[#FFD700]/20">
                            <h4 className="text-xs font-bold text-[#FFD700] uppercase mb-2">AI Recommendation</h4>
                            <p className="text-lg font-bold leading-relaxed text-[#FFD700]">{brief.decisionRequest.recommendation}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <button className="px-8 py-4 bg-[#FFD700] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#FFC000] transition-colors shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center gap-2">
                            <CheckCircle2 size={18} /> Approve
                        </button>
                        <button className="px-8 py-4 bg-white/5 text-slate-300 font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10">
                            <XCircle size={18} /> Reject
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                        <p className="text-xs text-rose-400 font-medium flex items-center gap-2">
                            <AlertTriangle size={12} /> <span className="uppercase font-bold">Risk if ignored:</span> {brief.decisionRequest.implication_if_ignored}
                        </p>
                    </div>
                </motion.div>

                {/* 2. Data Lenses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Financial Lens */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6"
                    >
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                            <DollarSign className="text-emerald-400" /> Financial Impact
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-sm text-slate-400">Cost Avoidance</span>
                                <span className="text-sm font-bold text-emerald-400">{brief.financialImpact.cost_avoidance}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-sm text-slate-400">Investment Required</span>
                                <span className="text-sm font-bold text-white">{brief.financialImpact.investment_required}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate-400">ROI Projection</span>
                                <span className="text-xl font-black italic text-emerald-400">{brief.financialImpact.roi_projection}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Compliance Lens */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6"
                    >
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                            <TrendingUp className="text-blue-400" /> Compliance Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-sm text-slate-400">Overall Risk Level</span>
                                <span className={`px-2 py-1 rounded text-xs font-black uppercase ${brief.complianceStatus.overall_risk_level === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {brief.complianceStatus.overall_risk_level} Risk
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-sm text-slate-400">Critical Gaps</span>
                                <span className="text-sm font-bold text-white">{brief.complianceStatus.critical_gaps} items</span>
                            </div>
                            <div className="py-3">
                                <span className="text-sm text-slate-400 block mb-2">Upcoming Deadlines</span>
                                {brief.complianceStatus.upcoming_deadlines.map((deadline, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-blue-300 mb-1">
                                        <ArrowRight size={10} /> {deadline}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default BoardCopilotPage;
