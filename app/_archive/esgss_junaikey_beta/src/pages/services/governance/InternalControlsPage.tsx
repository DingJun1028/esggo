import React, { useMemo } from 'react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { View } from '@/types/core';
import { BentoItem } from '@/components/ui/BentoGrid';
import { ShieldCheck, Lock, Activity, Users, FileCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InternalControlsPage: React.FC = () => {
    const core = useMemo(() => ComponentCoreFactory.create('InternalControlsPage'), []);

    const AUDIT_DATA = [
        { day: 'Mon', checks: 120, threats: 2 },
        { day: 'Tue', checks: 145, threats: 0 },
        { day: 'Wed', checks: 132, threats: 1 },
        { day: 'Thu', checks: 160, threats: 3 },
        { day: 'Fri', checks: 155, threats: 1 },
        { day: 'Sat', checks: 80, threats: 0 },
        { day: 'Sun', checks: 65, threats: 0 },
    ];

    const SOD_MATRIX = [
        { role: 'Admin', access: 'Full', critical: true, conflict: 'None' },
        { role: 'Finance', access: 'Write', critical: true, conflict: 'Approval Redundancy Needed' },
        { role: 'Auditor', access: 'Read-Only', critical: false, conflict: 'None' },
    ];

    return (
        <StitchBentoTemplate
            title="Internal Controls"
            subtitle="Segregation of Duties & Automated Audit Trails"
            activeView={View.GOVERNANCE}
            breadcrumbs={[
                { label: 'ESG Services', href: '/services' },
                { label: 'Governance', href: '/services/governance' },
                { label: 'Controls', href: '#' },
            ]}
        >
            {/* 1. Control Effectiveness Chart (Large) */}
            <BentoItem
                colSpan={8}
                rowSpan={2}
                title="Control Effectiveness Monitor"
                subtitle="Automated checks vs. detected anomalies"
                icon={<Activity size={20} />}
            >
                <div className="h-full w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={AUDIT_DATA}>
                            <defs>
                                <linearGradient id="colorChecks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="checks" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorChecks)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </BentoItem>

            {/* 2. Key Metrics (Small) */}
            <BentoItem
                colSpan={4}
                title="Active Controls"
                icon={<ShieldCheck size={20} />}
            >
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-emerald-400">142</span>
                    <span className="text-sm text-slate-500 mb-2">/ 150 Active</span>
                </div>
                <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%]" />
                </div>
            </BentoItem>

            <BentoItem
                colSpan={4}
                title="User Access Reviews"
                icon={<Users size={20} />}
            >
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-cyan-400">98%</span>
                    <span className="text-sm text-slate-500 mb-2">Reviewed</span>
                </div>
                <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full w-[98%]" />
                </div>
            </BentoItem>

            {/* 3. SoD Matrix (Medium) */}
            <BentoItem
                colSpan={12}
                title="Segregation of Duties (SoD) Matrix"
                subtitle="Permissions conflict analysis"
                icon={<Lock size={20} />}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Access Level</th>
                                <th className="px-6 py-3">Critical Asset</th>
                                <th className="px-6 py-3">Conflict Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SOD_MATRIX.map((row) => (
                                <tr key={row.role} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-200">{row.role}</td>
                                    <td className="px-6 py-4">{row.access}</td>
                                    <td className="px-6 py-4">
                                        {row.critical ? (
                                            <span className="text-amber-400 flex items-center gap-1">
                                                <Lock size={12} /> Yes
                                            </span>
                                        ) : 'No'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.conflict !== 'None' ? (
                                            <span className="text-red-400 bg-red-900/20 px-2 py-1 rounded text-xs border border-red-500/20">{row.conflict}</span>
                                        ) : (
                                            <span className="text-emerald-400 flex items-center gap-1">
                                                <FileCheck size={12} /> Clean
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </BentoItem>
        </StitchBentoTemplate>
    );
};

export default InternalControlsPage;
