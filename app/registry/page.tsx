// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { StatusDot } from '@/components/ui/v2/StatusDot';
import { Layers, Database, Sparkles, BrainCircuit, Activity, Server } from 'lucide-react';

const COMPONENTS = [
  { name: 'Card', version: 'v2.0', status: 'stable', category: 'UI' },
  { name: 'Button', version: 'v2.0', status: 'stable', category: 'UI' },
  { name: 'Input', version: 'v2.0', status: 'stable', category: 'Form' },
  { name: 'Badge', version: 'v2.0', status: 'stable', category: 'UI' },
  { name: 'Table', version: 'v2.0', status: 'stable', category: 'Data' },
  { name: 'Modal', version: 'v2.0', status: 'stable', category: 'Overlay' },
  { name: 'Tabs', version: 'v2.0', status: 'stable', category: 'Nav' },
  { name: 'Progress', version: 'v2.0', status: 'stable', category: 'Feedback' },
  { name: 'StatusDot', version: 'v2.0', status: 'stable', category: 'Feedback' },
  { name: 'FiveTStrip', version: 'v2.0', status: 'stable', category: 'Feedback' },
  { name: 'OmniHeader', version: 'v2.0', status: 'stable', category: 'Layout' },
  { name: 'LoginCard', version: 'v2.0', status: 'stable', category: 'Auth' },
  { name: 'NavItem', version: 'v2.0', status: 'stable', category: 'Nav' },
  { name: 'SectionHeader', version: 'v2.0', status: 'stable', category: 'Layout' },
];

export default function RegistryPage() {
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(COMPONENTS.map((c) => c.category))];
  const filtered = filter === 'all' ? COMPONENTS : COMPONENTS.filter((c) => c.category === filter);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center gap-4 pb-6 border-b border-neutral-200">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
            <Layers size={24} className="text-neutral-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">元件註冊表</h1>
            <p className="text-sm text-neutral-500">UI v2 元件庫 — 版本管理與狀態追蹤</p>
          </div>
        </header>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-neutral-400" />
            <span className="text-sm font-medium text-neutral-600">{COMPONENTS.length} 個元件</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-sm font-medium text-neutral-600">
              {COMPONENTS.filter((c) => c.status === 'stable').length} 穩定
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {cat === 'all' ? '全部' : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => (
            <Card key={comp.name} variant="default" padding="md" hover>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusDot status={comp.status === 'stable' ? 'active' : 'warning'} size="sm" />
                  <h3 className="text-sm font-bold text-neutral-900">{comp.name}</h3>
                </div>
                <Badge variant="neutral" size="xs">
                  {comp.category}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">{comp.version}</span>
                <Badge variant={comp.status === 'stable' ? 'success' : 'warning'} size="xs">
                  {comp.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
