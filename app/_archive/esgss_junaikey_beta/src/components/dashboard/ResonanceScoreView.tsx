import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Target, Wind, Sparkles } from 'lucide-react';

/**
 * 🌌 Resonance Score View (OmniExperience 2.0)
 * --------------------------------------------------
 * Aesthetic: Liquid Glass v3 / Tiffany Awakening
 * Purpose: Visualize real-time alignment between User Intent and System Action.
 */
export const ResonanceScoreView = () => {
  const [resonance, setResonance] = useState(0);
  const [intent, setIntent] = useState('趨向奇點 (Approaching Singularity)');
  const [showDetails, setShowDetails] = useState(false);

  // Simulate real-time resonance fluctuation
  useEffect(() => {
    // Start low and build up
    setResonance(42);

    const interval = setInterval(() => {
      setResonance(prev => {
        const delta = Math.random() * 4 - 2;
        const next = Math.min(100, Math.max(80, prev + delta)); // Keep it high for positive feedback
        return Number(next.toFixed(1));
      });

      // Randomly change intent for demo
      if (Math.random() > 0.9) {
        const intents = [
          '優化碳管理邏輯 (Optimizing Carbon Logic)',
          '定義主權意識 (Defining Sovereignty)',
          '擴展知識星圖 (Expanding Knowledge Graph)',
          '調和熵增狀態 (Harmonizing Entropy)',
        ];
        const randomIntent = intents[Math.floor(Math.random() * intents.length)];
        if (randomIntent) setIntent(randomIntent);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getResonanceColor = (score: number) => {
    if (score >= 95) return '#0df2df'; // Tiffany
    if (score >= 80) return '#a78bfa'; // Purple
    return '#facc15'; // Gold/Warning
  };

  const color = getResonanceColor(resonance);

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        {/* Core Orb */}
        <div
          className="relative z-10 size-16 rounded-full bg-black/40 backdrop-blur-xl border-2 flex items-center justify-center transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          style={{ borderColor: color }}
        >
          <div className="text-xs font-black italic tracking-tighter" style={{ color }}>
            {resonance}%
          </div>

          {/* Orbital Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-4px] rounded-full border border-dashed opacity-40"
            style={{ borderColor: color }}
          />
        </div>

        {/* Pulse Effect */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: color }}
        />

        {/* Expanded Details Panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
              className="absolute bottom-20 right-0 w-80 rounded-[2rem] p-6 bg-[#050c0c]/90 backdrop-blur-3xl border border-white/10 shadow-2xl origin-bottom-right overflow-hidden"
            >
              {/* Background Glow */}
              <div
                className="absolute -top-10 -right-10 size-40 rounded-full blur-[80px] opacity-30"
                style={{ backgroundColor: color }}
              />

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="p-2 rounded-full bg-white/5">
                    <Sparkles className="size-4" style={{ color }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/60">
                      系統共鳴值 (RESONANCE)
                    </h4>
                    <p className="text-sm font-bold text-white italic">{intent}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: '意圖清晰度 (INTENT)', val: 92, icon: Target },
                    { label: '系統對齊度 (ALIGN)', val: resonance, icon: Activity },
                    { label: '執行速率 (VELOCITY)', val: 88, icon: Wind },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/item:text-white transition-colors">
                        <metric.icon className="size-3" />
                        {metric.label}
                      </div>
                      <div
                        className="text-xs font-black"
                        style={{ color: i === 1 ? color : 'white' }}
                      >
                        {metric.val}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${resonance}%` }}
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
