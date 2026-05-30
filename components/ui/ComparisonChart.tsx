import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BrandCard } from '@/components/brand';
import { Activity } from 'lucide-react';

export function ComparisonChart({ resultA, resultB }: { resultA: unknown, resultB: unknown }) {
  const data = [
    {
      name: '碳排放 (噸)',
      原始: resultA.originalValues.carbonEmissions,
      情境A: resultA.projectedValues.carbonEmissions,
      情境B: resultB.projectedValues.carbonEmissions,
    },
    {
      name: '能源消耗 (kWh)',
      原始: resultA.originalValues.energyUsage,
      情境A: resultA.projectedValues.energyUsage,
      情境B: resultB.projectedValues.energyUsage,
    },
  ];

  return (
    <BrandCard padding="lg" className="w-full h-[400px] border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#020617]/40 shadow-xl mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={20} className="text-cyan-400" />
        <h3 className="text-lg font-black uppercase tracking-widest text-white">同步策略比較分析</h3>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis dataKey="name" stroke="#ffffff80" />
          <YAxis stroke="#ffffff80" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff20', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="原始" fill="#475569" radius={[4, 4, 0, 0]} />
          <Bar dataKey="情境A" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="情境B" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </BrandCard>
  );
}
