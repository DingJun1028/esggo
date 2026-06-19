import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";

interface PredictiveDataPoint {
    month: string;
    actual?: number;
    predicted: number;
    upperBound: number;
    lowerBound: number;
}

interface PredictiveChartProps {
    title: string;
    data: PredictiveDataPoint[];
}

export const PredictiveChart: React.FC<PredictiveChartProps> = ({ title, data }) => {
    // Generate SVG path strings for the lines
    const maxVal = Math.max(...data.map(d => Math.max(d.upperBound, d.actual || 0)));
    const minVal = Math.min(...data.map(d => Math.min(d.lowerBound, d.actual || d.lowerBound)));
    const range = maxVal - minVal || 1;

    const hMargin = 10;
    const vMargin = 20;

    const mapY = (val: number) => 100 - ((val - minVal) / range) * (100 - vMargin * 2) - vMargin;
    const mapX = (idx: number) => hMargin + (idx / Math.max(1, data.length - 1)) * (100 - hMargin * 2);

    const actualStr = data.filter(d => d.actual !== undefined).map((d, i) => `${mapX(i)},${mapY(d.actual!)}`).join(' L ');
    const predictedStr = data.map((d, i) => `${mapX(i)},${mapY(d.predicted)}`).join(' L ');

    // Confidence interval polygon
    const upperPath = data.map((d, i) => `${mapX(i)},${mapY(d.upperBound)}`);
    const lowerPath = [...data].reverse().map((d, i) => `${mapX(data.length - 1 - i)},${mapY(d.lowerBound)}`);
    const areaStr = `M ${upperPath.join(' L ')} L ${lowerPath.join(' L ')} Z`;

    return (
        <LiquidGlassContainer glowColor="fuchsia" intensity="low" className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-black tracking-widest text-white uppercase flex items-center gap-2 italic mb-6">
                <Activity size={20} className="text-fuchsia-400" />
                {title}
            </h3>

            <div className="flex-1 relative w-full h-48 bg-black/40 rounded-xl border border-white/5 p-2">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                    {/* Confidence Area */}
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        d={areaStr}
                        fill="#d946ef" // fuchsia-500
                    />

                    {/* Predicted Line */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={`M ${predictedStr}`}
                        fill="none"
                        stroke="#d946ef"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                    />

                    {/* Actual Line */}
                    {actualStr && (
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            d={`M ${actualStr}`}
                            fill="none"
                            stroke="#10b981" // emerald-500
                            strokeWidth="2"
                        />
                    )}
                </svg>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 pt-2 border-t border-white/10 -mb-6">
                    {data.map((d, i) => (
                        <span key={i} className="text-[9px] text-white/50 uppercase font-bold tracking-wider">{d.month}</span>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex gap-4 justify-center">
                <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                    <span className="w-3 h-1 bg-emerald-500 rounded-full"></span> Actual
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                    <span className="w-3 h-1 border-b-2 border-dashed border-fuchsia-500"></span> Predicted
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                    <span className="w-3 h-3 bg-fuchsia-500/20 rounded-sm"></span> Confidence Range
                </div>
            </div>
        </LiquidGlassContainer>
    );
};
