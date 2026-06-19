import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Users,
    BarChart3,
    Share2,
    MessageCircle,
    ArrowRight,
    Search,
    Filter,
    Clock,
    UserCheck,
    Quote
} from 'lucide-react';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

const ENGAGEMENT_SUMMARY = [
    { label: 'Active Activities', value: '48', trend: 'Ongoing', icon: Clock, color: '#f59e0b' },
    { label: 'Avg. Satisfaction', value: '82%', trend: '??4%', icon: MessageSquare, color: '#10b981' },
    { label: 'Coverage Area', value: '12', trend: 'Global', icon: Users, color: '#00FFFF' },
];

const FEEDBACK_LIST = [
    { id: '1', author: 'Local Government Rep', content: 'Positive feedback on the water infrastructure project. Transparency in reporting is key.', polarity: 'Positive', date: '2026-02-01' },
    { id: '2', author: 'Environmental Scientist', content: 'Need more detailed data points on the biodiversity impact of the new facility.', polarity: 'Neutral', date: '2026-01-28' },
    { id: '3', author: 'Supply Chain Partner', content: 'The new communication platform has significantly improved our audit response time.', polarity: 'Positive', date: '2026-01-15' },
];

/**
 * ?? StakeholderEngagementPage
 * 
 * Implements "Stakeholder Dialogue" interface with Liquid Glass aesthetics.
 * 5T Protocol: Core Identity for traceability.
 */
const StakeholderEngagementPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('StakeholderEngagementPage'), []);

    return (
        <EsgServiceLayout title="Stakeholder Engagement Center" activeId="stakeholder" progress={90}>
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="StakeholderEngagementPage"
                className="animate-fade-in"
            >
                {/* 1. Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {ENGAGEMENT_SUMMARY.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="liquid-glass p-8 group hover:border-[#00FFFF]/30 transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300" style={{ color: stat.color }}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-black/20 px-2 py-1 rounded">{stat.trend}</span>
                            </div>
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</h3>
                            <div className="text-4xl font-light text-white">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* 2. Sentiment Analysis & Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        theme-layer="liquid-glass"
                        className="liquid-glass p-8"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-light text-white flex items-center gap-3">
                                <BarChart3 className="text-[#00FFFF]" size={20} /> Sentiment Distribution
                            </h2>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="w-40 h-40 relative flex items-center justify-center">
                                <svg className="w-full h-full rotate-[-90deg]">
                                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray="283" strokeDashoffset="240" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                                </svg>
                                <div className="absolute text-3xl font-light text-white">82%</div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="group cursor-pointer">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <div className="flex items-center gap-2 font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 box-glow-emerald" /> Positive
                                        </div>
                                        <span className="text-slate-400 font-mono">75%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[75%] box-glow-emerald"></div>
                                    </div>
                                </div>
                                <div className="group cursor-pointer">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <div className="flex items-center gap-2 font-bold text-slate-300 group-hover:text-amber-400 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 box-glow-amber" /> Neutral
                                        </div>
                                        <span className="text-slate-400 font-mono">18%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[18%] box-glow-amber"></div>
                                    </div>
                                </div>
                                <div className="group cursor-pointer">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <div className="flex items-center gap-2 font-bold text-slate-300 group-hover:text-red-400 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-red-500" /> Critical
                                        </div>
                                        <span className="text-slate-400 font-mono">7%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-[7%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="liquid-glass p-8"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-light text-white flex items-center gap-3">
                                <Share2 className="text-[#00FFFF]" size={20} /> Engagement Channels
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 h-[calc(100%-4rem)]">
                            {[
                                { name: 'Direct Meetings', count: '124', icon: Users },
                                { name: 'Digital Portal', count: '856', icon: UserCheck },
                                { name: 'Phone Support', count: '45', icon: MessageCircle },
                                { name: 'Survey Forms', count: '1,240', icon: BarChart3 },
                            ].map((channel, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-[#63a6b0]/5 hover:border-[#00FFFF]/20 transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
                                    <div className="mb-3 p-3 rounded-xl bg-white/5 group-hover:bg-[#63a6b0]/20 transition-colors">
                                        <channel.icon size={20} className="text-slate-400 group-hover:text-[#63a6b0] transition-colors" />
                                    </div>
                                    <div className="text-xl font-light text-slate-200 group-hover:text-white mb-1">{channel.count}</div>
                                    <div className="text-[9px] text-slate-500 uppercase font-mono font-bold tracking-wider">{channel.name}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* 3. Feedback Stream */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="liquid-glass p-10 relative overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-light text-white flex items-center gap-3">
                            <MessageCircle className="text-[#00FFFF]" size={20} /> Live Feedback Stream
                        </h2>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-[#63a6b0] transition-colors" />
                                <input
                                    className="bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#63a6b0]/50 transition-all w-64"
                                    placeholder="Search feedback..."
                                />
                            </div>
                            <button className="p-2 rounded-xl hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-colors"><Filter size={18} /></button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {FEEDBACK_LIST.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-[#63a6b0]/5 hover:border-[#63a6b0]/20 transition-all relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                    <Quote size={60} />
                                </div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#00FFFF]/10 border border-[#63a6b0]/20 flex items-center justify-center text-[#00FFFF] font-bold shadow-[0_0_15px_rgba(99,166,176,0.1)]">
                                            {item.author[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-[#63a6b0] transition-colors">{item.author}</div>
                                            <div className="text-[10px] text-slate-500 font-mono uppercase bg-black/20 px-1.5 py-0.5 rounded inline-block mt-1">{item.date}</div>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${item.polarity === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.polarity === 'Positive' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                                        {item.polarity}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed italic pr-12 relative z-10 font-light border-l-2 border-white/5 pl-4 ml-2 group-hover:border-[#63a6b0]/30 transition-colors">
                                    "{item.content}"
                                </p>
                                <div className="mt-4 flex justify-end relative z-10">
                                    <button className="text-[10px] font-bold text-[#00FFFF] flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest opacity-80 hover:opacity-100">
                                        RESPOND <ArrowRight size={10} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </EsgServiceLayout>
    );
};

export default StakeholderEngagementPage;

