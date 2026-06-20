// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import {
  DatabaseZap, Search, RefreshCw, Trash2, Loader2,
  Filter, Tag, Clock, Cpu, HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';
import { useOmniMemoryStore } from '@/store/useOmniMemoryStore';

export default function MemoryPage() {
  const { shards, isLoading, fetchShards, syncWithNCB } = useOmniMemoryStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ncb' | 'local'>('all');

  useEffect(() => { fetchShards(); }, [fetchShards]);

  const filteredShards = shards.filter(s => {
    if (filter === 'ncb' && s.source_origin !== 'ncb') return false;
    if (filter === 'local' && s.source_origin === 'ncb') return false;
    if (search && !s.title?.toLowerCase().includes(search.toLowerCase()) && !s.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const ncbCount = shards.filter(s => s.source_origin === 'ncb').length;
  const localCount = shards.filter(s => s.source_origin !== 'ncb').length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ─── Header ─── */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                <DatabaseZap size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-neutral-900">記憶管理</h1>
                <p className="text-sm text-neutral-500">管理所有記憶碎片 · 搜尋與篩選</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">{ncbCount} NCB</Badge>
              <Badge variant="neutral" size="sm">{localCount} Local</Badge>
              <Button variant="primary" size="sm" onClick={syncWithNCB} disabled={isLoading}>
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                同步 NCBDB
              </Button>
            </div>
          </div>
        </Card>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: '總碎片', value: shards.length, icon: DatabaseZap, color: 'info' },
            { label: 'NCB 來源', value: ncbCount, icon: HardDrive, color: 'success' },
            { label: '本地來源', value: localCount, icon: Cpu, color: 'warning' },
            { label: '平均熵值', value: shards.length ? (shards.reduce((s, sh) => s + (sh.entropy_level || 0), 0) / shards.length).toFixed(1) : '0', icon: Filter, color: 'neutral' },
          ].map(stat => (
            <Card key={stat.label} variant="default" padding="sm">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center',
                  stat.color === 'success' ? 'bg-emerald-50' : stat.color === 'info' ? 'bg-blue-50' :
                  stat.color === 'warning' ? 'bg-amber-50' : 'bg-neutral-100')}>
                  <stat.icon size={18} className={cn(
                    stat.color === 'success' ? 'text-emerald-600' : stat.color === 'info' ? 'text-blue-600' :
                    stat.color === 'warning' ? 'text-amber-600' : 'text-neutral-500')} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                  <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ─── Search & Filter ─── */}
        <Card variant="default" padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜尋記憶碎片..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </div>
            <div className="flex gap-1">
              {[
                { id: 'all' as const, label: '全部', count: shards.length },
                { id: 'ncb' as const, label: 'NCB', count: ncbCount },
                { id: 'local' as const, label: '本地', count: localCount },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    filter === f.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  )}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ─── Memory List ─── */}
        <SectionHeader title="記憶碎片" subtitle={`${filteredShards.length} 個結果`} />

        {isLoading ? (
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-center gap-3 py-8">
              <Loader2 size={20} className="animate-spin text-neutral-400" />
              <span className="text-sm text-neutral-500">載入中...</span>
            </div>
          </Card>
        ) : filteredShards.length === 0 ? (
          <Card variant="default" padding="lg">
            <div className="text-center space-y-3 py-8">
              <DatabaseZap size={32} className="text-neutral-200 mx-auto" />
              <p className="text-sm text-neutral-500">
                {search ? '沒有找到符合條件的記憶碎片' : '尚無記憶碎片'}
              </p>
              {!search && (
                <Button variant="primary" size="sm" onClick={syncWithNCB}>
                  <RefreshCw size={14} />
                  從 NCBDB 同步
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredShards.map(shard => (
              <Card key={shard.id} variant="default" padding="sm" hover>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-neutral-900 truncate">{shard.title}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{shard.source_origin} · {shard.source_type}</p>
                  </div>
                  <Badge variant={shard.source_origin === 'ncb' ? 'info' : 'neutral'} size="sm">
                    {shard.source_origin === 'ncb' ? 'NCB' : 'Local'}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{shard.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {shard.tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500">
                      <Tag size={8} className="inline mr-0.5" />{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-neutral-50 text-[9px] text-neutral-400">
                  <span>熵: {shard.entropy_level}</span>
                  <span>權重: {shard.importance_score?.toFixed(2)}</span>
                  <span>使用: {shard.usage_count} 次</span>
                  <span className="ml-auto flex items-center gap-1">
                    <Clock size={8} />
                    {shard.created_at ? new Date(shard.created_at).toLocaleDateString('zh-TW') : '—'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
