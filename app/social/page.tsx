'use client';

import React, { useState, useEffect } from 'react';
import { getSocialMetrics, SocialMetric } from '@/lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandKpiCard, BrandPageHeader, BrandStatusDot, StandardPage 
} from '@/components/brand';
import { Users, ShieldAlert, BookOpen, Link as LinkIcon, Heart, Scale, Sparkles, RefreshCw, CheckCircle, Bot, BarChart3, Shield } from 'lucide-react';
import { UniversalPageConfig } from '@/lib/page-config';

const TAB_DATA = [
  { id: 'workforce', label: '員工結構', icon: <Users size={16} />, gri: 'GRI 2-7, 401-405' },
  { id: 'safety', label: '職業安全', icon: <ShieldAlert size={16} />, gri: 'GRI 403' },
  { id: 'training', label: '人才培育', icon: <BookOpen size={16} />, gri: 'GRI 404' },
  { id: 'supply', label: '供應鏈管理', icon: <LinkIcon size={16} />, gri: 'GRI 308, 414' },
  { id: 'community', label: '社區共榮', icon: <Heart size={16} />, gri: 'GRI 413, 201' },
  { id: 'human_rights', label: '人權盡職調查', icon: <Scale size={16} />, gri: 'GRI 412' },
];

export default function SocialPage() {
  const [metrics, setMetrics] = useState<SocialMetric[]>([]);
  const [activeTab, setActiveTab] = useState('workforce');
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (metrics.length > 0) {
      loadInsights(activeTab);
    }
  }, [activeTab, metrics]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getSocialMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load social metrics:', err);
      showToast('無法取得社會類別指標，請稍後重試。', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadInsights(category: string) {
    setLoadingInsights(true);
    setInsights('');
    try {
      const res = await fetch(`/api/social/insights?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights);
      } else {
        setInsights('**無法取得 OmniHermes 洞察。**');
      }
    } catch (err) {
      setInsights('**取得洞察時發生錯誤。**');
    } finally {
      setLoadingInsights(false);
    }
  }

  const tabMetrics = metrics.filter(m => m.category === activeTab);
  const activeTabData = TAB_DATA.find(t => t.id === activeTab);

  // ── Universal Page Configuration (萬能配置) ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'social-impact',
    title: '共榮普惠 (Social Impact)',
    subtitle: 'GRI 401-414 社會類別指標：透過 Hermes AI 提供員工、安全、供應鏈與社區參與的深度洞察。',
    icon: <Heart size={32} />,
    griReference: 'GRI 401-414',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4'],
    
    primaryActions: [
      { id: 'refresh', label: '重新整理', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: loadData, loading },
      { id: 'survey', label: '利害關係人問卷', icon: <Users size={16}/>, onClick: () => window.location.href='/stakeholder-survey' }
    ],

    kpis: tabMetrics.slice(0, 4).map(m => ({
      key: m.id || m.metric_name,
      label: m.metric_name,
      value: m.metric_value ?? '-',
      unit: m.unit,
      verified: m.verified,
      icon: <Users size={18}/>
    })),

    sections: [
      {
        id: 'nav-tabs',
        title: '社會維度分類',
        columns: 12,
        component: (
          <BrandTabs
            tabs={TAB_DATA.map(t => ({
              id: t.id,
              label: t.label,
              icon: t.icon,
              badge: metrics.filter(m => m.category === t.id).length || undefined
            }))}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        )
      },
      {
        id: 'data-table',
        title: `${activeTabData?.label} 指標明細`,
        subtitle: `符合 ${activeTabData?.gri} 標準`,
        icon: <BarChart3 size={18}/>,
        columns: 8,
        component: (
          <BrandTable 
            loading={loading}
            columns={[
              { header: '指標名稱', key: 'name' },
              { header: '數值', key: 'value' },
              { header: 'GRI 參考', key: 'gri' },
              { header: '狀態', key: 'status' },
            ]}
            data={tabMetrics.map(m => ({
              name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
              value: (
                <div className="flex items-end gap-1 text-right justify-end">
                   <span className="font-bold text-[#003262] text-base">{m.metric_value}</span>
                   <span className="text-[10px] text-slate-400 font-medium">{m.unit}</span>
                </div>
              ),
              gri: <BrandBadge variant="outline" size="xs" className="font-mono">{m.gri_standard}</BrandBadge>,
              status: (
                <div className="flex justify-center">
                  {m.zkp_sealed ? (
                    <BrandBadge variant="gold" size="xs">ZKP SEALED</BrandBadge>
                  ) : m.verified ? (
                    <BrandBadge variant="success" size="xs">VERIFIED</BrandBadge>
                  ) : (
                    <BrandBadge variant="warning" size="xs">PENDING</BrandBadge>
                  )}
                </div>
              )
            }))}
          />
        )
      },
      {
        id: 'ai-insights',
        title: 'Hermes 智能洞察',
        subtitle: 'AI 驅動的數據分析',
        icon: <Bot size={18}/>,
        columns: 4,
        component: (
          <div className="hermes-panel min-h-[300px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-[#FDB515]">
               <Sparkles size={18} />
               <span className="text-xs font-bold uppercase tracking-widest">Real-time Analysis</span>
            </div>
            <div className="flex-1 text-sm text-blue-50/80 leading-relaxed overflow-y-auto">
               {loadingInsights ? (
                 <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-60">
                   <RefreshCw size={24} className="animate-spin" />
                   <p>正在分析 {activeTabData?.label}...</p>
                 </div>
               ) : (
                 <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br/>') || '目前無洞察報告' }} />
               )}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
               <BrandButton variant="ghost" size="xs" fullWidth className="text-white/60 hover:text-white">
                  生成 PDF 摘要 ❯
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

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] fade-in">
          <BrandCard padding="sm" className={`flex items-center gap-3 border-none text-white shadow-xl ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-blue-700' : 'bg-green-600'}`}>
             {toast.type === 'error' ? <Shield size={16} /> : <CheckCircle size={16} />} 
             <span className="font-bold text-sm">{toast.msg}</span>
          </BrandCard>
        </div>
      )}
    </div>
  );
}