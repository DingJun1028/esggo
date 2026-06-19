import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Leaf,
  Trees,
  Droplets,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export const ImpactRestoration: React.FC = () => {
  return (
    <div className="h-full p-6 lg:p-10 space-y-8 overflow-y-auto custom-scrollbar">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-200 to-white">
            Impact Restoration
          </h1>
          <p className="text-emerald-400/60 font-mono mt-2 tracking-wider uppercase text-xs">
            ECOLOGICAL REGENERATION PROTOCOLS // 影響力修復
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-all flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Active Projects: 12
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 hover:scale-[1.02] transition-all flex items-center gap-2">
            New Initiative <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Global Impact Map (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-[400px] relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-emerald-400" />
            Global Regeneration Map
          </h3>

          <div className="flex items-center justify-center h-[300px] border border-dashed border-white/10 rounded-2xl bg-white/5">
            <p className="text-slate-500 font-mono text-sm">
              INTERACTIVE GEO-SPATIAL MAP LOADING...
            </p>
          </div>
        </motion.div>

        {/* Impact Metrics */}
        <div className="md:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-slate-400 text-sm font-medium">Carbon Offset (YTD)</h4>
                <p className="text-3xl font-bold text-white mt-1">
                  1,240 <span className="text-lg text-slate-500 font-normal">tCO2e</span>
                </p>
              </div>
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[75%]" />
            </div>
            <p className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> VERIFIED BY 5T
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-slate-400 text-sm font-medium">Trees Planted</h4>
                <p className="text-3xl font-bold text-white mt-1">
                  8,500 <span className="text-lg text-slate-500 font-normal">Saplings</span>
                </p>
              </div>
              <Trees className="w-6 h-6 text-teal-400" />
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 w-[60%]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-slate-400 text-sm font-medium">Water Restored</h4>
                <p className="text-3xl font-bold text-white mt-1">
                  50k <span className="text-lg text-slate-500 font-normal">Gallons</span>
                </p>
              </div>
              <Droplets className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-[45%]" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-400 animate-pulse" /> Active Restoration
          Initiatives
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded">
                  REFORESTATION
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Amazonia Buffer Zone {i}</h4>
              <p className="text-slate-400 text-sm mb-4">
                Reforestation project aiming to restore 50 hectares of degraded land in Peru.
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 font-mono mt-auto pt-4 border-t border-white/5">
                <span>ID: PROJ-{202500 + i}</span>
                <span className="text-emerald-400">STATUS: ON TRACK</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
