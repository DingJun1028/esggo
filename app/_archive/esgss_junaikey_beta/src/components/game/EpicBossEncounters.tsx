/**
 * 👹 史詩Boss戰役 - Epic Boss Encounters
 * 
 * 功能：
 * - 傳說級Boss對戰
 * - Boss故事背景
 * - 掉落獎勵敘事
 * - 戰鬥史詩體驗
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Skull, 
  Crown,
  Sword,
  Shield,
  Flame,
  Wind,
  Droplets,
  Sparkles,
  Trophy,
  AlertTriangle,
  Target,
  ChevronDown,
  ChevronUp,
  Zap,
  Ghost,
  Coins,
  Gem,
  Star
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Boss 定義
interface EpicBoss {
  id: string;
  name: string;
  title: string;
  category: 'env' | 'soc' | 'gov' | 'cli' | 'legend';
  avatar: string;
  description: string;
  backstory: string;
  quote: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    difficulty: number;
  };
  abilities: {
    name: string;
    description: string;
    type: 'attack' | 'defense' | 'special';
    damage?: number;
    cooldown: number;
  }[];
  drops: {
    type: 'card' | 'skill' | 'title' | 'xp';
    rarity: 'common' | 'rare' | 'epic' | 'legend';
    value: string | number;
    chance: number;
  }[];
  unlocksAt: number;
  storyChapter: string;
}

// Boss 列表
const EPIC_BOSSES: EpicBoss[] = [
  {
    id: 'entropy-king',
    name: '熵增之王',
    title: '混沌的化身',
    category: 'env',
    avatar: '👹',
    description: '由過度消費和環境破壞誕生的怪物，不斷吞噬著生命力。',
    backstory: `在文明的最後歲月，人類的貪婪達到了頂峰。

森林被砍伐，海洋被污染，空氣被毒害。

終於，大自然發出了最後的怒吼——熵增之王降臨了。

它的身體由廢棄塑料和工業廢水構成，
它的呼吸是致命的毒霧，
它的存在本身就是對人類最大的諷刺。

「你們創造了我，現在卻想消滅我？」`,
    quote: '你們創造了我，現在卻想消滅我？',
    stats: {
      hp: 50000,
      attack: 800,
      defense: 600,
      speed: 300,
      difficulty: 5
    },
    abilities: [
      { name: '廢墟之握', description: '對全體造成環境傷害', type: 'attack', damage: 300, cooldown: 3 },
      { name: '污染之盾', description: '獲得減傷護盾', type: 'defense', cooldown: 5 },
      { name: '混沌爆發', description: '全體受到巨大傷害', type: 'special', damage: 500, cooldown: 8 }
    ],
    drops: [
      { type: 'card', rarity: 'epic', value: 'env-boss-01', chance: 0.3 },
      { type: 'skill', rarity: 'rare', value: 'eco-burst', chance: 0.5 },
      { type: 'xp', rarity: 'common', value: 5000, chance: 1.0 }
    ],
    unlocksAt: 10,
    storyChapter: 'awakening'
  },
  {
    id: 'sweatshop-demon',
    name: '血汗魔王',
    title: '剝削的化身',
    category: 'soc',
    avatar: '👿',
    description: '由無數血汗工廠匯聚而成的怪物，代表著對勞工的殘酷剝削。',
    backstory: `在全球供應鏈的陰影處，有一個不為人知的角落。

那裡的孩子每天工作16小時，
那裡的工人住在擁擠的宿舍，
那裡的工資永遠不夠溫飽。

當這些冤魂的怨念匯聚在一起，
血汗魔王應運而生。

它的鞭子是無盡的加班，
它的鐐銬是永遠的債務，
它的城堡是用血汗堆砌的金字塔。

「996是你們的福報。」——它這樣說道。`,
    quote: '996是你們的福報。',
    stats: {
      hp: 60000,
      attack: 900,
      defense: 500,
      speed: 350,
      difficulty: 6
    },
    abilities: [
      { name: '無限加班', description: '連續攻擊3次', type: 'attack', damage: 200, cooldown: 2 },
      { name: '工資拖欠', description: '降低敵方攻擊力', type: 'defense', cooldown: 4 },
      { name: '怨靈怒吼', description: '召喚工人冤魂', type: 'special', damage: 400, cooldown: 10 }
    ],
    drops: [
      { type: 'card', rarity: 'epic', value: 'soc-boss-01', chance: 0.3 },
      { type: 'title', rarity: 'legend', value: '正義使者', chance: 0.1 },
      { type: 'xp', rarity: 'common', value: 6000, chance: 1.0 }
    ],
    unlocksAt: 25,
    storyChapter: 'justice'
  },
  {
    id: 'blackbox-dragon',
    name: '黑箱巨龍',
    title: '隱瞞的化身',
    category: 'gov',
    avatar: '🐉',
    description: '盤踞在金融帝國頂端的巨龍，用謊言和隱瞞維護著自己的王國。',
    backstory: `在華爾街的摩天大樓裡，有一個永遠黑暗的房間。

那裡做著不為人知的交易，
那裡策劃著損害千萬人利益的陰謀，
那裡的金錢來自於普通人的血汗。

黑箱巨龍就棲息在這片黑暗中，
它的鱗片是層層疊疊的文件，
它的呼吸是煙霧般的謊言，
它的寶藏是永遠查不清的帳目。

「真相？不存在的。」它說。`,
    quote: '真相？不存在的。',
    stats: {
      hp: 80000,
      attack: 1000,
      defense: 800,
      speed: 250,
      difficulty: 7
    },
    abilities: [
      { name: '煙霧彈', description: '使敵方命中率降低', type: 'defense', cooldown: 3 },
      { name: '黑箱吞噬', description: '吸收敵方攻擊', type: 'special', cooldown: 6 },
      { name: '謊言風暴', description: '造成大量精神傷害', type: 'attack', damage: 450, cooldown: 5 }
    ],
    drops: [
      { type: 'card', rarity: 'legend', value: 'gov-boss-01', chance: 0.15 },
      { type: 'skill', rarity: 'epic', value: 'truth-seeker', chance: 0.3 },
      { type: 'title', rarity: 'legend', value: '治理大師', chance: 0.1 },
      { type: 'xp', rarity: 'common', value: 8000, chance: 1.0 }
    ],
    unlocksAt: 40,
    storyChapter: 'order'
  },
  {
    id: 'greenhouse-emperor',
    name: '溫室帝王',
    title: '氣候崩潰的化身',
    category: 'cli',
    avatar: '👑',
    description: '由數十億噸二氧化碳凝聚而成的帝王，代表的正是人類對地球的傷害。',
    backstory: `當最後一片冰川融化，
當最後一口淨水被污染，
當最後一片森林變成沙漠，

溫室帝王降臨了。

它的皇冠是燃燒的化石燃料，
它的袍子是變質的大氣層，
它的權杖是失控的全球溫度。

「這是你們送給我的禮物。」它說。

「我只是接受它們，然後——」

「——毀滅一切。」`,
    quote: '我只是接受你們的禮物，然後毀滅一切。',
    stats: {
      hp: 120000,
      attack: 1200,
      defense: 1000,
      speed: 200,
      difficulty: 9
    },
    abilities: [
      { name: '熱浪襲擊', description: '全體受到灼燒傷害', type: 'attack', damage: 350, cooldown: 2 },
      { name: '冰川融化', description: '提升自身攻擊', type: 'defense', cooldown: 6 },
      { name: '氣候災變', description: '召喚極端天氣', type: 'special', damage: 600, cooldown: 12 }
    ],
    drops: [
      { type: 'card', rarity: 'legend', value: 'cli-boss-01', chance: 0.1 },
      { type: 'title', rarity: 'legend', value: '氣候英雄', chance: 0.05 },
      { type: 'skill', rarity: 'legend', value: 'climate-master', chance: 0.15 },
      { type: 'xp', rarity: 'common', value: 15000, chance: 1.0 }
    ],
    unlocksAt: 60,
    storyChapter: 'climate'
  },
  {
    id: 'chaos-primordial',
    name: '混沌原初',
    title: '終極毀滅者',
    category: 'legend',
    avatar: '🔥',
    description: '集結了所有BOSS力量的終極存在，是善向永續村最強大的敵人。',
    backstory: `當四位英雄以為已經拯救了世界，
他們不知道——

真正的威脅從未出現。

混沌原初存在於世界誕生之前，
它是所有負面能量的匯聚點，
它是所有因果報應的終點。

「你們擊敗了我的僕從，」

「現在——」

「「——準備好面對我了嗎？」」`,
    quote: '你們擊敗了我的僕從，現在準備好面對我了嗎？',
    stats: {
      hp: 300000,
      attack: 2000,
      defense: 1500,
      speed: 400,
      difficulty: 10
    },
    abilities: [
      { name: '終極混沌', description: '隨機释放所有Boss技能', type: 'special', damage: 800, cooldown: 15 },
      { name: '存在抹除', description: '直接攻擊靈魂', type: 'attack', damage: 1000, cooldown: 20 },
      { name: '永恆輪迴', description: '復活並恢復50% HP', type: 'defense', cooldown: 30 }
    ],
    drops: [
      { type: 'card', rarity: 'legend', value: 'ult-chaos-01', chance: 0.05 },
      { type: 'title', rarity: 'legend', value: '永續大師', chance: 0.02 },
      { type: 'skill', rarity: 'legend', value: 'primordial-power', chance: 0.1 },
      { type: 'xp', rarity: 'common', value: 50000, chance: 1.0 }
    ],
    unlocksAt: 90,
    storyChapter: 'final'
  }
];

// 戰鬥記錄
interface BattleRecord {
  bossId: string;
  attempts: number;
  victories: number;
  lastAttempt: Date;
  bestTime?: number;
  damageDealt: number;
}

export const EpicBossEncounters: React.FC<{
  userId: string;
  currentLevel: number;
  onBattleStart?: (bossId: string) => void;
}> = ({ userId, currentLevel, onBattleStart }) => {
  const { t, i18n } = useTranslation();
  const [selectedBoss, setSelectedBoss] = useState<EpicBoss | null>(null);
  const [expandedBoss, setExpandedBoss] = useState<string | null>(null);
  const [showBattleInfo, setShowBattleInfo] = useState(false);
  const [battleRecords, setBattleRecords] = useState<Record<string, BattleRecord>>({});

  // 計算解鎖狀態
  const getUnlockStatus = (boss: EpicBoss) => {
    if (currentLevel >= boss.unlocksAt) return 'unlocked';
    const remaining = boss.unlocksAt - currentLevel;
    return { locked: true, remaining };
  };

  // 渲染 Boss 卡片
  const renderBossCard = (boss: EpicBoss) => {
    const status = getUnlockStatus(boss);
    const record = battleRecords[boss.id];
    const isExpanded = expandedBoss === boss.id;

    return (
      <motion.div
        key={boss.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border transition-all ${
          status === 'unlocked'
            ? 'bg-slate-800/50 border-white/10 hover:border-amber-500/50'
            : 'bg-slate-900/50 border-white/5 opacity-60'
        }`}
      >
        {/* 背景效果 */}
        {status === 'unlocked' && (
          <div className={`absolute inset-0 bg-gradient-to-br ${
            boss.category === 'env' ? 'from-green-500/10 to-emerald-500/10' :
            boss.category === 'soc' ? 'from-blue-500/10 to-cyan-500/10' :
            boss.category === 'gov' ? 'from-purple-500/10 to-pink-500/10' :
            boss.category === 'cli' ? 'from-orange-500/10 to-red-500/10' :
            'from-amber-500/10 to-purple-500/10'
          } opacity-50`} />
        )}

        <div className="relative p-6">
          {/* 頭部 */}
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl ${
                status === 'unlocked'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                  : 'bg-slate-700'
              }`}
            >
              {boss.avatar}
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">{boss.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  boss.category === 'legend' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {boss.category.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-amber-400 mb-2">{boss.title}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{boss.description}</p>
            </div>

            {/* 狀態標籤 */}
            {status !== 'unlocked' ? (
              <div className="flex items-center gap-1 text-slate-500">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">LV.{boss.unlocksAt}</span>
              </div>
            ) : record?.victories ? (
              <div className="flex items-center gap-1 text-green-400">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">{record.victories} 勝</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-cyan-400">
                <Target className="w-4 h-4" />
                <span className="text-sm">未挑戰</span>
              </div>
            )}
          </div>

          {/* 展開內容 */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                {/* 背景故事 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                    <Ghost className="w-4 h-4" />
                    背景故事
                  </h4>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {boss.backstory}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 italic text-right">
                    — {boss.name}
                  </p>
                </div>

                {/* 屬性 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <Flame className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">生命值</div>
                      <div className="text-white font-bold">{boss.stats.hp.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Sword className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">攻擊力</div>
                      <div className="text-white font-bold">{boss.stats.attack}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">防禦力</div>
                      <div className="text-white font-bold">{boss.stats.defense}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Wind className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">速度</div>
                      <div className="text-white font-bold">{boss.stats.speed}</div>
                    </div>
                  </div>
                </div>

                {/* 技能 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    技能
                  </h4>
                  <div className="space-y-2">
                    {boss.abilities.map((ability, i) => (
                      <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{ability.name}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            ability.type === 'attack' ? 'bg-red-500/20 text-red-400' :
                            ability.type === 'defense' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {ability.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 掉落 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                    <Gem className="w-4 h-4" />
                    掉落獎勵
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {boss.drops.map((drop, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border ${
                          drop.rarity === 'legend' ? 'bg-purple-500/10 border-purple-500/30' :
                          drop.rarity === 'epic' ? 'bg-orange-500/10 border-orange-500/30' :
                          'bg-slate-700/50 border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {drop.type === 'card' && '🎴'}
                          {drop.type === 'skill' && '⚡'}
                          {drop.type === 'title' && '🏆'}
                          {drop.type === 'xp' && '⭐'}
                          <span className={`text-xs font-medium ${
                            drop.rarity === 'legend' ? 'text-purple-400' :
                            drop.rarity === 'epic' ? 'text-orange-400' :
                            'text-slate-400'
                          }`}>
                            {typeof drop.value === 'string' ? drop.value : `${drop.value} XP`}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          機率: {(drop.chance * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 挑戰按鈕 */}
                {status === 'unlocked' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedBoss(boss);
                      onBattleStart?.(boss.id);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Sword className="w-5 h-5" />
                    挑戰 {boss.name}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 展開/收起按鈕 */}
          {status === 'unlocked' && (
            <button
              onClick={() => setExpandedBoss(isExpanded ? null : boss.id)}
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  收起詳情
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  查看詳情
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Skull className="w-8 h-8 text-amber-400" />
            史詩Boss戰役
          </h1>
          <p className="text-slate-400">挑戰傳說中的怪物，獲取史詩獎勵</p>
        </motion.div>

        {/* 用戶等級 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">你的戰鬥力</h2>
              <p className="text-sm text-slate-400">等級 {currentLevel}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-400">
                {currentLevel >= 90 ? '🌟' : currentLevel >= 60 ? '🔥' : currentLevel >= 40 ? '💪' : '🎯'}
              </div>
            </div>
          </div>

          {/* 進度條 */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>下一Boss: LV.{EPIC_BOSSES.find(b => b.unlocksAt > currentLevel)?.unlocksAt || 'MAX'}</span>
              <span>{((currentLevel / 99) * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${(currentLevel / 99) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Boss 列表 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            傳說Boss
          </h2>

          {EPIC_BOSSES.map(boss => renderBossCard(boss))}
        </div>

        {/* Boss 詳情彈窗 */}
        <AnimatePresence>
          {selectedBoss && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBoss(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-amber-500/30 overflow-hidden">
                  {/* 頂部 */}
                  <div className="relative h-48 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                    <div className="text-8xl">{selectedBoss.avatar}</div>
                    <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedBoss.name}</h2>
                        <p className="text-amber-400">{selectedBoss.title}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm">
                        HP: {selectedBoss.stats.hp.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* 內容 */}
                  <div className="p-6">
                    <div className="mb-6">
                      <p className="text-slate-300 italic text-lg text-center">
                        「{selectedBoss.quote}」
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                        <Sword className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{selectedBoss.stats.attack}</div>
                        <div className="text-xs text-slate-500">攻擊</div>
                      </div>
                      <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                        <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{selectedBoss.stats.defense}</div>
                        <div className="text-xs text-slate-500">防禦</div>
                      </div>
                      <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                        <Wind className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{selectedBoss.stats.speed}</div>
                        <div className="text-xs text-slate-500">速度</div>
                      </div>
                      <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{selectedBoss.stats.difficulty}</div>
                        <div className="text-xs text-slate-500">難度</div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-lg"
                    >
                      ⚔️ 開始戰鬥
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EpicBossEncounters;
