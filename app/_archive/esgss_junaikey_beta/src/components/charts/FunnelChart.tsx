import React from 'react';
import {
    FunnelChart as RechartsFunnel,
    Funnel,
    LabelList,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

interface FunnelData {
    value: number;
    name: string;
    fill: string;
}

interface FunnelChartProps {
    data?: FunnelData[];
    title?: string;
    totalCount?: number;
}

const defaultData: FunnelData[] = [
    { value: 100, name: 'L1 Assessment', fill: '#63a6b0' },
    { value: 80, name: 'Initial Review', fill: '#528a92' },
    { value: 50, name: 'Validation', fill: '#416e75' },
    { value: 30, name: 'Verification', fill: '#305257' },
    { value: 20, name: 'Certified', fill: '#1f363a' },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 border border-[#63a6b0]/30 p-3 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(99,166,176,0.2)]">
                <p className="text-[#63a6b0] font-bold text-sm tracking-widest uppercase mb-1">{payload[0].payload.name}</p>
                <p className="text-white text-xs font-mono">
                    <span className="text-gray-400">Count: </span>
                    {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export const FunnelChart: React.FC<FunnelChartProps> = ({
    data = defaultData,
    title = 'User Conversion Funnel',
    totalCount
}) => {
    const total = totalCount ?? (data?.[0]?.value ?? 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full min-h-[400px] bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0df2df]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-white/90 font-bold text-lg tracking-tight flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#63a6b0] rounded-full shadow-[0_0_10px_#63a6b0]" />
                    {title}
                </h3>
                <div className="px-3 py-1 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[#63a6b0] text-xs font-mono tracking-wider">
                    Total: {total}
                </div>
            </div>

            <div className="w-full h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsFunnel>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Funnel
                            dataKey="value"
                            data={data}
                            isAnimationActive
                        >
                            <LabelList
                                position="right"
                                fill="#fff"
                                stroke="none"
                                dataKey="name"
                                className="text-xs font-bold tracking-wide fill-gray-300"
                            />
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                            ))}
                        </Funnel>
                    </RechartsFunnel>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
