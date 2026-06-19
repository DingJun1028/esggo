import React, { useState } from 'react';
import { Target, Bot, Activity, Shield, ArrowRight, Zap, Layers, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { agencyManager, MissionObjective } from '../../../services/AgencyManager';

export const MissionMatrixUI: React.FC<{ language: any; theme: string }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [missions, setMissions] = useState<MissionObjective[]>(() => agencyManager.getMissions());
  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    return agencyManager.subscribe(() => {
      setMissions(agencyManager.getMissions());
    });
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await agencyManager.syncMissions();
    setIsSyncing(false);
  };

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-aqua-500/20 text-aqua-400 border border-aqua-500/30">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Mission Matrix</h2>
            <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
              Coordinated Agent Strategic Objectives
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest ${isDark ? 'bg-slate-900 border border-white/5 hover:bg-slate-800' : 'bg-slate-50 border border-slate-200 hover:bg-white'} transition-all disabled:opacity-50`}
          >
            <RefreshCw size={14} className={`${isSyncing ? 'animate-spin' : 'opacity-50'}`} />{' '}
            {isSyncing ? 'Syncing...' : 'Sync Matrix'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {missions.map(mission => (
          <div
            key={mission.id}
            className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-aqua-500/5 to-transparent rounded-full -mr-12 -mt-12 pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
              <div
                className={`p-3 rounded-2xl ${isDark ? 'bg-slate-950' : 'bg-slate-50'} border ${isDark ? 'border-white/5' : 'border-slate-100'}`}
              >
                <Bot size={24} className="text-aqua-400" />
              </div>
              <div
                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${mission.threatLevel === 'DANGER'
                    ? 'bg-red-500/20 text-red-500'
                    : mission.threatLevel === 'ELEVATED'
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-emerald-500/20 text-emerald-500'
                  }`}
              >
                {mission.threatLevel} STATUS
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em] mb-1">
                {mission.agentId}
              </div>
              <h3 className="text-lg font-bold leading-tight group-hover:text-aqua-400 transition-colors">
                {mission.objective}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                  Objective Progress
                </span>
                <span className="text-xl font-black text-aqua-400">{mission.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mission.progress}%` }}
                  className="h-full bg-aqua-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.1em]">
              <div className="flex items-center gap-1 opacity-40">
                <Layers size={12} /> Priority Scale: 8/10
              </div>
              <button className="flex items-center gap-1 text-aqua-400 hover:gap-2 transition-all">
                Intervene <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Suggestion Card */}
        <div
          className={`p-6 rounded-3xl border-2 border-dashed ${isDark ? 'border-white/5 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'} flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer group`}
        >
          <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap size={24} />
          </div>
          <div className="text-sm font-bold">Initiate Omni-Mission</div>
          <div className="text-[9px] font-mono opacity-50 uppercase tracking-widest mt-1">
            Cross-Agent Synchronization
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionMatrixUI;
