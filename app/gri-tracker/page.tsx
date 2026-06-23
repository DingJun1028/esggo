// @ts-nocheck
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  Circle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Shield,
  Hash,
  FileText,
  Download,
  BarChart3,
  Leaf,
  Users,
  Building2,
  Globe,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  CheckCircle2,
  Info,
  X,
  Clock,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { Progress } from '@/components/ui/v2/Progress';
import { StatusDot } from '@/components/ui/v2/StatusDot';
import { FiveTStrip } from '@/components/ui/v2/FiveTStrip';

const GRI_DATA = [
  {
    id: 'gri-2-1',
    code: 'GRI 2-1',
    titleZh: '組織基本資料',
    title: 'Organizational Details',
    category: 'universal',
    completeness: 100,
    isSealed: true,
    status: 'completed',
    hasEvidence: true,
    tasksCount: 3,
  },
  {
    id: 'gri-305-1',
    code: 'GRI 305-1',
    titleZh: '直接溫室氣體排放 (Scope 1)',
    title: 'Direct GHG Emissions',
    category: 'environmental',
    completeness: 85,
    isSealed: true,
    status: 'completed',
    hasEvidence: true,
    tasksCount: 5,
  },
  {
    id: 'gri-305-2',
    code: 'GRI 305-2',
    titleZh: '能源間接排放 (Scope 2)',
    title: 'Energy Indirect Emissions',
    category: 'environmental',
    completeness: 72,
    isSealed: false,
    status: 'pending',
    hasEvidence: false,
    tasksCount: 2,
  },
  {
    id: 'gri-401-1',
    code: 'GRI 401-1',
    titleZh: '新進員工僱用',
    title: 'New Employee Hires',
    category: 'social',
    completeness: 90,
    isSealed: true,
    status: 'completed',
    hasEvidence: true,
    tasksCount: 1,
  },
  {
    id: 'gri-405-1',
    code: 'GRI 405-1',
    titleZh: '多元化與平等機會',
    title: 'Diversity & Equal Opportunity',
    category: 'social',
    completeness: 60,
    isSealed: false,
    status: 'pending',
    hasEvidence: false,
    tasksCount: 4,
  },
  {
    id: 'gri-2-9',
    code: 'GRI 2-9',
    titleZh: '治理結構',
    title: 'Governance Structure',
    category: 'governance',
    completeness: 95,
    isSealed: true,
    status: 'completed',
    hasEvidence: true,
    tasksCount: 2,
  },
  {
    id: 'gri-2-14',
    code: 'GRI 2-14',
    titleZh: '永續報告書審查',
    title: 'Sustainability Report Review',
    category: 'governance',
    completeness: 45,
    isSealed: false,
    status: 'pending',
    hasEvidence: false,
    tasksCount: 6,
  },
];

const CATEGORY_META: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  universal: { label: '通用準則', color: '#003262', bg: 'bg-blue-50', icon: Globe },
  environmental: { label: '環境面 E', color: '#10B981', bg: 'bg-emerald-50', icon: Leaf },
  social: { label: '社會面 S', color: '#8B5CF6', bg: 'bg-purple-50', icon: Users },
  governance: { label: '治理面 G', color: '#FDB515', bg: 'bg-amber-50', icon: Building2 },
};

export default function GRITrackerPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState<(typeof GRI_DATA)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [gapAdvice, setGapAdvice] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const runGapAnalysis = async () => {
    setAnalyzing(true);
    setTimeout(() => {
      setGapAdvice(
        '建議優先處理 GRI 305-2 (能源間接排放) 與 GRI 405-1 (多元化)，此二項完成度低於 70%，為合規高風險區域。建議啟動 OmniAgent 自動數據收集流程。'
      );
      setAnalyzing(false);
    }, 1500);
  };

  const filtered = useMemo(() => {
    return GRI_DATA.filter((item) => {
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchSearch =
        !search ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.titleZh.includes(search);
      return matchCat && matchSearch;
    });
  }, [categoryFilter, search]);

  const stats = useMemo(() => {
    const avg = Math.round(GRI_DATA.reduce((a, i) => a + i.completeness, 0) / GRI_DATA.length);
    return {
      avg,
      completed: GRI_DATA.filter((i) => i.status === 'completed').length,
      sealed: GRI_DATA.filter((i) => i.isSealed).length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-200 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-neutral-500 uppercase">
                GRI 2021 / ISSB
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              GRI 揭露追蹤器
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              全域準則監控：結合 5T 協議門，即時動態追蹤數據封印進度與合規缺口
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={() => setLoading(true)}
            >
              同步
            </Button>
            <Button variant="secondary" size="sm" icon={<Download size={14} />}>
              匯出
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="default" padding="md">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
              整體合規率
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-neutral-900">{stats.avg}</span>
              <span className="text-sm text-neutral-400">%</span>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
              已封印指標
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-600">{stats.sealed}</span>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
              待處理項
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-600">
                {GRI_DATA.length - stats.completed}
              </span>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
              應揭露總數
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-neutral-900">{GRI_DATA.length}</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const catItems = GRI_DATA.filter((i) => i.category === key);
            const catAvg =
              catItems.length > 0
                ? Math.round(catItems.reduce((a, i) => a + i.completeness, 0) / catItems.length)
                : 0;
            const Icon = meta.icon;
            return (
              <Card key={key} variant="default" padding="md" hover>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bg}`}>
                    <Icon size={16} style={{ color: meta.color }} />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-xl font-black text-neutral-900">{catAvg}%</span>
                  <span className="text-[9px] text-neutral-400">{catItems.length} ITEMS</span>
                </div>
                <Progress value={catAvg} size="xs" color="auto" />
              </Card>
            );
          })}
        </div>

        <Card variant="default" padding="md">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-amber-500" />
                <h3 className="text-base font-bold text-neutral-900">AI 戰略缺口建議</h3>
              </div>
              {gapAdvice ? (
                <p className="text-sm text-neutral-600 leading-relaxed">{gapAdvice}</p>
              ) : (
                <p className="text-sm text-neutral-400">
                  點擊右側按鈕，讓 OmniAgent 掃描當前合規矩陣並產出優化策略。
                </p>
              )}
            </div>
            <Button
              variant="primary"
              onClick={runGapAnalysis}
              loading={analyzing}
              icon={<Sparkles size={14} />}
            >
              啟動缺口掃描
            </Button>
          </div>
        </Card>

        <Card variant="default" padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  placeholder="搜尋 GRI 代碼、指標名稱..."
                  className="w-full h-10 bg-white rounded-lg border border-neutral-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1 bg-neutral-50 rounded-lg p-1">
                {['all', 'universal', 'environmental', 'social', 'governance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                      categoryFilter === cat
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    {cat === 'all' ? 'ALL' : CATEGORY_META[cat]?.label || cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-40 flex items-center justify-center text-sm text-neutral-400">
              載入中...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    {['狀態', '代碼', '指標名稱', '封印', '完成度', '操作'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <StatusDot
                          status={item.status === 'completed' ? 'active' : 'warning'}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-neutral-900">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-900">
                            {item.titleZh}
                          </span>
                          <span className="text-[9px] text-neutral-400">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {item.isSealed ? (
                          <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                            <ShieldCheck size={12} /> SEALED
                          </div>
                        ) : (
                          <span className="text-neutral-300 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 w-32">
                          <Progress value={item.completeness} size="xs" color="auto" />
                          <span className="font-mono text-[10px] font-bold w-8 text-right">
                            {item.completeness}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="xs" onClick={() => setSelected(item)}>
                          詳情
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <div className="relative bg-white rounded-xl shadow-sm border border-neutral-200 max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-neutral-900">{selected.code}</h3>
                    <p className="text-sm text-neutral-400">{selected.titleZh}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    治理證據
                  </h4>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selected.hasEvidence ? 'bg-emerald-500' : 'bg-neutral-300'
                      }`}
                    />
                    <span className="text-xs font-medium text-neutral-600">
                      {selected.hasEvidence ? '已上傳實證文件' : '尚未提供佐證'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selected.tasksCount > 0 ? 'bg-blue-500' : 'bg-neutral-300'
                      }`}
                    />
                    <span className="text-xs font-medium text-neutral-600">
                      {selected.tasksCount} 個關聯治理任務
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    完整性狀態
                  </h4>
                  <div
                    className={`p-4 rounded-xl border ${
                      selected.isSealed
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <StatusDot status={selected.isSealed ? 'active' : 'warning'} size="sm" />
                      <span className="text-[10px] font-bold uppercase">
                        {selected.isSealed ? 'SEALED' : 'OPEN'}
                      </span>
                    </div>
                    <p className="text-[9px] text-neutral-500 leading-relaxed">
                      {selected.isSealed
                        ? '此指標已完成 T5 數位封印，具備最高治理主權。'
                        : '目前正在收集中，待啟動 Hash Lock 封印。'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" fullWidth size="sm">
                  查看完整詳情
                </Button>
                <Button variant="secondary" fullWidth size="sm">
                  編輯指標
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
