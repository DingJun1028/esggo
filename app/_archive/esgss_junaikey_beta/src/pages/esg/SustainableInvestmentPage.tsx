import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Leaf,
    PieChart,
    BarChart2,
    Activity,
    Target,
    ArrowUpRight,
    Search
} from 'lucide-react';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

const INVESTMENT_STATS = [
    { label: 'Total Green Assets', value: '$45.2M', trend: '??12%', icon: Leaf, color: '#4CAF50', detail: 'Across 15 funds' },
    { label: 'ESG Alpha', value: '+4.2%', trend: 'Outperforming', icon: TrendingUp, color: '#00FFFF', detail: 'vs. Benchmark' },
    { label: 'Carbon Intensity', value: '120', trend: '??15%', icon: Activity, color: '#FF9800', detail: 'tCO2e / $1M' },
];

const PORTFOLIO_ALLOCATION = [
    { sector: 'Renewable Energy', allocation: 35, impact: 'High' },
    { sector: 'Sustainable Water', allocation: 25, impact: 'High' },
    { sector: 'Circular Economy', allocation: 20, impact: 'Medium' },
    { sector: 'Social Housing', allocation: 15, impact: 'Medium' },
    { sector: 'Others', allocation: 5, impact: 'Low' },
];

/**
 * ?’¹ SustainableInvestmentPage
 * 
 * Implements "Finance Flow" interface with Liquid Glass aesthetics.
 * 5T Protocol: Core Identity for traceability.
 */
const SustainableInvestmentPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('SustainableInvestmentPage'), []);

    return (
        <EsgServiceLayout title="Sustainable Investment Analysis" activeId="investment" progress={85}>
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="SustainableInvestmentPage"
                className="animate-fade-in"
            >
                {/* 1. Portfolio Performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {INVESTMENT_STATS.map((stat, index) => (
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
                                <div className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest">{stat.trend}</div>
                            </div>
                            <h3 className="text-slate-400 text-sm mb-1">{stat.label}</h3>
                            <div className="text-4xl font-light text-white mb-2">{stat.value}</div>
                            <p className="text-[10px] text-slate-500 font-mono italic">{stat.detail}</p>
                        </motion.div>
                    ))}
                </div>

                {/* 2. Sector Allocation & Impact Mapping */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <motion.div className="lg:col-span-2 liquid-glass p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-light text-white">Thematic Sector Allocation</h2>
                            <PieChart className="text-slate-500" size={20} />
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-6">
                            {PORTFOLIO_ALLOCATION.map((item) => (
                                <div key={item.sector} className="group cursor-default">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ESG_THEME.PRIMARY }} />
                                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.sector}</span>
                                        </div>
                                        <span className="text-xs font-mono text-slate-500">{item.allocation}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.allocation}%` }}
                                            className="h-full bg-[#00FFFF] opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div className="liquid-glass-strong p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 rounded-full border border-dashed border-[#00FFFF]/30 flex items-center justify-center mb-6 relative">
                            <Target size={40} className="text-[#00FFFF]" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 border-t border-[#00FFFF] rounded-full"
                            />
                        </div>
                        <h3 className="text-lg font-light text-white mb-2">Impact Scorecard</h3>
                        <div className="text-4xl font-light text-[#00FFFF] mb-4">8.5/10</div>
                        <p className="text-xs text-slate-500 leading-relaxed px-4">
                            Aggregate alignment with UN Sustainable Development Goals (SDGs) 7, 12, and 13.
                        </p>
                        <button className="mt-8 text-[10px] font-bold uppercase tracking-widest text-[#00FFFF] hover:underline">Download Impact Report</button>
                    </motion.div>
                </div>

                {/* 3. Asset Analysis & Audit Table */}
                <motion.div className="liquid-glass p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-light text-white">Investment Asset Detail</h2>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-[#00FFFF] transition-colors" size={14} />
                                <input className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#00FFFF]/50 transition-colors" placeholder="Search assets..." />
                            </div>
                            <button className="p-2 rounded-xl hover:bg-white/5 border border-white/5 group hover:border-[#00FFFF]/30 transition-all"><BarChart2 size={16} className="text-slate-500 group-hover:text-white" /></button>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                                    <th className="pb-4 pt-2">Asset / Project</th>
                                    <th className="pb-4 pt-2">ESG Rating</th>
                                    <th className="pb-4 pt-2">Market Value</th>
                                    <th className="pb-4 pt-2">Impact Metric</th>
                                    <th className="pb-4 pt-2">Status</th>
                                    <th className="pb-4 pt-2 text-right">Insight</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { name: 'Offshore Wind Farm X', rating: 'AAA', value: '$12.4M', impact: '24k tCO2e/yr', status: 'Core' },
                                    { name: 'Recycled Fiber Plant B', rating: 'AA', value: '$8.2M', impact: '100% Circularity', status: 'Growth' },
                                    { name: 'Smart City Retrofit', rating: 'A', value: '$5.1M', impact: '45% Energy Save', status: 'Core' },
                                    { name: 'Microfinance Node Beta', rating: 'AA', value: '$2.5M', impact: '1.2k SME Boost', status: 'Satellite' },
                                ].map((asset, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-5">
                                            <div className="text-slate-200 font-medium">{asset.name}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">ID: AST-00{idx + 1}</div>
                                        </td>
                                        <td className="py-5 pt-6">
                                            <span className="px-2 py-0.5 rounded bg-[#00FFFF]/10 text-[#00FFFF] text-xs font-bold border border-[#00FFFF]/20">
                                                {asset.rating}
                                            </span>
                                        </td>
                                        <td className="py-5 text-slate-300 font-mono">{asset.value}</td>
                                        <td className="py-5 text-slate-400 italic text-xs">{asset.impact}</td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-xs text-slate-500">{asset.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 text-right">
                                            <ArrowUpRight size={16} className="text-slate-600 group-hover:text-[#00FFFF] transition-colors inline-block" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </EsgServiceLayout>
    );
};

export default SustainableInvestmentPage;

