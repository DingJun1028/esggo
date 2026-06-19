import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ShieldAlert, Factory, Truck } from 'lucide-react';

const SupplyChainRadar: React.FC = () => {
  // Mock Data for Supplier Risk
  const data = [
    { subject: 'Carbon', A: 120, B: 110, fullMark: 150 },
    { subject: 'Water', A: 98, B: 130, fullMark: 150 },
    { subject: 'Labor', A: 86, B: 130, fullMark: 150 },
    { subject: 'Governance', A: 99, B: 100, fullMark: 150 },
    { subject: 'Privacy', A: 85, B: 90, fullMark: 150 },
    { subject: 'Waste', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
          <Factory className="w-4 h-4" />
          SUPPLY CHAIN RADAR
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Supplier A
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Supplier B
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            <Radar
              name="Supplier A"
              dataKey="A"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
            />
            <Radar
              name="Supplier B"
              dataKey="B"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#374151',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Risk Alert Overlay */}
        <div className="absolute bottom-0 right-0 bg-red-500/10 border border-red-500/30 rounded p-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <div>
            <div className="text-[10px] text-red-300 font-bold">HIGH RISK DETECTED</div>
            <div className="text-[9px] text-red-400/80">Supplier B: Water Usage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainRadar;
