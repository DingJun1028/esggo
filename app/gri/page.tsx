'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { BookOpen, Search, ExternalLink, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GRI_CHAPTERS } from '@/lib/esg/gri-expert-templates-store';

export default function GRIStandardPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'environmental' | 'social' | 'governance'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: '全部', color: 'bg-slate-500' },
    { id: 'environmental', label: '環境', color: 'bg-emerald-500' },
    { id: 'social', label: '社會', color: 'bg-blue-500' },
    { id: 'governance', label: '治理', color: 'bg-purple-500' },
  ];

  const griCategories = [
    {
      id: 'environmental',
      code: '3',
      label: '環境 (Environmental)',
      range: 'GRI 301-308',
      color: 'bg-emerald-500',
    },
    { id: 'social', code: '4', label: '社會 (Social)', range: 'GRI 401-419', color: 'bg-blue-500' },
    {
      id: 'governance',
      code: '2',
      label: '公司治理 (Governance)',
      range: 'GRI 201-208',
      color: 'bg-purple-500',
    },
  ];

  const filteredChapters = GRI_CHAPTERS.filter((chapter) => {
    const matchesSearch =
      chapter.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.griCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'environmental' && chapter.griCode.startsWith('GRI 3')) ||
      (selectedCategory === 'social' && chapter.griCode.startsWith('GRI 4')) ||
      (selectedCategory === 'governance' && chapter.griCode.startsWith('GRI 2'));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-sm">
              <BookOpen className="text-cyan-600" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">GRI 標準 28 章</h1>
              <p className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-wider">
                全球永續報告指引
              </p>
            </div>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="搜尋 GRI 章節或代碼..."
              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                  selectedCategory === cat.id
                    ? `${cat.color} text-white border-0`
                    : ' border-slate-200 text-slate-600 hover:bg-slate-100'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {griCategories.map((cat) => (
            <Card
              key={cat.id}
              variant="glass"
              className="p-4 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn('w-8 h-8 rounded-lg flex items-center justify-center', cat.color)}
                >
                  <span className="text-white font-bold text-sm">{cat.code}</span>
                </div>
                <span className="font-bold text-slate-800">{cat.label}</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">{cat.range}</p>
            </Card>
          ))}
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChapters.map((chapter) => (
            <Card
              key={chapter.id}
              variant="glass"
              className="p-5 hover:border-cyan-500/30 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md border border-cyan-200">
                  {chapter.griCode}
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {chapter.sections} 節
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-cyan-700 transition-colors">
                {chapter.chapterTitle}
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                可套用 {chapter.templateIds.length} 個專家模板
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[10px] h-7 border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <ExternalLink size={10} className="mr-1" /> 查看詳情
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-[10px] h-7 text-slate-600 hover:bg-slate-100"
                >
                  <Download size={10} className="mr-1" /> 下載範本
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
