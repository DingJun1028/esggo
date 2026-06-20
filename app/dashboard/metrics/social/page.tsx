// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import { Users, HeartHandshake, BookOpen, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

export default function SocialMetricsPage() {
  const [metrics, setMetrics] = useState({
    retentionRate: 92.5,
    diversityRatio: 45.2,
    trainingHours: 42.5,
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
          const m = data.metric_value as any;
          setMetrics((prev) => ({
            retentionRate: m.retention_rate ?? prev.retentionRate,
            diversityRatio: m.diversity_ratio ?? prev.diversityRatio,
            trainingHours: m.training_hours ?? prev.trainingHours,
          }));
        }
      } catch (err) {
        console.error('Unexpected error fetching social metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes-social')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.S' },
        (payload) => {
          const m = payload.new.metric_value as any;
          if (m && isMounted) {
            setMetrics((prev) => ({
              retentionRate: m.retention_rate ?? prev.retentionRate,
              diversityRatio: m.diversity_ratio ?? prev.diversityRatio,
              trainingHours: m.training_hours ?? prev.trainingHours,
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-8 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in- duration-700">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 /20 /20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative">
              <Users className="text-indigo-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge
                  variant="default"
                  size="sm"
                  icon={<HeartHandshake size={12} />}
                  className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                >
                  S-Metrics
                </Badge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  SOC-001
                </span>
                {loading && <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                社會指標 (Social)
              </h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">
                Human Capital & Community Impact
              </p>
            </div>
          </div>
        </header>

        {/* Social Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            variant="default"
            className="p-6 transition-all duration-300 hover:border-indigo-500/30"
          >
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-indigo-400" /> 員工留任率
            </h3>
            <div className="text-3xl font-black text-white mb-2">
              {metrics.retentionRate.toFixed(1)}
              <span className="text-lg font-normal text-slate-500">%</span>
            </div>
            <p className="text-sm text-slate-400 border-t border-slate-200 pt-2 flex items-center gap-1">
              <TrendingUp size={14} className="text-indigo-500" /> 較去年提升 2.1%
            </p>
          </Card>

          <Card
            variant="default"
            className="p-6 transition-all duration-300 hover:border-blue-500/30"
          >
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <HeartHandshake size={18} className="text-blue-400" /> 性別多元比例 (女性)
            </h3>
            <div className="text-3xl font-black text-white mb-2">
              {metrics.diversityRatio.toFixed(1)}
              <span className="text-lg font-normal text-slate-500">%</span>
            </div>
            <p className="text-sm text-slate-400 border-t border-slate-200 pt-2">
              管理階層佔比 38%
            </p>
          </Card>

          <Card
            variant="default"
            className="p-6 transition-all duration-300 hover:border-purple-500/30"
          >
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-purple-400" /> 平均培訓時數
            </h3>
            <div className="text-3xl font-black text-white mb-2">
              {metrics.trainingHours.toFixed(1)}{' '}
              <span className="text-lg font-normal text-slate-500">小時/人</span>
            </div>
            <p className="text-sm text-slate-400 border-t border-slate-200 pt-2">
              年度目標: 50 小時
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
