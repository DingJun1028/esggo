import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Droplets, Award, Lock, ExternalLink, Anchor } from 'lucide-react';
import { ILearningCrystal } from '@/lib/ucc-engine';
import { agencyManager } from '@/services/AgencyManager';

export const AchievementWaterfall: React.FC = () => {
  const [achievements, setAchievements] = useState<ILearningCrystal[]>([]);
  const [isMinting, setIsMinting] = useState(false);

  // Subscribe to AgencyManager
  useEffect(() => {
    const update = () => setAchievements(agencyManager.getAchievements());
    const unsubscribe = agencyManager.subscribe(update);
    update(); // Initial load
    return unsubscribe;
  }, []);

  const handleResonate = async () => {
    setIsMinting(true);
    await agencyManager.mintAchievements("User is actively reviewing their ESG impact and seeking validation.");
    setIsMinting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Background Subtle Flow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--color-primary)_0%,_transparent_40%)] opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto py-16 px-6 relative z-10">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-4 bg-aqua-500/10 rounded-full mb-6"
          >
            <Waves className="w-10 h-10 text-aqua-400 animate-pulse" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-aqua-400 to-white">
            Supreme Goodness Like Water · Achievement Waterfall
          </h1>
          <p className="text-white/40 font-mono text-sm uppercase tracking-[0.3em]">
            [Flowing Toward Sustainability] Learning Certificate Resonance Field
          </p>
          <button
            onClick={handleResonate}
            disabled={isMinting}
            className="mt-6 px-6 py-2 bg-aqua-500/20 text-aqua-400 border border-aqua-500 rounded-full hover:bg-aqua-500 hover:text-black transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? <Waves className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
            {isMinting ? 'Resonating...' : 'Resonate Crystals (AI Minting)'}
          </button>
        </header>

        <div className="relative border-l-2 border-dashed border-aqua-500/20 pl-8 space-y-12">
          <AnimatePresence>
            {achievements.map((item, idx) => (
              <motion.div
                key={item.uuid}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2, type: 'spring' }}
                className="relative group"
              >
                {/* Water Drop Link Point */}
                <div className="absolute -left-[41px] top-0">
                  <div className="w-6 h-6 rounded-full bg-infoOne-bg border-2 border-aqua-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.5)] z-20">
                    <Droplets className="w-3 h-3 text-aqua-400" />
                  </div>
                </div>

                {/* Learning Crystal Card (Liquid Glass) */}
                <div className="glass-panel-premium p-8 hover:border-infoOne-gold/50 transition-all cursor-default relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  {/* Subtle Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-scan" />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-mono text-aqua-400 bg-aqua-500/10 px-2 py-1 rounded-full uppercase tracking-tighter border border-aqua-500/20">
                        Resonance: {(item.resonance_level * 100).toFixed(0)}%
                      </span>
                      <h3 className="text-xl font-bold mt-2 text-white/90">
                        {item.learning_objective}
                      </h3>
                    </div>
                    <Award className="text-infoOne-gold w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                      <div className="text-[10px] text-white/30 uppercase font-mono mb-1">
                        Achievement Metric (Tangible)
                      </div>
                      <div className="text-sm font-bold text-infoOne-emerald drop-shadow-sm">
                        {item.impactMetric}
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                      <div className="text-[10px] text-white/30 uppercase font-mono mb-1">
                        Competency Tags
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {item.competency_tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/60 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 5T Evidence Info (Evergreen Gold) */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-3 h-3 text-infoOne-gold" />
                      <span className="text-[10px] font-mono text-white/40 break-all w-48 truncate">
                        HASH: {item.hash_lock}
                      </span>
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-aqua-400 hover:text-white transition-colors uppercase tracking-wider">
                      <Anchor className="w-3 h-3" /> Provenance Verification
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <footer className="mt-20 text-center">
          <div className="p-8 glass-panel border border-dashed border-white/10 inline-block rounded-3xl">
            <p className="text-sm text-white/60 mb-2 font-serif italic">&quot;Supreme goodness is like water, flowing toward sustainability.&quot;</p>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-aqua-400 to-infoOne-emerald">
              Your wisdom, like flowing water, nourishes all things without contending.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
