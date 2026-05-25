'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Zap, RefreshCw, Shield, Scale, Receipt, AlertOctagon, 
  Bot, ChevronRight, BarChart3, Sparkles, ArrowUpRight, ShieldCheck, 
  Gavel, Landmark, Lock, Database, Fingerprint, Activity, Target,
  Users, List, FileText, CheckCircle
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, 
  BrandStatusDot, BrandProgress, BrandPageHeader, BrandCardHeader, 
  StandardPage 
} from '../../components/brand';
import { getGovernanceMetrics, GovernanceMetric } from '../../lib/db';
import { UniversalPageConfig } from '../../lib/page-config';
import { governanceEngine, MaterialityTopic, ResonanceResult } from '../../lib/governance-engine';
import { cn } from '../../lib/utils';
import Link from 'next/link';

const GOV_CATEGORIES = [
  { id: 'board', label: '董事會結構', gri: 'GRI 2-9/2-10', icon: <Landmark size={16}/>, color: '#003262' },
  { id: 'ethics', label: '商業道德',  gri: 'GRI 205',     icon: <Gavel size={16}/>,     color: '#8B5CF6' },
  { id: 'tax',    label: '稅務透明',  gri: 'GRI 207',     icon: <Receipt size={16}/>,   color: '#F59E0B' },
  { id: 'risk',   label: '風險管理',  gri: 'GRI 2-12',    icon: <AlertOctagon size={16}/>, color: '#EF4444' },
];

export default function SovereignGovernancePage() {
  const [activeTab, setActiveTab] = useState('board');
  const [metrics, setMetrics] = useState<GovernanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [resonanceResults, setResonanceResults] = useState<ResonanceResult[]>([]);
  const [overallResonance, setOverallResonance] = useState(0);

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

  useEffect(() => {
    const demoTopics: MaterialityTopic[] = [
      { id: 'board', label: '董事會結構', category: 'G', internalWeight: 5 },
      { id: 'ethics', label: '商業道德', category: 'G', internalWeight: 4 },
      { id: 'tax', label: '稅務透明', category: 'G', internalWeight: 3 },
      { id: 'risk', label: '風險管理', category: 'G', internalWeight: 5 },
    ];
    const demoVotes = [
      { id: 'v1', stakeholderType: 'INVESTOR', topicId: 'board', priorityScore: 5, timestamp: '', hashLock: '' },
      { id: 'v2', stakeholderType: 'EMPLOYEE', topicId: 'risk', priorityScore: 5, timestamp: '', hashLock: '' },
    ];
    const results = governanceEngine.calculateResonance(demoTopics, demoVotes as any);
    setResonanceResults(results);
    setOverallResonance(governanceEngine.getOverallResonanceIndex(results));
  }, []);

  const activeCategory = GOV_CATEGORIES.find(c => c.id === activeTab)!;

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'sovereign-governance',
    title: '主權治理與誠信指揮部 Sovereign Governance',
    subtitle: 'oX Integrity Command · 5T 決策封印 · 董事會級別合規監控。',
    icon: <ShieldCheck size={32} className="text-[#003262]" />,
    griReference: 'Governance Pillar',
    activeT5Tags: ['T1', 'T2', 'T3', 'T5'],
    isOXModule: true,
    features: { useProvenance: true, useAuditLog: true },

    primaryActions: [
      { id: 'seal', label: '5T 決策封印', icon: <Lock size={16}/>, onClick: () => alert('正在將治理決議刻印至萬能聖碑...') },
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'secondary', onClick: load, loading }
    ],

    kpis: [
      { key: 'board-div', label: '獨董比例', value: '42', unit: '%', icon: <Building2 size={18}/>, verified: true },
      { key: 'ethics-train', label: '道德培訓率', value: '100', unit: '%', icon: <Scale size={18}/>, verified: true },
      { key: 'tax-trans', label: '稅務透明度', value: 'A+', icon: <Receipt size={18} className="text-[#FDB515]"/> },
      { key: 'risk-coverage', label: '風險覆蓋率', value: '94', unit: '%', icon: <Shield size={18} className="text-blue-500"/> },
    ],

    sections: [
      {
        id: 'category-nav',
        title: '治理維度分類',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={GOV_CATEGORIES.map(t => ({ id: t.id, label: t.label, icon: t.icon }))}
          />
        )
      },
      {
        id: 'gov-ledger',
        title: `${activeCategory.label} 實證紀錄`,
        columns: 8,
        component: (
          <div className="space-y-6">
             <BrandCard padding="none" className="border-none shadow-premium overflow-hidden rounded-[2.5rem]">
                <BrandTable 
                  loading={loading}
                  columns={[
                    { label: '指標名稱', key: 'name' },
                    { label: '數值 / 狀態', key: 'value' },
                    { label: '5T 溯源', key: 'source' },
                    { label: '治理狀態', key: 'status' },
                  ]}
                  data={metrics.map(m => ({
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
                      <p className="text-xs text-slate-400 font-medium">同步核心治理實證至 Vault_Omni_Core</p>
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
        id: 'z0-insights',
        title: 'Z0-Auditor 誠信監控',
        columns: 4,
        component: (
          <div className="space-y-6 h-full flex flex-col">
            <BrandCard className="bg-[#003262] text-white border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden p-8 flex-1">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
                      <Shield size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">Auditor Insight</p>
                      <p className="text-xs font-black">Hermes Governance v3</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100/90 leading-relaxed font-medium italic">
                    「偵測到董事會組成多元化評分優於產業平均。建議將此治理實證執行 **5T 封印**，並在 **主權數位分身** 的 DNA 建模中提升『誠信度』權重。」
                  </p>
                  <BrandButton variant="primary" fullWidth className="bg-emerald-500 hover:bg-emerald-400 h-12 rounded-2xl font-black shadow-xl">
                    執行 ZKP 誠信校驗
                  </BrandButton>
               </div>
               <Lock size={180} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            </BrandCard>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">治理共鳴狀態</p>
               <BrandCard padding="md" className="border-none shadow-premium bg-white/80 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-500 uppercase">Swarm Consensus</span>
                     <span className="text-xs font-black text-blue-600">{overallResonance}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600" style={{ width: `${overallResonance}%` }} />
                  </div>
               </BrandCard>
            </div>
          </div>
        )
      },
      {
        id: 'resonance-view',
        title: '治理共鳴指數 (Resonance Index)',
        columns: 12,
        component: (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {resonanceResults.map(r => (
              <BrandCard key={r.topicId} padding="lg" className="border-none shadow-sm flex flex-col items-center text-center group">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{r.label}</p>
                <div className="mb-4">
                   <span className="text-4xl font-black font-mono tracking-tighter" style={{ color: r.resonance >= 80 ? '#10B981' : '#F59E0B' }}>{r.resonance}%</span>
                </div>
                <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden mb-4">
                   <motion.div className="h-full bg-blue-600" initial={{ width: 0 }} animate={{ width: `${r.resonance}%` }} transition={{ duration: 1 }} />
                </div>
                <div className="flex justify-between w-full text-[8px] font-black text-slate-300 uppercase">
                   <span>Internal: {r.internalPriority}/5</span>
                   <span>Public: {r.stakeholderPriority.toFixed(1)}/5</span>
                </div>
              </BrandCard>
            ))}
            <BrandCard padding="lg" className="bg-[#003262] border-none shadow-premium flex flex-col items-center justify-center text-center">
               <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">全域治理共鳴</p>
               <span className="text-4xl font-black font-mono text-[#FDB515]">{overallResonance}%</span>
               <div className="mt-4 flex items-center gap-1.5">
                  <BrandStatusDot status="active" pulse size="xs" />
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">oX_ALIGNED</span>
               </div>
            </BrandCard>
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
