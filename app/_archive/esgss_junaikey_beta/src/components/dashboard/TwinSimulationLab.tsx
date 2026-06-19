import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fingerprint,
  Copy,
  Terminal,
  Zap,
  AlertTriangle,
  RefreshCw,
  Ghost,
  Database,
  ShieldX,
  TrendingDown,
  Activity,
} from 'lucide-react';
import { useBioTwin } from '../../hooks/useBioTwin';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { useLegion } from '../../hooks/useLegion';

export const TwinSimulationLab: React.FC = () => {
  const { twins, isSimulating, cloneInstance, executeStressTest, mergeInsights } = useBioTwin();
  const { profile } = useAgentRpg();
  const { legions } = useLegion();
  const [selectedTwin, setSelectedTwin] = useState<string | null>(null);

  const scenarios = [
    {
      id: 'BLACK_SWAN_01',
      name: 'Global Carbon Tax Spike',
      icon: <TrendingDown className="text-green-400" />,
      severity: 7,
      drift: 'E',
    },
    {
      id: 'BLACK_SWAN_02',
      name: 'Supply Chain Collapse',
      icon: <ShieldX className="text-purple-400" />,
      severity: 8,
      drift: 'S',
    },
    {
      id: 'BLACK_SWAN_03',
      name: 'Governance Coup Attempt',
      icon: <AlertTriangle className="text-orange-400" />,
      severity: 9,
      drift: 'G',
    },
  ];

  const currentTwin = twins.find(t => t.id === selectedTwin);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Sandbox & Clones */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-black/80 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-xl h-[650px] flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
              <Fingerprint className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-tighter">
                孿生鏡像沙盒 (Twin Sandbox)
              </h3>
              <p className="text-[10px] text-blue-500/70 font-mono">STATE_CLONER_v3.6</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="text-[10px] text-gray-500 uppercase font-black px-2">
              Initiate Cloning
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => cloneInstance(profile, 'AGENT')}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                  <span className="text-xs font-bold text-gray-300">Clone Current Agent</span>
                </div>
                <Zap className="w-3 h-3 text-orange-400 opacity-0 group-hover:opacity-100" />
              </button>
              {legions.map(l => (
                <button
                  key={l.id}
                  onClick={() => cloneInstance(l, 'LEGION')}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    <span className="text-xs font-bold text-gray-300">Clone {l.name}</span>
                  </div>
                  <Database className="w-3 h-3 text-red-400 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
            <div className="text-[10px] text-gray-500 uppercase font-black px-2 mb-2">
              Active Twins
            </div>
            {twins.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 opacity-30">
                <Ghost className="w-8 h-8 mb-2" />
                <span className="text-[10px] font-black uppercase">No Clones Detected</span>
              </div>
            ) : (
              twins.map(twin => (
                <button
                  key={twin.id}
                  onClick={() => setSelectedTwin(twin.id)}
                  className={`w-full p-4 rounded-2xl border transition-all text-left ${selectedTwin === twin.id ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-blue-400">{twin.id}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${twin.stabilityRating > 50 ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}
                    />
                  </div>
                  <div className="text-[11px] font-black text-white uppercase mb-1">
                    {twin.clonedData.name}
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-500 uppercase">Stability</span>
                    <span className={twin.stabilityRating < 30 ? 'text-red-500' : 'text-gray-300'}>
                      {twin.stabilityRating}%
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Middle Col: Stress Testing Lab */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-black/90 border border-white/5 rounded-2xl p-8 backdrop-blur-3xl h-[650px] relative overflow-hidden flex flex-col">
          {!selectedTwin ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600">
              <Terminal className="w-16 h-16 mb-6 opacity-20" />
              <h3 className="text-lg font-black uppercase tracking-[0.2em]">
                Select Clone for Simulation
              </h3>
              <p className="text-xs mt-2 opacity-50 font-mono">AWAITING_STATE_INPUT...</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">
                    對抗性壓力測試 (Stress Testing)
                  </h2>
                  <p className="text-xs text-blue-400 font-mono">
                    TARGET: {currentTwin?.clonedData.name} ({currentTwin?.id})
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-black mb-1 Uppercase">
                    Simulated Insights
                  </div>
                  <div className="text-3xl font-black text-orange-500 font-mono">
                    {currentTwin?.simulatedInsights}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {scenarios.map(sc => (
                  <div
                    key={sc.id}
                    className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-all flex flex-col items-center text-center group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {sc.icon}
                    </div>
                    <h4 className="text-[11px] font-black text-white uppercase mb-4 h-8 flex items-center">
                      {sc.name}
                    </h4>
                    <button
                      onClick={() =>
                        executeStressTest(selectedTwin, {
                          id: sc.id,
                          name: sc.name,
                          description: '',
                          impactSeverity: sc.severity,
                          targetDrift: sc.drift as any,
                        })
                      }
                      disabled={isSimulating || (currentTwin?.stabilityRating || 0) <= 0}
                      className="w-full py-2 rounded-xl bg-red-500/80 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:bg-gray-800 disabled:text-gray-600"
                    >
                      {isSimulating ? 'SIMULATING...' : 'Trigger Event'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex flex-col justify-end space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black uppercase">
                    <span className="text-gray-500">Twin Integrity Status</span>
                    <span
                      className={
                        currentTwin?.stabilityRating === 0 ? 'text-red-500' : 'text-blue-400'
                      }
                    >
                      {currentTwin?.stabilityRating}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentTwin?.stabilityRating}%` }}
                      className={`h-full bg-gradient-to-r ${currentTwin?.stabilityRating! > 50 ? 'from-blue-600 to-cyan-400' : 'from-red-600 to-orange-400'} shadow-[0_0_20px_rgba(59,130,246,0.5)]`}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    disabled={!currentTwin || currentTwin.simulatedInsights === 0}
                    onClick={() => {
                      mergeInsights(selectedTwin);
                      setSelectedTwin(null);
                    }}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                    Merge Insight to Real System
                  </button>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                    <Activity className="w-5 h-5 text-gray-500" />
                    <div className="text-[10px] text-gray-400 font-bold uppercase leading-tight">
                      Simulation Insight modifies
                      <br />
                      <span className="text-orange-400">GLOBAL_ENTROPY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Simulation Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-6 grid-rows-6 opacity-[0.05]">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-blue-500/20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
