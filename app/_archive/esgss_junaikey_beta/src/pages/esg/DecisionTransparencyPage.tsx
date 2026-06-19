import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Fingerprint,
    Share2,
    ShieldCheck,
    Clock,
    Users,
    CheckCircle2,
    Lock,
    ExternalLink,
    MessageSquareQuote
} from 'lucide-react';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

const DECISION_LOGS = [
    { id: '1', title: 'Carbon Neutrality Roadmap 2030', date: '2026-02-01', status: 'Anchored', categories: ['Strategy', 'Climate'], participants: 12, evidence: 'sha256: 8a3f...9e21' },
    { id: '2', title: 'New Supplier Human Rights Audit', date: '2026-01-25', status: 'Verifying', categories: ['Supply Chain', 'Social'], participants: 5, evidence: 'Pending' },
    { id: '3', title: 'Circular Water Recycling Investment', date: '2026-01-18', status: 'Anchored', categories: ['Environmental', 'Capex'], participants: 8, evidence: 'sha256: 41d2...b4c2' },
];

/**
 * ?–ï? DecisionTransparencyPage
 * 
 * Implements "Transparent Logic" interface with Liquid Glass aesthetics.
 * 5T Protocol: Core Identity for traceability.
 */
const DecisionTransparencyPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('DecisionTransparencyPage'), []);

    return (
        <EsgServiceLayout title="Decision Transparency Hub" activeId="transparency" progress={75}>
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="DecisionTransparencyPage"
                className="animate-fade-in"
            >
                {/* 1. Trust Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="liquid-glass p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Lock size={60} />
                        </div>
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                            <ShieldCheck size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Anchored Decisions</span>
                        </div>
                        <div className="text-4xl font-light text-white mb-2">128</div>
                        <p className="text-xs text-slate-500 font-mono tracking-tight group-hover:text-emerald-400/70 transition-colors">100% Immutable Evidence Integrity</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="liquid-glass p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users size={60} />
                        </div>
                        <div className="flex items-center gap-3 text-blue-400 mb-4">
                            <Share2 size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Collaborative Nodes</span>
                        </div>
                        <div className="text-4xl font-light text-white mb-2">452</div>
                        <p className="text-xs text-slate-500 font-mono tracking-tight group-hover:text-blue-400/70 transition-colors">Across 12 Global Departments</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="liquid-glass p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Fingerprint size={60} />
                        </div>
                        <div className="flex items-center gap-3 text-amber-400 mb-4">
                            <Clock size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Avg. Audit Time</span>
                        </div>
                        <div className="text-4xl font-light text-white mb-2">1.2s</div>
                        <p className="text-xs text-slate-500 font-mono tracking-tight group-hover:text-amber-400/70 transition-colors">Real-time Multi-signature Validation</p>
                    </motion.div>
                </div>

                {/* 2. Timeline Visualization */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-light text-white">Transparency Timeline</h2>
                        <button className="text-xs font-mono text-slate-500 hover:text-white flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5">
                            VIEW FULL EVIDENCE CHAIN <ExternalLink size={12} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {DECISION_LOGS.map((log, index) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="liquid-glass px-6 py-5 hover:bg-[#00FFFF]/5 hover:border-[#00FFFF]/20 transition-all relative overflow-hidden group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-white/5 ${log.status === 'Anchored' ? 'border-emerald-500/20 text-emerald-400' : 'border-amber-500/20 text-amber-400 text-opacity-80'}`}>
                                            {log.status === 'Anchored' ? <CheckCircle2 size={18} /> : <Clock size={18} className="animate-pulse" />}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-medium text-slate-200 group-hover:text-white transition-colors mb-1">{log.title}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {log.categories.map(cat => (
                                                    <span key={cat} className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-500">{cat}</span>
                                                ))}
                                                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border border-white/10 text-slate-400">{log.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-4 text-xs font-mono">
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Users size={12} /> {log.participants} Nodes
                                            </div>
                                            <div className="text-slate-700">|</div>
                                            <div className={`flex items-center gap-1 font-bold ${log.status === 'Anchored' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {log.status}
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-slate-500 bg-black/40 px-3 py-1 rounded border border-white/5 font-mono group-hover:text-slate-400 group-hover:border-[#00FFFF]/20 transition-colors flex items-center gap-2">
                                            <Fingerprint size={10} />
                                            Hash: {log.evidence}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 3. Stakeholder Feedback Integration Mockup */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 liquid-glass p-8 flex flex-col">
                        <h2 className="text-xl font-light text-white mb-8">Integrated Feedback Loops</h2>
                        <div className="flex-1 space-y-4">
                            <div className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-white/10">
                                    <span className="text-xs font-bold text-blue-300">RA</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-white">NGO Rep - River Alliance</span>
                                        <span className="text-[10px] text-slate-500 font-mono border border-white/10 px-1.5 rounded">2h ago</span>
                                    </div>
                                    <p className="text-sm text-slate-400 italic leading-relaxed">&quot;The transparency in your circular water recycling investment is commendable. We look forward to seeing the quarterly impact data.&quot;</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all opacity-70">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0 border border-white/10">
                                    <span className="text-xs font-bold text-emerald-300">II</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-white">Institutional Investor</span>
                                        <span className="text-[10px] text-slate-500 font-mono border border-white/10 px-1.5 rounded">1d ago</span>
                                    </div>
                                    <p className="text-sm text-slate-400 italic leading-relaxed">&quot;Verified evidence of carbon neutrality roadmap is essential for our Q1 allocation assessment.&quot;</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="liquid-glass-strong p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 relative z-10 box-glow-emerald" style={{ color: ESG_THEME.PRIMARY }}>
                            <MessageSquareQuote size={32} className="text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-light text-white mb-2 relative z-10">Stakeholder Sentiment</h3>
                        <div className="text-4xl font-light text-emerald-400 mb-4 relative z-10">Positive</div>
                        <p className="text-xs text-slate-500 leading-relaxed relative z-10">Based on 1,200+ multi-channel engagement points analyzed by Omni Muse.</p>
                    </div>
                </div>
            </div>
        </EsgServiceLayout>
    );
};

export default DecisionTransparencyPage;

