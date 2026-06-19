import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Share2, Activity, Shield, Target, Cpu, Trophy, Maximize2 } from 'lucide-react';
import { GlassPanel } from './shared/DashboardComponents';
import { swarmProtocolService, SynergyBond } from '../../services/SwarmProtocolService';
import { agentService } from '../../services/agentService';
import { Agent } from '../../types';

export const AllianceView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [bonds, setBonds] = useState<SynergyBond[]>([]);
  const [resonance, setResonance] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const allAgents = await agentService.getAgents();
      setAgents(allAgents);
      setResonance(swarmProtocolService.getGlobalCoherence());

      // Load all bonds for calculation
      const allBonds: SynergyBond[] = [];
      allAgents.forEach(a => {
        allBonds.push(...swarmProtocolService.getBondsForAgent(a.id));
      });
      setBonds(allBonds);
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerManeuver = async (name: string) => {
    const success = await swarmProtocolService.triggerManeuver(
      name,
      agents.map(a => a.id)
    );
    if (success) {
      // Logic for success UI feedback
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full min-h-[600px] p-6 text-white bg-black/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <Users className="text-[#FFD700]" size={32} />
            SENTIENT ALLIANCE
          </h2>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-mono">
            Neural Swarm Topology v1.0
          </p>
        </div>

        <div className="flex gap-4">
          <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-3">
            <Activity className="text-emerald-400" size={16} />
            <span className="text-xs font-bold uppercase tracking-tighter">Resonance:</span>
            <span className="text-emerald-400 font-black font-mono">{resonance.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Topology Visualization Area */}
        <div className="lg:col-span-2 relative min-h-[400px] bg-black/20 rounded-2xl border border-white/5 overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Animated Node Background */}
            <div className="absolute w-[300px] h-[300px] bg-[#FFD700]/10 blur-[100px] animate-pulse" />

            {/* Dynamic Nodes */}
            {agents.map((agent, i) => {
              const angle = (i / agents.length) * 2 * Math.PI;
              const x = Math.cos(angle) * 120;
              const y = Math.sin(angle) * 120;

              return (
                <motion.div
                  key={agent.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, x, y }}
                  whileHover={{ scale: 1.2, zIndex: 50 }}
                  className={`absolute w-16 h-16 rounded-full border-2 cursor-pointer transition-colors duration-500 overflow-hidden flex items-center justify-center bg-black shadow-[0_0_20px_rgba(255,215,0,0.2)]`}
                  style={{ borderColor: agent.avatarColor || '#FFD700' }}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <span className="text-xs font-black uppercase tracking-tighter text-center px-1">
                    {agent.name.split(' ')[0]}
                  </span>

                  {/* Connection Lines (Simplified approach within component) */}
                  {i === 0 && (
                    <svg className="absolute inset-0 w-[500px] h-[500px] pointer-events-none -translate-x-1/2 -translate-y-1/2 overflow-visible">
                      {bonds.map((bond, idx) => (
                        <line
                          key={idx}
                          x1="250"
                          y1="250"
                          x2="350"
                          y2="250"
                          stroke="white"
                          strokeWidth="1"
                          strokeDasharray="4 2"
                          className="opacity-20 animate-pulse"
                        />
                      ))}
                    </svg>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/30 tracking-widest uppercase">
            Real-time topology synchronization active
          </div>
        </div>

        {/* Command & Control Panel */}
        <div className="flex flex-col gap-6">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Zap size={14} className="text-[#FFD700]" />
              Swarm Maneuvers
            </h3>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleTriggerManeuver('Resource Blitz')}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-[#FFD700]">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-tight">Resource Blitz</div>
                    <div className="text-[10px] text-white/40">Sync computation cores</div>
                  </div>
                </div>
                <Users size={14} className="opacity-40 group-hover:opacity-100" />
              </button>

              <button
                onClick={() => handleTriggerManeuver('Aegis Shield')}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-emerald-400">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-tight">Aegis Shield</div>
                    <div className="text-[10px] text-white/40">Coordinated defensive flux</div>
                  </div>
                </div>
                <Users size={14} className="opacity-40 group-hover:opacity-100" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Activity size={14} className="text-[#FFD700]" />
              Synergy Insight
            </h3>

            <AnimatePresence mode="wait">
              {selectedAgent ? (
                <motion.div
                  key={selectedAgent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] overflow-hidden bg-black" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-tighter">
                        {selectedAgent.name}
                      </div>
                      <div className="text-[10px] text-[#FFD700] font-mono">
                        LV.{selectedAgent.level} {selectedAgent.role}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                      Active Bonds
                    </div>
                    {swarmProtocolService.getBondsForAgent(selectedAgent.id).map((bond, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs p-2 bg-white/5 rounded border border-white/5"
                      >
                        <span className="opacity-60">{bond.targetId.split('_')[0]}</span>
                        <span className="font-black text-[#FFD700]">{bond.level.toFixed(0)}%</span>
                      </div>
                    ))}
                    {swarmProtocolService.getBondsForAgent(selectedAgent.id).length === 0 && (
                      <div className="text-[10px] italic text-white/20">
                        No active bonds established
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-white/20 text-xs italic text-center px-4">
                  Select an agent node to view synergy details
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
