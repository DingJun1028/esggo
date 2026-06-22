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
  Users,
  HeartHandshake,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Loader2,
  Sparkles,
  Heart,
  GraduationCap,
} from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

export default function SocialMetricsPage() {
  const [metrics, setMetrics] = useState({
    retentionRate: 100,
    diversityRatio: 40,
    trainingHours: 40,
    femaleManagerRatio: 20,
    communityInvestment: 50,
    volunteerHours: 100,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('esg_records')
          .select('metric_value')
          .eq('category', 'S')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching social metrics:', error);
        } else if (data && data.metric_value && isMounted) {
          const m = data.metric_value;
          setMetrics((prev) => ({
            retentionRate: m.retention_rate ?? prev.retentionRate,
            diversityRatio: m.diversity_ratio ?? prev.diversityRatio,
            trainingHours: m.training_hours ?? prev.trainingHours,
            femaleManagerRatio: m.female_manager_ratio ?? prev.femaleManagerRatio,
            communityInvestment: m.community_investment ?? prev.communityInvestment,
            volunteerHours: m.volunteer_hours ?? prev.volunteerHours,
          }));
        }
      } catch (err) {
        console.error('Unexpected error fetching social metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const channel = supabase
      .channel('schema-db-changes-social')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.S' },
        (payload) => {
          const m = payload.new.metric_value;
          if (m && isMounted) {
            setMetrics((prev) => ({
              retentionRate: m.retention_rate ?? prev.retentionRate,
              diversityRatio: m.diversity_ratio ?? prev.diversityRatio,
              trainingHours: m.training_hours ?? prev.trainingHours,
              femaleManagerRatio: m.female_manager_ratio ?? prev.femaleManagerRatio,
              communityInvestment: m.community_investment ?? prev.communityInvestment,
              volunteerHours: m.volunteer_hours ?? prev.volunteerHours,
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
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-200">
              <Users className="text-indigo-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                  <Sparkles size={11} className="text-indigo-500" /> Social Metrics
                </span>
                <Badge variant="info" size="sm">
                  <Users size={10} className="mr-1" /> S-Metrics
                </Badge>
                {loading && <Loader2 size={14} className="animate-spin text-indigo-500" />}
              </div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                社會指標 (Social)
              </h1>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Human Capital & Community Impact
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<Heart size={14} />}>
              利害關係人
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
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">員工留任率</p>
                <p className="text-2xl font-black text-neutral-900">{metrics.retentionRate}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">較前年提升 2.1%</span>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <HeartHandshake size={18} className="text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">女性員工比例</p>
                <p className="text-2xl font-black text-neutral-900">{metrics.diversityRatio}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">女性主管佔比</span>
              <span className="text-rose-600 font-bold">{metrics.femaleManagerRatio}%</span>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <GraduationCap size={18} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">平均訓練時數</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.trainingHours}{' '}
                  <span className="text-sm font-normal text-neutral-400">小時/人</span>
                </p>
              </div>
            </div>
            <Progress value={metrics.trainingHours * 2.5} size="sm" color="auto" />
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                <Heart size={18} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">社區投資金額</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.communityInvestment}{' '}
                  <span className="text-sm font-normal text-neutral-400">萬元</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">受益人數</span>
              <span className="text-cyan-600 font-bold">500 人</span>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <BookOpen size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">志工服務時數</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.volunteerHours}{' '}
                  <span className="text-sm font-normal text-neutral-400">小時</span>
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              參與率 100%
            </Badge>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">職業安全 (LTIR)</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.retentionRate === 100 ? '0.0' : '0.8'}
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              零重大職災
            </Badge>
          </Card>
        </div>

        {/* FiveT Strip */}
        <Card variant="default" padding="md">
          <SectionHeader title="5T 永續指標" subtitle="社會面向之落實程度" />
          <div className="mt-4">
            <FiveTStrip status={[true, true, true, true, false]} showLabels={true} />
          </div>
        </Card>

        {/* 詳細數據 */}
        <Card variant="default" padding="md">
          <SectionHeader title="社會績效數據" subtitle="2026 年度具體指標" />
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
                  <td className="py-3 px-4">員工離職率</td>
                  <td className="py-3 px-4 text-right font-mono">0%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">0%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">&lt; 5%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">女性員工比例</td>
                  <td className="py-3 px-4 text-right font-mono">40%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">40%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">≥ 40%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">女性主管比例</td>
                  <td className="py-3 px-4 text-right font-mono">20%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">20%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">≥ 25%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="warning" size="sm">
                      80%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">每人訓練時數</td>
                  <td className="py-3 px-4 text-right font-mono">40 hrs</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">30 hrs</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">≥ 40 hrs</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">性別薪酬差距</td>
                  <td className="py-3 px-4 text-right font-mono">3%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">5%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">≤ 3%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">社區投資金額</td>
                  <td className="py-3 px-4 text-right font-mono">50 萬</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">30 萬</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">持續增加</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      100%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">DEI 訓練覆蓋率</td>
                  <td className="py-3 px-4 text-right font-mono">100%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">100%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">100%</td>
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
