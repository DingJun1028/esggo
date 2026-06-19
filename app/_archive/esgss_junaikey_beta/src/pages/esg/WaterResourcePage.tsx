import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Droplets,
    Activity,
    AlertTriangle,
    BarChart3,
    Waves,
    MapPin,
    Filter,
    Download,
    Brain
} from 'lucide-react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';

const WaterResourcePage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('WaterResourcePage'), []);

    return (
        <StitchPageTemplate
            title="Water Resource Management"
            subtitle="AQUA_FLOW_ANALYTICS"
            headerAction={
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-mono">
                    LIVE_FLOW_MONITORING
                </div>
            }
        >
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="WaterResourcePage"
                className="animate-fade-in"
            >
                {/* 1. Header Stats (Liquid Glass Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Water Usage', value: '1,240 m³', trend: '-12%', icon: Droplets, color: '#00FFFF' },
                        { label: 'Recycling Rate', value: '45%', trend: '+5%', icon: Waves, color: '#4ADE80' },
                        { label: 'Quality Index', value: '98.2', trend: 'Stable', icon: Activity, color: '#60A5FA' },
                        { label: 'Risk Alerts', value: '2', trend: 'Low', icon: AlertTriangle, color: '#F59E0B' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md hover:bg-black/60 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform" style={{ color: stat.color }}>
                                    <stat.icon size={24} />
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-full ${stat.trend.includes('-') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                            <div className="text-3xl font-light text-white tracking-tighter">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* 2. Main Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

                    {/* Water Flow Map (Large Widget) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-gradient-to-br from-blue-900/10 to-black/40 border border-blue-500/10 p-8 rounded-[2rem] relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h2 className="text-xl font-light text-white flex items-center gap-2">
                                    <MapPin size={20} className="text-[#00FFFF]" />
                                    Water Flow Mapping
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Real-time usage distribution across facilities</p>
                            </div>
                            <button className="text-xs font-mono border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-300">
                                VIEW DETAILED MAP
                            </button>
                        </div>

                        {/* Abstract Map Visualization */}
                        <div className="relative h-[300px] w-full bg-[#0F172A]/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
                            {/* Animated Flow Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                <path d="M100,150 C200,50 400,250 500,150" fill="none" stroke="#00FFFF" strokeWidth="2" className="animate-pulse" />
                                <path d="M100,200 C250,250 350,50 600,200" fill="none" stroke="#4ADE80" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '1s' }} />
                            </svg>

                            {/* Node Points */}
                            <div className="absolute top-1/3 left-1/4">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400 whitespace-nowrap">Plant A (Main)</span>
                                <div className="w-4 h-4 rounded-full bg-[#00FFFF] shadow-[0_0_15px_#00FFFF] animate-pulse" />
                            </div>
                            <div className="absolute bottom-1/3 right-1/3">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400 whitespace-nowrap">Cooling Tower B</span>
                                <div className="w-3 h-3 rounded-full bg-[#4ADE80] shadow-[0_0_15px_#4ADE80]" />
                            </div>

                            <div className="mt-auto mb-4 text-xs text-slate-500 font-mono">
                                Interactive mapping data unavailable in demo mode.
                            </div>
                        </div>
                    </motion.div>

                    {/* Risk Intelligence Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/40 border border-white/5 p-8 rounded-[2rem] flex flex-col backdrop-blur-md"
                    >
                        <h2 className="text-xl font-light text-white mb-6 flex items-center gap-2">
                            <Brain size={20} className="text-amber-400" />
                            Risk Intelligence
                        </h2>

                        <div className="flex-1 space-y-4">
                            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-bold text-amber-200">Drought Forecast</h4>
                                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">HIGH PROBABILITY</span>
                                </div>
                                <p className="text-xs text-amber-100/70 leading-relaxed mt-2">
                                    Regional data suggests a 65% chance of severe drought conditions in Q3. Recommendation: Activate water rationing protocols.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-bold text-blue-200">Quality Variance</h4>
                                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">MONITORING</span>
                                </div>
                                <p className="text-xs text-blue-100/70 leading-relaxed mt-2">
                                    Slight increase in conductivity detected at Outflow Node #4. Automated sampling frequency increased.
                                </p>
                            </div>
                        </div>

                        <button className="mt-8 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest text-slate-300 transition-colors border border-white/5">
                            View Full Risk Report
                        </button>
                    </motion.div>
                </div>

                {/* 3. Detailed Logs Table */}
                <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#63a6b0]/5 to-transparent pointer-events-none rounded-[2rem]" />
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-xl font-light text-white flex items-center gap-2">
                            <BarChart3 size={20} className="text-[#00FFFF]" />
                            Operational Logs
                        </h2>
                        <div className="flex gap-3">
                            <button className="p-2 rounded-xl hover:bg-white/5 transition-colors border border-white/5 text-slate-400"><Filter size={16} /></button>
                            <button className="p-2 rounded-xl hover:bg-white/5 transition-colors border border-white/5 text-slate-400"><Download size={16} /></button>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                                    <th className="pb-4 pt-2 px-4">Timestamp</th>
                                    <th className="pb-4 pt-2">Location</th>
                                    <th className="pb-4 pt-2">Metric</th>
                                    <th className="pb-4 pt-2">Reading</th>
                                    <th className="pb-4 pt-2">Status</th>
                                    <th className="pb-4 pt-2 px-4 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { time: '10:42 AM', loc: 'Plant A - Intake', metric: 'Flow Rate', val: '450 L/min', status: 'Normal' },
                                    { time: '10:15 AM', loc: 'Plant A - Treatment', metric: 'pH Level', val: '7.2', status: 'Optimal' },
                                    { time: '09:30 AM', loc: 'Cooling Tower B', metric: 'Temp', val: '24°C', status: 'Normal' },
                                    { time: '08:45 AM', loc: 'Discharge Point', metric: 'Turbidity', val: '2.1 NTU', status: 'Warning' },
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-4 text-slate-400 font-mono text-xs">{row.time}</td>
                                        <td className="py-4 text-slate-200">{row.loc}</td>
                                        <td className="py-4 text-slate-300">{row.metric}</td>
                                        <td className="py-4 font-bold text-white">{row.val}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' :
                                                row.status === 'Optimal' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {row.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <div className="w-2 h-2 rounded-full bg-[#00FFFF]" title="Traceable" />
                                                <div className="w-2 h-2 rounded-full bg-[#00FFFF]" title="Trackable" />
                                                <div className="w-2 h-2 rounded-full bg-[#00FFFF]" title="Transparent" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StitchPageTemplate>
    );
};

export default WaterResourcePage;

