'use client';

import React, { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Leaf, Wind, Recycle, TrendingDown, Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

export default function EnvironmentalMetricsPage() {
  const [metrics, setMetrics] = useState({
    carbonEmissions: 1520.4,
    energyConsumption: 42500,
    recyclingRate: 85.5,
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
          const m = data.metric_value as any;
          setMetrics(prev => ({
            carbonEmissions: m.carbon_emissions ?? prev.carbonEmissions,
            energyConsumption: m.energy_consumption ?? prev.energyConsumption,
            recyclingRate: m.recycling_rate ?? prev.recyclingRate,
          }));
        }
      } catch (err) {
        console.error('Unexpected error fetching environmental metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes-environmental')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'esg_records', filter: 'category=eq.E' }, payload => {
        const m = payload.new.metric_value as any;
        if (m && isMounted) {
          setMetrics(prev => ({
            carbonEmissions: m.carbon_emissions ?? prev.carbonEmissions,
            energyConsumption: m.energy_consumption ?? prev.energyConsumption,
            recyclingRate: m.recycling_rate ?? prev.recyclingRate,
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
              <Leaf className="text-emerald-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="default" size="sm" icon={<Leaf size={12}/>} className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">E-Metrics</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">ENV-001</span>
                {loading && <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">?∞Â??áÊ? (Environmental)</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Climate Action & Resource Management</p>
            </div>
          </div>
        </header>

        {/* Environmental Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-emerald-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Wind size={18} className="text-emerald-400" /> Á¢≥Ê??æÈ? (Scope 1+2)
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.carbonEmissions.toLocaleString()} <span className="text-lg font-normal text-slate-500">tCO?Çe</span></div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2 flex items-center gap-1">
              <TrendingDown size={14} className="text-emerald-500" /> ËºÉÂéªÂπ¥Â??ü‰???5.4%
            </p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-teal-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Zap size={18} className="text-teal-400" /> Á∏ΩËÉΩÊ∫êÊ???            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.energyConsumption.toLocaleString()} <span className="text-lg font-normal text-slate-500">kWh</span></div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">?Ä?? Á∂†Èõª‰ΩîÊ? 42%</p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-green-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Recycle size={18} className="text-green-400" /> Âª¢Ê??©Â??∂Á?
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.recyclingRate.toFixed(1)}%</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">?ÆÊ?: 2026Âπ¥È? 90%</p>
          </UniversalCard>
        </div>

      </div>
    </div>
  );
}
