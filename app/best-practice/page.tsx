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
    title: '蝭?銝???蝣喟?亙祕頦?, 
    industry: '??擃?/ 鋆賡平', 
    source: '?啁???2024 瘞貊??勗???, 
    tags: ['E', 'Scope 3', 'GRI 305-3'],
    rating: 5,
    summary: '???訾?撟喳?游? 1,200+ 靘???撖衣?豢??芸???? 5T 撽???,
    impact: '??靘????蝣箇? 35%嚗?雿?????20%'
  },
  { 
    id: 'bp_002', 
    title: '瘞貊????鞎豢狡 (SLB) 瘝餌??嗆?', 
    industry: '?? / ?銵平', 
    source: '?陸? SLB 獢 v2.1', 
    tags: ['G', 'Finance', 'ISSB S1'],
    rating: 4.8,
    summary: '撠?ESG KPI ?硫甈曉???歹?銝血??亦洵銝?單?蝣箔縑璈??,
    impact: '撟游?慦?瘞貊???頞? 500 ??隤縑閰? A+'
  },
  { 
    id: 'bp_003', 
    title: '憭??捆 (DEI) 鈭箸??遙蝑', 
    industry: '蝘? / 頠?璆?, 
    source: 'Google Global DEI Report', 
    tags: ['S', 'DEI', 'GRI 405'],
    rating: 4.5,
    summary: '撱箇??⊥?霅?閬閮?憭見??撣怠摨佗?撘瑕?撘勗?黎?蝞⊿???,
    impact: '撠???Ｚ????12%嚗??遛?漲??4.2/5'
  }
];

const EXPERT_TEMPLATES = [
  { id: 'tm_001', name: '瘞?◢??TCFD ?剝璅⊥', category: 'Environment', usage: 1240, difficulty: 'High', t5ready: true },
  { id: 'tm_002', name: '?之?扯降憿????極??, category: 'Governance', usage: 3500, difficulty: 'Medium', t5ready: true },
  { id: 'tm_003', name: '鈭箸??∟隤踵 (HRDD) 皜', category: 'Social', usage: 890, difficulty: 'High', t5ready: false },
  { id: 'tm_004', name: 'CBAM 蝣喲?憓?勗??刻”', category: 'Environment', usage: 2100, difficulty: 'Medium', t5ready: true },
];

export default function BestPracticeHubPage() {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'standards' | 'templates'>('benchmarks');
  const [searchQuery, setSearchSearchQuery] = useState('');
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<unknown[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchAiRecommendations = async () => {
    setLoadingAi(true);
    showToast('OmniAgent 甇????Ｘ平璅姪??祥???..', 'info');
    try {
      const res = await fetch('/api/ai/best-practices/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: '??擃ˊ?平' }) // Can be dynamic
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setAiRecommendations(data.recommendations || []);
      showToast('撌脩???撅祆?雿喳祕頦遣霅?, 'success');
    } catch (e) {
      showToast('AI 撱箄降撘??急?銝??, 'error');
    } finally {
      setLoadingAi(false);
    }
  };

  const applyPractice = async (practice: unknown) => {
    showToast(`甇?憟嚗?{practice.title}...`, 'info');
    try {
      // 1. Seal the decision with IntegrityService (Best Practice!)
      await integrityService.sealData('Best_Practice_Application', practice, { 
        user: 'Admin', 
        dept: 'ESG Committee',
        gri: practice.gri 
      });

      // 2. Add as a task (Simulated)
      showToast(`??嚗祕頦??亙歇?郊?喋遙?葉敹蒂摰? 5T 隤縑撠`, 'success');
    } catch (e) {
      showToast('憟憭望?', 'error');
    }
  };

  // ?? Universal Page Configuration ??????????????????????????????????
  const pageConfig: UniversalPageConfig = {
    id: 'best-practice-hub',
    title: '?雿喳祕頦?蝟餌絞撟喳',
    subtitle: '璅姪獢? 繚 撠振璅⊥ 繚 ??璅??mniAgent ?箸蝝Ｗ???,
    icon: <Trophy size={32} className="text-[#003262]" />,
    griReference: 'Best Practices',
    activeT5Tags: ['T1', 'T4', 'T5'],
    isOXModule: true,
    features: { useAuditLog: true },

    primaryActions: [
      { id: 'ai-suggest', label: 'AI ?刻撖西?', icon: loadingAi ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>, onClick: fetchAiRecommendations },
      { id: 'upload', label: '鞎Ｙ獢?', icon: <Share2 size={16}/>, variant: 'secondary', onClick: () => showToast('鞎Ｙ獢???銝?, 'info') }
    ],

    kpis: [
      { key: 'case_count', label: '?園?璅姪', value: '450', unit: '+', icon: <Star size={18} className="text-amber-500"/> },
      { key: 'template_use', label: '璅⊥銝?', value: '12', unit: 'K', icon: <Download size={18}/> },
      { key: 'industry_avg', label: '?Ｘ平????, value: '78', unit: '%', icon: <Target size={18}/>, verified: true },
    ],

    sections: [
      {
        id: 'main-nav',
        title: '鞈?撠',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={[
              { id: 'benchmarks', label: '璅姪獢?', icon: <Trophy size={14}/> },
              { id: 'standards', label: '閬???', icon: <BookOpen size={14}/> },
              { id: 'templates', label: '撠振璅⊥', icon: <Layout size={14}/> },
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
                  placeholder={`??${activeTab === 'benchmarks' ? '璅姪獢?' : activeTab === 'standards' ? '閬???' : '撠振璅⊥'} 銝剜?撠?..`}
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
                           <h3 className="text-lg font-black text-[#003262]">OmniAgent AI 撠惇?刻</h3>
                        </div>
                        <BrandButton variant="ghost" size="sm" onClick={() => setAiRecommendations([])}>皜</BrandButton>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {aiRecommendations.map((rec, i) => (
                           <BrandCard key={i} hover padding="md" className="bg-white border-blue-100/50 border-2">
                              <h4 className="font-black text-blue-700 mb-2">{rec.title}</h4>
                              <p className="text-xs text-slate-500 mb-4 line-clamp-3">{rec.description}</p>
                              <div className="flex items-center justify-between mt-auto">
                                 <BrandBadge variant="info" size="xs">{rec.gri}</BrandBadge>
                                 <BrandButton variant="primary" size="sm" className="rounded-xl h-8 text-[10px]" onClick={() => applyPractice(rec)}>
                                    憟
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
                             閰單? <ArrowUpRight size={14} className="ml-1" />
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
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.code} 繚 v{s.version}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-10">
                          <div className="hidden lg:flex flex-col text-right">
                             <span className="text-[10px] font-black text-slate-400 uppercase">???交?</span>
                             <span className="text-xs font-bold text-slate-700">{s.effectiveDate}</span>
                          </div>
                          <Link href="/standards">
                            <BrandButton variant="secondary" size="sm" className="rounded-xl border-slate-200 text-slate-500">
                               ?汗??
                            </BrandButton>
                          </Link>
                       </div>
                    </BrandCard>
                  ))}
                  <Link href="/standards">
                    <BrandButton variant="ghost" fullWidth className="py-8 border-dashed border-2 border-slate-100 rounded-3xl text-slate-400 hover:text-blue-600 transition-all">
                       ?亦?摰閬?摨?(20+ Standards) <ChevronRight size={16} className="ml-2" />
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
                          銝?
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

  
  const p = {
    id: `ESG-${"OMN"}`,
    title: 'Best Practice',
    sub: 'Best Practice Management'
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
            title="璅姪獢?瘛勗漲??"
            icon={<Award size={20} className="text-[#FDB515]"/>}
          >
            <div className="space-y-8 p-2">
               <div className="p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-100/50">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">獢?蝎曇 (Summary)</p>
                  <h3 className="text-2xl font-black text-[#003262] mb-4 leading-tight">{selectedPractice.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                     {selectedPractice.summary}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Target size={12}/> 撖西?敶梢??(Impact)
                     </p>
                     <p className="text-xs font-bold text-slate-700">{selectedPractice.impact}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <CheckCircle2 size={12}/> 撠???
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {selectedPractice.tags.map((t: string) => (
                           <BrandBadge key={t} variant="info" size="xs">{t}</BrandBadge>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">撠振銵?撱箄降</p>
                  <div className="p-6 bg-[#003262] rounded-[2.5rem] text-white space-y-4 relative overflow-hidden shadow-2xl">
                     <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                              <Zap size={18} />
                           </div>
                           <p className="text-xs font-black uppercase tracking-tight">OmniAgent Governance AI</p>
                        </div>
                        <p className="text-sm text-blue-100/90 leading-relaxed font-medium italic">
                           ?皜砍?函?隡平??${selectedPractice.industry} 銝剖?隡潛?蝯?蝯??遣霅啣??亙 5T ?芸???蝞芋???臬之撟?雿?閬撩??◢?芥?
                        </p>
                        <BrandButton variant="primary" fullWidth className="bg-blue-500 hover:bg-blue-400 h-12 rounded-2xl font-black" onClick={() => applyPractice(selectedPractice)}>
                           蝡憟甇文祕頦???
                        </BrandButton>
                     </div>
                     <Bot size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                  </div>
               </div>

               <div className="flex gap-4">
                  <BrandButton variant="secondary" fullWidth className="h-14 rounded-2xl border-slate-200">
                     <Bookmark size={18} className="mr-2"/> ?嗉??單摨?
                  </BrandButton>
                  <BrandButton variant="ghost" fullWidth className="h-14 rounded-2xl">
                     <MessageSquare size={18} className="mr-2"/> 隢株岷撠振??
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

