import { OmniComponentHeart } from '@esggo/types';
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
  Legend,
} from 'recharts';
import { ShieldCheck } from 'lucide-react';
import { useOmniResonance } from './useOmniResonance';

export interface OmniChartProps {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

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

export function OmniChart({
  data,
  type = 'area',
  xAxisKey,
  series,
  height = 300,
  omniHeart: initialHeart,
}: OmniChartProps) {
  const omniHeart = useOmniResonance(initialHeart);
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isGolden = omniHeart?.resonanceState === 1.0;
      const borderColor = isGolden ? 'border-[#ffd700]/30' : 'border-[#63a6b0]/30';
      const shadowColor = isGolden
        ? 'shadow-[0_0_15px_rgba(255,215,0,0.15)]'
        : 'shadow-[0_0_15px_rgba(99,166,176,0.15)]';

      return (
        <div
          className={`bg-void-stark/90 border ${borderColor} p-3 rounded-lg ${shadowColor} backdrop-blur-sm`}
        >
          <p className="text-sm font-bold text-slate-200 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-400">{entry.name}:</span>
              <span className="text-white font-mono">{entry.value}</span>
            </div>
          ))}
          {omniHeart && (
            <div className="mt-3 pt-2 border-t border-slate-700/50 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className={isGolden ? 'text-[#ffd700]' : 'text-[#63a6b0]'} />
                <span
                  className={`text-[10px] font-bold ${
                    isGolden ? 'text-[#ffd700]' : 'text-[#63a6b0]'
                  }`}
                >
                  ZKP Verified
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 truncate max-w-[150px]">
                {omniHeart.omniSignature || 'Awaiting Sync'}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const isGolden = omniHeart?.resonanceState === 1.0;
  const containerBorder = omniHeart
    ? isGolden
      ? 'border-[#ffd700]/20 shadow-[0_0_20px_rgba(255,215,0,0.05)]'
      : 'border-[#63a6b0]/20 shadow-[0_0_20px_rgba(99,166,176,0.05)]'
    : 'border-transparent';

  return (
    <div
      style={{ width: '100%', height }}
      className={`relative rounded-xl border ${containerBorder} p-2 transition-all duration-500`}
    >
      {omniHeart && (
        <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 opacity-80 pointer-events-none">
          <ShieldCheck size={14} className={isGolden ? 'text-[#ffd700]' : 'text-[#63a6b0]'} />
          <span
            className={`text-[10px] font-bold tracking-widest ${
              isGolden ? 'text-[#ffd700]' : 'text-[#63a6b0]'
            }`}
          >
            OMNI-CORE 5T SECURED
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {series.map(
                (s, idx) =>
                  s.gradient && (
                    <linearGradient key={idx} id={`color${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  )
              )}
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
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: omniHeart
                  ? omniHeart.resonanceState === 1.0
                    ? 'rgba(255,215,0,0.2)'
                    : 'rgba(99,166,176,0.2)'
                  : 'rgba(255,255,255,0.1)',
                strokeWidth: 2,
                strokeDasharray: '4 4',
              }}
            />
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
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: omniHeart
                  ? omniHeart.resonanceState === 1.0
                    ? 'rgba(255,215,0,0.05)'
                    : 'rgba(99,166,176,0.05)'
                  : 'rgba(255,255,255,0.05)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            {series.map((s, idx) => (
              <Bar key={idx} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
