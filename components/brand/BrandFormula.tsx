'use client';
import React from 'react';
import { Sigma } from 'lucide-react';

interface BrandFormulaProps {
  expression: string;
  result?: string | number;
  label?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

/**
 * BrandFormula Atom
 * Standardized rendering for ESG calculation logic (Item Name as Formula)
 */
export default function BrandFormula({
  expression,
  result,
  label,
  className = '',
  size = 'sm'
}: BrandFormulaProps) {
  const sizeClasses = {
    xs: 'text-[9px] py-0.5 px-2',
    sm: 'text-[11px] py-1 px-3',
    md: 'text-xs py-2 px-4',
  };

  return (
    <div className={`inline-flex items-center gap-2 bg-slate-900/5 border border-slate-200/50 rounded-lg font-mono ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center gap-1.5 text-blue-700/60">
        <Sigma size={size === 'xs' ? 10 : 12} />
        {label && <span className="font-sans font-bold uppercase tracking-tighter mr-1">{label}:</span>}
      </div>
      <span className="text-slate-600 font-medium">
        {expression.split(/([\*\+\/\-\=])/).map((part, i) => {
          const isOperator = /[\*\+\/\-\=]/.test(part);
          return (
            <span key={i} className={isOperator ? 'text-[#FDB515] font-black px-1' : ''}>
              {part}
            </span>
          );
        })}
      </span>
      {result !== undefined && (
        <div className="ml-2 pl-2 border-l border-slate-200 flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Result</span>
          <span className="font-black text-[#003262]">{result}</span>
        </div>
      )}
    </div>
  );
}
