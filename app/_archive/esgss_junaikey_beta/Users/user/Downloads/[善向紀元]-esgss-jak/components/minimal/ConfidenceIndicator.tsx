
import React from 'react';
import { Lock } from 'lucide-react';
import { OmniEsgConfidence } from '../../types';

export const ConfidenceIndicator: React.FC<{ level: OmniEsgConfidence; verified?: boolean; compact?: boolean }> = ({ level, verified, compact }) => {
  const getColor = () => {
    switch (level) {
      case 'high': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      case 'medium': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'low': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    }
  };

  return (
    <div className="flex items-center gap-1.5" title={`Confidence: ${level.toUpperCase()}`}>
      {verified && <Lock className={`text-emerald-400 ${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />}
      <div className={`rounded-full ${getColor()} ${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'} animate-pulse`} />
    </div>
  );
};
