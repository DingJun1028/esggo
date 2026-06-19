import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Heart,
    Coins,
    BarChart,
    Calendar,
    ArrowRight,
    Search,
    MessageCircle,
    HandHelping
} from 'lucide-react';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

const COMMUNITY_STATS = [
    { label: 'Total Participants', value: '5,280', trend: '+23% YoY', icon: Users, color: '#00FFFF' },
    { label: 'Total Investment', value: '$2.5M', trend: '+15% YoY', icon: Coins, color: '#4CAF50' },
    { label: 'Satisfaction', value: '4.5/5', trend: '↑ 0.3', icon: Heart, color: '#F44336' },
];

const INVESTMENT_DATA = [
    { project: 'Scholarship Program', type: 'Education', amount: '$50,000', beneficiaries: 200, status: 'Active' },
    { project: 'Environmental Greening', type: 'Environment', amount: '$30,000', beneficiaries: 500, status: 'Active' },
    { project: 'Medical Assistance', type: 'Health', amount: '$20,000', beneficiaries: 150, status: 'Completed' },
    { project: 'Employment Training', type: 'Economy', amount: '$15,000', beneficiaries: 50, status: 'Planned' },
];

/**
 * 🤝 CommunityEngagementPage
 * 
 * Implements "Community Nexus" interface with Liquid Glass aesthetics.
 * 5T Protocol: Core Identity for traceability.
 */
const CommunityEngagementPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('CommunityEngagementPage'), []);

    return (
        <EsgServiceLayout title="Community Engagement Center" activeId="community" progress={80}>
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="CommunityEngagementPage"
                className="animate-fade-in"
            >
                {/* 1. Impact Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {COMMUNITY_STATS.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="liquid-glass p-8 group hover:border-[#00FFFF]/30 transition-all relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-white/5" style={{ color: stat.color }}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{stat.trend}</span>
                            </div>
                            <h3 className="text-slate-400 text-sm mb-1">{stat.label}</h3>
                            <div className="text-4xl font-light text-white">{stat.value}</div>

                            {/* Subtle background decoration */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <stat.icon size={96} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* 2. Engagement Distribution & Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <motion.div className="liquid-glass p-8">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-light text-white">Participation Type Distribution</h2>
                            <BarChart className="text-slate-500" size={20} />
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Community Forum', percentage: 25, color: '#00FFFF' },
                                { label: 'Donation Events', percentage: 20, color: '#4CAF50' },
                                { label: 'Workshops', percentage: 15, color: '#FF9800' },
                                { label: 'Others', percentage: 40, color: '#94A3B8' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-300">{item.label}</span>
                                        <span className="text-slate-500 font-mono">{item.percentage}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            className="h-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div className="liquid-glass p-8">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-light text-white">Activity Timeline</h2>
                            <Calendar className="text-slate-500" size={20} />
                        </div>

                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                            {[
                                { date: '03/15', title: 'Community Forum (Digital Inclusion)', type: 'Dialogue' },
                                { date: '03/22', title: 'Volunteer Day: River Cleanup', type: 'Environment' },
                                { date: '04/01', title: 'Scholarship Award Ceremony', type: 'Education' },
                                { date: '04/10', title: 'Factory Open Day (Region Alpha)', type: 'Tour' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 relative group">
                                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center shrink-0 z-10 group-hover:border-[#00FFFF] transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00FFFF]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-mono text-[#00FFFF] mb-1">{item.date}</div>
                                        <h4 className="text-sm text-slate-200 mb-1">{item.title}</h4>
                                        <div className="text-[10px] uppercase font-mono text-slate-500">{item.type}</div>
                                    </div>
                                    <ArrowRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* 3. Community Investment Details */}
                <motion.div className="liquid-glass p-8 mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-light text-white">Community Investment Project Detail</h2>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-[#00FFFF] transition-colors" size={14} />
                                <input className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#00FFFF]/50 transition-colors" placeholder="Filter projects..." />
                            </div>
                            <button className="px-4 py-1.5 bg-[#00FFFF]/10 text-[#00FFFF] text-xs font-bold rounded-lg border border-[#00FFFF]/20 hover:bg-[#00FFFF]/20 transition-all">
                                + NEW INVESTMENT
                            </button>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                                    <th className="pb-4 pt-2">Project Name</th>
                                    <th className="pb-4 pt-2">Category</th>
                                    <th className="pb-4 pt-2">Amount</th>
                                    <th className="pb-4 pt-2">Beneficiaries</th>
                                    <th className="pb-4 pt-2">Status</th>
                                    <th className="pb-4 pt-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {INVESTMENT_DATA.map((item, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-5 text-slate-200 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                                                <HandHelping size={16} />
                                            </div>
                                            {item.project}
                                        </td>
                                        <td className="py-5 text-slate-400">{item.type}</td>
                                        <td className="py-5 font-mono text-[#00FFFF]">{item.amount}</td>
                                        <td className="py-5 text-slate-400 font-mono">{item.beneficiaries}</td>
                                        <td className="py-5">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right">
                                            <button className="text-slate-600 hover:text-white transition-colors">•••</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* 4. Satisfaction Survey Results */}
                <motion.div className="liquid-glass p-8">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#F44336]/10 flex items-center justify-center text-[#F44336]">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-light text-white">Satisfaction Survey Insights</h2>
                            <p className="text-xs text-slate-500">Aggregated from multiple community feedback loops</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Communication', score: 85 },
                            { label: 'Responsiveness', score: 78 },
                            { label: 'Quality', score: 82 },
                            { label: 'Impact', score: 72 },
                        ].map((item) => (
                            <div key={item.label} className="text-center group">
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                                        <motion.circle
                                            cx="50" cy="50" r="45" fill="none" stroke="#00FFFF" strokeWidth="5"
                                            strokeDasharray="283"
                                            initial={{ strokeDashoffset: 283 }}
                                            animate={{ strokeDashoffset: 283 - (283 * item.score) / 100 }}
                                            strokeLinecap="round"
                                            className="drop-shadow-[0_0_8px_rgba(0,255,255,0.5)] group-hover:stroke-[#4ADE80] transition-colors duration-500"
                                        />
                                        <text x="50" y="55" fontSize="18" textAnchor="middle" fill="white" className="font-mono">{item.score}%</text>
                                    </svg>
                                </div>
                                <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </EsgServiceLayout>
    );
};

export default CommunityEngagementPage;
