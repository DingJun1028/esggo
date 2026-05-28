'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Plus, Scale, ShieldCheck, Briefcase, FileWarning, Lock, Loader2 } from 'lucide-react';
import { StandardPage, BrandCard, BrandTable } from '../../components/brand';

export default function GovernancePage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sealingId, setSealingId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching from Supabase governance_metrics table
    setTimeout(() => {
      setMetrics([
        { id: '1', year: 2023, boardSize: 9, indBoardRatio: '33.3%', femaleBoardRatio: '22.2%', ethicsIncidents: 0, hashLock: null },
        { id: '2', year: 2022, boardSize: 9, indBoardRatio: '33.3%', femaleBoardRatio: '11.1%', ethicsIncidents: 1, hashLock: '0xe5d4c3b2a1987654' },
        { id: '3', year: 2021, boardSize: 7, indBoardRatio: '28.5%', femaleBoardRatio: '0.0%', ethicsIncidents: 0, hashLock: '0x9876543210abcdef' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleSeal = async (id: string) => {
    setSealingId(id);
    // Simulate API call to /api/vault/seal
    await new Promise(r => setTimeout(r, 1200));
    const randomHash = '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
    setMetrics(prev => prev.map(m => m.id === id ? { ...m, hashLock: randomHash } : m));
    setSealingId(null);
  };

  const pageConfig = {
    id: 'gov-module',
    title: '公司治理 Governance Metrics',
    subtitle: '管理董事會結構、商業道德、稅務透明與內部稽核數據，確保企業合規運營。',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'] as any,
    icon: <Landmark size={32} />,
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
              <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">董事會席次</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">9 <span className="text-sm font-normal text-gray-500">席</span></p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <Scale size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">獨立董事比例</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">33.3 <span className="text-sm font-normal text-gray-500">%</span></p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">女性董事比例</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">22.2 <span className="text-sm font-normal text-gray-500">%</span></p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                <FileWarning size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">商業道德違規案件</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0 <span className="text-sm font-normal text-gray-500">件</span></p>
              </div>
            </BrandCard>
          </div>
        )
      },
      {
        id: 'data-table',
        title: '年度公司治理紀錄表',
        columns: 12 as const,
        component: (
          <BrandCard padding="none" className="overflow-hidden border border-gray-200 dark:border-white/10">
             <BrandTable 
               loading={loading} 
               columns={[
                 { label: '年度', key: 'year' }, 
                 { label: '董事會席次', key: 'boardSize' }, 
                 { label: '獨立董事比例', key: 'indBoardRatio' },
                 { label: '女性董事比例', key: 'femaleBoardRatio' },
                 { label: '商業道德案件數', key: 'ethicsIncidents' },
                 { label: 'T5 Hash Lock', key: 'hash' },
                 { label: '操作', key: 'action' }
               ]}
               data={metrics.map(m => ({
                 year: <span className="font-bold text-gray-900 dark:text-gray-100">{m.year}</span>,
                 boardSize: <span className="text-gray-700 dark:text-gray-300">{m.boardSize}</span>,
                 indBoardRatio: <span className="text-gray-700 dark:text-gray-300">{m.indBoardRatio}</span>,
                 femaleBoardRatio: <span className="text-gray-700 dark:text-gray-300">{m.femaleBoardRatio}</span>,
                 ethicsIncidents: <span className="text-gray-700 dark:text-gray-300">{m.ethicsIncidents}</span>,
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
