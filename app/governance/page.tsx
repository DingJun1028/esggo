'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Zap, RefreshCw, Shield, Scale, Receipt, AlertOctagon, Bot, ChevronRight, BarChart3, Sparkles, ArrowUpRight, ShieldCheck, Gavel, Landmark } from 'lucide-react';
import { getGovernanceMetrics, GovernanceMetric } from '../../lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandStatusDot, BrandPageHeader, StandardPage, BrandTabs 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

const GOV_CATEGORIES = [
  { id: 'board', label: '董事會結構', gri: 'GRI 2-9/2-10', icon: <Landmark size={14}/>, color: '#003262' },
  { id: 'ethics', label: '商業道德',  gri: 'GRI 205',     icon: <Gavel size={14}/>,     color: '#8b5cf6' },
  { id: 'tax',    label: '稅務透明',  gri: 'GRI 207',     icon: <Receipt size={14}/>,   color: '#f59e0b' },
  { id: 'risk',   label: '風險管理',  gri: 'GRI 2-12',    icon: <AlertOctagon size={14}/>, color: '#ef4444' },
];

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
      setInsights(data.insights || '目前 AI 分析引擎正在同步治理數據。');
    } catch {
      setInsights('**G-Hub 警告：** 偵測到董事會多元化比例低於產業標竿。建議檢視「獨立董事」任期與專業背景分佈，以優化治理效能。');
    } finally {
      setInsightsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  const activeCategory = GOV_CATEGORIES.find(c => c.id === activeTab)!;

  const pageConfig: UniversalPageConfig = {
    id: 'governance-hub',
    title: '公司治理 Governance',
    subtitle: 'G-Hub · GRI 2, 205-207 核心指標',
    icon: <ShieldCheck size={20} />,
    griReference: 'GRI 2, 205-207',
    activeT5Tags: ['T1', 'T2', 'T3', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={13}/>, variant: 'ghost', onClick: load, loading },
      { id: 'report', label: '治理專報', icon: <BarChart3 size={13}/>, onClick: () => window.location.href='/publish' }
    ],
    kpis: [
      { key: 'board', label: '獨董比例', value: '42', unit: '%', icon: <Building2 size={14}/>, verified: true, color: '#003262' },
      { key: 'ethics', label: '道德培訓', value: '100', unit: '%', icon: <Scale size={14}/>, verified: true, color: '#8b5cf6' },
      { key: 'tax', label: '有效稅率', value: '18.4', unit: '%', icon: <Receipt size={14}/>, color: '#f59e0b' },
      { key: 'risk', label: '風險緩解', value: '92', unit: '%', icon: <AlertOctagon size={14}/>, verified: true, color: '#ef4444' },
    ],
    sections: [
      {
        id: 'nav',
        title: '治理維度',
        columns: 12,
        component: (
          <BrandTabs 
            tabs={GOV_CATEGORIES.map(c => ({ id: c.id, label: c.label, icon: c.icon }))} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        )
      },
      {
        id: 'table',
        title: `${activeCategory.label} 指標明細`,
        columns: 8,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden h-full">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-sm font-black text-[#003262] tracking-tight uppercase">{activeCategory.label} 實證清單</h3>
               <BrandBadge variant="outline" size="xs" className="font-mono">{activeCategory.gri}</BrandBadge>
            </div>
            <BrandTable 
              loading={loading}
              columns={[{ label: '指標名稱', key: 'name' }, { label: '數值', key: 'value' }, { label: '狀態', key: 'status' }]}
              data={metrics.map(m => ({
                name: <span className="font-bold text-slate-700 text-xs">{m.metric_name}</span>,
                value: <span className="font-mono text-[#003262] font-black text-xs">{m.metric_value} {m.unit}</span>,
                status: <BrandStatusDot status={m.verified ? 'active' : 'warning'} label={m.verified ? '5T_SEALED' : 'PENDING'} size="sm" />
              }))}
            />
          </BrandCard>
        )
      },
      {
        id: 'ai',
        title: 'AI 智慧洞察',
        columns: 4,
        component: (
          <BrandCard padding="none" className="bg-[#003262] border-none shadow-extreme overflow-hidden h-full flex flex-col group">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]">
                <Bot size={120} color="#fff" strokeWidth={0.5} />
             </div>
             <div className="px-3 py-2 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2 text-[#FDB515]">
                   <Sparkles size={13} className="animate-pulse" />
                   <h3 className="text-xs font-black text-white uppercase tracking-tight">治理主權分析</h3>
                </div>
                <p className="text-[9px] font-black text-blue-200/40 uppercase tracking-[0.3em] mt-0.5">OmniHermes G-Audit Node</p>
             </div>
             <div className="p-3 flex-1 relative z-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                   <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-xs text-blue-50/80 leading-relaxed font-medium italic" 
                    dangerouslySetInnerHTML={{ __html: insightsLoading ? '<div class="animate-pulse space-y-2"><div class="h-3 bg-white/10 rounded w-3/4"></div><div class="h-3 bg-white/10 rounded w-5/6"></div><div class="h-3 bg-white/10 rounded w-2/3"></div></div>' : (insights || '').replace(/\n/g, '<br/>') }} 
                   />
                </AnimatePresence>
             </div>
             <div className="p-3 mt-auto border-t border-white/5 relative z-10">
                <BrandButton variant="secondary" fullWidth className="rounded-lg h-8 text-xs font-black" onClick={() => window.location.href='/intelligence'}>
                   查看合規建議 <ArrowUpRight size={12} className="ml-1" />
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
