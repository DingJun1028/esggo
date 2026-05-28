'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, HeartHandshake, ShieldAlert, BookOpen, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { StandardPage, BrandCard, BrandTable } from '../../components/brand';

export default function SocialPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sealingId, setSealingId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching from Supabase social_metrics table
    setTimeout(() => {
      setMetrics([
        { id: '1', year: 2023, employees: 1250, femaleRatio: '45.2%', fr: 1.2, trainingHours: 24.5, hashLock: null },
        { id: '2', year: 2022, employees: 1100, femaleRatio: '42.8%', fr: 1.5, trainingHours: 21.0, hashLock: '0xd3e5f2a1b4c6e9d8c7' },
        { id: '3', year: 2021, employees: 950, femaleRatio: '40.0%', fr: 2.1, trainingHours: 18.5, hashLock: '0xa1b2c3d4e5f6g7h8i9' },
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
          sealType: '5t-social',
          sourceOrigin: 'social-module'
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
    id: 'social-module',
    title: '社會影響 Social Metrics',
    subtitle: '管理勞工結構、DEI 多元化、職安與員工培訓數據，落實企業社會責任。',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'] as any,
    icon: <Users size={32} />,
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
                <UserPlus size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">總員工人數</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,250 <span className="text-sm font-normal text-gray-500">人</span></p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-lg">
                <HeartHandshake size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">女性員工比例</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">45.2 <span className="text-sm font-normal text-gray-500">%</span></p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                <ShieldAlert size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">職安失能傷害頻率(FR)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1.2</p>
              </div>
            </BrandCard>
            <BrandCard padding="md" className="flex items-center gap-4 border border-gray-200 dark:border-white/10 dark:bg-void-stark/50">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">平均受訓時數</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24.5 <span className="text-sm font-normal text-gray-500">小時/人</span></p>
              </div>
            </BrandCard>
          </div>
        )
      },
      {
        id: 'data-table',
        title: '年度社會影響力紀錄表',
        columns: 12 as const,
        component: (
          <BrandCard padding="none" className="overflow-hidden border border-gray-200 dark:border-white/10">
             <BrandTable 
               loading={loading} 
               columns={[
                 { label: '年度', key: 'year' }, 
                 { label: '總員工人數', key: 'employees' }, 
                 { label: '女性員工比例', key: 'femaleRatio' },
                 { label: '失能傷害頻率 (FR)', key: 'fr' },
                 { label: '平均受訓時數', key: 'trainingHours' },
                 { label: 'T5 Hash Lock', key: 'hash' },
                 { label: '操作', key: 'action' }
               ]}
               data={metrics.map(m => ({
                 year: <span className="font-bold text-gray-900 dark:text-gray-100">{m.year}</span>,
                 employees: <span className="text-gray-700 dark:text-gray-300">{m.employees.toLocaleString()}</span>,
                 femaleRatio: <span className="text-gray-700 dark:text-gray-300">{m.femaleRatio}</span>,
                 fr: <span className="text-gray-700 dark:text-gray-300">{m.fr}</span>,
                 trainingHours: <span className="text-gray-700 dark:text-gray-300">{m.trainingHours}</span>,
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
