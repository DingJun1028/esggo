
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Thermometer,
    Wind,
    TrendingUp,
    ShieldAlert,
    Droplets,
    Zap,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { BentoGrid, BentoItem } from '@/components/ui/BentoGrid';
import { RiskMatrix5x5 } from '@/components/climate/RiskMatrix5x5';

// Mock Data
const RISK_STATS = [
    { label: 'Critical Risks', value: '3', color: 'text-red-500', bg: 'bg-red-500/10', icon: ShieldAlert },
    { label: 'Risk Score', value: '72/100', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: TrendingUp },
    { label: 'Scenario Impact', value: '$12.5M', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Wind },
    { label: 'Mitigation Rate', value: '85%', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: CheckCircle2 },
];

const CLIMATE_RISKS = [
    { id: '1', title: 'Supply Chain Flood Risk', type: 'Physical', severity: 'High', likelihood: 'Medium-High', horizon: 'Short-term', status: 'Monitoring', probability: 4, impact: 5 },
    { id: '2', title: 'Carbon Pricing Transition', type: 'Transition', severity: 'Medium', likelihood: 'High', horizon: 'Mid-term', status: 'Mitigating', probability: 5, impact: 3 },
    { id: '3', title: 'Energy Market Volatility', type: 'Transition', severity: 'Medium', likelihood: 'Medium', horizon: 'Long-term', status: 'Planned', probability: 3, impact: 3 },
    { id: '4', title: 'Water Scarcity', type: 'Physical', severity: 'High', likelihood: 'Low', horizon: 'Mid-term', status: 'Active', probability: 2, impact: 5 },
    { id: '5', title: 'Regulatory Compliance', type: 'Transition', severity: 'Low', likelihood: 'High', horizon: 'Short-term', status: 'Mitigating', probability: 4, impact: 2 },
];

const SCENARIO_DATA = [
    { year: '2024', scenario15: 10, scenario20: 12, scenario40: 15 },
    { year: '2025', scenario15: 12, scenario20: 18, scenario40: 25 },
    { year: '2026', scenario15: 15, scenario20: 25, scenario40: 40 },
    { year: '2027', scenario15: 18, scenario20: 35, scenario40: 60 },
    { year: '2028', scenario15: 22, scenario20: 48, scenario40: 85 },
    { year: '2029', scenario15: 25, scenario20: 60, scenario40: 110 },
    { year: '2030', scenario15: 28, scenario20: 75, scenario40: 145 },
];

const ClimateRiskPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('ClimateRiskPage'), []);
    const [selectedScenario, setSelectedScenario] = useState<'1.5°C' | '2.0°C' | '4.0°C'>('2.0°C');

    return (
        <EsgServiceLayout title="Climate Risk Analysis & TCFD Reporting" activeId="climate" progress={65}>
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="ClimateRiskPage"
                className="animate-fade-in pb-10"
            >
                {/* 1. Header Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {RISK_STATS.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* 2. Main Content - Bento Grid */}
                <BentoGrid>
                    {/* Risk Matrix */}
                    <BentoItem
                        colSpan={5}
                        rowSpan={2}
                        title="Risk Matrix (Impact vs. Probability)"
                        subtitle="Visualizing critical climate risks"
                        icon={<AlertTriangle size={20} />}
                    >
                        <div className="h-full flex items-center justify-center p-4">
                            <RiskMatrix5x5 risks={CLIMATE_RISKS} />
                        </div>
                    </BentoItem>

                    {/* Scenario Analysis Chart */}
                    <BentoItem
                        colSpan={7}
                        rowSpan={2}
                        title={`Scenario Analysis: ${selectedScenario} Pathway`}
                        subtitle="Financial impact projection (USD Millions)"
                        icon={<TrendingUp size={20} />}
                        headerAction={
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                {['1.5°C', '2.0°C', '4.0°C'].map((scenario) => (
                                    <button
                                        key={scenario}
                                        onClick={() => setSelectedScenario(scenario as any)}
                                        className={`px-3 py-1 text-xs rounded-md transition-all ${selectedScenario === scenario
                                                ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white font-medium'
                                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        {scenario}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <div className="h-full w-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={SCENARIO_DATA}>
                                    <defs>
                                        <linearGradient id="colorScenario" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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

                    {/* Risk List Table */}
                    <BentoItem
                        colSpan={12}
                        title="Identified Climate Risks"
                        subtitle="Detailed register of physical and transition risks"
                        icon={<ShieldAlert size={20} />}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Risk Title</th>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Severity</th>
                                        <th className="px-6 py-3 font-medium">Horizon</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CLIMATE_RISKS.map((risk) => (
                                        <tr key={risk.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{risk.title}</td>
                                            <td className="px-6 py-4 text-slate-500">{risk.type}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk.severity === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                        risk.severity === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {risk.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{risk.horizon}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${risk.status === 'Active' ? 'bg-red-500 animate-pulse' :
                                                            risk.status === 'Mitigating' ? 'bg-blue-500' :
                                                                'bg-slate-400'
                                                        }`} />
                                                    <span className="text-slate-600 dark:text-slate-300">{risk.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-xs font-medium text-aqua-600 hover:text-aqua-700 dark:text-aqua-400 dark:hover:text-aqua-300 hover:underline">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </BentoItem>
                </BentoGrid>
            </div>
        </EsgServiceLayout>
    );
};

export default ClimateRiskPage;

