'use client';

import React, { useState, useMemo } from 'react';
import { useESGAtoms } from '@/lib/supabase/hooks';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { ESGSmartQA } from '@/components/ui/ESGSmartQA';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { Users, Plus, Download, ShieldCheck, HeartPulse, GraduationCap, Building2, TrendingUp, AlertCircle } from 'lucide-react';

// === Jules Karma Protocol: Performance Optimization with React.memo ===
const MetricCard = React.memo(({ title, value, unit, icon: Icon, trend, colorClass }: any) => (
  <OmniBaseCard variant="default" className="p-6 transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
          <TrendingUp size={14} /> {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold">{title}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-3xl font-black text-slate-800 dark:text-white dark:text-slate-100">{value}</span>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>
    </div>
  </OmniBaseCard>
));
MetricCard.displayName = 'MetricCard';

export default function SocialDashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: dbAtoms, loading } = useESGAtoms('social');

  // Use database atoms, or fallback to mock data if database is empty or still loading
  const socialData = useMemo(() => {
    if (!loading && dbAtoms && dbAtoms.length > 0) {
      return dbAtoms;
    }
    return [
      { id: 1, category: '勞工實踐', metric: '女性主管佔比', value: '32.5%', target: '35%', status: 'Sealed' },
      { id: 2, category: '健康與安全', metric: '失能傷害頻率 (LTIFR)', value: '0.85', target: '< 1.0', status: 'Sealed' },
      { id: 3, category: '培訓與發展', metric: '員工平均受訓時數', value: '42.5 小時', target: '40 小時', status: 'Sealed' },
      { id: 4, category: '社會參與', metric: '社區公益投入金額', value: '1,250 萬', target: '1,000 萬', status: 'Pending' },
      { id: 5, category: '人權保障', metric: '供應商社會責任稽核達成率', value: '94%', target: '95%', status: 'Pending' },
    ];
  }, [dbAtoms, loading]);

  const filteredData = useMemo(() => {
    return activeCategory === 'All' ? socialData : socialData.filter(d => d.category === activeCategory);
  }, [socialData, activeCategory]);

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50 dark:bg-void-stark text-slate-800 dark:text-slate-100 dark:text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
              <Users className="text-indigo-600" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-400 text-xs font-bold rounded">GRI 400</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Social Impact</span>
              </div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white dark:text-slate-100 tracking-tight">社會影響力與人力資本</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">追蹤員工福祉、職場安全與社區投資，數據受 5T 協議保護</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton variant="outline" icon={<Download size={16}/>} onClick={handleExport} isLoading={isProcessing}>
              匯出社會報告
            </OmniButton>
            <OmniButton variant="primary" icon={<Plus size={16}/>} className="!bg-indigo-600 hover:!bg-indigo-700">
              新增社會指標
            </OmniButton>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
            title="員工滿意度 (eNPS)" 
            value="48" 
            unit="分" 
            icon={HeartPulse} 
            trend="+5" 
            colorClass="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
          />
          <MetricCard 
            title="女性主管佔比" 
            value="32.5" 
            unit="%" 
            icon={Users} 
            colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          />
          <MetricCard 
            title="員工平均受訓時數" 
            value="42.5" 
            unit="小時/人" 
            icon={GraduationCap} 
            colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <MetricCard 
            title="失能傷害頻率 (LTIFR)" 
            value="0.85" 
            unit="次/百萬工時" 
            icon={AlertCircle} 
            colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          />
        </div>

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OmniBaseCard variant="default" className="p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">社會影響力指標清冊</h2>
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1">
                  {['All', '勞工實踐', '健康與安全', '培訓與發展', '社會參與'].map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeCategory === category ? 'bg-white dark:bg-slate-900/50 text-indigo-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 text-xs uppercase text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-bold">指標類別</th>
                      <th className="px-6 py-4 font-bold">具體指標 (GRI 對應)</th>
                      <th className="px-6 py-4 font-bold text-right">當前數值</th>
                      <th className="px-6 py-4 font-bold text-right">年度目標</th>
                      <th className="px-6 py-4 font-bold text-center">5T 狀態</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-900/50">
                    {filteredData.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm font-bold text-slate-600 dark:text-slate-400">{row.category}</td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{row.metric}</td>
                        <td className="px-6 py-4 text-sm font-black text-indigo-600 text-right">{row.value}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 text-right">{row.target}</td>
                        <td className="px-6 py-4 text-center">
                          {row.status === 'Sealed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                              <ShieldCheck size={14}/> 已封印
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200">
                              <AlertCircle size={14}/> 待驗證
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </OmniBaseCard>
          </div>
          
          <div className="space-y-6">
            <OmniBaseCard variant="default" className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="text-indigo-200" size={24} />
                <h3 className="font-bold text-lg">OmniAgent 洞察</h3>
              </div>
              <div className="space-y-4 text-sm text-indigo-50">
                <p>
                  本季度的 <strong>員工平均受訓時數 (42.5 小時)</strong> 已超前達成年度目標，顯示內部人才培育計畫成效顯著。
                </p>
                <div className="p-3 bg-white/10 dark:bg-white/5 rounded-lg backdrop-blur-sm border border-white/20">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Users size={16}/> 多元共融 (DEI) 建議行動
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-xs">
                    <li>推行無意識偏見 (Unconscious Bias) 培訓。</li>
                    <li>擴展女性領導力培訓梯隊 (Mentorship Program)。</li>
                    <li>優化供應商稽核問卷，納入更多人權保護條款。</li>
                  </ul>
                </div>
                <OmniButton variant="outline" className="w-full mt-4 bg-white/10 dark:bg-white/5 border-white/20 hover:bg-white/20 dark:bg-white/10 text-white">
                  生成 DEI 策略建議書
                </OmniButton>
              </div>
            </OmniBaseCard>
            
            <div className="pt-2">
              <ESGSmartQA />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
