'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Brain, Activity, Zap, TrendingUp, History, Info } from 'lucide-react';

interface VisualizerMetric {
    label: string;
    value: number;
    color: string;
    icon: React.ReactNode;
}

export const OmniSynergeticVisualizer: React.FC = () => {
    const [resonance, setResonance] = useState(88.5);
    const [activeTab, setActiveTab] = useState<'TRINITY' | 'KARMA'>('TRINITY');
    const [repairLogs, setRepairLogs] = useState([
        { id: 1, action: '熵值優化：治理決策路徑已修正', status: 'Sealed', time: '10:45' },
        { id: 2, action: '5T 驗算：數據一致性校正完成', status: 'Sealed', time: '10:52' },
        { id: 3, action: '智慧提純：ESG 指標自動歸位', status: 'Sealed', time: '11:00' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setResonance(prev => {
                const delta = (Math.random() - 0.5) * 2;
                return Math.min(100, Math.max(85, prev + delta));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const trinityMetrics: VisualizerMetric[] = [
        { label: 'OmniOne (顯化)', value: 92, color: '#ffd700', icon: <Sparkles size={16} /> },
        { label: 'OmniPriest (封印)', value: 98, color: '#52C41A', icon: <ShieldCheck size={16} /> },
        { label: 'OmniGemini (智慧)', value: resonance, color: '#63a6b0', icon: <Brain size={16} /> },
    ];

    return (
        <div className="w-full bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Trinity Synergetic Visualizer</h3>
                            <div className="px-2 py-0.5 rounded-full bg-[#63a6b0]/10 text-[#63a6b0] text-[10px] font-black border border-[#63a6b0]/20 animate-pulse">LIVE</div>
                        </div>
                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">三位一體協同大屏：自主成果顯化</p>
                    </div>

                    <div className="flex p-1 bg-gray-100 rounded-xl">
                        <button 
                            onClick={() => setActiveTab('TRINITY')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeTab === 'TRINITY' ? 'bg-white text-[#63a6b0] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            TRINITY BALANCE
                        </button>
                        <button 
                            onClick={() => setActiveTab('KARMA')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeTab === 'KARMA' ? 'bg-white text-[#63a6b0] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            KARMA REPAIR
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'TRINITY' ? (
                        <motion.div 
                            key="trinity"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {trinityMetrics.map((metric, idx) => (
                                <div key={metric.label} className="relative group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        {React.cloneElement(metric.icon as any, { size: 64, color: metric.color })}
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 rounded-lg shadow-inner bg-gray-50 text-[metric.color]" style={{ color: metric.color }}>
                                            {metric.icon}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{metric.label}</span>
                                    </div>
                                    <div className="flex items-end gap-1 mb-4">
                                        <span className="text-4xl font-black text-gray-800 tracking-tighter">{metric.value.toFixed(1)}</span>
                                        <span className="text-sm font-bold text-gray-400 mb-1.5">%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.value}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: metric.color }}
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-gray-400">STATUS</span>
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 uppercase">Resonating</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="karma"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <History size={14} className="text-[#63a6b0]" />
                                <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Autonomous Repair History (自主修復紀錄)</span>
                            </div>
                            <div className="space-y-3">
                                {repairLogs.map((log, idx) => (
                                    <motion.div 
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm group hover:border-[#63a6b0]/30 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-[#52C41A] shadow-[0_0_8px_rgba(82,196,26,0.5)]" />
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800">{log.action}</h4>
                                                <p className="text-[10px] text-gray-400 font-medium tracking-tighter uppercase">{log.time} · SHA-256 VALIDATED</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 rounded-full bg-[#52C41A]/10 text-[#52C41A] text-[9px] font-black border border-[#52C41A]/20 flex items-center gap-1">
                                                <ShieldCheck size={10} /> {log.status}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-gray-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Impact (綜合影響力)</span>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#63a6b0]" />
                            <span className="text-xl font-black text-gray-800 tracking-tighter">+12.4%</span>
                        </div>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-200" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Harmony Index (和諧指數)</span>
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-[#ffd700]" />
                            <span className="text-xl font-black text-gray-800 tracking-tighter">0.998</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                <div className="w-full h-full bg-gradient-to-br from-[#63a6b0] to-[#ffd700] opacity-50" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">Trinity Synchronized</span>
                </div>
            </div>
        </div>
    );
};
