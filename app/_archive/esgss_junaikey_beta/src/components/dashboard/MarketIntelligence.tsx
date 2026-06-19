import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Radio, TrendingUp, Newspaper, Search, AlertCircle, Loader2 } from 'lucide-react';
import { MarketAnalysisService, MarketAnalysis } from '@/services/MarketAnalysisService';
import { SentiencePulseView } from './SentiencePulseView';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  timestamp: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export const MarketIntelligence: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysis | null>(null);
  const [auditingItems, setAuditingItems] = useState<Record<string, boolean>>({});
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Global Carbon Credits Market Surges 15%',
      source: 'Bloomberg ESG',
      category: 'Environmental',
      timestamp: '2m ago',
      impact: 'POSITIVE',
    },
    {
      id: '2',
      title: 'New EU Supply Chain Due Diligence Rules Finalized',
      source: 'Reuters',
      category: 'Governance',
      timestamp: '15m ago',
      impact: 'NEUTRAL',
    },
    {
      id: '3',
      title: 'Renewable Energy Investment Hits Record High in Q1',
      source: 'Financial Times',
      category: 'Social',
      timestamp: '1h ago',
      impact: 'POSITIVE',
    },
  ]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning(true);
      setTimeout(() => setScanning(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsAnalyzing(true);
    try {
      const result = await MarketAnalysisService.performDeepAnalysis(searchQuery);
      setAnalysisResult(result);

      // Update news with the summary for immediate feedback
      setNews(prev => [{
        id: Date.now().toString(),
        title: result.newsSummary,
        source: 'JunAiKey Analysis',
        category: 'Market Intelligence',
        timestamp: 'Just now',
        impact: result.sentiment
      }, ...prev.slice(0, 5)]);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MarketIntelligence] Analysis failed', { error })
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeepAudit = async (item: NewsItem) => {
    setAuditingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      const response = await fetch('http://localhost:4000/api/adk/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${item.title} (來源: ${item.source})` }),
      });
      const result = await response.json();
      if (result.success) {
        alert(`深度審核已啟動！會話 ID: ${result.sessionId}\n感知評分預演: ${result.state.sentientScore || '計算中'}`);
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MarketIntelligence] Deep Audit failed', { error })
    } finally {
      setAuditingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Globe size={16} />
          </div>
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-200">
            市場情報中心 (Market Intelligence)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            size={14}
            className={scanning ? 'text-indigo-400 animate-pulse' : 'text-slate-600'}
          />
          <span className="text-[9px] font-bold text-slate-500 uppercase">即時脈動 (Live Pulse)</span>
        </div>
      </div>

      <div className="p-4 border-b border-white/5 bg-white/5">
        <div className="relative">
          <input
            type="text"
            placeholder="搜尋公司名稱或統編 (BAN)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <button
            onClick={handleSearch}
            disabled={!searchQuery || isAnalyzing}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[8px] font-black uppercase hover:bg-indigo-500/30 disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              '開始分析'
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        <div className="relative h-24 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
          <AnimatePresence>
            {scanning && (
              <>
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="absolute w-20 h-20 border-2 border-indigo-500/30 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                  className="absolute w-20 h-20 border border-indigo-400/20 rounded-full"
                />
              </>
            )}
          </AnimatePresence>
          <div className="z-10 flex flex-col items-center">
            <TrendingUp size={24} className="text-indigo-400 mb-1" />
            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">
              掃描全球市場趨勢 (Scanning)
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
          <div className="flex items-center justify-between opacity-50">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
              最新預測觀察 (Latest Observations)
            </span>
            <Search size={10} />
          </div>
          {news.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-1 text-[8px] font-bold">
                <span className="text-indigo-400 uppercase tracking-tighter">{item.source}</span>
                <span className="text-slate-500">{item.timestamp}</span>
              </div>
              <h5 className="text-[10px] text-slate-200 font-bold leading-tight group-hover:text-white transition-colors capitalize">
                {item.title}
              </h5>
              <div className="mt-2 flex items-center justify-between">
                <div
                  className={`flex items-center gap-1 text-[8px] font-black ${item.impact === 'POSITIVE'
                    ? 'text-emerald-400'
                    : item.impact === 'NEGATIVE'
                      ? 'text-red-400'
                      : 'text-slate-400'
                    }`}
                >
                  <AlertCircle size={8} />
                  {item.impact} IMPACT
                </div>
                <button
                  onClick={() => handleDeepAudit(item)}
                  disabled={auditingItems[item.id]}
                  className="ml-2 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded text-[7px] font-black uppercase hover:bg-indigo-500/20 transition-all flex items-center gap-1"
                >
                  {auditingItems[item.id] ? <Loader2 size={8} className="animate-spin" /> : <TrendingUp size={8} />}
                  深度審核 (Deep Audit)
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-indigo-500/10 border-t border-indigo-500/20 flex items-center justify-center gap-2">
        <Newspaper size={12} className="text-indigo-400" />
        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">
          Observer 多模板報告已就緒
        </span>
      </div>

      <AnimatePresence>
        {Object.values(auditingItems).some(v => v) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50 bg-slate-900/80"
          >
            <SentiencePulseView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
