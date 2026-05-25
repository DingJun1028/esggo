'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FileText, Search, Database, History, ChevronRight, 
  Maximize2, Shield, Bot, Layout, Info, Sparkles, 
  Zap, MessageSquare, Lock, Hash, ArrowUpRight, CheckCircle,
  Activity, Users, Radar, Cpu, Globe, RefreshCw, Target
} from 'lucide-react';
import { 
  BrandBadge, BrandCard, BrandCardHeader, BrandTabs, 
  BrandStatusDot, BrandButton, BrandProgress 
} from './index';
import { cn } from '../../lib/utils';
import Link from 'next/link';

interface WorkspacePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspacePanel({ isOpen, onClose }: WorkspacePanelProps) {
  const [activeTab, setActiveTab] = useState('swarm');
  const [swarmResonance, setSwarmResonance] = useState(84);

  useEffect(() => {
    const t = setInterval(() => {
      setSwarmResonance(prev => Math.min(100, Math.max(80, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: 'swarm',   label: '蜂群協作', icon: <Bot size={14}/> },
    { id: 'vault',   label: '實證預覽', icon: <Database size={14}/> },
    { id: 'history', label: '治理日誌', icon: <History size={14}/> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-[450px] bg-white border-l border-slate-100 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#003262] flex items-center justify-center text-[#FDB515] shadow-lg">
                   <Radar size={20} className="animate-pulse" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-[#003262] uppercase tracking-widest">Sovereign Workspace</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                      <BrandStatusDot status="active" pulse size="xs" />
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">oX_NODE_SYNCED</p>
                   </div>
                </div>
             </div>
             <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90 border border-slate-100">
                <X size={20} />
             </button>
          </div>

          {/* Tabs */}
          <div className="px-6 py-3 bg-slate-50/30 border-b border-slate-50">
             <BrandTabs 
               activeTab={activeTab} 
               onTabChange={setActiveTab}
               tabs={tabs}
             />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth">
             {activeTab === 'swarm' && (
               <div className="space-y-8 fade-in">
                  {/* Swarm Status Card */}
                  <BrandCard className="bg-[#003262] text-white p-8 rounded-[2.5rem] border-none shadow-2xl relative overflow-hidden">
                     <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">Swarm Resonance</p>
                              <h4 className="text-3xl font-black font-mono">{Math.round(swarmResonance)}%</h4>
                           </div>
                           <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                              <Bot size={24} className="text-[#FDB515]" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase text-blue-100/50">
                              <span>Agents Syncing...</span>
                              <span>Z0 / H1 / P3</span>
                           </div>
                           <BrandProgress value={swarmResonance} color="gold" size="xs" animated />
                        </div>
                        <p className="text-[10px] text-blue-100/60 leading-relaxed font-medium italic">
                          「偵測到您正在編輯『環境績效』章節。Z0-Auditor 已自動載入 ISO 14064-1 實證標記。」
                        </p>
                     </div>
                     <Activity size={180} className="absolute -bottom-10 -right-10 text-white/5 opacity-20" />
                  </BrandCard>

                  {/* Active Agents Feed */}
                  <section className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                        <Users size={12}/> Active Swarm Feed
                     </h4>
                     {[
                       { agent: 'Z0-Auditor', task: '數據一致性校準', status: 'Verifying', icon: <Shield size={14}/>, color: 'text-emerald-500' },
                       { agent: 'H1-Diplomat', task: '標竿案例智庫比對', status: 'Grounding', icon: <Globe size={14}/>, color: 'text-blue-500' },
                       { agent: 'P3-Planner', task: '進化路徑投影', status: 'Idle', icon: <Target size={14}/>, color: 'text-slate-300' },
                     ].map((a, i) => (
                       <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-all shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-[#003262] group-hover:text-white", a.color)}>
                                {a.icon}
                             </div>
                             <div>
                                <p className="text-xs font-black text-slate-800">{a.agent}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{a.task}</p>
                             </div>
                          </div>
                          <BrandBadge variant={a.status === 'Idle' ? 'outline' : 'info'} size="xs" className="px-3">{a.status}</BrandBadge>
                       </div>
                     ))}
                  </section>

                  {/* Quick Command */}
                  <BrandCard padding="md" className="border-dashed border-2 border-slate-100 bg-slate-50/30 flex items-center justify-between group hover:border-blue-400 transition-all cursor-pointer">
                     <div className="flex items-center gap-3">
                        <Sparkles size={16} className="text-blue-600 animate-pulse" />
                        <span className="text-[10px] font-black text-[#003262] uppercase tracking-widest">召喚全域共識 (Alt + G)</span>
                     </div>
                     <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-all" />
                  </BrandCard>
               </div>
             )}

             {activeTab === 'vault' && (
               <div className="space-y-6 fade-in">
                  <div className="p-6 rounded-[2.5rem] bg-emerald-50 border border-emerald-100">
                     <div className="flex items-center gap-3 mb-3">
                        <Lock size={16} className="text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Proof Anchor</span>
                     </div>
                     <p className="text-xs text-emerald-800/80 leading-relaxed font-medium italic">
                        「當前 Workspace 已與萬能聖碑同步。所有展示的預覽均帶有 Master Seal 驗簽。」
                     </p>
                  </div>
                  
                  <section className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">5T Sealed Artifacts</h4>
                     {[
                       { name: 'GRI_305_GHG_Scan.json', hash: 'sha256:ox_alc_8812', type: 'ALCHEMY_RESULT' },
                       { name: 'Sovereign_Strategy_v1.pdf', hash: 'sha256:ox_strat_442', type: 'VAULT_PROOF' }
                     ].map((file, i) => (
                       <BrandCard key={i} padding="md" className="border-none shadow-sm hover:shadow-premium transition-all group cursor-pointer relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
                          <div className="flex items-center justify-between relative z-10">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                                   <Hash size={18} />
                                </div>
                                <div>
                                   <p className="text-xs font-black text-slate-700">{file.name}</p>
                                   <code className="text-[9px] text-slate-400 font-mono">{file.hash}</code>
                                </div>
                             </div>
                             <BrandBadge variant="outline" size="xs" className="scale-75 origin-right">{file.type}</BrandBadge>
                          </div>
                       </BrandCard>
                     ))}
                  </section>

                  <BrandButton variant="ghost" fullWidth size="sm" className="rounded-2xl border-slate-100 text-slate-400 h-14">
                    進入萬能聖碑管理 <ArrowUpRight size={14} className="ml-2"/>

                  </BrandButton>
               </div>
             )}

             {activeTab === 'history' && (
               <div className="space-y-4 fade-in">
                  <div className="flex items-center justify-between px-2 mb-4">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Autonomous Traces</h4>
                    <BrandBadge variant="success" size="xs" dot>Live_Sovereignty</BrandBadge>
                  </div>
                  {[
                    { time: '16:45:22', msg: 'Z0-Auditor detected GHG deviation > 5%', status: 'Warning', detail: 'Triggering Swarm Handoff' },
                    { time: '16:45:01', msg: 'Vault_Omni synchronizing with Alchemy...', status: 'Syncing' },
                    { time: '16:42:12', msg: 'Strategy_Lab proposal [OX-3] accepted.', status: 'Sealed' },
                    { time: '16:40:00', msg: 'Sovereign Workspace initialized.', status: 'Ready' }
                  ].map((trace, i) => (
                    <div key={i} className={cn(
                      "flex gap-5 p-5 rounded-[2rem] border transition-all",
                      trace.status === 'Warning' ? 'bg-red-50 border-red-100' : 
                      trace.status === 'Sealed' ? 'bg-blue-50 border-blue-100' : 'bg-slate-50/30 border-slate-50'
                    )}>
                       <span className="text-[10px] font-black font-mono text-slate-300 w-14 shrink-0">{trace.time}</span>
                       <div className="flex-1 space-y-2">
                          <p className="text-[11px] font-black text-slate-700">{trace.msg}</p>
                          {trace.detail && (
                            <div className="p-2.5 bg-white/80 rounded-xl border border-slate-100 text-[9px] font-bold text-slate-400 uppercase flex items-center gap-2">
                               <RefreshCw size={10} className="animate-spin" /> {trace.detail}
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                             <span className={cn(
                               "text-[8px] font-black uppercase tracking-widest",
                               trace.status === 'Warning' ? 'text-red-500' : 'text-blue-500'
                             )}>{trace.status}</span>
                             <CheckCircle size={10} className="text-emerald-500" />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>

          {/* Footer Action */}
          <div className="p-8 border-t border-slate-100 bg-white/80 backdrop-blur-md sticky bottom-0 z-10">
             <BrandButton variant="primary" fullWidth className="h-14 rounded-2xl font-black shadow-xl shadow-blue-500/10 text-xs tracking-widest">
                <Cpu size={16} className="mr-2" /> 啟動全域協作模式
             </BrandButton>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
