
import React from 'react';
import { Info, Calculator, BookOpen, Lightbulb } from 'lucide-react';
import { UniversalLabel } from '../../types';

interface InsightTooltipProps {
  label: UniversalLabel;
  isVisible: boolean;
}

export const InsightTooltip: React.FC<InsightTooltipProps> = ({ label, isVisible }) => {
  if (!isVisible || (!label.definition && !label.formula && !label.rationale)) return null;

  return (
    <div 
        className="absolute bottom-full left-0 z-50 w-72 mb-2 p-0 rounded-xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-xl animate-fade-in text-left pointer-events-none transform origin-bottom-left"
        role="tooltip"
        aria-live="polite"
    >
      {/* Connector Arrow */}
      <div className="absolute -bottom-2 left-4 w-4 h-4 bg-slate-900/95 border-b border-r border-white/20 transform rotate-45" />
      
      <div className="relative z-10 overflow-hidden rounded-xl">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 bg-white/5 border-b border-white/10">
            <Info className="w-4 h-4 text-celestial-emerald" aria-hidden="true" />
            <span className="text-sm font-bold text-white">{label.text}</span>
        </div>

        <div className="p-4 space-y-4">
            {/* Definition Section */}
            {label.definition && (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-celestial-blue tracking-wider">
                        <BookOpen className="w-3 h-3" aria-hidden="true" />
                        Definition
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">
                        {label.definition}
                    </p>
                </div>
            )}

            {/* Rationale Section (The "Why") */}
            {label.rationale && (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-celestial-purple tracking-wider">
                        <Lightbulb className="w-3 h-3" aria-hidden="true" />
                        Why It Matters
                    </div>
                    <div className="bg-celestial-purple/10 p-2.5 rounded-lg border border-celestial-purple/20">
                        <p className="text-xs text-gray-200 leading-relaxed font-medium">
                            {label.rationale}
                        </p>
                    </div>
                </div>
            )}

            {/* Formula Section */}
            {label.formula && (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-celestial-gold tracking-wider">
                        <Calculator className="w-3 h-3" aria-hidden="true" />
                        Calculation
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-lg border border-white/10">
                        <code className="block text-xs font-mono text-emerald-400 break-words">
                            {label.formula}
                        </code>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
