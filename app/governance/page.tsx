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
      setInsights('目前 AI 分析引擎正在同步治理數據，請稍後再試。');
    } finally {
      setInsightsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  const activeTabData = TAB_DATA[activeTab];

  const pageConfig: UniversalPageConfig = {
    id: 'governance-hub',
    title: '公司治理 Governance',
    subtitle: 'G-Hub · GRI 2, 205-207 · 董事會 · 誠信 · 稅務 · 風險管理與 AI 合規。',
    icon: <Shield size={32} />,
    griReference: 'GRI 2, 205-207',
    activeT5Tags: ['T1', 'T2', 'T3', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'audit', label: '審計報告', icon: <Building2 size={16}/>, onClick: () => alert('正在生成...') }
    ],
    kpis: [
      { key: 'board', label: '獨董比例', value: '42', unit: '%', icon: <Building2 size={18}/>, verified: true },
      { key: 'ethics', label: '道德培訓', value: '100', unit: '%', icon: <Scale size={18}/>, verified: true },
      { key: 'tax', label: '稅率', value: '18.4', unit: '%', icon: <Receipt size={18}/> },
      { key: 'risk', label: '風險緩解', value: '92', unit: '%', icon: <AlertOctagon size={18}/>, verified: true },
    ],
    sections: [
      {
        id: 'nav',
        title: '治理維度',
        columns: 12,
        component: (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(TAB_DATA).map(([key, val]) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`p-5 rounded-2xl border transition-all ${activeTab === key ? 'bg-[#003262] text-white border-[#003262]' : 'bg-white text-slate-700 border-slate-100 hover:border-blue-300'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${activeTab === key ? 'bg-white/10 text-[#FDB515]' : 'bg-slate-50 text-[#003262]'}`}>{val.icon}</div>
                <p className="text-xs font-bold">{val.label}</p>
              </button>
            ))}
          </div>
        )
      },
      {
        id: 'table',
        title: `${activeTabData.label} 指標`,
        columns: 8,
        component: (
          <BrandTable 
            loading={loading}
            columns={[{ header: '指標名稱', key: 'name' }, { header: '數值', key: 'value' }, { header: '狀態', key: 'status' }]}
            data={metrics.map(m => ({
              name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
              value: <span className="font-mono text-blue-700 font-bold">{m.metric_value} {m.unit}</span>,
              status: <BrandStatusDot status={m.verified ? 'active' : 'warning'} size="sm" />
            }))}
          />
        )
      },
      {
        id: 'ai',
        title: 'AI 智慧洞察',
        columns: 4,
        component: (
          <div className="hermes-panel p-4 text-white">
             <div className="flex items-center gap-2 mb-4 text-[#FDB515]"><Zap size={18}/><span className="text-xs font-bold">Real-time Analysis</span></div>
             <p className="text-sm text-blue-50/80 leading-relaxed italic">{insightsLoading ? '分析中...' : insights}</p>
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return <StandardPage config={pageConfig} />;
}
