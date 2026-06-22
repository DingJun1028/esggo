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
  Leaf,
  Wind,
  Recycle,
  TrendingDown,
  Zap,
  Droplets,
  Globe,
  Loader2,
  Sparkles,
  Shield,
  BarChart3,
} from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

export default function EnvironmentalMetricsPage() {
  const [metrics, setMetrics] = useState({
    carbonEmissions: 8.5,
    energyConsumption: 1200,
    recyclingRate: 85.5,
    renewableRatio: 35,
    waterWithdrawal: 500,
    wasteGenerated: 2.5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('esg_records')
          .select('metric_value')
          .eq('category', 'E')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching environmental metrics:', error);
        } else if (data && data.metric_value && isMounted) {
          const m = data.metric_value;
          setMetrics((prev) => ({
            carbonEmissions: m.carbon_emissions ?? prev.carbonEmissions,
            energyConsumption: m.energy_consumption ?? prev.energyConsumption,
            recyclingRate: m.recycling_rate ?? prev.recyclingRate,
            renewableRatio: m.renewable_ratio ?? prev.renewableRatio,
            waterWithdrawal: m.water_withdrawal ?? prev.waterWithdrawal,
            wasteGenerated: m.waste_generated ?? prev.wasteGenerated,
          }));
        }
      } catch (err) {
        console.error('Unexpected error fetching environmental metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const channel = supabase
      .channel('schema-db-changes-environmental')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.E' },
        (payload) => {
          const m = payload.new.metric_value;
          if (m && isMounted) {
            setMetrics((prev) => ({
              carbonEmissions: m.carbon_emissions ?? prev.carbonEmissions,
              energyConsumption: m.energy_consumption ?? prev.energyConsumption,
              recyclingRate: m.recycling_rate ?? prev.recyclingRate,
              renewableRatio: m.renewable_ratio ?? prev.renewableRatio,
              waterWithdrawal: m.water_withdrawal ?? prev.waterWithdrawal,
              wasteGenerated: m.waste_generated ?? prev.wasteGenerated,
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
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-200">
              <Leaf className="text-emerald-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                  <Sparkles size={11} className="text-emerald-500" /> Environmental Metrics
                </span>
                <Badge variant="success" size="sm">
                  <Leaf size={10} className="mr-1" /> E-Metrics
                </Badge>
                {loading && <Loader2 size={14} className="animate-spin text-emerald-500" />}
              </div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                環境指標 (Environmental)
              </h1>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Climate Action & Resource Management
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<BarChart3 size={14} />}>
              分析報表
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
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Wind size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">碳排放量 (範疇一+二)</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.carbonEmissions}{' '}
                  <span className="text-sm font-normal text-neutral-400">tCO₂e</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <TrendingDown size={12} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">較基準年降低 8%</span>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Zap size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">總能源消耗</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.energyConsumption.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-neutral-400">GJ</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">再生能源佔比</span>
              <span className="text-amber-600 font-bold">{metrics.renewableRatio}%</span>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Recycle size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">廢棄物回收率</p>
                <p className="text-2xl font-black text-neutral-900">{metrics.recyclingRate}%</p>
              </div>
            </div>
            <Progress value={metrics.recyclingRate} size="sm" color="auto" />
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                <Droplets size={18} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">總取水量</p>
                <p className="text-2xl font-black text-neutral-900">
                  {metrics.waterWithdrawal}{' '}
                  <span className="text-sm font-normal text-neutral-400">m³</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">水回收率</span>
              <span className="text-cyan-600 font-bold">60%</span>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Globe size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">TNFD 對齊程度</p>
                <p className="text-2xl font-black text-neutral-900">60%</p>
              </div>
            </div>
            <Progress value={60} size="sm" color="auto" />
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <Shield size={18} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">ISO 14001 認證</p>
                <p className="text-2xl font-black text-neutral-900">100%</p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              已認證
            </Badge>
          </Card>
        </div>

        {/* FiveT Strip */}
        <Card variant="default" padding="md">
          <SectionHeader title="5T 永續指標" subtitle="環境面向之落實程度" />
          <div className="mt-4">
            <FiveTStrip status={[true, true, true, true, false]} showLabels={true} />
          </div>
        </Card>

        {/* 詳細數據 */}
        <Card variant="default" padding="md">
          <SectionHeader title="環境績效數據" subtitle="2026 年度具體指標" />
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
                  <td className="py-3 px-4">範疇一排放 (tCO₂e)</td>
                  <td className="py-3 px-4 text-right font-mono">8.5</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">9.2</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">7.0</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="warning" size="sm">
                      76%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">範疇二排放 (tCO₂e)</td>
                  <td className="py-3 px-4 text-right font-mono">12.3</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">13.5</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">10.0</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="warning" size="sm">
                      74%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">範疇三排放 (tCO₂e)</td>
                  <td className="py-3 px-4 text-right font-mono">5.2</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">5.8</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">4.0</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="warning" size="sm">
                      69%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">能源消耗 (GJ)</td>
                  <td className="py-3 px-4 text-right font-mono">1,200</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">1,350</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">1,100</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      81%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">再生能源比例</td>
                  <td className="py-3 px-4 text-right font-mono">35%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">25%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">50%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="warning" size="sm">
                      70%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">水回收率</td>
                  <td className="py-3 px-4 text-right font-mono">60%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">50%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">70%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="warning" size="sm">
                      86%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4">廢棄物回收率</td>
                  <td className="py-3 px-4 text-right font-mono">85%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">80%</td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">90%</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      94%
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
