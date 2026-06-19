import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Share2,
  Zap,
  Link as LinkIcon,
  Plus,
  X,
  Cpu,
  Network,
  Activity,
} from 'lucide-react';
import { useSwarmEngine, SwarmMember } from '../../hooks/useSwarmEngine';
import { useSovereignSession } from '../../hooks/useSovereignSession';
import { useActionExecutor } from '../../hooks/useActionExecutor';
import { OMNI_AGENTS } from '../../data/omni-agents';

import { SwarmStatusWidget } from './widgets/SwarmStatusWidget';

export const SwarmIntelligence: React.FC = () => {
  const { activeSwarm, swarmResonance, addToSwarm, removeFromSwarm, executeSwarmAction } =
    useSwarmEngine();
  const { generateBioID } = useSovereignSession();
  const { runAction } = useActionExecutor();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    await new Promise(r => setTimeout(r, 2500));
    executeSwarmAction(10);

    // If high resonance, trigger a real-world action with joint signatures
    if (swarmResonance > 1.2 && activeSwarm.length >= 2) {
      runAction(
        'ANOMALY_ALERT',
        activeSwarm.map(m => m.bioId)
      );
    }

    setIsExecuting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Swarm Management */}
      <div className="lg:col-span-4 space-y-6">
        <SwarmStatusWidget />
        <div className="bg-black/60 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tighter">
                蜂群組建 (Swarm Formation)
              </h3>
              <p className="text-[10px] text-cyan-500/70 font-mono">NEURAL_SYNC_PROTOCOL_v3</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest px-1">
              Available Agents
            </div>
            <div className="grid grid-cols-1 gap-2">
              {OMNI_AGENTS.map(agent => {
                const bioId = generateBioID(agent);
                const isInSwarm = activeSwarm.find(m => m.agentId === agent.id);
                return (
                  <button
                    key={agent.id}
                    onClick={() =>
                      isInSwarm ? removeFromSwarm(agent.id) : addToSwarm(agent, bioId)
                    }
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isInSwarm
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-bold font-mono">{agent.name}</div>
                      <div className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                        {agent.type}
                      </div>
                    </div>
                    {isInSwarm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-500 uppercase font-black">Sync Threshold</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {(swarmResonance * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(swarmResonance / 3.5) * 100}%` }}
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Col: Neural Web Visualization */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex-1 relative overflow-hidden flex flex-col">
          {/* Visual Interface */}
          <div className="relative flex-1 flex items-center justify-center p-12">
            {/* Center Hub */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <Network className="w-64 h-64 text-cyan-500/40 animate-pulse" />
            </div>

            {/* Swarm Members Orbit */}
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                {activeSwarm.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600 italic text-sm text-center"
                  >
                    <Share2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Awaiting Multi-Agent Initialization
                  </motion.div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {activeSwarm.map((member, idx) => {
                      const angle = (idx / activeSwarm.length) * (2 * Math.PI);
                      const radius = 140;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;

                      return (
                        <motion.div
                          key={member.agentId}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1, x, y }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute w-28 p-3 bg-black/80 border border-cyan-500/40 rounded-xl backdrop-blur-xl shadow-lg shadow-cyan-500/10 z-20 group"
                        >
                          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-[10px] font-black text-white truncate">
                                {member.agentId}
                              </div>
                              <Activity className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                            </div>
                            <div className="text-[8px] text-gray-500 uppercase font-mono mb-2">
                              {member.bioId}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-cyan-400"
                                  style={{ width: `${member.syncLevel * 100}%` }}
                                />
                              </div>
                              <span className="text-[8px] text-cyan-400 font-mono">
                                {(member.syncLevel * 100).toFixed(0)}
                              </span>
                            </div>
                          </div>

                          {/* Connection Line to Center */}
                          <div
                            className="absolute top-1/2 left-1/2 w-[140px] h-[1px] bg-gradient-to-r from-cyan-500/40 to-transparent origin-left -z-10"
                            style={{
                              transform: `rotate(${angle + Math.PI}rad) translateX(-140px)`,
                            }}
                          />
                        </motion.div>
                      );
                    })}

                    {/* Central Node */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                    >
                      <div className="text-center">
                        <div className="text-[14px] font-black text-white leading-tight">
                          {swarmResonance.toFixed(2)}x
                        </div>
                        <div className="text-[7px] text-cyan-400 uppercase font-black">SYNC</div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Execution */}
          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-500" />
                <div className="text-[10px]">
                  <div className="text-gray-500 uppercase font-black">Collective Power</div>
                  <div className="text-white font-mono">
                    {(activeSwarm.length * 400).toLocaleString()} OPS
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                <LinkIcon className="w-4 h-4 text-purple-500" />
                <div className="text-[10px]">
                  <div className="text-gray-500 uppercase font-black">Entropy Buffer</div>
                  <div className="text-purple-400 font-mono">
                    {(swarmResonance * 0.05).toFixed(3)} MIT/SEC
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={activeSwarm.length < 2 || isExecuting}
              className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeSwarm.length < 2 || isExecuting
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/20 border border-cyan-400/30'
              }`}
            >
              {isExecuting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  SYNCHRONIZING...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  EXECUTE SWARM ACTION
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
