"use client";

import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';
import { IVirtueFingerprint } from '@/core/omni-types';

interface VirtueHexChartProps {
    virtues: IVirtueFingerprint;
    size?: number;
    showLabels?: boolean;
}

/**
 * 📊 VirtueHexChart (六德雷達圖)
 * 
 * 使用 Recharts 實作的六維職能導圖，展示「智、仁、勇、誠、節、和」的平衡狀態。
 * 貫徹「可感知 (Tangible)」原則，讓用戶直觀感受全人成長。
 */
export const VirtueHexChart: React.FC<VirtueHexChartProps> = ({
    virtues,
    size = 300,
    showLabels = true
}) => {
    // 轉換資料格式以符合 Recharts 需求
    const data = [
        { subject: '智 (Wis)', A: virtues.wisdom, fullMark: 100 },
        { subject: '仁 (Ben)', A: virtues.benevolence, fullMark: 100 },
        { subject: '勇 (Cou)', A: virtues.courage, fullMark: 100 },
        { subject: '誠 (Int)', A: virtues.integrity, fullMark: 100 },
        { subject: '節 (Mod)', A: virtues.moderation, fullMark: 100 },
        { subject: '和 (Har)', A: virtues.harmony, fullMark: 100 },
    ];

    return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-inner">
            <ResponsiveContainer width="100%" height={size}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#63a6b0" strokeOpacity={0.2} />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Virtues"
                        dataKey="A"
                        stroke="#63a6b0"
                        fill="#63a6b0"
                        fillOpacity={0.4}
                        dot={{ r: 4, fill: '#63a6b0' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
