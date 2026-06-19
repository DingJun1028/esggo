
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Leaf, Truck, FileText, AlertTriangle, Hash, Globe, Shield } from 'lucide-react';
import { ICorporateTwin } from '../../types/twin/index.js';
import { digitalTwinService } from '../../../server/services/DigitalTwinService.js';

export const CorporateTwinCenter: React.FC = () => {
    const [twin, setTwin] = useState<ICorporateTwin | null>(null);

    useEffect(() => {
        const loadTwin = async () => {
            // Simulation: Mint a demo corporate twin
            const demo = await digitalTwinService.mintCorporateTwin({
                displayName: 'Acme Sustainable Corp',
                description: 'Leading the green revolution in manufacturing.',
                industry: 'Manufacturing',
                taxId: '88776655'
            });
            setTwin(demo);
        };
        loadTwin();
    }, []);

    if (!twin) return <div className="p-10 text-center text-emerald-400">Loading Corporate Entity...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-white text-left">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Corporate Digital Twin
                    </h1>
                    <div className="flex items-center gap-4 text-slate-400 mt-2">
                        <span className="flex items-center gap-1"><Building size={14} /> {twin.displayName}</span>
                        <span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded">TaxID: {twin.taxId}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs border border-emerald-500/30">
                        ESG Rating: AA
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30 flex items-center gap-1">
                        <Globe size={12} /> Global Entity
                    </span>
                </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* 1. ESG Score (Large Left) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-1 md:row-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent pointer-events-none" />

                    <h3 className="text-lg font-bold text-emerald-300 mb-6 flex items-center gap-2">
                        <Leaf size={20} /> ESG Performance
                    </h3>

                    <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* CSS Gauge Simulation */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                            <circle cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="60" strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-bold text-white">85</span>
                            <span className="text-xs text-emerald-400">Excellent</span>
                        </div>
                    </div>

                    <div className="w-full mt-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Environment</span>
                            <span className="text-emerald-400">92</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full"><div className="bg-emerald-500 h-1 rounded-full w-[92%]" /></div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Social</span>
                            <span className="text-blue-400">78</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full"><div className="bg-blue-500 h-1 rounded-full w-[78%]" /></div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Governance</span>
                            <span className="text-purple-400">88</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full"><div className="bg-purple-500 h-1 rounded-full w-[88%]" /></div>
                    </div>
                </motion.div>

                {/* 2. Supply Chain Map (Top Right - Wide) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-[200px]"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                            <Truck size={18} className="text-blue-400" /> Supply Chain Transparency
                        </h3>
                        <button className="text-xs text-blue-400 hover:text-blue-300">View Full Map</button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="min-w-[150px] p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2">
                                <div className="text-xs text-slate-500">Tier 1 Supplier</div>
                                <div className="font-bold text-sm">Supplier Node #{n}</div>
                                <div className="text-[10px] text-emerald-400">● 100% Verified</div>
                            </div>
                        ))}
                        <div className="min-w-[150px] p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-500 text-xs">
                            + 12 More
                        </div>
                    </div>
                </motion.div>

                {/* 3. Reports (Bottom Middle) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-amber-400" /> Recent Reports
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><FileText size={16} /></div>
                                <div>
                                    <div className="text-sm font-bold">Q4 Sustainability Report</div>
                                    <div className="text-[10px] text-slate-400">2025-12-31 • Verified</div>
                                </div>
                            </div>
                            <span className="text-emerald-400 text-xs font-mono">HASH: A7F2...99B</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FileText size={16} /></div>
                                <div>
                                    <div className="text-sm font-bold">Carbon Audit 2025</div>
                                    <div className="text-[10px] text-slate-400">2025-11-15 • Verified</div>
                                </div>
                            </div>
                            <span className="text-emerald-400 text-xs font-mono">HASH: B8C3...11A</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Risk Radar (Bottom Right) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-400" /> Active Risks
                    </h3>
                    <div className="space-y-2">
                        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                            ⚠ Cyber Security Audit Due
                        </div>
                        <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-300">
                            ⚠ Supplier #3 Compliance Check
                        </div>
                        <div className="mt-4 text-center text-xs text-slate-500">
                            Overall Risk Level: <span className="text-green-400">Low</span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* 5T Protocol Identity Footer */}
            <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Shield size={12} className="text-emerald-500" /> 5T Protocol Identity Verification
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">

                    {/* Tangible */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-emerald-400">
                            <Leaf size={14} /> <span>Tangible (可感知)</span>
                        </div>
                        <div className="text-slate-400 truncate">ESG Score: {twin.esgStatus?.rating || 'N/A'}</div>
                    </div>

                    {/* Traceable */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-blue-400">
                            <Globe size={14} /> <span>Traceable (可溯源)</span>
                        </div>
                        <div className="text-slate-400 truncate" title={twin.evidence.traceable?.source_origin}>
                            src: {twin.evidence.traceable?.source_origin || 'Registry'}
                        </div>
                    </div>

                    {/* Trackable */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-amber-400">
                            <Truck size={14} /> <span>Trackable (可追蹤)</span>
                        </div>
                        <div className="text-slate-400 truncate">
                            Nodes: {twin.supplyChainNodes?.length || 0}
                        </div>
                    </div>

                    {/* Transparent */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-purple-400">
                            <FileText size={14} /> <span>Transparent (可透明)</span>
                        </div>
                        <div className="text-slate-400 truncate" title={(twin.evidence as any).transparent?.formula}>
                            {(twin.evidence as any).transparent?.formula || 'GRI-Std'}
                        </div>
                    </div>

                    {/* Trustworthy */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-red-400">
                            <Hash size={14} /> <span>Trustworthy (不可篡改)</span>
                        </div>
                        <div className="text-slate-400 truncate" title={twin.evidence.trustworthy?.hash_lock}>
                            {twin.evidence.trustworthy?.hash_lock?.substring(0, 12)}...
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
