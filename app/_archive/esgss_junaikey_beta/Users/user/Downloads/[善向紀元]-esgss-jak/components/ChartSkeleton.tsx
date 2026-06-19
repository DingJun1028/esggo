
import React from 'react';

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full rounded-2xl bg-slate-900/40 border border-white/5 p-6 animate-pulse relative overflow-hidden flex flex-col">
        {/* Title placeholder */}
        <div className="h-6 w-48 bg-white/10 rounded mb-6 shrink-0" />
        
        {/* Chart Area placeholder */}
        <div className="relative w-full flex-1">
             {/* Y-axis lines */}
             <div className="flex flex-col justify-between h-full absolute inset-0">
                 {[...Array(5)].map((_, i) => (
                     <div key={i} className="w-full h-[1px] bg-white/5" />
                 ))}
             </div>
             
             {/* Fake Bars/Area with organic shapes */}
             <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 h-[80%] opacity-50">
                 {[...Array(8)].map((_, i) => (
                     <div 
                        key={i} 
                        className="w-full mx-1 bg-white/5 rounded-t-lg transition-all" 
                        style={{ height: `${30 + Math.random() * 50}%`}} 
                     />
                 ))}
             </div>
             
             {/* Floating Pulse */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" style={{ animationDuration: '2s' }} />
        </div>
    </div>
  );
};
