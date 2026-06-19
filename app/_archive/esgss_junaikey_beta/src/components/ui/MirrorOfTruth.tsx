import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Search, Info } from 'lucide-react';

interface Conflict {
  id: string;
  sourceA: string;
  sourceB: string;
  field: string;
  valueA: string | number;
  valueB: string | number;
  confidence: number;
  fiveT: {
    tangible: boolean;
    traceable: boolean;
    trackable: boolean;
    transparent: boolean;
  };
}

const MirrorOfTruth: React.FC = () => {
  const [conflicts, setConflicts] = useState<Conflict[]>([
    {
      id: 'c1',
      sourceA: 'Omni-Log (2025-06-15)',
      sourceB: 'Utility Bill OCR',
      field: 'Electricity Consumption (kWh)',
      valueA: 12500,
      valueB: 12485,
      confidence: 0.98,
      fiveT: {
        tangible: true,
        traceable: true,
        trackable: true,
        transparent: false,
      },
    },
    {
      id: 'c2',
      sourceA: 'Enterprise Yearbook',
      sourceB: 'Manual Input',
      field: 'Employee Volunteers',
      valueA: 450,
      valueB: 420,
      confidence: 0.75,
      fiveT: {
        tangible: true,
        traceable: false,
        trackable: true,
        transparent: true,
      },
    },
  ]);

  const calculateTrinity = (conflict?: Conflict) => {
    if (!conflict) return { truth: 0, goodness: 0, beauty: 0 };
    // 映射 5T 到「真、善、美」
    const truth = (conflict.confidence + (conflict.fiveT.traceable ? 0.5 : 0)) / 1.5;
    const goodness = (conflict.fiveT.transparent ? 1 : 0.5);
    const beauty = (conflict.fiveT.tangible ? 1 : 0.2);
    return {
      truth: Math.min(1, truth),
      goodness,
      beauty
    };
  };

  const resolveConflict = (id: string, winner: 'A' | 'B') => {
    setConflicts(prev => prev.filter(c => c.id !== id));
    // In real use, this would update the source data via OmniCircle
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
            <Search size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">
              真理之鏡 <span className="text-purple-400">Mirror of Truth</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
              Autonomous Conflict Adjudication & Integrity Anchoring
            </p>
          </div>
        </div>
        <div className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold">
          {conflicts.length} PENDING CONFLICTS
        </div>
      </header>

      <div className="space-y-4">
        <AnimatePresence>
          {conflicts.length > 0 ? (
            conflicts.map(conflict => (
              <motion.div
                key={conflict.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500/20 rounded text-amber-400">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-black text-slate-200">{conflict.field}</h4>
                      <div className="flex gap-1">
                        {conflict.fiveT && Object.entries(conflict.fiveT).map(([key, valid]) => (
                          <span
                            key={key}
                            title={key.toUpperCase()}
                            className={`text-[7px] w-3 h-3 flex items-center justify-center rounded-full border ${valid ? 'border-[#00FFFF] text-[#00FFFF] bg-[#00FFFF]/10' : 'border-slate-600 text-slate-600'}`}
                          >
                            {key.charAt(0).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Trinity Resonance Indicators */}
                    <div className="flex gap-3 mt-2 mb-4">
                      {conflict && Object.entries(calculateTrinity(conflict)).map(([key, score]) => (
                        <div key={key} className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] uppercase font-black text-slate-500">
                              {key === 'truth' ? '真' : key === 'goodness' ? '善' : '美'}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">{(score * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-0.5 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score * 100}%` }}
                              className={`h-full ${key === 'truth' ? 'bg-cyan-400' : key === 'goodness' ? 'bg-emerald-400' : 'bg-pink-400'}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-[9px] uppercase font-bold text-slate-500 flex justify-between">
                          <span>Source Alpha</span>
                          <span className="text-[#00FFFF]">Option A</span>
                        </div>
                        <div className="p-4 bg-slate-900/60 rounded-lg border border-[#00FFFF]/20">
                          <div className="text-xs text-slate-400 mb-1">{conflict.sourceA}</div>
                          <div className="text-lg font-black text-white">{conflict.valueA}</div>
                          <button
                            onClick={() => resolveConflict(conflict.id, 'A')}
                            className="mt-3 w-full py-1.5 bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 text-[#00FFFF] text-[9px] font-black uppercase tracking-widest rounded transition-colors"
                          >
                            Set as Truth
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[9px] uppercase font-bold text-slate-500 flex justify-between">
                          <span>Source Beta</span>
                          <span className="text-purple-400">Option B</span>
                        </div>
                        <div className="p-4 bg-slate-900/60 rounded-lg border border-purple-500/20">
                          <div className="text-xs text-slate-400 mb-1">{conflict.sourceB}</div>
                          <div className="text-lg font-black text-white">{conflict.valueB}</div>
                          <button
                            onClick={() => resolveConflict(conflict.id, 'B')}
                            className="mt-3 w-full py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded transition-colors"
                          >
                            Set as Truth
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-700/30">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Info size={12} />
                    <span>
                      Similarity Analysis:{' '}
                      <strong>{(conflict.confidence * 100).toFixed(0)}% Match</strong>
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono">ID: {conflict.id}</div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-3"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-300">All Fields Synchronized</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                  Crystal Resonance is Perfect (100% Integrity)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MirrorOfTruth;
