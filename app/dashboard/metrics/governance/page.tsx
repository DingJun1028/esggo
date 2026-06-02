'use client';

import React, { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { ShieldCheck, Scale, FileText, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

export default function GovernanceMetricsPage() {
  const [metrics, setMetrics] = useState({
    boardIndependence: 75,
    integrityPolicy: 100,
    violationIncidents: 0,
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
          setMetrics(prev => ({
            boardIndependence: m.board_independence ?? prev.boardIndependence,
            integrityPolicy: m.integrity_policy ?? prev.integrityPolicy,
            violationIncidents: m.violation_incidents ?? prev.violationIncidents,
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
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.G' }, payload => {
        const m = payload.new.metric_value as any;
        if (m && isMounted) {
          setMetrics(prev => ({
            boardIndependence: m.board_independence ?? prev.boardIndependence,
            integrityPolicy: m.integrity_policy ?? prev.integrityPolicy,
            violationIncidents: m.violation_incidents ?? prev.violationIncidents,
          }));
        }
      })
      .subscribe();

    fetchData();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
              <ShieldCheck className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="primary" size="sm" icon={<Scale size={12}/>}>G-Metrics</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">GOV-001</span>
                {loading && <Loader2 className="w-3 h-3 text-cyan-500 animate-spin" />}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">治理指標 (Governance)</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Board Composition & Ethics</p>
            </div>
          </div>
        </header>

        {/* Governance Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-cyan-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Scale size={18} className="text-cyan-400" /> 董事會獨立性
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.boardIndependence}%</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">達標: 獨立董事比例</p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-emerald-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <FileText size={18} className="text-emerald-400" /> 誠信經營政策
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.integrityPolicy}%</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">達標: 內部簽署率</p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-amber-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-amber-400" /> 違規事件通報
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.violationIncidents} 件</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">狀態: 本季度無重大違規</p>
          </UniversalCard>
        </div>

      </div>
    </div>
  );
}
