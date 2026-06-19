import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Zap,
  ChevronRight,
  Radar,
  LineChart,
  ArrowRightCircle,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { useOracleFeed } from '../../hooks/useOracleFeed';
import { useActionExecutor } from '../../hooks/useActionExecutor';

export const OracleNexusPanel: React.FC = () => {
  const { signals, isSyncing, verifyProjection, getRecommendation, energyStatus } = useOracleFeed();
  const { runAction } = useActionExecutor();
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [lastProjection, setLastProjection] = useState<{
    id: string;
    value: number;
    mitigation: number;
  } | null>(null);

  const handleVerify = async (id: string) => {
    const result = verifyProjection(id);
    setLastProjection({ id, value: result.projection, mitigation: result.mitigation });
    setTimeout(() => setLastProjection(null), 5000);
  };

  const handleQuickAction = (actionId: string) => {
    // Simplified trigger from Nexus
    runAction(actionId, ['AUTO_ORACLE_SIGNATURE']);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-2">
      {/* Left Col: Signal Feed */}
      <div className="xl:col-span-12 xxl:col-span-8 space-y-6">
        <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/40">
                <Radar className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">
                  神語樞紐 (Oracle Nexus Feed)
                </h3>
                <p className="text-[10px] text-orange-500/70 font-mono">
                  GLOBAL_SIGNAL_MATRIX_v3.2
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center gap-2">
                <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-200">
                  QE: {energyStatus?.currentEnergy || 0}/{energyStatus?.maxEnergy || 1000}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                <span className="text-[10px] font-mono text-gray-400">DATA_SYNC: ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signals.map(signal => {
              const recommendation = getRecommendation(signal);
              return (
                <motion.div
                  key={signal.id}
                  layoutId={signal.id}
                  onClick={() => setSelectedSignalId(signal.id)}
                  className={`group cursor-pointer p-5 rounded-2xl border transition-all ${
                    selectedSignalId === signal.id
                      ? 'bg-orange-500/10 border-orange-500/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[12px] font-bold text-gray-200 group-hover:text-orange-400 transition-colors">
                        {signal.name}
                      </div>
                      <div className="text-[9px] text-gray-500 font-mono mt-0.5">{signal.id}</div>
                    </div>
                    <div className={`p-1.5 rounded-lg bg-black/40 border border-white/5`}>
                      {signal.trend === 'UP' ? (
                        <TrendingUp className="w-3 h-3 text-red-400" />
                      ) : signal.trend === 'DOWN' ? (
                        <TrendingDown className="w-3 h-3 text-green-400" />
                      ) : (
                        <Radio className="w-3 h-3 text-blue-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-mono mb-1.5">
                        <span className="text-gray-500 uppercase">Intensity</span>
                        <span className="text-white font-bold">{signal.value.toFixed(1)}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            signal.value > 80
                              ? 'bg-red-500'
                              : signal.value > 50
                                ? 'bg-orange-500'
                                : 'bg-cyan-500'
                          }`}
                          style={{ width: `${signal.value}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] text-gray-500 uppercase font-bold">Projection</div>
                      <div
                        className={`text-sm font-black font-mono ${
                          signal.projectedRisk > 0.7 ? 'text-red-400' : 'text-cyan-400'
                        }`}
                      >
                        {(signal.projectedRisk * 100).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {recommendation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-orange-400 animate-pulse" />
                          <span className="text-[9px] font-black text-orange-500 uppercase tracking-wider">
                            Mitigation Required
                          </span>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleQuickAction(recommendation);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded bg-orange-500/20 text-orange-400 text-[10px] font-black hover:bg-orange-500/30 transition-colors"
                        >
                          <Zap className="w-2.5 h-2.5 fill-current" />
                          {recommendation}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Col: Predictive Analysis */}
      <div className="xl:col-span-12 xxl:col-span-4 space-y-6">
        <div className="bg-black/80 border border-white/10 rounded-2xl p-6 h-[500px] flex flex-col backdrop-blur-md">
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5">
            <LineChart className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              預測性通量 (Predictive Flux)
            </h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {selectedSignalId ? (
              <div className="w-full space-y-8">
                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    Selected Matrix
                  </div>
                  <div className="text-xl font-black text-white">{selectedSignalId}</div>
                </div>

                <button
                  onClick={() => handleVerify(selectedSignalId)}
                  disabled={isSyncing}
                  className="w-full py-4 rounded-2xl border-2 border-cyan-500/30 bg-cyan-500/5 text-cyan-400 font-black uppercase text-xs tracking-widest hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  {isSyncing ? (
                    <Activity className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-cyan-400" />
                      RUN PREDICTIVE VERIFICATION
                    </>
                  )}

                  {/* Success Glow Overlay */}
                  <AnimatePresence>
                    {lastProjection && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-cyan-400 mix-blend-overlay pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[9px] text-gray-500 uppercase font-black mb-1">
                      Confidence
                    </div>
                    <div className="text-lg font-mono font-black text-white">94.2%</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[9px] text-gray-500 uppercase font-black mb-1">
                      Latency
                    </div>
                    <div className="text-lg font-mono font-black text-white">12ms</div>
                  </div>
                </div>

                <AnimatePresence>
                  {lastProjection && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">
                          驗證成功 (VERIFIED)
                        </span>
                        <ShieldAlert className="w-3 h-3 text-green-400" />
                      </div>
                      <div className="text-[11px] text-gray-400 italic font-mono">
                        Entropy Mitigated: -{lastProjection.mitigation.toFixed(4)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-4">
                <Radio className="w-12 h-12 text-gray-800 mx-auto animate-pulse" />
                <div className="text-xs text-gray-600 uppercase tracking-widest font-black">
                  Awaiting Signal Selection
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[9px] font-bold">
              <span className="text-gray-600 uppercase">Neural Feedback</span>
              <span className="text-cyan-600 font-mono">0.00KB/S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
