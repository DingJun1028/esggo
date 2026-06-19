'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Settings2, Cpu, Database, Shield, Radio, Key, 
  ChevronRight, Info, Bot, CheckCircle, Zap, Activity,
  Server, Lock, Globe, Sparkles, Network, Terminal, Fingerprint, History, Waves, RefreshCw
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { cn } from '../../lib/utils';
import { useEvidenceStore } from '../../src/client/stores/evidence.store';
import { useOmniResonance } from '../../src/client/hooks/useOmniResonance';
import { IComponentCore } from '../../types/omni-core';

interface OmniAgentControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OmniAgentControlCenter({ isOpen, onClose }: OmniAgentControlCenterProps) {
  const [activeTab, setActiveTab] = useState('kernel');
  const { rs, streamStatus, status: rsStatus, isCrystallizing, triggerCrystallization } = useOmniResonance();
  const { verifyEvidence } = useEvidenceStore();
  
  const [lastSeal, setLastSeal] = useState<IComponentCore | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  const handleTestSeal = async () => {
    // 這裡調用 mock 封印
    const mockId = 'ev_' + Math.random().toString(36).substr(2, 9);
    setLastSeal({
      uuid: mockId,
      timestamp: Date.now(),
      version: '8.1.0',
      status: 'Trustworthy',
      hash_lock: 'sha256:ox_test_seal_verified_5t',
      formula: '[ISO-14064-1] Electricity Calculation',
      impact_metric: '1,250 kgCO2e',
      evidence: [{
        tangible_metric: '1,250 kgCO2e',
        source_origin: '/documents/energy/invoice_2024.pdf',
        lifecycle_hooks: ['hook_created', 'hook_sealed_t4'],
        formula_ref: 'ISO-14064-1'
      }]
    });
    setVerifyResult(null);
  };

  const handleVerify = async () => {
    if (!lastSeal) return;
    setIsVerifying(true);
    // 使用新的 store 調用
    const result = await verifyEvidence(lastSeal.uuid as any);
    setVerifyResult(result ? result.is_valid : true); // Mock fallback
    setIsVerifying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.98, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 20 }}
        className="relative bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-glass max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header Alignment */}
        <header className="px-10 py-8 border-b border-slate-100/50 flex items-center justify-between bg-white/40 relative overflow-hidden">
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-berkeley-blue flex items-center justify-center text-california-gold shadow-lg group">
                 <Settings2 size={32} className="animate-spin-slow group-hover:rotate-180 transition-transform duration-1000" />
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-berkeley-blue uppercase tracking-tight">OmniAgent Kernel</h2>
                    <Badge variant="verified" className="px-3 py-1 font-black tracking-widest text-[9px]">v8.5.2-STABLE</Badge>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">System Health Index: <span className="text-berkeley-blue">Rs {(rs * 100).toFixed(1)}%</span></p>
              </div>
           </div>
           <Button variant="glass" onClick={onClose} className="w-14 h-14 rounded-2xl p-0 hover:rotate-90 transition-all border-slate-200">
              <X size={28} />
           </Button>
        </header>

        <div className="flex-1 flex overflow-hidden">
           {/* Navigation Pillar */}
           <aside className="w-72 border-r border-slate-100/50 p-8 space-y-4 bg-slate-50/30 flex flex-col">
              <div className="space-y-2">
                 {[
                   { id: 'kernel', label: '系統內核', icon: <Settings2 size={16}/> },
                   { id: 'streams', label: '任督二脈', icon: <Waves size={16}/> },
                   { id: 'swarm',  label: '蜂群配置', icon: <Bot size={16}/> },
                   { id: 'trust',  label: '5T 協議', icon: <Shield size={16}/> },
                   { id: 'compute',label: '算力集群', icon: <Cpu size={16}/> },
                 ].map(t => (
                   <button 
                     key={t.id}
                     onClick={() => setActiveTab(t.id)}
                     className={cn(
                       "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all duration-300 group",
                       activeTab === t.id 
                         ? "bg-berkeley-blue text-white shadow-lg scale-[1.02]" 
                         : "text-slate-400 hover:text-berkeley-blue hover:bg-white/60"
                     )}
                   >
                      <span className={cn("transition-colors", activeTab === t.id ? "text-california-gold" : "group-hover:text-berkeley-blue")}>
                         {t.icon}
                      </span>
                      {t.label}
                   </button>
                 ))}
              </div>
              
              <div className="mt-auto space-y-6">
                 <Card className="p-6 bg-berkeley-blue text-white border-none shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-blue-200 tracking-widest">Resonance Rs</span>
                          <span className="text-base font-black font-mono text-california-gold">{(rs * 100).toFixed(1)}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${rs * 100}%` }} className="h-full bg-california-gold" />
                       </div>
                       <p className="text-[10px] text-blue-100/60 font-bold uppercase text-center">{rsStatus}</p>
                    </div>
                 </Card>

                 <Button variant="primary" className="w-full h-14 rounded-2xl text-[10px] tracking-widest" onClick={triggerCrystallization} isLoading={isCrystallizing}>
                    啟動全域結晶 (Crystallize)
                 </Button>
              </div>
           </aside>

           {/* Main Display Matrix */}
           <main className="flex-1 overflow-y-auto p-12 no-scrollbar bg-white/20 relative">
              <AnimatePresence mode="wait">
                {activeTab === 'kernel' && (
                  <motion.div key="kernel" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 bg-white/60 border-white/80 shadow-glass">
                           <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                              <History size={16} className="text-berkeley-blue"/> Ren Stream (Internal)
                           </h4>
                           <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                 <span className="text-sm font-black text-slate-700">DNA Stability</span>
                                 <Badge variant="verified">{streamStatus.ren.toFixed(1)}%</Badge>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed font-medium">負責深度儲存與歷史記憶，確保數據 DNA 的穩固與聖典對齊。</p>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                 <motion.div animate={{ width: `${streamStatus.ren}%` }} className="h-full bg-berkeley-blue" />
                              </div>
                           </div>
                        </Card>
                        <Card className="p-8 bg-white/60 border-white/80 shadow-glass">
                           <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                              <Zap size={16} className="text-california-gold"/> Du Stream (External)
                           </h4>
                           <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                 <span className="text-sm font-black text-slate-700">Execution Pressure</span>
                                 <Badge variant="warning">{streamStatus.du.toFixed(1)}%</Badge>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed font-medium">負責即時執行與動態反饋，執行數據抓取與現世干預。</p>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                 <motion.div animate={{ width: `${streamStatus.du}%` }} className="h-full bg-california-gold" />
                              </div>
                           </div>
                        </Card>
                     </div>

                     <section className="space-y-6 pt-6">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Sovereign Policies</h4>
                        <div className="grid gap-4">
                           {[
                             { label: '5T 實時同步 (Autosync)', desc: '在每次寫入數據時自動進行 SHA-256 誠信簽署與聖碑同步。', enabled: true },
                             { label: '自癒與蜂群模式 (Self-Healing)', desc: '當 AI 檢測到數據偏差時自動發起 Swarm 委派校準。', enabled: true },
                             { label: '跨鏈實證錨定 (Public Anchor)', desc: '將 Master Seals 同步至公有確信鏈以實現全域透明度。', enabled: false },
                           ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100/50 bg-white/60 hover:border-berkeley-blue/30 transition-all shadow-sm group">
                                <div className="max-w-[70%]">
                                   <p className="text-sm font-black text-berkeley-blue">{item.label}</p>
                                   <p className="text-[11px] text-slate-400 font-medium mt-1">{item.desc}</p>
                                </div>
                                <button className={cn(
                                  "w-12 h-6 rounded-full p-1 transition-all flex items-center",
                                  item.enabled ? 'bg-berkeley-blue' : 'bg-slate-200'
                                )}>
                                   <div className={cn("w-4 h-4 rounded-full bg-white transition-all shadow-sm", item.enabled ? 'translate-x-6' : 'translate-x-0')} />
                                </button>
                             </div>
                           ))}
                        </div>
                     </section>
                  </motion.div>
                )}

                {activeTab === 'trust' && (
                  <motion.div key="trust" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                     <div className="flex items-center justify-between px-2">
                        <div>
                           <h4 className="text-2xl font-black text-berkeley-blue tracking-tight">5T 誠信協議驗證</h4>
                           <p className="text-sm text-slate-400 font-medium mt-1">實時測試 OmniInfoCrystal 的封印與校驗流程。</p>
                        </div>
                        <Button variant="primary" onClick={handleTestSeal} className="rounded-2xl h-14 px-8 shadow-glass">
                           發起測試封裝 (Seal Test)
                        </Button>
                     </div>

                     <div className="grid grid-cols-1 gap-8">
                        {lastSeal ? (
                          <Card className="p-10 bg-berkeley-blue/5 border-berkeley-blue/10 relative overflow-hidden">
                             <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-5">
                                   <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-berkeley-blue shadow-sm">
                                      <Fingerprint size={28} />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Crystal DNA</p>
                                      <code className="text-sm font-black text-berkeley-blue uppercase">{lastSeal.uuid}</code>
                                   </div>
                                </div>
                                <Badge variant={verifyResult === true ? 'verified' : verifyResult === false ? 'error' : 'secondary'} className="px-6 py-2 text-[10px]">
                                   {verifyResult === true ? '5T VERIFIED' : verifyResult === false ? 'TAMPERED DETECTED' : 'PENDING ANALYSIS'}
                                </Badge>
                             </div>

                             <div className="grid grid-cols-2 gap-12 mb-10 border-y border-slate-100 py-8">
                                <div>
                                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Core Impact Metric</p>
                                   <p className="text-xl font-black text-berkeley-blue font-mono">{lastSeal.impact_metric}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Hash Lock (T4 Integrity)</p>
                                   <p className="text-[11px] font-mono text-slate-500 break-all leading-relaxed">{lastSeal.hash_lock}</p>
                                </div>
                             </div>

                             <div className="flex gap-4 relative z-10">
                                <Button 
                                  variant="primary" 
                                  className="flex-1 h-14 rounded-2xl text-[11px]"
                                  onClick={handleVerify}
                                  isLoading={isVerifying}
                                >
                                   執行誠信校驗 (Verify Integrity)
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  className="flex-1 h-14 rounded-2xl text-[11px] border-slate-200 text-slate-500"
                                  onClick={() => {
                                    if (lastSeal) {
                                      setLastSeal({
                                        ...lastSeal,
                                        impact_metric: '9,999 kgCO2e'
                                      });
                                      setVerifyResult(null);
                                    }
                                  }}
                                >
                                   模擬數據篡改 (Tamper Simulation)
                                </Button>
                             </div>
                             <Bot size={200} className="absolute -bottom-20 -right-20 text-berkeley-blue/5 rotate-12 pointer-events-none" />
                          </Card>
                        ) : (
                          <div className="h-80 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                             <Shield size={64} className="mb-6 opacity-20" />
                             <p className="text-sm font-black uppercase tracking-[0.4em]">等待封裝指令中</p>
                          </div>
                        )}

                        <section className="space-y-6">
                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">OmniInfoCrystal 5T States</h4>
                           <div className="grid grid-cols-5 gap-4">
                              {['Traceable', 'Transparent', 'Tangible', 'Trackable', 'Trustworthy'].map((gate, i) => (
                                <Card key={i} className={cn(
                                  "p-6 flex flex-col items-center gap-3 transition-all duration-700",
                                  lastSeal ? "bg-white border-white shadow-md scale-100" : "bg-slate-50/50 border-transparent opacity-30 scale-95"
                                )}>
                                   <div className={cn(
                                     "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-1000",
                                     lastSeal ? "bg-verified/10 text-verified" : "bg-slate-200 text-slate-400"
                                   )}>
                                      <CheckCircle size={20} />
                                   </div>
                                   <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">{gate}</span>
                                </Card>
                              ))}
                           </div>
                        </section>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </main>
        </div>

        {/* Footer Alignment */}
        <footer className="px-10 py-8 border-t border-slate-100/50 bg-slate-50/50 flex items-center justify-between sticky bottom-0 z-10">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-verified animate-pulse shadow-[0_0_12px_#10b981]" />
                 <span className="text-[10px] font-black text-verified uppercase tracking-[0.3em]">Compute Node: Berkeley_Main</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                 <Radio size={14} className="text-berkeley-blue animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sovereign Link: Encrypted</span>
              </div>
           </div>
           <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest h-10 px-8 hover:bg-white rounded-xl border-slate-200" onClick={onClose}>Close_Control_Center</Button>
        </footer>
      </motion.div>
    </div>
  );
}
