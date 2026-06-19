import React from 'react';
import { motion } from 'framer-motion';

export const TrendPrediction: React.FC = () => {
  // Simulated Time Series Data
  const dataPoints = [30, 45, 40, 60, 55, 75, 70, 90, 85, 95];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-900/50 p-6 border border-white/5 backdrop-blur-sm">
      <h3 className="relative z-10 text-lg font-bold text-infoOne-gold mb-1">Nebula Forecast</h3>
      <p className="relative z-10 text-xs text-slate-500 font-mono mb-4">
        Future Resonance Probability
      </p>

      <div className="relative h-[160px] w-full flex items-end justify-between gap-1">
        {dataPoints.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
            className="w-full bg-gradient-to-t from-infoOne-emerald/10 to-infoOne-emerald/60 rounded-t-sm relative overflow-hidden group"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}

        {/* Trend Line Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none stroke-infoOne-gold drop-shadow-lg"
          style={{ overflow: 'visible' }}
        >
          <path
            d="M0,120 C40,100 80,130 120,90 S200,80 280,20"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-80"
          />
        </svg>
      </div>

      <div className="relative z-10 mt-4 px-4 py-2 bg-infoOne-gold/10 rounded-lg border border-infoOne-gold/20 flex items-center gap-3">
        <div className="text-xl font-black text-infoOne-gold">▲ 12.5%</div>
        <div className="text-xs text-infoOne-gold/80 leading-tight">
          Projected Impact Growth
          <br />
          (Next Cycle)
        </div>
      </div>
    </div>
  );
};
