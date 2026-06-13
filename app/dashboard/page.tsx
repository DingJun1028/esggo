'use client';

import React, { useState, useEffect } from 'react';
import { OmniTable, OmniTableDataRow } from '@/components/omni/OmniTable';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniCard } from '@/components/omni/OmniCard';
import { RecordLifecycleStatus, AttentionStatus } from '@/shared-types/status';
import { Leaf, Droplets, Zap, ShieldAlert, BarChart3, Fingerprint, FileText, Settings, Search, Bell } from 'lucide-react';

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
    timestamp: new Date(1718300000000 - 86400000).toISOString()
  }
];

export default function DashboardPage() {
  const [data, setData] = useState<OmniTableDataRow[]>(mockData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬 API 載入時間 (API Fetch Simulation)
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen p-4 md:p-8 w-full bg-[#020617] text-slate-200 animate-in fade-in duration-700 relative overflow-hidden">
      {/* 5T Protocol 背景光暈 */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-mono font-black tracking-[0.2em] text-cyan-400 uppercase">ESG Data Vault</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
              全域數據金庫
            </h1>
            <p className="text-slate-400 mt-3 text-sm max-w-xl">
              OmniCore Data Routing & 5T Integrity Audit Workflow. 確保所有數據具備 Transparent (透明)、Trustworthy (不可竄改) 與 Traceable (可溯源) 的至高標準。
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
              <span className="text-xs text-slate-400 font-mono">ZKP 零知識證明封裝率</span>
              <span className="text-xl font-bold text-cyan-400">99.9%</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">確保資料具備 100% 不可篡改性</span>
          </div>
        </header>

        {/* 行動端特優化：橫向滑動式 極小功能鍵 (Horizontal Swipeable Micro-Action Dock) */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-3 px-2">快速操作 (Quick Actions)</h3>
          <div className="w-full overflow-x-auto pb-4 mb-6 scrollbar-hide snap-x snap-mandatory">
          <div className="flex items-center gap-3 md:gap-4 min-w-max px-2">
            {[
              { icon: BarChart3, label: 'Analytics', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { icon: Fingerprint, label: 'Audit Trail', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              { icon: FileText, label: 'GRI Reports', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              { icon: Bell, label: 'Alerts', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
              { icon: Search, label: 'Data Mining', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              { icon: Settings, label: 'Matrix Config', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
            ].map((action, idx) => (
              <button 
                key={idx}
                className={`snap-start flex flex-col items-center justify-center min-w-[80px] md:min-w-[100px] h-20 md:h-24 rounded-2xl border ${action.border} ${action.bg} hover:bg-white/5 transition-all duration-300 backdrop-blur-md group relative overflow-hidden`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-${action.color.split('-')[1]}-500/20 to-transparent`} />
                <action.icon size={20} className={`${action.color} mb-2 group-hover:scale-110 transition-transform duration-300`} />
                <span className="text-[10px] md:text-xs font-bold text-slate-300 tracking-wider uppercase">{action.label}</span>
              </button>
            ))}
            </div>
          </div>
        </div>

        {/* 萬能卡片網格佈局 (OmniCard CSS Grid - Panoramic View) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OmniCard
            uuid="vlt-scope1-001"
            componentVersion="8.5.0-Alpha"
            timestamp={1718300000000}
            status={RecordLifecycleStatus.Draft}
            title="Scope 1 Emissions"
            evidence={{
              source_origin: 'ERP_System_A',
              flow_path: ['IoT Sensor X1', 'ERP_System_A', 'OmniCore Gateway'],
              hash: '0xabc123...890def',
              timestamp: 1718300000000
            }}
            nodeName="OMNI-ENV-SCOPE1-01:ACTION-RECORD-ISO14064"
          >
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white">450.2</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">tCO2e</span>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]">
                <Leaf size={28} />
              </div>
            </div>
          </OmniCard>

          <OmniCard
            uuid="vlt-water-002"
            componentVersion="8.5.0-Alpha"
            timestamp={1718300000000}
            status={RecordLifecycleStatus.Archived}
            isLocked={true}
            title="Water Usage"
            evidence={{
              source_origin: 'Facility_Manager_Upload',
              flow_path: ['Meter Readings', 'Facility_Manager_Upload', 'ZKP OmniRouter'],
              hash: '0x456def...123abc',
              timestamp: 1718300000000
            }}
            nodeName="OMNI-ENV-WATER-02:ACTION-VERIFY-ISO14046"
          >
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-cyan-400">8,205</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Cubic Meters</span>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]">
                <Droplets size={28} />
              </div>
            </div>
          </OmniCard>

          <OmniCard
            uuid="vlt-energy-003"
            componentVersion="8.5.0-Alpha"
            timestamp={1718300000000}
            status={RecordLifecycleStatus.Draft}
            attention={AttentionStatus.Critical}
            title="Energy Grid (Anomaly)"
            evidence={{
              source_origin: 'Smart_Grid_API',
              flow_path: ['Smart_Grid_API', 'Anomaly Detection Core'],
              hash: '',
              timestamp: 1718300000000
            }}
            nodeName="OMNI-ENV-ENERGY-03:ACTION-ALERT-ISO50001"
          >
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-rose-500">12.5M</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">kWh (Spike Detected)</span>
              </div>
              <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/20 text-rose-500 shadow-[inset_0_0_15px_rgba(244,63,94,0.15)] animate-pulse">
                <Zap size={28} />
              </div>
            </div>
          </OmniCard>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white tracking-wide">Data Ledger (資料溯源帳本)</h3>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
              <span>Sync Status</span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </button>
          </div>
          <OmniBaseCard variant="glass" className="border-white/10 bg-black/40 overflow-hidden relative">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <span className="text-slate-400 font-mono text-sm animate-pulse">Synchronizing OmniMemorySync...</span>
              </div>
            ) : (
              <OmniTable data={data} onSealAction={handleSealAction} />
            )}
          </OmniBaseCard>
        </div>
      </div>
    </div>
  );
}
