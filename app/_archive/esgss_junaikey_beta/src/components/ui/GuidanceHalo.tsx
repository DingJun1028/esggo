import React from 'react';
import { motion } from 'framer-motion';

interface GuidanceHaloProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const GuidanceHalo: React.FC<GuidanceHaloProps> = ({
  children,
  active = true,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {active && (
        <div className="absolute inset-0 rounded-full halo-pulse pointer-events-none z-0" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GuidanceHalo;
