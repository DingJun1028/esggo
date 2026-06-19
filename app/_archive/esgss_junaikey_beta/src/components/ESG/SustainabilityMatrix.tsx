import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, ShieldCheck, Zap, TrendingUp, Download } from 'lucide-react';
import { useESGStore } from '@/store/useESGStore';
import { TruthBundleService } from '@/services/integration/TruthBundleService';

export const SustainabilityMatrix: React.FC = () => {
  const { totalCO2e, itEnergyKWh, anchoredCount } = useESGStore();

  // Mock scores calculated from store data
  const scores = {
    environmental: Math.min(95, 100 - totalCO2e / 50),
    social: 88,
    governance: Math.min(100, anchoredCount * 8),
  };

  return (
    <div className="p-8 h-full overflow-auto custom-scrollbar bg-[#020617]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Sustainability Performance Matrix
            </h2>
            <p className="text-slate-500 font-mono text-sm tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
              TACTICAL ANALYTICS // MULTI-DIMENSIONAL INTEGRITY
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const bundle = TruthBundleService.generateBundle();
              TruthBundleService.downloadBundle(bundle);
            }}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] group"
          >
            <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
            Export Truth Bundle
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <MatrixScoreCard
            label="Environmental"
            score={scores.environmental}
            icon={<Leaf className="text-white" />}
            color="white"
            subtext={`${totalCO2e.toFixed(1)} tCO2e Intensity`}
          />
          <MatrixScoreCard
            label="Social"
            score={scores.social}
            icon={<Users className="text-white" />}
            color="white"
            subtext="88% Engagement Rate"
          />
          <MatrixScoreCard
            label="Governance"
            score={scores.governance}
            icon={<ShieldCheck className="text-white" />}
            color="white"
            subtext={`${anchoredCount} Validated Assets`}
          />
        </div>

        {/* Strategic Balancing View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[32px] p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-cyan-400" /> Equilibrium Analysis
            </h3>
            <div className="space-y-6">
              <EquilibriumBar
                label="Carbon Efficiency"
                progress={scores.environmental}
                color="emerald"
              />
              <EquilibriumBar
                label="Audit Transparency"
                progress={scores.governance}
                color="indigo"
              />
              <EquilibriumBar
                label="Energy Optimization"
                progress={Math.max(0, 100 - itEnergyKWh / 10)}
                color="cyan"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[32px] p-8 flex flex-col items-center justify-center text-center backdrop-blur-xl">
            <div className="w-24 h-24 rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Zap size={40} className="text-white animate-pulse" />
            </div>
            <h4 className="text-4xl font-black text-white mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Omni ESG Rating: A+
            </h4>
            <p className="text-slate-400 text-sm max-w-xs font-medium">
              Your organization is currently performing in the top 5% of digital-native sustainable
              enterprises.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MatrixScoreCard: React.FC<{
  label: string;
  score: number;
  icon: React.ReactNode;
  color: string;
  subtext: string;
}> = ({ label, score, icon, color, subtext }) => (
  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 hover:border-white/20 transition-all group">
    <div className="flex justify-between items-center mb-4">
      <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform border border-white/10">
        {icon}
      </div>
      <div className="text-2xl font-black text-white">{score.toFixed(0)}</div>
    </div>
    <h3 className="text-white font-bold mb-1">{label}</h3>
    <p className="text-slate-400 text-xs font-mono uppercase tracking-wider opacity-60">{subtext}</p>
    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        className="h-full bg-white opacity-80"
      />
    </div>
  </div>
);

const EquilibriumBar: React.FC<{ label: string; progress: number; color: string }> = ({
  label,
  progress,
  color,
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
      <span className="text-slate-400">{label}</span>
      <span className={`text-${color}-400`}>{progress.toFixed(1)}%</span>
    </div>
    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full bg-${color}-500 shadow-[0_0_8px_rgba(var(--tw-gradient-from),0.5)]`}
      />
    </div>
  </div>
);
