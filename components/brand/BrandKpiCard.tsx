'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, X, ShieldCheck, ChevronRight } from 'lucide-react';
import BrandFormula from './BrandFormula';
import BrandBadge from './BrandBadge';

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
  color = '#003262',
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
        className={`rounded-2xl p-6 transition-all duration-500 cursor-pointer group relative overflow-hidden ${
          sealed
            ? 'shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20'
            : 'hover:shadow-2xl hover:shadow-blue-900/10'
        } ${className}`}
        style={{
          background: sealed
            ? 'linear-gradient(135deg, rgba(240,253,244,0.95) 0%, #ffffff 100%)'
            : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          borderTop: sealed
            ? '4px solid #10B981'
            : `4px solid ${color}`,
        }}
        onClick={() => {
          if (formula || sources || description) setShowDetail(true);
          onClick?.();
        }}
      >
        {/* Background Accent Icon */}
        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-[0.06]">
          {icon}
        </div>

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner"
            style={{ backgroundColor: sealed ? '#ecfdf5' : `${color}10` }}
          >
            <span style={{ color: sealed ? '#10B981' : color }}>{icon}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {sealed ? (
              <BrandBadge variant="gold" size="xs" dot className="font-black tracking-tighter">ZKP_SEALED</BrandBadge>
            ) : verified ? (
              <BrandBadge variant="success" size="xs" className="font-bold">5T_VERIFIED</BrandBadge>
            ) : (
              <BrandBadge variant="warning" size="xs" className="font-bold">PENDING</BrandBadge>
            )}
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex flex-col">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1">{label}</p>
            {formula && (
              <div className="opacity-60 group-hover:opacity-100 transition-opacity mb-2">
                 <BrandFormula expression={formula} size="xs" />
              </div>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#003262] tracking-tighter tabular-nums">{value}</span>
            {unit && <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{unit}</span>}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
            {trend ? (
              <div className={`flex items-center gap-1 text-[11px] font-black ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
                {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trend}
              </div>
            ) : <div />}
            
            {(formula || sources || description) && (
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-700/40 group-hover:text-blue-700 transition-colors uppercase tracking-widest">
                 Details <ChevronRight size={10} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowDetail(false)} />
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                 <h3 className="text-lg font-black text-[#003262] leading-tight uppercase tracking-tight">{label}</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Metric Governance Details</p>
              </div>
              <button onClick={() => setShowDetail(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {description && (
              <div className="mb-6">
                 <p className="text-sm text-slate-600 leading-relaxed font-medium italic border-l-4 border-[#FDB515] pl-4">{description}</p>
              </div>
            )}

            {formula && (
              <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">計算公式 (Governance Formula)</p>
                <BrandFormula expression={formula} size="sm" className="w-full justify-between" />
              </div>
            )}

            {sources && sources.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">資料來源 (Provenance Sources)</p>
                <div className="space-y-2">
                  {sources.map((src, i) => (
                    <div key={i} className="text-xs text-slate-600 flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#003262]" />
                      <span className="font-bold">{src}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${sealed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                 <span className="text-[10px] font-black text-slate-400 uppercase">Governance State: {sealed ? 'SEALED' : 'LIVE'}</span>
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-[#003262] font-mono">{value}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
