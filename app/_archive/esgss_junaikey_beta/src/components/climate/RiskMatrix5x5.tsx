
import React from 'react';
import { motion } from 'framer-motion';

// Risk Level Colors
const riskColors = {
    low: 'bg-emerald-200 dark:bg-emerald-900',
    medium: 'bg-yellow-200 dark:bg-yellow-900',
    high: 'bg-orange-300 dark:bg-orange-800',
    critical: 'bg-red-400 dark:bg-red-700',
};

// 5x5 Matrix Layout (Impact x Probability)
// Rows (Impact): 5 (Critical) -> 1 (Negligible)
// Cols (Probability): 1 (Rare) -> 5 (Almost Certain)

// Grid Mapping (Row, Col) -> Level
const getRiskLevel = (row: number, col: number) => {
    const sum = row * col;
    if (sum >= 15) return 'critical';
    if (sum >= 10) return 'high';
    if (sum >= 5) return 'medium';
    return 'low';
};

interface RiskItem {
    id: string;
    title: string;
    probability: number; // 1-5
    impact: number;      // 1-5
}

interface RiskMatrix5x5Props {
    risks: RiskItem[];
}

export const RiskMatrix5x5: React.FC<RiskMatrix5x5Props> = ({ risks }) => {
    return (
        <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            {/* Y-Axis Label */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-bold text-slate-500 uppercase tracking-widest">
                Impact
            </div>

            {/* X-Axis Label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                Probability
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-5 grid-rows-5 gap-1 h-full w-full">
                {/* 
                    Rows are 5 to 1 (Top to Bottom)
                    Cols are 1 to 5 (Left to Right)
                */}
                {[5, 4, 3, 2, 1].map((row) => (
                    <React.Fragment key={row}>
                        {[1, 2, 3, 4, 5].map((col) => {
                            const level = getRiskLevel(row, col);
                            return (
                                <div
                                    key={`${row}-${col}`}
                                    className={`
                                        relative border border-white/10 dark:border-slate-800/50 
                                        ${riskColors[level]} 
                                        opacity-80 hover:opacity-100 transition-opacity rounded-sm
                                        flex items-center justify-center
                                    `}
                                >
                                    {/* Render Risks in this cell */}
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {risks
                                            .filter(r => r.impact === row && r.probability === col)
                                            .map(risk => (
                                                <motion.div
                                                    key={risk.id}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-6 h-6 rounded-full bg-slate-900 text-white border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold shadow-lg z-10 cursor-pointer hover:scale-125 transition-transform"
                                                    title={risk.title}
                                                >
                                                    {risk.id}
                                                </motion.div>
                                            ))}
                                    </div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            {/* Axis Ticks Y */}
            <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between py-6 text-xs text-slate-400 font-mono h-[calc(100%-4rem)] my-auto">
                <span>5</span>
                <span>4</span>
                <span>3</span>
                <span>2</span>
                <span>1</span>
            </div>

            {/* Axis Ticks X */}
            <div className="absolute left-0 right-0 bottom-6 flex justify-between px-8 text-xs text-slate-400 font-mono w-[calc(100%-0rem)] mx-auto">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
            </div>
        </div>
    );
};
