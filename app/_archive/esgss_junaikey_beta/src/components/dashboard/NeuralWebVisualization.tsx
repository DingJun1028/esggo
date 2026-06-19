import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Activity } from 'lucide-react';
import { cognitionService, Insight } from '../../services/CognitionService';
import { useLocalization } from '../../contexts/LocalizationContext';

export const NeuralWebVisualization: React.FC = () => {
  const { isZh } = useLocalization();
  const [thoughts, setThoughts] = useState<Insight[]>([]);
  const [activeThought, setActiveThought] = useState<Insight | null>(null);

  useEffect(() => {
    const sub = cognitionService.getThoughtStream().subscribe(insight => {
      if (insight) {
        setThoughts(prev => [insight, ...prev].slice(0, 7)); // Keep last 7 thoughts
        setActiveThought(insight);

        // Clear active highlight after a delay
        setTimeout(() => setActiveThought(null), 3000);
      }
    });
    return () => sub();
  }, []);

  return (
    <div className="relative h-64 bg-slate-900/40 rounded-2xl border border-indigo-500/20 overflow-hidden backdrop-blur-sm group">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div
          className={`p-2 rounded-lg ${activeThought ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800/50 text-slate-500'} transition-colors duration-500`}
        >
          <Brain size={18} className={activeThought ? 'animate-pulse' : ''} />
        </div>
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">
            {isZh ? '主權心智' : 'Sovereign Mind'}
          </h4>
          <span className="text-[9px] text-slate-400 font-mono">
            {isZh ? '認知神經網絡 v1.0' : 'Cognitive Neural Web v1.0'}
          </span>
        </div>
      </div>

      {/* Neural Network Visualization (Abstract) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Central Core */}
        <motion.div
          animate={{
            scale: activeThought ? [1, 1.2, 1] : 1,
            boxShadow: activeThought
              ? '0 0 40px rgba(99, 102, 241, 0.6)'
              : '0 0 10px rgba(99, 102, 241, 0.1)',
          }}
          transition={{ duration: 2 }}
          className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center relative z-10"
        >
          <Sparkles size={24} className="text-indigo-400 opacity-80" />
        </motion.div>

        {/* Orbiting Thoughts */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {thoughts.map((thought, i) => {
              // Calculate random-ish positions based on index
              const angle = i * (360 / 7) * (Math.PI / 180);
              const radius = 80 + (i % 2) * 30; // Alternating 80px and 110px
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x, y }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                >
                  {/* Synapse Line to Center */}
                  <svg className="absolute top-1/2 left-1/2 w-0 h-0 overflow-visible opacity-30 pointer-events-none">
                    <line x1="0" y1="0" x2={-x} y2={-y} stroke="cyan" strokeWidth="1" />
                  </svg>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Thought Stream Log */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
        <AnimatePresence mode="wait">
          {activeThought ? (
            <motion.div
              key={activeThought.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-mono text-[10px] text-indigo-300"
            >
              <span className="text-indigo-500 font-bold mr-2">[{activeThought.type}]</span>
              {activeThought.content}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[10px] text-slate-600 italic flex items-center gap-2"
            >
              <Activity size={10} className="animate-pulse" />
              Processing neural patterns...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
