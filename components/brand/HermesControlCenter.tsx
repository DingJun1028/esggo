'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Settings2, Cpu, Database, Shield, Radio, Key, 
  ChevronRight, Info, Bot, CheckCircle, Zap, Activity,
  Server, Lock, Globe, Sparkles, Network, Terminal, Fingerprint
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTabs, 
  BrandProgress, BrandStatusDot 
} from './index';
import { cn } from '../../lib/utils';
import { omniApiClient } from '../../lib/api-client';
import { IComponentCore } from '../../types/omni-core';

interface HermesControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HermesControlCenter({ isOpen, onClose }: HermesControlCenterProps) {
  const [activeTab, setActiveTab] = useState('kernel');
  const [systemLoad, setSystemLoad] = useState(1.42);
  const [lastSeal, setLastSeal] = useState<IComponentCore | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

  const handleTestSeal = async () => {
    try {
      const res = await omniApiClient.seal({
        metric: '1,250 kgCO2e',
        source: '/documents/energy/invoice_2024_05.pdf',
        formula: 'Electricity * 0.509 [EF_2024_TW]',
      });
      if (res.status === 'sealed' && res.component) {
        setLastSeal(res.component);
        setVerifyResult(null);
      }
    } catch (e) {
      console.error('Seal test failed', e);
    }
  };

  const handleVerify = async () => {
    if (!lastSeal) return;
    setIsVerifying(true);
    try {
      const res = await omniApiClient.verify({ component: lastSeal });
      setVerifyResult(res.data?.isValid || false);
    } catch (e) {
      setVerifyResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const t = setInterval(() => {
      setSystemLoad(prev => Math.max(1.0, Math.min(2.5, prev + (Math.random() * 0.2 - 0.1))));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: 'kernel', label: '系統內核', icon: <Settings2 size={14}/> },
    { id: 'swarm',  label: '蜂群配置', icon: <Bot size={14}/> },
    { id: 'trust',  label: '5T 協議', icon: <Shield size={14}/> },
    { id: 'compute',label: '算力集群', icon: <Cpu size={14}/> },
    { id: 'keys',   label: '金鑰管理', icon: <Key size={14}/> },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <header className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-full bg-blue-500/5 blur-[80px] -z-10" />
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#003262] flex items-center justify-center text-[#FDB515] shadow-2xl shadow-blue-900/20">
                 <Settings2 size={28} className="animate-spin-slow" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-[#003262] uppercase tracking-tight">Hermes Control Center</h2>
                 <div className="flex items-center gap-2 mt-0.5">
                    <BrandStatusDot status="active" pulse size="xs" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">OmniHermes Kernel v8.5.2-STABLE</p>
                 </div>
              </div>
           </div>
           <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90 border border-slate-100">
              <X size={24} />
           </button>
        </header>

        {/* Tab Sidebar + Content */}
        <div className="flex-1 flex overflow-hidden">
           <aside className="w-64 border-r border-slate-50 p-8 space-y-3 bg-slate-50/30">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4 ml-2">Kernel Modules</p>
              {tabs.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black transition-all duration-300 group",
                    activeTab === t.id 
                      ? "bg-[#003262] text-white shadow-2xl scale-[1.02]" 
                      : "text-slate-400 hover:text-[#003262] hover:bg-white/50"
                  )}
                >
                   <span className={cn("transition-colors", activeTab === t.id ? "text-[#FDB515]" : "group-hover:text-blue-500")}>
                      {t.icon}
                   </span>
                   {t.label}
                   {activeTab === t.id && <ChevronRight size={14} className="ml-auto text-white/30" />}
                </button>
              ))}
              
              <div className="mt-auto pt-8 border-t border-slate-100">
                 <BrandCard padding="sm" className="bg-slate-900 text-white border-none">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-black uppercase text-blue-300">System Load</span>
                       <span className="text-[10px] font-mono">{systemLoad.toFixed(2)}</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                       <motion.div animate={{ width: `${(systemLoad / 3) * 100}%` }} className="h-full bg-blue-500" />
                    </div>
                 </BrandCard>
              </div>
           </aside>

           <main className="flex-1 overflow-y-auto p-12 no-scrollbar bg-white relative">
              <AnimatePresence mode="wait">
                {activeTab === 'kernel' && (
                  <motion.div key="kernel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                     <section>
                        <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                           <Activity size={14}/> Core System Logic
                        </h4>
                        <div className="grid gap-6">
                           {[
                             { label: '5T 實時同步 (Autosync)', desc: '在每次寫入數據時自動進行 SHA-256 誠信簽署與聖碑同步。', enabled: true },
                             { label: '自癒與蜂群模式 (Self-Healing)', desc: '當 AI 檢測到數據偏差或幻覺時自動發起 Swarm 委派校準。', enabled: true },
                             { label: '跨鏈實證錨定 (Public Anchor)', desc: '將 Master Seals 同步至公有確信鏈以實現全域透明度。', enabled: false },
                           ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-premium transition-all group">
                                <div className="max-w-[70%]">
                                   <p className="text-base font-black text-[#003262]">{item.label}</p>
                                   <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">{item.desc}</p>
                                </div>
                                <button className={cn(
                                  "w-14 h-7 rounded-full p-1 transition-all flex items-center",
                                  item.enabled ? 'bg-[#003262]' : 'bg-slate-200'
                                )}>
                                   <div className={cn("w-5 h-5 rounded-full bg-white transition-all shadow-sm", item.enabled ? 'translate-x-7' : 'translate-x-0')} />
                                </button>
                             </div>
                           ))}
                        </div>
                     </section>
                  </motion.div>
                )}

                {activeTab === 'compute' && (
                  <motion.div key="compute" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                     <div className="grid grid-cols-2 gap-8">
                        <BrandCard padding="lg" className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                           <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">BlueCC H100 Cluster</p>
                           <p className="text-4xl font-black font-mono">68<span className="text-sm ml-1 opacity-40">%</span></p>
                           <p className="text-[9px] font-bold text-blue-100/40 uppercase mt-4">Active Compute Load</p>
                           <Server size={100} className="absolute -bottom-6 -right-6 text-white/5 rotate-12" />
                        </BrandCard>
                        <BrandCard padding="lg" className="bg-white border-slate-100 shadow-premium">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Latency (Internal)</p>
                           <p className="text-4xl font-black text-[#003262] font-mono">142<span className="text-sm ml-1 text-slate-400">ms</span></p>
                           <div className="mt-4 flex gap-1">
                              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-4 w-1.5 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i*0.1}s` }} />)}
                           </div>
                        </BrandCard>
                     </div>
                     <section className="space-y-4">
                        <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">Active Node Traces</h4>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-4 font-mono">
                           {[
                             '[System] Handshake with node_us_west_01: SUCCESS',
                             '[BlueCC] VRAM allocation: 42.1 GB / 80 GB',
                             '[oX] Consensus latency: 18ms',
                           ].map((log, i) => (
                             <p key={i} className="text-[10px] text-slate-500 border-l-2 border-blue-500 pl-4">{log}</p>
                           ))}
                        </div>
                     </section>
                  </motion.div>
                )}

                {activeTab === 'keys' && (
                  <motion.div key="keys" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                     <div className="p-8 bg-amber-50 border border-amber-100 rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                           <Lock size={28} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-amber-900 uppercase">主權金鑰管理</p>
                           <p className="text-xs text-amber-700/60 font-medium">所有的 5T 封印均使用以下企業主權金鑰進行加密簽署。</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        {[
                          { label: 'Master Private Key', value: '••••••••••••••••', lastUsed: '10 分鐘前' },
                          { label: 'Genkit API Access', value: 'sk-genkit-ox-••••', lastUsed: '持續活躍' },
                        ].map((key, i) => (
                          <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-blue-300 transition-all">
                             <div>
                                <p className="text-[10px] font-black text-slate-300 uppercase mb-1">{key.label}</p>
                                <code className="text-xs font-black text-[#003262]">{key.value}</code>
                             </div>
                             <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase">最後調用</p>
                                <p className="text-[10px] font-bold text-slate-500">{key.lastUsed}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                     <BrandButton variant="outline" fullWidth className="h-14 rounded-2xl border-slate-200 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                        旋轉主權金鑰 (Rotate Keys)
                     </BrandButton>
                  </motion.div>
                )}

                {activeTab === 'swarm' && (
                  <motion.div key="swarm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                     <div className="grid grid-cols-3 gap-6">
                        {[
                          { role: 'Compliance', count: 4, icon: <Shield size={20}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
                          { role: 'Research', count: 12, icon: <Globe size={20}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                          { role: 'Governance', count: 3, icon: <Database size={20}/>, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((s, i) => (
                          <BrandCard key={i} padding="md" className="flex flex-col items-center text-center">
                             <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3", s.bg, s.color)}>
                                {s.icon}
                             </div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.role}</p>
                             <p className="text-2xl font-black text-[#003262]">{s.count}</p>
                          </BrandCard>
                        ))}
                     </div>

                     <section className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                           <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Active Swarm Agents</h4>
                           <BrandBadge variant="outline" size="xs">Auto-Scaling Enabled</BrandBadge>
                        </div>
                        <div className="space-y-3">
                           {[
                             { name: 'Agent-X1', role: 'Environmental Auditor', status: 'processing', progress: 68 },
                             { name: 'Hermes-V3', role: 'Supply Chain Scanner', status: 'active', progress: 100 },
                             { name: 'Omni-Z', role: 'Memory Consolidator', status: 'idle', progress: 0 },
                           ].map((agent, i) => (
                             <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center gap-6 hover:shadow-premium transition-all">
                                <BrandStatusDot status={agent.status as any} pulse={agent.status === 'processing'} />
                                <div className="flex-1">
                                   <div className="flex justify-between items-center mb-2">
                                      <p className="text-sm font-black text-[#003262]">{agent.name}</p>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase">{agent.role}</span>
                                   </div>
                                   <BrandProgress value={agent.progress} size="xs" color={agent.status === 'processing' ? 'blue' : 'green'} />
                                </div>
                             </div>
                           ))}
                        </div>
                     </section>
                  </motion.div>
                )}

                {activeTab === 'trust' && (
                  <motion.div key="trust" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="text-xl font-black text-[#003262]">5T 誠信協議實體驗證</h4>
                           <p className="text-xs text-slate-400 font-medium mt-1">即時測試數據封裝 (Seal) 與誠信校驗 (Verify) 流程。</p>
                        </div>
                        <BrandButton onClick={handleTestSeal} className="rounded-2xl h-12 px-8">
                           發起測試封裝 (Seal Test)
                        </BrandButton>
                     </div>

                     <div className="grid grid-cols-1 gap-6">
                        {lastSeal ? (
                          <BrandCard padding="lg" className="border-blue-100 bg-blue-50/20">
                             <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                      <Fingerprint size={20} />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase">Latest Master Seal</p>
                                      <code className="text-xs font-black text-blue-900">{lastSeal.uuid}</code>
                                   </div>
                                </div>
                                <BrandBadge variant={verifyResult === true ? 'success' : verifyResult === false ? 'error' : 'outline'}>
                                   {verifyResult === true ? 'VERIFIED' : verifyResult === false ? 'FAILED' : 'PENDING'}
                                </BrandBadge>
                             </div>

                             <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                   <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Evidence Metric</p>
                                   <p className="text-sm font-bold text-[#003262]">{lastSeal.evidence.tangible_metric}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Hash Lock (T4)</p>
                                   <p className="text-[10px] font-mono text-slate-500 break-all">{lastSeal.hash_lock}</p>
                                </div>
                             </div>

                             <div className="flex gap-4">
                                <BrandButton 
                                  variant="primary" 
                                  fullWidth 
                                  className="h-12 rounded-xl"
                                  onClick={handleVerify}
                                  loading={isVerifying}
                                >
                                   進行誠信校驗 (Run Verification)
                                </BrandButton>
                                <BrandButton 
                                  variant="outline" 
                                  fullWidth 
                                  className="h-12 rounded-xl"
                                  onClick={() => {
                                    // Simulate tampering
                                    if (lastSeal) {
                                      setLastSeal({
                                        ...lastSeal,
                                        evidence: { ...lastSeal.evidence, tangible_metric: '9,999 kgCO2e' }
                                      });
                                      setVerifyResult(null);
                                    }
                                  }}
                                >
                                   模擬數據篡改 (Tamper)
                                </BrandButton>
                             </div>
                          </BrandCard>
                        ) : (
                          <div className="h-64 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                             <Shield size={48} className="mb-4 opacity-20" />
                             <p className="text-sm font-bold uppercase tracking-widest">尚無進行中的封裝測試</p>
                          </div>
                        )}

                        <section className="space-y-4">
                           <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">5T Logic Gate Status</h4>
                           <div className="grid grid-cols-5 gap-4">
                              {['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'].map((gate, i) => (
                                <div key={i} className={cn(
                                  "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
                                  lastSeal ? "bg-white border-slate-100 shadow-sm" : "bg-slate-50 border-transparent opacity-40"
                                )}>
                                   <div className={cn(
                                     "w-8 h-8 rounded-lg flex items-center justify-center",
                                     lastSeal ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                                   )}>
                                      <CheckCircle size={16} />
                                   </div>
                                   <span className="text-[9px] font-black uppercase tracking-tighter">{gate}</span>
                                </div>
                              ))}
                           </div>
                        </section>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </main>
        </div>

        {/* Footer */}
        <footer className="px-10 py-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between sticky bottom-0 z-10">
           <div className="flex items-center gap-6">
              <BrandBadge variant="outline" size="xs" className="border-slate-200 text-slate-400 font-black px-6 h-10 flex items-center rounded-full uppercase tracking-tighter">OS_STABLE_V8.5</BrandBadge>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Compute Node: Berkeley_Main</span>
              </div>
           </div>
           <BrandButton variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest h-10 px-8 hover:bg-white rounded-xl" onClick={onClose}>Close_Control_Center</BrandButton>
        </footer>
      </motion.div>
    </div>
  );
}
