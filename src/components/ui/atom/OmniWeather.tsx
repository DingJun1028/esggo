'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Wind, Droplets, ThermometerSun } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OmniWeather: React.FC<{ className?: string }> = ({ className }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div
        className={cn(
          'h-16 w-48 animate-pulse bg-white/5 rounded-xl border border-white/10',
          className
        )}
      />
    );

  return (
    <div
      className={cn(
        'flex flex-col justify-between p-3 rounded-xl border border-cyan-500/20 bg-black/40 backdrop-blur-md shadow-[0_4px_20px_rgba(34,211,238,0.05)] transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_4px_30px_rgba(34,211,238,0.1)] group',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full group-hover:bg-amber-400/30 transition-colors duration-500" />
          <Sun className="w-8 h-8 text-amber-400 relative z-10 animate-[spin_10s_linear_infinite]" />
          <Cloud className="w-5 h-5 text-cyan-200 absolute -bottom-1 -right-1 z-20" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white tracking-tighter">28</span>
            <span className="text-sm font-bold text-cyan-400">°C</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            Taipei, TW
          </span>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-mono text-slate-300">65%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono text-slate-300">12km/h</span>
          </div>
        </div>
      </div>

      {/* AQI Footer */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between w-full">
        <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">
          Air Quality (AQI)
        </span>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-400">32 Good</span>
        </div>
      </div>
    </div>
  );
};
