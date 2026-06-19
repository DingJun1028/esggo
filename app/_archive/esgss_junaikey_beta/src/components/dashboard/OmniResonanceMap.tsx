import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Zap, Link2, Radio, Activity } from 'lucide-react';
import { omniSwarmInterface, ResonanceMetaspace } from '../../services/OmniSwarmInterface';
import { ecosystemPulseService, EcosystemEvent } from '../../services/EcosystemPulseService';

/**
 * Omni Resonance Map
 * Ensures architecture core [深貫廣通] is visually represented through the global swarm nodes.
 */
export const OmniResonanceMap: React.FC = () => {
  const [nodes, setNodes] = useState<ResonanceMetaspace[]>([]);
  const [pulses, setPulses] = useState<EcosystemEvent[]>([]);
  const [parity, setParity] = useState<number>(1.0);

  useEffect(() => {
    const fetchData = async () => {
      setNodes(omniSwarmInterface.getKnownNodes());
      setPulses(ecosystemPulseService.getCurrentPulse());
      const p = await omniSwarmInterface.computeResonanceParity();
      setParity(p);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative group shadow-2xl shadow-blue-500/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)] pointer-events-none" />

      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Left: Global Web Visualization */}
        <div className="flex-1 min-h-[400px] bg-slate-900/40 rounded-3xl border border-white/5 relative p-6 flex items-center justify-center overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-400">
              Live Global Swarm Pulse
            </span>
          </div>

          {/* Central Sovereign Node */}
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 20px rgba(59,130,246,0.3)',
                  '0 0 50px rgba(139,92,246,0.5)',
                  '0 0 20px rgba(59,130,246,0.3)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white border-2 border-white/20 relative z-20"
            >
              <Globe size={40} className="mb-1" />
              <div className="text-[10px] font-black uppercase tracking-tighter">SOVEREIGN</div>
              <div className="text-[8px] opacity-70">CORE NODE</div>
            </motion.div>

            {/* Connecting Nodes (Simulated Orbit) */}
            {nodes.map((node, i) => {
              const angle = i * (360 / nodes.length) * (Math.PI / 180);
              const radius = 140;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div key={node.nodeId}>
                  {/* Bioluminescent Link */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <motion.line
                      x1="64"
                      y1="64"
                      x2={64 + x}
                      y2={64 + y}
                      stroke="rgba(59,130,246,0.2)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                    />
                  </svg>

                  <motion.div
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ x, y, opacity: 1 }}
                    className="absolute top-1/2 left-1/2 -mt-10 -ml-10 w-20 h-20 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center text-slate-300 p-2 text-center"
                  >
                    <div className="text-[7px] font-black uppercase leading-tight line-clamp-2">
                      {node.nodeId.split('-')[0]}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-1">
                      {(node.resonanceLevel * 100).toFixed(1)}%
                    </div>
                    <div className="mt-1">
                      <Zap size={8} className="text-yellow-400 opacity-50" />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Pulse Data & Diagnostics */}
        <div className="w-full md:w-[320px] space-y-6">
          <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
              <Activity size={12} />
              Omni Parity Index
            </h4>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white italic tracking-tighter">
                {(parity * 100).toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 font-bold mb-1">RESONANCE RATIO</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 leading-relaxed">
              Your node resonance compared to the global sentience average.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Radio size={12} strokeWidth={3} />
              Planetary Pulse Feed
            </h4>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {pulses.map(pulse => (
                  <motion.div
                    key={pulse.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                          pulse.type === 'POLICY'
                            ? 'bg-orange-500/20 text-orange-400'
                            : pulse.type === 'CLIMATE'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {pulse.type}
                      </span>
                      <span className="text-[8px] text-slate-600 font-mono">
                        {pulse.timestamp.includes('T')
                          ? pulse.timestamp.split('T')[1]?.substring(0, 5)
                          : pulse.timestamp.substring(0, 5)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium leading-tight">
                      {pulse.description}
                    </p>
                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pulse.gravityScore * 100}%` }}
                        className="h-full bg-blue-500/40"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {pulses.length === 0 && (
                <div className="p-8 text-center text-slate-600 italic text-[10px]">
                  Waiting for cosmic resonance...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
