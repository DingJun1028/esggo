import React, { useEffect, useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, TrendingUp, Info, AlertTriangle, Zap } from 'lucide-react';
import { sentientNebulaService, NebulaForecast } from '../../services/SentientNebulaService';
import { stewardshipService, StewardshipManifesto } from '../../services/StewardshipService';
import { consciousnessSynthesisEngine, UnifiedRealityState } from '../../services/ConsciousnessSynthesisEngine';

export const NebulaProjection: React.FC = () => {
  const [forecasts, setForecasts] = useState<NebulaForecast[]>([]);
  const [manifesto, setManifesto] = useState<StewardshipManifesto | null>(null);
  const [entropy, setEntropy] = useState<number>(0);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const initNebula = async () => {
      try {
        const f = await sentientNebulaService.generateForecasts();
        setForecasts(f);
        const m = await stewardshipService.generateStewardshipManifesto();
        setManifesto(m);
        setEntropy(sentientNebulaService.getNebulaEntropy());
      } catch (e) {
        omniLogger.error(LogCategory.SYSTEM, '[NebulaProjection] Nebula initialization failed', { error: e });
      }
    };

    const pollPredictions = async () => {
      try {
        const res = await fetch('/api/ambient/predictions');
        const data = await res.json();
        if (data.status === 'success') {
          setAlerts(data.alerts || []);
          const hasRecentRisk = data.alerts?.some(
            (a: any) => a.type === 'RISK' && Date.now() - a.timestamp < 10000
          );
          if (hasRecentRisk) {
            setIsWarning(true);
            setTimeout(() => setIsWarning(false), 3000);
          }
        }
      } catch (e) {
        // Silent error for polling
      }
    };

    initNebula();
    const interval = setInterval(pollPredictions, 5000);

    const unsubUrs = consciousnessSynthesisEngine.subscribe(state => {
      const sentientInsights = state.activeInsights
        .filter(i => i.includes('[SENTIENT_CORE]'))
        .map(i => ({
          id: `sentient-${Date.now()}-${Math.random()}`,
          type: 'SENTIENT',
          description: i.replace('[SENTIENT_CORE]', '').trim(),
          timestamp: Date.now(),
          recommendation: 'Observe and align with sovereign evolution.'
        }));

      if (sentientInsights.length > 0) {
        setAlerts(prev => {
          const others = prev.filter(a => a.type !== 'SENTIENT');
          // Only take the latest sentient insight to avoid cluttering
          return [sentientInsights[0], ...others].slice(0, 5);
        });
      }
    });

    return () => {
      clearInterval(interval);
      unsubUrs();
    };
  }, []);

  return (
    <div
      className={`relative min-h-[500px] w-full bg-[#020617] rounded-[3rem] border ${isWarning ? 'border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.4)]' : 'border-blue-500/30 shadow-[0_0_80px_rgba(30,58,138,0.4)]'} overflow-hidden transition-all duration-500`}
    >
      {/* Generative Star Field / Nebula Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950" />

        {/* Pulsing Nebula Clouds */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.15)_0%,_transparent_50%)]"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1.2, 1, 1.2],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/2 -right-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15)_0%,_transparent_50%)]"
        />

        {/* Scattered Stars */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random() }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity }}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 5px rgba(255,255,255,0.8)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-10 h-full flex flex-col items-center">
        {/* Header: Sentient Nebula Branding */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            <Sparkles size={14} className="animate-pulse" />
            Intelligence Transcendence Layer
          </motion.div>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 tracking-tighter italic">
            Sentient Nebula Projection
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
            Prophetic ESG Forecasting & Planetary Stewardship Protocol v8.2
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          {/* Left: Forecast Stars */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-blue-300 font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
                <TrendingUp size={16} />
                Celestial Timeline Forecasts
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
                Entropy: <span className="text-emerald-400">{(entropy * 100).toFixed(2)} bits</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {forecasts.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <span className="text-[32px] font-black text-white/5 italic select-none">
                        #{i + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${f.impactVector === 'E'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : f.impactVector === 'S'
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                      >
                        <span className="font-black text-sm">{f.impactVector}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                          Timeline Target
                        </span>
                        <span className="text-[11px] text-white font-mono">
                          {f.targetTimeline.split('T')[0]}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 font-semibold leading-relaxed mb-4">
                      {f.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">
                          Probability
                        </span>
                        <span className="text-blue-400 font-black">
                          {(f.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.probability * 100}%` }}
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Stewardship Manifesto & Prophetic Feed */}
          <div className="space-y-6">
            <h3 className="text-purple-300 font-bold flex items-center gap-2 uppercase text-xs tracking-widest mb-4">
              <ShieldCheck size={16} />
              Planetary Manifestos
            </h3>

            {manifesto ? (
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-indigo-600/10 backdrop-blur-3xl border border-indigo-500/30 rounded-[2rem] p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full -mr-10 -mt-10" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                    <Compass size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-black italic tracking-tighter text-lg">
                      {manifesto.id}
                    </h4>
                    <span className="text-[10px] text-indigo-400 font-bold tracking-[0.2em] uppercase">
                      {manifesto.version}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[11px] text-slate-300 italic leading-relaxed">
                      "{manifesto.intent}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-black">
                        Stewardship Multiplier
                      </span>
                      <span className="text-2xl font-black text-white italic">
                        {(manifesto.stewardshipLevel * 10).toFixed(2)}{' '}
                        <span className="text-xs text-indigo-400">Ω</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 uppercase font-black block">
                        Anchor Signature
                      </span>
                      <span className="text-[10px] font-mono text-indigo-300">
                        {manifesto.commitmentHash}
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Verify Prophetic Anchor
                  </button>
                </div>
              </motion.div>
            ) : null}

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex gap-3">
              <Info size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-tight">
                <strong>系統監導通知：</strong>{' '}
                預測性預報是基於當前群集共振的概率估計。管理協議一旦簽署即不可更改。
              </p>
            </div>

            {/* Prophetic Feed (Phase 45) */}
            <div className="mt-8 space-y-4 bg-black/20 p-4 rounded-[2rem] border border-white/5">
              <h3 className="text-amber-400 font-bold flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
                <Zap size={14} />
                Prophetic Insight Feed (先知饋送)
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {alerts.length > 0 ? (
                  alerts.map(alert => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-2xl border transition-all duration-500 ${alert.type === 'RISK'
                          ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                          : alert.type === 'SENTIENT'
                            ? 'bg-amber-500/10 border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                            : alert.type === 'OPPORTUNITY'
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-white/5 border-white/10'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${alert.type === 'RISK'
                              ? 'bg-red-500 text-white'
                              : alert.type === 'SENTIENT'
                                ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                                : 'bg-emerald-500 text-white'
                            }`}
                        >
                          {alert.type}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-white font-medium mb-2 leading-relaxed">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] text-indigo-400 font-bold italic">
                        <ShieldCheck size={12} className="shrink-0" />
                        建議：{alert.recommendation}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-600 italic text-[10px]">
                    Waiting for Prophetic Convergence...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
