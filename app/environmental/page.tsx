'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Plus, BarChart3, Droplets, Zap, Trash2, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { StandardPage, BrandCard, BrandTable } from '../../components/brand';

export default function EnvironmentalPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sealingId, setSealingId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching from Supabase environmental_metrics table
    setTimeout(() => {
      setMetrics([
        { id: '1', year: 2023, scope1: 1250.4, scope2: 3400.2, energy: 45000, water: 1200, hashLock: null },
        { id: '2', year: 2022, scope1: 1300.1, scope2: 3600.5, energy: 48000, water: 1350, hashLock: '0x9a8b7c6d5e4f3a2b1c' },
        { id: '3', year: 2021, scope1: 1450.0, scope2: 3900.0, energy: 52000, water: 1500, hashLock: '0x1f2e3d4c5b6a798801' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleSeal = async (id: string) => {
    setSealingId(id);
    try {
      const response = await fetch('/api/vault/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidenceUuid: id,
          sealType: '5t-env',
          sourceOrigin: 'environmental-module'
        })
      });
      const data = await response.json();
      if (data.success && data.hashLock) {
        setMetrics(prev => prev.map(m => m.id === id ? { ...m, hashLock: data.hashLock } : m));
      } else {
        console.error('Seal failed:', data.error);
        alert('封印失敗，請檢查系統日誌。');
      }
    } catch (error) {
      console.error('Seal exception:', error);
      alert('無法連線至封印金庫。');
    } finally {
      setSealingId(null);
    }
  };

  const pageConfig = {
    id: 'env-module',
    title: '環境指揮 Environmental Metrics',
    subtitle: '管理溫室氣體盤查 (Scope 1~3)、能源與水資源耗用數據，即時同步至永續資料庫。',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'] as any,
    icon: <Leaf size={32} />,
    primaryActions: [
      { id: 'add-record', label: '新增年度數據', icon: <Plus size={16}/>, onClick: () => alert('開啟新增表單'), variant: 'primary' as any }
    ],
    sections: [
      {
        id: 'overview',
        title: '核心指標總覽 (2023)',
        columns: 12 as const,
        component: (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">總碳排 (Scope 1+2)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4,650.6 <span className="text-sm font-normal text-gray-500">tCO2e</span></p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">總能源消耗</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">45,000 <span className="text-sm font-normal text-gray-500">kWh</span></p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg">
                <Droplets size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">水資源取用</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,200 <span className="text-sm font-normal text-gray-500">m³</span></p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Trash2 size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">廢棄物總量</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">350.5 <span className="text-sm font-normal text-gray-500">噸</span></p>
              </div>
            </BrandCard>
          </div>
        )
      },
      {
        id: 'data-table',
        title: '年度環境數據紀錄表',
        columns: 12 as const,
        component: (
          <BrandCard padding="none" className="overflow-hidden border border-gray-200 dark:border-white/10">
             <BrandTable 
               loading={loading} 
               columns={[
                 { label: '年度', key: 'year' }, 
                 { label: 'Scope 1 (tCO2e)', key: 'scope1' }, 
                 { label: 'Scope 2 (tCO2e)', key: 'scope2' },
                 { label: '總能源 (kWh)', key: 'energy' },
                 { label: '總水耗 (m³)', key: 'water' },
                 { label: 'T5 Hash Lock', key: 'hash' },
                 { label: '操作', key: 'action' }
               ]}
               data={metrics.map(m => ({
                 year: <span className="font-bold text-gray-900 dark:text-gray-100">{m.year}</span>,
                 scope1: <span className="text-gray-700 dark:text-gray-300">{m.scope1.toLocaleString()}</span>,
                 scope2: <span className="text-gray-700 dark:text-gray-300">{m.scope2.toLocaleString()}</span>,
                 energy: <span className="text-gray-700 dark:text-gray-300">{m.energy.toLocaleString()}</span>,
                 water: <span className="text-gray-700 dark:text-gray-300">{m.water.toLocaleString()}</span>,
                 hash: m.hashLock ? (
                   <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                     <ShieldCheck size={12} /> {m.hashLock.substring(0, 8)}...
                   </span>
                 ) : (
                   <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                     未封印
                   </span>
                 ),
                 action: (
                   <div className="flex items-center gap-3">
                     {!m.hashLock && (
                       <button 
                         onClick={() => handleSeal(m.id)}
                         disabled={sealingId === m.id}
                         className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
                       >
                         {sealingId === m.id ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                         T5 封印
                       </button>
                     )}
                     <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium transition-colors">
                       {m.hashLock ? '檢視' : '編輯'}
                     </button>
                   </div>
                 )
               }))}
             />
          </BrandCard>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
