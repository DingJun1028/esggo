import React from 'react';
import { motion } from 'framer-motion';

interface RadarDataPoint {
  label: string;
  value: number; // 0-100
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  className?: string;
}

const DEFAULT_SIZE = 200;
const RADIUS_MULTIPLIER = 0.8;
const GRID_LEVELS = [0.2, 0.4, 0.6, 0.8, 1];
const FULL_PERCENT = 100;
const TIFFANY_BLUE = '#0df2ee';

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = DEFAULT_SIZE,
  className = '',
}) => {
  const numAxes = data.length;
  const angleStep = (Math.PI * 2) / numAxes;
  const center = size / 2;
  const radius = (size / 2) * RADIUS_MULTIPLIER;

  // Generate the polygon points string for the data area
  const points = data
    .map((d, i) => {
      const r = (d.value / FULL_PERCENT) * radius;
      const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid Circles */}
        {GRID_LEVELS.map(p => (
          <circle
            key={p}
            cx={center}
            cy={center}
            r={radius * p}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const x2 = center + radius * Math.cos(i * angleStep - Math.PI / 2);
          const y2 = center + radius * Math.sin(i * angleStep - Math.PI / 2);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Area (Tiffany Glass) */}
        <motion.polygon
          points={points}
          fill="rgba(13, 242, 238, 0.15)"
          stroke={TIFFANY_BLUE}
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px rgba(13, 242, 238, 0.3))` }}
        />

        {/* Data Points (Glowing Rings) */}
        {data.map((d, i) => {
          const r = (d.value / FULL_PERCENT) * radius;
          const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={TIFFANY_BLUE}
              className="shadow-[0_0_8px_#0df2ee]"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
