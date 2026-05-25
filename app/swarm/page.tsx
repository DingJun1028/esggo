'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Cpu, Play, Pause, Activity, CheckSquare, Inbox, Zap, Send, MessageSquare, Shield, RefreshCw, Bot, Code, Terminal, AlertCircle, Users, Sparkles, CheckCircle, HeartPulse, ShieldCheck, Scale, ThumbsUp, ThumbsDown, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandStatusDot, BrandTabs, BrandProgress, BrandTimeline } from '../../components/brand';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { swarmConsensusEngine, ConsensusResult } from '../../lib/swarm-consensus-engine';
import { useSwarmSync } from '../../hooks/useSwarmSync';
import { ConsensusVisualizer } from '../../components/ui/ConsensusVisualizer';

interface SwarmAgent {
  id: string; name: string; status: 'idle' | 'busy' | 'syncing'; role: string; load: number; lastAction: string;
}

export default function SwarmPage() {
  const { companyId } = useAuth();
  const [agents, setAgents] = useState<SwarmAgent[]>([
    { id: 'S1', name: 'Hermes-Alpha', status: 'idle', role: 'Governance Arch', load: 12, lastAction: 'Sealing GRI 305' },
    { id: 'S2', name: 'Hermes-Beta',  status: 'busy', role: 'Data Validator', load: 88, lastAction: 'ZKP Verification' },
    { id: 'S3', name: 'Hermes-Gamma', status: 'busy', role: 'Report Scribe',  load: 65, lastAction: 'Recursive Expansion' },
    { id: 'S4', name: 'Hermes-Delta', status: 'syncing', role: 'Registry Sync', load: 42, lastAction: 'DB Optimization' },
  ]);

  const [isAutonomous, setIsAutonomous] = useState(false);
  const [healingLogs, setHealingLogs] = useState<any[]>([]);
  const { tasks: swarmTasks, loading: swarmLoading, lastSync } = useSwarmSync(5000);
  const [proposalText, setProposalText] = useState('');
  const [consensusResult, setConsensusResult] = useState<ConsensusResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const fetchHealingLogs = useCallback(async () => {
    const { data } = await supabase.from('healing_log').select('*').order('created_at', { ascending: false }).limit(5);
    setHealingLogs(data || []);
  }, []);

  useEffect(() => {
    fetchHealingLogs();
    const channel = supabase.channel('healing-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'healing_log' }, () => fetchHealingLogs())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchHealingLogs]);

  const activeTaskCount = swarmTasks.filter(t => t.status === 'approved_for_execution' || t.status === 'pending').length;

  const handleEvaluateProposal = useCallback(async () => {
    if (!proposalText.trim()) return;
    setEvaluating(true);
    try {
      const result = await swarmConsensusEngine.evaluateProposal(proposalText);
      setConsensusResult(result);
    } catch (e) {
      console.error('Proposal evaluation failed:', e);
    } finally {
      setEvaluating(false);
    }
  }, [proposalText]);

  const handleAutoFix = async () => {
    setIsAutonomous(true);
    try {
      // Call Real DB Healing Engine
      const { data, error } = await supabase.rpc('execute_autonomous_healing', { p_company_id: companyId });
      if (error) throw error;
      
      const healedCount = (data as any).healed_count;
      alert(`OmniHermes 代理人已自主代行：成功修復了 ${healedCount} 個誠信缺角。`);
    } catch (e) {
      console.error('Healing failed:', e);
      alert('自主治理引擎暫時無法啟動，正在備援...');
    } finally {
      setIsAutonomous(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-12 fade-in">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.2em] px-4 py-1">HERMES_SWARM_V3</BrandBadge>
                 <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <BrandStatusDot status="active" pulse size="sm" />
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Distributed_Node_Live</span>
                 </div>
              </div>
              <h1 className="text-5xl font-black text-[#003262] tracking-tighter uppercase">代理人蜂群監控</h1>
           </div>
           <div className="flex gap-4">
              <BrandButton 
                variant="primary" 
                className={cn("h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all", isAutonomous ? "bg-purple-600 animate-pulse" : "bg-[#003262]")}
                onClick={handleAutoFix}
                disabled={isAutonomous}
              >
                 <HeartPulse size={18} className="mr-2" /> {isAutonomous ? "自主治理執行中..." : "啟動全域自主修復"}
              </BrandButton>
           </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
           <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {agents.map(a => (
                   <BrandCard key={a.id} padding="lg" className="glass-panel border-none shadow-premium relative overflow-hidden group">
                      <div className="flex items-start justify-between relative z-10">
                         <div className="flex items-center gap-4">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:rotate-6", a.status === 'busy' ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400")}>
                               <Bot size={28} />
                            </div>
                            <div><h3 className="text-lg font-black text-[#003262] tracking-tight">{a.name}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.role}</p></div>
                         </div>
                         <BrandBadge variant={a.status === 'busy' ? 'warning' : 'outline'} size="xs" dot>{a.status.toUpperCase()}</BrandBadge>
                      </div>
                      <div className="mt-8 space-y-4 relative z-10">
                         <div className="flex justify-between items-end"><span className="text-[9px] font-black text-slate-300 uppercase">Compute_Load</span><span className="text-xs font-mono font-black text-[#003262]">{a.load}%</span></div>
                         <BrandProgress value={a.load} size="xs" color="auto" animated={a.status === 'busy'} />
                         <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-400 italic text-[10px]"><Zap size={10} className="text-[#FDB515]"/> {a.lastAction}</div>
                      </div>
                   </BrandCard>
                 ))}
              </div>

              {/* Live Healing Feed */}
              <section className="space-y-4">
                 <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Autonomous Healing Activity</h4>
                    <BrandBadge variant="gold" size="xs">REAL_TIME</BrandBadge>
                 </div>
                 <div className="space-y-3">
                    {healingLogs.map(log => (
                      <motion.div key={log.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner"><ShieldCheck size={20}/></div>
                            <div>
                               <p className="text-sm font-black text-[#003262]">{log.target_gri} 已修復</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{log.action_taken} • {new Date(log.created_at).toLocaleTimeString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">Self_Healed</span>
                         </div>
                      </motion.div>
                    ))}
                    {healingLogs.length === 0 && (
                      <div className="p-12 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 opacity-50">
                         <Activity size={32} className="mx-auto mb-2 text-slate-300" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">無近期自癒紀錄</p>
                      </div>
                    )}
                 </div>
              </section>
           </div>

            <div className="col-span-12 lg:col-span-4 space-y-8">
               <BrandCard padding="lg" className="bg-gradient-to-br from-[#003262] to-[#1a4a7a] border-none text-white shadow-extreme rounded-[2.5rem] relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                     <h3 className="text-xl font-black uppercase tracking-tight">自主治理效能</h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div><p className="text-[10px] font-black text-blue-300/60 uppercase mb-1">修復成功率</p><p className="text-3xl font-black font-mono">100%</p></div>
                        <div><p className="text-[10px] font-black text-blue-300/60 uppercase mb-1">自主決策數</p><p className="text-3xl font-black font-mono">152</p></div>
                     </div>
                     <div className="pt-6 border-t border-white/10 space-y-3">
                        <p className="text-[10px] font-black text-blue-300/60 uppercase mb-3 tracking-widest">系統健康度</p>
                        <div className="flex items-center gap-3"><HeartPulse size={14} className="text-emerald-400" /><span className="text-xs font-bold">治理脈動穩定：全域鏈路完整</span></div>
                        <div className="pt-3 border-t border-white/5">
                           <p className="text-[9px] font-black text-blue-300/40 uppercase tracking-widest mb-2">Swarm Sync</p>
                           <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-200/70">Active Tasks</span>
                              <span className="text-lg font-black font-mono text-[#FDB515]">{swarmLoading ? '...' : activeTaskCount}</span>
                           </div>
                           <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-blue-200/70">Last Sync</span>
                              <span className="text-[10px] font-mono text-blue-300/60">{lastSync ? new Date(lastSync).toLocaleTimeString() : '—'}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </BrandCard>

               {/* Proposal Evaluator */}
               <BrandCard padding="lg" className="glass-panel border-none shadow-premium rounded-[2.5rem]">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Scale size={16} className="text-purple-600" />
                        <h3 className="text-sm font-black text-[#003262] uppercase tracking-tight">蜂群共識評估</h3>
                     </div>
                     <textarea
                       value={proposalText}
                       onChange={e => setProposalText(e.target.value)}
                       placeholder="輸入 ESG 策略提案，例如：我們應在 2027 年前將範疇一排放減少 30%。"
                       className="w-full h-28 p-4 text-xs bg-slate-50 border border-slate-100 rounded-2xl outline-none resize-none"
                     />
                     <BrandButton
                       variant="primary"
                       className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest"
                       onClick={handleEvaluateProposal}
                        loading={evaluating}
                       disabled={!proposalText.trim() || evaluating}
                     >
                       <ThumbsUp size={14} className="mr-2" /> 啟動蜂群共識
                     </BrandButton>
                  </div>
               </BrandCard>

               {consensusResult && (
                 <ConsensusVisualizer result={consensusResult} />
               )}
            </div>
        </div>

        {/* Global Control Terminal */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 px-2"><h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Swarm_Console</h3><div className="flex-1 h-px bg-slate-100" /></div>
           <BrandCard padding="none" className="bg-slate-900 border-none rounded-[2rem] shadow-extreme overflow-hidden">
              <div className="p-6 bg-slate-800/50 flex items-center justify-between border-b border-white/5"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-amber-500" /><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="ml-4 text-[10px] font-mono text-slate-400">root@omnihermes:~/swarm_v3</span></div><BrandBadge variant="outline" size="xs" className="text-emerald-500 border-emerald-500/30">CONNECTED</BrandBadge></div>
              <div className="p-8 font-mono text-[11px] text-emerald-400/80 leading-relaxed max-h-[300px] overflow-y-auto no-scrollbar">
                 <p>[SYSTEM] Initializing OmniHermes Swarm v3.0.2...</p>
                 <p>[SYSTEM] Autonomous Agency Mode enabled.</p>
                 <p className="text-blue-400">[AGENT] Monitoring system_gaps_summary for self-repair opportunities...</p>
                 <p className="animate-pulse">_</p>
              </div>
           </BrandCard>
        </section>
    </div>
  );
}
