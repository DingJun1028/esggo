'use client';
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../../../lib/utils';

export interface UniversalChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie';
  dataKey: string;     // The main data value for Pie
  xAxisKey?: string;   // For Line/Bar
  series?: { key: string; color: string; name?: string }[]; // For Line/Bar
  title?: string;
  className?: string;
  height?: number;
}

const COLORS = ['#06b6d4', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export function UniversalChart({
  data,
  type,
  dataKey,
  xAxisKey = 'name',
  series = [],
  title,
  className,
  height = 300
}: UniversalChartProps) {
  
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="var(--theme-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--theme-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
              itemStyle={{ color: 'var(--theme-text)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--theme-text-muted)' }} />
            {series.map((s, i) => (
              <Line 
                key={s.key} 
                type="monotone" 
                dataKey={s.key} 
                name={s.name || s.key} 
                stroke={s.color || COLORS[i % COLORS.length]} 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="var(--theme-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--theme-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
              cursor={{ fill: 'var(--theme-surface)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--theme-text-muted)' }} />
            {series.map((s, i) => (
              <Bar 
                key={s.key} 
                dataKey={s.key} 
                name={s.name || s.key} 
                fill={s.color || COLORS[i % COLORS.length]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--theme-text-muted)' }} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={dataKey}
              nameKey={xAxisKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
    }
  };

  return (
    <div className={cn("p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-base)]", className)}>
      {title && <h3 className="mb-4 text-sm font-semibold tracking-wide text-[var(--theme-text)]">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
