import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Compass, Target, Star, ShieldCheck, Zap } from 'lucide-react';
import { OmniBoundary, OmniIndicator, OmniLabel } from '../ui';

/**
 * 🧭 我的北極星 / My North Star
 * --------------------------------------------------
 * [系列] V6 覺醒架構 (V6 Awakening Architecture)
 * [TC] 以引導光束為核心的視覺設計，將個人 ESG 價值觀與企業目標進行光學映射與對準。
 * [EN] Visual design centered on guidance beams, optically mapping and
 *      aligning personal ESG values with corporate goals.
 */

export interface NorthStarAlignment {
  category: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  categoryLabel: string;
  personalValue: number;
  corporateGoal: number;
}

export const MyNorthStar: React.FC = memo(() => {
  const alignments: NorthStarAlignment[] = useMemo(
    () => [
      { category: 'ENVIRONMENTAL', categoryLabel: '環境共生 (E)', personalValue: 0.85, corporateGoal: 0.9 },
      { category: 'SOCIAL', categoryLabel: '社會價值 (S)', personalValue: 0.95, corporateGoal: 0.88 },
      { category: 'GOVERNANCE', categoryLabel: '公司治理 (G)', personalValue: 0.75, corporateGoal: 0.95 },
    ],
    []
  );

  const overallScore = useMemo(() => {
    const total = alignments.reduce(
      (acc, curr) => acc + (1 - Math.abs(curr.personalValue - curr.corporateGoal)),
      0
    );
    return (total / alignments.length) * 100;
  }, [alignments]);

  return (
    <OmniBoundary title="我的北極星 (My North Star)" status="READY">
      <div className="relative p-6 space-y-8 overflow-hidden bg-[#0a0f0f]/40">
        {/* Optical Guidance Beam (Visual Core) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              rotate: [15, 20, 15],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -right-24 w-[300px] h-[600px] bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent blur-[80px]"
            style={{ transformOrigin: 'top right' }}
          />
        </div>

        {/* Score Header */}
        <div className="flex items-end justify-between border-b border-white/5 pb-6 relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              {overallScore.toFixed(1)}
              <div className="flex flex-col">
                <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase leading-none">
                  北極星一致性分數
                </span>
                <span className="text-[10px] text-cyan-400/40 font-mono tracking-widest uppercase leading-none">
                  ALIGNMENT SCORE
                </span>
              </div>
            </h3>
            <p className="text-[10px] text-slate-500 uppercase font-mono mt-1">
              價值觀映射矩陣 v1.5 (Value Mapping Matrix)
            </p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="text-cyan-500/30"
          >
            <Compass size={48} strokeWidth={1} />
          </motion.div>
        </div>

        {/* Alignment Metrics */}
        <div className="grid grid-cols-1 gap-6 relative z-10">
          {alignments.map((item, idx) => (
            <div key={idx} className="space-y-3 group">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-white/90 tracking-wider">
                    {item.categoryLabel}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono uppercase">
                    {item.category} VECTOR
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Resonance</div>
                    <div className="text-xs font-bold text-cyan-300">
                      {(100 - Math.abs(item.personalValue - item.corporateGoal) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <OmniIndicator type={item.category} level={item.personalValue} />
                </div>
              </div>

              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                {/* Corporate Goal Marker (The Target) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-0 bottom-0 w-1 bg-white/60 z-20 shadow-[0_0_8px_white]"
                  style={{ left: `${item.corporateGoal * 100}%` }}
                />

                {/* Mapping Beam (Connecting the two) */}
                <div
                  className="absolute inset-y-0 bg-white/10 z-10"
                  style={{
                    left: `${Math.min(item.personalValue, item.corporateGoal) * 100}%`,
                    width: `${Math.abs(item.personalValue - item.corporateGoal) * 100}%`
                  }}
                />

                {/* Personal Value Progress (The Actual) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.personalValue * 100}%` }}
                  transition={{ duration: 1.5, delay: idx * 0.2, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-white/40 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Guiding Light Insight (AI Generated) */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 p-5 rounded-2xl flex items-start gap-5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-400/30">
            <Zap size={20} className="text-cyan-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">指路明燈洞察</span>
              <span className="text-[10px] text-slate-500 font-mono">GUIDING LIGHT INSIGHT</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed italic">
              「您的社會影響力價值觀高於企業基準面 7%。建議您可以擔任實習代理人的導師，將這種共鳴擴散開來，進一步校準整體的北極星軌跡。」
            </p>
          </div>
        </div>
      </div>
    </OmniBoundary>
  );
});

MyNorthStar.displayName = 'MyNorthStar';
