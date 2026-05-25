'use client';

import React from 'react';
import { Link, Globe, Shield } from 'lucide-react';
import { BrandBadge } from '../brand';
import { cn } from '../../lib/utils';

interface Props {
  txHash?: string;
  network?: string;
  className?: string;
}

export function AnchoredBadge({ txHash, network = 'Polygon', className }: Props) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <BrandBadge variant="success" size="xs" className="font-black tracking-tighter bg-emerald-50 text-emerald-600 border-emerald-200">
        <Link size={10} className="mr-1" /> ANCHORED
      </BrandBadge>
      {txHash && (
        <div className="flex items-center gap-1 bg-slate-900/5 px-2 py-0.5 rounded-full border border-slate-200 shadow-inner group cursor-pointer hover:bg-slate-900/10 transition-colors">
          <Globe size={10} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="text-[9px] font-mono text-slate-500 font-bold">{txHash.substring(0, 10)}...</span>
        </div>
      )}
    </div>
  );
}
