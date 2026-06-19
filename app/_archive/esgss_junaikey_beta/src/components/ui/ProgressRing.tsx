import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

const DEFAULT_SIZE = 128;
const DEFAULT_STROKE_WIDTH = 8;
const ANIMATION_DURATION = 1.8;
const DROP_SHADOW_BLUR = 8;
const DROP_SHADOW_OPACITY = 0.4;

const BEZIER_X1 = 0.4;
const BEZIER_Y1 = 0;
const BEZIER_X2 = 0.2;
const BEZIER_Y2 = 1;
const ENTRANCE_DELAY = 0.5;
const ALPHA_05 = 0.5;
const SCALE_HALF = 0.5;

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  label = 'Trust Score',
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Ring (Liquid In-fill) */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#0df2ee"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: ANIMATION_DURATION,
            ease: [BEZIER_X1, BEZIER_Y1, BEZIER_X2, BEZIER_Y2],
          }}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 ${DROP_SHADOW_BLUR}px rgba(13, 242, 238, ${DROP_SHADOW_OPACITY}))`,
          }}
        />
      </svg>
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-black text-white glow-text-tiffany leading-none font-display"
          initial={{ opacity: 0, scale: SCALE_HALF }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: ENTRANCE_DELAY }}
        >
          {Math.round(value)}
        </motion.span>
        {label && (
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
