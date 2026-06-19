/**
 * 📊 Chart Renderer Component
 * --------------------------------------------------
 * [核心] 圖表渲染器
 * [功能] 支援折線圖、長條圖、圓餅圖、區域圖
 */

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartData } from './types';

interface ChartRendererProps {
  data: ChartData;
}

// 配色方案
const CHART_COLORS = {
  primary: '#a855f7', // purple-500
  secondary: '#3b82f6', // blue-500
  accent: '#06b6d4', // cyan-500
  success: '#10b981', // green-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
};

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ data }) => {
  const { type, data: chartData, config = {}, title } = data;

  const {
    xKey = 'name',
    yKey = 'value',
    color = CHART_COLORS.primary,
    colors = PIE_COLORS,
    showGrid = true,
    showLegend = false,
    showTooltip = true,
    height = 300,
  } = config;

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />}
            <XAxis dataKey={xKey} stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            )}
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />}
            <XAxis dataKey={xKey} stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            )}
            {showLegend && <Legend />}
            <Bar dataKey={yKey} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            )}
            {showLegend && <Legend />}
            <Pie
              data={chartData}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />}
            <XAxis dataKey={xKey} stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            )}
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );

      default:
        return <div className="text-slate-400 text-sm">不支援的圖表類型</div>;
    }
  };

  return (
    <div className="chart-container">
      {title && <h4 className="text-sm font-semibold text-slate-200 mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
