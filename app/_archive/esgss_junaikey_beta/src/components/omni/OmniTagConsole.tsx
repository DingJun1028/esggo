import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Shield, Activity, Database, CheckCircle, Search, Terminal } from 'lucide-react';
import { omniTagService } from '@/services/OmniTagService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOmniContext } from '@/omni/context/OmniContext';
import FiveTProtocolBadge from './FiveTProtocolBadge';

interface OmniTagConsoleProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * 🛰️ OmniTagConsole
 * --------------------------------------------------
 * Developer-centric console to visualize and manage
 * the "Universal Tagging" system.
 */
export const OmniTagConsole: React.FC<OmniTagConsoleProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { isDevMode } = useOmniContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'TAGS' | 'LINEAGE' | 'AUDIT'>('TAGS');

    // Simulated data for now
    const stats = {
        totalTags: 1254,
        activeProtocols: 5,
        resonance: 92,
        integrity: '99.9%'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[11000] flex items-end justify-end p-8 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.95 }}
                        className="w-[400px] h-[600px] bg-[#050810]/95 border border-[#63a6b0]/40 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-6 pointer-events-auto flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#63a6b0]/20 text-[#63a6b0]">
                                    <Terminal size={20} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-white">{t('omni.console.title')}</h2>
                                    <span className="text-[9px] text-[#63a6b0] font-bold uppercase tracking-tighter">{t('omni.console.governance')} v6.3</span>
                                </div>

                            </div>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                <Activity size={18} />
                            </button>
                        </div>

                        {/* Stats Matrix */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[
                                { label: 'Total Tags', value: stats.totalTags, icon: Tag },
                                { label: 'Active Protocols', value: stats.activeProtocols, icon: Shield },
                                { label: 'System Resonance', value: `${stats.resonance}%`, icon: Activity },
                                { label: 'Data Integrity', value: stats.integrity, icon: Database }
                            ].map((s, i) => (
                                <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <s.icon size={10} className="text-[#63a6b0]" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase">{s.label}</span>
                                    </div>
                                    <p className="text-lg font-black text-white italic">{s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
                            {['TAGS', 'LINEAGE', 'AUDIT'].map((tab: any) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${activeTab === tab ? 'bg-[#63a6b0] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                <input
                                    type="text"
                                    placeholder="Scan universal tags..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white outline-none focus:border-[#63a6b0]/50 transition-all font-mono"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Tag Feed */}
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-[#63a6b0]/30 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-mono text-[#63a6b0]">sys:protocol:5t</span>
                                            <CheckCircle size={10} className="text-emerald-500" />
                                        </div>
                                        <p className="text-[9px] text-slate-400 line-clamp-1">Verified via SHA-256 seal at InfoOne Central Node</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <FiveTProtocolBadge size="sm" variant={isDevMode ? "active" : "standby"} />
                                            <span className="text-[7px] text-slate-600 font-mono">UUID-88FF00{i}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isDevMode ? 'text-emerald-500 animate-pulse' : 'text-slate-600'}`}>
                                {isDevMode ? 'Sovereign Mode Enabled' : 'Safe Mode Only'}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isDevMode ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                <span className="text-[8px] text-slate-500 uppercase">Live Flux</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
