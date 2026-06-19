import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dna,
  History,
  Award,
  Sparkles,
  Trash2,
  Database,
  ArrowRight,
  Search,
  Fingerprint,
} from 'lucide-react';
import { useGeneticInheritance } from '../../hooks/useGeneticInheritance';
import { useAgentRpg } from '../../hooks/useAgentRpg';

export const GeneticChronicle: React.FC = () => {
  const { blueprints, synthesizeBlueprint, deleteBlueprint } = useGeneticInheritance();
  const { profile } = useAgentRpg();

  const isEligible = profile.level >= 10;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Extraction Forge */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-black/80 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl h-[650px] flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <Dna className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-tighter">
                基因合成台 (Genetic Synthesis)
              </h3>
              <p className="text-[10px] text-emerald-500/70 font-mono">INHERITANCE_ENGINE_v3.7</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative z-10">
            <div
              className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6 transition-all ${isEligible ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-gray-800 opacity-30'}`}
            >
              <Fingerprint
                className={`w-12 h-12 ${isEligible ? 'text-emerald-500' : 'text-gray-700'}`}
              />
            </div>
            <h4 className="text-lg font-black text-white uppercase mb-2">{profile.title}</h4>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-black uppercase text-gray-500">
                Subject Eligibility
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isEligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
              >
                {isEligible ? 'VERIFIED' : `LEVEL ${profile.level}/10 AWAITING`}
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-8 italic">
              Extraction converts 20% of your current attributes into a permanent blueprint.
              <br />
              <span className="text-emerald-500/80 font-bold uppercase tracking-widest mt-2 block">
                Generation Mutation possible (10%)
              </span>
            </p>

            <button
              disabled={!isEligible}
              onClick={() => synthesizeBlueprint(profile)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-400 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
            >
              Begin Synthesis Ritual
            </button>
          </div>

          <div className="mt-auto p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div className="text-[9px] text-emerald-400/80 font-bold uppercase leading-tight">
              Generational blueprints provide
              <br />
              permanent base stat scaling
            </div>
          </div>

          {/* Background Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
      </div>

      {/* Right Col: Genetic Library */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-black/90 border border-white/5 rounded-2xl p-8 backdrop-blur-3xl h-[650px] flex flex-col">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                遺傳編年史 (The Genetic Chronicle)
              </h3>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Archives..."
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-[10px] text-white focus:border-emerald-500 outline-none w-48"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {blueprints.length === 0 ? (
                  <div className="col-span-2 h-64 flex flex-col items-center justify-center text-gray-700">
                    <Database className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest italic opacity-50">
                      No blueprints registered in chronological history
                    </p>
                  </div>
                ) : (
                  blueprints.map(bp => (
                    <motion.div
                      key={bp.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Award className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-emerald-400">{bp.id}</span>
                            <h4 className="text-sm font-black text-white uppercase">
                              {bp.parentName}
                            </h4>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteBlueprint(bp.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-700 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="text-center">
                          <div className="text-[8px] text-gray-500 font-black uppercase mb-1">
                            Compute
                          </div>
                          <div className="text-[11px] font-black text-emerald-400">
                            +{bp.attributes.computePower}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[8px] text-gray-500 font-black uppercase mb-1">
                            Empathy
                          </div>
                          <div className="text-[11px] font-black text-emerald-400">
                            +{bp.attributes.empathyLevel}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[8px] text-gray-500 font-black uppercase mb-1">
                            Gov
                          </div>
                          <div className="text-[11px] font-black text-emerald-400">
                            +{bp.attributes.governanceScore}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold italic pt-4 border-t border-white/5">
                        <span>v{bp.version}.0 Injected</span>
                        <div className="flex items-center gap-1">
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
