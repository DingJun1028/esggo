'use client';

import { useState, useEffect, useCallback } from 'react';
import ClientLayout from '../ClientLayout';
import { Building2, Zap, RefreshCw, Shield, Edit2, Trash2 } from 'lucide-react';
import { getGovernanceMetrics, GovernanceMetric } from '../../lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandStatusDot, BrandPageHeader 
} from '../../components/brand';

const TAB_DATA: Record<string, { label: string; gri: string }> = {
  board: { label: '董事會結構', gri: 'GRI 2-9/2-10' },
  ethics: { label: '商業道德', gri: 'GRI 205' },
  tax: { label: '稅務透明', gri: 'GRI 207' },
  risk: { label: '風險管理', gri: 'GRI 2-12' },
};

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState('board');
  const [metrics, setMetrics] = useState<GovernanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGovernanceMetrics(activeTab);
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const res = await fetch(`/api/governance/insights?category=${activeTab}`);
      const data = await res.json();
      if (data.insights) setInsights(data.insights);
    } catch (e) {
      console.error(e);
      setInsights('無法取得 AI 分析');
    } finally {
      setInsightsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setInsights(null); // reset when tab changes
    fetchInsights();
  }, [activeTab, fetchInsights]);

  return (
    <ClientLayout>
      <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
        <BrandPageHeader 
          title="公司治理 Governance" 
          subtitle="G-Hub · GRI 2, 205-207 · 董事會 · 誠信 · 稅務 · 風險"
          icon={<Building2 size={24}/>}
          actions={
            <div className="flex gap-2">
               <BrandButton variant="ghost" size="sm" onClick={load} loading={loading}>
                 <RefreshCw size={14}/>
               </BrandButton>
            </div>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(TAB_DATA).map(([key, val]) => {
            return (
              <BrandCard 
                key={key} 
                padding="md" 
                className={`text-center cursor-pointer transition-all ${activeTab === key ? 'border-blue-600 bg-blue-50/50' : 'hover:border-blue-300'}`}
                onClick={() => setActiveTab(key)}
              >
                <div className="text-blue-700 mb-2 flex justify-center opacity-40"><Building2 size={18}/></div>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-widest">{val.label}</p>
                <p className="text-[10px] text-slate-400 mt-1">{val.gri}</p>
              </BrandCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <BrandCard padding="none" className="overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-slate-700">{TAB_DATA[activeTab].label} 數據</span>
                  </div>
                  <BrandBadge variant="outline">{TAB_DATA[activeTab].gri} 標準對齊</BrandBadge>
               </div>
               <div className="scroll-x-governed">
                 <BrandTable 
                   columns={[
                     { key: 'name', label: '指標名稱' },
                     { key: 'value', label: '數值' },
                     { key: 'gri', label: 'GRI' },
                     { key: 'status', label: '實證狀態' },
                   ]}
                   data={metrics.map((m, i) => ({
                     name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
                     value: (
                       <div className="flex items-end gap-1">
                          <span className="text-lg font-mono font-bold text-[#003262]">{m.metric_value?.toLocaleString() ?? '—'}</span>
                          <span className="text-[10px] font-bold text-slate-400 mb-1">{m.unit}</span>
                       </div>
                     ),
                     gri: <BrandBadge variant="outline" size="xs" className="font-mono">{m.gri_standard}</BrandBadge>,
                     status: (
                       <div className="flex items-center gap-2">
                          <BrandStatusDot status={m.verified ? 'active' : 'warning'} label={m.verified ? '已驗證' : '待驗證'} size="sm" />
                       </div>
                     ),
                   }))}
                 />
               </div>
            </BrandCard>
          </div>

          <div className="lg:col-span-4">
            <BrandCard padding="md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                   <Zap size={16} className="text-gold-500" /> AI 洞察分析
                </h4>
                <BrandButton variant="ghost" size="sm" onClick={fetchInsights} loading={insightsLoading}>
                   <RefreshCw size={14}/>
                </BrandButton>
              </div>
              {insightsLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-600 leading-relaxed italic whitespace-pre-wrap">
                   {insights || '無法產生洞察分析。'}
                </div>
              )}
            </BrandCard>
          </div>
        </div>

      </div>
    </ClientLayout>
  );
}