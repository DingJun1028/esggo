'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, BarChart2, PieChart, Target, Compass, Zap, Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';

const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
  { id: '1', title: '知識碎片', description: '全球 ESG 法規與市場趨勢瞬息萬變，企業難以從繁雜資訊中萃取有價值的洞察。', color: 'danger' },
  { id: '2', title: '全知檢索', description: '透過 Omniscience 終端，輸入關鍵字即可在 5T 協議宇宙中進行精準的語意檢索。', color: 'primary' },
  { id: '3', title: 'AI 提純', description: '系統將自動進行 Gnosis Synthesis (全知提純)，將多維度數據總結為高價值的策略建議。', color: 'accent' },
  { id: '4', title: '策略演化', description: '將洞察化為具體行動，提升企業時空熵值與戰略 ROI，實現永續競爭力。', color: 'success' }
];

interface SearchResult {
  id: string;
  payload: string;
  score: number;
  metadata: {
    category: string;
    insight: string;
    resonance: number;
    author: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function InsightThinkTankPage() {
  const { locale } = useLanguage();
  const langKey = locale === 'en' ? 'en' : 'tw';

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [synthesis, setSynthesis] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch('/api/omni/gnosis/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK: 3 })
      });
      const json = await res.json();
      if (json.success) {
        setResults(json.data.results);
        setSynthesis(json.data.synthesis);
      }
    } catch (err) {
      console.error("Omniscience Search Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-omni-surface text-omni-text-main p-8">
      <PageHeader
        title={langKey === 'tw' ? '策略演化室' : 'Evolution Think-Tank'}
        subtitle={langKey === 'tw' ? 'AI 驅動的永續趨勢分析與策略演化。進入全知終端檢索 5T 協議宇宙。' : 'AI-driven sustainability analysis and strategic evolution. Enter the Omniscience Terminal.'}
        category="STRATEGIC POSTURE"
      />

      <div className="max-w-7xl mx-auto mb-12">
        <OmniComicStrip panels={comicPanels} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: <TrendingUp />, label: { tw: '策略 ROI', en: 'Strategic ROI' }, val: '+18.5%', color: 'text-omni-accent' },
            { icon: <Compass />, label: { tw: '時空熵值', en: 'Spacetime Entropy' }, val: '0.042', color: 'text-omni-primary' },
            { icon: <BarChart2 />, label: { tw: '風險評級', en: 'Risk Score' }, val: 'AA+', color: 'text-emerald-500' },
            { icon: <Target />, label: { tw: '目標完成度', en: 'Goal Met' }, val: '91%', color: 'text-omni-primary' },
          ].map((stat, i) => (
            <LiquidGlassContainer key={i} className="p-6 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-omni-surface-2 text-omni-primary rounded-2xl group-hover:bg-omni-primary group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <span className="text-[10px] text-omni-text-muted font-black tracking-widest uppercase">{stat.label[langKey]}</span>
              </div>
              <span className={`text-xl font-black font-mono ${stat.color}`}>{stat.val}</span>
            </LiquidGlassContainer>
          ))}
        </div>

        {/* Omniscience Terminal */}
        <div className="mb-12 relative z-20">
          <LiquidGlassContainer className="p-2 relative group flex items-center shadow-2xl ring-1 ring-omni-primary/20 hover:ring-omni-primary/50 transition-all rounded-[2rem] bg-omni-surface">
            <form onSubmit={handleSearch} className="flex-1 flex items-center">
              <div className="pl-6 text-omni-primary opacity-50"><Search size={24} /></div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Omniscience Terminal: Enter your inquiry (e.g. Carbon, Social, Governance)..."
                className="w-full bg-transparent border-none outline-none text-omni-text-main text-lg px-6 py-6 font-mono placeholder-omni-text-muted/50"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-omni-primary/10 hover:bg-omni-primary text-omni-primary hover:text-white px-8 py-4 mr-2 rounded-2xl font-black transition-all flex items-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Compass size={18} />}
                {langKey === 'tw' ? '檢索全知' : 'Search Gnosis'}
              </button>
            </form>
          </LiquidGlassContainer>
        </div>

        {/* Synthesis Result */}
        <AnimatePresence>
          {synthesis && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
              <LiquidGlassContainer className="p-8 border-l-4 border-l-omni-accent">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="text-omni-accent animate-pulse" size={24} />
                  <h3 className="font-black text-omni-text-main text-xl tracking-widest uppercase">{langKey === 'tw' ? '全知提純 (Gnosis Synthesis)' : 'Gnosis Synthesis'}</h3>
                </div>
                <p className="text-omni-text-main leading-relaxed font-mono">{synthesis}</p>
              </LiquidGlassContainer>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {results.map((insight) => (
            <motion.div key={insight.id} variants={itemVariants}>
              <LiquidGlassContainer
                className={`p-8 h-full relative group border-l-4 ${insight.metadata.category === 'Environment' ? 'border-l-emerald-500' :
                  insight.metadata.category === 'Social' ? 'border-l-omni-accent' : 'border-l-omni-primary'
                  }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${insight.metadata.category === 'Environment' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      insight.metadata.category === 'Social' ? 'bg-omni-accent/10 text-omni-accent border border-omni-accent/20' :
                        'bg-omni-primary/10 text-omni-primary border border-omni-primary/20'
                      }`}>
                      {insight.metadata.category}
                    </span>
                    <span className="px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-white/5 text-omni-text-muted border border-omni-glass-border">
                      SCORE__{(insight.score * 100).toFixed(1)}
                    </span>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500 group-hover:scale-110 transition-transform">
                    <Lightbulb size={20} />
                  </div>
                </div>

                <h3 className="text-lg font-black text-omni-primary mb-6 leading-relaxed">
                  {insight.metadata.insight}
                </h3>

                <p className="text-sm text-omni-text-main leading-relaxed mb-6">
                  {insight.payload}
                </p>

                <div className="pt-6 mt-auto border-t border-omni-glass-border flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="text-[10px] font-mono text-omni-text-muted opacity-50">AUTHOR // {insight.metadata.author}</div>
                    <div className="text-[10px] font-mono text-omni-text-muted opacity-50">RESONANCE // {insight.metadata.resonance} HEP</div>
                  </div>
                </div>
              </LiquidGlassContainer>
            </motion.div>
          ))}
        </motion.div>

        {/* Teaching Banner: Insight as Asset */}
        <div className="mt-16 p-10 bg-omni-primary/5 border border-divider-1 rounded-[3rem] flex items-center gap-8 max-w-5xl mx-auto relative overflow-hidden group">
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-black text-omni-primary uppercase tracking-widest flex items-center gap-3">
              服務即教學：全知引擎的驗算 <Zap size={20} />
            </h3>
            <p className="text-sm text-omni-text-main leading-relaxed">
              您剛才使用的「全知終端」是基於 **Cosine Similarity (餘弦相似度)** 建立的 16 維度語義搜尋引擎 (Mock)。未來的 OmniGemini 節點將透過真實的 AI Embedding 與 RAG 架構，將散落的 5T ESG 數據聚合為有價值的「認知資產」。
            </p>
          </div>
          <Target size={120} className="absolute -right-8 -bottom-8 text-omni-primary opacity-5 rotate-12 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  );
}