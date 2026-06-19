import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion } from 'framer-motion';
import { Calculator, Shield, Activity, RefreshCw, Lock, ArrowRight } from 'lucide-react';
import { Omni_Engine, IComponentCore } from '@/lib/occ-engine';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const ExcellencePage: React.FC = () => {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<number>(0);
  const [emissionFactor, setEmissionFactor] = useState<number>(0);
  const [calculatedResult, setCalculatedResult] = useState<{
    value: number;
    formula: string;
  } | null>(null);
  const [sealedData, setSealedData] = useState<IComponentCore | null>(null);
  const [isSealing, setIsSealing] = useState(false);

  // Phase 2: Transparent Calculation
  const handleCalculate = () => {
    const result = Omni_Engine.calculateImpact(activityData, emissionFactor);
    setCalculatedResult(result);
    setSealedData(null); // Reset sealed state if recalculated
  };

  // Phase 3: Trustworthy Sealing
  const handleSeal = async () => {
    if (!calculatedResult || !user) return;
    setIsSealing(true);
    try {
      const draftCore: IComponentCore = {
        uuid: crypto.randomUUID(),
        version: '8.1.0',
        timestamp: Date.now(),
        status: 'Calculated',
        formula: calculatedResult.formula,
        impactMetric: calculatedResult.value.toString(),
        data: { activityData, emissionFactor }, // Raw data
        evidence: {
          tangible: {
            metric: 'EXCELLENCE_IMPACT_CALCULATION',
            timestamp: Date.now()
          },
          traceable: {
            source_origin: 'User-Input-Direct',
            owner: user.uid
          },
          trackable: {
            lifecycle_hooks: [{ event: 'Calculation_Executed', timestamp: Date.now(), actor: user.uid }]
          },
          transparent: { formula: calculatedResult.formula },
          trustworthy: {
            hash_lock: 'PENDING_SEAL',
            is_frozen: false
          },
        },
      };

      // 2. Generate Hash & Freeze (Omni Engine)
      const sealed = await Omni_Engine.seal(draftCore);

      // 3. Persist to Supabase (Database Trigger will lock it)
      if (!supabase) throw new Error('Supabase client not initialized');

      const { error } = await supabase.from('occ_cores').insert({
        user_id: user.uid,
        activity_type: 'Excellence_Computation',
        activity_data: sealed.data,
        formula: sealed.formula,
        impact_metric: sealed.impactMetric,
        hash_lock: sealed.hash_lock,
        metadata: {
          version: 'v8.1.0',
          engine: 'OCC_Standard',
        },
      });

      if (error) throw error;
      setSealedData(sealed);
    } catch (err) {
      omniLogger.error(LogCategory.SYSTEM, '[ExcellencePage] Sealing failed:', { error: err });
      alert('Sealing Failed: Integrity Check Rejected.');
    } finally {
      setIsSealing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Liquid Background Effect */}
      <div className="absolute inset-0 bg-liquid-gradient opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full z-10"
      >
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            Excellence Computing
          </h1>
          <p className="text-slate-400 font-mono text-sm">
            v8.1.0 Sentient Unified Edition | 5T Protocol Enabled
          </p>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          {/* Input Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Activity Data (AD)
              </label>
              <input
                type="number"
                value={activityData}
                onChange={e => setActivityData(Number(e.target.value))}
                disabled={!!sealedData}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-emerald-400 font-mono text-lg focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Emission Factor (EF)
              </label>
              <input
                type="number"
                value={emissionFactor}
                onChange={e => setEmissionFactor(Number(e.target.value))}
                disabled={!!sealedData}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-cyan-400 font-mono text-lg focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-center mb-8">
            {!calculatedResult ? (
              <button
                onClick={handleCalculate}
                className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-8 py-3 rounded-full font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <Calculator size={20} />
                Initiate Transparent Calculation
              </button>
            ) : (
              <div className="text-center w-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Activity size={18} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Formula Publicized
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {calculatedResult.formula}
                    </span>
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter">
                    {calculatedResult.value.toFixed(4)}
                    <span className="text-sm text-slate-500 font-normal ml-2">kgCO2e</span>
                  </div>
                </motion.div>

                {!sealedData ? (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setCalculatedResult(null)}
                      className="px-6 py-2 rounded-full border border-slate-600 text-slate-400 hover:bg-slate-800 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSeal}
                      disabled={isSealing}
                      className="flex items-center gap-2 bg-amber-500 text-amber-950 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                      {isSealing ? <RefreshCw className="animate-spin" /> : <Lock size={20} />}
                      Seal as Trustworthy Asset
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-amber-500/10 border border-amber-500/50 p-6 rounded-2xl text-amber-200"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2 text-amber-500 font-bold uppercase tracking-widest text-xs">
                      <Shield size={16} />
                      Trustworthy Sealed
                    </div>
                    <div className="font-mono text-xs break-all opacity-80 bg-black/20 p-2 rounded">
                      HASH: {sealedData.hash_lock}
                    </div>
                    <div className="mt-4 text-xs text-amber-400/60">
                      Immutable • Stored in PostgreSQL • Verifiable
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExcellencePage;
