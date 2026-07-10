'use client';

import React, { useState, useMemo } from 'react';
import { LineChartProps, ChartDataPoint } from '@/types/esg-charts';
import { Lock } from 'lucide-react';

// Static configuration hoisted outside the component to avoid memory reallocation
const DEFAULT_COLOR = 'var(--accent-teal)';
const PADDING = { top: 40, right: 20, bottom: 40, left: 50 };
const VIEWBOX_WIDTH = 800;
const GRAPH_WIDTH = VIEWBOX_WIDTH - PADDING.left - PADDING.right;

export function OmniLineChart({
  title,
  description,
  data,
  proof,
  height = 300,
  width = '100%',
  xAxisLabel,
  yAxisLabel,
  smooth = true,
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const graphHeight = Number(height) - PADDING.top - PADDING.bottom;

  // Memoize expensive calculations to prevent re-running them on every mouse move
  const { points, pathD, areaD, minValue, valueRange } = useMemo(() => {
    if (!data || data.length === 0) return { points: [], pathD: '', areaD: '', minValue: 0, valueRange: 1 };

    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const minVal = Math.min(...data.map((d) => d.value), 0);
    const range = maxVal - minVal || 1;
    const stepX = data.length > 1 ? GRAPH_WIDTH / (data.length - 1) : 0;

    const mappedPoints = data.map((point, index) => {
      const x = PADDING.left + stepX * index;
      const y = PADDING.top + graphHeight - ((point.value - minVal) / range) * graphHeight;
      return { x, y, point };
    });

    const calculatedPathD = mappedPoints
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : smooth ? `S ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');

    const calculatedAreaD = `${calculatedPathD} L ${mappedPoints[mappedPoints.length - 1].x} ${PADDING.top + graphHeight} L ${mappedPoints[0].x} ${PADDING.top + graphHeight} Z`;

    return { points: mappedPoints, pathD: calculatedPathD, areaD: calculatedAreaD, minValue: minVal, valueRange: range };
  }, [data, graphHeight, smooth]);

  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <div className="flex flex-col gap-2 w-full" style={{ width }}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-textPrimary font-bold text-base">{title}</h4>
          {description && <p className="text-textSecondary text-xs">{description}</p>}
        </div>
        <div className="flex items-center gap-1 bg-primary px-2 py-1 rounded border border-borderColor/50 text-[10px] text-textSecondary font-mono">
          <Lock size={10} className="text-accentGold" />
          {proof.hashLock.substring(0, 8)}...
        </div>
      </div>

      <div className="relative w-full overflow-visible bg-surface rounded-lg border border-borderColor p-4 shadow-sm">
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = PADDING.top + graphHeight * (1 - ratio);
            const val = (minValue + valueRange * ratio).toFixed(1);
            return (
              <g key={`grid-${ratio}`}>
                <line x1={PADDING.left} y1={y} x2={VIEWBOX_WIDTH - PADDING.right} y2={y} stroke="currentColor" className="text-borderColor/30" strokeDasharray="4,4" />
                <text x={PADDING.left - 10} y={y + 4} textAnchor="end" fontSize="10" className="fill-textSecondary">{val}</text>
              </g>
            );
          })}

          {yAxisLabel && (
            <text x={10} y={PADDING.top - 15} fontSize="10" className="fill-textSecondary font-bold">{yAxisLabel}</text>
          )}

          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={DEFAULT_COLOR} stopOpacity="0.3" />
              <stop offset="100%" stopColor={DEFAULT_COLOR} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#lineGradient)" />
          <path d={pathD} fill="none" stroke={DEFAULT_COLOR} strokeWidth="2" strokeLinejoin="round" />

          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hoveredPoint?.label === p.point.label ? 5 : 3}
              fill={p.point.color || DEFAULT_COLOR}
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredPoint(p.point)}
            />
          ))}

          {xAxisLabel && (
            <text x={VIEWBOX_WIDTH / 2} y={height - 5} textAnchor="middle" fontSize="10" className="fill-textSecondary font-bold">{xAxisLabel}</text>
          )}
        </svg>

        {hoveredPoint && (
          <div
            className="absolute z-10 bg-primary/95 backdrop-blur border border-borderColor shadow-lg rounded px-3 py-2 text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: mousePos.x, top: mousePos.y - 10 }}
          >
            <div className="font-bold text-textPrimary mb-1">{hoveredPoint.label}</div>
            <div className="text-accentTeal font-mono text-sm">{hoveredPoint.value}</div>
          </div>
        )}
      </div>
    </div>
  );
}
