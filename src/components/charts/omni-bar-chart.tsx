'use client';

import React, { useState, useMemo } from 'react';
import { OmniBarChartProps, ChartDataPoint } from '@/types/esg-charts';
import { Lock } from 'lucide-react';

// Static configuration hoisted outside the component to avoid memory reallocation
const DEFAULT_COLOR = 'var(--accent-teal)';
const PADDING = { top: 40, right: 20, bottom: 40, left: 50 };
const VIEWBOX_WIDTH = 600;
const GRAPH_WIDTH = VIEWBOX_WIDTH - PADDING.left - PADDING.right;

export function OmniBarChart({
  title,
  description,
  data,
  proof,
  height = 300,
  width = '100%',
  xAxisLabel,
  yAxisLabel
}: OmniBarChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const graphHeight = Number(height) - PADDING.top - PADDING.bottom;

  // Memoize dynamic layout calculations to prevent O(N) operations on every mouse movement
  const { maxValue, barWidth, barSpacing } = useMemo(() => {
    if (!data || data.length === 0) return { maxValue: 1, barWidth: 0, barSpacing: 0 };

    const maxVal = Math.max(...data.map((d) => d.value), 1); // Avoid division by zero
    const calculatedBarWidth = Math.min((GRAPH_WIDTH / data.length) * 0.6, 40);
    const calculatedBarSpacing = (GRAPH_WIDTH - calculatedBarWidth * data.length) / (data.length + 1);

    return {
      maxValue: maxVal,
      barWidth: calculatedBarWidth,
      barSpacing: calculatedBarSpacing,
    };
  }, [data]);

  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <div className="flex flex-col gap-2 w-full" style={{ width }}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-textPrimary font-bold text-base">{title}</h4>
          {description && <p className="text-textSecondary text-xs">{description}</p>}
        </div>
        {/* 5T Trustworthy Label */}
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
            setMousePos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
          }}
        >
          {/* Grid Lines & Y-Axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = PADDING.top + graphHeight * (1 - ratio);
            const val = (maxValue * ratio).toFixed(1);
            return (
              <g key={`grid-${ratio}`}>
                <line 
                  x1={PADDING.left}
                  y1={y} 
                  x2={VIEWBOX_WIDTH - PADDING.right}
                  y2={y} 
                  stroke="currentColor" 
                  className="text-borderColor/30" 
                  strokeDasharray="4,4" 
                />
                <text 
                  x={PADDING.left - 10}
                  y={y + 4} 
                  textAnchor="end" 
                  fontSize="10" 
                  className="fill-textSecondary"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {yAxisLabel && (
            <text 
              x={10} 
              y={PADDING.top - 15}
              fontSize="10" 
              className="fill-textSecondary font-bold"
            >
              {yAxisLabel}
            </text>
          )}

          {/* Bars */}
          {data.map((point, index) => {
            const x = PADDING.left + barSpacing + (index * (barWidth + barSpacing));
            const barHeight = (point.value / maxValue) * graphHeight;
            const y = PADDING.top + graphHeight - barHeight;
            
            const isHovered = hoveredPoint?.label === point.label;
            
            return (
              <g key={`bar-${index}`}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={point.color || DEFAULT_COLOR}
                  className={`transition-all duration-300 ease-in-out cursor-pointer ${isHovered ? 'opacity-80' : 'opacity-100'}`}
                  rx={4} // Rounded corners
                  onMouseEnter={() => setHoveredPoint(point)}
                />
                <text
                  x={x + barWidth / 2}
                  y={PADDING.top + graphHeight + 15}
                  textAnchor="middle"
                  fontSize="10"
                  className={`transition-colors ${isHovered ? 'fill-textPrimary font-bold' : 'fill-textSecondary'}`}
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          {xAxisLabel && (
            <text 
              x={VIEWBOX_WIDTH / 2}
              y={height - 5} 
              textAnchor="middle" 
              fontSize="10" 
              className="fill-textSecondary font-bold"
            >
              {xAxisLabel}
            </text>
          )}
        </svg>

        {/* Tooltip Overlay */}
        {hoveredPoint && (
          <div 
            className="absolute z-10 bg-primary/95 backdrop-blur border border-borderColor shadow-lg rounded px-3 py-2 text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ 
              left: mousePos.x, 
              top: mousePos.y - 10 
            }}
          >
            <div className="font-bold text-textPrimary mb-1">{hoveredPoint.label}</div>
            <div className="text-accentTeal font-mono text-sm">{hoveredPoint.value}</div>
          </div>
        )}
      </div>
    </div>
  );
}
