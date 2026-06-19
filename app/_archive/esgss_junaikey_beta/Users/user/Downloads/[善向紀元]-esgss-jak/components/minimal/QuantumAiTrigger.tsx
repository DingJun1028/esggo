
import React from 'react';
import { Sparkles } from 'lucide-react';

export const QuantumAiTrigger: React.FC<{ 
  onClick?: () => void; 
  onInternalTrigger?: () => void; 
  label?: string 
}> = ({ onClick, onInternalTrigger, label }) => {
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else if (onInternalTrigger) {
      onInternalTrigger();
    }
  };

  return (
    <button 
      onClick={handleClick}
      onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              handleClick(e as any);
          }
      }}
      className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 rounded-lg bg-celestial-purple/20 hover:bg-celestial-purple/40 text-celestial-purple border border-celestial-purple/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] transform hover:scale-110 z-20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-celestial-purple/50"
      title="AI Insight Analysis"
      aria-label={`Trigger AI Analysis for ${label || 'metric'}`}
    >
      <Sparkles className="w-3 h-3" />
    </button>
  );
};
