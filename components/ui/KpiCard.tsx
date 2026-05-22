'use client';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  color?: string;
  verified?: boolean;
  formula?: string;
  sources?: string[];
  gri?: string;
  onClick?: () => void;
  className?: string;
}

export function KpiCard({
  label, value, unit, trend, trendUp = true,
  icon, color = '#003262', verified = false,
  formula, sources, gri, onClick, className,
}: KpiCardProps) {
  const [showFormula, setShowFormula] = useState(false);

  return (
    <>
      <div
        className={cn(
          'bg-white rounded-[14px] border border-[#e5e7eb] p-[18px] transition-shadow duration-200 hover:shadow-md',
          (onClick || formula) && 'cursor-pointer',
          className
        )}
        onClick={onClick || (formula ? () => setShowFormula(true) : undefined)}
      >
        <div className="flex justify-between items-start mb-3">
          {icon && (
            <div className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
              <span style={{ color }}>{icon}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            {trend && (
              <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-[6px]', trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                {trendUp ? <TrendingUp size={10} className="inline mr-0.5" /> : <TrendingDown size={10} className="inline mr-0.5" />}
                {trend}
              </span>
            )}
            {formula && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowFormula(true); }}
                className="w-6 h-6 rounded-full flex items-center justify-center bg-[#f3f4f6] hover:bg-[#e5e7eb] transition-colors"
              >
                <Info size={11} color="#9ca3af" />
              </button>
            )}
          </div>
        </div>

        <div className="text-[11px] text-[#9ca3af] font-semibold mb-1 uppercase tracking-wide">{label}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[26px] font-extrabold leading-none" style={{ color }}>{value}</span>
          {unit && <span className="text-[13px] text-[#6b7280] font-medium">{unit}</span>}
        </div>
        {gri && <div className="mt-2 text-[10px] text-[#9ca3af]">{gri}</div>}
      </div>

      {showFormula && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-5" onClick={() => setShowFormula(false)}>
          <div className="bg-white rounded-[20px] p-7 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[17px] font-bold text-[#1a1a2e]">{label} — 計算說明</h3>
              <button onClick={() => setShowFormula(false)} className="w-7 h-7 rounded-full bg-[#f3f4f6] flex items-center justify-center hover:bg-[#e5e7eb]">
                <X size={14} color="#374151" />
              </button>
            </div>
            {formula && (
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide mb-2">計算公式</div>
                <div className="bg-[#f8f9fb] rounded-[10px] p-4 text-[13px] text-[#374151] font-mono border border-[#e5e7eb]">
                  {formula}
                </div>
              </div>
            )}
            {sources && sources.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide mb-2">資料來源</div>
                <ul className="flex flex-col gap-1.5">
                  {sources.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-[13px] text-[#374151]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003262] flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}