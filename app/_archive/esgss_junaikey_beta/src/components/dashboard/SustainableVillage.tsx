import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Zap, Database, Lock, ArrowUp } from 'lucide-react';
import { gamificationService, PlayerState } from '@/services/GamificationService';

export const SustainableVillage: React.FC = () => {
  const [state, setState] = useState<PlayerState>(gamificationService.getVillageState());
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  // Effect to simulate live updates (polling for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setState(gamificationService.getVillageState());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = (id: string) => {
    const success = gamificationService.unlockBuilding(id);
    if (success) {
      // instant update
      setState({ ...gamificationService.getVillageState() });
    }
  };

  return (
    <div className="h-full w-full bg-[#050c0c] text-white flex flex-col relative overflow-hidden">
      {/* Background Grid - Isometric illusion */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 transform scale-[2] perspective-1000 rotate-x-60 pointer-events-none" />

      {/* Header HUD */}
      <div className="p-8 z-10 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-4xl font-black italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ESG GO
          </h1>
          <p className="text-emerald-400/80 font-bold tracking-widest text-sm">
            SUSTAINABILITY VILLAGE
          </p>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-2xl backdrop-blur-md">
            <div className="text-xs text-slate-400 font-bold uppercase">Eco-Credits</div>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <Leaf size={24} /> {state.ecoCredits}
            </div>
          </div>
          <div className="bg-slate-900/80 border border-cyan-500/30 p-4 rounded-2xl backdrop-blur-md">
            <div className="text-xs text-slate-400 font-bold uppercase">City Level</div>
            <div className="text-2xl font-black text-cyan-400">Lv. {state.level}</div>
          </div>
        </div>
      </div>

      {/* Isometric City Viewport */}
      <div className="flex-1 relative flex items-center justify-center pointer-events-none perspective-[1000px]">
        {/* The "Ground" Plane */}
        <div className="relative w-[800px] h-[600px] transform rotate-x-60 rotate-z-45 bg-[#0a1515] border-4 border-emerald-900/50 shadow-[0_0_100px_rgba(16,185,129,0.1)] rounded-[50px] pointer-events-auto transition-transform duration-700 hover:scale-105">
          {/* Buildings Grid */}
          <div className="absolute inset-0 grid grid-cols-2 gap-8 p-20">
            {state.buildings.map(b => (
              <motion.div
                key={b.id}
                className={`relative group cursor-pointer transition-all duration-500
                                     ${b.status === 'LOCKED' ? 'opacity-50 grayscale' : 'opacity-100'}
                                `}
                whileHover={{ z: 20, scale: 1.1 }}
                onClick={() =>
                  b.status === 'LOCKED' ? handleUnlock(b.id) : setSelectedBuilding(b.id)
                }
              >
                {/* Building Base */}
                <div
                  className={`w-32 h-32 transform -rotate-z-45 -rotate-x-0 mx-auto rounded-xl shadow-2xl flex items-center justify-center relative
                                     ${
                                       b.type === 'ENERGY'
                                         ? 'bg-cyan-900/80 border-t-4 border-cyan-400'
                                         : b.type === 'NATURE'
                                           ? 'bg-emerald-900/80 border-t-4 border-emerald-400'
                                           : 'bg-slate-800 border-t-4 border-slate-500'
                                     }
                                 `}
                >
                  {/* Icon floating above */}
                  {b.status === 'LOCKED' ? (
                    <Lock size={40} className="text-slate-400" />
                  ) : b.type === 'ENERGY' ? (
                    <Zap size={40} className="text-cyan-400" />
                  ) : b.type === 'NATURE' ? (
                    <Leaf size={40} className="text-emerald-400" />
                  ) : (
                    <Database size={40} className="text-amber-400" />
                  )}

                  {/* Holographic Projection (Fake 3D height) */}
                  {b.status !== 'LOCKED' && (
                    <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>

                {/* Label */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center w-48 transform -rotate-z-45">
                  <div className="text-sm font-bold text-white bg-black/50 px-2 rounded backdrop-blur-sm truncate border border-white/10">
                    {b.name}
                  </div>
                  {b.status === 'LOCKED' && (
                    <div className="text-[10px] text-emerald-400 font-bold mt-1 bg-emerald-900/50 px-2 py-0.5 rounded-full inline-block border border-emerald-500/50">
                      200 Credits to Build
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Selection Detail Panel */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900/95 border-l border-white/10 backdrop-blur-xl p-8 shadow-2xl z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Details</h3>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {(() => {
              const b = state.buildings.find(x => x.id === selectedBuilding);
              if (!b) return null;
              return (
                <>
                  <div className="w-full h-40 bg-slate-800 rounded-2xl mb-6 flex items-center justify-center">
                    {b.type === 'NATURE' ? (
                      <Leaf size={60} className="text-emerald-500" />
                    ) : (
                      <Zap size={60} className="text-cyan-500" />
                    )}
                  </div>
                  <h2 className="text-2xl font-black mb-2">{b.name}</h2>
                  <p className="text-slate-400 text-sm mb-6">{b.description}</p>

                  <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="text-xs text-slate-500 uppercase font-bold">Output</div>
                      <div className="font-mono text-emerald-400">+45 Carbon Credits / hr</div>
                    </div>
                    <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold flex items-center justify-center gap-2">
                      <ArrowUp size={18} /> Upgrade (Lv. {b.level + 1})
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
