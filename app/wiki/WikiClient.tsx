'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { OmniBaseCard } from '@/components/omni-base-card';

// ═══════════════════════════════════════════════════════════════
// WikiClient — Interactive search/filter for WIKI articles
// WHW: Why — 52+ articles need fast discovery
//      How — Debounced search + category tabs + responsive grid
//      What — Client-side full-text search across titles
// ═══════════════════════════════════════════════════════════════

interface WikiFile {
  slug: string;
  title: string;
  category: string;
  hashLock: string;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  all: { label: '全部', icon: '📋', color: 'bg-gray-500' },
  standard: { label: '法規標準', icon: '📐', color: 'bg-[#009EB0]' },
  development: { label: '開發', icon: '💻', color: 'bg-[#3B82F6]' },
  devops: { label: '部署運維', icon: '🔧', color: 'bg-[#D4AF37]' },
  guide: { label: '教學指南', icon: '📖', color: 'bg-emerald-500' },
  design: { label: '設計', icon: '🎨', color: 'bg-purple-500' },
  general: { label: '其他', icon: '📄', color: 'bg-gray-400' },
};

export default function WikiClient({ files }: { files: WikiFile[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return files.filter(f => {
      const matchesCategory = category === 'all' || f.category === category;
      const matchesSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.slug.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [files, search, category]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: files.length };
    for (const f of files) {
      counts[f.category] = (counts[f.category] || 0) + 1;
    }
    return counts;
  }, [files]);

  return (
    <div className="min-h-[calc(100vh-52px)] p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accentTeal flex items-center justify-center text-2xl text-white shadow-[0_0_15px_rgba(0,158,176,0.6)]">
          📚
        </div>
        <div>
          <h1 className="font-['Montserrat',sans-serif] text-3xl font-bold text-accentTeal">ESGGO 知識庫 ∞ Evolution</h1>
          <div className="text-sm text-textSecondary mt-1">
            共 {files.length} 篇知識資產 · 永續發展無限進化
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋知識庫文章..."
          className="w-full pl-11 pr-10 py-3 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009EB0]/50 focus:border-[#009EB0] transition-all shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(CATEGORY_LABELS).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              category === key
                ? `${info.color} text-white shadow-md`
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{info.icon}</span>
            <span>{info.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              category === key ? 'bg-white/20' : 'bg-gray-200 dark:bg-slate-600'
            }`}>
              {categoryCounts[key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Article Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(file => {
            const catInfo = CATEGORY_LABELS[file.category] || CATEGORY_LABELS.general;
            return (
              <Link key={file.slug} href={`/wiki/${encodeURIComponent(file.slug)}`}>
                <OmniBaseCard
                  variant="liquid-glass"
                  className="h-full flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg !p-5"
                  statusIndicator="trustworthy"
                  hashLock={file.hashLock}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accentTeal/10 flex items-center justify-center text-accentTeal font-bold">
                      W
                    </div>
                    <span className={`text-[10px] text-white px-2 py-1 rounded-full font-bold ${catInfo.color}`}>
                      {catInfo.icon} {catInfo.label}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-textPrimary mb-2 line-clamp-2 leading-tight">
                    {file.title}
                  </h2>

                  <div className="mt-auto pt-4 border-t border-borderColor/30 flex items-center justify-between text-xs text-textSecondary">
                    <span>Markdown 格式</span>
                    <span className="font-['Fira_Code',monospace]">5T 封印完成</span>
                  </div>
                </OmniBaseCard>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-4xl mb-3 block">🔍</span>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {search ? `找不到「${search}」相關文章` : '此分類下暫無文章'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            嘗試更換搜尋關鍵字或分類
          </p>
        </div>
      )}
    </div>
  );
}
