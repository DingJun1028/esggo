'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, HeartHandshake, ShieldAlert, BookOpen, Lock, ShieldCheck, Loader2, X } from 'lucide-react';
import { StandardPage, BrandCard, BrandTable, BrandButton } from '../../components/brand';

export default function SocialPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    category: 'labor',
    metric_name: 'Total Employees',
    metric_value: 0,
    unit: 'person'
  });

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/metrics/social');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
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
        setMetrics(prev => prev.map(m => m.id === id ? { ...m, hash_lock: data.hashLock } : m));
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

  const handleVerify = async (id: string, sealType: string) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`/api/vault/seal?evidenceUuid=${id}&sealType=${sealType}`);
      const data = await res.json();
      if (data.success && data.decrypted) {
        alert(`✨ 5T 驗證成功！\n\n來自金庫的底層紀錄:\n${data.decrypted}`);
      } else {
        alert('❌ 驗證失敗：在金庫中找不到匹配的封印紀錄，資料可能已受損。');
      }
    } catch (e) {
      console.error(e);
      alert('連線金庫時發生錯誤');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/metrics/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: formData.year,
          category: formData.category,
          metric_name: formData.metric_name,
          metric_value: formData.metric_value,
          unit: formData.unit,
          source_origin: 'social-module',
          verified: false
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsFormOpen(false);
        fetchMetrics();
      } else {
        alert('新增失敗: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('新增紀錄時發生錯誤');
    } finally {
      setSubmitting(false);
    }
  };

  const pageConfig = {
    id: 'social-module',
    title: '社會影響 Social Metrics',
    subtitle: '管理勞工結構、DEI 多元化、職安與員工培訓數據，落實企業社會責任。',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'] as any,
    icon: <Users size={32} />,
    primaryActions: [
      { id: 'add-record', label: '新增年度數據', icon: <Plus size={16}/>, onClick: () => setIsFormOpen(true), variant: 'primary' as any }
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
          <BrandCard padding="none" className="overflow-hidden border border-gray-200 dark:border-white/10 relative">
             {isFormOpen && (
               <div className="absolute inset-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">新增社會數據</h3>
                   <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20} className="text-slate-500" /></button>
                 </div>
                 <form onSubmit={handleAddSubmit} className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">年度</label>
                       <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">指標類別</label>
                       <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">指標名稱</label>
                       <input type="text" required value={formData.metric_name} onChange={e => setFormData({...formData, metric_name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">數值</label>
                       <input type="number" required value={formData.metric_value} onChange={e => setFormData({...formData, metric_value: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">單位</label>
                       <input type="text" required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                     </div>
                   </div>
                   <div className="flex justify-end gap-3 pt-4">
                     <BrandButton variant="outline" onClick={() => setIsFormOpen(false)} type="button">取消</BrandButton>
                     <BrandButton variant="primary" type="submit" disabled={submitting}>
                       {submitting ? <Loader2 size={16} className="animate-spin" /> : '確認新增'}
                     </BrandButton>
                   </div>
                 </form>
               </div>
             )}
             <BrandTable 
               loading={loading} 
               columns={[
                 { label: '年度', key: 'year' }, 
                 { label: '指標名稱', key: 'metric_name' }, 
                 { label: '數值', key: 'metric_value' },
                 { label: '單位', key: 'unit' },
                 { label: '來源', key: 'source_origin' },
                 { label: 'T5 Hash Lock', key: 'hash' },
                 { label: '操作', key: 'action' }
               ]}
               data={metrics.map(m => ({
                 year: <span className="font-bold text-gray-900 dark:text-gray-100">{m.year}</span>,
                 metric_name: <span className="text-gray-700 dark:text-gray-300">{m.metric_name}</span>,
                 metric_value: <span className="text-gray-700 dark:text-gray-300">{m.metric_value?.toLocaleString()}</span>,
                 unit: <span className="text-gray-500 dark:text-gray-400">{m.unit}</span>,
                 source_origin: <span className="text-gray-500 dark:text-gray-400">{m.source_origin}</span>,
                 hash: m.hash_lock ? (
                   <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                     <ShieldCheck size={12} /> {m.hash_lock.substring(0, 8)}...
                   </span>
                 ) : (
                   <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                     未封印
                   </span>
                 ),
                 action: (
                   <div className="flex items-center gap-3">
                     {!m.hash_lock && (
                       <button 
                         onClick={() => handleSeal(m.id)}
                         disabled={sealingId === m.id}
                         className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
                       >
                         {sealingId === m.id ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                         T5 封印
                       </button>
                     )}
                     <button 
                       onClick={() => m.hash_lock ? handleVerify(m.id, '5t-social') : undefined}
                       disabled={verifyingId === m.id}
                       className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium transition-colors"
                     >
                       {verifyingId === m.id ? <Loader2 size={14} className="animate-spin" /> : null}
                       {m.hash_lock ? '驗證 5T' : '編輯'}
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
