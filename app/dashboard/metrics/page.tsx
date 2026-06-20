// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Input, Badge, SectionHeader } from '@/components/ui/v2/Input';
import { StatusDot } from '@/components/ui/v2/StatusDot';
import { supabase } from '@/lib/db/supabase';
import {
  Database,
  Plus,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Zap,
  BarChart3,
  Hash,
} from 'lucide-react';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [newMetric, setNewMetric] = useState({
    metric_code: '',
    metric_name: '',
    category: 'ENVIRONMENTAL',
    unit: '',
    value: '',
    target_value: '',
    reporting_year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('esg_records')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      setMetrics(
        (data || []).map((record: any) => ({
          id: record.id,
          category:
            record.category === 'E'
              ? 'ENVIRONMENTAL'
              : record.category === 'S'
              ? 'SOCIAL'
              : record.category === 'G'
              ? 'GOVERNANCE'
              : record.category,
          metric_code: record.metric_value?.metric_code || 'N/A',
          metric_name: record.metric_value?.metric_name || 'N/A',
          value: record.metric_value?.value || 0,
          target_value: record.metric_value?.target_value || 0,
          unit: record.metric_value?.unit || '',
          lifecycle_stage: record.metric_value?.lifecycle_stage || 'DRAFT',
          hash_lock: record.zkp_hash,
        }))
      );
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddMetric = async () => {
    try {
      const { error } = await supabase.from('esg_records').insert([
        {
          category:
            newMetric.category === 'ENVIRONMENTAL'
              ? 'E'
              : newMetric.category === 'SOCIAL'
              ? 'S'
              : newMetric.category === 'GOVERNANCE'
              ? 'G'
              : newMetric.category,
          metric_value: {
            ...newMetric,
            value: Number(newMetric.value),
            target_value: Number(newMetric.target_value),
            reporting_year: Number(newMetric.reporting_year),
          },
        },
      ]);
      if (error) throw error;
      setShowAddForm(false);
      setNewMetric({
        metric_code: '',
        metric_name: '',
        category: 'ENVIRONMENTAL',
        unit: '',
        value: '',
        target_value: '',
        reporting_year: new Date().getFullYear(),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeal = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/zkp/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (res.ok) {
        fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              ESG Metrics 數據對接
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              萬能數據庫綁定，實作 CRUD 操作與 5T 封印
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '取消' : '新增指標'}
          </Button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: '總指標數',
              value: metrics.length,
              icon: Database,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              label: '已封印',
              value: metrics.filter((m) => m.hash_lock).length,
              icon: ShieldCheck,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              label: '待處理',
              value: metrics.filter((m) => !m.hash_lock).length,
              icon: Zap,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              label: '數據年份',
              value: new Date().getFullYear(),
              icon: Hash,
              color: 'text-neutral-600 bg-neutral-100',
            },
          ].map((kpi) => (
            <Card key={kpi.label} variant="default" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${kpi.color}`}>
                  <kpi.icon size={14} />
                </div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  {kpi.label}
                </span>
              </div>
              <span className="text-2xl font-black text-neutral-900">{kpi.value}</span>
            </Card>
          ))}
        </div>

        {showAddForm && (
          <Card variant="default" padding="md">
            <SectionHeader title="新增 ESG 指標" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input
                label="指標代碼"
                placeholder="GRI-305-1"
                value={newMetric.metric_code}
                onChange={(e) => setNewMetric({ ...newMetric, metric_code: e.target.value })}
              />
              <Input
                label="指標名稱"
                placeholder="直接溫室氣體排放"
                value={newMetric.metric_name}
                onChange={(e) => setNewMetric({ ...newMetric, metric_name: e.target.value })}
              />
              <Input
                label="單位"
                placeholder="tCO2e"
                value={newMetric.unit}
                onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
              />
              <Input
                label="當前數值"
                type="number"
                placeholder="0"
                value={newMetric.value}
                onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
              />
              <Input
                label="目標數值"
                type="number"
                placeholder="0"
                value={newMetric.target_value}
                onChange={(e) => setNewMetric({ ...newMetric, target_value: e.target.value })}
              />
              <Input
                label="報告年份"
                type="number"
                value={newMetric.reporting_year}
                onChange={(e) =>
                  setNewMetric({ ...newMetric, reporting_year: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="primary" size="sm" onClick={handleAddMetric}>
                儲存
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowAddForm(false)}>
                取消
              </Button>
            </div>
          </Card>
        )}

        <Card variant="default" padding="none" className="overflow-hidden">
          <SectionHeader title="Metrics 數據表" subtitle="即時同步數據帳本" />
          {loading ? (
            <div className="h-40 flex flex-col items-center justify-center gap-3">
              <Loader2 size={24} className="text-neutral-400 animate-spin" />
              <span className="text-sm text-neutral-400">載入中...</span>
            </div>
          ) : metrics.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-neutral-400">
              暫無數據
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-100 text-[10px] uppercase text-neutral-400">
                  <tr>
                    {['代碼', '名稱', '類別', '數值', '目標', '階段', 'ZKP Hash', '操作'].map(
                      (h) => (
                        <th key={h} className="px-4 py-3 font-bold">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {metrics.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-neutral-900">
                        {row.metric_code}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700">{row.metric_name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral" size="sm">
                          {row.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {row.value} {row.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {row.target_value} {row.unit}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            row.lifecycle_stage === 'PUBLISHED'
                              ? 'success'
                              : row.lifecycle_stage === 'REVIEW'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {row.lifecycle_stage}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {row.hash_lock ? (
                          <div className="flex items-center gap-1.5">
                            <StatusDot status="active" size="xs" />
                            <span className="text-[10px] font-mono text-neutral-500">
                              {row.hash_lock.substring(0, 8)}...
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-300">未封印</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!row.hash_lock && (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleSeal(row.id)}
                            loading={processingId === row.id}
                          >
                            封印 (ZKP)
                          </Button>
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
    </div>
  );
}
