/**
 * 📰 永續資訊補給站 - 每日 ESG 新聞 (v3.0 旗艦版)
 * --------------------------------------------------
 * [功能] C1 - 全球 ESG 情報總部 (Global Intelligence HQ)
 * [風格] High-end Futuristic (Glassmorphism + Neon + Holographic)
 * [語言] 全繁體中文
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  TrendingUp,
  Filter,
  Search,
  Clock,
  Hash,
  ExternalLink,
  Flame,
  Globe,
  Zap,
  Activity,
  ChevronRight,
  rss,
} from 'lucide-react';

// --- 元件介面 ---
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Environment' | 'Social' | 'Governance' | 'General';
  industry: string;
  source: string;
  publishTime: number;
  hotness: number; // 0-100
  trend: 'up' | 'stable' | 'down';
  tags: string[];
  impactScore: number; // AI 分析
}

// --- 技術標籤 (Tech Badge) ---
const TechBadge: React.FC<{ icon: React.ReactNode; label: string; color: string }> = ({
  icon,
  label,
  color,
}) => (
  <div
    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border backdrop-blur-md ${color} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
  >
    {icon}
    {label}
  </div>
);

// --- 主組件 ---
export const DailyESGNews: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<
    'All' | 'Environment' | 'Social' | 'Governance' | 'General'
  >('All');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模擬 AI 聚合數據加載
    setTimeout(() => {
      setNewsList([
        {
          id: 'NEWS-001',
          title: '歐盟 CBAM 正式啟動：台灣製造業的碳戰略布局',
          summary:
            '歐盟碳邊境調整機制 (CBAM) 進入過渡期，經濟部評估對台灣金屬、扣件產業衝擊最大。專家建議企業應立即導入 ISO 14064-1 數位盤查系統，以應對未來申報需求...',
          category: 'Environment',
          industry: '製造業',
          source: 'Global ESG Insight',
          publishTime: Date.now() - 3600000,
          hotness: 98,
          trend: 'up',
          tags: ['CBAM', '碳稅', '歐盟法規'],
          impactScore: 9.5,
        },
        {
          id: 'NEWS-002',
          title: '金管會發布「永續金融評鑑 2.0」指標草案',
          summary:
            '新版評鑑指標將納入「防漂綠」檢核機制，並要求金融機構揭露範疇三投融資碳排。此舉將引導資金流向真正的綠色企業，提升市場透明度。',
          category: 'Governance',
          industry: '金融業',
          source: 'Financial Times TW',
          publishTime: Date.now() - 7200000,
          hotness: 88,
          trend: 'stable',
          tags: ['綠色金融', '漂綠', 'SASB'],
          impactScore: 8.2,
        },
        {
          id: 'NEWS-003',
          title: '科技大廠供應鏈人權審查：AI 監測系統上線',
          summary:
            '知名科技集團宣布啟用 AI 供應鏈監測系統，透過衛星影像與社群數據分析，即時偵測供應鏈強迫勞動風險。此系統將覆蓋東南亞及中南美洲主要供應商...',
          category: 'Social',
          industry: '科技業',
          source: 'Tech For Good',
          publishTime: Date.now() - 10800000,
          hotness: 92,
          trend: 'up',
          tags: ['供應鏈管理', '人權', 'AI監測'],
          impactScore: 8.8,
        },
        {
          id: 'NEWS-004',
          title: '2024 全球永續報告書趨勢：TNFD 自然相關揭露',
          summary:
            '隨著 TNFD 最終版框架發布，越來越多企業開始關注自然相關風險。報告顯示，生物多樣性將成為繼氣候變遷後的下一個揭露重點。',
          category: 'General',
          industry: '全產業',
          source: 'Nature Finance',
          publishTime: Date.now() - 86400000,
          hotness: 75,
          trend: 'up',
          tags: ['TNFD', '生物多樣性', '風險揭露'],
          impactScore: 7.0,
        },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredNews = newsList.filter(news => {
    const matchCategory = filterCategory === 'All' || news.category === filterCategory;
    const matchSearch =
      searchKeyword === '' ||
      news.title.includes(searchKeyword) ||
      news.summary.includes(searchKeyword) ||
      news.tags.some(tag => tag.includes(searchKeyword));
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 font-sans relative overflow-hidden flex flex-col">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col">
        {/* 戰情室 Header */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl border border-pink-500/30 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                <Globe size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-pink-200 uppercase tracking-tight">
                  全球 ESG 情報總部
                </h1>
                <div className="flex items-center gap-2 text-xs font-mono text-pink-400/80">
                  <Activity size={12} className="animate-pulse" />
                  <span>即時數據串流</span>
                  <span className="text-slate-600">|</span>
                  <span>Ver 3.1.0</span>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              每日彙整全球 <span className="text-white font-bold">15,000+</span> 權威 ESG
              資訊源，運用 AI 自然語言處理技術，即時偵測法規變動與產業風險。
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
            <div className="flex gap-2">
              <TechBadge
                icon={<TrendingUp size={12} />}
                label="AI 趨勢預測"
                color="bg-pink-950/40 text-pink-300 border-pink-500/30"
              />
              <TechBadge
                icon={<Filter size={12} />}
                label="NLP 語意篩選"
                color="bg-purple-950/40 text-purple-300 border-purple-500/30"
              />
            </div>
            <div className="text-right text-[10px] text-slate-500 font-mono">
              上次更新: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        {/* 控制台 (搜尋 & 篩選) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative w-full lg:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className="text-slate-500 group-focus-within:text-pink-400 transition-colors"
                  size={18}
                />
              </div>
              <input
                type="text"
                placeholder="搜尋重大事件..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm placeholder-slate-500 text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
              />
            </div>

            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
              <div className="flex gap-2">
                {(['All', 'Environment', 'Social', 'Governance', 'General'] as const).map(
                  category => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden group ${
                        filterCategory === category
                          ? 'text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                          : 'text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800'
                      }`}
                    >
                      {/* 按鈕背景特效 */}
                      {filterCategory === category && (
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-90"></div>
                      )}
                      <span className="relative z-10">{category}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 新聞列表 (Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 pb-12">
          <AnimatePresence>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : filteredNews.map((news, index) => (
                  <NewsCard key={news.id} data={news} index={index} />
                ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- 子組件 ---

const NewsCard: React.FC<{ data: NewsItem; index: number }> = ({ data, index }) => {
  const categoryStyles = {
    Environment: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10',
    },
    Social: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-950/20',
      text: 'text-blue-400',
      badge: 'bg-blue-500/10',
    },
    Governance: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/20',
      text: 'text-purple-400',
      badge: 'bg-purple-500/10',
    },
    General: {
      border: 'border-slate-500/30',
      bg: 'bg-slate-900/50',
      text: 'text-slate-400',
      badge: 'bg-slate-500/10',
    },
  };

  const style = categoryStyles[data.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 hover:border-pink-500/30 transition-all hover:bg-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] flex flex-col h-full`}
    >
      {/* 頂部彩色線條 */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${
          data.category === 'Environment'
            ? 'from-emerald-500 to-green-300'
            : data.category === 'Social'
              ? 'from-blue-500 to-cyan-300'
              : data.category === 'Governance'
                ? 'from-purple-500 to-pink-300'
                : 'from-slate-500 to-slate-300'
        }`}
      />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold border ${style.border} ${style.bg} ${style.text}`}
            >
              {data.category}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono text-slate-400 bg-slate-800/50 border border-slate-700/50">
              {data.industry}
            </span>
          </div>
          {/* 熱度指標 */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/30 px-2 py-1 rounded-full border border-orange-500/20">
            <Flame size={12} className={data.hotness > 90 ? 'animate-pulse' : ''} />
            {data.hotness}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-pink-200 transition-colors line-clamp-2">
          {data.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{data.summary}</p>

        <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
          {data.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] text-slate-500 px-2 py-1 bg-slate-900 rounded border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 底部資訊列 */}
      <div className="bg-black/20 px-6 py-3 flex justify-between items-center text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock size={12} /> {getTimeAgo(data.publishTime)}
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400/80">
            <Zap size={12} /> Impact: {data.impactScore}
          </span>
        </div>
        <button className="flex items-center gap-1 hover:text-white transition-colors group/btn">
          Read Full
          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

// --- 骨架屏 ---
const SkeletonCard = () => (
  <div className="h-64 rounded-2xl bg-white/5 border border-white/5 animate-pulse p-6">
    <div className="w-20 h-6 bg-slate-700/50 rounded mb-4"></div>
    <div className="w-3/4 h-8 bg-slate-700/50 rounded mb-4"></div>
    <div className="w-full h-4 bg-slate-800/50 rounded mb-2"></div>
    <div className="w-full h-4 bg-slate-800/50 rounded mb-2"></div>
    <div className="w-2/3 h-4 bg-slate-800/50 rounded"></div>
  </div>
);

// --- Helper ---
function getTimeAgo(timestamp: number) {
  const hours = Math.floor((Date.now() - timestamp) / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
