/**
 * ⚔️ 共鳴戰鬥系統 - Resonance Battle System
 * 
 * 核心玩法：
 * - 奧義六式：偵測危機 → 策略選牌 → 效能反饋
 * - 爆擊顯化：正確決策觸發視覺特效
 * - 熵值對抗：淨化村莊降低熵值
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Zap,
  Shield,
  Flame,
  Droplets,
  Wind,
  Sparkles,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

import { useTranslation } from 'react-i18next';
// ... imports ...
// ... imports ...
import type { ESGCard, Enemy } from '@/types/game';
import { useOmniContext } from '@/hooks/useOmniContext';
import { ENEMIES, AVAILABLE_CARDS } from '@/data/gameData';

interface BattleArenaProps {
  enemyType: string;
  onComplete: (results: BattleResult) => void;
  onClose: () => void;
}

interface BattleResult {
  success: boolean;
  damage: number;
  cardsUsed: string[];
  entropyReduced: number;
  xpEarned: number;
}


export const BattleArena: React.FC<BattleArenaProps> = ({
  enemyType,
  onComplete,
  onClose
}) => {
  const { t } = useTranslation();
  const { playerState, updatePlayerState, recordBattleResult, lastTrinityResult, clearLastResult, systemVitals } = useOmniContext(); // 🌟 Awakening

  const [turn, setTurn] = useState(1);
  const [playerHP, setPlayerHP] = useState(100 + (playerState ? playerState.level * 5 : 0));
  const [enemyHP, setEnemyHP] = useState(ENEMIES[enemyType]?.health || 100);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [damageFlash, setDamageFlash] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  const enemy = ENEMIES[enemyType];
  const playerEnergy = 5; // 能量值

  if (!enemy) return null;

  // 計算傷害
  const calculateDamage = useCallback((card: ESGCard, target: Enemy): number => {
    let damage = card.power;

    const targetType = target.id.split('-')[0] || '';

    // 屬性相剋加成
    if (card.weaknessTarget && targetType && card.weaknessTarget.includes(targetType)) {
      damage *= 1.5;
    }

    // 等級加成
    if (playerState) {
      damage += Math.floor(playerState.level * 0.5);
    }

    // 防禦減免
    damage = Math.max(1, damage - target.defense);

    // 🌟 Awakening: System Resonance Buff
    if (systemVitals?.integrityScore && systemVitals.integrityScore > 80) {
      damage = Math.round(damage * 1.1); // +10% Damage from High Integrity
    }

    return Math.round(damage);
  }, [playerState, systemVitals]);

  // 回合結束敵人攻擊
  const enemyAttack = useCallback(() => {
    const defense = 5 + (playerState ? Math.floor(playerState.level * 0.2) : 0);
    let damage = Math.max(1, enemy.attack - defense); // 玩家防禦

    // 🌟 Awakening: System Entropy Debuff
    if (systemVitals?.integrityScore && systemVitals.integrityScore < 50) {
      damage = Math.round(damage * 1.1); // +10% Enemy Damage from Low Integrity
    }

    setPlayerHP(prev => Math.max(0, prev - damage));
    setBattleLog(prev => [...prev, `⚔️ ${enemy.name} 發動攻擊，造成 ${damage} 傷害！`]);
  }, [enemy, playerState, systemVitals]);

  // 出牌
  const playCard = useCallback(async (cardId: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const card = AVAILABLE_CARDS.find(c => c.id === cardId);
    if (!card) return;

    setSelectedCard(cardId);

    // 計算傷害
    const damage = calculateDamage(card, enemy);
    const targetType = enemy.id.split('-')[0] || '';

    // 更新戰鬥日誌
    setBattleLog(prev => [
      ...prev,
      `🎴 使用「${card.name}」，造成 ${damage} 傷害！`,
      (card.weaknessTarget && targetType && card.weaknessTarget.includes(targetType))
        ? '✨ 效果拔群！敵人露出弱點！'
        : '💥 攻擊命中！'
    ]);

    // 動畫效果
    setDamageFlash(true);
    setTimeout(() => setDamageFlash(false), 300);

    // 更新敵人血量
    setEnemyHP(prev => {
      const newHP = Math.max(0, prev - damage);
      if (newHP === 0) {
        // 戰鬥勝利
        const xpEarned = Math.round(damage * 5 + (enemy.maxHealth * 0.2));

        setTimeout(() => {
          const result: BattleResult = {
            success: true,
            damage,
            cardsUsed: [cardId],
            entropyReduced: damage * 0.5,
            xpEarned
          };
          setBattleResult(result);
          setShowResult(true);

          // Update Global State with Trinity Context
          recordBattleResult(true, xpEarned, {
            damage,
            turns: turn,
            actions: [{ name: card.name, impact: damage }]
          });
        }, 500);
      }
      return newHP;
    });

    // 敵人反擊
    setTimeout(() => {
      if (enemyHP - damage > 0) {
        enemyAttack();
        setTurn(prev => prev + 1);
      }
    }, 800);

    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, enemy, calculateDamage, enemyAttack, enemyHP, recordBattleResult, turn]);

  // 放棄戰鬥
  const surrender = useCallback(() => {
    const result: BattleResult = {
      success: false,
      damage: 0,
      cardsUsed: [],
      entropyReduced: 0,
      xpEarned: 10
    };

    // Update Global State with Trinity Context for loss
    recordBattleResult(false, 10, {
      damage: 0,
      turns: turn,
      actions: []
    });

    onComplete(result);
  }, [onComplete, recordBattleResult, turn]);

  // ... (render logic mostly same, except using new state)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4">
      {/* 關閉按鈕 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-slate-800/50 rounded-full text-white hover:bg-slate-700/50 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center mb-6 relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-full"
        >
          <span className="text-red-400 font-bold">⚔️ 回合 {turn}</span>
        </motion.div>

        {/* 🌟 Awakening: System Resonance HUD */}
        {systemVitals && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`absolute right-0 top-0 hidden md:flex items-center gap-2 px-3 py-1 rounded-full border ${systemVitals.resonance === 'HARMONIC' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
              }`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${systemVitals.resonance === 'HARMONIC' ? 'bg-emerald-400' : 'bg-red-400'
              }`} />
            <span className={`text-xs font-mono ${systemVitals.resonance === 'HARMONIC' ? 'text-emerald-400' : 'text-red-400'
              }`}>
              SYS.RES: {systemVitals.integrityScore}%
              {systemVitals.integrityScore > 80 && ' (BUFF ACTIVE)'}
            </span>
          </motion.div>
        )}
      </div>

      {/* 戰場區域 */}
      <div className="max-w-4xl mx-auto">
        {/* 敵人區 */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`relative mb-8 p-6 rounded-2xl bg-gradient-to-br from-red-900/50 to-slate-900 border-2 ${damageFlash ? 'border-red-500' : 'border-red-500/30'
            } transition-colors duration-300`}
        >
          <div className="flex items-center justify-between">
            {/* 敵人資訊 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{enemy.avatar}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{enemy.name}</h2>
                  <p className="text-sm text-red-400">{enemy.title}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">{enemy.description}</p>

              {/* 血條 */}
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${(enemyHP / enemy.maxHealth) * 100}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                />
              </div>
              <div className="text-right text-xs text-slate-400 mt-1">
                {enemyHP} / {enemy.maxHealth} HP
              </div>
            </div>

            {/* 敵人屬性弱點 */}
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">弱点属性</div>
              <div className="flex gap-1">
                {enemy.weakness.map(w => (
                  <span key={w} className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 戰鬥日誌 */}
        <div className="mb-4 p-3 bg-slate-900/50 rounded-xl h-32 overflow-y-auto">
          {battleLog.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">
              選擇卡牌發動攻擊...
            </p>
          ) : (
            <div className="space-y-1">
              {battleLog.slice(-5).map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-slate-300"
                >
                  {log}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 玩家區 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-aqua-400" />
              <span className="font-medium text-white">玩家防禦</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">HP</span>
              <span className="font-bold text-emerald-400">{playerHP}/{100 + (playerState ? playerState.level * 5 : 0)}</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
              style={{ width: `${(playerHP / (100 + (playerState ? playerState.level * 5 : 0))) * 100}%` }}
            />
          </div>
        </div>

        {/* 卡牌區 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              選擇策略卡牌
            </h3>
            <span className="text-sm text-amber-400">⚡ 能量: {playerEnergy}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AVAILABLE_CARDS.map(card => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playCard(card.id)}
                disabled={isAnimating || enemyHP === 0}
                className={`relative p-4 rounded-xl text-left transition-all ${selectedCard === card.id
                  ? 'ring-2 ring-emerald-500 bg-emerald-500/20'
                  : 'bg-slate-800/50 border border-white/10 hover:border-white/30'
                  } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* 卡牌稀有度邊框 */}
                <div className={`absolute inset-0 rounded-xl border-2 opacity-30 ${card.rarity === 'legendary' ? 'border-amber-500' :
                  card.rarity === 'epic' ? 'border-purple-500' :
                    card.rarity === 'rare' ? 'border-aqua-500' :
                      'border-slate-500'
                  }`} />

                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${card.category === 'environment' ? 'bg-emerald-500/20 text-emerald-400' :
                    card.category === 'social' ? 'bg-pink-500/20 text-pink-400' :
                      'bg-aqua-500/20 text-aqua-400'
                    }`}>
                    {card.category === 'environment' ? '🌲' : card.category === 'social' ? '⚖️' : '🏢'}
                  </span>
                  <span className="text-xs text-amber-400">⚡{card.cost}</span>
                </div>

                <div className="font-bold text-white text-sm mb-1">{card.name}</div>
                <div className="text-xs text-slate-400 mb-2">{card.effect}</div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-400">🗡️ {card.power}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${card.rarity === 'legendary' ? 'bg-amber-500/30 text-amber-300' :
                    card.rarity === 'epic' ? 'bg-purple-500/30 text-purple-300' :
                      card.rarity === 'rare' ? 'bg-aqua-500/30 text-aqua-300' :
                        'bg-slate-500/30 text-slate-300'
                    }`}>
                    {card.rarity}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={surrender}
            className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            撤退
          </button>
          <button
            disabled={isAnimating}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-bold hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50"
          >
            {isAnimating ? '戰鬥中...' : '⚔️ 發動奧義'}
          </button>
        </div>
      </div>

      {/* 戰鬥結果彈窗 */}
      <AnimatePresence>
        {showResult && battleResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/50 rounded-2xl p-6 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 mx-auto mb-4"
              >
                <Sparkles className="w-20 h-20 text-emerald-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {battleResult.success ? '🎉 勝利！' : '😔 撤退'}
              </h2>

              {lastTrinityResult?.info_one ? (
                <div className="text-left space-y-4 mb-6">
                  {/* Overview Layer */}
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <div className="text-xs text-emerald-400 font-mono mb-1">OVERVIEW</div>
                    <div className="text-sm text-white font-medium">{lastTrinityResult.info_one.overview.summary}</div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Resonance Shift</span>
                      <span className={lastTrinityResult.info_one.overview.resonance_delta >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {lastTrinityResult.info_one.overview.resonance_delta >= 0 ? '+' : ''}{lastTrinityResult.info_one.overview.resonance_delta}%
                      </span>
                    </div>
                  </div>

                  {/* Detail Layer */}
                  <div className="p-3 bg-aqua-500/10 rounded-xl border border-aqua-500/20">
                    <div className="text-xs text-aqua-400 font-mono mb-1">DETAIL ANALYSIS</div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-400">Efficiency Score</span>
                      <span className="text-white">{lastTrinityResult.info_one.detail.efficiency_score}</span>
                    </div>
                    <div className="space-y-1">
                      {lastTrinityResult.info_one.detail.raw_metrics && Object.entries(lastTrinityResult.info_one.detail.raw_metrics).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-[10px]">
                          <span className="text-slate-500 capitalize">{key}</span>
                          <span className="text-slate-300">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extension Layer */}
                  <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="text-xs text-purple-400 font-mono mb-1">EVOLUTIONARY GAIN</div>
                    <div className="text-xs text-slate-300 italic mb-2">"{lastTrinityResult.info_one.extension.evolutionary_gain}"</div>
                    <div className="space-y-1">
                      {lastTrinityResult.info_one.extension.next_steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] text-slate-400">
                          <div className="w-1 h-1 bg-purple-500 rounded-full" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 mb-4">
                  {battleResult.success ? `你成功淨化了${enemy.name}！` : '撤退成功，下次再戰！'}
                </p>
              )}

              <button
                onClick={() => {
                  clearLastResult();
                  onComplete(battleResult);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                確認
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleArena;
