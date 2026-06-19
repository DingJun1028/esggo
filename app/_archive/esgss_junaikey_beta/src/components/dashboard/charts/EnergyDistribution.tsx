import React, { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui';

// ==================== CONSTANTS ====================
const ENERGY_DATA = [
  { name: '太陽能', value: 400 },
  { name: '風力', value: 300 },
  { name: '電網 (非再生)', value: 300 },
  { name: '生質能', value: 200 },
];

const COLORS = ['#6366f1', '#a855f7', '#cbd5e1', '#ec4899'] as const;

// ==================== MAIN COMPONENT ====================
export const EnergyDistribution = memo(() => {
  const renewablePercentage = useMemo(() => {
    const total = ENERGY_DATA.reduce((sum, item) => sum + item.value, 0);
    const renewable = ENERGY_DATA.filter(item => item.name !== '電網 (非再生)').reduce(
      (sum, item) => sum + item.value,
      0
    );
    return ((renewable / total) * 100).toFixed(1);
  }, []);

  const cells = useMemo(
    () =>
      ENERGY_DATA.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={COLORS[index % COLORS.length]}
          tabIndex={0}
          role="graphics-symbol"
          aria-label={`${entry.name}: ${entry.value}`}
        />
      )),
    []
  );

  return (
    <Card className="p-6" role="region" aria-labelledby="energy-dist-title">
      <header className="mb-4">
        <h3 id="energy-dist-title" className="font-bold text-lg text-slate-800 dark:text-slate-100">
          能源分配
        </h3>
        <p className="text-sm text-slate-500">再生能源佔比: {renewablePercentage}%</p>
      </header>

      <div className="h-[300px] w-full flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart aria-label="能源來源分配圓餅圖，顯示太陽能與風力佔據主要比例。">
            <Pie
              data={ENERGY_DATA as any}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {cells}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

EnergyDistribution.displayName = 'EnergyDistribution';
