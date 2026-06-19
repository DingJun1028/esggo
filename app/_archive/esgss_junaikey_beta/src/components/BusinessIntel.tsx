import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Shield,
  Sparkles,
  Terminal,
  Cpu,
  Database,
  Activity,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Lock,
  Search,
  BookOpen,
  PieChart,
  Box,
  Layers
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { omniPriest } from '@/services/OmniPriestService';
import { SPELL_PRICES } from '@/types/omni/trinity';
import { Language } from '@/types';

/**
 * 🏛️ 商業智慧與神聖代償中心 (Sacred Command Center)
 * 
 * 核心功能：
 * 1. 符文號令 (Casting Spells): 執行 AI 與數據命令。
 * 2. 價值轉換 (Divine Vicarious Payment): 顯示價值與成本的解耦。
 * 3. 5T 溯源 (Evidence Trace): 即時顯示交易封印與誠信狀態。
 */
export const BusinessIntel: React.FC<{ language?: Language; onNavigate?: any }> = ({
  language,
}) => {
  const { t } = useTranslation();
  const isZh = language === 'zh-TW';
  const [selectedSpell, setSelectedSpell] = useState<string | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  // 可用的符文號令
  const spells = [
    { id: 'GENERATE_REPORT', name: isZh ? '生成永續報告' : 'Generate ESG Report', icon: BookOpen, color: 'aqua' },
    { id: 'STRATEGIC_ADVICE', name: isZh ? '戰略決策建議' : 'Strategic Advice', icon: Zap, color: 'purple' },
    { id: 'DAILY_INSIGHT', name: isZh ? '每日意識洞察' : 'Daily Insight', icon: Sparkles, color: 'gold' },
    { id: 'SIMPLE_QUERY', name: isZh ? '數據即時檢索' : 'Simple Query', icon: Search, color: 'blue' },
    { id: 'BATTLE_RESONANCE', name: isZh ? '戰鬥共鳴分析' : 'Battle Resonance', icon: Activity, color: 'red' },
  ];

  const handleCast = async (spellId: string) => {
    setIsCasting(true);
    setLastResult(null);

    try {
      // 透過 OmniPriest 發動號令
      const result = await omniPriest.handleRequest({
        command: spellId,
        userTier: 'Sovereign', // 預設使用最高階權限示範
        payload: { context: 'Business Intel Center' }
      });

      setLastResult(result);
    } catch (error) {
      console.error('Spell failed:', error);
    } finally {
      setIsCasting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700">
      {/* 🔮 頂部：代償機制展示 (Value vs Cost) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-aqua-500/30 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-aqua-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isZh ? '誠信封印狀態' : 'INTEGRITY SEAL'}</span>
          </div>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            Trustworthy
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-aqua-400 shadow-[0_0_10px_#00FFFF]" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isZh ? '價值價值/代償' : 'VALUE / VICARIOUS'}</span>
          </div>
          <div className="text-2xl font-bold text-white">
            100% <span className="text-sm font-normal text-purple-300 ml-1">Optimized</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-gold-500/30 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-5 h-5 text-gold-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isZh ? '資源調度率' : 'ORCHESTRATION'}</span>
          </div>
          <div className="text-2xl font-bold text-white">
            Multi-Node <span className="text-sm font-normal text-gold-300 ml-1">Active</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/40 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Box className="w-16 h-16 text-blue-400" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isZh ? '超立方協議' : 'HYPERCUBE'}</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            Active <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 📜 左側：符文菜單 (Spell Menu) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-aqua-400" />
            {isZh ? '符文號令菜單' : 'Divine Spell Command'}
          </h3>

          <div className="space-y-3">
            {spells.map((spell) => (
              <motion.button
                key={spell.id}
                whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSpell(spell.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedSpell === spell.id
                  ? 'bg-aqua-500/20 border-aqua-500/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                  : 'bg-slate-800/40 border-white/5 hover:border-white/10'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-${spell.color}-500/20`}>
                    <spell.icon className={`w-5 h-5 text-${spell.color}-400`} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{spell.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{spell.id}</div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-xs font-bold text-aqua-400">{SPELL_PRICES[spell.id]} ✨</div>
                  {selectedSpell === spell.id && (
                    <div className="text-[8px] text-slate-400 mt-1 uppercase flex gap-1">
                      <span className="text-blue-400">Dim-Res</span>
                      <span className="text-purple-400">Int-Sc</span>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <button
            disabled={!selectedSpell || isCasting}
            onClick={() => selectedSpell && handleCast(selectedSpell)}
            className="w-full mt-6 py-4 bg-gradient-to-r from-aqua-600 to-sky-600 text-white rounded-2xl font-black tracking-widest hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all disabled:opacity-30 flex items-center justify-center gap-3 uppercase"
          >
            {isCasting ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                {isZh ? '正在調度資源...' : 'Orchestrating...'}
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                {isZh ? '執行號令' : 'Cast Command'}
              </>
            )}
          </button>
        </div>

        {/* 🖥️ 右側：執行終端與溯源 (Execution Terminal & 5T) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 h-full flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h3 className="text-sm font-mono text-slate-400 flex items-center gap-2">
                <Database className="w-4 h-4" />
                OUTPUT_TERMINAL v8.2
              </h3>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400/50" />
                <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                <div className="w-2 h-2 rounded-full bg-aqua-400/50" />
              </div>
            </div>

            <div className="flex-1 font-mono text-sm overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {lastResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-blue-400 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-white">COMMAND_EVOLVED:</span> {lastResult.info_one.request_id}
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">{isZh ? '執行節點' : 'EXECUTION NODE'}</div>
                          <div className="text-xs text-white font-bold">{lastResult.info_one.overview.provider} Neural Core</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">{isZh ? '超立方共鳴' : 'RESONANCE'}</div>
                          <div className="text-xs text-blue-400 font-bold">{(lastResult.info_one.overview.resonance * 100).toFixed(1)}%</div>
                        </div>
                        <div className="hidden md:block">
                          <div className="text-[10px] text-slate-500 uppercase">{isZh ? '進化增益' : 'EVOLUTION GAIN'}</div>
                          <div className="text-xs text-purple-400 font-bold">+{(lastResult.info_one.extension.evolutionaryGain * 100).toFixed(2)}%</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-500 uppercase">{isZh ? '數據載荷' : 'PAYLOAD'}</div>
                        <div className="text-[11px] text-slate-300 bg-black/40 p-2 rounded border border-white/5">
                          {JSON.stringify(lastResult.info_one, null, 2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 py-1 px-3 bg-aqua-500/10 border border-aqua-500/30 rounded-full text-[10px] text-aqua-400">
                        <Lock className="w-3 h-3" /> 5T_SEALED
                      </div>
                      <div className="flex items-center gap-2 py-1 px-3 bg-blue-500/10 border border-blue-500/30 rounded-full text-[10px] text-blue-400">
                        <Activity className="w-3 h-3" /> TRACEABLE
                      </div>
                      <div className="flex items-center gap-2 py-1 px-3 bg-purple-500/10 border border-purple-500/30 rounded-full text-[10px] text-purple-400">
                        <TrendingDown className="w-3 h-3" /> ENTROPY_REDUCED
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4 italic">
                    <Terminal className="w-12 h-12 opacity-20" />
                    <p>{isZh ? '等待號令發動...' : 'Awaiting divine command...'}</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <div>AUTH_MODE: SOVEREIGN_SUMMONER</div>
              <div>5T_PROTOCOL: v2.1_LOCKED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
