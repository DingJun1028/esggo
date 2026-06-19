import React, { useMemo } from 'react';
import {
    FunnelChart as RechartsFunnelChart,
    Funnel,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { ShieldCheck, Info } from 'lucide-react';
import { IComponentCore } from '@/services/ceremony/core/IComponentCore';

interface FunnelData {
    name: string;
    value: number;
    fill: string;
    description: string;
}

interface FunnelChartProps {
    data: FunnelData[];
    title?: string;
    core: IComponentCore;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="liquid-glass p-4 border border-white/10 backdrop-blur-xl shadow-2xl z-50">
                <p className="text-xs font-black uppercase tracking-widest text-[#63a6b0] mb-1">
                    {data.name}
                </p>
                <p className="text-2xl font-light text-white mb-2">{data.value}%</p>
                <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                    {data.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[9px] text-[#63a6b0]/60 font-mono italic">
                    <ShieldCheck size={10} />
                    <span>5T VERIFIED DATA</span>
                </div>
            </div>
        );
    }
    return null;
};

export const FunnelChart: React.FC<FunnelChartProps> = ({ data, title, core }) => {
    return (
        <div
            className="w-full h-full flex flex-col pt-2"
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
        >
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                        <span className="w-1 h-3 bg-[#63a6b0] rounded-full" />
                        {title}
                    </h4>
                    <Info size={14} className="text-slate-600 hover:text-[#63a6b0] cursor-help transition-colors" />
                </div>
            )}

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsFunnelChart>
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Funnel
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            isAnimationActive={true}
                            lastShapeType="rectangle"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill}
                                    fillOpacity={0.8}
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth={1}
                                    className="hover:fill-opacity-100 transition-all duration-300 cursor-pointer"
                                    style={{ filter: `drop-shadow(0 0 10px ${entry.fill}44)` }}
                                />
                            ))}
                        </Funnel>
                    </RechartsFunnelChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                <span>Distillation Matrix Alpha</span>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#63a6b0]" />
                        Sentinel
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Verified
                    </span>
                </div>
            </div>
        </div>
    );
};
