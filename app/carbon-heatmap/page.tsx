'use client';

import React from 'react';
import { OmniCard, OmniChart } from '@/components/ui';

export default function CarbonHeatmapPage() {
  const energyData = [
    { label: '石油', value: 25 },
    { label: '天然氣', value: 35 },
    { label: '電力', value: 20 },
    { label: '再生', value: 20 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-heading-lg mb-6">碳足跡熱點地圖</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OmniCard>
          <h2 className="text-body-lg font-semibold mb-3">能源消耗分布</h2>
          <OmniChart title="能源分布" data={energyData} type="pie" />
        </OmniCard>
        <OmniCard>
          <h2 className="text-body-lg font-semibold mb-3">碳排放趨勢</h2>
          <OmniChart
            title="年度變化"
            data={[
              { label: '2022', value: 100 },
              { label: '2023', value: 85 },
              { label: '2024', value: 70 },
            ]}
            type="line"
          />
        </OmniCard>
      </div>
    </div>
  );
}
