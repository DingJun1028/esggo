'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniComponentHeart } from '@esggo/types';

export interface OmniHeartSealProps extends React.HTMLAttributes<HTMLDivElement> {
  omniHeart: OmniComponentHeart;
  compact?: boolean;
}

export function OmniHeartSeal({ omniHeart, compact = false, className, ...props }: OmniHeartSealProps) {
  const isMaxResonance = omniHeart.resonanceState === 1.0;
  
  // V2 Light Theme (Aqua Blue & Eternal Gold)
  const baseColorClass = isMaxResonance 
    ? 'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/30 shadow-[0_0_15px_rgba(255,215,0,0.15)]' 
    : 'text-[#63a6b0] bg-[#63a6b0]/10 border-[#63a6b0]/30 shadow-[0_0_15px_rgba(99,166,176,0.1)]';

  const truncateHash = (hash: string) => {
    if (!hash || hash.length < 10) return hash;
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border font-mono tracking-tight transition-all duration-300',
        baseColorClass,
        className
      )}
      title={`OmniClass: ${omniHeart.omniClass}\nResonance: ${omniHeart.resonanceState * 100}%`}
      {...props}
    >
      {isMaxResonance ? (
        <Sparkles size={compact ? 12 : 14} className="animate-pulse" />
      ) : (
        <ShieldCheck size={compact ? 12 : 14} />
      )}
      
      {!compact && (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase leading-none mb-0.5">
            5T Secured
          </span>
          {omniHeart.omniSignature && (
            <span className="text-[8px] opacity-70 leading-none">
              {truncateHash(omniHeart.omniSignature)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
