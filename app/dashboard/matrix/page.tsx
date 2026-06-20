// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import { StatusDot } from '@/components/ui/v2/StatusDot';
import { Grid3X3, ShieldCheck, Activity, Lock, Globe, Zap } from 'lucide-react';

const MATRIX_COMPONENTS = [
  { id: 'card', name: 'Card', category: 'UI', status: 'active', registered: true },
  { id: 'button', name: 'Button', category: 'UI', status: 'active', registered: true },
  { id: 'input', name: 'Input', category: 'UI', status: 'active', registered: true },
  { id: 'badge', name: 'Badge', category: 'UI', status: 'active', registered: true },
  { id: 'table', name: 'Table', category: 'Data', status: 'active', registered: true },
  { id: 'modal', name: 'Modal', category: 'Overlay', status: 'active', registered: true },
  { id: 'tabs', name: 'Tabs', category: 'Nav', status: 'active', registered: true },
  { id: 'progress', name: 'Progress', category: 'Feedback', status: 'active', registered: true },
  { id: 'statusdot', name: 'StatusDot', category: 'Feedback', status: 'active', registered: true },
  { id: '5tstrip', name: '5T Strip', category: 'Feedback', status: 'active', registered: true },
  { id: 'login', name: 'LoginCard', category: 'Auth', status: 'active', registered: true },
  { id: 'nav', name: 'NavItem', category: 'Nav', status: 'active', registered: true },
];

const CATEGORY_ICONS = {
  UI: Grid3X3,
  Data: Activity,
  Overlay: Lock,
  Nav: Globe,
  Feedback: Zap,
  Auth: ShieldCheck,
};
const STATUS_COLOR = { active: 'success', pending: 'warning', inactive: 'neutral' };

export default function UltimateMatrixPage() {
  const [filter, setFilter] = useState('all');
  const total = MATRIX_COMPONENTS.length;
  const registered = MATRIX_COMPONENTS.filter((c) => c.registered).length;
  const categories = ['all', ...new Set(MATRIX_COMPONENTS.map((c) => c.category))];
  const filtered =
    filter === 'all' ? MATRIX_COMPONENTS : MATRIX_COMPONENTS.filter((c) => c.category === filter);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-200 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-neutral-500 uppercase">
                Omni Component Center
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
              萬能元件。終極矩陣
            </h1>
            <p className="text-neutral-500 mt-2 text-sm max-w-xl">
              全局檢視系統中每一個功能元件的 5T 合規性與架構定位，確保常青演進。
            </p>
          </div>
          <div className="flex items-center gap-3 border border-neutral-200 px-4 py-2 rounded-lg">
            <span className="text-xs text-neutral-500 font-mono">{total} Components</span>
            <span className="text-xl font-bold text-emerald-600">{registered} Registered</span>
          </div>
        </header>

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
          {filtered.map((comp) => {
            const Icon = CATEGORY_ICONS[comp.category] || Grid3X3;
            return (
              <Card key={comp.id} variant="default" padding="md" hover>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                    <Icon size={18} className="text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-neutral-900">{comp.name}</h3>
                    <p className="text-[10px] text-neutral-400 font-medium">{comp.category}</p>
                  </div>
                  <StatusDot status={STATUS_COLOR[comp.status]} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={comp.registered ? 'success' : 'neutral'} size="sm">
                    {comp.registered ? '已註冊' : '待註冊'}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
