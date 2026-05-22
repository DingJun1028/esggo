'use client';

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Line, ComposedChart
} from 'recharts';

interface DataPoint {
  year: string;
  actual?: number;
  target: number;
  bau: number; // Business as Usual
}

const defaultData: DataPoint[] = [
  { year: '2021', actual: 450, target: 450, bau: 450 },
  { year: '2022', actual: 435, target: 430, bau: 465 },
  { year: '2023', actual: 410, target: 410, bau: 480 },
  { year: '2024', actual: 395, target: 385, bau: 500 },
  { year: '2025', target: 360, bau: 520 },
  { year: '2026', target: 330, bau: 540 },
  { year: '2030', target: 220, bau: 600 },
];

export function EnvironmentalTrajectory({ 
  data = defaultData, 
  title = "碳排放減量軌跡 (tCO2e)",
  unit = "tCO2e"
}: { 
  data?: DataPoint[], 
  title?: string,
  unit?: string 
}) {
  return (
    <div className="w-full" style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: '#003262' }}>{title}</h3>
        <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>單位: {unit}</span>
      </div>

      <div style={{ width: '100%', height: 'clamp(240px, 40vh, 320px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003262" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#003262" stopOpacity={0}/>
              </linearGradient>
            </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="year" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748b' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748b' }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingBottom: '20px' }}
          />
          
          {/* BAU Path */}
          <Line 
            type="monotone" 
            dataKey="bau" 
            name="BAU 趨勢 (無作為)" 
            stroke="#cbd5e1" 
            strokeDasharray="5 5" 
            dot={false} 
            strokeWidth={1}
          />

          {/* Target Path */}
          <Area 
            type="monotone" 
            dataKey="target" 
            name="SBTi 減碳目標" 
            stroke="#FDB515" 
            fill="transparent" 
            strokeWidth={2}
          />

          {/* Actual Path */}
          <Area 
            type="monotone" 
            dataKey="actual" 
            name="實際排放量" 
            stroke="#003262" 
            fillOpacity={1} 
            fill="url(#colorActual)" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#003262', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
}
