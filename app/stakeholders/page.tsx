'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, TrendingUp, MessageSquare, Star, Plus, Filter, ShieldCheck, Heart, 
  BarChart3, ArrowUpRight, CheckCircle2, AlertTriangle, Bot, Sparkles, X, 
  History, Vote, Shield, Zap, Target 
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, 
  BrandProgress, StandardPage, BrandCardHeader, BrandModal
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';
import { ResonanceMatrix } from '../../components/ui/ResonanceMatrix';
import { governanceEngine, StakeholderVote, MaterialityTopic, ResonanceResult } from '../../lib/governance-engine';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface Stakeholder {
  id: string;
  name: string;
  type: string;
  influence: number;
  concern: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  engagements: number;
  lastContact: string;
  topics: string[];
}

const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: '1', name: '機構投資者聯盟', type: '投資者', influence: 9, concern: 8, sentiment: 'positive', engagements: 12, lastContact: '2024-04-10', topics: ['ESG 評級', 'TCFD 揭露'] },
  { id: '2', name: '台灣環保聯盟', type: '非政府組織', influence: 7, concern: 9, sentiment: 'neutral', engagements: 5, lastContact: '2024-03-22', topics: ['碳排放', '廢水處理'] },
  { id: '3', name: '員工代表委員會', type: '員工', influence: 8, concern: 7, sentiment: 'positive', engagements: 24, lastContact: '2024-04-15', topics: ['薪酬福利', '工作安全'] },
  { id: '4', name: '主要客戶群 (B2B)', type: '客戶', influence: 9, concern: 6, sentiment: 'positive', engagements: 18, lastContact: '2024-04-20', topics: ['供應鏈透明', '碳足跡'] },
];

const SENTIMENT_META = {
  positive: { label: '正向', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  neutral:  { label: '中立', color: '#FDB515', bg: 'rgba(253, 181, 21, 0.1)' },
  negative: { label: '負向', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

const MATERIALITY_TOPICS: MaterialityTopic[] = [
  { id: 't-1', label: '氣候變遷 (碳排放)', category: 'E', internalWeight: 5 },
  { id: 't-2', label: '水資源管理', category: 'E', internalWeight: 3 },
  { id: 't-3', label: '員工權益與多元化', category: 'S', internalWeight: 4 },
  { id: 't-4', label: '供應鏈人權', category: 'S', internalWeight: 2 },
  { id: 't-5', label: '商業道德與合規', category: 'G', internalWeight: 5 },
];

export default function StakeholdersPage() {
  const { user } = useAuth();
  const [stakeholders] = useState<Stakeholder[]>(MOCK_STAKEHOLDERS);
  const [activeTab, setActiveTab] = useState('matrix');
  const [selected, setSelected] = useState<Stakeholder | null>(null);
  
  // Governance State
  const [votes, setVotes] = useState<StakeholderVote[]>([]);
  const [resonanceResults, setResonanceResults] = useState<ResonanceResult[]>([]);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(MATERIALITY_TOPICS[0]);
  const [voteScore, setVoteScore] = useState(3);

  useEffect(() => {
    // Initial calculation
    const results = governanceEngine.calculateResonance(MATERIALITY_TOPICS, votes);
    setResonanceResults(results);
  }, [votes]);

  const castVote = async () => {
    setIsCasting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const newVote = await governanceEngine.castVote({
      stakeholderType: 'INVESTOR', // Mocking as investor for demo
      topicId: selectedTopic.id,
      priorityScore: voteScore
    });

    setVotes(prev => [...prev, newVote]);
    setIsCasting(false);
    setShowVoteModal(false);
  };

  const overallResonance = governanceEngine.getOverallResonanceIndex(resonanceResults);

  const pageConfig: UniversalPageConfig = {
    id: 'stakeholders',
    title: '利害關係人 Stakeholders',
    subtitle: 'GRI 2-29 · 影響力矩陣 · 共鳴分析：建立企業與外部利害關係人的「信任共鳴」機制。',
    icon: <Users size={32} />,
    griReference: 'GRI 2-29',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4'],
    primaryActions: [
      { id: 'vote', label: '參與重大性投票', icon: <Vote size={16}/>, variant: 'primary', onClick: () => setShowVoteModal(true) },
      { id: 'add', label: '新增關係人', icon: <Plus size={16}/>, variant: 'ghost', onClick: () => alert('新增流程...') }
    ],
    kpis: [
      { key: 'total', label: '關係人總數', value: stakeholders.length, icon: <Users size={18}/>, color: '#003262' },
      { key: 'resonance', label: '共鳴指數', value: overallResonance, unit: '%', icon: <Zap size={18}/>, color: '#8B5CF6', verified: true },
      { key: 'positive', label: '正向情感', value: '75', unit: '%', icon: <Heart size={18}/>, color: '#10B981', verified: true },
      { key: 'high', label: '高影響力', value: stakeholders.filter(s => s.influence >= 8).length, icon: <ShieldCheck size={18}/>, color: '#3B7EA1' },
    ],
    sections: [
      {
        id: 'tabs',
        title: '檢視模式',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'matrix', label: '影響力矩陣', icon: <BarChart3 size={16}/> },
              { id: 'resonance', label: '共鳴矩陣 (New)', icon: <Zap size={16}/> },
              { id: 'list',   label: '名冊清單',   icon: <Users size={16}/> },
            ]}
          />
        )
      },
      {
        id: 'main',
        title: activeTab === 'matrix' ? '影響力 vs 關注度 矩陣' : activeTab === 'resonance' ? '利益相關者期望共鳴' : '利害關係人名冊',
        columns: activeTab === 'resonance' ? 12 : 8,
        component: (
          <div className="fade-in h-full">
            {activeTab === 'matrix' ? (
              <BrandCard padding="none" className="glass-panel border-none shadow-premium p-10 h-full min-h-[500px] flex flex-col">
                 <div className="relative flex-1 bg-slate-50/50 rounded-[32px] border border-slate-100 overflow-hidden">
                    {/* Matrix Grid */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '25% 25%' }} />
                    <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-slate-200" />
                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-slate-200" />
                    
                    <div className="absolute top-6 left-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">高關注 / 低影響</div>
                    <div className="absolute top-6 right-6 text-[10px] font-black text-[#003262]/40 uppercase tracking-widest text-right">核心深度協作</div>
                    <div className="absolute bottom-6 left-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">被動監控</div>
                    <div className="absolute bottom-6 right-6 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">管理期望</div>

                    {stakeholders.map(s => (
                      <motion.button
                        key={s.id}
                        whileHover={{ scale: 1.2, zIndex: 50 }}
                        onClick={() => setSelected(s)}
                        className="absolute w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-sm transition-colors"
                        style={{ 
                          left: `${(s.influence / 10) * 100}%`, 
                          bottom: `${(s.concern / 10) * 100}%`,
                          backgroundColor: SENTIMENT_META[s.sentiment].color,
                          transform: 'translate(-50%, 50%)'
                        }}
                      >
                        {s.name.charAt(0)}
                      </motion.button>
                    ))}
                 </div>
                 <div className="mt-8 flex flex-wrap gap-6 justify-center">
                    {Object.entries(SENTIMENT_META).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{v.label}傾向</span>
                      </div>
                    ))}
                 </div>
              </BrandCard>
            ) : activeTab === 'resonance' ? (
               <ResonanceMatrix results={resonanceResults} />
            ) : (
              <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
                 <BrandTable 
                  columns={[
                    { label: '關係人名稱', key: 'name' },
                    { label: '類別', key: 'type' },
                    { label: '指標 (I/C)', key: 'metrics' },
                    { label: '情感', key: 'sentiment' },
                    { label: '最後聯絡', key: 'date' },
                  ]}
                  data={stakeholders.map(s => ({
                    name: <span className="font-bold text-[#003262]">{s.name}</span>,
                    type: <BrandBadge variant="outline" size="xs" className="opacity-60">{s.type}</BrandBadge>,
                    metrics: <span className="font-mono text-xs font-black">{s.influence} / {s.concern}</span>,
                    sentiment: <BrandBadge variant="outline" size="xs" style={{ color: SENTIMENT_META[s.sentiment].color, backgroundColor: SENTIMENT_META[s.sentiment].bg, borderColor: 'transparent' }}>{SENTIMENT_META[s.sentiment].label}</BrandBadge>,
                    date: <span className="font-mono text-[11px] text-slate-400 font-bold">{s.lastContact}</span>
                  }))}
                 onRowClick={(row: any) => setSelected(stakeholders.find(s => s.name === (row.name as any).props.children) || null)}
                 />
              </BrandCard>
            )}
          </div>
        )
      },
      activeTab !== 'resonance' ? {
        id: 'ai',
        title: 'OmniAgent 關係人分析',
        columns: 4,
        component: (
          <BrandCard padding="none" className="bg-[#003262] border-none shadow-extreme overflow-hidden h-full flex flex-col group">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]">
                <Bot size={200} color="#fff" strokeWidth={0.5} />
             </div>
             <div className="p-8 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-3 text-[#FDB515] mb-2">
                   <Sparkles size={20} className="animate-pulse" />
                   <h3 className="text-lg font-black text-white uppercase tracking-tight">議合風險預警</h3>
                </div>
                <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.3em]">OmniAgent Sentiment Node</p>
             </div>
             <div className="p-8 flex-1 relative z-10 text-base text-blue-50/80 leading-relaxed font-medium italic">
                偵測到「環保聯盟」近期在公開場合對本公司廢水處理流程表示關注。建議主動發送「T1 溯源報告」。
             </div>
             <div className="p-8 mt-auto border-t border-white/5 relative z-10">
                <BrandButton variant="secondary" fullWidth className="rounded-2xl h-14 font-black shadow-2xl shadow-black/20" onClick={() => window.location.href='/intelligence'}>
                   生成回覆建議 <ArrowUpRight size={16} className="ml-2" />
                </BrandButton>
             </div>
          </BrandCard>
        )
      } : null as any
    ].filter(Boolean) as any,
    features: { useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      
      {/* Vote Modal */}
      <BrandModal open={showVoteModal} onClose={() => setShowVoteModal(false)} title="重大性議題投票 (Stakeholder Voting)" size="md">
        <div className="space-y-8">
           <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
              <Shield size={20} className="text-blue-600 mt-1" />
              <p className="text-xs text-blue-800 leading-relaxed">
                 您的投票將經過 <strong>T4 雜湊鎖定</strong> 並匿名存入 5T 帳本。企業管理層無法單方面修改您的投票結果。
              </p>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">選擇 ESG 議題</label>
              <div className="grid grid-cols-1 gap-2">
                 {MATERIALITY_TOPICS.map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => setSelectedTopic(t)}
                     className={cn(
                       "p-4 rounded-xl border transition-all text-left flex justify-between items-center",
                       selectedTopic.id === t.id ? "bg-berkeley-blue text-white border-berkeley-blue shadow-lg" : "bg-white border-slate-100 text-slate-700 hover:border-blue-200"
                     )}
                   >
                     <span className="font-bold text-sm">{t.label}</span>
                     <BrandBadge variant="outline" size="xs" className={selectedTopic.id === t.id ? "text-white border-white/30" : "opacity-60"}>{t.category}</BrandBadge>
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">優先級權重 (Priority)</label>
                 <span className="text-2xl font-black text-berkeley-blue font-mono">{voteScore}</span>
              </div>
              <input 
                type="range" min="1" max="5" value={voteScore} 
                onChange={e => setVoteScore(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-berkeley-blue"
              />
              <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase px-1">
                 <span>低優先</span>
                 <span>中立</span>
                 <span>極高優先</span>
              </div>
           </div>

           <BrandButton variant="primary" fullWidth size="lg" className="h-14 shadow-xl" onClick={castVote} loading={isCasting}>
              <CheckCircle2 size={18} className="mr-2" /> 投下加密選票
           </BrandButton>
        </div>
      </BrandModal>

      {/* Existing Stakeholder Detail Modal (Truncated for brevity in this replace) */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setSelected(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-xl w-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              <header className="mb-10 relative z-10">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003262] shadow-sm"><Users size={24} /></div>
                      <div><h3 className="text-2xl font-black text-[#003262] tracking-tight">{selected.name}</h3><BrandBadge variant="info" size="xs" className="mt-1">{selected.type}</BrandBadge></div>
                   </div>
                   <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all"><X size={20} /></button>
                </div>
              </header>
              <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                 <div className="p-6 bg-slate-50/50 rounded-[24px] border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">影響力</p><div className="text-4xl font-black text-[#003262] font-mono">{selected.influence} <span className="text-sm text-slate-300">/ 10</span></div></div>
                 <div className="p-6 bg-slate-50/50 rounded-[24px] border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">關注度</p><div className="text-4xl font-black text-[#003262] font-mono">{selected.concern} <span className="text-sm text-slate-300">/ 10</span></div></div>
              </div>
              <div className="space-y-6 relative z-10">
                 <div className="space-y-3"><h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">關注議題</h4><div className="flex flex-wrap gap-2">{selected.topics.map((t, i) => <BrandBadge key={i} variant="outline" size="sm" className="px-3 border-slate-200 text-slate-500 font-bold">{t}</BrandBadge>)}</div></div>
                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"><div className="flex items-center gap-3"><History size={16} className="text-slate-300" /><span className="text-xs font-black text-slate-400 uppercase">Last Contact</span></div><span className="text-sm font-black text-[#003262] font-mono">{selected.lastContact}</span></div>
              </div>
              <footer className="mt-12"><BrandButton variant="primary" fullWidth className="rounded-2xl h-14 font-black shadow-xl" onClick={() => setSelected(null)}>關閉詳情</BrandButton></footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
