/**
 * 奧秘奧義矩陣 (Omni Ultimate Matrix)
 * 負責展示與管理已覺醒的奧義技藝
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Shield, Sparkles, Brain, Lock } from 'lucide-react';
import { type UltimateRune, ProficiencyLevel } from '../../shared/types.ts';

interface OmniUltimateMatrixProps {
  ultimates: UltimateRune[];
  onActivate?: (id: string) => void;
}

export const OmniUltimateMatrix: React.FC<OmniUltimateMatrixProps> = ({
  ultimates,
  onActivate,
}) => {
  const getProficiencyLabel = (level: ProficiencyLevel) => {
    switch (level) {
      case ProficiencyLevel.GRANDMASTER:
        return '泰斗';
      case ProficiencyLevel.MASTER:
        return '宗師';
      case ProficiencyLevel.EXPERT:
        return '專家';
      case ProficiencyLevel.ADEPT:
        return '資深';
      default:
        return '新手';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'mythic':
        return 'from-red-500 to-purple-600 text-white';
      case 'legendary':
        return 'from-amber-400 to-orange-600 text-white';
      case 'epic':
        return 'from-indigo-500 to-purple-500 text-white';
      default:
        return 'from-slate-500 to-slate-700 text-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" /> 已覺醒奧義 (Awakened Ultimates)
          </h3>
          <p className="text-sm text-slate-400">目前已有 {ultimates.length} 個頓悟奧義</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ultimates.length === 0 ? (
          <div className="md:col-span-2 py-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500">
            <Lock className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">尚未頓悟任何奧義</p>
            <p className="text-sm">在對話中進行深度推理以獲得「頓悟」機率</p>
          </div>
        ) : (
          ultimates.map(ult => (
            <motion.div
              key={ult.id}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-panel-premium group"
            >
              <div className={`gradient-border-top ${getTierColor(ult.ultimate.tier)}`} />

              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${getTierColor(ult.ultimate.tier)}`}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex gap-2">
                    <span className="badge-glass border-amber-500/30 text-amber-400 bg-amber-500/5">
                      {ult.ultimate.tier.toUpperCase()}
                    </span>
                    <span className="badge-glass border-white/10 text-slate-400">
                      Lv.{ult.proficiency.level}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-black text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {ult.name}
                </h4>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">{ult.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-white/5 rounded-xl p-2 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">威力</p>
                    <p className="text-sm font-mono text-white font-black">{ult.ultimate.power}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">消耗</p>
                    <p className="text-sm font-mono text-[#00FFFF] font-black">
                      {ult.ultimate.energyCost}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">熟練</p>
                    <p className="text-sm font-bold text-indigo-400">
                      {getProficiencyLabel(ult.proficiency.level)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>冷卻: {ult.ultimate.cooldown}s</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onActivate?.(ult.id)}
                    className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all border border-white/10"
                  >
                    能力詳情
                  </button>
                </div>
              </div>

              {/* Animated Background Pulse */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-all" />
            </motion.div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-3xl p-6 border border-white/5 flex flex-wrap gap-8 items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              平均頓悟率
            </p>
            <p className="text-lg font-black text-white">0.32%</p>
          </div>
        </div>
        <div className="w-px h-10 bg-white/5" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00FFFF]/10 flex items-center justify-center border border-[#00FFFF]/20">
            <Brain className="w-5 h-5 text-[#00FFFF]" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              智力共鳴加成
            </p>
            <p className="text-lg font-black text-white">+15.8%</p>
          </div>
        </div>
        <div className="w-px h-10 bg-white/5" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              穩定性偏差
            </p>
            <p className="text-lg font-black text-white">0.05</p>
          </div>
        </div>
      </div>
    </div>
  );
};
