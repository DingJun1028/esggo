'use client';

import React from 'react';
import { OmniChart } from '@/components/ui';
import { OmniCard } from '@/components/omni/OmniCard';
import { OmniComponentHeart } from '@esggo/types';

export default function CarbonHeatmapPage() {
  const mockHeart: OmniComponentHeart = {
    omniSignature: 'ZKP-CHART-2026-X1',
    omniClass: 'DataVisualization',
    coreContext: { actor: 'system', timestamp: Date.now() },
    resonanceState: 1.0,
    fiveTState: { tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true }
  };

  const energyData = [
    { label: '石油', value: 25 },
    { label: '天然氣', value: 35 },
    { label: '電力', value: 20 },
    { label: '再生', value: 20 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#63a6b0]">碳足跡熱點地圖 (5T Secured)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OmniCard omniHeart={mockHeart}>
          <h2 className="text-lg font-semibold mb-3 text-slate-200">能源消耗分布</h2>
          <OmniChart 
            omniHeart={mockHeart}
            data={energyData} 
            type="bar" 
            xAxisKey="label"
            series={[{ key: 'value', name: '消耗比', color: '#63a6b0' }]} 
          />
        </OmniCard>
        <OmniCard omniHeart={{...mockHeart, resonanceState: 0.5}}>
          <h2 className="text-lg font-semibold mb-3 text-slate-200">碳排放趨勢</h2>
          <OmniChart
            omniHeart={{...mockHeart, resonanceState: 0.5}}
            data={[
              { label: '2022', value: 100 },
              { label: '2023', value: 85 },
              { label: '2024', value: 70 },
            ]}
            type="area"
            xAxisKey="label"
            series={[{ key: 'value', name: '排放量', color: '#ffd700', gradient: true }]} 
          />
        </OmniCard>
      </div>
    </div>
  );
}
