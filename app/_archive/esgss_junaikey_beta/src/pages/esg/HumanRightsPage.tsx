import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert,
    Globe,
    Activity,
    CheckCircle,
    Users,
    ArrowUpRight,
    MapPin,
    Search,
    Download
} from 'lucide-react';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

const HUMAN_RIGHTS_SUMMARY = [
    { label: 'Identified Risks', value: '12', trend: '+3 New', color: '#FF9800' },
    { label: 'Risk Score', value: '68/100', trend: '??5 pts', color: '#F44336' },
    { label: 'Remediation', value: '75%', trend: '??10% MoM', color: '#4ADE80' },
];

const GEOGRAPHIC_RISKS = [
    { region: 'East Asia', level: 'High', color: '#F44336', description: 'Supply chain transparency in raw materials.' },
    { region: 'Southeast Asia', level: 'Medium', color: '#FF9800', description: 'Working hours and overtime compliance.' },
    { region: 'Europe', level: 'Low', color: '#4ADE80', description: 'Regular assessments complete.' },
];

/**
 * ?? HumanRightsPage
 * 
 * Implements "Social Guardian" interface with Liquid Glass aesthetics.
 * 5T Protocol: Core Identity for traceability.
 */
const HumanRightsPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('HumanRightsPage'), []);

    return (
        <EsgServiceLayout title="Human Rights Due Diligence" activeId="rights" progress={60}>

            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="HumanRightsPage"
                className="animate-fade-in"
            >
                {/* 1. Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {HUMAN_RIGHTS_SUMMARY.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="liquid-glass p-8 backdrop-blur-md group hover:border-[#00FFFF]/30 transition-all"
                        >
                            <h3 className="text-slate-400 text-sm mb-2">{stat.label}</h3>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-light text-white leading-none">{stat.value}</span>
                                <span className="text-[10px] font-mono tracking-wider mb-1" style={{ color: stat.color }}>{stat.trend}</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-current opacity-40" style={{ backgroundColor: stat.color, width: '60%' }} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* 2. Geographic Heatmap Placeholder & Risk List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Globe Visualization - Liquid Glass Strong */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="liquid-glass-strong p-8 flex flex-col relative overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h2 className="text-xl font-light text-white">Global Risk Heatmap</h2>
                            <Globe className="text-slate-500" size={20} />
                        </div>

                        <div className="flex-1 relative bg-[#020617]/40 rounded-2xl overflow-hidden p-6 flex items-center justify-center border border-white/5">
                            {/* Circle Represents Map */}
                            <div className="w-48 h-48 rounded-full border border-dashed border-white/10 flex items-center justify-center relative">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-40 h-40 rounded-full bg-[#00FFFF]/10"
                                />
                                <div className="absolute top-10 right-10 flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#f44336] animate-pulse" />
                                    <span className="text-[8px] font-mono mt-1 text-red-400">ASIA</span>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2">
                                {GEOGRAPHIC_RISKS.map(item => (
                                    <div key={item.region} className="p-3 bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm">
                                        <div className="text-[9px] text-slate-500 uppercase font-mono mb-1">{item.region}</div>
                                        <div className="text-xs font-bold" style={{ color: item.color }}>{item.level}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Remediation Roadmap - Liquid Glass */}
                    <div className="liquid-glass p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-light text-white">Remediation Roadmap</h2>
                            <Activity className="text-emerald-400" size={20} />
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Supplier Code of Conduct Training', progress: 90, status: 'On Track' },
                                { title: 'Migrant Labor Recruitment Review', progress: 45, status: 'Active' },
                                { title: 'Grievance Mechanism Accessibility', progress: 15, status: 'Discovery' },
                                { title: 'Annual Modern Slavery Statement', progress: 100, status: 'Complete' },
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl hover:bg-white/5 transition-all group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-slate-200 group-hover:text-white transition-colors">{item.title}</span>
                                        <span className="text-[10px] font-mono text-slate-500">{item.status}</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.progress}%` }}
                                            className="h-full bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Detailed Audit Trail - Liquid Glass */}
                <div className="liquid-glass p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-light text-white">Due Diligence Audit Trail</h2>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-[#00FFFF] transition-colors" size={14} />
                                <input className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#00FFFF]/50 transition-colors" placeholder="Search audit logs..." />
                            </div>
                            <button className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white transition-colors glass-edge-light px-3 py-1.5 rounded-lg">
                                <Download size={14} /> EXPORT
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { date: '2026-02-02', actor: 'Alice Wang (Compliance)', action: 'Approved Risk Assessment for Supplier A', type: 'Approval' },
                            { date: '2026-01-30', actor: 'System (AI)', action: 'Flagged potential anomaly in overtime data for Region B', type: 'Alert' },
                            { date: '2026-01-15', actor: 'Bob Chen (Auditor)', action: 'Uploaded on-site inspection report for Vendor C', type: 'Document' },
                        ].map((log, idx) => (
                            <div key={idx} className="flex gap-4 p-4 items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                    {log.type === 'Alert' ? <ShieldAlert size={18} className="text-amber-500" /> : <Users size={18} className="text-slate-500 group-hover:text-white transition-colors" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-200">{log.actor}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">{log.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-400">{log.action}</p>
                                </div>
                                <ArrowUpRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </EsgServiceLayout>
    );
};

export default HumanRightsPage;

