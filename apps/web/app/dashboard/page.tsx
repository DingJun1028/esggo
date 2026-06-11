'use client';

import React, { useState } from 'react';
import { OmniTable, OmniTableDataRow } from '@/components/omni/OmniTable';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';

const mockData: OmniTableDataRow[] = [
  {
    id: 'esg-001',
    source_origin: 'ERP_System_A',
    formula_visibility: true,
    zkp_sealed: true,
    status: 'Verified',
    content: 'Scope 1 Direct Emissions',
    value: '450.2 tCO2e',
    timestamp: new Date().toISOString(),
    hash: '0xabc123...890def'
  },
  {
    id: 'esg-002',
    source_origin: 'Supplier_API_Node',
    formula_visibility: true,
    zkp_sealed: false,
    status: 'Pending',
    content: 'Scope 3 Purchased Goods',
    value: '1,205.8 tCO2e',
    timestamp: new Date().toISOString()
  },
  {
    id: 'esg-003',
    source_origin: 'Legacy_CSV_Upload',
    formula_visibility: false,
    zkp_sealed: false,
    status: 'Void',
    content: 'Unverified Water Usage',
    value: '890 m3',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function DashboardPage() {
  const [data, setData] = useState<OmniTableDataRow[]>(mockData);

  const handleSealAction = async (id: string) => {
    // 模擬 ZKP 封裝過程 (ZKP Cryptographic Sealing)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setData(prev => prev.map(row => 
      row.id === id 
        ? { ...row, zkp_sealed: true, status: 'Verified', hash: '0x' + Math.random().toString(16).substring(2, 10) + '...sealed' }
        : row
    ));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 w-full bg-[#020617] text-slate-200 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">全域數據治理中心</h1>
          <p className="text-slate-400 mt-2 font-mono text-sm">OmniTable Data Routing & 5T Integrity Audit Workflow</p>
        </header>

        <OmniBaseCard variant="glass" className="border-cyan-500/20 bg-black/40">
          <OmniTable data={data} onSealAction={handleSealAction} />
        </OmniBaseCard>
      </div>
    </div>
  );
}
