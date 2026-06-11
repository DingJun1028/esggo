import React from 'react';
import { motion } from 'framer-motion';

export interface Protocol5TStripProps {
  status: [boolean, boolean, boolean, boolean, boolean]; // [Truth, Goodness, Beauty, Trust, Transferful]
  className?: string;
  showLabels?: boolean;
}

const T_LABELS = ['Truth', 'Goodness', 'Beauty', 'Trust', 'Transferful'];

export default function Protocol5TStrip({ status, className = '', showLabels = false }: Protocol5TStripProps) {
  const completedCount = status.filter(Boolean).length;
  const progress = (completedCount / 5) * 100;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center text-xs font-medium text-slate-400">
        <span className="flex items-center gap-2">
          <span className="text-cyan-400">5T Protocol</span>
        </span>
        <span>{completedCount} / 5</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="relative h-2 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
        />
      </div>

      {/* Segments / Labels */}
      {showLabels && (
        <div className="flex justify-between mt-1">
          {status.map((isVerified, index) => (
            <div key={index} className="flex flex-col items-center gap-1 group">
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isVerified 
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' 
                    : 'bg-slate-700'
                }`}
              />
              <span className={`text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                isVerified ? 'text-cyan-300' : 'text-slate-600 group-hover:text-slate-400'
              }`}>
                {T_LABELS[index]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
