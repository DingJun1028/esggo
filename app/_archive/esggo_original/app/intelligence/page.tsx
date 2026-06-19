'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, BookOpen, Bookmark, ExternalLink, Search, 
  BarChart3, Globe, Zap, RefreshCw, Network, Sparkles,
  Trophy, TrendingUp, ShieldAlert, Newspaper, PieChart,
  Target, ZapOff, Activity, Bot, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn, staggerContainer } from '../../lib/animations';
import { dcListScrapedArticles } from '../../lib/dataconnect-services';
import { MemoryGraphVisualizer } from '../../components/ui/MemoryGraphVisualizer';
import { memoryGraphEngine, MemoryGraph } from '../../lib/memory-graph-engine';
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
              formula: file.gri_reference || 'GRI',
              impact_metric: file.file_name || 'Vault Evidence',
              evidence: {
                tangible_metric: file.file_name || 'Vault Evidence',
                source_origin: `/vault/${file.id}`,
                lifecycle_hooks: [],
                formula_ref: file.gri_reference || 'GRI'
              }
            } as any);
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
          formula: 'OmniAgent-v2',
          impact_metric: { value: 0 },
          evidence: {
            tangible_metric: 'ESG Intelligence Flow (oX Verified)',
            source_origin: 'Multi-source Scraper',
            lifecycle_hooks: [],
            formula_ref: 'OmniAgent-v2'
          }
        } as any);
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

  const handleDispatchTask = async (item: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          actorId: 'SYSTEM_INTELLIGENCE_TRIGGER', 
          taskType: 'compliance_review', 
          title: `法規應對: ${item.title}`, 
          description: `由商情中心自動觸發。針對項目: "${item.title}" (${item.category}) 進行 5T 合規性掃描與缺口分析。`,
          skillKey: 'gri_compliance_checker'
        }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`[oX Sovereign Dispatch] 已成功啟動蜂群任務！\n任務 ID: ${data.task.id.slice(-8)}\n代理人: Z0-Auditor 已介入。`);
      }
    } catch (e) {
      console.error('Dispatch failed', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'intelligence-hub',
    title: '商情中心 Intelligence Hub',
    subtitle: '即時法規追蹤 · 產業標竿對照 · 數據因果圖譜。',
    icon: <Globe size={32} className="text-berkeley-blue" />,
    griReference: 'Market Intelligence',
    activeT5Tags: ['T1', 'T2', 'T4'],
    isOXModule: true,
    features: { useAuditLog: true },

    primaryActions: [
      { id: 'ai-analyze', label: 'AI 市場分析', icon: <Sparkles size={16}/>, onClick: () => alert('OmniAgent 正在生成本週 ESG 策略報表...') },
      { id: 'refresh', label: '刷新數據', icon: <RefreshCw size={16}/>, variant: 'secondary', onClick: () => window.location.reload() }
    ],

    kpis: [
      { key: 'count', label: '情報總數', value: articles.length.toString(), icon: <Newspaper size={18}/> },
      { key: 'high-impact', label: '高衝擊法規', value: articles.filter(n => n.impactLevel === 'high').length.toString(), icon: <ShieldAlert size={18} className="text-error"/> },
      { key: 'accuracy', label: 'AI 提取準確率', value: '98.5', unit: '%', icon: <Target size={18} className="text-verified"/>, verified: true },
    ],

    sections: [
      {
        id: 'main-hub',
        title: '全域商情導航',
        columns: 12,
        component: (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <Tabs 
                active={activeTab}
                onChange={(t) => setActiveTab(t as any)}
                tabs={[
                  { key: 'news', label: '情報中心', icon: <Newspaper size={14}/> },
                  { key: 'graph', label: '記憶圖譜', icon: <Network size={14}/> },
                  { key: 'benchmark', label: '產業標竿', icon: <BarChart3 size={14}/> },
                  { key: 'risk', label: '風險預警', icon: <AlertTriangle size={14}/> },
                ]}
                variant="pills"
              />
              <div className="relative w-full md:w-80 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-berkeley-blue transition-colors" />
                <input 
                  className="w-full h-12 bg-white/60 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-medium shadow-sm focus:ring-4 focus:ring-berkeley-blue/5 transition-all outline-none backdrop-blur-md"
                  placeholder="搜尋情報、法規..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" className="min-h-[400px] flex flex-col items-center justify-center space-y-6">
                  <div className="w-14 h-14 border-4 border-slate-100 border-t-berkeley-blue rounded-full animate-spin" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Global Repository...</p>
                </motion.div>
              ) : (
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {activeTab === 'news' && (
                    <div className="space-y-6">
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
                        {categories.map(cat => (
                          <button key={cat} onClick={() => setSelectedCat(cat)}
                            className={cn(
                              "px-5 py-2.5 rounded-xl text-[12px] font-bold whitespace-nowrap border transition-all duration-300",
                              selectedCat === cat ? "bg-berkeley-blue text-california-gold border-berkeley-blue shadow-lg scale-105" : "bg-white/60 text-slate-400 border-slate-100 hover:border-berkeley-blue/30"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filtered.length > 0 ? filtered.map(item => (
                          <Card key={item.id} hoverEffect className="p-8 bg-white/60 border-white/80 shadow-glass relative overflow-hidden group">
                            <div className={cn("absolute top-0 left-0 w-1.5 h-full transition-all duration-500 group-hover:w-2", item.impactLevel === 'high' ? 'bg-error' : 'bg-berkeley-blue')} />
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <Badge variant={item.impactLevel === 'high' ? 'error' : 'primary'} className="px-3 py-1 font-black tracking-widest">{item.impactLevel === 'high' ? 'HIGH IMPACT' : 'MEDIUM'}</Badge>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                              </div>
                              <button className="text-slate-300 hover:text-california-gold transition-colors"><Bookmark size={18}/></button>
                            </div>
                            <h4 className="text-lg font-black text-berkeley-blue line-clamp-1 mb-2 tracking-tight group-hover:text-berkeley-dark transition-colors">{item.title}</h4>
                            <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 italic font-medium">"{item.summary}"</p>
                            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100/50">
                              <span className="text-[10px] font-mono text-slate-300 font-bold tracking-wider">{item.publishedAt || '2024-05-24'}</span>
                              <div className="flex gap-3">
                                {item.impactLevel === 'high' && (
                                  <Button 
                                    variant="glass" 
                                    size="sm" 
                                    className="h-9 px-4 border-error/20 text-error hover:bg-error/5"
                                    onClick={() => handleDispatchTask(item)}
                                  >
                                    <Zap size={12} className="mr-2" fill="currentColor"/> 啟動自動應對
                                  </Button>
                                )}
                                <Button variant="glass" size="sm" className="h-9 px-4 text-berkeley-blue font-black uppercase tracking-widest">READ <ArrowUpRight size={14} className="ml-2"/></Button>
                              </div>
                            </div>
                          </Card>
                        )) : (
                          <div className="col-span-2 py-20 text-center text-slate-300 font-black uppercase tracking-[0.4em] opacity-40">No Intelligence Data Found</div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'graph' && sampleGraph && (
                    <div className="space-y-8">
                      <Card className="p-8 bg-berkeley-blue rounded-[3rem] text-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10 space-y-3">
                          <div className="flex items-center gap-3 text-california-gold">
                            <Zap size={20} fill="currentColor"/>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Causal Analysis Active</span>
                          </div>
                          <p className="text-sm text-blue-50/80 leading-relaxed font-medium max-w-2xl">
                            OmniAgent 正在分析法規與企業數據間的聯動關係。每一筆情報都會自動映射至 5T 實證網絡，確保戰略調整具備完整的溯源背景。
                          </p>
                        </div>
                        <Bot size={140} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                      </Card>
                      <Card className="p-2 bg-white/40 border-white/60 shadow-glass overflow-hidden">
                        <MemoryGraphVisualizer graph={sampleGraph} />
                      </Card>
                    </div>
                  )}

                  {activeTab === 'benchmark' && (
                    <Card className="p-0 border-white/60 shadow-glass overflow-hidden rounded-[3rem]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                              {['企業 (Company)', '產業', 'E', 'S', 'G', 'Score'].map(h => (
                                <th key={h} className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100/50">
                            {benchmarks.map(b => (
                              <tr key={b.company} className="hover:bg-berkeley-blue/5 transition-colors group">
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-berkeley-blue font-black text-sm shadow-sm group-hover:scale-110 transition-transform">{b.company[0]}</div>
                                    <div>
                                      <p className="text-sm font-black text-slate-800">{b.company}</p>
                                      {b.certified && <Badge variant="verified" className="scale-75 origin-left mt-0.5">Verified</Badge>}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-tight">{b.industry}</td>
                                {[b.eScore, b.sScore, b.gScore].map((v, i) => (
                                  <td key={i} className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                          className="h-full bg-berkeley-blue" 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${v}%` }}
                                          transition={{ duration: 1.5, delay: 0.2 }}
                                        />
                                      </div>
                                      <span className="text-[11px] font-black text-slate-400 font-mono">{v}</span>
                                    </div>
                                  </td>
                                ))}
                                <td className="px-8 py-5">
                                  <span className="text-xl font-black text-berkeley-blue font-mono">{b.overall}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'risk' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {riskAlerts.map((alert, idx) => (
                        <Card key={idx} hoverEffect className="p-8 bg-white/60 border-white/80 shadow-glass flex gap-6 group">
                          <div className={cn(
                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-inner transition-transform group-hover:scale-110 duration-500",
                            alert.level === 'critical' ? 'bg-error/10 text-error' : 
                            alert.level === 'high' ? 'bg-warning/10 text-warning' : 'bg-berkeley-blue/10 text-berkeley-blue'
                          )}>
                            <AlertTriangle size={32} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[11px] font-black text-berkeley-blue/60 uppercase tracking-widest">{alert.gri}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                              <Badge variant={alert.level === 'critical' ? 'error' : alert.level === 'high' ? 'warning' : 'primary'} className="text-[9px] px-2">
                                {alert.level.toUpperCase()} RISK
                              </Badge>
                            </div>
                            <h4 className="text-base font-black text-slate-800 tracking-tight group-hover:text-berkeley-blue transition-colors">{alert.title}</h4>
                            <p className="text-[13px] text-slate-500 italic font-medium leading-relaxed">"{alert.desc}"</p>
                          </div>
                        </Card>
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
        title: 'OmniAgent 策略快報',
        columns: 4,
        component: (
          <div className="space-y-8">
            <Card className="bg-berkeley-blue text-white border-none shadow-2xl rounded-[3rem] relative overflow-hidden p-10">
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-california-gold flex items-center justify-center shadow-lg text-berkeley-blue">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-blue-200 uppercase tracking-[0.2em]">Strategy Insight</p>
                      <p className="text-sm font-black text-white mt-0.5">OmniAgent Governance v2.1</p>
                    </div>
                  </div>
                  <p className="text-base text-blue-50/90 leading-relaxed font-medium italic">
                    「偵測到金管會發布最新氣候揭露指南。您的產業需在 Q3 前完成範疇三數據路徑規劃。建議導入 **GRI 305-3 蜂群自動化模組**。」
                  </p>
                  <Button variant="secondary" className="w-full h-14 rounded-2xl text-sm tracking-widest font-black uppercase shadow-lg">
                    立即調整治理策略
                  </Button>
               </div>
               <Activity size={180} className="absolute -bottom-16 -right-16 text-white/5 rotate-12" />
            </Card>

            <div className="space-y-5 px-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">法規更新雷達</p>
              <div className="space-y-3">
                {['金管會 2024 新制', 'CBAM 第一階段', 'ISSB S2 生效', 'ISSA 5000 發布'].map((reg, i) => (
                  <motion.div 
                    key={reg} 
                    whileHover={{ x: 5 }}
                    className="p-5 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl flex items-center gap-5 hover:border-berkeley-blue/30 transition-all shadow-sm group cursor-pointer"
                  >
                    <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", i < 2 ? 'bg-error animate-pulse' : 'bg-berkeley-blue')} />
                    <span className="text-sm font-bold text-slate-700 flex-1 tracking-tight">{reg}</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-berkeley-blue transition-all" />
                  </motion.div>
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
