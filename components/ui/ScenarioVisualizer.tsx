'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { BrandCard, BrandBadge, BrandProgress } from '../brand';
import { ProjectionResult } from '../../lib/digital-twin-engine';
import { cn } from '../../lib/utils';

interface Props {
  result: ProjectionResult;
}

export function ScenarioVisualizer({ result }: Props) {
  const metrics = [
    { key: 'carbonEmissions', label: '碳排放量', unit: 'tCO2e' },
    { key: 'energyUsage', label: '能源消耗', unit: 'kWh' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m) => {
          const original = result.originalValues[m.key];
          const projected = result.projectedValues[m.key];
          const diff = ((projected - original) / original) * 100;
          const isReduction = diff < 0;

          return (
            <BrandCard key={m.key} padding="md" className="border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                  <p className="text-lg font-black text-berkeley-blue">
                    {Math.round(projected).toLocaleString()} <span className="text-xs opacity-40">{m.unit}</span>
                  </p>
                </div>
                <BrandBadge variant={isReduction ? 'success' : 'error'} size="xs" className="font-bold">
                  {isReduction ? <TrendingDown size={10} className="mr-1" /> : <TrendingUp size={10} className="mr-1" />}
                  {Math.abs(Math.round(diff))}%
                </BrandBadge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                  <span>Baseline</span>
                  <span>{Math.round(original).toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(projected / (original * 1.5)) * 100}%` }} 
                    className={cn("h-full", isReduction ? "bg-emerald-500" : "bg-red-500")} 
                  />
                </div>
              </div>
            </BrandCard>
          );
        })}
      </div>

      {/* Compliance Impact */}
      <BrandCard padding="none" className="overflow-hidden border-berkeley-blue/10">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <h4 className="text-[10px] font-black text-berkeley-blue uppercase tracking-widest">法規合規衝擊分析</h4>
          <BrandBadge variant="info" size="xs">GRI 305-1 Alignment</BrandBadge>
        </div>
        <div className="p-5 space-y-4">
          {Object.entries(result.complianceProjections).map(([key, val]) => (
            <div key={key} className="flex items-start gap-4">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", val.isValid ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                {val.isValid ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-700">{key === 'carbonEmissions' ? '碳中和政策符合度' : key}</span>
                  <span className="text-xs font-black text-berkeley-blue">{val.score}%</span>
                </div>
                {val.violations.length > 0 && (
                  <p className="text-[10px] text-red-500 font-medium">⚠️ {val.violations[0]}</p>
                )}
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${val.score}%` }} className={cn("h-full", val.score > 80 ? "bg-emerald-500" : "bg-blue-500")} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </BrandCard>
    </div>
  );
}
