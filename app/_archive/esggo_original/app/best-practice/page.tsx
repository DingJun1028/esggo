'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, BookOpen, Layout, Globe, Shield, 
  ArrowUpRight, Search, Filter, Download, Zap, Sparkles,
  CheckCircle2, Landmark, Target, Award, Eye, FileText,
  Bookmark, Share2, MessageSquare, ChevronRight, List, Bot,
  Loader2, Plus
} from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandBadge, BrandTabs, BrandStatusDot, 
  BrandTable, StandardPage, BrandCardHeader, BrandModal
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { STANDARDS } from '../../lib/standards-data';
import { integrityService } from '../../lib/services/integrity-service';
import Link from 'next/link';

const BEST_PRACTICES = [
  { 
    id: 'bp_001', 
    title: '範疇三供應鏈碳盤查實踐', 
    industry: '半導體 / 製造業', 
    source: '台積電 2024 永續報告書', 
    tags: ['E', 'Scope 3', 'GRI 305-3'],
    rating: 5,
    summary: '透過數位平台整合 1,200+ 供應商，實現數據自動化收集與 5T 驗算。',
    impact: '提升供應商數據準確率 35%，降低溝通成本 20%'
  },
  { 
    id: 'bp_002', 
    title: '永續連結貸款 (SLB) 治理架構', 
    industry: '金融 / 銀行業', 
    source: '國泰金控 SLB 框架 v2.1', 
    tags: ['G', 'Finance', 'ISSB S1'],
    rating: 4.8,
    summary: '將 ESG KPI 與貸款利率掛鉤，並引入第三方即時確信機制。',
    impact: '年均媒合永續投資超過 500 億，誠信評分 A+'
  },
  { 
    id: 'bp_003', 
    title: '多元包容 (DEI) 人才留任策略', 
    industry: '科技 / 軟體業', 
    source: 'Google Global DEI Report', 
    tags: ['S', 'DEI', 'GRI 405'],
    rating: 4.5,
    summary: '建立無意識偏見培訓與多樣化導師制度，強化弱勢族群升遷管道。',
    impact: '少數族裔離職率下降 12%，團隊滿意度達 4.2/5'
  }
];

const EXPERT_TEMPLATES = [
  { id: 'tm_001', name: '氣候風險 TCFD 揭露模板', category: 'Environment', usage: 1240, difficulty: 'High', t5ready: true },
  { id: 'tm_002', name: '重大性議題分析矩陣工具', category: 'Governance', usage: 3500, difficulty: 'Medium', t5ready: true },
  { id: 'tm_003', name: '人權盡職調查 (HRDD) 清單', category: 'Social', usage: 890, difficulty: 'High', t5ready: false },
  { id: 'tm_004', name: 'CBAM 碳邊境申報專用表', category: 'Environment', usage: 2100, difficulty: 'Medium', t5ready: true },
];

export default function BestPracticeHubPage() {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'standards' | 'templates'>('benchmarks');
  const [searchQuery, setSearchSearchQuery] = useState('');
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchAiRecommendations = async () => {
    setLoadingAi(true);
    showToast('OmniAgent 正在分析產業標竿與您的治理數據...', 'info');
    try {
      const res = await fetch('/api/ai/best-practices/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: '半導體製造業' }) // Can be dynamic
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setAiRecommendations(data.recommendations || []);
      showToast('已生成專屬最佳實踐建議', 'success');
    } catch (e) {
      showToast('AI 建議引擎暫時不可用', 'error');
    } finally {
      setLoadingAi(false);
    }
  };

  const applyPractice = async (practice: any) => {
    showToast(`正在套用：${practice.title}...`, 'info');
    try {
      // 1. Seal the decision with IntegrityService (Best Practice!)
      await integrityService.sealData('Best_Practice_Application', practice, { 
        user: 'Admin', 
        dept: 'ESG Committee',
        gri: practice.gri 
      });

      // 2. Add as a task (Simulated)
      showToast(`成功！實踐策略已同步至「任務中心」並完成 5T 誠信封印`, 'success');
    } catch (e) {
      showToast('套用失敗', 'error');
    }
  };

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'best-practice-hub',
    title: '最佳實踐化系統平台',
    subtitle: '標竿案例 · 專家模板 · 國際標準。OmniAgent 智慧索引。',
    icon: <Trophy size={32} className="text-[#003262]" />,
    griReference: 'Best Practices',
    activeT5Tags: ['T1', 'T4', 'T5'],
    isOXModule: true,
    features: { useAuditLog: true },

    primaryActions: [
      { id: 'ai-suggest', label: 'AI 推薦實踐', icon: loadingAi ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>, onClick: fetchAiRecommendations },
      { id: 'upload', label: '貢獻案例', icon: <Share2 size={16}/>, variant: 'secondary', onClick: () => showToast('貢獻案例功能開發中', 'info') }
    ],

    kpis: [
      { key: 'case_count', label: '收錄標竿', value: '450', unit: '+', icon: <Star size={18} className="text-amber-500"/> },
      { key: 'template_use', label: '模板下載', value: '12', unit: 'K', icon: <Download size={18}/> },
      { key: 'industry_avg', label: '產業達成率', value: '78', unit: '%', icon: <Target size={18}/>, verified: true },
    ],

    sections: [
      {
        id: 'main-nav',
        title: '資源導航',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={[
              { id: 'benchmarks', label: '標竿案例', icon: <Trophy size={14}/> },
              { id: 'standards', label: '規範手冊', icon: <BookOpen size={14}/> },
              { id: 'templates', label: '專家模板', icon: <Layout size={14}/> },
            ]}
          />
        )
      },
      {
        id: 'content-area',
        title: activeTab === 'benchmarks' ? 'Industry Benchmarks' : activeTab === 'standards' ? 'Governance Standards' : 'Expert Blueprints',
        columns: 12,
        component: (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Search Bar */}
             <div className="relative group">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" />
                <input 
                  className="w-full h-16 bg-white border border-slate-100 rounded-[2rem] pl-16 pr-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  placeholder={`在 ${activeTab === 'benchmarks' ? '標竿案例' : activeTab === 'standards' ? '規範手冊' : '專家模板'} 中搜尋...`}
                  value={searchQuery}
                  onChange={(e) => setSearchSearchQuery(e.target.value)}
                />
             </div>

             {/* AI Recommendations Section */}
             <AnimatePresence>
                {aiRecommendations.length > 0 && activeTab === 'benchmarks' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-200/30 space-y-6"
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-blue-600 rounded-xl text-white">
                              <Sparkles size={18} />
                           </div>
                           <h3 className="text-lg font-black text-[#003262]">OmniAgent AI 專屬推薦</h3>
                        </div>
                        <BrandButton variant="ghost" size="sm" onClick={() => setAiRecommendations([])}>清除</BrandButton>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {aiRecommendations.map((rec, i) => (
                           <BrandCard key={i} hover padding="md" className="bg-white border-blue-100/50 border-2">
                              <h4 className="font-black text-blue-700 mb-2">{rec.title}</h4>
                              <p className="text-xs text-slate-500 mb-4 line-clamp-3">{rec.description}</p>
                              <div className="flex items-center justify-between mt-auto">
                                 <BrandBadge variant="info" size="xs">{rec.gri}</BrandBadge>
                                 <BrandButton variant="primary" size="sm" className="rounded-xl h-8 text-[10px]" onClick={() => applyPractice(rec)}>
                                    套用
                                 </BrandButton>
                              </div>
                           </BrandCard>
                        ))}
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>

             {/* Tab Content: Benchmarks */}
             {activeTab === 'benchmarks' && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {BEST_PRACTICES.filter(p => p.title.includes(searchQuery)).map(p => (
                    <BrandCard key={p.id} hover padding="lg" className="flex flex-col h-full border-none shadow-premium relative overflow-hidden" onClick={() => setSelectedPractice(p)}>
                       <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-8 -mt-8" />
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-wrap gap-2">
                             {p.tags.map(t => <BrandBadge key={t} variant="outline" size="xs" className="font-black bg-white">{t}</BrandBadge>)}
                          </div>
                          <div className="flex items-center gap-1">
                             <Star size={12} className="text-[#FDB515] fill-current" />
                             <span className="text-[10px] font-black text-slate-400">{p.rating}</span>
                          </div>
                       </div>
                       <h4 className="text-lg font-black text-[#003262] mb-2 leading-tight">{p.title}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Globe size={12} /> {p.source}
                       </p>
                       <p className="text-xs text-slate-500 leading-relaxed flex-1 italic">
                          "{p.summary}"
                       </p>
                       <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] font-black text-blue-600 uppercase">{p.industry}</span>
                          <BrandButton variant="ghost" size="sm" className="p-0 h-auto text-slate-400 hover:text-[#003262]">
                             詳情 <ArrowUpRight size={14} className="ml-1" />
                          </BrandButton>
                       </div>
                    </BrandCard>
                  ))}
               </div>
             )}

             {/* Tab Content: Standards */}
             {activeTab === 'standards' && (
               <div className="grid grid-cols-1 gap-4">
                  {STANDARDS.slice(0, 5).map(s => (
                    <BrandCard key={s.id} padding="md" className="flex items-center justify-between border-slate-100 hover:border-blue-200 transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Landmark size={24} />
                          </div>
                          <div>
                             <h4 className="font-black text-[#003262]">{s.nameZh}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.code} · v{s.version}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-10">
                          <div className="hidden lg:flex flex-col text-right">
                             <span className="text-[10px] font-black text-slate-400 uppercase">生效日期</span>
                             <span className="text-xs font-bold text-slate-700">{s.effectiveDate}</span>
                          </div>
                          <Link href="/standards">
                            <BrandButton variant="secondary" size="sm" className="rounded-xl border-slate-200 text-slate-500">
                               瀏覽指南
                            </BrandButton>
                          </Link>
                       </div>
                    </BrandCard>
                  ))}
                  <Link href="/standards">
                    <BrandButton variant="ghost" fullWidth className="py-8 border-dashed border-2 border-slate-100 rounded-3xl text-slate-400 hover:text-blue-600 transition-all">
                       查看完整規範庫 (20+ Standards) <ChevronRight size={16} className="ml-2" />
                    </BrandButton>
                  </Link>
               </div>
             )}

             {/* Tab Content: Templates */}
             {activeTab === 'templates' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {EXPERT_TEMPLATES.map(t => (
                    <BrandCard key={t.id} hover padding="lg" className="border-none shadow-sm flex items-center gap-6 group">
                       <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all duration-500">
                          <FileText size={32} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-black text-berkeley-blue truncate">{t.name}</h4>
                             {t.t5ready && <BrandBadge variant="success" size="xs" className="scale-75 origin-left">5T Ready</BrandBadge>}
                          </div>
                          <div className="flex items-center gap-4">
                             <span className="text-[10px] font-bold text-slate-400 uppercase">{t.category}</span>
                             <div className="h-1 w-1 rounded-full bg-slate-200" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase">{t.difficulty} Difficulty</span>
                          </div>
                       </div>
                       <BrandButton variant="primary" size="sm" className="rounded-xl px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          下載
                       </BrandButton>
                    </BrandCard>
                  ))}
               </div>
             )}
          </div>
        )
      }
    ]
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />

      {/* Detail Modal for Benchmarks */}
      <AnimatePresence>
        {selectedPractice && (
          <BrandModal 
            open={!!selectedPractice} 
            onClose={() => setSelectedPractice(null)}
            title="標竿案例深度分析"
            icon={<Award size={20} className="text-[#FDB515]"/>}
          >
            <div className="space-y-8 p-2">
               <div className="p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-100/50">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">案例精華 (Summary)</p>
                  <h3 className="text-2xl font-black text-[#003262] mb-4 leading-tight">{selectedPractice.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                     {selectedPractice.summary}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Target size={12}/> 實踐影響力 (Impact)
                     </p>
                     <p className="text-xs font-bold text-slate-700">{selectedPractice.impact}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <CheckCircle2 size={12}/> 對齊指標
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {selectedPractice.tags.map((t: string) => (
                           <BrandBadge key={t} variant="info" size="xs">{t}</BrandBadge>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">專家行動建議</p>
                  <div className="p-6 bg-[#003262] rounded-[2.5rem] text-white space-y-4 relative overflow-hidden shadow-2xl">
                     <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                              <Zap size={18} />
                           </div>
                           <p className="text-xs font-black uppercase tracking-tight">OmniAgent Governance AI</p>
                        </div>
                        <p className="text-sm text-blue-100/90 leading-relaxed font-medium italic">
                           「偵測到您的企業在 ${selectedPractice.industry} 中具備相似的組織結構。建議導入其 5T 自動化驗算模型，可大幅降低合規缺口風險。」
                        </p>
                        <BrandButton variant="primary" fullWidth className="bg-blue-500 hover:bg-blue-400 h-12 rounded-2xl font-black" onClick={() => applyPractice(selectedPractice)}>
                           立即套用此實踐策略
                        </BrandButton>
                     </div>
                     <Bot size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                  </div>
               </div>

               <div className="flex gap-4">
                  <BrandButton variant="secondary" fullWidth className="h-14 rounded-2xl border-slate-200">
                     <Bookmark size={18} className="mr-2"/> 收藏至智庫
                  </BrandButton>
                  <BrandButton variant="ghost" fullWidth className="h-14 rounded-2xl">
                     <MessageSquare size={18} className="mr-2"/> 諮詢專家看法
                  </BrandButton>
               </div>
            </div>
          </BrandModal>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] border backdrop-blur-md ${
              toast.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 
              toast.type === 'error' ? 'bg-red-500/90 text-white border-red-400/50' :
              'bg-[#003262]/90 text-white border-blue-400/50'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20}/> : toast.type === 'error' ? <Zap size={20}/> : <Bot size={20} className="animate-pulse"/>}
            <p className="text-xs font-black tracking-tight">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
