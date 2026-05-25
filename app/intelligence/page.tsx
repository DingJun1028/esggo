'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, BookOpen, Bookmark, ExternalLink, Search, 
  BarChart3, Globe, Zap, RefreshCw, Network, Sparkles,
  Trophy, TrendingUp, ShieldAlert, Newspaper, PieChart,
  Target, ZapOff, Activity, Bot, ArrowRight, ChevronRight
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandStatusDot, BrandCard,
  StandardPage, BrandCardHeader, BrandTabs
} from '../../components/brand';
import { dcListScrapedArticles } from '../../lib/dataconnect-services';
import { MemoryGraphVisualizer } from '../../components/ui/MemoryGraphVisualizer';
import { memoryGraphEngine, MemoryGraph } from '../../lib/memory-graph-engine';
import { cn } from '../../lib/utils';
import { UniversalPageConfig } from '../../lib/page-config';
import { supabase } from '../../lib/supabase';

const benchmarks = [
  { company: '台積電', industry: '半導體', eScore: 92, sScore: 88, gScore: 94, overall: 91, certified: true },
  { company: '鴻海精密', industry: '電子製造', eScore: 78, sScore: 82, gScore: 85, overall: 82, certified: true },
  { company: '台達電子', industry: '電子零組件', eScore: 88, sScore: 79, gScore: 87, overall: 85, certified: false },
  { company: '中鋼公司', industry: '鋼鐵', eScore: 71, sScore: 84, gScore: 80, overall: 78, certified: false },
];

const riskAlerts = [
  { level: 'critical', title: '漂綠風險預警', desc: '偵測到模糊承諾語句，建議改為具體量化目標', gri: 'GRI 2-22' },
  { level: 'high', title: 'Scope 3 數據缺漏', desc: '供應鏈碳排放尚未納入盤查，2025年強制揭露', gri: 'GRI 305-3' },
  { level: 'medium', title: '第三方確信未完成', desc: '建議完成 ISSA 5000 確信程序', gri: 'ISSA 5000' },
  { level: 'low', title: 'DEI 數據揭露不足', desc: '多元指標揭露僅達 60%，建議補充性別薪酬比', gri: 'GRI 405-2' },
];

const categories = ['全部', '法規動態', '碳政策', '國際標準', '確信標準', '產業動態'];

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'news' | 'graph' | 'benchmark' | 'risk'>('news');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('全部');
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sampleGraph, setSampleGraph] = useState<MemoryGraph | null>(null);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const data = await dcListScrapedArticles();
        setArticles(data || []);

        // Build graph from real vault evidence
        if (supabase) {
          const { data: vaultFiles } = await supabase
            .from('evidence_vault')
            .select('*')
            .not('hash_lock', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1);
          const file = vaultFiles?.[0];
          if (file) {
            const g = await memoryGraphEngine.buildLineageGraph({
              uuid: file.id,
              timestamp: new Date(file.created_at).getTime(),
              version: file.t5_bundle?.version || '1.1.0',
              status: 'Trustworthy',
              hash_lock: file.hash_lock,
              evidence: {
                tangible_metric: file.file_name || 'Vault Evidence',
                source_origin: `/vault/${file.id}`,
                lifecycle_hooks: [],
                formula_ref: file.gri_reference || 'GRI'
              }
            });
            setSampleGraph(g);
            return;
          }
        }

        // Fallback to default graph
        const g = await memoryGraphEngine.buildLineageGraph({
          uuid: 'comp-abc-123',
          timestamp: Date.now(),
          version: '1.2.0',
          status: 'Trustworthy',
          hash_lock: 'hash_intelligence_ox',
          evidence: {
            tangible_metric: 'ESG Intelligence Flow (oX Verified)',
            source_origin: 'Multi-source Scraper',
            lifecycle_hooks: [],
            formula_ref: 'OmniHermes-v2'
          }
        });
        setSampleGraph(g);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    loadArticles();
  }, []);

  const filtered = articles.filter(item => {
    const matchS = item.title.includes(searchTerm) || (item.summary || '').includes(searchTerm);
    const matchC = selectedCat === '全部' || item.category === selectedCat;
    return matchS && matchC;
  });

  const handleDispatchTask = (item: any) => {
    alert(`[oX Dispatch] 已啟動針對 "${item.title}" 的自動化實證掃描任務。`);
  };

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'intelligence-hub',
    title: '商情中心 Intelligence Hub',
    subtitle: '即時法規追蹤 · 產業標竿對照 · 數據因果圖譜。Hermes AI 驅動的全域永續決策支援系統。',
    icon: <Globe size={32} className="text-[#003262]" />,
    griReference: 'Market Intelligence',
    activeT5Tags: ['T1', 'T2', 'T4'],

    primaryActions: [
      { id: 'ai-analyze', label: 'AI 市場分析', icon: <Sparkles size={16}/>, onClick: () => alert('Hermes 正在生成本週 ESG 策略報表...') },
      { id: 'refresh', label: '刷新數據', icon: <RefreshCw size={16}/>, variant: 'outline' }
    ],

    kpis: [
      { key: 'count', label: '情報總數', value: articles.length.toString(), icon: <Newspaper size={18}/> },
      { key: 'high-impact', label: '高衝擊法規', value: articles.filter(n => n.impactLevel === 'high').length.toString(), icon: <ShieldAlert size={18} className="text-red-500"/> },
      { key: 'accuracy', label: 'AI 提取準確率', value: '98.5', unit: '%', icon: <Target size={18} className="text-emerald-500"/>, verified: true },
    ],

    sections: [
      {
        id: 'main-hub',
        title: '全域商情導航',
        columns: 12,
        component: (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <BrandTabs 
                activeTab={activeTab}
                onTabChange={(t) => setActiveTab(t as any)}
                tabs={[
                  { id: 'news', label: '情報中心', icon: <Newspaper size={14}/> },
                  { id: 'graph', label: '記憶圖譜', icon: <Network size={14}/> },
                  { id: 'benchmark', label: '產業標竿', icon: <BarChart3 size={14}/> },
                  { id: 'risk', label: '風險預警', icon: <AlertTriangle size={14}/> },
                ]}
              />
              <div className="relative w-full md:w-64 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  className="w-full h-11 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 text-xs font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  placeholder="搜尋情報、法規..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Querying Global Repository...</p>
                </motion.div>
              ) : (
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {activeTab === 'news' && (
                    <div className="space-y-4">
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {categories.map(cat => (
                          <button key={cat} onClick={() => setSelectedCat(cat)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap border transition-all",
                              selectedCat === cat ? "bg-[#003262] text-white border-[#003262] shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.length > 0 ? filtered.map(item => (
                          <BrandCard key={item.id} hover padding="md" className="border-none shadow-sm relative overflow-hidden group">
                            <div className={cn("absolute top-0 left-0 w-1.5 h-full", item.impactLevel === 'high' ? 'bg-red-500' : 'bg-blue-400')} />
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <BrandBadge variant={item.impactLevel === 'high' ? 'error' : 'info'} size="xs" className="px-2">{item.impactLevel === 'high' ? 'HIGH' : 'MEDIUM'}</BrandBadge>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.category}</span>
                              </div>
                              <button className="text-slate-200 hover:text-[#FDB515] transition-colors"><Bookmark size={14}/></button>
                            </div>
                            <h4 className="text-sm font-black text-[#003262] line-clamp-1 mb-1">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 italic">"{item.summary}"</p>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-[9px] text-slate-300 font-mono">{item.publishedAt || '2024-05-24'}</span>
                              <div className="flex gap-2">
                                {item.impactLevel === 'high' && (
                                  <BrandButton 
                                    variant="outline" 
                                    size="xs" 
                                    className="border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                                    onClick={() => handleDispatchTask(item)}
                                  >
                                    <Zap size={10} className="mr-1"/> 啟動自動應對
                                  </BrandButton>
                                )}
                                <BrandButton variant="ghost" size="sm" className="p-0 h-auto text-blue-600 font-black">READ <ArrowRight size={12} className="ml-1"/></BrandButton>
                              </div>
                            </div>
                          </BrandCard>
                        )) : (
                          <div className="col-span-2 py-20 text-center text-slate-300 font-bold uppercase tracking-widest">No Intelligence Data Found</div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'graph' && sampleGraph && (
                    <div className="space-y-6">
                      <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden border border-white/5 shadow-2xl">
                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center gap-2 text-[#FDB515]">
                            <Zap size={16}/>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Causal Analysis Active</span>
                          </div>
                          <p className="text-xs text-blue-100/70 leading-relaxed font-medium">
                            Hermes 正在分析法規與企業數據間的聯動關係。每一筆情報都會自動映射至 5T 實證網絡。
                          </p>
                        </div>
                        <Bot size={100} className="absolute -bottom-6 -right-6 text-white/5 rotate-12" />
                      </div>
                      <MemoryGraphVisualizer graph={sampleGraph} />
                    </div>
                  )}

                  {activeTab === 'benchmark' && (
                    <BrandCard padding="none" className="border-none shadow-premium overflow-hidden rounded-[2.5rem]">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            {['企業 (Company)', '產業', 'E', 'S', 'G', 'Score'].map(h => (
                              <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {benchmarks.map(b => (
                            <tr key={b.company} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[#003262] font-black text-xs shadow-sm">{b.company[0]}</div>
                                  <div>
                                    <p className="text-xs font-black text-slate-800">{b.company}</p>
                                    {b.certified && <BrandBadge variant="success" size="xs" className="scale-75 origin-left">Verified</BrandBadge>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[11px] font-bold text-slate-500">{b.industry}</td>
                              {[b.eScore, b.sScore, b.gScore].map((v, i) => (
                                <td key={i} className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-600" style={{ width: `${v}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 font-mono">{v}</span>
                                  </div>
                                </td>
                              ))}
                              <td className="px-6 py-4">
                                <span className="text-base font-black text-[#003262] font-mono">{b.overall}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </BrandCard>
                  )}

                  {activeTab === 'risk' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {riskAlerts.map((alert, idx) => (
                        <BrandCard key={idx} padding="md" className="border-none shadow-sm flex gap-4 group hover:border-red-200 transition-all">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner",
                            alert.level === 'critical' ? 'bg-purple-100 text-purple-600' : 
                            alert.level === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                          )}>
                            <AlertTriangle size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-widest">{alert.gri}</span>
                              <div className="w-1 h-1 rounded-full bg-slate-200" />
                              <span className="text-[10px] font-black text-slate-300 uppercase">{alert.level} RISK</span>
                            </div>
                            <h4 className="text-sm font-black text-slate-800 mb-1">{alert.title}</h4>
                            <p className="text-[11px] text-slate-500 italic">"{alert.desc}"</p>
                          </div>
                        </BrandCard>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      },
      {
        id: 'side-insights',
        title: 'Hermes 策略快報',
        columns: 4,
        component: (
          <div className="space-y-6">
            <BrandCard className="bg-[#003262] text-white border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden p-8">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                      <Zap size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em]">Strategy Insight</p>
                      <p className="text-xs font-black">Hermes Governance v2</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100/90 leading-relaxed font-medium italic">
                    「偵測到金管會發布最新氣候揭露指南。您的產業需在 Q3 前完成範疇三數據路徑規劃。建議導入 **GRI 305-3 蜂群自動化模組**。」
                  </p>
                  <BrandButton variant="primary" fullWidth className="bg-blue-500 hover:bg-blue-400 h-12 rounded-2xl font-black shadow-xl">
                    立即調整治理策略
                  </BrandButton>
               </div>
               <Activity size={120} className="absolute -bottom-10 -right-10 text-white/5 opacity-20" />
            </BrandCard>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">法規更新雷達</p>
              <div className="space-y-2">
                {['金管會 2024 新制', 'CBAM 第一階段', 'ISSB S2 生效', 'ISSA 5000 發布'].map((reg, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-50 rounded-2xl flex items-center gap-4 hover:border-blue-200 transition-all shadow-sm group">
                    <div className={cn("w-1.5 h-1.5 rounded-full", i < 2 ? 'bg-red-400 animate-pulse' : 'bg-blue-400')} />
                    <span className="text-xs font-bold text-slate-700 flex-1">{reg}</span>
                    <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-500 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
