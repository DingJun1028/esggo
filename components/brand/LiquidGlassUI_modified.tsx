// components/brand/LiquidGlassUI_modified.tsx
'use client';
import React from 'react';

interface LiquidGlassProps {
  resonance?: number;
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark'; // New prop for theme
}

export function LiquidGlassUI({ resonance = 1.0, children, className = '', theme = 'dark' }: LiquidGlassProps) {
  const transparency = Math.round(resonance * 100);

  // Define base colors based on theme
  const baseColor = theme === 'dark' ? '0, 0, 0' : '255, 255, 255'; // Black for dark, White for light

  const refractionStyle = {
    background: `rgba(${baseColor}, ${0.1 + resonance * 0.3})`,
    backdropFilter: `blur(${12 * resonance}px)`,
    borderColor: `rgba(${baseColor}, ${0.2 * resonance})`,
    boxShadow: `0 8px 32px rgba(0, 0, 0, ${0.1 * (1 - resonance)})`,
  };

  return (
    <div
      className={`rounded-xl p-6 transition-all duration-500 ${className}`}
      style={refractionStyle}
    >
      <div className="mb-2 text-xs text-slate-500">
        Health: {transparency}%
      </div>
      {children}
    </div>
  );
}

export default LiquidGlassUI;
