'use client';

import React, { useState } from 'react';
import { OmniCard } from '@/components/ui';

export default function SupplyChainPage() {
  const [suppliers] = useState([
    { id: '1', name: '供應商 A', location: '台灣', risk: '低', score: 95 },
    { id: '2', name: '供應商 B', location: '越南', risk: '中', score: 78 },
    { id: '3', name: '供應商 C', location: '中國', risk: '高', score: 62 },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-heading-lg mb-6">供應鏈 ESG 追蹤</h1>
      <OmniCard>
        <h2 className="text-body-lg font-semibold mb-3">供應商清單</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme-border">
                <th className="text-left p-2">供應商</th>
                <th className="text-left p-2">地點</th>
                <th className="text-left p-2">風險</th>
                <th className="text-left p-2">ESG 分數</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-theme-border">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.location}</td>
                  <td className="p-2">{s.risk}</td>
                  <td className="p-2">{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OmniCard>
    </div>
  );
}
