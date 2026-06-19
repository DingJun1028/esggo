import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flame,
  Star,
  Users,
  Swords,
  Home,
  BookOpen,
  Award,
  User,
  ChevronRight,
  Lock,
  Unlock,
  Zap,
  Brain,
  TrendingUp,
} from 'lucide-react';

// ==================== 類型定義 ====================

interface ESGCard {
  id: string;
  name: string;
  nameEn: string;
  category: 'E' | 'S' | 'G';
  categoryName: string;
  emoji: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  power: number;
  knowledge: number;
  effect: string;
  source: string;
  illustration: string;
  owned: boolean;
}

interface Achievement {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

interface PlayerStats {
  username: string;
  level: number;
  coins: number;
  streak: number;
  totalCards: number;
  ownedCards: number;
  winRate: number;
  wins: number;
  totalBattles: number;
  dna?: {
    intelligence: number;
    precision: number;
    resilience: number;
    level?: number;
    exp?: number;
  };
}

// ==================== 遊戲數據 ====================

const SAMPLE_CARDS: ESGCard[] = [
  {
    id: 'E-085',
    name: '碳足跡追蹤',
    nameEn: 'Carbon Footprint',
    category: 'E',
    categoryName: '環境',
    emoji: '🏭💨',
    rarity: 4,
    power: 85,
    knowledge: 90,
    effect: '計算並追蹤組織碳排放',
    source: '環保署 2025 年標準',
    illustration: 'factory-emissions',
    owned: true,
  },
  {
    id: 'S-078',
    name: '公平勞動',
    nameEn: 'Fair Labor Practice',
    category: 'S',
    categoryName: '社會',
    emoji: '👥🤝',
    rarity: 4,
    power: 78,
    knowledge: 88,
    effect: '提升員工滿意度與福祉',
    source: 'ILO 國際勞工標準',
    illustration: 'diverse-workers',
    owned: true,
  },
  {
    id: 'G-092',
    name: '董事會多元化',
    nameEn: 'Board Diversity',
    category: 'G',
    categoryName: '治理',
    emoji: '📊💼',
    rarity: 5,
    power: 92,
    knowledge: 85,
    effect: '強化決策品質與透明度',
    source: 'OECD 公司治理原則',
    illustration: 'board-meeting',
    owned: true,
  },
  {
    id: 'E-101',
    name: '綠色能源',
    nameEn: 'Green Energy',
    category: 'E',
    categoryName: '環境',
    emoji: '🌲🌍',
    rarity: 3,
    power: 70,
    knowledge: 82,
    effect: '減少化石燃料依賴',
    source: 'IPCC 氣候報告',
    illustration: 'renewable-energy',
    owned: true,
  },
  {
    id: 'E-055',
    name: '電池回收',
    nameEn: 'Battery Recycling',
    category: 'E',
    categoryName: '環境',
    emoji: '⚡🔋',
    rarity: 4,
    power: 88,
    knowledge: 75,
    effect: '促進循環經濟',
    source: 'EU 循環經濟指引',
    illustration: 'battery-cycle',
    owned: true,
  },
];

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    name: '永續先鋒',
    emoji: '🥇',
    unlocked: true,
    unlockedAt: '2025-01-15',
    requirement: '完成首次碳盤查',
    tier: 'gold',
  },
  {
    id: 'ach-2',
    name: '碳中和達人',
    emoji: '🥈',
    unlocked: true,
    unlockedAt: '2025-01-10',
    requirement: '減少 20% 碳排放',
    tier: 'silver',
  },
  {
    id: 'ach-3',
    name: 'ESG大師',
    emoji: '🔒',
    unlocked: false,
    requirement: '達到 Lv.50',
    tier: 'platinum',
  },
  {
    id: 'ach-4',
    name: '7日連續',
    emoji: '🥉',
    unlocked: true,
    unlockedAt: '2025-01-12',
    requirement: '連續登入 7 天',
    tier: 'bronze',
  },
  {
    id: 'ach-5',
    name: '卡牌收藏家',
    emoji: '🥇',
    unlocked: true,
    unlockedAt: '2025-01-08',
    requirement: '收集 40 張卡牌',
    tier: 'gold',
  },
  {
    id: 'ach-6',
    name: '競技場王者',
    emoji: '🔒',
    unlocked: false,
    requirement: '累計 100 場勝利',
    tier: 'diamond',
  },
];

// ==================== 主遊戲組件 ====================

// ==================== API Service (Internal) ====================
const api = {
  getPassport: async (id: string) => {
    const res = await fetch(`/api/passport/${id}`);
    if (!res.ok) throw new Error('Failed to fetch passport');
    return res.json();
  },
  evolve: async (entityId: string, action: any) => {
    const res = await fetch('/api/evolution/evolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityId, action }),
    });
    if (!res.ok) throw new Error('Evolution failed');
    return res.json();
  },
};

// ==================== 主遊戲組件 ====================

export const ESGGoGame: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    'home' | 'collection' | 'arena' | 'achievements' | 'profile'
  >('home');
  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    username: '永續戰士·陳小明',
    level: 1,
    coins: 0,
    streak: 1,
    totalCards: 54,
    ownedCards: 4,
    winRate: 0,
    wins: 0,
    totalBattles: 0,
    dna: { intelligence: 0, precision: 0, resilience: 0 }, // Add DNA to stats
  } as any);

  // Initial Fetch
  React.useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = async () => {
    try {
      // Hardcoded ID for MVP demo
      const passport = await api.getPassport('USER-001');

      // Map Passport V2 to PlayerStats
      setPlayerStats(prev => ({
        ...prev,
        level: passport.dna?.level || 1,
        username: `永續戰士 (Lv.${passport.dna?.level})`,
        dna: passport.dna,
      }));
      setLoading(false);
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[ESGGoGame] Failed to load player data, using fallback', { error: e });
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskName: string, reward: number) => {
    try {
      const result = await api.evolve('USER-001', {
        type: 'TASK_COMPLETE',
        task: taskName,
        expValue: reward / 10, // Convert coins to EXP roughly
      });

      if (result.success) {
        // Update local state
        setPlayerStats(prev => ({
          ...prev,
          coins: prev.coins + reward,
          level: result.evolution.level,
          dna: result.dna || prev.dna,
        }));

        // Notifications
        if (result.evolution.leveledUp) {
          alert(`🎉 升級了！現在是等級 ${result.evolution.level}！`);
        }
        if (result.evolution.mutation?.unlocked) {
          alert(`✨ DNA 突變！獲得新特質：${result.evolution.mutation.trait}`);
        }
      }
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[ESGGoGame] Evolution failed', { error: e });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">載入中...</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-green-900 text-white p-4">
      {/* Header */}
      <Header playerStats={playerStats} />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <HomePage
            key="home"
            playerStats={playerStats}
            onCompleteTask={handleTaskComplete} // Pass handler
          />
        )}
        {currentView === 'collection' && <CollectionPage key="collection" />}
        {currentView === 'arena' && <ArenaPage key="arena" />}
        {currentView === 'achievements' && (
          <AchievementsPage key="achievements" playerStats={playerStats} />
        )}
        {currentView === 'profile' && <ProfilePage key="profile" playerStats={playerStats} />}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

// ==================== Header 組件 ====================

const Header: React.FC<{ playerStats: PlayerStats }> = ({ playerStats }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{playerStats.username}</h2>
            <p className="text-sm text-green-300">Lv.{playerStats.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-lg">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="font-bold">{playerStats.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-lg">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="font-bold">{playerStats.streak}天</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== 首頁 ====================

const HomePage: React.FC<{
  playerStats: PlayerStats;
  onCompleteTask: (name: string, reward: number) => void;
}> = ({ playerStats, onCompleteTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* 每日精選卡牌 */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400" />
          每日精選卡牌
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_CARDS.slice(0, 3).map((card, index) => (
            <ESGCardComponent key={card.id} card={card} isNew={index === 0} />
          ))}
        </div>
      </section>

      {/* 今日任務 */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          今日任務
          <span className="text-sm font-normal text-green-400 ml-auto">點擊任務以完成 ✅</span>
        </h3>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 space-y-3 border border-white/20">
          <TaskItem task="登入遊戲" reward={50} completed={true} onClick={() => {}} />
          <TaskItem
            task="完成 3 個 ESG 小測驗"
            reward={100}
            completed={false}
            onClick={() => onCompleteTask('完成 3 個 ESG 小測驗', 100)}
          />
          <TaskItem
            task="與好友對戰 1 場"
            reward={150}
            completed={false}
            onClick={() => onCompleteTask('與好友對戰 1 場', 150)}
          />
        </div>
      </section>

      {/* 本週挑戰 */}
      <section>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-lg font-bold mb-2">🏆 本週挑戰</h3>
          <p className="text-gray-300 mb-3">收集 10 張環境類卡牌</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-full"
                style={{ width: '80%' }}
              ></div>
            </div>
            <span className="text-sm font-bold">8/10</span>
          </div>
          <p className="text-xs text-gray-400">還差 2 張即可完成！獎勵：500 💰</p>
        </div>
      </section>

      {/* 新通知 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-green-500/20 backdrop-blur-lg rounded-2xl p-4 border border-green-400/30"
      >
        <p className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="font-bold">恭喜！</span>
          您解鎖了「永續先鋒」徽章！
        </p>
      </motion.div>
    </motion.div>
  );
};

// ==================== ESG 卡牌組件 ====================

const ESGCardComponent: React.FC<{ card: ESGCard; isNew?: boolean }> = ({
  card,
  isNew = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const categoryColors = {
    E: 'from-green-500 to-emerald-600',
    S: 'from-blue-500 to-cyan-600',
    G: 'from-purple-500 to-pink-600',
  };

  const rarityStars = '⭐'.repeat(card.rarity);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative cursor-pointer"
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
          ✨ NEW!
        </div>
      )}

      <div className={`bg-gradient-to-br ${categoryColors[card.category]} p-0.5 rounded-xl`}>
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 h-full">
          {/* 卡牌頭部 */}
          <div className="flex justify-between items-start mb-3">
            <div className="text-xs font-bold opacity-70">{card.id}</div>
            <div className="text-sm">{rarityStars}</div>
          </div>

          {/* 卡牌插圖區 */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg aspect-square flex items-center justify-center mb-3 text-5xl">
            {card.emoji}
          </div>

          {/* 卡牌標題 */}
          <h4 className="font-bold text-lg mb-1">{card.name}</h4>
          <p className="text-xs text-gray-400 mb-3">{card.nameEn}</p>

          {/* 能力值 */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                <Zap className="w-3 h-3" />
                <span>能力值</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">{card.power}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                <Brain className="w-3 h-3" />
                <span>知識值</span>
              </div>
              <div className="text-xl font-bold text-blue-400">{card.knowledge}</div>
            </div>
          </div>

          {/* 效果說明 */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-gray-300 space-y-1"
              >
                <p>💫 {card.effect}</p>
                <p className="text-gray-500">📚 {card.source}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== 任務項目組件 ====================

const TaskItem: React.FC<{
  task: string;
  reward: number;
  completed: boolean;
  onClick: () => void;
}> = ({ task, reward, completed, onClick }) => {
  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${completed ? 'opacity-50' : 'hover:bg-white/10'}`}
      onClick={!completed ? onClick : undefined}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            completed ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          {completed ? '✅' : '⏳'}
        </div>
        <span className={completed ? 'line-through text-gray-400' : ''}>{task}</span>
      </div>
      <div className="text-yellow-400 font-bold">+{reward} 💰</div>
    </div>
  );
};

// ==================== 收藏館頁面 ====================

const CollectionPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'E' | 'S' | 'G'>('all');

  const filteredCards =
    filter === 'all' ? SAMPLE_CARDS : SAMPLE_CARDS.filter(card => card.category === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold flex items-center gap-2">📚 我的卡牌收藏館</h2>

      {/* 篩選器 */}
      <div className="flex gap-2 flex-wrap">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          全部
        </FilterButton>
        <FilterButton active={filter === 'E'} onClick={() => setFilter('E')}>
          🟢 環境
        </FilterButton>
        <FilterButton active={filter === 'S'} onClick={() => setFilter('S')}>
          🔵 社會
        </FilterButton>
        <FilterButton active={filter === 'G'} onClick={() => setFilter('G')}>
          🟣 治理
        </FilterButton>
      </div>

      {/* 進度條 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">收藏進度</span>
          <span className="text-green-400 font-bold">45/54 (83%)</span>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full"
            style={{ width: '83%' }}
          ></div>
        </div>
      </div>

      {/* 卡牌網格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCards.map(card => (
          <ESGCardComponent key={card.id} card={card} />
        ))}
        {/* 未獲得卡牌 */}
        {[...Array(9)].map((_, i) => (
          <div
            key={`locked-${i}`}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border-2 border-dashed border-white/20"
          >
            <div className="aspect-square flex items-center justify-center text-6xl opacity-30">
              <Lock className="w-16 h-16" />
            </div>
            <p className="text-center mt-4 text-gray-500">未獲得</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ==================== 成就頁面 ====================

const AchievementsPage: React.FC<{ playerStats: PlayerStats }> = ({ playerStats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold flex items-center gap-2">🏆 你的成就殿堂</h2>

      {/* 個人統計 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="font-bold text-lg mb-4">個人統計</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatItem label="總積分" value={`${playerStats.coins.toLocaleString()} 💰`} />
          <StatItem label="當前等級" value={`Lv.${playerStats.level} ⚡`} />
          <StatItem label="連續登入" value={`🔥 ${playerStats.streak} 天`} />
          <StatItem
            label="卡牌收集"
            value={`${playerStats.ownedCards}/${playerStats.totalCards} 🎴`}
          />
          <StatItem label="對戰勝率" value={`${playerStats.winRate}%`} />
          <StatItem label="勝場數" value={`${playerStats.wins}勝`} />
        </div>
      </div>

      {/* 成就網格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SAMPLE_ACHIEVEMENTS.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* 本週排行榜 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          本週排行榜
        </h3>
        <div className="space-y-2">
          <RankItem rank={1} name="永續之王" score={50200} change={2} />
          <RankItem rank={2} name="綠色女神" score={48900} change={-1} />
          <RankItem rank={3} name="ESG 戰神" score={45300} change={0} />
          <div className="text-center text-gray-500 text-sm py-2">...</div>
          <RankItem
            rank={127}
            name={`你 ⚡${playerStats.username.split('·')[1]}`}
            score={playerStats.coins}
            change={12}
            highlight
          />
        </div>
      </div>
    </motion.div>
  );
};

// ==================== 競技場頁面 ====================

const ArenaPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold flex items-center gap-2">⚔️ ESG 卡牌競技場</h2>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <Swords className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
        <h3 className="text-2xl font-bold mb-4">競技場即將開放！</h3>
        <p className="text-gray-300 mb-6">對戰系統正在開發中，敬請期待...</p>
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
          通知我開放
        </button>
      </div>

      {/* 對戰預覽 */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30">
        <h3 className="font-bold text-lg mb-4">即將推出的功能</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center gap-2">✅ PvP 即時對戰</li>
          <li className="flex items-center gap-2">✅ 回合制策略玩法</li>
          <li className="flex items-center gap-2">✅ 特殊技能系統</li>
          <li className="flex items-center gap-2">✅ 全球排名</li>
          <li className="flex items-center gap-2">✅ 賽季獎勵</li>
        </ul>
      </div>
    </motion.div>
  );
};

// ==================== 個人頁面 ====================

const ProfilePage: React.FC<{ playerStats: PlayerStats }> = ({ playerStats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold flex items-center gap-2">👤 個人資料</h2>

      {/* 頭像與基本資料 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-3xl">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{playerStats.username}</h3>
            <p className="text-green-400">等級 {playerStats.level}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-white/20 rounded-full h-2 w-48 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-full"
                  style={{ width: '68%' }}
                ></div>
              </div>
              <span className="text-xs text-gray-400">68%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細統計 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="font-bold text-lg mb-4">詳細統計</h3>
        <div className="space-y-3">
          <StatBar label="卡牌收集率" value={83} color="from-green-400 to-emerald-500" />
          <StatBar label="對戰勝率" value={playerStats.winRate} color="from-blue-400 to-cyan-500" />
          <StatBar label="知識掌握度" value={75} color="from-purple-400 to-pink-500" />
          <StatBar label="活躍度" value={90} color="from-yellow-400 to-orange-500" />
        </div>
      </div>
    </motion.div>
  );
};

// ==================== 輔助組件 ====================

const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-bold transition-all ${
        active
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105'
          : 'bg-white/10 text-gray-300 hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  );
};

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const tierColors = {
    bronze: 'from-orange-700 to-orange-500',
    silver: 'from-gray-400 to-gray-200',
    gold: 'from-yellow-500 to-yellow-300',
    platinum: 'from-purple-500 to-purple-300',
    diamond: 'from-cyan-500 to-blue-300',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`rounded-xl p-4 border-2 ${
        achievement.unlocked
          ? `bg-gradient-to-br ${tierColors[achievement.tier]} border-white/30`
          : 'bg-white/5 border-white/10 opacity-50'
      }`}
    >
      <div className="text-center">
        <div className="text-5xl mb-2">{achievement.unlocked ? achievement.emoji : '🔒'}</div>
        <h4 className="font-bold mb-1">{achievement.name}</h4>
        <p className="text-xs text-gray-300 mb-2">{achievement.requirement}</p>
        {achievement.unlockedAt && (
          <p className="text-xs text-gray-400">{achievement.unlockedAt}</p>
        )}
      </div>
    </motion.div>
  );
};

const RankItem: React.FC<{
  rank: number;
  name: string;
  score: number;
  change: number;
  highlight?: boolean;
}> = ({ rank, name, score, change, highlight }) => {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${
        highlight ? 'bg-green-500/20 border-2 border-green-400' : 'bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-8 font-bold text-center">{medal || rank + '.'}</span>
        <span>{name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold">{score.toLocaleString()} 分</span>
        <TrendIcon change={change} />
      </div>
    </div>
  );
};

const TrendIcon: React.FC<{ change: number }> = ({ change }) => {
  if (change > 0) return <span className="text-green-400">⬆️ +{change}</span>;
  if (change < 0) return <span className="text-red-400">⬇️ {change}</span>;
  return <span className="text-gray-400">➡️ 0</span>;
};

const StatBar: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${color} h-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

// ==================== 底部導航 ====================

const BottomNav: React.FC<{
  currentView: string;
  setCurrentView: (view: 'home' | 'collection' | 'arena' | 'achievements' | 'profile') => void;
}> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'home', icon: Home, label: '首頁' },
    { id: 'collection', icon: BookOpen, label: '卡牌庫' },
    { id: 'arena', icon: Swords, label: '競技場' },
    { id: 'achievements', icon: Award, label: '成就' },
    { id: 'profile', icon: User, label: '個人' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 p-4">
      <div className="max-w-7xl mx-auto flex justify-around">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as any)}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === item.id
                ? 'text-green-400 scale-110'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ESGGoGame;
