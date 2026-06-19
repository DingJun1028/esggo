import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";

interface DataPoint {
    label: string;
    value: number;
}

interface TrendChartProps {
    title: string;
    data: DataPoint[];
    color?: 'emerald' | 'blue' | 'amber' | 'rose';
}

export const TrendChart: React.FC<TrendChartProps> = ({ title, data, color = 'emerald' }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    const colorClasses = {
        emerald: 'from-emerald-500 to-emerald-400',
        blue: 'from-blue-500 to-blue-400',
        amber: 'from-amber-500 to-amber-400',
        rose: 'from-rose-500 to-rose-400',
    };

    return (
        <LiquidGlassContainer glowColor={color as any} intensity="low" className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-black tracking-widest text-white uppercase flex items-center gap-2 italic mb-6">
                <TrendingUp size={20} className={`text-${color}-400`} />
                {title}
            </h3>

            <div className="flex-1 flex items-end gap-2 mt-auto pt-8">
                {data.map((point, idx) => {
                    const heightPct = (point.value / maxValue) * 100;

                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full relative flex items-end justify-center h-40 bg-white/5 rounded-t-sm">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPct}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1, type: "spring", stiffness: 50 }}
                                    className={`w-full bg-gradient-to-t ${colorClasses[color]} opacity-80 group-hover:opacity-100 transition-opacity rounded-t-sm relative`}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black font-['Outfit'] text-white">
                                        {point.value}
                                    </div>
                                </motion.div>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider truncate w-full text-center">
                                {point.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </LiquidGlassContainer>
    );
};
