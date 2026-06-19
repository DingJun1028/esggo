import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  marketIntelligenceService,
  MarketPulse,
  CompetitorIntel,
} from '../../services/MarketIntelligenceService';
import { Activity, Radio, Target, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ImpactRadarView: React.FC = () => {
  const [pulses, setPulses] = useState<MarketPulse[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorIntel[]>([]);
  const [scanAngle, setScanAngle] = useState(0);

  useEffect(() => {
    // Initial fetch
    setCompetitors(marketIntelligenceService.getCompetitorIntel());

    // Simulate live scanning
    const scanInterval = setInterval(() => {
      const newPulses = marketIntelligenceService.scanMarket();
      setPulses(prev => [...newPulses, ...prev].slice(0, 20)); // Keep last 20 in UI
    }, 5000);

    const animationInterval = setInterval(() => {
      setScanAngle(prev => (prev + 1.5) % 360);
    }, 20);

    return () => {
      clearInterval(scanInterval);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div className="h-full w-full relative flex items-center justify-center overflow-hidden">
      {/* 🌌 Radar Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(129,216,208,0.05)_0%,_transparent_70%)]" />

      {/* 🧭 Geometric Rings (Refractive) */}
      {[1, 2, 3, 4, 5].map((ring) => (
        <div
          key={ring}
          className="absolute rounded-full border border-[var(--tiffany-border)]"
          style={{
            width: `${ring * 18}%`,
            aspectRatio: '1',
            opacity: 0.15 - ring * 0.02,
            boxShadow: ring === 5 ? '0 0 40px rgba(129,216,208,0.05)' : 'none'
          }}
        />
      ))}

      {/* 🧭 Crosshair Support */}
      <div className="absolute w-[90%] h-[1px] bg-[var(--tiffany-border)] opacity-10" />
      <div className="absolute h-[90%] w-[1px] bg-[var(--tiffany-border)] opacity-10" />

      {/* 📡 Rotating Scanning Beam (Cylindrical Sweep) */}
      <motion.div
        className="absolute w-[45%] h-[45%] origin-bottom-right"
        style={{
          top: '5%',
          left: '5%',
          transform: `rotate(${scanAngle}deg)`,
          transformOrigin: '100% 100%',
          background: 'conic-gradient(from 0deg at 100% 100%, rgba(129,216,208,0.3) 0deg, rgba(129,216,208,0) 40deg)',
          clipPath: 'polygon(100% 100%, 0 0, 100% 0)'
        }}
      />

      {/* 📍 Competitor & Event Blips */}
      <div className="absolute inset-0 z-10">
        {competitors.map((comp, idx) => {
          const angle = (idx * 120 + 45) * (Math.PI / 180);
          const radius = 30 + idx * 10; // %
          const isHighThreat = comp.threatLevel === 'HIGH';

          return (
            <motion.div
              key={idx}
              className="absolute group"
              style={{
                top: `${50 + Math.sin(angle) * radius}%`,
                left: `${50 + Math.cos(angle) * radius}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.2 }}
            >
              {/* Refractive Glow Container */}
              <div className={`relative flex items-center justify-center w-6 h-6 rounded-full ${isHighThreat ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50' : 'bg-[#81D8D0]/20 border-[#81D8D0]/50'} border backdrop-blur-md`}>
                <div className={`w-2 h-2 rounded-full ${isHighThreat ? 'bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]' : 'bg-[#81D8D0] shadow-[0_0_10px_#81D8D0]'} animate-pulse`} />

                {/* 🏷️ Label */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className={`text-[9px] font-black tracking-widest uppercase italic px-2 py-1 rounded-md backdrop-blur-xl border ${isHighThreat ? 'text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/10' : 'text-[#81D8D0] border-[#81D8D0]/20 bg-[#81D8D0]/10'}`}>
                    {comp.name}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 📊 HUD Overlays for the Radar Box */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-[#81D8D0]/40 tracking-widest uppercase">Encryption Status</span>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#81D8D0]" />
            <span className="text-[10px] font-black text-[#81D8D0]">5T SECURE NODE // 0xAF32</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-black text-[#81D8D0]/40 tracking-widest uppercase text-right">Detection Rate</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[var(--tiffany-text)] italic italic">99.8%</span>
            <div className="w-12 h-1 bg-[#81D8D0]/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#81D8D0]"
                initial={{ width: 0 }}
                animate={{ width: '99.8%' }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
