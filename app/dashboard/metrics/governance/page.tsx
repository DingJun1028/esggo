// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';
import { FiveTStrip } from '@/components/ui/v2/FiveTStrip';
import { Progress } from '@/components/ui/v2/Progress';
import { Button } from '@/components/ui/v2/Button';
import {
  Scale,
  Shield,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Lock,
  Eye,
} from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

export default function GovernanceMetricsPage() {
  const [metrics, setMetrics] = useState({
    boardIndependence: 33.3,
    ethicsIncidents: 0,
    policyCompliance: 100,
    femaleDirectors: 33.3,
    complianceViolations: 0,
    iso27001: 100,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('esg_records')
          .select('metric_value')
          .eq('category', 'G')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching governance metrics:', error);
        } else if (data && data.metric_value && isMounted) {
          const m = data.metric_value;
          setMetrics((prev) => ({
            boardIndependence: m.board_independence ?? prev.boardIndependence,
            ethicsIncidents: m.ethics_incidents ?? prev.ethicsIncidents,
            policyCompliance: m.policy_compliance ?? prev.policyCompliance,
            femaleDirectors: m.female_directors ?? prev.femaleDirectors,
            complianceViolations: m.compliance_violations ?? prev.complianceViolations,
            iso27001: m.iso27001 ?? prev.iso27001,
          }));
        }
      } catch (err) {
        console.error('Unexpected error fetching governance metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const channel = supabase
      .channel('schema-db-changes-governance')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.G' },
        (payload) => {
          const m = payload.new.metric_value;
          if (m && isMounted) {
            setMetrics((prev) => ({
              boardIndependence: m.board_independence ?? prev.boardIndependence,
              ethicsIncidents: m.ethics_incidents ?? prev.ethicsIncidents,
              policyCompliance: m.policy_compliance ?? prev.policyCompliance,
              femaleDirectors: m.female_directors ?? prev.femaleDirectors,
              complianceViolations: m.compliance_violations ?? prev.complianceViolations,
              iso27001: m.iso27001 ?? prev.iso27001,
            }));
          }
        }
      )
      .subscribe();

    fetchData();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
              <Scale className="text-amber-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500" /> Governance Metrics
                </span>
                <Badge variant="warning" size="sm">
                  <Shield size={10} className="mr-1" /> G-Metrics
                </Badge>
                {loading && <Loader2 size={14} className="animate-spin text-amber-500" />}
              </div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                治理指標 (Governance)
              </h1>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Corporate Ethics & Board Independence
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<Eye size={14} />}>
              稽核記錄
            </Button>
            <Button variant="primary" size="sm" icon={<Sparkles size={14} />}>
              AI 建議
            </Button>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Scale size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">獨立董事比例</p>
                <p className="text-2xl font-black text-neutral-900">{metrics.boardIndependence}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">符合法規要求</span>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <AlertTriangle size={18} className="text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">誠信倫理違規事件</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.ethicsIncidents}{' '}
                  <span className="text-sm font-normal text-neutral-400">件</span>
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              維持零違規
            </Badge>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileCheck size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">政策遵循達成率</p>
                <p className="text-2xl font-black text-neutral-900">{metrics.policyCompliance}%</p>
              </div>
            </div>
            <Progress value={metrics.policyCompliance} size="sm" color="auto" />
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <Shield size={18} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">女性董事比例</p>
                <p className="text-2xl font-black text-neutral-900">{metrics.femaleDirectors}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">董事會多元化</span>
              <span className="text-violet-600 font-bold">持續提升</span>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Lock size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">ISO 27001 認證</p>
                <p className="text-2xl font-black text-neutral-900">{metrics.iso27001}%</p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              已認證
            </Badge>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">法規違反件數</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.complianceViolations}
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              零裁罰
            </Badge>
          </Card>
        </div>

        {/* FiveT Strip */}
        <Card variant="default" padding="md">
          <SectionHeader title="5T 永續指標" subtitle="治理面向之落實程度" />
          <div className="mt-4">
            <FiveTStrip status={[true, true, true, true, false]} showLabels={true} />
          </div>
        </Card>

        {/* 詳細數據 */}
        <Card variant="default" padding="md">
          <SectionHeader title="治理績效數據" subtitle="2026 年度具體指標" />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-600">指標</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-600">2026</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-600">前年</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-600">目標</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-600">達成率</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">獨立董事比例</td>
                  <td className="py-3 px-4 text-right font-mono">33.3%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">33.3%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">≥ 33%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">女性董事比例</td>
                  <td className="py-3 px-4 text-right font-mono">33.3%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">16.7%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">≥ 33%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">董事會出席率</td>
                  <td className="py-3 px-4 text-right font-mono">95%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">90%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">≥ 90%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">倫理訓練完成率</td>
                  <td className="py-3 px-4 text-right font-mono">100%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">100%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">100%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">誠信違規事件</td>
                  <td className="py-3 px-4 text-right font-mono">0 件</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">0 件</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">0 件</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">法規違反件數</td>
                  <td className="py-3 px-4 text-right font-mono">0 件</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">0 件</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">0 件</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">資安事件數</td>
                  <td className="py-3 px-4 text-right font-mono">0</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">0</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">0</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
