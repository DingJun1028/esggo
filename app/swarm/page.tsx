'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Cpu, Play, Pause, Activity, CheckSquare, Inbox, Zap, Send, MessageSquare, Shield, RefreshCw, Bot, Code, Terminal, AlertCircle, Users, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandStatusDot, BrandTabs, BrandProgress, BrandTimeline } from '../../components/brand';
import { cn } from '../../lib/utils';

interface SwarmAgent {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'syncing';
  role: string;
  load: number;
  lastAction: string;
}

export default function SwarmPage() {
  const [agents, setAgents] = useState<SwarmAgent[]>([
    { id: 'S1', name: 'Hermes-Alpha', status: 'idle', role: 'Governance Arch', load: 12, lastAction: 'Sealing GRI 305' },
    { id: 'S2', name: 'Hermes-Beta',  status: 'busy', role: 'Data Validator', load: 88, lastAction: 'ZKP Verification' },
    { id: 'S3', name: 'Hermes-Gamma', status: 'busy', role: 'Report Scribe',  load: 65, lastAction: 'Recursive Expansion' },
    { id: 'S4', name: 'Hermes-Delta', status: 'syncing', role: 'Registry Sync', load: 42, lastAction: 'DB Optimization' },
  ]);

  const [loading, setLoading] = useState(false);
  const [isAutonomous, setIsAutonomous] = useState(false);

  const handleAutoFix = async () => {
    setIsAutonomous(true);
    // Simulate Autonomous Governance logic
    await new Promise(r => setTimeout(r, 3000));
    setIsAutonomous(false);
    alert('OmniHermes 已完成全域自主治理：已補全 8 處數據缺角、執行 12 筆批次封印。');
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
                className={cn(
                  "h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all",
                  isAutonomous ? "bg-purple-600 animate-pulse" : "bg-[#003262]"
                )}
                onClick={handleAutoFix}
              >
                 <Cpu size={18} className="mr-2" /> {isAutonomous ? "自主治理執行中..." : "啟動全域自主修復"}
              </BrandButton>
           </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
           {/* Main Swarm View */}
           <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {agents.map(a => (
                   <BrandCard key={a.id} padding="lg" className="glass-panel border-none shadow-premium relative overflow-hidden group">
                      <div className="flex items-start justify-between relative z-10">
                         <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:rotate-6",
                              a.status === 'busy' ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400"
                            )}>
                               <Bot size={28} />
                            </div>
                            <div>
                               <h3 className="text-lg font-black text-[#003262] tracking-tight">{a.name}</h3>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.role}</p>
                            </div>
                         </div>
                         <BrandBadge variant={a.status === 'busy' ? 'warning' : 'outline'} size="xs" dot pulse={a.status === 'busy'}>{a.status.toUpperCase()}</BrandBadge>
                      </div>

                      <div className="mt-8 space-y-4 relative z-10">
                         <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-slate-300 uppercase">Compute_Load</span>
                            <span className="text-xs font-mono font-black text-[#003262]">{a.load}%</span>
                         </div>
                         <BrandProgress value={a.load} size="xs" color="auto" animated={a.status === 'busy'} />
                         <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-400 italic text-[10px]">
                            <Zap size={10} className="text-[#FDB515]"/> {a.lastAction}
                         </div>
                      </div>
                      
                      <div className="absolute -bottom-6 -right-6 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                         <Cpu size={120} />
                      </div>
                   </BrandCard>
                 ))}
              </div>
           </div>

           {/* Performance Sidebar */}
           <div className="col-span-12 lg:col-span-4 space-y-8">
              <BrandCard padding="lg" className="bg-[#003262] border-none text-white shadow-extreme rounded-[2.5rem] relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-tight">蜂群總體效能</h3>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <p className="text-[10px] font-black text-blue-300/60 uppercase mb-1">活躍執行緒</p>
                          <p className="text-3xl font-black font-mono">14 / 32</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-blue-300/60 uppercase mb-1">合規吞吐量</p>
                          <p className="text-3xl font-black font-mono">1.2 GB/s</p>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                       <p className="text-[10px] font-black text-blue-300/60 uppercase mb-3 tracking-widest">系統自癒狀態</p>
                       <div className="flex items-center gap-3">
                          <CheckCircle size={14} className="text-[#FDB515]" />
                          <span className="text-xs font-bold">已自動隔離 2 個離群數據點</span>
                       </div>
                    </div>
                 </div>
                 <Sparkles size={200} className="absolute -top-10 -right-10 opacity-5 rotate-45" />
              </BrandCard>
              
              <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
                 <div className="p-6 border-b border-slate-50">
                    <h4 className="text-xs font-black text-[#003262] uppercase tracking-[0.3em]">蜂群事件日誌</h4>
                 </div>
                 <div className="p-6">
                    <BrandTimeline 
                      items={[
                        { title: 'ZKP 密鑰生成', time: '10:24', status: 'success' },
                        { title: '跨區數據同步', time: '10:15', status: 'success' },
                        { title: '異常偵測：GRI 305', time: '10:02', status: 'error' },
                        { title: '節點 Hermes-Alpha 啟動', time: '09:45', status: 'success' },
                      ]}
                    />
                 </div>
              </BrandCard>
           </div>
        </div>

        {/* Global Control Terminal */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 px-2">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Swarm_Console</h3>
              <div className="flex-1 h-px bg-slate-100" />
           </div>
           <BrandCard padding="none" className="bg-slate-900 border-none rounded-[2rem] shadow-extreme overflow-hidden">
              <div className="p-6 bg-slate-800/50 flex items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-4 text-[10px] font-mono text-slate-400">root@omnihermes:~/swarm_v3</span>
                 </div>
                 <BrandBadge variant="outline" size="xs" className="text-emerald-500 border-emerald-500/30">CONNECTED</BrandBadge>
              </div>
              <div className="p-8 font-mono text-[11px] text-emerald-400/80 leading-relaxed max-h-[300px] overflow-y-auto no-scrollbar">
                 <p>[SYSTEM] Initializing OmniHermes Swarm v3.0.2...</p>
                 <p>[SYSTEM] Mapping all environmental_data to T1 Traceability chain...</p>
                 <p className="text-white font-bold">[AUTH] Active Identity: {localStorage.getItem('omni_user') ? JSON.parse(localStorage.getItem('omni_user')!).email : 'anonymous'}</p>
                 <p className="text-blue-400">[TASK] Found 12 unsealed evidence artifacts in Vault.</p>
                 <p className="text-amber-400">[WARN] GRI 305-1 disclosure gap detected for Fiscal Year 2024.</p>
                 <p>[SYSTEM] All 4 compute nodes are now operational.</p>
                 <p className="animate-pulse">_</p>
              </div>
           </BrandCard>
        </section>
    </div>
  );
}
