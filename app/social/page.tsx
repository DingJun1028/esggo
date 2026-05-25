'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ShieldAlert, BookOpen, Link as LinkIcon, Heart, Scale, 
  Sparkles, RefreshCw, CheckCircle, Bot, BarChart3, Shield, 
  ArrowUpRight, MessageSquare, Fingerprint, Database, Lock, 
  Globe, Activity, Target, Landmark, Handshake, ShieldCheck
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, 
  BrandStatusDot, BrandProgress, BrandPageHeader, BrandCardHeader, 
  StandardPage 
} from '../../components/brand';
import { getSocialMetrics, SocialMetric } from '../../lib/db';
import { UniversalPageConfig } from '../../lib/page-config';
import { cn } from '../../lib/utils';
import Link from 'next/link';

const TAB_DATA = [
  { id: 'workforce', label: '員工結構', icon: <Users size={16} />, gri: 'GRI 2-7, 401-405' },
  { id: 'safety', label: '職業安全', icon: <ShieldAlert size={16} />, gri: 'GRI 403' },
  { id: 'training', label: '人才培育', icon: <BookOpen size={16} />, gri: 'GRI 404' },
  { id: 'supply', label: '供應鏈社會', icon: <LinkIcon size={16} />, gri: 'GRI 414' },
  { id: 'community', label: '社區共榮', icon: <Heart size={16} />, gri: 'GRI 413' },
  { id: 'human_rights', label: '人權盡職', icon: <Scale size={16} />, gri: 'GRI 412' },
];

export default function SocialSovereigntyPage() {
  const [metrics, setMetrics] = useState<SocialMetric[]>([]);
  const [activeTab, setActiveTab] = useState('workforce');
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getSocialMetrics();
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  }

  const tabMetrics = metrics.filter(m => m.category === activeTab);
  const activeTabData = TAB_DATA.find(t => t.id === activeTab);

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'social-sovereignty',
    title: '社會主權與共鳴中心 Social Sovereignty',
    subtitle: 'oX Social Resonance · DEI 指標實證 · 供應鏈勞權鏈結。',
    icon: <Heart size={32} className="text-[#003262]" />,
    griReference: 'Social Pillar',
    activeT5Tags: ['T1', 'T2', 'T4', 'T5'],
    isOXModule: true,
    features: { useProvenance: true, useAuditLog: true },

    primaryActions: [
      { id: 'survey', label: '發起利害關係人調查', icon: <Handshake size={16}/>, onClick: () => window.location.href='/stakeholder-survey' },
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'secondary', onClick: loadData, loading }
    ],

    kpis: [
      { key: 'diversity', label: '女性主管比例', value: '34.2', unit: '%', icon: <Users size={18}/>, verified: true },
      { key: 'safety', label: '失能傷害頻率 (FR)', value: '0.42', icon: <ShieldAlert size={18} className="text-red-500"/> },
      { key: 'training', label: '人均培訓時數', value: '24.5', unit: 'hrs', icon: <BookOpen size={18} className="text-blue-500"/> },
      { key: 'community', label: '社區影響力評分', value: '92', icon: <Heart size={18} className="text-[#FDB515]"/> },
    ],

    sections: [
      {
        id: 'category-nav',
        title: '社會維度分類',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={TAB_DATA.map(t => ({ id: t.id, label: t.label, icon: t.icon }))}
          />
        )
      },
      {
        id: 'social-ledger',
        title: `${activeTabData?.label} 實證紀錄`,
        columns: 8,
        component: (
          <div className="space-y-6">
             <BrandCard padding="none" className="border-none shadow-premium overflow-hidden rounded-[2.5rem]">
                <BrandTable 
                  loading={loading}
                  columns={[
                    { label: '指標名稱', key: 'name' },
                    { label: '數值', key: 'value' },
                    { label: '5T 溯源', key: 'source' },
                    { label: '狀態', key: 'status' },
                  ]}
                  data={tabMetrics.map(m => ({
                    name: (
                      <div>
                        <p className="text-xs font-black text-[#003262]">{m.metric_name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{m.gri_standard}</p>
                      </div>
                    ),
                    value: <span className="font-mono text-sm font-black text-slate-700">{m.metric_value} <span className="text-[10px] text-slate-400">{m.unit}</span></span>,
                    source: (
                      <button className="flex items-center gap-2 text-[10px] text-blue-600 hover:text-blue-800 font-black uppercase tracking-widest transition-colors group">
                         <Fingerprint size={12} className="opacity-40 group-hover:opacity-100" /> PROVENANCE
                      </button>
                    ),
                    status: <BrandStatusDot status={m.verified ? 'verified' : 'warning'} label={m.verified ? '5T_SEALED' : 'PENDING'} size="sm" />,
                  }))}
                />
             </BrandCard>

             <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                      <Database size={24}/>
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">對接萬能聖碑</p>
                      <p className="text-xs text-slate-400 font-medium">同步全域社會實證至 Vault_Omni_Core</p>
                   </div>
                </div>
                <Link href="/vault-omni">
                   <BrandButton variant="secondary" size="sm" className="rounded-xl px-6">
                     前往聖碑 <ArrowUpRight size={14} className="ml-2"/>
                  </BrandButton>
                </Link>
             </div>
          </div>
        )
      },
      {
        id: 'h1-insights',
        title: 'H1-Diplomat 共鳴洞察',
        columns: 4,
        component: (
          <div className="space-y-6 h-full flex flex-col">
            <BrandCard className="bg-[#003262] text-white border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden p-8 flex-1">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em]">Diplomat Insight</p>
                      <p className="text-xs font-black">Hermes Social v2</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100/90 leading-relaxed font-medium italic">
                    「偵測到 DEI 數據顯示女性技術職比例提升 8%，高於產業平均。建議將此實證引入 **永續撰寫** 模組，並在利害關係人智庫中同步此項正面影響力。」
                  </p>
                  <BrandButton variant="primary" fullWidth className="bg-blue-500 hover:bg-blue-400 h-12 rounded-2xl font-black shadow-xl">
                    立即更新報告草稿
                  </BrandButton>
               </div>
               <Globe size={180} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            </BrandCard>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">社會合規與確信</p>
               <BrandCard padding="md" className="border-none shadow-premium bg-white/80 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-500 uppercase">ISAE 3000 Ready</span>
                     <CheckCircle size={14} className="text-emerald-500"/>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full w-[94%] bg-emerald-500" />
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase text-center tracking-widest">Trust Index: 94.2%</p>
               </BrandCard>
            </div>
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
