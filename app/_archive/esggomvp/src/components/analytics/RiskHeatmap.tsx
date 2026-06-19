import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { AlertTriangle } from 'lucide-react';

interface RiskItem {
    id: string;
    name: string;
    probability: number; // 0-100
    impact: number;      // 0-100
    level: 'low' | 'medium' | 'high' | 'critical';
}

interface RiskHeatmapProps {
    risks: RiskItem[];
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ risks }) => {
    return (
        <LiquidGlassContainer glowColor="amber" intensity="low" className="p-6 relative">
            <h3 className="text-lg font-black tracking-widest text-white uppercase flex items-center gap-2 italic mb-6">
                <AlertTriangle size={20} className="text-amber-400" />
                Risk Heatmap Matrix
            </h3>

            <div className="relative w-full aspect-square max-w-[400px] mx-auto bg-black/40 border border-white/10 rounded-xl p-4">
                {/* Background Grid */}
                <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-1 opacity-20">
                    <div className="bg-emerald-500 rounded-tl-lg"></div>
                    <div className="bg-amber-500"></div>
                    <div className="bg-rose-500 rounded-tr-lg"></div>

                    <div className="bg-emerald-500"></div>
                    <div className="bg-amber-500"></div>
                    <div className="bg-rose-500"></div>

                    <div className="bg-emerald-500 rounded-bl-lg"></div>
                    <div className="bg-emerald-500"></div>
                    <div className="bg-amber-500 rounded-br-lg"></div>
                </div>

                {/* Axes Labels */}
                <div className="absolute bottom-0 left-0 w-full text-center text-[10px] text-white/50 -mb-4 font-bold tracking-widest uppercase">
                    Probability (0-100)
                </div>
                <div className="absolute top-0 left-0 h-full flex items-center -ml-8">
                    <span className="text-[10px] text-white/50 -rotate-90 font-bold tracking-widest uppercase origin-center whitespace-nowrap">
                        Impact (0-100)
                    </span>
                </div>

                {/* Data Points */}
                <div className="absolute inset-4">
                    {risks.map((risk, idx) => (
                        <motion.div
                            key={risk.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                            className="absolute -translate-x-1/2 translate-y-1/2 group z-10"
                            style={{
                                left: `${risk.probability}%`,
                                bottom: `${risk.impact}%`
                            }}
                        >
                            <div className={`
                                w-4 h-4 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)]
                                ${risk.level === 'critical' ? 'bg-rose-600 animate-pulse' :
                                    risk.level === 'high' ? 'bg-rose-500' :
                                        risk.level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}
                            `} />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/80 backdrop-blur-md border border-white/20 p-2 rounded-lg text-xs z-50">
                                <p className="font-bold text-white mb-1">{risk.name}</p>
                                <p className="text-white/70 font-['Outfit']">P: {risk.probability} | I: {risk.impact}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </LiquidGlassContainer>
    );
};
