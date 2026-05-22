'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Zap, RefreshCw, Shield, Scale, Receipt, AlertOctagon, Bot, ChevronRight, BarChart3 } from 'lucide-react';
import { getGovernanceMetrics, GovernanceMetric } from '../../lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandStatusDot, BrandPageHeader, StandardPage 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';

const TAB_DATA: Record<string, { label: string; gri: string; icon: React.ReactNode; color: string }> = {
  board: { label: '董事會結構', gri: 'GRI 2-9/2-10', icon: <Building2 size={20}/>, color: '#003262' },
  ethics: { label: '商業道德',  gri: 'GRI 205',     icon: <Scale size={20}/>,     color: '#8b5cf6' },
  tax:    { label: '稅務透明',  gri: 'GRI 207',     icon: <Receipt size={20}/>,   color: '#f59e0b' },
  risk:   { label: '風險管理',  gri: 'GRI 2-12',    icon: <AlertOctagon size={20}/>, color: '#ef4444' },
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
    } catch {
      setInsights('目前 AI 分析引擎正在同步治理數據，請稍後再試。建議檢視 GRI 2-9 董事會組成揭露項目。');
    } finally {
      setInsightsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setInsights(null);
    fetchInsights();
  }, [activeTab, fetchInsights]);

  const activeTabData = TAB_DATA[activeTab];

  // ── Universal Page Configuration (萬能配置) ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'governance-hub',
    title: '公司治理 Governance',
    subtitle: 'G-Hub · GRI 2, 205-207 · 董事會 · 誠信 · 稅務 · 風險管理與 AI 合規。',
    icon: <Shield size={32} />,
    griReference: 'GRI 2, 205-207',
    activeT5Tags: ['T1', 'T2', 'T3', 'T5'],
    
    primaryActions: [
      { id: 'refresh', label: '刷新數據', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'audit', label: '匯出審計報告', icon: <Building2 size={16}/>, onClick: () => alert('生成中...') }
    ],

    kpis: [
      { key: 'board', label: '獨立董事比例', value: '42', unit: '%', icon: <Building2 size={18}/>, verified: true },
      { key: 'ethics', label: '商業道德培訓', value: '100', unit: '%', icon: <Scale size={18}/>, verified: true },
      { key: 'tax', label: '實質稅率', value: '18.4', unit: '%', icon: <Receipt size={18}/>, verified: false },
      { key: 'risk', label: '高風險緩解率', value: '92', unit: '%', icon: <AlertOctagon size={18}/>, verified: true },
    ],

    sections: [
      {
        id: 'nav-grid',
        title: '治理維度導覽',
        columns: 12,
        component: (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(TAB_DATA).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`p-5 rounded-2xl border transition-all text-center group ${activeTab === key ? 'bg-[#003262] border-[#003262] shadow-lg scale-[1.02]' : 'bg-white border-slate-100 hover:border-blue-300'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors ${activeTab === key ? 'bg-white/10 text-[#FDB515]' : 'bg-slate-50 text-[#003262]'}`}>
                   {val.icon}
                </div>
                <p className={`text-sm font-bold mb-1 ${activeTab === key ? 'text-white' : 'text-slate-700'}`}>{val.label}</p>
                <p className={`text-[10px] font-medium ${activeTab === key ? 'text-white/60' : 'text-slate-400'}`}>{val.gri}</p>
              </button>
            ))}
          </div>
        )
      },
      {
        id: 'data-table',
        title: `${activeTabData.label} 指標明細`,
        subtitle: `符合 ${activeTabData.gri} 標準`,
        icon: <BarChart3 size={18}/>,
        columns: 8,
        component: (
          <BrandTable 
            loading={loading}
            columns={[
              { header: '指標名稱', key: 'name' },
              { header: '數值', key: 'value' },
              { header: 'GRI', key: 'gri' },
              { header: '狀態', key: 'status' },
            ]}
            data={metrics.map(m => ({
              name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
              value: (
                <div className="flex items-baseline gap-2">
                   <span className="text-lg font-mono font-bold text-[#003262]">{m.metric_value?.toLocaleString() ?? '—'}</span>
                   <span className="text-[10px] font-bold text-slate-400">{m.unit}</span>
                </div>
              ),
              gri: <BrandBadge variant="outline" size="xs" className="font-mono">{m.gri_standard}</BrandBadge>,
              status: <BrandStatusDot status={m.verified ? 'active' : 'warning'} label={m.verified ? '已封印' : '待覆核'} size="sm" />
            }))}
          />
        )
      },
      {
        id: 'ai-insights',
        title: '治理智慧洞察',
        subtitle: 'Governance Intelligence',
        icon: <Bot size={18}/>,
        columns: 4,
        component: (
          <div className="hermes-panel min-h-[350px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bot size={100} color="#fff" />
             </div>
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6 text-[#FDB515]">
                   <Zap size={18} />
                   <span className="text-xs font-bold uppercase tracking-widest">Real-time Analysis</span>
                </div>
                <div className="flex-1 text-sm text-blue-50/80 leading-relaxed italic">
                   {insightsLoading ? (
                     <div className="space-y-3 animate-pulse">
                        <div className="h-2 bg-white/10 rounded w-full"></div>
                        <div className="h-2 bg-white/10 rounded w-4/5"></div>
                        <div className="h-2 bg-white/10 rounded w-3/5"></div>
                     </div>
                   ) : (
                     insights || '分析引擎正在評估董事會獨立性比例...'
                   )}
                </div>
                <BrandButton variant="secondary" size="xs" fullWidth className="mt-8">
                   生成治理風險地圖 ❯
                </BrandButton>
             </div>
          </div>
        )
      }
    ],

    features: {
      useAuditLog: true
    }
  };

  return <StandardPage config={pageConfig} />;
}