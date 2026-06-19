import React, { useMemo } from 'react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';
import { View } from '@/types/core';
import { Users, Gavel, Scale, FileText, Shield, UserCheck, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const GovernanceStructurePage: React.FC = () => {
    const core = useMemo(() => ComponentCoreFactory.create('GovernanceStructurePage'), []);

    // Mock Data for Governance
    const BOARD_MEMBERS = [
        { name: 'Dr. Sarah Chen', role: 'Chairperson', type: 'Independent', since: '2022' },
        { name: 'James Sterling', role: 'CEO', type: 'Executive', since: '2020' },
        { name: 'Elena Rodriguez', role: 'Lead Independent Director', type: 'Independent', since: '2021' },
        { name: 'Akira Tanaka', role: 'Director', type: 'Non-Executive', since: '2023' },
    ];

    const COMMITTEES = [
        { name: 'Audit Committee', icon: Shield, members: 3, status: 'Active' },
        { name: 'Remuneration Committee', icon: Briefcase, members: 4, status: 'Active' },
        { name: 'ESG Committee', icon: Scale, members: 5, status: 'Active' },
        { name: 'Risk Committee', icon: AlertTriangle, members: 3, status: 'Active' },
    ];

    const POLICIES = [
        { name: 'Code of Ethics', status: 'Updated Feb 2026', version: 'v3.2' },
        { name: 'Whistleblower Policy', status: 'Active', version: 'v2.0' },
        { name: 'Anti-Corruption Policy', status: 'Review Pending', version: 'v1.5' },
    ];

    return (
        <StitchPageTemplate
            title="Governance Structure"
            subtitle="Corporate Governance Framework & Board Oversight"
            activeView={View.GOVERNANCE}
            breadcrumbs={[
                { label: 'ESG Services', href: '/services' },
                { label: 'Governance', href: '/services/governance' },
                { label: 'Structure', href: '#' },
            ]}
            headerAction={
                <button className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center gap-2">
                    <FileText size={14} />
                    VIEW CHARTER
                </button>
            }
        >
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                className="space-y-8 animate-fade-in"
            >
                {/* 1. Board Composition */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
                            <Users className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-light text-slate-200">Board of Directors</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {BOARD_MEMBERS.map((member, idx) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-all group"
                            >
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-900/20 transition-colors">
                                    <UserCheck size={20} className="text-slate-400 group-hover:text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-200 mb-1">{member.name}</h3>
                                <p className="text-sm text-cyan-400 mb-3">{member.role}</p>
                                <div className="flex justify-between items-center text-xs text-slate-500 font-mono border-t border-white/5 pt-3">
                                    <span>{member.type}</span>
                                    <span>Since {member.since}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 2. Board Committees */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-900/30 rounded-lg border border-amber-500/30">
                            <Gavel className="w-5 h-5 text-amber-400" />
                        </div>
                        <h2 className="text-xl font-light text-slate-200">Board Committees</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {COMMITTEES.map((comm, idx) => (
                            <div key={comm.name} className="p-4 bg-slate-900/30 border border-slate-800 rounded-lg flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded border border-slate-700">
                                        <comm.icon size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-300">{comm.name}</h4>
                                        <p className="text-[10px] text-slate-500">{comm.members} Members</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 text-[10px] rounded border border-emerald-500/20">
                                    {comm.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Policy Framework */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-violet-900/30 rounded-lg border border-violet-500/30">
                            <FileText className="w-5 h-5 text-violet-400" />
                        </div>
                        <h2 className="text-xl font-light text-slate-200">Key Policies</h2>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                        {POLICIES.map((policy, idx) => (
                            <div key={policy.name} className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors ${idx !== POLICIES.length - 1 ? 'border-b border-slate-800' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <FileText size={16} className="text-slate-500" />
                                    <span className="text-sm text-slate-300">{policy.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-mono">
                                    <span className="text-slate-500">{policy.version}</span>
                                    <span className={policy.status === 'Active' || policy.status.includes('Updated') ? 'text-emerald-500' : 'text-amber-500'}>
                                        {policy.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </StitchPageTemplate>
    );
};

// Start Icon for Risk Committee mock
import { AlertTriangle } from 'lucide-react';

export default GovernanceStructurePage;
