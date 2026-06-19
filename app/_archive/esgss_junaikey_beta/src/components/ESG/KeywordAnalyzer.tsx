/**
 * 🔍 商情關鍵詞分析組件
 * --------------------------------------------------
 * [功能] ESG 相關商情資訊蒐集與關鍵詞分析
 * [整合] NLP 分析、趨勢追蹤、競爭情報
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  PieChart,
  Clock,
  AlertCircle,
  ExternalLink,
  Plus,
  X,
  Sparkles,
  Filter,
} from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface KeywordData {
  keyword: string;
  frequency: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  sentiment: number; // -1 to 1
  category: KeywordCategory;
  relatedNews: NewsItem[];
  lastMention: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishDate: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export type KeywordCategory =
  | 'company'
  | 'regulation'
  | 'technology'
  | 'market'
  | 'risk'
  | 'opportunity';

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_KEYWORDS: KeywordData[] = [
  {
    keyword: 'CBAM',
    frequency: 2847,
    trend: 'up',
    trendPercent: 156,
    sentiment: -0.2,
    category: 'regulation',
    lastMention: new Date(),
    relatedNews: [
      {
        id: '1',
        title: 'CBAM 過渡期申報系統上線',
        source: '經濟日報',
        url: '#',
        publishDate: new Date(),
        sentiment: 'neutral',
      },
    ],
  },
  {
    keyword: '碳權交易',
    frequency: 1923,
    trend: 'up',
    trendPercent: 89,
    sentiment: 0.4,
    category: 'market',
    lastMention: new Date(),
    relatedNews: [],
  },
  {
    keyword: '綠色金融',
    frequency: 1654,
    trend: 'up',
    trendPercent: 45,
    sentiment: 0.6,
    category: 'opportunity',
    lastMention: new Date(),
    relatedNews: [],
  },
  {
    keyword: '供應鏈韌性',
    frequency: 1432,
    trend: 'stable',
    trendPercent: 2,
    sentiment: 0.1,
    category: 'risk',
    lastMention: new Date(),
    relatedNews: [],
  },
  {
    keyword: 'CSRD',
    frequency: 1287,
    trend: 'up',
    trendPercent: 234,
    sentiment: -0.1,
    category: 'regulation',
    lastMention: new Date(),
    relatedNews: [],
  },
  {
    keyword: 'AI 永續',
    frequency: 987,
    trend: 'up',
    trendPercent: 312,
    sentiment: 0.7,
    category: 'technology',
    lastMention: new Date(),
    relatedNews: [],
  },
  {
    keyword: '漂綠風險',
    frequency: 876,
    trend: 'down',
    trendPercent: -12,
    sentiment: -0.5,
    category: 'risk',
    lastMention: new Date(),
    relatedNews: [],
  },
  {
    keyword: '淨零轉型',
    frequency: 2156,
    trend: 'stable',
    trendPercent: 5,
    sentiment: 0.3,
    category: 'market',
    lastMention: new Date(),
    relatedNews: [],
  },
];

const CATEGORY_COLORS: Record<KeywordCategory, string> = {
  company: 'cyan',
  regulation: 'blue',
  technology: 'purple',
  market: 'green',
  risk: 'red',
  opportunity: 'emerald',
};

const CATEGORY_LABELS: Record<KeywordCategory, string> = {
  company: '企業',
  regulation: '法規',
  technology: '技術',
  market: '市場',
  risk: '風險',
  opportunity: '機會',
};

// ============================================================================
// Main Component
// ============================================================================

interface KeywordAnalyzerProps {
  customKeywords?: string[];
  onKeywordClick?: (keyword: KeywordData) => void;
}

export const KeywordAnalyzer: React.FC<KeywordAnalyzerProps> = ({
  customKeywords = [],
  onKeywordClick,
}) => {
  const [keywords, setKeywords] = useState<KeywordData[]>(MOCK_KEYWORDS);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KeywordCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'frequency' | 'trend' | 'sentiment'>('frequency');
  const [watchList, setWatchList] = useState<string[]>(customKeywords);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    omniLogger.info(LogCategory.GROWTH, '關鍵詞分析工具啟動', {
      watchlist: watchList,
      source_origin: 'KeywordAnalyzer.mount',
    });
  }, []);

  // Filter and sort keywords
  const displayedKeywords = useMemo(() => {
    const filtered = keywords.filter(k => {
      const matchesSearch = searchInput === '' || k.keyword.includes(searchInput);
      const matchesCategory = selectedCategory === 'all' || k.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'frequency':
          return b.frequency - a.frequency;
        case 'trend':
          return b.trendPercent - a.trendPercent;
        case 'sentiment':
          return b.sentiment - a.sentiment;
        default:
          return 0;
      }
    });

    return filtered;
  }, [keywords, searchInput, selectedCategory, sortBy]);

  // Add to watchlist
  const addToWatchList = () => {
    if (newKeyword && !watchList.includes(newKeyword)) {
      const trace_id = uuidv4();
      omniLogger.info(LogCategory.GROWTH, `用戶將關鍵詞 "${newKeyword}" 加入關注清單`, {
        trace_id,
        keyword: newKeyword,
        source_origin: 'KeywordAnalyzer.addToWatchList',
      });
      setWatchList([...watchList, newKeyword]);
      setNewKeyword('');
    }
  };

  // Remove from watchlist
  const removeFromWatchList = (keyword: string) => {
    setWatchList(watchList.filter(k => k !== keyword));
  };

  // Stats
  const totalMentions = keywords.reduce((sum, k) => sum + k.frequency, 0);
  const avgSentiment = keywords.reduce((sum, k) => sum + k.sentiment, 0) / keywords.length;
  const topTrending = [...keywords].sort((a, b) => b.trendPercent - a.trendPercent).slice(0, 3);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} className="text-green-400" />;
      case 'down':
        return <TrendingDown size={14} className="text-red-400" />;
      default:
        return <Minus size={14} className="text-slate-400" />;
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-400';
    if (sentiment < -0.3) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="frosted-panel rounded-2xl p-6 border border-purple-500/20 neon-border-purple animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Search size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">ESG 關鍵詞輿情分析</h2>
            <p className="text-sm text-slate-400">當前關注：{watchList.length} 個關鍵詞</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            AI Engine Powered
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <BarChart3 size={14} />
            <span className="text-xs">總提及次數</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalMentions.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <PieChart size={14} />
            <span className="text-xs">平均情緒</span>
          </div>
          <p className={`text-2xl font-bold ${getSentimentColor(avgSentiment)}`}>
            {avgSentiment > 0 ? '+' : ''}
            {(avgSentiment * 100).toFixed(0)}%
          </p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <TrendingUp size={14} />
            <span className="text-xs">熱門趨勢</span>
          </div>
          <p className="text-sm text-white truncate">{topTrending[0]?.keyword}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="搜尋關鍵詞..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 outline-none"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-purple-500 outline-none"
        >
          <option value="frequency">按頻率</option>
          <option value="trend">按趨勢</option>
          <option value="sentiment">按情緒</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
            selectedCategory === 'all'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          全部
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as KeywordCategory)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              selectedCategory === key
                ? `bg-${CATEGORY_COLORS[key as KeywordCategory]}-500/20 text-${CATEGORY_COLORS[key as KeywordCategory]}-400`
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Keyword List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto mb-6">
        {displayedKeywords.map(kw => (
          <motion.div
            key={kw.keyword}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => onKeywordClick?.(kw)}
            className="flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded text-xs bg-${CATEGORY_COLORS[kw.category]}-500/20 text-${CATEGORY_COLORS[kw.category]}-400`}
              >
                {CATEGORY_LABELS[kw.category]}
              </span>
              <span className="font-medium text-white">{kw.keyword}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">{kw.frequency.toLocaleString()}</p>
                <p className="text-xs text-slate-500">次提及</p>
              </div>
              <div className="flex items-center gap-1 min-w-[60px]">
                {getTrendIcon(kw.trend)}
                <span
                  className={`text-sm ${
                    kw.trend === 'up'
                      ? 'text-green-400'
                      : kw.trend === 'down'
                        ? 'text-red-400'
                        : 'text-slate-400'
                  }`}
                >
                  {kw.trendPercent > 0 ? '+' : ''}
                  {kw.trendPercent}%
                </span>
              </div>
              <div className={`w-16 text-right ${getSentimentColor(kw.sentiment)}`}>
                {kw.sentiment > 0 ? '😀' : kw.sentiment < -0.3 ? '😟' : '😐'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Watchlist */}
      <div className="border-t border-slate-700 pt-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">🔔 關注清單</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {watchList.map(kw => (
            <span
              key={kw}
              className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-lg text-sm text-purple-300"
            >
              {kw}
              <button onClick={() => removeFromWatchList(kw)} className="hover:text-red-400">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={e => setNewKeyword(e.target.value)}
            placeholder="新增關鍵詞..."
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 outline-none"
            onKeyPress={e => e.key === 'Enter' && addToWatchList()}
          />
          <button
            onClick={addToWatchList}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-all"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeywordAnalyzer;
