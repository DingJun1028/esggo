'use client';

import React, { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Users, Heart, GraduationCap, TrendingUp, Briefcase, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

export default function SocialMetricsPage() {
  const [metrics, setMetrics] = useState({
    retentionRate: 92.4,
    trainingHours: 4520,
    hseIncidents: 0,
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
          setMetrics(prev => ({
            retentionRate: m.retention_rate ?? prev.retentionRate,
            trainingHours: m.training_hours ?? prev.trainingHours,
            hseIncidents: m.hse_incidents ?? prev.hseIncidents,
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
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.S' }, payload => {
        const m = payload.new.metric_value as any;
        if (m && isMounted) {
          setMetrics(prev => ({
            retentionRate: m.retention_rate ?? prev.retentionRate,
            trainingHours: m.training_hours ?? prev.trainingHours,
            hseIncidents: m.hse_incidents ?? prev.hseIncidents,
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
              <Users className="text-purple-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="default" size="sm" icon={<Heart size={12}/>} className="bg-purple-500/20 text-purple-300 border-purple-500/30">S-Metrics</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">SOC-001</span>
                {loading && <Loader2 className="w-3 h-3 text-purple-500 animate-spin" />}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">社會指標 (Social)</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Labor Practices & Community Impact</p>
            </div>
          </div>
        </header>

        {/* Social Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-pink-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Heart size={18} className="text-pink-400" /> 員工留任率
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.retentionRate.toFixed(1)}%</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2 flex items-center gap-1">
              <TrendingUp size={14} className="text-emerald-500" /> 較上季提升 1.2%
            </p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-purple-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <GraduationCap size={18} className="text-purple-400" /> 培訓總時數
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.trainingHours.toLocaleString()} 小時</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">達標: 平均每人 24 小時</p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-blue-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-blue-400" /> 職安衛事件
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.hseIncidents} 件</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">狀態: 零失能傷害</p>
          </UniversalCard>
        </div>

      </div>
    </div>
  );
}
