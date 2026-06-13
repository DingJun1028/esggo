'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { Scale, Shield, FileCheck, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

export default function GovernanceMetricsPage() {
  const [metrics, setMetrics] = useState({
    boardIndependence: 75.0,
    ethicsIncidents: 0,
    policyCompliance: 98.5,
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
          const m = data.metric_value as any;
          setMetrics((prev) => ({
            boardIndependence: m.board_independence ?? prev.boardIndependence,
            ethicsIncidents: m.ethics_incidents ?? prev.ethicsIncidents,
            policyCompliance: m.policy_compliance ?? prev.policyCompliance,
          }));
        }
      } catch (err) {
        console.error('Unexpected error fetching governance metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes-governance')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.G' },
        (payload) => {
          const m = payload.new.metric_value as any;
          if (m && isMounted) {
            setMetrics((prev) => ({
              boardIndependence: m.board_independence ?? prev.boardIndependence,
              ethicsIncidents: m.ethics_incidents ?? prev.ethicsIncidents,
              policyCompliance: m.policy_compliance ?? prev.policyCompliance,
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
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative">
              <Scale className="text-amber-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge
                  variant="default"
                  size="sm"
                  icon={<Shield size={12} />}
                  className="bg-amber-500/20 text-amber-300 border-amber-500/30"
                >
                  G-Metrics
                </OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  GOV-001
                </span>
                {loading && <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                治理指標 (Governance)
              </h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">
                Corporate Ethics & Board Independence
              </p>
            </div>
          </div>
        </header>

        {/* Governance Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OmniBaseCard
            variant="glass"
            className="p-6 transition-all duration-300 hover:border-amber-500/30"
          >
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Scale size={18} className="text-amber-400" /> 獨立董事比例
            </h3>
            <div className="text-3xl font-black text-white mb-2">
              {metrics.boardIndependence.toFixed(1)}
              <span className="text-lg font-normal text-slate-500">%</span>
            </div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-amber-500" /> 符合法規高標準要求
            </p>
          </OmniBaseCard>

          <OmniBaseCard
            variant="glass"
            className="p-6 transition-all duration-300 hover:border-orange-500/30"
          >
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-orange-400" /> 誠信倫理違規事件
            </h3>
            <div className="text-3xl font-black text-white mb-2">
              {metrics.ethicsIncidents}{' '}
              <span className="text-lg font-normal text-slate-500">件</span>
            </div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2 text-emerald-400/80">
              維持零違規優良紀錄
            </p>
          </OmniBaseCard>

          <OmniBaseCard
            variant="glass"
            className="p-6 transition-all duration-300 hover:border-yellow-500/30"
          >
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <FileCheck size={18} className="text-yellow-400" /> 政策遵循達成率
            </h3>
            <div className="text-3xl font-black text-white mb-2">
              {metrics.policyCompliance.toFixed(1)}
              <span className="text-lg font-normal text-slate-500">%</span>
            </div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">
              全公司資安與合規考核
            </p>
          </OmniBaseCard>
        </div>
      </div>
    </div>
  );
}
