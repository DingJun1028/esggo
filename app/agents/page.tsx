'use client';

import React, { useState, useEffect } from 'react';

import {
  Network,
  Search,
  Plus,
  ShieldCheck,
  Activity,
  Brain,
  Lock,
  Loader2,
  CheckCircle2,
  Zap,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface AgentRecord {
  id: number;
  date: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  hash_lock: string | null;
  source_origin: string;
}

/* ─── Mock Data ─── */
const MOCK_DATA: AgentRecord[] = [
  {
    id: 1,
    date: '2026-06-01',
    metric_name: 'Carbon Scope 1',
    metric_value: 1200,
    unit: 'm³',
    hash_lock: '0x8f2f...3a21',
    source_origin: 'Auto-Agent',
  },
  {
    id: 2,
    date: '2026-06-02',
    metric_name: 'Water Efficiency',
    metric_value: 350,
    unit: '噸',
    hash_lock: null,
    source_origin: 'Manual',
  },
  {
    id: 3,
    date: '2026-06-03',
    metric_name: 'Energy Score',
    metric_value: 98.5,
    unit: '%',
    hash_lock: '0x1ca8...9d4f',
    source_origin: 'System',
  },
  {
    id: 4,
    date: '2026-06-04',
    metric_name: 'Supply Chain Compliance',
    metric_value: 87,
    unit: '%',
    hash_lock: null,
    source_origin: 'Auto-Agent',
  },
  {
    id: 5,
    date: '2026-06-05',
    metric_name: 'Waste Reduction',
    metric_value: 42,
    unit: '%',
    hash_lock: '0xabcd...ef12',
    source_origin: 'IoT Sensor',
  },
];

const AGENT_FEATURES = [
  {
    icon: Bot,
    title: '智能調度',
    desc: '自動分配任務給最適合的代理人',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  {
    icon: ShieldCheck,
    title: '5T 驗證',
    desc: '每筆資料自動進行 5T 誠信驗證',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Zap,
    title: '即時同步',
    desc: 'RWD 雙向同步，資料即時更新',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Brain,
    title: 'AI 分析',
    desc: '自動分析 ESG 數據並生成洞察',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
];

export default function AgentsPage() {
  const [data, setData] = useState<AgentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sealingId, setSealingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSeal = async (id: number) => {
    setSealingId(id);
    try {
      const response = await fetch('/api/vault/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidence: { table: 'agents', recordId: id, timestamp: Date.now() },
          type: '5t-seal',
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.hashLock) {
        setData((prev) =>
          prev.map((m) => (m.id === id ? { ...m, hash_lock: resData.hashLock } : m))
        );
      }
    } catch {
      // silent
    } finally {
      setSealingId(null);
    }
  };

  const handleAddRecord = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setData(MOCK_DATA);
    }, 1000);
  };

  const stats = {
    active: 3,
    verified: data.filter((d) => d.hash_lock).length,
    coverage: 100,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
              <Network size={24} className="text-cyan-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant="primary" size="sm" icon={<Brain size={10} />}>
                  OmniAgent Ready
                </Badge>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  AGENTS
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#003262] tracking-tight">
                萬能代理
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">AI AGENT ORCHESTRATION</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="md"
              icon={<Search size={14} />}
              className="flex-1 md:flex-none"
            >
              檢索
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={14} />}
              onClick={handleAddRecord}
              isLoading={isProcessing}
              className="bg-[#003262] hover:bg-[#002244] text-white flex-1 md:flex-none"
            >
              新增紀錄
            </Button>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <Activity size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">
                {stats.active}
                <span className="text-sm text-slate-400 ml-1">Nodes</span>
              </p>
              <p className="text-[10px] text-emerald-600 font-bold">Status: Optimal</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="p-2.5 bg-cyan-50 rounded-xl">
              <ShieldCheck size={18} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">
                98.5<span className="text-sm text-slate-400">%</span>
              </p>
              <p className="text-[10px] text-cyan-600 font-bold">5T 驗證率</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <Brain size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#003262]">
                {stats.coverage}
                <span className="text-sm text-slate-400">%</span>
              </p>
              <p className="text-[10px] text-amber-600 font-bold">業務覆蓋</p>
            </div>
          </Card>
        </div>

        {/* ─── Agent Features ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENT_FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                  feat.bg
                )}
              >
                <feat.icon size={20} className={feat.color} />
              </div>
              <h3 className="text-sm font-bold text-[#003262] mb-1">{feat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* ─── Main Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table */}
          <div className="lg:col-span-3">
            <Card padding="none" className="overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-[#003262]">業務資料視圖</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Data synced with 5T Integrity Protocol
                </p>
              </div>

              {loading ? (
                <div className="h-40 flex items-center justify-center text-sm text-slate-400">
                  載入中...
                </div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                          {['日期', '指標名稱', '數值', '來源', '5T Hash', '操作'].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {data.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                              {row.date}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-[#003262]">
                              {row.metric_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                              {row.metric_value}{' '}
                              <span className="text-xs text-slate-400">{row.unit}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                              {row.source_origin}
                            </td>
                            <td className="px-4 py-3">
                              {row.hash_lock ? (
                                <Badge
                                  variant="success"
                                  size="sm"
                                  icon={<ShieldCheck size={10} />}
                                >
                                  {row.hash_lock.substring(0, 8)}...
                                </Badge>
                              ) : (
                                <Badge variant="default" size="sm">
                                  未封印
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {!row.hash_lock ? (
                                <button
                                  onClick={() => handleSeal(row.id)}
                                  disabled={sealingId === row.id}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-800 disabled:opacity-50 transition-colors"
                                >
                                  {sealingId === row.id ? (
                                    <Loader2 size={10} className="animate-spin" />
                                  ) : (
                                    <Lock size={10} />
                                  )}
                                  封印
                                </button>
                              ) : (
                                <CheckCircle2 size={14} className="text-emerald-500" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden divide-y divide-slate-50">
                    {data.map((row) => (
                      <div key={row.id} className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-[#003262]">{row.metric_name}</p>
                          <span className="text-sm font-mono font-bold text-[#003262]">
                            {row.metric_value}
                            <span className="text-xs text-slate-400 ml-0.5">{row.unit}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{row.date}</span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[10px] text-slate-400">{row.source_origin}</span>
                          {row.hash_lock && <ShieldCheck size={10} className="text-emerald-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-5 border-cyan-100">
              <h3 className="text-sm font-bold text-[#003262] mb-4">OmniAgent 輔助</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  此模組已接軌 <strong>萬能元件原子庫</strong>，並符合全端雙向 TypeScript 規範。
                </p>
                <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                  <h4 className="text-xs font-bold text-cyan-700 mb-2">設計原則</h4>
                  <ul className="space-y-1 text-xs text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} className="text-cyan-500" />
                      客戶體驗 (CX)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} className="text-cyan-500" />
                      業務邏輯 (BL)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} className="text-cyan-500" />
                      極致美學 (UI)
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
