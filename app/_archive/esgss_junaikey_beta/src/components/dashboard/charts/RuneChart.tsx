import React, { memo, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui';

// ==================== CONSTANTS ====================
const CHART_DATA = [
  { name: '1月', uv: 4000, pv: 2400, amt: 2400 },
  { name: '2月', uv: 3000, pv: 1398, amt: 2210 },
  { name: '3月', uv: 2000, pv: 9800, amt: 2290 },
  { name: '4月', uv: 2780, pv: 3908, amt: 2000 },
  { name: '5月', uv: 1890, pv: 4800, amt: 2181 },
  { name: '6月', uv: 2390, pv: 3800, amt: 2500 },
  { name: '7月', uv: 3490, pv: 4300, amt: 2100 },
];

const CHART_MARGIN = { top: 10, right: 30, left: 0, bottom: 0 } as const;
const TOOLTIP_STYLE = {
  borderRadius: '8px',
  border: 'none',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
} as const;

// ==================== MAIN COMPONENT ====================
export const RuneChart = memo(() => {
  const tickFormatter = useMemo(() => (value: number) => `${value}t`, []);

  const tableRows = useMemo(
    () =>
      CHART_DATA.map(row => (
        <tr key={row.name}>
          <td>{row.name}</td>
          <td>{row.uv}</td>
        </tr>
      )),
    []
  );

  return (
    <Card className="p-6 overflow-hidden relative" role="region" aria-labelledby="rune-chart-title">
      <header className="mb-4">
        <h3 id="rune-chart-title" className="font-bold text-lg text-slate-800 dark:text-slate-100">
          碳排放趨勢 (Rune Flow)
        </h3>
        <p className="text-sm text-slate-500">GRI 305: 直接與間接溫室氣體排放</p>
      </header>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={CHART_DATA as any}
            margin={CHART_MARGIN}
            aria-label="碳排放趨勢圖，顯示1月至7月的排放數值波動，6月有顯著回升。"
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#cbd5e1"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#cbd5e1"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={tickFormatter}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorUv)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>碳排放月度數據表</caption>
        <thead>
          <tr>
            <th scope="col">月份</th>
            <th scope="col">排放量 (噸)</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </Card>
  );
});

RuneChart.displayName = 'RuneChart';
