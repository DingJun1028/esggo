'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface OmniProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string; // CSS color string e.g. '#63a6b0' or Tailwind variable
  trackColor?: string;
  title?: string;
  className?: string;
}

export function OmniProgressRing({
  percentage,
  size = 100,
  strokeWidth = 8,
  color = '#10b981', // Default emerald for success
  trackColor = '#f1f5f9', // slate-100
  title,
  className,
}: OmniProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div 
      className={cn('relative flex flex-col items-center justify-center', className)} 
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className="rotate-[-90deg]"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Custom spring-like ease
          className="transition-colors duration-300"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl font-black tracking-tight"
          style={{ color: '#003262' }} // Berkeley Blue
        >
          {percentage}%
        </motion.span>
        {title && (
          <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
