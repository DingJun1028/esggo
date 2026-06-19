'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ShieldCheck,
    Activity,
    Search,
    Zap,
    Globe,
    Scale,
    CheckCircle2,
    ChevronRight,
    Sparkles,
    SearchCode,
    Radar
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import GeographicHeatmap from '@/components/charts/GeographicHeatmap';

/**
 * ⚖️ Governance 3.4: Compliance Risk Monitor
 * Proactive regulatory tracking and ESG risk mitigation.
 */
export default function ComplianceMonitorPage() {
    const { locale, t } = useLanguage();
    const [riskFactor, setRiskFactor] = useState(0.24);

    const alerts = [
        { t: 'ESRS G1 Update', date: 'Q1 2026', level: 'High', msg: 'New double-materiality disclosure requirements for digital assets.' },
        { t: 'ISSB Alignment', date: 'Active', level: 'Med', msg: 'IFRS S1/S2 data sync required across global supply nodes.' },
        { t: 'Carbon Penalty', date: '2027 Prop', level: 'Critical', msg: 'Potential $120/t tax for unverified Scope 3 claims.' },
    ];

    const geoData = [
        { id: 'G1', region: 'North America', value: 98, status: 'High', coordinates: { x: 20, y: 35 } },
        { id: 'G2', region: 'European Union', value: 92, status: 'High', coordinates: { x: 50, y: 30 } },
        { id: 'G3', region: 'Asia Pacific', value: 85, status: 'Medium', coordinates: { x: 80, y: 50 } },
        { id: 'G4', region: 'Brazil Hub', value: 72, status: 'Medium', coordinates: { x: 30, y: 75 } },
        { id: 'G5', region: 'South Africa', value: 64, status: 'Low', coordinates: { x: 55, y: 80 } },
    ] as any[];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "合規風險監測 (Compliance Monitor)" : "Compliance Risk Monitor"}
                subtitle={locale === 'zh-TW' ? "實時監測法規變更，學習動態合規機制。透過 AI 前瞻性識別全球監測風險。" : "Real-time regulatory tracking and dynamic compliance. Proactively identify global risks via Sentient AI."}
                category="治理合規服務"
            />

            {/* 📡 Risk Radar Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <GeographicHeatmap points={geoData} />
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-400" /> Sentinel Alerts
                    </h4>
                    <div className="space-y-4">
                        {alerts.map((a, i) => (
                            <div key={a.t} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group cursor-pointer">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest leading-loose">
                                        {a.level}
                                    </span>
                                    <span className="text-[8px] font-bold text-gray-600 uppercase">{a.date}</span>
                                </div>
                                <h5 className="text-[10px] font-black text-white uppercase tracking-tighter mb-1">{a.t}</h5>
                                <p className="text-[9px] text-gray-500 leading-loose uppercase italic">{a.msg}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🛡️ Hedge Strategies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { l: 'Regulatory Shield', d: 'Activate 5T automated report forge to pre-empt ESRS G1 gaps.', i: <ShieldCheck /> },
                    { l: 'Data Resilience', d: 'Mirror evidence across 3 geographic nodes for 99.9% availability.', i: <DatabaseIcon /> },
                    { l: 'Liability Offset', d: 'Allocate 2.4% capital to Impact Repair Lab for risk hedging.', i: <Scale /> }
                ].map((strategy, i) => (
                    <motion.div
                        key={strategy.l}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[3rem] bg-white/5 border border-white/5 group hover:border-amber-500/20 transition-all"
                    >
                        <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:bg-amber-500 group-hover:text-black transition-all mb-6">
                            {strategy.i}
                        </div>
                        <h5 className="text-lg font-black italic uppercase tracking-tighter mb-2">{strategy.l}</h5>
                        <p className="text-[10px] text-gray-500 leading-loose uppercase tracking-widest">{strategy.d}</p>
                    </motion.div>
                ))}
            </div>

            {/* 🔮 Final Insight */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-r from-amber-500/10 via-black to-emerald-500/10 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                    <Sparkles className="text-gold" size={32} />
                    <div>
                        <h4 className="text-xl font-bold uppercase tracking-tighter italic">Dr. Thoth's Compliance Oracle</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Hedge your compliance liability by 42% via 5T verification.</p>
                    </div>
                </div>
                <button className="px-10 py-4 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-amber-500/30">
                    Execute Mitigation
                </button>
            </div>

        </div>
    );
}

const DatabaseIcon = () => <Activity size={20} />;
