import React, { useMemo } from 'react';
import { Users, BrainCircuit, Star } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
// In real app, import { useOmniLegion } from '../../store/useOmniLegion';

const TEXT = {
  TITLE: { zh: '阿周那集結 (人才)', en: 'Arjuna Assembly (Talent)' },
  STATS: {
    TOTAL: { zh: '總代理人', en: 'Total Agents' },
    AWAKENED: { zh: '已覺醒', en: 'Awakened' },
    DENSITY: { zh: '人才密度', en: 'Talent Density' },
  },
};

export const ArjunaAssembly = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';

  // Mocking real data hook for now to avoid complexity in this file,
  // but structure is ready for `useOmniLegion`
  const stats = useMemo(
    () => ({
      totalAgents: 142,
      activeLegions: 5,
      awakenedCount: 8,
      talentDensity: 89,
    }),
    []
  );

  return (
    <div className="h-full flex flex-col p-4 relative overflow-hidden">
      {/* Background Particles (static css) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-pink-500"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 shrink-0 relative z-10">
        <Users className="text-pink-400" size={18} />
        <span className="font-bold text-white text-lg">{isZh ? TEXT.TITLE.zh : TEXT.TITLE.en}</span>
      </div>

      <div className="flex-1 flex flex-col gap-3 relative z-10">
        {/* Main Stat: Awakened */}
        <div className="flex-1 bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-500/30 rounded-xl p-3 flex items-center justify-between group hover:border-pink-400 transition-all">
          <div>
            <div className="text-3xl font-black text-white">{stats.awakenedCount}</div>
            <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">
              {isZh ? TEXT.STATS.AWAKENED.zh : TEXT.STATS.AWAKENED.en}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/40 transition-colors">
            <Star size={20} className="text-pink-400" fill="currentColor" />
          </div>
        </div>

        {/* Sub Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/40 border border-white/10 rounded-lg p-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
              <Users size={10} /> {isZh ? TEXT.STATS.TOTAL.zh : TEXT.STATS.TOTAL.en}
            </div>
            <div className="text-lg font-bold text-white">{stats.totalAgents}</div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-lg p-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
              <BrainCircuit size={10} /> {isZh ? TEXT.STATS.DENSITY.zh : TEXT.STATS.DENSITY.en}
            </div>
            <div className="text-lg font-bold text-purple-400">{stats.talentDensity}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
