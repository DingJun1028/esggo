
import React from 'react';
import { Wifi, Bot, Link2 } from 'lucide-react';
import { OmniEsgDataLink } from '../../types';

export const DataLinkIndicator: React.FC<{ type: OmniEsgDataLink }> = ({ type }) => {
  const styles = {
    live: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    ai: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.2)]',
    blockchain: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_8px_rgba(251,191,36,0.2)]'
  };
  const labels = { live: 'LIVE', ai: 'AGENT', blockchain: 'CHAIN' };
  const Icons = { live: Wifi, ai: Bot, blockchain: Link2 };
  const Icon = Icons[type];

  return (
    <div className={`flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all hover:scale-105 ${styles[type]}`}>
      {type === 'live' ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      ) : (
        <Icon className="w-3 h-3" />
      )}
      {labels[type]}
    </div>
  );
};
