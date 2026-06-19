import React, { useMemo, useState } from 'react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { StitchBentoTemplate } from '@/components/layout/StitchBentoTemplate';
import { View } from '@/types/core';
import { BentoItem } from '@/components/ui/BentoGrid';
import { RiskMatrix5x5 } from '@/components/climate/RiskMatrix5x5';
import { ShieldAlert, TrendingUp, Wind, CheckCircle2, AlertTriangle, Zap, Server, BadgeDollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RISK_STATS = [
    { label: 'Critical Risks', value: '5', color: 'text-red-500', bg: 'bg-red-500/10', icon: ShieldAlert },
    { label: 'Risk Score', value: '68/100', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: TrendingUp },
    { label: 'Total Exposure', value: '$24.5M', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: BadgeDollarSign },
    { label: 'Mitigation Rate', value: '82%', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: CheckCircle2 },
];

const ENTERPRISE_RISKS = [
    { id: '1', title: 'Supply Chain Flood Risk', type: 'Climate (Physical)', severity: 'High', likelihood: 'Medium-High', status: 'Monitoring', probability: 4, impact: 5 },
    { id: '2', title: 'Carbon Pricing Transition', type: 'Climate (Transition)', severity: 'Medium', likelihood: 'High', status: 'Mitigating', probability: 5, impact: 3 },
    { id: '3', title: 'Cyber Ransomware Attack', type: 'Cybersecurity', severity: 'Critical', likelihood: 'Medium', status: 'Active', probability: 3, impact: 5 },
    { id: '4', title: 'GDPR Non-Compliance', type: 'Regulatory', severity: 'High', likelihood: 'Low', status: 'Mitigating', probability: 2, impact: 5 },
    { id: '5', title: 'AI Model Hallucination', type: 'Technology', severity: 'Medium', likelihood: 'High', status: 'Monitoring', probability: 4, impact: 2 },
];

const SCENARIO_DATA = [
    { year: '2024', scenario15: 10, scenario20: 12, scenario40: 15 },
    { year: '2025', scenario12: 12, scenario20: 18, scenario40: 25 },
    { year: '2026', scenario15: 15, scenario20: 25, scenario40: 40 },
    { year: '2027', scenario15: 18, scenario20: 35, scenario40: 60 },
    { year: '2028', scenario15: 22, scenario20: 48, scenario40: 85 },
    { year: '2029', scenario15: 25, scenario20: 60, scenario40: 110 },
    { year: '2030', scenario15: 28, scenario20: 75, scenario40: 145 },
];

const RiskManagementPage: React.FC = () => {
    const core = useMemo(() => ComponentCoreFactory.create('RiskManagementPage'), []);
    const [selectedScenario, setSelectedScenario] = useState<'1.5°C' | '2.0°C' | '4.0°C'>('2.0°C');

    return (
        <StitchBentoTemplate
            title="Enterprise Risk Management"
            subtitle="Integrated Risk Monitoring & Scenario Analysis"
            activeView={View.GOVERNANCE}
            breadcrumbs={[
                { label: 'ESG Services', href: '/services' },
                { label: 'Governance', href: '/services/governance' },
                { label: 'Risk Management', href: '#' },
            ]}
        >
            {/* 1. Header Stats (integrated into Bento via small items) */}
            {RISK_STATS.map((stat, index) => (
                <BentoItem key={index} colSpan={3} title={stat.label} icon={<stat.icon size={16} className={stat.color} />}>
                    <div className="flex items-end justify-between mt-2">
                        <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={16} />
                        </div>
                    </div>
                </BentoItem>
            ))}

            {/* 2. Risk Matrix */}
            <BentoItem
                colSpan={6}
                rowSpan={2}
                title="Risk Matrix Heatmap"
                subtitle="Impact vs. Probability Distribution"
                icon={<AlertTriangle size={20} />}
            >
                <div className="h-full flex items-center justify-center p-4">
                    <RiskMatrix5x5 risks={ENTERPRISE_RISKS} />
                </div>
            </BentoItem>

            {/* 3. Scenario Analysis */}
            <BentoItem
                colSpan={6}
                rowSpan={2}
                title={`Exposure Analysis: ${selectedScenario}`}
                subtitle="Financial Impact Projection (USD Millions)"
                icon={<TrendingUp size={20} />}
                headerAction={
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        {['1.5°C', '2.0°C', '4.0°C'].map((scenario) => (
                            <button
                                key={scenario}
                                onClick={() => setSelectedScenario(scenario as any)}
                                className={`px-2 py-1 text-[10px] rounded-md transition-all ${selectedScenario === scenario
                                    ? 'bg-slate-700 text-white shadow font-medium'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {scenario}
                            </button>
                        ))}
                    </div>
                }
            >
                <div className="h-full w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={SCENARIO_DATA}>
                            <defs>
                                <linearGradient id="colorScenario" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Area
                                type="monotone"
                                dataKey={
                                    selectedScenario === '1.5°C' ? 'scenario15' :
                                        selectedScenario === '2.0°C' ? 'scenario20' : 'scenario40'
                                }
                                stroke="#00FFFF"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorScenario)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </BentoItem>

            {/* 4. Filterable Risk List */}
            <BentoItem
                colSpan={12}
                title="Enterprise Risk Register"
                subtitle="Cross-domain risk monitoring"
                icon={<ShieldAlert size={20} />}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3">Risk Title</th>
                                <th className="px-6 py-3">Domain</th>
                                <th className="px-6 py-3">Severity</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ENTERPRISE_RISKS.map((risk) => (
                                <tr key={risk.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-200">{risk.title}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {risk.type.includes('Climate') && <Wind size={14} className="text-emerald-400" />}
                                            {risk.type.includes('Cyber') && <Server size={14} className="text-blue-400" />}
                                            {risk.type.includes('AI') && <Zap size={14} className="text-violet-400" />}
                                            {risk.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${risk.severity === 'Critical' ? 'bg-red-900/30 text-red-500 border border-red-500/20' :
                                            risk.severity === 'High' ? 'bg-orange-900/30 text-orange-500 border border-orange-500/20' :
                                                'bg-amber-900/30 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {risk.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${risk.status === 'Active' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
                                            {risk.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
                                            View Logs
                                        </button>
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

export default RiskManagementPage;

