'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, X, ShieldCheck } from 'lucide-react';

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
        className={`bg-white rounded-xl border p-5 transition-all duration-300 cursor-pointer group ${
          sealed
            ? 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)] hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]'
            : verified
            ? 'border-slate-200 hover:shadow-md hover:border-[#003262]/20'
            : 'border-slate-200 hover:shadow-md hover:border-[#003262]/20 opacity-90 grayscale-[20%]'
        } ${className}`}
        onClick={() => {
          if (formula || sources || description) setShowDetail(true);
          onClick?.();
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sealed ? 'bg-emerald-50' : ''}`}
            style={sealed ? {} : { backgroundColor: `${color}15` }}
          >
            <span style={{ color: sealed ? '#10B981' : color }}>{icon}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {sealed ? (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold shadow-sm">
                <ShieldCheck size={12} className="text-emerald-500" />
                ZKP Sealed
              </span>
            ) : verified ? (
              <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded-full font-medium">
                5T ✓
              </span>
            ) : (
              <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium">
                Pending Seal
              </span>
            )}
            {(formula || sources || description) && (
              <Info size={12} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            )}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#0F172A]">{value}</span>
            {unit && <span className="text-xs text-slate-400">{unit}</span>}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
              {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </div>
          )}
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDetail(false)} />
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0F172A]">{label} 指標說明</h3>
              <button onClick={() => setShowDetail(false)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <X size={14} />
              </button>
            </div>
            {description && <p className="text-sm text-slate-600 mb-3">{description}</p>}
            {formula && (
              <div className="bg-[#EBF2FA] rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-[#003262] mb-1">計算公式</p>
                <p className="text-xs text-[#003262] font-mono">{formula}</p>
              </div>
            )}
            {sources && sources.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">資料來源</p>
                <ul className="space-y-1">
                  {sources.map((src, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-[#FDB515] mt-0.5">•</span>{src}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${sealed ? 'bg-emerald-400' : verified ? 'bg-green-400' : 'bg-amber-400'}`} />
              現值: <span className="font-semibold text-[#003262]">{value}{unit}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}