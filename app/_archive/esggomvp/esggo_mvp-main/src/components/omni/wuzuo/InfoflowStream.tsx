"use client";

import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Globe, Database } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

interface InfoItem {
    id: string;
    type: 'security' | 'carbon' | 'api' | 'network';
    label: string;
    value: string;
    status: 'stable' | 'active' | 'warning';
}

const mockInfo: InfoItem[] = [
    { id: '1', type: 'security', label: '5T Integrity', value: '99.9%', status: 'stable' },
    { id: '2', type: 'carbon', label: 'Real-time footprint', value: '1.2t', status: 'active' },
    { id: '3', type: 'api', label: 'Omni Nexus Sync', value: 'Connected', status: 'stable' },
    { id: '4', type: 'network', label: 'Sentient Resonance', value: 'Active', status: 'active' },
    { id: '5', type: 'security', label: 'Vault Seal', value: 'Locked', status: 'stable' },
];

/**
 * Infoflow Stream (Inspired by Infoflow)
 * 一個垂直流動的液態資訊饋送區
 */
export const InfoflowStream = () => {
    return (
        <div className="flex flex-col gap-4 w-72 h-full py-4 pr-4">
            <h3 className="text-white/40 font-mono text-xs uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Infoflow Stream
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                {mockInfo.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <LiquidGlassContainer
                            className="!p-4 h-auto"
                            intensity="low"
                            glowColor={item.status === 'warning' ? 'amber' : 'aqua'}
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <div className="p-1.5 rounded-lg bg-white/5 text-white/60">
                                        {item.type === 'security' && <Shield className="w-4 h-4" />}
                                        {item.type === 'carbon' && <Globe className="w-4 h-4" />}
                                        {item.type === 'api' && <Database className="w-4 h-4" />}
                                        {item.type === 'network' && <Zap className="w-4 h-4" />}
                                    </div>
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'stable' ? 'bg-cyan-400' :
                                            item.status === 'active' ? 'bg-violet-400 animate-pulse' : 'bg-amber-400'
                                        }`} />
                                </div>
                                <span className="text-[10px] text-white/30 font-mono uppercase mt-2">{item.label}</span>
                                <span className="text-sm text-white/80 font-light">{item.value}</span>
                            </div>
                        </LiquidGlassContainer>
                    </motion.div>
                ))}
            </div>

            {/* 遙測遙感背景裝飾 */}
            <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] text-white/20 font-mono">System Entropy</span>
                    <span className="text-xs text-cyan-400/60 font-mono italic">0.042</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "42%" }}
                        className="h-full bg-cyan-500/30"
                    />
                </div>
            </div>
        </div>
    );
};
