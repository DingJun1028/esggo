import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Zap,
  AlertTriangle,
  ShieldAlert,
  Target,
  Wind,
  TrendingUp,
  Clock,
  Activity,
  Cpu,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useWorldEvents } from '../../hooks/useWorldEvents';
import { Badge, Button } from '@/components/ui';
import { neuralGridService, NeuralNode, GridState } from '../../services/NeuralGridService';
import {
  consciousnessSynthesisEngine,
  UnifiedRealityState,
} from '../../services/ConsciousnessSynthesisEngine';

export const WorldNexus: React.FC = () => {
  const { events, globalModifiers, forceTriggerEvent, resolveEvent } = useWorldEvents();
  const [gridData, setGridData] = useState<{ state: GridState; nodes: NeuralNode[] }>(
    neuralGridService.getGridData()
  );
  const [urs, setUrs] = useState<UnifiedRealityState>(consciousnessSynthesisEngine.getURS());

  useEffect(() => {
    const unsubGrid = neuralGridService.subscribe((state, nodes) => {
      setGridData({ state, nodes });
    });
    const unsubUrs = consciousnessSynthesisEngine.subscribe(state => {
      setUrs(state);
    });
    return () => {
      unsubGrid();
      unsubUrs();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Global Pulse & Neural Grid */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-black/80 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-xl h-auto min-h-[650px] flex flex-col relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Globe
                  className={`w-8 h-8 text-blue-400 ${urs.perceptionLevel === 'TRANSCENDENT' ? 'animate-[spin_3s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                  萬象聯結 (World Event Nexus)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-400/70 font-mono tracking-widest uppercase">
                    GRID_COHERENCE: {(gridData.state.coherence * 100).toFixed(1)}%
                  </span>
                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${gridData.state.coherence * 100}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-none uppercase text-[9px] font-black">
                {gridData.state.resonanceMode} RESONANCE
              </Badge>
              <Button
                variant="ghost"
                onClick={forceTriggerEvent}
                className="bg-white/5 border border-white/10 text-xs font-bold uppercase hover:bg-blue-500/10 hover:text-blue-400"
              >
                Sync Pulse
              </Button>
            </div>
          </div>

          {/* Neural Node Heatmap Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {gridData.nodes.map(node => (
              <motion.div
                key={node.id}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
                onClick={() => neuralGridService.triggerResonance(node.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-2 h-2 rounded-full ${node.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`}
                  />
                  <span className="text-[9px] font-mono text-gray-500">{node.latency}ms</span>
                </div>
                <h4 className="text-[10px] font-black text-white truncate uppercase">
                  {node.location}
                </h4>
                <div className="mt-2 text-[14px] font-mono text-blue-400 font-bold">
                  {node.frequency}Hz
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-500/20 min-h-[300px]">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
              ACTIVE_GLOBAL_STIMULI
            </h4>
            <AnimatePresence mode="popLayout">
              {events.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-gray-700 opacity-50"
                >
                  <Wind className="w-16 h-16 mb-4 animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-widest italic">
                    The global nexus is currently in stasis...
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {events.map(ev => (
                    <motion.div
                      key={ev.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className={`p-6 rounded-3xl border transition-all ${ev.severity === 'CRITICAL'
                          ? 'bg-red-500/5 border-red-500/30'
                          : 'bg-white/5 border-white/10'
                        } relative overflow-hidden group`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div
                            className={`p-3 rounded-xl ${ev.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}
                          >
                            {ev.category === 'ENVIRONMENTAL' ? (
                              <Wind />
                            ) : ev.category === 'SOCIAL' ? (
                              <Zap />
                            ) : (
                              <ShieldAlert />
                            )}
                          </div>
                          <div>
                            <h4 className="font-black text-white uppercase tracking-tight">
                              {ev.title}
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-1 max-w-md">
                              {ev.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`${ev.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'} border-none uppercase text-[9px] font-black`}
                          >
                            {ev.severity}
                          </Badge>
                          <div className="flex items-center gap-1 mt-2 text-[9px] text-gray-600 font-mono">
                            <Clock size={10} />
                            <span>
                              {Math.max(
                                0,
                                Math.floor((ev.startTime + ev.duration - Date.now()) / 1000 / 60)
                              )}
                              m left
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mb-4">
                        {Object.entries(ev.modifiers).map(([key, val]) => (
                          <div
                            key={key}
                            className="px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[10px] font-black uppercase text-blue-400/80 flex items-center gap-2"
                          >
                            <TrendingUp size={10} />
                            {key}: {val > 0 ? `+${val}` : val}
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => resolveEvent(ev.id)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl"
                      >
                        Deploy Tactical Intervention
                      </Button>

                      {/* Severity Pulse */}
                      {ev.severity === 'CRITICAL' && (
                        <div className="absolute inset-0 border-2 border-red-500/20 animate-pulse pointer-events-none rounded-3xl" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Heatmap Decorative */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
        </div>
      </div>

      {/* Right Col: Consciousness Synthesis */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-black/90 border border-white/5 rounded-2xl p-6 backdrop-blur-3xl relative overflow-hidden">
          {/* URS Animation Overlay */}
          <div
            className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent ${urs.perceptionLevel === 'TRANSCENDENT' ? 'opacity-100 animate-pulse' : 'opacity-20'}`}
          />

          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            意識合成 (Consciousness Synthesis)
          </h3>

          <div className="mb-8 flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase mb-1">
                Perception Level
              </p>
              <h4
                className={`text-xl font-black italic tracking-tighter ${urs.perceptionLevel === 'TRANSCENDENT' ? 'text-purple-400' : 'text-blue-400'}`}
              >
                {urs.perceptionLevel}
              </h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Integrity</p>
              <h4 className="text-xl font-black text-emerald-400">
                {(urs.ethicalIntegrity * 100).toFixed(1)}%
              </h4>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black uppercase text-gray-500 flex items-center gap-2">
                  <Cpu size={12} className="text-blue-400" />
                  Global Resonance
                </span>
                <span className="text-[10px] font-mono text-blue-400 font-bold">
                  {(urs.globalResonance * 100).toPrecision(3)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${urs.globalResonance * 100}%` }}
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black uppercase text-gray-500 flex items-center gap-2">
                  <Share2 size={12} className="text-purple-400" />
                  Harmonic Stability
                </span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">
                  {(urs.harmonicStability * 100).toPrecision(3)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${urs.harmonicStability * 100}%` }}
                  className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Target size={12} />
              Transcendent Insights
            </h5>
            {urs.activeInsights.map((insight, idx) => {
              const isSentient = insight.includes('[SENTIENT_CORE]');
              const cleanInsight = insight.replace('[SENTIENT_CORE]', '').trim();

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl border transition-all duration-500 ${isSentient
                      ? 'bg-amber-500/10 border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.2)] text-amber-100'
                      : 'bg-white/[0.02] border-white/5 text-blue-300/80'
                    } text-[10px] leading-relaxed italic relative overflow-hidden group`}
                >
                  {isSentient && (
                    <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <Sparkles size={12} className="text-amber-400 animate-pulse" />
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    {isSentient && (
                      <span className="bg-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm not-italic tracking-tighter shrink-0">
                        SENTIENT
                      </span>
                    )}
                    <span>{cleanInsight}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
              <p className="text-[9px] text-yellow-400/80 font-bold leading-relaxed uppercase">
                Reality state synthesis requires at least 0.7 coherence across major neural nodes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <Target className="w-12 h-12 text-white/5 absolute -bottom-2 -right-2 rotate-12" />
          <h4 className="text-xs font-black text-white uppercase mb-2">Synthesis Efficiency</h4>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-blue-400">98.2%</span>
            <div className="mb-1">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-black uppercase">
                Optimized
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
