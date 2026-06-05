import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export interface UniversalChartProps {
  data: any[];
  type?: 'area' | 'bar';
  xAxisKey: string;
  series: {
    key: string;
    name: string;
    color: string;
    gradient?: boolean;
  }[];
  height?: number;
}

export function UniversalChart({
  data,
  type = 'area',
  xAxisKey,
  series,
  height = 300
}: UniversalChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-void-stark/90 border border-cyan-500/30 p-3 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <p className="text-sm font-bold text-slate-200 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-slate-400">{entry.name}:</span>
              <span className="text-white font-mono">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {series.map((s, idx) => (
                s.gradient && (
                  <linearGradient key={idx} id={`color${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                  </linearGradient>
                )
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(6,182,212,0.2)', strokeWidth: 2, strokeDasharray: '4 4' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            {series.map((s, idx) => (
              <Area 
                key={idx}
                type="monotone" 
                dataKey={s.key} 
                name={s.name}
                stroke={s.color} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={s.gradient ? `url(#color${s.key})` : s.color} 
                activeDot={{ r: 6, strokeWidth: 0, fill: s.color, className: 'animate-pulse' }}
              />
            ))}
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6,182,212,0.05)' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            {series.map((s, idx) => (
              <Bar 
                key={idx}
                dataKey={s.key} 
                name={s.name}
                fill={s.color} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
