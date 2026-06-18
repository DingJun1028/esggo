'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const OmniKpiCard = dynamic(() => import('@/components/omni/OmniKpiCard'), { ssr: false });
const Protocol5TStrip = dynamic(() => import('@/components/omni/Protocol5TStrip'), { ssr: false });
const VaultOmniTable = dynamic(() => import('@/components/omni/VaultOmniTable'), { ssr: false });

const MOCK_RECORDS = [
  {
    id: 'rec_001',
    data: { file_name: 'ESG_Report_2025.pdf', category: '環境', status: '已驗證' },
    timestamp: '2025-12-15T10:30:00Z',
    author: 'ESG System',
    zkpHash: 'a1b2c3d4e5f6a1b2c3d4e5f6',
    fiveTStatus: [true, true, true, true, true] as [boolean, boolean, boolean, boolean, boolean],
  },
  {
    id: 'rec_002',
    data: { file_name: 'Carbon_Evidence_Q4.xlsx', category: '碳排', status: '審核中' },
    timestamp: '2025-12-20T14:00:00Z',
    author: 'Auditor',
    zkpHash: 'f6e5d4c3b2a1f6e5d4c3b2a1',
    fiveTStatus: [true, true, true, true, false] as [boolean, boolean, boolean, boolean, boolean],
  },
  {
    id: 'rec_003',
    data: { file_name: 'Social_Impact_Assessment.pdf', category: '社會', status: '已驗證' },
    timestamp: '2026-01-05T09:15:00Z',
    author: 'Reviewer',
    zkpHash: '1234567890abcdef1234567890',
    fiveTStatus: [true, true, true, false, false] as [boolean, boolean, boolean, boolean, boolean],
  },
];

export default function OmniDemoPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-12">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-400">Omni Components Demo</h1>
        <p className="text-slate-500 mt-2">Protocol5TStrip · OmniKpiCard · VaultOmniTable</p>
      </div>

      {/* Section 1: Protocol5TStrip */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-emerald-400">1. Protocol5TStrip</h2>
        <div className="max-w-md space-y-4">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-500 mb-2">All Verified</p>
            <Protocol5TStrip status={[true, true, true, true, true]} showLabels />
          </div>
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-500 mb-2">Partial (3/5)</p>
            <Protocol5TStrip status={[true, true, true, false, false]} showLabels />
          </div>
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-500 mb-2">None Verified</p>
            <Protocol5TStrip status={[false, false, false, false, false]} showLabels />
          </div>
        </div>
      </section>

      {/* Section 2: OmniKpiCard */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-blue-400">2. OmniKpiCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OmniKpiCard
            title="碳排放量"
            value="1,284"
            unit="tCO₂e"
            trend={-5.2}
            trendLabel="vs last quarter"
            fiveTStatus={[true, true, true, true, true]}
            dataSource="EPA Database"
          />
          <OmniKpiCard
            title="治理評分"
            value="92"
            unit="/100"
            trend={3.1}
            trendLabel="vs last audit"
            fiveTStatus={[true, true, true, true, false]}
            dataSource="Internal Audit"
          />
          <OmniKpiCard
            title="供應鏈合規"
            value="87"
            unit="%"
            trend={-1.8}
            trendLabel="vs last month"
            fiveTStatus={[true, true, false, false, false]}
            dataSource="SCM System"
          />
        </div>
      </section>

      {/* Section 3: VaultOmniTable */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-amber-400">3. VaultOmniTable</h2>
        <VaultOmniTable
          columns={[
            { key: 'file_name', label: 'File Name' },
            { key: 'category', label: 'Category' },
            { key: 'status', label: 'Status' },
          ]}
          records={MOCK_RECORDS}
        />
      </section>
    </div>
  );
}
