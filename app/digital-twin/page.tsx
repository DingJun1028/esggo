'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Fingerprint, Globe, Box, Zap, Activity, ShieldCheck, Layers, Maximize2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DigitalTwinPage() {
  const [activeLayer, setActiveLayer] = useState('Carbon');

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="💎">
              旅程 IV. AI 賦能與撰寫
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Fingerprint className="text-cyan-core" /> 數位分身 Digital Twin
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              企業治理的數位投影。透過 3D 拓樸與實時遙測，預測治理風險並模擬減碳情境。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
              <RotateCcw size={16} /> 重置視角
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
              <Maximize2 size={16} /> 全螢幕模式
            </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UniversalCard title="數據圖層 Layers" variant="bordered">
              <div className="space-y-2">
                {['Carbon', 'Energy', 'Supply Chain', 'Social'].map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeLayer === layer ? 'bg-cyan-core/20 border border-cyan-500/50 text-cyan-400' : 'text-white/40 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Layers size={16} /> {layer}
                    </span>
                    {activeLayer === layer && <div className="w-1.5 h-1.5 rounded-full bg-cyan-core animate-pulse" />}
                  </button>
                ))}
              </div>
            </UniversalCard>

            <UniversalCard title="實時遙測 Telemetry" variant="glass">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/30">CPU Load</span>
                  <span className="text-xs font-mono text-emerald-400">12.4%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div animate={{ width: '12.4%' }} className="h-full bg-emerald-400" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/30">Data Latency</span>
                  <span className="text-xs font-mono text-cyan-400">42ms</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div animate={{ width: '30%' }} className="h-full bg-cyan-core" />
                </div>
              </div>
            </UniversalCard>

            <div className="p-6 bg-cyan-core/5 rounded-[2rem] border border-cyan-500/20">
               <h4 className="text-xs font-black uppercase tracking-widest text-cyan-core mb-2">5T 完整性校驗</h4>
               <div className="flex items-center gap-2 text-emerald-400 mb-4">
                  <ShieldCheck size={16} />
                  <span className="text-sm font-bold uppercase">Verified & Sealed</span>
               </div>
               <p className="text-[10px] text-white/40 leading-relaxed italic">
                  分身所有顯示數據皆與 Evidence Vault 實時掛鉤，具備不可篡改性。
               </p>
            </div>
          </div>

          {/* 3D Visualization Area (Simulated) */}
          <div className="lg:col-span-3 space-y-6">
            <UniversalCard variant="glow" className="aspect-video relative overflow-hidden bg-black/40 border-cyan-500/20 p-0 flex items-center justify-center group">
              <div className="absolute inset-0 cyber-grid opacity-20 group-hover:opacity-30 transition-opacity" />
              
              {/* Simulated 3D Entity */}
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                 {/* Floating Particles */}
                 {[...Array(20)].map((_, i) => (
                   <motion.div
                     key={i}
                     animate={{
                       y: [0, -100, 0],
                       x: [0, (Math.random() - 0.5) * 200, 0],
                       opacity: [0, 0.5, 0],
                       scale: [0, 1, 0]
                     }}
                     transition={{
                       duration: 3 + Math.random() * 5,
                       repeat: Infinity,
                       ease: 'linear'
                     }}
                     className="absolute w-1 h-1 bg-cyan-core rounded-full blur-[1px]"
                     style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                   />
                 ))}

                 {/* Core Orb */}
                 <motion.div 
                   animate={{ 
                     rotate: 360,
                     scale: [1, 1.05, 1]
                   }}
                   transition={{ 
                     rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                     scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                   }}
                   className="absolute inset-0 rounded-full border-2 border-cyan-500/20 flex items-center justify-center"
                 >
                    <div className="w-[80%] h-[80%] rounded-full border border-cyan-500/10 animate-ping" />
                    <div className="absolute w-[60%] h-[60%] bg-gradient-to-br from-cyan-500/20 to-blue-600/30 rounded-full blur-2xl animate-pulse" />
                    <Box size={80} className="text-cyan-core opacity-50 relative z-10" />
                 </motion.div>

                 {/* Orbiting Labels */}
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-0"
                 >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-void-stark/80 border border-cyan-500/50 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <Zap size={10} className="text-amber-400" /> Energy_High
                    </div>
                    <div className="absolute top-1/2 -right-12 -translate-y-1/2 px-3 py-1 bg-void-stark/80 border border-emerald-500/50 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <Activity size={10} className="text-emerald-400" /> Carbon_Stable
                    </div>
                 </motion.div>
              </div>

              {/* UI Overlays */}
              <div className="absolute bottom-6 left-6 flex gap-4">
                 <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                    <p className="text-[10px] font-black text-white/30 uppercase">Enterprise Value</p>
                    <p className="text-lg font-black text-cyan-core">$4.2B</p>
                 </div>
                 <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                    <p className="text-[10px] font-black text-white/30 uppercase">ESG Index</p>
                    <p className="text-lg font-black text-emerald-400">AA+</p>
                 </div>
              </div>

              <div className="absolute top-6 right-6 flex flex-col gap-2">
                 <button className="w-10 h-10 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 transition-colors"><Globe size={18} /></button>
                 <button className="w-10 h-10 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 transition-colors"><RotateCcw size={18} /></button>
              </div>
            </UniversalCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <UniversalCard title="情境模擬 Scenario AI" variant="bordered">
                  <p className="text-sm text-white/60 mb-6 leading-relaxed">
                    如果我們在 2027 年將再生能源佔比提升至 50%，數位分身預測 ESG 評級將晉升至 AAA。
                  </p>
                  <UniversalButton variant="primary" className="w-full">啟動模擬</UniversalButton>
               </UniversalCard>
               <UniversalCard title="異常診斷 Anomaly Detection" variant="bordered">
                  <div className="flex items-center gap-4 text-rose-400 p-4 bg-rose-500/10 rounded-xl border border-rose-500/20 mb-4">
                     <Activity size={24} className="animate-pulse" />
                     <div>
                        <p className="text-xs font-black uppercase">警告：數據波動</p>
                        <p className="text-[11px] font-bold">偵測到 Scope 2 排放異常增長 (15%)</p>
                     </div>
                  </div>
                  <UniversalButton variant="secondary" className="w-full text-xs">追蹤數據源</UniversalButton>
               </UniversalCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
