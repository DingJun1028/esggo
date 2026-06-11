'use client';

import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { CarbonTrendRecord } from '../hooks/useDashboard';

interface CarbonTrendChartProps {
    data: CarbonTrendRecord[];
}

export function CarbonTrendChart({ data }: CarbonTrendChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm h-[380px] flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">碳排放量歷史趨勢</h3>
                <p className="text-sm text-slate-500">單位：公噸二氧化碳當量 (tCO2e)</p>
            </div>

            <div className="flex-1 w-full min-h-0">
                {/* ResponsiveContainer 會自動適應外層 div 的寬高 */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {/* 定義漂亮的翡翠綠漸層特效 */}
                            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {/* 背景網格線 (只顯示水平線，看起來更乾淨) */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />

                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                        />

                        <Area type="monotone" dataKey="emissions" name="碳排放量" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}