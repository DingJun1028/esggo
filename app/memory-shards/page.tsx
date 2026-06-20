'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Tag,
  Clock,
  Zap,
  Brain,
  Trash2,
  Edit3,
  ChevronRight,
  Star,
  Activity,
  Database,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryShard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  entropyLevel?: number;
  importanceScore?: number;
  sourceType: string;
  usageCount: number;
  createdAt: string;
}

interface SkillUltimate {
  id: string;
  skillName: string;
  masteryLevel: 'Novice' | 'Adept' | 'Expert' | 'Master';
  corePrinciples: string[];
  synthesis: string;
  voidDimension?: string;
  sourceShards: string[];
  createdAt: string;
}

type TabType = 'shards' | 'ultimates' | 'stats' | 'relations';

export default function MemoryShardsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('shards');
  const [shards, setShards] = useState<MemoryShard[]>([]);
  const [ultimates, setUltimates] = useState<SkillUltimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShard, setSelectedShard] = useState<MemoryShard | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'shards') {
        const res = await fetch('/api/agent/memory-shards?type=shards');
        const data = await res.json();
        setShards(data.shards || []);
      } else if (activeTab === 'ultimates') {
        const res = await fetch('/api/agent/memory-shards?type=ultimates');
        const data = await res.json();
        setUltimates(data.ultimates || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShards = shards.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || s.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(shards.flatMap((s) => s.tags)));

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'Master':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Expert':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Adept':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation':
        return <Activity size={14} />;
      case 'error_log':
        return <Zap size={14} />;
      case 'code_review':
        return <Database size={14} />;
      case 'web_crawl':
        return <Layers size={14} />;
      default:
        return <Brain size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Brain size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">記憶碎片體系</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  OmniMemory Shards v2.0 · {shards.length} 碎片 · {ultimates.length} 奧義
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#003262] text-white font-bold rounded-xl hover:bg-[#002244] transition-colors"
            >
              <Plus size={16} />
              新增碎片
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              {
                id: 'shards' as TabType,
                label: '記憶碎片',
                icon: <Database size={14} />,
                count: shards.length,
              },
              {
                id: 'ultimates' as TabType,
                label: '技能奧義',
                icon: <Sparkles size={14} />,
                count: ultimates.length,
              },
              {
                id: 'stats' as TabType,
                label: '統計分析',
                icon: <Activity size={14} />,
                count: null,
              },
              {
                id: 'relations' as TabType,
                label: '碎片關聯',
                icon: <Layers size={14} />,
                count: null,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all',
                  activeTab === tab.id
                    ? 'bg-[#003262] text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full',
                      activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Search & Filter */}
        {activeTab === 'shards' && (
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋記憶碎片..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                    selectedTag === tag
                      ? 'bg-violet-100 text-violet-700 border border-violet-200'
                      : 'bg-white text-slate-600 border border-slate-100 hover:border-slate-200'
                  )}
                >
                  <Tag size={10} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">載入中...</p>
          </div>
        ) : activeTab === 'shards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShards.map((shard) => (
              <div
                key={shard.id}
                onClick={() => setSelectedShard(shard)}
                className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:border-violet-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-violet-50 rounded-lg text-violet-600">
                      {getSourceTypeIcon(shard.sourceType)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {shard.sourceType.replace('_', ' ')}
                    </span>
                  </div>
                  {shard.entropyLevel !== undefined && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        shard.entropyLevel < 30
                          ? 'bg-emerald-50 text-emerald-600'
                          : shard.entropyLevel < 70
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-red-50 text-red-600'
                      )}
                    >
                      熵 {shard.entropyLevel}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#003262] mb-2 group-hover:text-violet-600 transition-colors">
                  {shard.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{shard.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {shard.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {shard.tags.length > 3 && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded">
                        +{shard.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Star size={10} />
                    {shard.usageCount}
                  </div>
                </div>
              </div>
            ))}
            {filteredShards.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <Brain size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="text-sm text-slate-400">尚無記憶碎片</p>
                <p className="text-xs text-slate-300 mt-1">
                  開始對話或執行任務後，系統會自動萃取記憶碎片
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'ultimates' ? (
          <div className="space-y-4">
            {ultimates.map((ultimate) => (
              <div
                key={ultimate.id}
                className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-lg hover:border-amber-200 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Sparkles size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#003262]">{ultimate.skillName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                            getMasteryColor(ultimate.masteryLevel)
                          )}
                        >
                          {ultimate.masteryLevel}
                        </span>
                        {ultimate.voidDimension && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">
                            {ultimate.voidDimension}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">來源碎片</p>
                    <p className="text-sm font-bold text-[#003262]">
                      {ultimate.sourceShards.length}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">{ultimate.synthesis}</p>
                <div className="flex flex-wrap gap-2">
                  {ultimate.corePrinciples.map((principle, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100"
                    >
                      {principle}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {ultimates.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <Sparkles size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="text-sm text-slate-400">尚無技能奧義</p>
                <p className="text-xs text-slate-300 mt-1">
                  收集 2 個以上記憶碎片後，系統會自動合成技能奧義
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'stats' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: '總碎片數',
                value: shards.length,
                icon: <Database size={20} />,
                color: 'from-violet-500 to-purple-600',
              },
              {
                label: '技能奧義',
                value: ultimates.length,
                icon: <Sparkles size={20} />,
                color: 'from-amber-400 to-orange-500',
              },
              {
                label: '平均熵值',
                value:
                  shards.length > 0
                    ? Math.round(
                        shards.reduce((sum, s) => sum + (s.entropyLevel || 50), 0) / shards.length
                      )
                    : 0,
                icon: <Activity size={20} />,
                color: 'from-emerald-500 to-teal-600',
              },
              {
                label: '總使用次數',
                value: shards.reduce((sum, s) => sum + s.usageCount, 0),
                icon: <Star size={20} />,
                color: 'from-blue-500 to-indigo-600',
              },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-6">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3',
                    stat.color
                  )}
                >
                  {stat.icon}
                </div>
                <p className="text-2xl font-black text-[#003262]">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <Layers size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-sm text-slate-400">碎片關聯圖</p>
            <p className="text-xs text-slate-300 mt-1">開發中...</p>
          </div>
        )}
      </div>

      {/* Shard Detail Modal */}
      {selectedShard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-[#003262]">{selectedShard.title}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedShard.sourceType} · {new Date(selectedShard.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedShard(null)}
                className="p-2 hover:bg-slate-50 rounded-lg"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">{selectedShard.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedShard.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-violet-50 text-violet-700 rounded-full border border-violet-100"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-[#003262]">
                  {selectedShard.entropyLevel || 'N/A'}
                </p>
                <p className="text-[10px] text-slate-400">熵值</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-[#003262]">
                  {selectedShard.importanceScore?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-[10px] text-slate-400">重要性</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-[#003262]">{selectedShard.usageCount}</p>
                <p className="text-[10px] text-slate-400">使用次數</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
