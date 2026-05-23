'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, X, ShieldCheck, ChevronRight, Hash, Database, Layers } from 'lucide-react';
import BrandFormula from './BrandFormula';
import BrandBadge from './BrandBadge';
import BrandButton from './BrandButton';

interface BrandKpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  color?: string;
  verified?: boolean;
  sealed?: boolean;
  formula?: string;
  sources?: string[];
  description?: string;
  className?: string;
  onClick?: () => void;
}

export default function BrandKpiCard({
  label,
  value,
  unit,
  trend,
  trendUp,
  icon,
  color = 'var(--primary)',
  verified = false,
  sealed = false,
  formula,
  sources,
  description,
  className = '',
  onClick,
}: BrandKpiCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        className={`glass-panel rounded-[24px] p-7 transition-all duration-700 cursor-pointer group relative overflow-hidden ${
          sealed ? 'border-emerald-100/50' : ''
        } ${className}`}
        style={{
          borderTop: sealed ? '6px solid #10B981' : `6px solid ${color}`,
          background: sealed ? 'linear-gradient(135deg, rgba(240,253,244,0.4) 0%, rgba(255,255,255,0.8) 100%)' : undefined
        }}
        onClick={() => {
          if (formula || sources || description) setShowDetail(true);
          onClick?.();
        }}
      >
        {/* Background Accent Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-200/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
        
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-500"
            style={{ 
              backgroundColor: sealed ? 'rgba(16, 185, 129, 0.08)' : `${color}08`,
              color: sealed ? '#10B981' : color,
              border: `1px solid ${sealed ? 'rgba(16, 185, 129, 0.12)' : `${color}12`}`
            }}
          >
            {icon}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {sealed ? (
              <BrandBadge variant="gold" size="sm" dot className="font-black tracking-tighter shadow-sm">ZKP_SEALED</BrandBadge>
            ) : verified ? (
              <BrandBadge variant="success" size="sm" className="font-bold">5T_VERIFIED</BrandBadge>
            ) : (
              <BrandBadge variant="warning" size="sm" className="font-bold">PENDING</BrandBadge>
            )}
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex flex-col">
            <h3 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1.5 group-hover:text-slate-500 transition-colors">{label}</h3>
            {formula && (
              <div className="opacity-40 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1">
                 <BrandFormula expression={formula} size="xs" />
              </div>
            )}
          </div>
          
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-black text-[#003262] tracking-tighter font-mono">{value}</span>
            {unit && <span className="text-sm text-slate-400 font-black uppercase tracking-[0.2em]">{unit}</span>}
          </div>

          <div className="flex items-center justify-between mt-4 pt-5 border-t border-slate-100/60">
            {trend ? (
              <div className={`flex items-center gap-1.5 text-[12px] font-black ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span className="tracking-tight">{trend}</span>
              </div>
            ) : <div />}
            
            {(formula || sources || description) && (
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-700/30 group-hover:text-blue-700 transition-all uppercase tracking-widest translate-x-2 group-hover:translate-x-0">
                 Explore <ChevronRight size={12} className="opacity-40" />
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowDetail(false)} />
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-2xl w-full overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <header className="flex items-start justify-between mb-12 relative z-10">
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#003262]/5 flex items-center justify-center text-[#003262]">
                       {icon}
                    </div>
                    <h3 className="text-3xl font-black text-[#003262] tracking-tight uppercase leading-none">{label}</h3>
                 </div>
                 <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] ml-13">Governance Proof & Provenance</p>
              </div>
              <button 
                onClick={() => setShowDetail(false)} 
                className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
               <section className="space-y-8">
                  {description && (
                    <div className="space-y-3">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Info size={14} /> Description
                       </h4>
                       <p className="text-base text-slate-600 leading-relaxed font-medium italic border-l-4 border-[#FDB515] pl-5 py-1">
                          {description}
                       </p>
                    </div>
                  )}

                  {formula && (
                    <div className="space-y-4">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Layers size={14} /> Algorithm
                       </h4>
                       <div className="bg-slate-50/50 rounded-[24px] p-6 border border-slate-100 shadow-inner">
                          <BrandFormula expression={formula} size="sm" className="w-full justify-between" />
                       </div>
                    </div>
                  )}
               </section>

               <section className="space-y-8">
                  {sources && sources.length > 0 && (
                    <div className="space-y-4">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Database size={14} /> Provenance
                       </h4>
                       <div className="space-y-3">
                         {sources.map((src, i) => (
                           <div key={i} className="text-sm text-slate-600 flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                             <div className="w-2 h-2 rounded-full bg-[#003262]" />
                             <span className="font-black text-[#003262]/80">{src}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  <div className="space-y-4">
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} /> Integrity State
                     </h4>
                     <div className={`p-6 rounded-[24px] border transition-all ${sealed ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                        <div className="flex items-center gap-3 mb-2">
                           <div className={`w-3 h-3 rounded-full animate-pulse ${sealed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                           <span className="text-[13px] font-black uppercase tracking-widest">{sealed ? '5T Sealed & Immutable' : 'Live Synchronization'}</span>
                        </div>
                        <p className="text-xs opacity-70 font-medium leading-relaxed">
                           {sealed 
                             ? 'This metric has been mathematically locked using SHA-256 hashing and verified via ZKP.' 
                             : 'This metric is currently being updated in real-time from connected data sources.'}
                        </p>
                     </div>
                  </div>
               </section>
            </div>
            
            <footer className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Snapshot Value</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-[#003262] font-mono tracking-tighter">{value}</span>
                    <span className="text-sm font-black text-slate-400 uppercase">{unit}</span>
                 </div>
              </div>
              <BrandButton variant="primary" size="lg" className="rounded-2xl h-14 px-8 shadow-xl" onClick={() => setShowDetail(false)}>
                 Close Inspector
              </BrandButton>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
