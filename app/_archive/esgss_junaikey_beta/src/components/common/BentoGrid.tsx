import React from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[18rem] gap-4 ${className}`}
    >
      {children}
    </div>
  );
};

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  span?: string; // e.g., 'md:col-span-2 md:row-span-1'
  title?: string;
  icon?: React.ReactNode;
}

export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  className = '',
  span = '',
  title,
  icon,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative group overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col transition-all hover:bg-slate-800/60 hover:border-blue-500/30 ${span} ${className}`}
    >
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4 relative z-10">
          {icon && <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">{icon}</div>}
          {title && <h3 className="font-bold text-slate-200 tracking-tight">{title}</h3>}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative z-10">{children}</div>
    </motion.div>
  );
};
