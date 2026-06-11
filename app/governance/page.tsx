'use client';

import React, { useState, useMemo } from 'react';
import { useESGAtoms } from '@/lib/supabase/hooks';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { useOmniAgentBus } from '@/lib/omni-agent-bus';
import { ESGSmartQA } from '@/components/ui/ESGSmartQA';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { Landmark, Plus, Download, ShieldCheck, Scale, FileSignature, ShieldAlert, Award, FileText } from 'lucide-react';

// === Jules Karma Protocol: Performance Optimization with React.memo ===
const MetricCard = React.memo(({ title, value, unit, icon: Icon, trend, colorClass }: any) => (
  <OmniBaseCard variant="default" className="p-6 transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
          <Award size={14} /> {trend}
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

export default function GovernanceDashboard() {
  const [activeTab, setActiveTab] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatchBus = useOmniAgentBus((state: any) => state.dispatch);
  const { data: dbAtoms, loading } = useESGAtoms('governance');

  const [localData, setLocalData] = useState([
    { id: 1, category: '董事會與高管', metric: '女性董事席次佔比', value: '40%', target: '30%', status: 'Sealed' },
    { id: 2, category: '商業道德', metric: '反貪腐政策培訓完成率', value: '100%', target: '100%', status: 'Sealed' },
    { id: 3, category: '資訊安全', metric: '5T 協議資料加密覆蓋率', value: '98.5%', target: '100%', status: 'Pending' },
    { id: 4, category: '風險管理', metric: '重大 ESG 風險鑑別完成度', value: '100%', target: '100%', status: 'Sealed' },
    { id: 5, category: '供應鏈治理', metric: '高風險供應商稽核率', value: '85%', target: '90%', status: 'Pending' },
  ]);

  // Use database atoms, or fallback to local interactive data if database is empty or still loading
  const governanceData = useMemo(() => {
    if (!loading && dbAtoms && dbAtoms.length > 0) {
      return dbAtoms;
    }
    return localData;
  }, [dbAtoms, loading, localData]);

  const handleAddRecord = () => {
    const newRecord = {
      id: Date.now(),
      category: '風險管理',
      metric: `自動偵測：ISO 27001 內部稽核缺失項目數 (Q${Math.floor(Math.random() * 4) + 1})`,
      value: `${Math.floor(Math.random() * 3)} 項`,
      target: '0 項',
      status: 'Pending'
    };
    setLocalData([newRecord, ...localData]);
    dispatchBus('OBSERVE', 'GovernanceDashboard', '自動載入內部稽核缺失項目。');
  };

  const filteredData = useMemo(() => {
    return activeTab === 'All' ? governanceData : governanceData.filter(d => d.category === activeTab);
  }, [governanceData, activeTab]);

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
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center border border-amber-200 shadow-sm">
              <Landmark className="text-amber-600" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-bold rounded">TCFD / SASB</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Corporate Governance</span>
              </div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white dark:text-slate-100 tracking-tight">公司治理與商業道德</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">管理董事會結構、法規遵循與風險控制，資料以 5T 協議防篡改封印</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton variant="outline" icon={<Download size={16}/>} onClick={handleExport} isLoading={isProcessing}>
              匯出治理報告
            </OmniButton>
            <OmniButton variant="primary" icon={<Plus size={16}/>} className="!bg-amber-600 hover:!bg-amber-700" onClick={handleAddRecord}>
              自動載入新紀錄
            </OmniButton>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
            title="ESG 治理評級 (Score)" 
            value="A+" 
            unit="等級" 
            icon={Award} 
            trend="維持頂級" 
            colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          />
          <MetricCard 
            title="董事會獨立董事佔比" 
            value="60" 
            unit="%" 
            icon={Scale} 
            colorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          />
          <MetricCard 
            title="反貪腐培訓完成率" 
            value="100" 
            unit="%" 
            icon={FileSignature} 
            colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <MetricCard 
            title="5T 協議稽核涵蓋率" 
            value="98.5" 
            unit="%" 
            icon={ShieldAlert} 
            colorClass="bg-slate-200 text-slate-600 dark:text-slate-400"
          />
        </div>

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OmniBaseCard variant="default" className="p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">治理核心指標清冊</h2>
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1">
                  {['All', '董事會與高管', '商業道德', '資訊安全', '風險管理'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-900/50 text-amber-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 text-xs uppercase text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-bold">治理面向</th>
                      <th className="px-6 py-4 font-bold">指標描述</th>
                      <th className="px-6 py-4 font-bold text-right">當前表現</th>
                      <th className="px-6 py-4 font-bold text-right">法規/內部目標</th>
                      <th className="px-6 py-4 font-bold text-center">5T 狀態</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-900/50">
                    {filteredData.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm font-bold text-slate-600 dark:text-slate-400">{row.category}</td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{row.metric}</td>
                        <td className="px-6 py-4 text-sm font-black text-amber-600 text-right">{row.value}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 text-right">{row.target}</td>
                        <td className="px-6 py-4 text-center">
                          {row.status === 'Sealed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                              <ShieldCheck size={14}/> 已封印
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200">
                              <FileText size={14}/> 待簽核
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
            <OmniBaseCard variant="default" className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Landmark className="text-amber-100" size={24} />
                <h3 className="font-bold text-lg">OmniAgent 風險預警</h3>
              </div>
              <div className="space-y-4 text-sm text-amber-50">
                <p>
                  偵測到您的 <strong>高風險供應商稽核率 (85%)</strong> 低於年度目標設定 (90%)。
                </p>
                <div className="p-3 bg-white/10 dark:bg-white/5 rounded-lg backdrop-blur-sm border border-white/20">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldAlert size={16}/> 建議採取行動
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-xs">
                    <li>啟動 OmniAgent 供應商自動化追查程序。</li>
                    <li>發送合規聲明書 (Compliance Declaration) 至未稽核廠商。</li>
                    <li>重新檢視供應鏈管理政策，並於下季董事會報告。</li>
                  </ul>
                </div>
                <OmniButton variant="outline" className="w-full mt-4 bg-white/10 dark:bg-white/5 border-white/20 hover:bg-white/20 dark:bg-white/10 text-white">
                  生成供應商改善計畫 (CAP)
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
