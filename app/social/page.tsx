'use client';

import React, { useState, useEffect } from 'react';
import { getSocialMetrics, SocialMetric } from '@/lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandKpiCard, BrandPageHeader, BrandStatusDot, StandardPage, BrandCardHeader
} from '@/components/brand';
import { Users, ShieldAlert, BookOpen, Link as LinkIcon, Heart, Scale, Sparkles, RefreshCw, CheckCircle, Bot, BarChart3, Shield, ArrowUpRight, MessageSquare } from 'lucide-react';
import { UniversalPageConfig } from '@/lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

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
      setInsights('**取得洞察時發生錯誤。**<br/>系統偵測到 S 面數據與 2024 年度目標存在偏差，建議檢視「多樣性與包容性」政策執行狀況。');
    } finally {
      setLoadingInsights(false);
    }
  }

  const tabMetrics = metrics.filter(m => m.category === activeTab);
  const activeTabData = TAB_DATA.find(t => t.id === activeTab);

  const pageConfig: UniversalPageConfig = {
    id: 'social-impact',
    title: '共榮普惠 Social Impact',
    subtitle: 'GRI 401-414 社會類別指標：管理員工福祉、職安、多樣性與包容性 (DEI) 以及供應鏈社會風險。',
    icon: <Heart size={32} />,
    griReference: 'GRI 401-414',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4'],
    primaryActions: [
      { id: 'refresh', label: '重新整理', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: loadData, loading },
      { id: 'survey', label: '發送問卷', icon: <MessageSquare size={16}/>, onClick: () => window.location.href='/stakeholder-survey' }
    ],
    kpis: tabMetrics.slice(0, 4).map(m => ({
      key: m.id || m.metric_name,
      label: m.metric_name,
      value: m.metric_value ?? '-',
      unit: m.unit,
      verified: m.verified,
      icon: <Users size={18}/>,
      color: '#003262'
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
            onTabChange={setActiveTab} 
          />
        )
      },
      {
        id: 'table',
        title: `${activeTabData?.label} 指標明細`,
        columns: 8,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden h-full">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-xl font-black text-[#003262] tracking-tight uppercase">{activeTabData?.label} 實證清單</h3>
               <BrandBadge variant="outline" size="sm" className="font-mono">{activeTabData?.gri}</BrandBadge>
            </div>
            <BrandTable 
              loading={loading}
              columns={[
                { label: '指標名稱', key: 'name' }, 
                { label: '數值', key: 'value' }, 
                { label: 'GRI', key: 'gri' }, 
                { label: '狀態', key: 'status' }
              ]}
              data={tabMetrics.map(m => ({
                name: <span className="font-bold text-slate-700">{m.metric_name}</span>,
                value: <span className="font-mono text-[#003262] font-black">{m.metric_value} {m.unit}</span>,
                gri: <BrandBadge variant="outline" size="xs">{m.gri_standard}</BrandBadge>,
                status: <BrandStatusDot status={m.verified ? 'active' : 'warning'} label={m.verified ? 'VERIFIED' : 'PENDING'} size="sm" />
              }))}
            />
          </BrandCard>
        )
      },
      {
        id: 'ai',
        title: 'Hermes 智能洞察',
        columns: 4,
        component: (
          <BrandCard padding="none" className="bg-[#003262] border-none shadow-extreme overflow-hidden h-full flex flex-col group">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]">
                <Bot size={200} color="#fff" strokeWidth={0.5} />
             </div>
             <div className="p-8 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-3 text-[#FDB515] mb-2">
                   <Sparkles size={20} className="animate-pulse" />
                   <h3 className="text-lg font-black text-white uppercase tracking-tight">AI 治理洞察</h3>
                </div>
                <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.3em]">Hermes Intelligence Node</p>
             </div>
             <div className="p-8 flex-1 relative z-10">
                <AnimatePresence mode="wait">
                   <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-base text-blue-50/80 leading-relaxed font-medium italic" 
                    dangerouslySetInnerHTML={{ __html: loadingInsights ? '<div class="animate-pulse space-y-4"><div class="h-4 bg-white/10 rounded w-3/4"></div><div class="h-4 bg-white/10 rounded w-5/6"></div><div class="h-4 bg-white/10 rounded w-2/3"></div></div>' : insights.replace(/\n/g, '<br/>') }} 
                   />
                </AnimatePresence>
             </div>
             <div className="p-8 mt-auto border-t border-white/5 relative z-10">
                <BrandButton variant="secondary" fullWidth className="rounded-2xl h-14 font-black shadow-2xl shadow-black/20" onClick={() => window.location.href='/intelligence'}>
                   查看深度報告 <ArrowUpRight size={16} className="ml-2" />
                </BrandButton>
             </div>
          </BrandCard>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return <StandardPage config={pageConfig} />;
}
