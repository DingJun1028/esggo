import React from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useDashboard } from '../../../contexts/DashboardContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3000 },
  { month: 'Mar', value: 3450 },
  { month: 'Apr', value: 2780 },
  { month: 'May', value: 1890 },
  { month: 'Jun', value: 2390 },
];

const TrendBox: React.FC = () => {
  const { setDateRange, dateRange } = useDashboard();

  const handleBarClick = (data: any) => {
    // Logic to calculate date range from month string
    omniLogger.info(LogCategory.SYSTEM, '[TrendBox] TrendBox: Bar Clicked', data);
    const year = 2024; // Hardcoded for demo
    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].indexOf(data.month);
    const start = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    const end = `${year}-${String(monthIndex + 1).padStart(2, '0')}-31`; // Simplified

    setDateRange({ start, end });
  };

  return (
    <div className="h-full p-4 flex flex-col">
      <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Monthly Emissions Trend</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} onClick={handleBarClick}>
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    dateRange.start &&
                    Object.values(entry).includes('Mar') &&
                    dateRange.start.includes('03')
                      ? '#8b5cf6'
                      : '#3b82f6'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendBox;
