import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Command, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsonanceGate, ConsonanceReport } from '../../services/ConsonanceService';

interface Floating428ButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  mockComponent?: any; // For demoing the radar
}

export const Floating428Button: React.FC<Floating428ButtonProps> = ({
  onClick,
  isLoading: externalLoading,
  mockComponent = {
    uuid: 'core-777-v',
    version: '1.2.0',
    impactMetric: 'Social ROI',
    status: 'Trustworthy',
    evidence: {
      traceable: { source_origin: 'Vault Alpha', verification_links: ['#'] },
      trackable: { lifecycle_hooks: [{ event: 'INIT', timestamp: Date.now(), actor: 'USER' }] },
      transparent: { formula: '5T-v2', validation_standard: 'ISO-26000' },
      trustworthy: { hash_lock: 'sha-locked-777' },
    },
  },
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [isPurifying, setIsPurifying] = useState(false);
  const [report, setReport] = useState<ConsonanceReport | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (showRadar) {
      setReport(ConsonanceGate.verify(mockComponent));
    }
  }, [showRadar, mockComponent]);

  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      setShowRadar(true);
    }, 800);
  };

  const handleMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const startAlchemy = () => {
    setIsPurifying(true);
    setTimeout(() => {
      setIsPurifying(false);
      // In a real app, this would trigger EvolutionEngine.purify
      setReport(ConsonanceGate.verify({ ...mockComponent, status: 'Trustworthy' }));
    }, 2000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {showRadar && report && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 p-6 bg-slate-950/90 border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-xl w-64 text-white"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                5T Consonance Radar
              </h3>
              <button
                onClick={() => setShowRadar(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            {/* Radar Visualization */}
            <div className="relative h-40 flex items-center justify-center mb-6">
              <svg viewBox="0 0 100 100" className="w-32 h-32 overflow-visible">
                {/* Background Grid */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  strokeOpacity="0.1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  strokeOpacity="0.1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="15"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  strokeOpacity="0.1"
                />

                {/* 5T Axis Lines */}
                {[0, 72, 144, 216, 288].map(angle => (
                  <line
                    key={angle}
                    x1="50"
                    y1="50"
                    x2={50 + 45 * Math.cos(((angle - 90) * Math.PI) / 180)}
                    y2={50 + 45 * Math.sin(((angle - 90) * Math.PI) / 180)}
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                  />
                ))}

                {/* Data Polygon */}
                <motion.polygon
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    points: [
                      report.dimensions.tangible ? '50,10' : '50,50',
                      report.dimensions.traceable
                        ? 50 +
                          40 * Math.cos(((72 - 90) * Math.PI) / 180) +
                          ',' +
                          (50 + 40 * Math.sin(((72 - 90) * Math.PI) / 180))
                        : '50,50',
                      report.dimensions.trackable
                        ? 50 +
                          40 * Math.cos(((144 - 90) * Math.PI) / 180) +
                          ',' +
                          (50 + 40 * Math.sin(((144 - 90) * Math.PI) / 180))
                        : '50,50',
                      report.dimensions.transparent
                        ? 50 +
                          40 * Math.cos(((216 - 90) * Math.PI) / 180) +
                          ',' +
                          (50 + 40 * Math.sin(((216 - 90) * Math.PI) / 180))
                        : '50,50',
                      report.dimensions.trustworthy
                        ? 50 +
                          40 * Math.cos(((288 - 90) * Math.PI) / 180) +
                          ',' +
                          (50 + 40 * Math.sin(((288 - 90) * Math.PI) / 180))
                        : '50,50',
                    ].join(' '),
                  }}
                  fill="rgba(16, 185, 129, 0.3)"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Points Labels (Conceptual) */}
                <text
                  x="50"
                  y="5"
                  textAnchor="middle"
                  fontSize="5"
                  fill="#10b981"
                  fontWeight="bold"
                >
                  TAN
                </text>
                <text
                  x="95"
                  y="45"
                  textAnchor="start"
                  fontSize="5"
                  fill="#10b981"
                  fontWeight="bold"
                >
                  TRC
                </text>
                <text
                  x="80"
                  y="90"
                  textAnchor="start"
                  fontSize="5"
                  fill="#10b981"
                  fontWeight="bold"
                >
                  TRK
                </text>
                <text x="20" y="90" textAnchor="end" fontSize="5" fill="#10b981" fontWeight="bold">
                  TPS
                </text>
                <text x="5" y="45" textAnchor="end" fontSize="5" fill="#10b981" fontWeight="bold">
                  TST
                </text>
              </svg>

              {/* Entropy Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute w-20 h-20 rounded-full blur-2xl ${report.entropy > 0.2 ? 'bg-orange-500' : 'bg-emerald-500'}`}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Consonance Index
                </span>
                <span
                  className={`text-xl font-black ${report.score >= 90 ? 'text-emerald-400' : 'text-orange-400'}`}
                >
                  {report.score}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${report.score}%` }}
                  className={`h-full ${report.score >= 90 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                />
              </div>

              {report.entropy > 0 && (
                <button
                  onClick={startAlchemy}
                  disabled={isPurifying}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-all group overflow-hidden relative"
                >
                  {isPurifying && (
                    <motion.div
                      initial={{ left: '-100%' }}
                      animate={{ left: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
                    />
                  )}
                  <Zap
                    size={14}
                    className={
                      isPurifying ? 'animate-spin' : 'group-hover:scale-125 transition-transform'
                    }
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isPurifying ? 'Alchemy in Progress...' : 'Start Entropy Alchemy'}
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUp();
        }}
        onMouseEnter={() => setIsHovered(true)}
        className="group outline-none relative"
      >
        {/* Core Orb */}
        <div
          className={`relative w-14 h-14 rounded-full bg-slate-950 border flex items-center justify-center shadow-2xl transition-all duration-500 ${
            isHovered
              ? 'scale-110 shadow-[0_0_40px_rgba(16,185,129,0.3)] border-emerald-500'
              : 'border-white/10'
          }`}
        >
          {/* Alchemy Pulse Effect */}
          {isPurifying && (
            <motion.div
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-emerald-500"
            />
          )}

          {/* Spinning Ring */}
          {(externalLoading || isHovered || isPurifying) && (
            <div
              className={`absolute inset-0 rounded-full border border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow`}
            />
          )}

          {/* Icon */}
          <div
            className={`transition-colors duration-300 ${isHovered || isPurifying ? 'text-emerald-400' : 'text-slate-400'}`}
          >
            {isPurifying ? (
              <Sparkles className="w-6 h-6 animate-pulse" />
            ) : externalLoading ? (
              <Zap className="w-6 h-6 animate-pulse" />
            ) : (
              <Command className="w-6 h-6" />
            )}
          </div>
        </div>

        {/* Legend Tooltip */}
        <div
          className={`absolute bottom-full right-0 mb-3 px-3 py-1 bg-slate-950 border border-white/10 rounded-lg text-[10px] font-bold tracking-widest uppercase whitespace-nowrap opacity-0 transition-all duration-300 ${
            isHovered && !showRadar ? 'opacity-100 -translate-y-2' : ''
          }`}
        >
          <span className="text-emerald-400">428</span> Protocol Engine
          <div className="text-[8px] text-slate-500 mt-1 lowercase font-normal italic">
            Long press for 5T Radar
          </div>
        </div>
      </button>
    </div>
  );
};
