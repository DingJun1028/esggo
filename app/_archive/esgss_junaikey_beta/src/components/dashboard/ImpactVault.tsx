import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Calendar, Zap, TrendingUp, Filter } from 'lucide-react';
import { useMissionSystem, MissionRecord } from '../../hooks/useMissionSystem';
import { ProofLogicGate } from './vault/ProofLogicGate';

export const ImpactVault: React.FC = () => {
  const { history } = useMissionSystem();

  const totalImpact = history.reduce(
    (sum: number, record: MissionRecord) => sum + record.impactGained,
    0
  );
  const totalXp = history.reduce((sum: number, record: MissionRecord) => sum + record.xpGained, 0);

  const typeStats = {
    E: history.filter((r: MissionRecord) => r.type === 'E').length,
    S: history.filter((r: MissionRecord) => r.type === 'S').length,
    G: history.filter((r: MissionRecord) => r.type === 'G').length,
    Hybrid: history.filter((r: MissionRecord) => r.type === 'Hybrid').length,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-cyan-400" />
          </div>
          <div className="text-xs text-cyan-500/70 uppercase tracking-widest mb-1">
            Total Impact Score
          </div>
          <div className="text-4xl font-bold text-cyan-400 font-mono">
            {totalImpact.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Cumulative Influence across all missions
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/60 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award className="w-16 h-16 text-purple-400" />
          </div>
          <div className="text-xs text-purple-500/70 uppercase tracking-widest mb-1">
            Total Experience (XP)
          </div>
          <div className="text-4xl font-bold text-purple-400 font-mono">
            {totalXp.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Network Intelligence Growth
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            Mission Distribution
          </div>
          <div className="flex gap-2">
            {Object.entries(typeStats).map(([type, count]) => (
              <div key={type} className="flex-1 text-center">
                <div
                  className={`text-lg font-bold font-mono ${
                    type === 'E'
                      ? 'text-green-400'
                      : type === 'S'
                        ? 'text-orange-400'
                        : type === 'G'
                          ? 'text-blue-400'
                          : 'text-purple-400'
                  }`}
                >
                  {count}
                </div>
                <div className="text-[8px] text-gray-600 uppercase font-bold">{type}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Logic Gate & Evidence Library (User Requested "Proof Logic Gate") */}
      <ProofLogicGate />

      {/* Ledger */}
      <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            Impact Ledger (永久成效帳本)
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] text-gray-600 uppercase font-bold">Latest Records</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-4 font-bold">Timestamp</th>
                <th className="px-6 py-4 font-bold">Mission Title</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold text-right">Synergy</th>
                <th className="px-6 py-4 font-bold text-right">Impact</th>
                <th className="px-6 py-4 font-bold text-right">Bio-Signature</th>
                <th className="px-6 py-4 font-bold text-right">Certificate ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-600 italic text-sm">
                    No mission records found in the vault.
                  </td>
                </tr>
              ) : (
                history.map((record: MissionRecord) => (
                  <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                        {record.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          record.type === 'E'
                            ? 'border-green-500/30 text-green-400 bg-green-500/5'
                            : record.type === 'S'
                              ? 'border-orange-500/30 text-orange-400 bg-orange-500/5'
                              : record.type === 'G'
                                ? 'border-blue-500/30 text-blue-400 bg-blue-500/5'
                                : 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                        }`}
                      >
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-gray-400">
                      {record.synergy.toFixed(2)}x
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm text-cyan-400 font-bold">
                      +{record.impactGained}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[10px] text-purple-400/80">
                      <div className="flex flex-col items-end gap-1">
                        <span>{record.bioId || 'UNRESTRICTED'}</span>
                        {record.validationMode === 'QUANTUM' && (
                          <span className="text-[9px] text-cyan-400 bg-cyan-900/30 px-1 rounded border border-cyan-500/30">
                            QUANTUM-VERIFIED
                          </span>
                        )}
                        {record.validationMode === 'SWARM' && (
                          <span className="text-[9px] text-orange-400 bg-orange-900/30 px-1 rounded border border-orange-500/30">
                            SWARM-CONSENSUS
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-[10px] font-mono text-gray-600">
                      {record.certificateId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
