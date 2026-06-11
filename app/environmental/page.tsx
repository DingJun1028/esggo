'use client';

import React, { useState, useMemo } from 'react';
import { useESGAtoms } from '@/lib/supabase/hooks';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { ESGSmartQA } from '@/components/ui/ESGSmartQA';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { Leaf, Plus, Download, ShieldCheck, Factory, Wind, Zap, AlertTriangle, TrendingDown, Brain } from 'lucide-react';

// === Jules Karma Protocol: Performance Optimization with React.memo ===
const MetricCard = React.memo(({ title, value, unit, icon: Icon, trend, colorClass }: any) => (
  <OmniBaseCard variant="default" className="p-6 transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingDown size={14} /> {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-bold">{title}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-3xl font-black text-slate-800">{value}</span>
      <span className="text-sm font-medium text-slate-500">{unit}</span>
    </div>
  </OmniBaseCard>
));
MetricCard.displayName = 'MetricCard';

export default function EnvironmentalDashboard() {
  const [activeScope, setActiveScope] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: dbAtoms, loading } = useESGAtoms('environmental');

  // Use database atoms, or fallback to mock data if database is empty or still loading
  const emissionsData = useMemo(() => {
    if (!loading && dbAtoms && dbAtoms.length > 0) {
      return dbAtoms;
    }
    return [
      { id: 1, scope: 'Scope 1', source: '固定燃燒源 (發電機)', value: 1250, unit: 'tCO2e', status: 'Sealed' },
      { id: 2, scope: 'Scope 1', source: '移動燃燒源 (公務車)', value: 320, unit: 'tCO2e', status: 'Sealed' },
      { id: 3, scope: 'Scope 2', source: '外購電力 (總部與廠區)', value: 8450, unit: 'tCO2e', status: 'Sealed' },
      { id: 4, scope: 'Scope 3', source: '員工通勤', value: 410, unit: 'tCO2e', status: 'Pending' },
      { id: 5, scope: 'Scope 3', source: '廢棄物處理', value: 185, unit: 'tCO2e', status: 'Pending' },
    ];
  }, [dbAtoms, loading]);

  const filteredData = useMemo(() => {
    return activeScope === 'All' ? emissionsData : emissionsData.filter(d => d.scope === activeScope);
  }, [emissionsData, activeScope]);

  const totalEmissions = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString();
  }, [filteredData]);

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center border border-emerald-200 shadow-sm">
              <Leaf className="text-emerald-600" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded">ISO 14064-1</span>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Environmental</span>
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">環境指揮中心 (碳盤查)</h1>
              <p className="text-slate-500 text-sm mt-1">追蹤並分析 Scope 1, 2, 3 溫室氣體排放量，數據受 5T 協議保護</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton variant="outline" icon={<Download size={16}/>} onClick={handleExport} isLoading={isProcessing}>
              匯出盤查清冊
            </OmniButton>
            <OmniButton variant="primary" icon={<Plus size={16}/>} className="!bg-emerald-600 hover:!bg-emerald-700">
              新增排放紀錄
            </OmniButton>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
            title="總溫室氣體排放量" 
            value="10,615" 
            unit="tCO2e" 
            icon={Wind} 
            trend="-4.2%" 
            colorClass="bg-slate-100 text-slate-600"
          />
          <MetricCard 
            title="範疇一 (Scope 1)" 
            value="1,570" 
            unit="tCO2e" 
            icon={Factory} 
            colorClass="bg-orange-100 text-orange-600"
          />
          <MetricCard 
            title="範疇二 (Scope 2)" 
            value="8,450" 
            unit="tCO2e" 
            icon={Zap} 
            colorClass="bg-blue-100 text-blue-600"
          />
          <MetricCard 
            title="範疇三 (Scope 3)" 
            value="595" 
            unit="tCO2e" 
            icon={Leaf} 
            colorClass="bg-emerald-100 text-emerald-600"
          />
        </div>

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OmniBaseCard variant="default" className="p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-slate-800">溫室氣體排放源清冊</h2>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {['All', 'Scope 1', 'Scope 2', 'Scope 3'].map(scope => (
                    <button
                      key={scope}
                      onClick={() => setActiveScope(scope)}
                      className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeScope === scope ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-bold">排放範疇</th>
                      <th className="px-6 py-4 font-bold">排放源描述</th>
                      <th className="px-6 py-4 font-bold text-right">排放量 (tCO2e)</th>
                      <th className="px-6 py-4 font-bold text-center">5T 狀態</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredData.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm font-bold text-slate-600">{row.scope}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{row.source}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">{row.value.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          {row.status === 'Sealed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ShieldCheck size={14}/> 已封印
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle size={14}/> 待驗證
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50">
                      <td colSpan={2} className="px-6 py-4 text-right font-bold text-slate-600">總計 (Total):</td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600 text-lg">{totalEmissions}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </OmniBaseCard>
          </div>
          
          <div className="space-y-6">
            <OmniBaseCard variant="default" className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="text-emerald-200" size={24} />
                <h3 className="font-bold text-lg">OmniAgent 洞察</h3>
              </div>
              <div className="space-y-4 text-sm text-emerald-50">
                <p>
                  根據目前的盤查數據，您的 <strong>外購電力 (Scope 2)</strong> 佔總排放量的 <strong>79.6%</strong>。
                </p>
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Zap size={16}/> 減碳建議行動
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-xs">
                    <li>評估採購綠電 (PPA) 以抵銷範疇二排放。</li>
                    <li>檢視廠區空調與照明系統效能。</li>
                    <li>導入 EMS 能源管理系統。</li>
                  </ul>
                </div>
                <OmniButton variant="outline" className="w-full mt-4 bg-white/10 border-white/20 hover:bg-white/20 text-white">
                  生成完整減碳規劃書
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
