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

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (metrics.length > 0) loadInsights(activeTab);
  }, [activeTab, metrics]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getSocialMetrics();
      setMetrics(data);
    } catch (err) {
      showToast('無法取得社會類別指標', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadInsights(category: string) {
    setLoadingInsights(true);
    try {
      const res = await fetch(`/api/social/insights?category=${category}`);
      const data = await res.json();
      setInsights(data.insights || '目前無洞察報告');
    } catch {
      setInsights('**取得洞察時發生錯誤。**');
    } finally {
      setLoadingInsights(false);
    }
  }

  const tabMetrics = metrics.filter(m => m.category === activeTab);
  const activeTabData = TAB_DATA.find(t => t.id === activeTab);

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
        id: 'tabs',
        title: '社會維度分類',
        columns: 12,
        component: (
          <BrandTabs 
            tabs={TAB_DATA.map(t => ({ id: t.id, label: t.label, icon: t.icon, badge: metrics.filter(m => m.category === t.id).length || undefined }))} 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />
        )
      },
      {
        id: 'table',
        title: `${activeTabData?.label} 指標明細`,
        columns: 8,
        component: (
          <BrandTable 
            loading={loading}
            columns={[{ header: '指標名稱', key: 'name' }, { header: '數值', key: 'value' }, { header: 'GRI', key: 'gri' }, { header: '狀態', key: 'status' }]}
            data={tabMetrics.map(m => ({
              name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
              value: <span className="font-bold text-[#003262]">{m.metric_value} {m.unit}</span>,
              gri: <BrandBadge variant="outline" size="xs">{m.gri_standard}</BrandBadge>,
              status: <BrandBadge variant={m.verified ? 'success' : 'warning'} size="xs">{m.verified ? 'VERIFIED' : 'PENDING'}</BrandBadge>
            }))}
          />
        )
      },
      {
        id: 'ai',
        title: 'Hermes 智能洞察',
        columns: 4,
        component: (
          <div className="hermes-panel min-h-[300px] p-4 text-white">
             <div className="flex items-center gap-2 mb-4 text-[#FDB515]"><Sparkles size={18}/><span className="text-xs font-bold uppercase">Real-time Analysis</span></div>
             <div className="text-sm text-blue-50/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br/>') }} />
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return <StandardPage config={pageConfig} />;
}
