import React from 'react';
import { motion } from 'framer-motion';

export const EcosystemNodes: React.FC = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-900/50 p-6 border border-white/5 backdrop-blur-sm">
      <div className="absolute inset-0 bg-infoOne-bg opacity-30" />

      <h3 className="relative z-10 text-lg font-bold text-infoOne-accent mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-infoOne-emerald animate-pulse" />
        在線活體節點 (Living Nodes)
      </h3>

      <div className="relative z-10 h-[200px] flex items-center justify-center">
        {/* Central Core */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-infoOne-accent/20 border border-infoOne-accent flex items-center justify-center relative shadow-[0_0_30px_rgba(13,242,238,0.2)]"
        >
          <div className="w-4 h-4 rounded-full bg-infoOne-accent" />
        </motion.div>

        {/* Orbiting Nodes */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 rounded-full border border-white/10 bg-slate-800/80 backdrop-blur flex items-center justify-center"
            style={{ rotate: deg, transformOrigin: '0px 100px' }} // Simple static placement logic for demo
            animate={{
              rotate: [deg, deg + 360],
              filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
            }}
            transition={{
              rotate: { duration: 20 + i * 5, repeat: Infinity, ease: 'linear' },
              filter: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i },
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-infoOne-emerald" />
          </motion.div>
        ))}

        {/* Connecting Lines (Simulated SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <circle
            cx="50%"
            cy="50%"
            r="80"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="animate-[spin_60s_linear_infinite]"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex justify-between mt-4 text-xs font-mono text-slate-400">
        <div>活動中 (Active): 12</div>
        <div>共鳴度 (Resonance): 98%</div>
      </div>
    </div>
  );
};
