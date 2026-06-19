import React, { useMemo } from 'react';
import { TrendingUp, Zap, Activity } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ipmsService } from '../../../services/ipmsService';

const TEXT = {
  TITLE: { zh: 'ITK 熵值經濟', en: 'ITK Entropy Economy' },
  METRICS: {
    ROI: { zh: '熵值投報率', en: 'Entropy ROI' },
    SAVINGS: { zh: '能源節省', en: 'Energy Savings' },
    TOKEN: { zh: 'J/K 代幣流通', en: 'J/K Token Circulation' },
  },
};

export const ItkEconomy = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';
  const stats = useMemo(() => ipmsService.getProjectStats(), []);

  // Calculate "Entropy ROI" (Entropy Reduced / Resource Utilization)
  // Mock calculation for visual dynamics
  const efficiency = (stats.activeEntropyReduction / (stats.resourceUtilization || 1)).toFixed(1);

  return (
    <div className="h-full flex flex-col p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />

      <div className="flex items-center gap-2 mb-4 shrink-0 relative z-10">
        <TrendingUp className="text-cyan-400" size={18} />
        <span className="font-bold text-white text-lg">{isZh ? TEXT.TITLE.zh : TEXT.TITLE.en}</span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 relative z-10">
        {/* Main Metric: Entropy ROI */}
        <div className="col-span-2 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-3 flex flex-col justify-center items-center relative overflow-hidden group hover:border-cyan-400 transition-colors">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-400/30 transition-all" />

          <div className="text-xs text-cyan-300 font-bold tracking-wider mb-1 flex items-center gap-1">
            <Zap size={12} fill="currentColor" /> {isZh ? TEXT.METRICS.ROI.zh : TEXT.METRICS.ROI.en}
          </div>
          <div className="text-4xl font-black text-white tracking-tighter">{efficiency}x</div>
          <div className="text-[10px] text-cyan-400/60 mt-1 font-mono">
            Based on active projects
          </div>
        </div>

        {/* Sub Metrics */}
        <div className="bg-black/40 border border-white/10 rounded-lg p-2">
          <div className="text-[10px] text-slate-400 mb-1">
            {isZh ? TEXT.METRICS.SAVINGS.zh : TEXT.METRICS.SAVINGS.en}
          </div>
          <div className="text-lg font-bold text-emerald-400 flex items-end gap-1">
            {Math.floor(stats.activeEntropyReduction / 10)}{' '}
            <span className="text-[10px] pb-1">kWh</span>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-2">
          <div className="text-[10px] text-slate-400 mb-1">
            {isZh ? TEXT.METRICS.TOKEN.zh : TEXT.METRICS.TOKEN.en}
          </div>
          <div className="text-lg font-bold text-purple-400 flex items-end gap-1">
            {(stats.activeEntropyReduction * 0.5).toFixed(0)}{' '}
            <span className="text-[10px] pb-1">J/K</span>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="mt-3 border-t border-white/5 pt-2 flex items-center gap-2 overflow-hidden whitespace-nowrap">
        <Activity size={10} className="text-cyan-500 shrink-0" />
        <div className="text-[9px] text-slate-500 font-mono animate-marquee">
          POOL_A: STABLE | POOL_B: OPTIMIZING | CARBON_CREDIT: +2.4% | ENTROPY_VAL:{' '}
          {stats.activeEntropyReduction} |
        </div>
      </div>
    </div>
  );
};
