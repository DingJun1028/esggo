'use client';

import React, { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { ShieldCheck, Scale, FileText, AlertCircle, TrendingUp, Loader2, BrainCircuit, Sparkles, Database, Lock, Activity } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';
import { useOmniTable } from '@/hooks/useOmniTable';

// Mock data for UI demonstration of the Memory Shards system
const MOCK_SHARDS = [
  { id: '1', title: 'è§?±º Prisma N+1 ?¥è©¢?é?', tags: ['Prisma', 'Performance'], entropyLevel: 12 },
  { id: '2', title: 'å¯¦ä? ZKP å°è?æµç?', tags: ['Security', '5T Protocol'], entropyLevel: 5 },
  { id: '3', title: 'UI æ¶²æ??»ç?çµ„ä»¶?æ?', tags: ['React', 'LiquidGlass'], entropyLevel: 8 },
];

export default function GovernanceMetricsPage() {
  const [metrics, setMetrics] = useState({
    boardIndependence: 75,
    integrityPolicy: 100,
    violationIncidents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [ultimate, setUltimate] = useState<{name: string, level: string} | null>(null);

  // 5T Protocol: OmniTable ZKP Logic Nodes Integration
  const { records: omniTableRecords, connectionStatus } = useOmniTable('valid-jwt-token');

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

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setUltimate({
        name: '?¨ç«¯æ¸²æ??‡å??¨é˜²è­·å¥§ç¾?(Unified)',
        level: 'Expert'
      });
      setIsSynthesizing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
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
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">æ²»ç??‡æ? (Governance)</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Board Composition & System Integrity</p>
            </div>
          </div>
        </header>

        {/* Governance Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-cyan-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Scale size={18} className="text-cyan-400" /> ????ƒç¨ç«‹æ€?            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.boardIndependence}%</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">?”æ?: ?¨ç????æ¯”ä?</p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-emerald-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <FileText size={18} className="text-emerald-400" /> èª ä¿¡ç¶“ç??¿ç?
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.integrityPolicy}%</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">?”æ?: ?§éƒ¨ç°½ç½²??/p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 transition-all duration-300 hover:border-amber-500/30">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-amber-400" /> ?•è?äº‹ä»¶?šå ±
            </h3>
            <div className="text-3xl font-black text-white mb-2">{metrics.violationIncidents} ä»?/div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">?€?? ?¬å­£åº¦ç„¡?å¤§?•è?</p>
          </UniversalCard>
        </div>

        {/* OmniCore Memory Shards Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/5">
            <BrainCircuit className="text-emerald-400" size={24} />
            <h2 className="text-2xl font-bold text-white tracking-tight">OmniCore ç³»çµ±æ²»ç? (AI Memory Shards)</h2>
          </div>
          <p className="text-slate-400 text-sm">
            ç³»çµ±ä»??äººé€é??ç??‹ä?ï¼Œå??€è¡“ä??•è??–ç‚º?Œè??¶ç???(Memory Shards)?ã€‚ç•¶ç¢ç?ç´¯ç??³ä?å®šæ•¸?ï??³å¯?ˆæ??Œæ??½å¥§ç¾?(Skill Ultimate)?ï??”åˆ°ç³»çµ±?µæ??‡çŸ¥è­˜æ?æ¾±ã€?          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shards List */}
            <UniversalCard variant="glass" className="p-6 flex flex-col h-full border border-emerald-500/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-emerald-400 flex items-center gap-2">
                  <Database size={18} /> ?¶é??„è??¶ç???                </h3>
                <UniversalBadge variant="secondary" size="sm">{MOCK_SHARDS.length} Shards</UniversalBadge>
              </div>
              <div className="space-y-4 flex-1">
                {MOCK_SHARDS.map(shard => (
                  <div key={shard.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">{shard.title}</h4>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                        ?µå€? {shard.entropyLevel}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {shard.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-widest text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </UniversalCard>

            {/* Synthesis Core */}
            <UniversalCard variant="glass" className="p-6 flex flex-col justify-center items-center text-center border border-cyan-500/20 relative overflow-hidden group">
              {/* Background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 z-0" />
              
              <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-700 ${isSynthesizing ? 'bg-cyan-500/30 animate-pulse shadow-[0_0_50px_rgba(6,182,212,0.5)]' : 'bg-white/5 border border-white/10'}`}>
                  {isSynthesizing ? <Loader2 className="text-cyan-400 animate-spin" size={40} /> : <Sparkles className="text-slate-400" size={32} />}
                </div>
                
                {!ultimate ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-2">?¡æ??€?å???(Synthesize)</h3>
                    <p className="text-slate-400 text-sm mb-8">å°‡ç¾?‰ç?è¨˜æ†¶ç¢ç??å??ºç³»çµ±æ??½å¥§ç¾©ï??ä?ç³»çµ±?µå€¼ã€?/p>
                    <UniversalButton 
                      variant="primary" 
                      className="w-full relative overflow-hidden" 
                      onClick={handleSynthesize}
                      disabled={isSynthesizing}
                    >
                      {isSynthesizing ? '?å?ä¸?(Synthesizing...)' : '?‹å??ƒå?å¥§ç¾©'}
                    </UniversalButton>
                  </>
                ) : (
                  <div className="animate-in zoom-in duration-500 w-full">
                    <UniversalBadge variant="primary" className="mb-4 mx-auto w-fit">å¥§ç¾©?ˆæ??å?</UniversalBadge>
                    <h3 className="text-2xl font-black text-cyan-400 mb-2">{ultimate.name}</h3>
                    <p className="text-slate-300 font-mono mb-6 border-t border-white/10 pt-4">
                      ?Œæ¡ç­‰ç?: <span className="text-emerald-400 font-bold">{ultimate.level}</span>
                    </p>
                    <UniversalButton variant="outline" onClick={() => setUltimate(null)} className="w-full">
                      è¿”å? (Reset)
                    </UniversalButton>
                  </div>
                )}
              </div>
            </UniversalCard>
          </div>
        </div>

        {/* 5T Protocol: OmniTable Logic Nodes (Hash Lock Visualization) */}
        <div className="mt-12 space-y-6 animate-in slide-in-from-bottom-6 duration-700 delay-300">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Lock className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-white tracking-tight">OmniTable ?è¼¯ç¯€é»å???(5T Protocol)</h2>
            </div>
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${connectionStatus === 'CONNECTED' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-xs font-mono text-slate-400">SSE: {connectionStatus}</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            ?¬å?å¡Šå³?‚å??¾è‡ª OmniBlueTable ç¶²é??å‚³ä¹‹ã€Œä??¯ç¯¡??(Trustworthy)?é?è¼¯ç?é»è??„ã€‚æ?ä¸€ç­†è??™ç??·å? ZKP Hash Lockï¼Œç¬¦??ESGGO 5T ?¸ä?èª ä¿¡æ¨™æ???          </p>

          <div className="space-y-4">
            {omniTableRecords.slice(0, 5).map((record) => (
              <UniversalCard key={record.id} variant="glass" className="p-4 border-l-2 border-l-cyan-500 hover:bg-white/5 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <UniversalBadge variant="primary" size="sm">{record.event_type}</UniversalBadge>
                      <span className="text-sm font-bold text-white tracking-wide">{record.source_origin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-2">
                      <Lock size={12} className="text-emerald-500" />
                      <span className="text-slate-400 bg-black/30 px-2 py-0.5 rounded border border-white/5 truncate max-w-[200px] md:max-w-md">
                        {record.payload?.zkp_hash || 'No Hash Lock'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-xs font-mono text-slate-500">
                    <div>{new Date(record.timestamp).toLocaleString()}</div>
                    <div>By: {record.last_modified_by}</div>
                  </div>
                </div>
              </UniversalCard>
            ))}
            {omniTableRecords.length === 0 && connectionStatus === 'CONNECTED' && (
              <div className="text-center py-8 text-slate-500 font-mono text-sm border border-dashed border-white/10 rounded-xl">
                Waiting for OmniBlue SSE Stream...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
