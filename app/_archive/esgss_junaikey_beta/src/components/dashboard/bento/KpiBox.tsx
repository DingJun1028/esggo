import React, { useEffect, useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useDashboard } from '../../../contexts/DashboardContext';
// import { motion } from 'framer-motion';

const KpiBox: React.FC = () => {
  const { dateRange } = useDashboard();
  const [stats, setStats] = useState({ co2e: 15789.5, t1: true, t2: true, t3: true, t4: true });

  useEffect(() => {
    // Here we would fetch data based on dateRange
    omniLogger.info(LogCategory.SYSTEM, '[KpiBox] KpiBox: Fetching data for', dateRange);
    // Simulate fetch
    if (dateRange.start) {
      setStats(prev => ({ ...prev, co2e: 3450.1 })); // Demo value
    } else {
      setStats({ co2e: 15789.5, t1: true, t2: true, t3: true, t4: true });
    }
  }, [dateRange]);

  return (
    <div className="p-6 h-full flex flex-col justify-between relative bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="absolute top-4 right-4 flex space-x-2">
        {['T1', 'T2', 'T3', 'T4', 'T5'].map(t => (
          <div
            key={t}
            className={`px-2 py-1 rounded text-xs font-bold ${stats.t1 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700'}`}
          >
            {t}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
          Total Scope 2 Emissions
        </h3>
        <div className="mt-2 text-5xl font-extrabold text-white flex items-baseline">
          {stats.co2e.toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          <span className="ml-2 text-lg text-gray-500 font-normal">kgCO2e</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> 100% Traceable to
          Taipower
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> 100% Locked on Polygon
        </div>
        <div className="flex items-center col-span-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span> 5T Trustworthy (不可篡改)
        </div>
      </div>
    </div>
  );
};

export default KpiBox;
