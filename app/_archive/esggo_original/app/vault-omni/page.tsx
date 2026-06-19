'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Hash, Shield, CheckCircle, AlertTriangle, Clock,
  Plus, Search, Filter, Download, Eye, Lock, Unlock,
  FileText, Zap, Database, Globe, ChevronDown, X,
  Activity, BarChart3, Leaf, Sparkles, Layout, Landmark,
  ShieldCheck, ArrowUpRight, RefreshCw, Send, Network, Cpu,
  List, Users
} from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandBadge, BrandStatusDot, BrandTable, 
  BrandModal, StandardPage, BrandTabs, BrandCardHeader
} from '../../components/brand';
import { cn } from '../../lib/utils';
import { UniversalPageConfig } from '../../lib/page-config';
import { supabase } from '../../lib/supabase';

interface OmniRecord {
  id: string;
  uuid: string;
  version: string;
  timestamp: string;
  hashLock: string;
  formula: string;
  isoStandard: string;
  griReference: string;
  sourceOrigin: string;
  status: 'sealed' | 'verified' | 'pending' | 'revoked';
  category: 'E' | 'S' | 'G' | 'System';
  evidence: Record<string, unknown>;
  t5Tags: string[];
}

const MOCK_RECORDS: OmniRecord[] = [
  {
    id: '1',
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    version: '1.2.0',
    timestamp: '2026-05-24T14:42:00Z',
    hashLock: 'sha256:ox_alchemy_v2_a1b2c3d4e5f678901234567890abcdef',
    formula: '範疇二排放量 = 用電度數(kWh) × 電力排放係數',
    isoStandard: 'ISO 14064-1:2018',
    griReference: 'GRI 302-1 / 305-2',
    sourceOrigin: 'omniagent_alchemy/power_bill_scan',
    status: 'verified',
    category: 'E',
    evidence: { value: 12450, unit: 'kWh', confidence: 0.98, alchemy_id: 'alc_9982' },
    t5Tags: ['T1', 'T2', 'T4', 'T5'],
  },
  {
    id: '2',
    uuid: 'c3d4e5f6-a7b8-9012-cdef-012345678902',
    version: '1.0.0',
    timestamp: '2026-05-24T10:30:00Z',
    hashLock: 'sha256:ox_strat_c3d4e5f6a7b89012cdef012345678902cdef',
    formula: '戰略共識評分 = (Swarm_Weight × Expert_Score)',
    isoStandard: '5T Sovereign Governance',
    griReference: 'Strategic Goal 2026',
    sourceOrigin: 'strategy_lab/consensus_ox_3',
    status: 'sealed',
    category: 'System',
    evidence: { proposal: '供應鏈 5T 自動化轉型', consensus: 0.92, agents: ['Z0', 'H1'] },
    t5Tags: ['T1', 'T3', 'T5'],
  },
  {
    id: '3',
    uuid: 'e5f6a7b8-c9d0-1234-ef01-234567890004',
    version: '2.1.0',
    timestamp: '2026-05-23T09:00:00Z',
    hashLock: 'sha256:ox_master_e5f6a7b8c9d01234ef01234567890004ef',
    formula: 'GRI 合規率 = 已揭露指標 / 應揭露指標 × 100%',
    isoStandard: 'GRI 2021 Universal',
    griReference: 'GRI 2-1 ~ 207',
    sourceOrigin: 'sustain_write/full_report_v2',
    status: 'verified',
    category: 'G',
    evidence: { coverage: 94.2, sealed_chapters: 18, total_words: 62450 },
    t5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
  },
];

const STATUS_CFG: Record<string, { label: string; variant: any; icon: any }> = {
  verified: { label: '5T 實證', variant: 'success', icon: <ShieldCheck size={12}/> },
  sealed:   { label: '5T 封印', variant: 'gold', icon: <Lock size={12}/> },
  pending:  { label: '待核驗', variant: 'warning', icon: <Clock size={12}/> },
};

const CAT_CFG: Record<string, { label: string; variant: any }> = {
  E:      { label: 'ENVIRONMENT', variant: 'success' },
  S:      { label: 'SOCIAL', variant: 'info' },
  G:      { label: 'GOVERNANCE', variant: 'warning' },
  System: { label: 'PLATFORM_OX', variant: 'gold' },
};

export default function VaultOmniPage() {
  const [records, setRecords] = useState<OmniRecord[]>(MOCK_RECORDS);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [selected, setSelected] = useState<OmniRecord | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);

  const filtered = records.filter(r => {
    const matchCat = activeCat === 'all' || r.category === activeCat;
    const matchSearch = r.griReference.toLowerCase().includes(search.toLowerCase()) || r.hashLock.includes(search);
    return matchCat && matchSearch;
  });

  const handleVerify = async (id: string) => {
    setVerifying(id);
    await new Promise(r => setTimeout(r, 2000));
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' as const } : r));
    setVerifying(null);
  };

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'vault-omni',
    title: '萬能聖碑 Vault Omni',
    subtitle: 'Immutable Ledger · Master Seal Lineage · 5T 全域實證金庫。',
    icon: <Database size={32} className="text-[#003262]" />,
    griReference: 'The Sacred Tablet',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    isOXModule: true,
    features: { useProvenance: true },

    primaryActions: [
      { id: 'scan', label: 'Alchemy 提取', icon: <Sparkles size={16}/>, onClick: () => window.location.href = '/omniagent-alchemy' },
      { id: 'export', label: '導出實證日誌', icon: <Download size={16}/>, variant: 'secondary', onClick: () => {} }
    ],

    kpis: [
      { key: 'ledger-count', label: '刻印總數', value: records.length.toString(), icon: <Hash size={18}/> },
      { key: 'trust-node', label: '5T 活躍節點', value: '14', icon: <Network size={18}/>, verified: true },
      { key: 'master-seal', label: 'Master Seals', value: '42', icon: <Lock size={18} className="text-[#FDB515]"/> },
    ],

    sections: [
      {
        id: 'category-nav',
        title: '實證類別',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeCat}
            onTabChange={(t) => setActiveCat(t as any)}
            tabs={[
              { id: 'all', label: '全部刻印', icon: <List size={14}/> },
              { id: 'E', label: '環境 (E)', icon: <Leaf size={14}/> },
              { id: 'S', label: '社會 (S)', icon: <Users size={14}/> },
              { id: 'G', label: '治理 (G)', icon: <Shield size={14}/> },
              { id: 'System', label: 'oX 系統', icon: <Cpu size={14}/> },
            ]}
          />
        )
      },
      {
        id: 'records-table',
        title: '聖碑刻印列表 (Sacred Ledger)',
        columns: 12,
        component: (
          <div className="space-y-6">
             <div className="relative group">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" />
                <input 
                  className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  placeholder="搜尋實證紀錄、GRI 代碼、Hash Lock..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
             </div>

             <BrandTable 
                columns={[
                  { key: 'gri', label: '指標 / 溯源' },
                  { key: 'status', label: '治理狀態' },
                  { key: 'hash', label: 'Hash Lock' },
                  { key: 'tags', label: '5T 標籤' },
                  { key: 'time', label: '刻印時間' },
                  { key: 'action', label: '' }
                ]}
                data={filtered.map(r => ({
                  gri: (
                    <div>
                      <p className="text-xs font-black text-[#003262]">{r.griReference}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{r.sourceOrigin}</p>
                    </div>
                  ),
                  status: (
                    <BrandBadge variant={STATUS_CFG[r.status].variant} size="xs" dot className="px-3">
                      {STATUS_CFG[r.status].label}
                    </BrandBadge>
                  ),
                  hash: <code className="text-[10px] font-mono text-slate-400">{r.hashLock.slice(0, 16)}...</code>,
                  tags: (
                    <div className="flex gap-1">
                      {['T1','T2','T3','T4','T5'].map(t => (
                        <span key={t} className={cn(
                          "w-5 h-5 rounded flex items-center justify-center text-[8px] font-black",
                          r.t5Tags.includes(t) ? "bg-[#003262] text-white" : "bg-slate-100 text-slate-300"
                        )}>{t}</span>
                      ))}
                    </div>
                  ),
                  time: <span className="text-[10px] text-slate-400 font-mono">{new Date(r.timestamp).toLocaleString()}</span>,
                  action: <BrandButton variant="ghost" size="xs" className="h-8 rounded-xl font-black text-[10px]" onClick={() => setSelected(r)}>檢視</BrandButton>
                }))}
             />
          </div>
        )
      }
    ]
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />

      <AnimatePresence>
        {selected && (
          <BrandModal 
            open={!!selected} 
            onClose={() => setSelected(null)}
            title="刻印詳情分析"
            icon={<Landmark size={20} className="text-[#FDB515]"/>}
          >
            <div className="space-y-8 p-2">
               <div className="p-8 bg-[#003262] rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.4em]">Master Seal v{selected.version}</p>
                          <h3 className="text-2xl font-black">{selected.griReference}</h3>
                       </div>
                       <BrandBadge variant="gold" size="sm" className="bg-[#FDB515] text-[#003262]">IMMUTABLE</BrandBadge>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <div className="flex items-center gap-2 mb-2">
                          <Hash size={12} className="text-blue-300" />
                          <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Global Hash Lock</span>
                       </div>
                       <code className="text-xs font-mono break-all text-blue-100/70">{selected.hashLock}</code>
                    </div>
                  </div>
                  <Database size={150} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BrandCard padding="md" className="border-slate-100 bg-slate-50/50">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">計算公式 (Logic)</p>
                     <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{selected.formula}"</p>
                  </BrandCard>
                  <BrandCard padding="md" className="border-slate-100 bg-slate-50/50">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">5T 驗收矩陣</p>
                     <div className="flex flex-wrap gap-2">
                        {['T1','T2','T3','T4','T5'].map(t => (
                          <BrandBadge key={t} variant={selected.t5Tags.includes(t) ? 'success' : 'outline'} size="xs" className="px-3">{t}</BrandBadge>
                        ))}
                     </div>
                  </BrandCard>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Evidence Payload (JSON)</p>
                  <pre className="p-6 bg-slate-900 rounded-[2rem] text-[11px] font-mono text-blue-300 overflow-auto border border-white/5">
                    {JSON.stringify(selected.evidence, null, 4)}
                  </pre>
               </div>

               <div className="flex gap-4">
                  <BrandButton variant="secondary" fullWidth className="h-14 rounded-2xl border-slate-200">
                    <Download size={18} className="mr-2"/> 下載存證包
                  </BrandButton>
                  <BrandButton variant="ghost" fullWidth className="h-14 rounded-2xl">
                    <Send size={18} className="mr-2"/> 發送至第三方確信
                  </BrandButton>
               </div>
            </div>
          </BrandModal>
        )}
      </AnimatePresence>
    </div>
  );
}
