// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import {
  Leaf, Droplets, Zap, ShieldAlert, BarChart3, Fingerprint,
  FileText, Bell, Search, Settings, RefreshCw, Loader2,
  Lock as LockIcon, CheckCircle2, TrendingUp, TrendingDown,
  Activity, Database, Eye, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';

/* ─── Types ─── */
interface KpiData {
  id: string;
  title: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  trend?: number;
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
}

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface DataRow {
  id: string;
  source_origin: string;
  zkp_sealed: boolean;
  status: 'Verified' | 'Pending' | 'Void';
  content: string;
  value: string;
  hash: string;
}

/* ─── Main Page ─── */
export default function DashboardPage() {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'analytics'>('overview');

  // Fetch user
  useEffect(() => {
    fetchUser();
    fetchData();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) { const d = await res.json(); setUser(d.user); }
    } catch { /* ignore */ }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      const res = await fetch('/api/dashboard/data');
      if (res.ok) {
        const d = await res.json();
        setData(d.data || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleSeal = async (id: string) => {
    setSealingId(id);
    try {
      const res = await fetch('/api/vault/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evidence: { table: 'dashboard_data', recordId: id, timestamp: Date.now() }, type: '5t-seal' }),
      });
      const d = await res.json();
      if (d.success && d.hashLock) {
        setData(prev => prev.map(r => r.id === id ? { ...r, zkp_sealed: true, hash: d.hashLock } : r));
      }
    } catch { /* ignore */ } finally {
      setSealingId(null);
    }
  };

  // KPI Data
  const kpiData: KpiData[] = [
    { id: 'scope1', title: 'Scope 1 直接排放', value: '450.2', unit: 'tCO₂e', icon: Leaf, trend: -3.2, fiveTStatus: [true, true, true, true, true] },
    { id: 'water', title: '水資源使用量', value: '8,205', unit: 'm³', icon: Droplets, trend: 1.5, fiveTStatus: [true, true, true, true, false] },
    { id: 'energy', title: '能源消耗', value: '12.5M', unit: 'kWh', icon: Zap, trend: -8.1, fiveTStatus: [true, true, true, false, false] },
    { id: 'supply', title: '供應鏈合規', value: '94.8', unit: '%', icon: ShieldAlert, trend: 2.3, fiveTStatus: [true, true, true, true, true] },
  ];

  // Chart data (from actual data or defaults)
  const emissionData: ChartDataPoint[] = [
    { label: '1月', value: 420, color: '#10B981' },
    { label: '2月', value: 380, color: '#10B981' },
    { label: '3月', value: 450, color: '#F59E0B' },
    { label: '4月', value: 410, color: '#10B981' },
    { label: '5月', value: 390, color: '#10B981' },
    { label: '6月', value: 450, color: '#EF4444' },
  ];

  const maxEmission = Math.max(...emissionData.map(d => d.value));

  const verifiedCount = data.filter(d => d.status === 'Verified').length;
  const pendingCount = data.filter(d => d.status === 'Pending').length;
  const voidCount = data.filter(d => d.status === 'Void').length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ─── Header ─── */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">OmniSync Active</span>
              </div>
              <h1 className="text-2xl font-black text-neutral-900">
                {user?.name ? `歡迎回來，${user.name}` : '永續數據儀表板'}
              </h1>
              <p className="text-sm text-neutral-500 mt-1">即時 ESG 數據監控 · 5T 誠信驗證</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" size="md">{verifiedCount} 已驗證</Badge>
              <Badge variant="warning" size="md">{pendingCount} 待處理</Badge>
              <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </Button>
            </div>
          </div>
        </Card>

        {/* ─── Tabs ─── */}
        <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'overview' as const, label: '概覽', icon: BarChart3 },
            { id: 'data' as const, label: '數據', icon: Database },
            { id: 'analytics' as const, label: '分析', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map(kpi => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.id} variant="default" padding="md" hover>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 rounded-lg bg-neutral-50">
                    <Icon size={18} className="text-neutral-600" />
                  </div>
                  {kpi.trend !== undefined && (
                    <div className={cn('flex items-center gap-1 text-xs font-medium',
                      kpi.trend >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                      {kpi.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(kpi.trend)}%
                    </div>
                  )}
                </div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">{kpi.title}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-black text-neutral-900">{kpi.value}</span>
                  <span className="text-sm text-neutral-400">{kpi.unit}</span>
                </div>
                <Protocol5TStrip status={kpi.fiveTStatus} />
              </Card>
            );
          })}
        </div>

        {/* ─── Overview Tab ─── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Emission Chart */}
            <Card variant="default" padding="md" className="lg:col-span-2">
              <SectionHeader title="碳排放趨勢" subtitle="過去 6 個月 (tCO₂e)" />
              <div className="mt-4 space-y-3">
                {emissionData.map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-8 text-xs text-neutral-500">{point.label}</span>
                    <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${(point.value / maxEmission) * 100}%`, backgroundColor: point.color }}
                      >
                        <span className="text-[10px] font-bold text-white">{point.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Status Distribution */}
            <Card variant="default" padding="md">
              <SectionHeader title="數據狀態" subtitle={`${data.length} 筆資料`} />
              <div className="mt-4 space-y-4">
                {[
                  { label: '已驗證', count: verifiedCount, color: 'bg-emerald-500', pct: data.length ? (verifiedCount / data.length * 100) : 0 },
                  { label: '待處理', count: pendingCount, color: 'bg-amber-500', pct: data.length ? (pendingCount / data.length * 100) : 0 },
                  { label: '已作廢', count: voidCount, color: 'bg-neutral-400', pct: data.length ? (voidCount / data.length * 100) : 0 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-600">{item.label}</span>
                      <span className="text-xs font-medium text-neutral-900">{item.count} ({item.pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ─── Data Tab ─── */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <SectionHeader title="資料溯源帳本" subtitle={`${data.length} 筆記錄`}
              action={<Button variant="ghost" size="sm"><Download size={14} />匯出</Button>}
            />
            <Card variant="default" padding="none">
              {loading ? (
                <div className="h-48 flex items-center justify-center gap-3">
                  <Loader2 size={20} className="text-neutral-400 animate-spin" />
                  <span className="text-sm text-neutral-500">載入中...</span>
                </div>
              ) : data.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center gap-3">
                  <Database size={24} className="text-neutral-200" />
                  <p className="text-sm text-neutral-500">尚無數據</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-100">
                        {['內容', '數值', '來源', '狀態', '5T 封印', '操作'].map(h => (
                          <th key={h} className="px-4 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {data.map(row => (
                        <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-neutral-900">{row.content}</td>
                          <td className="px-4 py-3 text-sm text-neutral-600 font-mono">{row.value}</td>
                          <td className="px-4 py-3 text-xs text-neutral-400">{row.source_origin}</td>
                          <td className="px-4 py-3">
                            <Badge variant={row.status === 'Verified' ? 'success' : row.status === 'Pending' ? 'warning' : 'neutral'} size="sm">{row.status}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            {row.zkp_sealed ? (
                              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                                <LockIcon size={12} />
                                <span className="font-mono">{row.hash.substring(0, 10)}...</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-neutral-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {!row.zkp_sealed && (
                              <button
                                onClick={() => handleSeal(row.id)}
                                disabled={sealingId === row.id}
                                className="text-xs font-bold text-cyan-600 hover:text-cyan-800 transition-colors disabled:opacity-50"
                              >
                                {sealingId === row.id ? <Loader2 size={12} className="animate-spin" /> : 'Seal'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ─── Analytics Tab ─── */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card variant="default" padding="md">
              <SectionHeader title="5T 協議合規分析" />
              <div className="mt-4 space-y-3">
                {['Truth (真)', 'Goodness (善)', 'Beauty (美)', 'Trust (信)', 'Transferful (通)'].map((t, i) => {
                  const pct = [95, 88, 92, 97, 85][i];
                  return (
                    <div key={t}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-600">{t}</span>
                        <span className="text-xs font-medium text-neutral-900">{pct}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-neutral-900 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card variant="default" padding="md">
              <SectionHeader title="數據來源分佈" />
              <div className="mt-4 space-y-3">
                {[
                  { label: 'ERP 系統', count: 45, pct: 38 },
                  { label: 'IoT 感測器', count: 32, pct: 27 },
                  { label: '手動輸入', count: 28, pct: 24 },
                  { label: 'API 匯入', count: 13, pct: 11 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-600">{item.label}</span>
                      <span className="text-xs font-medium text-neutral-900">{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-neutral-600 transition-all duration-500" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
