'use client';

import React, { useState } from 'react';
import { OmniPieChartProps, ChartDataPoint } from '@/types/esg-charts';
import { Lock } from 'lucide-react';

export function OmniPieChart({
  title,
  description,
  data,
  proof,
  height = 300,
  width = '100%',
  donut = true
}: OmniPieChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) return <div>No data available</div>;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  // Base SVG configuration
  const viewBoxSize = 300;
  const radius = viewBoxSize / 2 - 20;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;

  // Fallback palette
  const colors = [
    'var(--accentTeal, #63a6b0)',
    'var(--accentGold, #ffd700)',
    'var(--accentBlue, #4A90E2)',
    'var(--accentPurple, #9B51E0)',
    '#E74C3C'
  ];

  let cumulativePercent = 0;

  // SVG Arc generator
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent) * radius;
    const y = Math.sin(2 * Math.PI * percent) * radius;
    return [x, y];
  };

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

      <div className="relative w-full flex items-center justify-center bg-surface rounded-lg border border-borderColor p-4 shadow-sm">
        <svg 
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} 
          className="w-full max-w-[300px] h-full overflow-visible"
          style={{ maxHeight: height }}
          onMouseLeave={() => setHoveredPoint(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
          }}
        >
          {/* Ensure SVG rotation so it starts at top */}
          <g transform={`translate(${cx}, ${cy}) rotate(-90)`}>
            {data.map((slice, i) => {
              const slicePercent = slice.value / total;
              
              // If it's a 100% single slice, handle specially to avoid SVG arc issues
              if (slicePercent === 1) {
                return (
                  <circle
                    key={`slice-${i}`}
                    r={radius}
                    fill={slice.color || colors[i % colors.length]}
                    className={`transition-all duration-300 cursor-pointer ${hoveredPoint?.label === slice.label ? 'opacity-80 scale-105 transform-gpu' : 'opacity-100'}`}
                    onMouseEnter={() => setHoveredPoint(slice)}
                  />
                );
              }

              const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
              cumulativePercent += slicePercent;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              
              const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
              
              // Path definition for a pie slice
              const pathData = [
                `M ${startX} ${startY}`, // Move
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line to center
              ].join(' ');

              return (
                <path
                  key={`slice-${i}`}
                  d={pathData}
                  fill={slice.color || colors[i % colors.length]}
                  className={`transition-all duration-300 cursor-pointer ${hoveredPoint?.label === slice.label ? 'opacity-80 scale-105 transform-gpu origin-center' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredPoint(slice)}
                />
              );
            })}
            
            {/* Donut hole */}
            {donut && (
              <circle
                r={radius * 0.6}
                fill="var(--surface, #F0F2F5)" // matches container background
                className="pointer-events-none"
              />
            )}
          </g>
          
          {/* Centered Total (if Donut) */}
          {donut && (
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              className="fill-textPrimary font-bold text-xl pointer-events-none"
            >
              {total.toLocaleString()}
            </text>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
           {data.map((d, i) => (
             <div key={`legend-${i}`} className="flex items-center gap-2 text-xs">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color || colors[i % colors.length] }} />
               <span className={hoveredPoint?.label === d.label ? 'font-bold text-textPrimary' : 'text-textSecondary'}>
                 {d.label}
               </span>
             </div>
           ))}
        </div>

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
            <div className="text-accentTeal font-mono text-sm">{hoveredPoint.value} ({((hoveredPoint.value / total) * 100).toFixed(1)}%)</div>
          </div>
        )}
      </div>
    </div>
  );
}
