import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag,
  ShieldAlert,
  Users,
  Target,
  ShieldCheck,
  ArrowUpCircle,
  Globe,
  Activity,
  Zap,
  Briefcase,
  LayoutDashboard,
} from 'lucide-react';
import { useLegion } from '../../hooks/useLegion';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { OMNI_AGENTS } from '../../data/omni-agents';

export const OmniLegionWarRoom: React.FC = () => {
  const { legions, activeMissions, formLegion, assignMission } = useLegion();
  const { profile } = useAgentRpg();
  const [isFormationOpen, setIsFormationOpen] = useState(false);
  const [newLegion, setNewLegion] = useState({
    name: '',
    type: 'E' as 'E' | 'S' | 'G' | 'OMNI',
    selectedAgents: [] as string[],
  });

  const handleFormLegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLegion.selectedAgents.length === 0) return;
    formLegion(
      profile?.id || 'CMD-UNKNOWN',
      newLegion.name,
      newLegion.selectedAgents,
      newLegion.type
    );
    setIsFormationOpen(false);
    setNewLegion({ name: '', type: 'E', selectedAgents: [] });
  };

  const toggleAgent = (id: string) => {
    setNewLegion(prev => ({
      ...prev,
      selectedAgents: prev.selectedAgents.includes(id)
        ? prev.selectedAgents.filter(a => a !== id)
        : [...prev.selectedAgents, id],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Operation Map & Directives */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-black/80 border border-red-500/20 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden h-[650px] flex flex-col">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/30">
                <Flag className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-tighter">
                  軍團戰略作戰室 (Strategic War Room)
                </h3>
                <p className="text-[10px] text-red-500/70 font-mono">MACRO_COMMAND_CENTER_v3.5</p>
              </div>
            </div>
            <button
              onClick={() => setIsFormationOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-500/20"
            >
              組建新軍團 (New Legion)
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 space-y-4">
            <AnimatePresence initial={false}>
              {activeMissions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-700">
                  <Globe className="w-20 h-20 mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest italic opacity-50">
                    無活躍的全域指令
                  </p>
                </div>
              ) : (
                activeMissions.map(mission => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                          {mission.targetTheater === 'ENVIRONMENT' ? (
                            <Zap className="w-6 h-6 text-green-400" />
                          ) : mission.targetTheater === 'SOCIAL' ? (
                            <Users className="w-6 h-6 text-purple-400" />
                          ) : (
                            <ShieldCheck className="w-6 h-6 text-orange-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                              {mission.status}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {mission.id}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-white uppercase tracking-tight">
                            {mission.name}
                          </h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase font-black mb-1">
                          部署中 (Deploying)
                        </div>
                        <div className="text-xs font-bold text-gray-300">
                          {mission.assignedLegionId}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                        <span className="text-gray-400">作戰進度 (Progress)</span>
                        <span className="text-red-500">{mission.currentProgress.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mission.currentProgress}%` }}
                          className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Scanlines Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
      </div>

      {/* Right Col: Active Legions & Formation */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-black/90 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
            <ShieldAlert className="w-4 h-4 text-gray-400" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              軍團列表 (Active Legions)
            </h3>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            {legions.length === 0 ? (
              <p className="text-[11px] text-gray-600 italic text-center py-10">尚未組建任何軍團</p>
            ) : (
              legions.map(legion => (
                <div
                  key={legion.id}
                  className="p-4 rounded-xl border border-white/5 bg-white/5 group hover:border-white/20 transition-all"
                >
                  <h4 className="text-sm font-black text-white mb-2">{legion.name}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {legion.agentIds.slice(0, 4).map(aid => (
                        <div
                          key={aid}
                          className="w-6 h-6 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-[8px] font-black text-white"
                        >
                          {aid.charAt(0)}
                        </div>
                      ))}
                      {legion.agentIds.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-black flex items-center justify-center text-[8px] font-black text-white">
                          +{legion.agentIds.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-gray-500 uppercase font-black">綜合戰力</div>
                      <div className="text-sm font-black text-red-500 font-mono">
                        {legion.totalPower}
                      </div>
                    </div>
                  </div>
                  {!legion.activeMissionId && (
                    <button
                      onClick={() =>
                        assignMission(legion.id, {
                          name: `${legion.name} Deployment`,
                          requiredPower: 800,
                        })
                      }
                      className="w-full mt-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                    >
                      啟動戰區任務
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Legion Formation Overlay (Simpler version integrated into sidebar if desktop) */}
        <AnimatePresence>
          {isFormationOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-black/95 border-2 border-red-500/40 rounded-2xl p-6 relative overflow-hidden shadow-2xl"
            >
              <h3 className="text-sm font-black text-white uppercase mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                軍團集結 (Legion Assembly)
              </h3>
              <form onSubmit={handleFormLegion} className="space-y-4">
                <input
                  type="text"
                  placeholder="軍團代號"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-red-500 outline-none"
                  value={newLegion.name}
                  onChange={e => setNewLegion({ ...newLegion, name: e.target.value })}
                />
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-500 uppercase font-black">
                    協同類型 (Synergy)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['E', 'S', 'G', 'OMNI'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewLegion({ ...newLegion, type: t as any })}
                        className={`py-1 rounded border transition-all text-[10px] font-black ${newLegion.type === t ? 'bg-red-500 text-white border-red-500' : 'bg-white/5 border-white/10 text-gray-500'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-500 uppercase font-black">選擇人員</label>
                  <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin">
                    {OMNI_AGENTS.map(agent => (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => toggleAgent(agent.id)}
                        className={`p-2 rounded border text-left transition-all ${newLegion.selectedAgents.includes(agent.id) ? 'bg-red-500/20 border-red-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
                      >
                        <div className="text-[10px] font-black">{agent.name}</div>
                        <div className="text-[8px] opacity-70">{agent.type} 單位</div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 text-white font-black uppercase text-xs tracking-tighter hover:bg-red-500 transition-all shadow-lg shadow-red-500/20"
                >
                  啟動軍團指令 (Activate)
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormationOpen(false)}
                  className="w-full py-2 text-[10px] font-bold text-gray-600 hover:text-gray-400"
                >
                  取消編組
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
