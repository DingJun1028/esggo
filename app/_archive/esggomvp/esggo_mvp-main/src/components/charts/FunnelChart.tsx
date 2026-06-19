'use client';

import React from 'react';
import {
    FunnelChart as RechartsFunnelChart,
    Funnel,
    Cell,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import { motion } from 'framer-motion';

interface FunnelData {
    value: number;
    name: string;
    fill: string;
    dimension?: string; // OMC Dimension mapping
}

interface FunnelChartProps {
    data: FunnelData[];
    title?: string;
}

/**
 * 📊 OmniCharts: Liquid-Glass Funnel v2.0
 * Implementation: Liquid-Glass design with Recharts.
 * Alignment: Aqua (#63a6b0) & Eternal Gold (#ffd700) palette.
 */
export default function FunnelChart({ data, title }: FunnelChartProps) {
    const primaryAqua = '#63a6b0';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 liquid-glass relative overflow-hidden group hover:border-[#63a6b0]/30 transition-all duration-700"
        >
            {/* Ambient Glow */}
            <div className="absolute -top-24 -right-24 size-48 bg-[#63a6b0]/10 blur-[100px] rounded-full pointer-events-none" />

            {title && (
                <div className="mb-8 flex justify-between items-start">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-2">
                        <div className="size-1.5 bg-[#63a6b0] shadow-[0_0_8px_#63a6b0] rounded-full" />
                        {title}
                    </h3>
                    <div className="px-2 py-0.5 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[8px] font-bold text-[#63a6b0] uppercase tracking-widest">
                        OMC V2.0
                    </div>
                </div>
            )}

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsFunnelChart>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(99, 166, 176, 0.2)',
                                borderRadius: '16px',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                backdropFilter: 'blur(10px)'
                            }}
                            itemStyle={{ color: '#63a6b0' }}
                        />
                        <Funnel
                            dataKey="value"
                            data={data}
                            isAnimationActive
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth={2}
                        >
                            <LabelList
                                position="right"
                                fill="rgba(255,255,255,0.5)"
                                stroke="none"
                                dataKey="name"
                                fontSize={9}
                                fontWeight="900"
                                style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            />
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill || primaryAqua}
                                    fillOpacity={0.7 - (index * 0.1)}
                                    className="hover:fill-opacity-100 transition-all duration-700 cursor-pointer"
                                />
                            ))}
                        </Funnel>
                    </RechartsFunnelChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 flex justify-between items-end">
                <div>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] leading-tight mb-1">Impact Retention</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white italic uppercase tracking-tighter">
                            {Math.round((data[data.length - 1].value / data[0].value) * 100)}%
                        </span>
                        <span className="text-[10px] font-bold text-[#ffd700] uppercase tracking-widest">Resonance</span>
                    </div>
                </div>
                <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#63a6b0] group-hover:bg-[#63a6b0] group-hover:text-black hover:shadow-[0_0_20px_#63a6b077] transition-all cursor-crosshair"
                >
                    <div className="size-2 bg-current rounded-full" />
                </motion.div>
            </div>
        </motion.div>
    );
}

