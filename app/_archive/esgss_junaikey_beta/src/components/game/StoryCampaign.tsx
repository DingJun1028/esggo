/**
 * 📖 史詩劇情系統 - Epic Story Campaign System
 *
 * 功能：
 * - 主線史詩劇情
 * - 英雄成長故事
 * - 世界觀深度刻畫
 * - 個人史詩旅程
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  Sword,
  Crown,
  Heart,
  Star,
  ChevronRight,
  Map,
  Users,
  Target,
  Flame,
  Shield,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 英雄類型定義
interface HeroArchetype {
  id: string;
  name: string;
  title: string;
  backstory: string;
  motivation: string;
  quote: string;
  avatar: string;
  color: string;
  skills: {
    name: string;
    description: string;
    icon: string;
  }[];
  storyChapter: string;
}

// 世界觀章節
interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  unlocksAt: number;
  heroes: string[];
  boss?: {
    name: string;
    title: string;
    description: string;
    avatar: string;
  };
  rewards: {
    type: 'card' | 'xp' | 'title' | 'skill';
    value: string | number;
  }[];
  content: StoryScene[];
}

interface StoryScene {
  id: string;
  type: 'narrative' | 'battle' | 'choice' | 'revelation';
  speaker?: string;
  text: string;
  visual?: string;
  choices?: {
    text: string;
    outcome: string;
    reward?: string;
  }[];
}

// 英雄類別
const HERO_ARCHETYPES: HeroArchetype[] = [
  {
    id: 'guardian',
    name: '綠色守護者',
    title: '自然之子',
    backstory: `在遙遠的未來世界，「極端熵增」正在吞噬一切。
      
曾經繁榮的城市變成了工業廢墟，清澈的河流被黑煙遮蔽。
      
但在一片荒蕪之中，有一個被稱為「最後綠洲」的地方，
那裡有一位從小就能與植物溝通的少年——你。
      
你的使命：喚醒沈睡的自然之力，
用知識的種子重新播種這片土地。`,
    motivation: '讓世界重新呼吸',
    quote: '每一棵樹都是對抗熵增的堡壘。',
    avatar: '🌿',
    color: 'emerald',
    skills: [
      { name: '森林之心', description: '召喚自然屏障，減免傷害', icon: '🛡️' },
      { name: '生命湧泉', description: '恢復生命力並淨化環境', icon: '💚' },
      { name: '生態共鳴', description: '與環境卡牌產生額外效果', icon: '🌍' },
    ],
    storyChapter: 'awakening',
  },
  {
    id: 'champion',
    name: '正義使者',
    title: '公平之光',
    backstory: `從貧民窟出生的你，從小就見證了社會的不公。
      
你的父母在血汗工廠工作，你的兄弟姐妹被迫失學。
      
但你沒有屈服於命運，而是用知識武裝自己，
成為了為弱勢群體發聲的鬥士。
      
你的使命：揭露所有不公，讓正義之光照亮每個角落。`,
    motivation: '為無聲者發聲',
    quote: '真正的財富不是金錢，而是尊嚴。',
    avatar: '⚖️',
    color: 'blue',
    skills: [
      { name: '正義審判', description: '對社會不公造成額外傷害', icon: '⚔️' },
      { name: '公平之盾', description: '保護隊友免受不公傷害', icon: '🛡️' },
      { name: '團結之力', description: '號召群眾，提升全隊攻擊', icon: '👥' },
    ],
    storyChapter: 'justice',
  },
  {
    id: 'master',
    name: '治理大師',
    title: '秩序建築師',
    backstory: `在混亂的企業世界中，你是一位傳奇般的治理顧問。
      
你曾幫助數百家企業建立透明的治理架構，
讓腐敗無所遁形，讓決策變得公正。
      
但最大的挑戰還在前方——
一個試圖用黑箱操作顛覆市場的黑暗組織。
      
你的使命：用透明與規則重建秩序。`,
    motivation: '讓腐敗無所遁形',
    quote: '陽光是最好的消毒劑。',
    avatar: '🏛️',
    color: 'purple',
    skills: [
      { name: '透視之眼', description: '看穿敵方防禦，直接打擊弱點', icon: '👁️' },
      { name: '規則枷鎖', description: '限制敵方行動，無法攻擊', icon: '⛓️' },
      { name: '信任光環', description: '提升全隊信任度，暴擊率增加', icon: '✨' },
    ],
    storyChapter: 'order',
  },
  {
    id: 'pioneer',
    name: '氣候先驅',
    title: '變革者',
    backstory: `你是一位氣候科學家，曾經預言了這場災難。
      
但沒有人相信你，直到一切都太遲了。
      
現在，你是「氣候行動聯盟」的領袖，
帶領著倖存者對抗這場由人類自己造成的災難。
      
你的使命：改變歷史，讓未來重新寫起。`,
    motivation: '為地球而戰',
    quote: '改變不是奇蹟，而是選擇。',
    avatar: '🌍',
    color: 'orange',
    skills: [
      { name: '氣候操控', description: '改變戰場天氣，獲得環境優勢', icon: '🌪️' },
      { name: '碳中和爆發', description: '清除戰場上所有負面效果', icon: '💥' },
      { name: '科學洞察', description: '預測敵方行動，提前防禦', icon: '🔬' },
    ],
    storyChapter: 'climate',
  },
];

// 主線劇情章節
const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'awakening',
    title: '覺醒之章',
    subtitle: '從荒蕪到希望',
    description: '在一片被遺忘的土地上，你發現了自己真正的力量。',
    unlocksAt: 1,
    heroes: ['guardian'],
    boss: {
      name: '熵增之王',
      title: '混沌的化身',
      description: '由過度消費和環境破壞誕生的怪物，不斷吞噬著生命力。',
      avatar: '👹',
    },
    rewards: [
      { type: 'card', value: 'env-001' },
      { type: 'xp', value: 500 },
      { type: 'title', value: '覺醒者' },
    ],
    content: [
      {
        id: 'scene-1',
        type: 'narrative',
        speaker: '旁白',
        text: `這是一個被遺忘的時代。

曾經璀璨的文明，如今只剩下斷壁殘垣。
名為「熵增」的怪物，正在吞噬著這個世界僅存的生命力。

但在這片荒蕪之中，有一個聲音在呼喚你...`,
        visual: 'wasteland',
      },
      {
        id: 'scene-2',
        type: 'revelation',
        speaker: '神秘聲音',
        text: `「醒來吧，綠色守護者。」

「你是這個世界最後的希望。」

「你的使命：收集 ESG 知識的力量，
淨化這片被污染的土地，
讓生命重新綻放。」`,
        visual: 'awakening',
      },
      {
        id: 'scene-3',
        type: 'choice',
        text: '你選擇如何回應這個呼喚？',
        choices: [
          {
            text: '「我將成為守護者。」',
            outcome: '你接受了綠色守護者的使命。',
            reward: '🌿 覺醒技能已解鎖',
          },
          {
            text: '「我需要證明自己。」',
            outcome: '系統將引導你前往試煉之地。',
            reward: '⚔️ 試煉任務已開啟',
          },
          {
            text: '「我一個人做不到。」',
            outcome: '你發現了 AI 數位分身作為夥伴。',
            reward: '🤖 AI 夥伴已啟動',
          },
        ],
      },
    ],
  },
  {
    id: 'justice',
    title: '正義之章',
    subtitle: '為無聲者發聲',
    description: '在黑暗的深處，有一群人正在等待救贖。',
    unlocksAt: 15,
    heroes: ['champion'],
    boss: {
      name: '血汗魔王',
      title: '剝削的化身',
      description: '由無數血汗工廠匯聚而成的怪物，代表著對勞工的殘酷剝削。',
      avatar: '👿',
    },
    rewards: [
      { type: 'card', value: 'soc-001' },
      { type: 'xp', value: 1000 },
      { type: 'title', value: '正義使者' },
    ],
    content: [
      {
        id: 'scene-1',
        type: 'narrative',
        speaker: '旁白',
        text: `在繁華都市的地下，隱藏著不為人知的黑暗。

無數工人被困在骯髒的工廠裡，
為了一點微薄的薪水，
犧牲了自己的健康和未來。

但現在，有人聽見了他們的呼聲...`,
        visual: 'factory',
      },
    ],
  },
  {
    id: 'order',
    title: '秩序之章',
    subtitle: '透明之光',
    description: '當黑箱操作成為常態，真相變得弥足珍貴。',
    unlocksAt: 30,
    heroes: ['master'],
    boss: {
      name: '黑箱巨龍',
      title: '隱瞞的化身',
      description: '盤踞在金融帝國頂端的巨龍，用謊言和隱瞞維護著自己的王國。',
      avatar: '🐉',
    },
    rewards: [
      { type: 'card', value: 'gov-001' },
      { type: 'xp', value: 2000 },
      { type: 'title', value: '治理大師' },
    ],
    content: [
      {
        id: 'scene-1',
        type: 'narrative',
        speaker: '旁白',
        text: `在權力的巔峰，真相被層層掩蓋。

決策者在陰影中操控著一切，
普通人的命運被寫在看不見的文件裡。

但陽光終將穿透黑暗...`,
        visual: 'corporate',
      },
    ],
  },
  {
    id: 'climate',
    title: '變革之章',
    subtitle: '為地球而戰',
    description: '當冰山融化，海平面上升，我們還有多少時間？',
    unlocksAt: 50,
    heroes: ['pioneer'],
    boss: {
      name: '溫室帝王',
      title: '氣候崩潰的化身',
      description: '由數十億噸二氧化碳凝聚而成的帝王，代表的正是人類對地球的傷害。',
      avatar: '👑',
    },
    rewards: [
      { type: 'card', value: 'cli-001' },
      { type: 'xp', value: 5000 },
      { type: 'title', value: '氣候英雄' },
    ],
    content: [
      {
        id: 'scene-1',
        type: 'narrative',
        speaker: '旁白',
        text: `這是最後的戰役。

當「熵增」集結了所有的力量，
當世界瀕臨崩潰的邊緣，

四位英雄終於集結——

綠色守護者、正義使者、治理大師、氣候先驅。

他們將聯合對抗這場世紀之戰。`,
        visual: 'final-battle',
      },
    ],
  },
];

export const StoryCampaign: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>(['awakening']);

  // 渲染英雄選擇
  const renderHeroSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">選擇你的英雄</h2>
        <p className="text-slate-400">每一個選擇，都將開啟不同的史詩旅程</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HERO_ARCHETYPES.map((hero, index) => (
          <motion.div
            key={hero.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedHero(hero.id)}
            className={`p-6 rounded-2xl border cursor-pointer transition-all ${
              selectedHero === hero.id
                ? `bg-${hero.color}-500/20 border-${hero.color}-500`
                : 'bg-slate-800/50 border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl">{hero.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{hero.name}</h3>
                  <span
                    className={`px-2 py-0.5 bg-${hero.color}-500/20 text-${hero.color}-400 rounded text-xs`}
                  >
                    {hero.title}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  {hero.backstory.slice(0, 100)}...
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Heart className="w-3 h-3 text-pink-400" />
                  <span>{hero.motivation}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedHero && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg"
        >
          開始史詩旅程
          <ChevronRight className="w-5 h-5 inline ml-2" />
        </motion.button>
      )}
    </div>
  );

  // 渲染劇情章節
  const renderChapterSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedHero(null)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← 返回英雄選擇
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="text-white font-medium">史詩劇情</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {STORY_CHAPTERS.map((chapter, index) => {
          const isUnlocked = unlockedChapters.includes(chapter.id);
          const isSelected = selectedChapter?.id === chapter.id;

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => isUnlocked && setSelectedChapter(chapter)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500'
                  : isUnlocked
                    ? 'bg-slate-800/50 border-white/10 hover:border-white/30'
                    : 'bg-slate-900/50 border-white/5 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      isUnlocked ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-slate-700'
                    }`}
                  >
                    {isUnlocked ? '📖' : '🔒'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{chapter.title}</h3>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                        第 {index + 1} 章
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{chapter.subtitle}</p>
                    <p className="text-xs text-slate-500">{chapter.description}</p>
                  </div>
                </div>

                {isUnlocked && <ChevronRight className="w-5 h-5 text-slate-400" />}
              </div>

              {/* 解鎖條件 */}
              {!isUnlocked && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-500">
                  <Target className="w-4 h-4" />
                  <span>需要達到 LV.{chapter.unlocksAt} 才能解鎖</span>
                </div>
              )}

              {/* 獎勵預覽 */}
              {isUnlocked && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4">
                  {chapter.rewards.slice(0, 3).map((reward, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-slate-400">
                      {reward.type === 'card' && '🎴'}
                      {reward.type === 'xp' && '⭐'}
                      {reward.type === 'title' && '🏆'}
                      <span>{typeof reward.value === 'string' ? reward.value : reward.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // 渲染劇情場景
  const renderStoryScene = () => {
    if (!selectedChapter) return null;

    const scene = selectedChapter.content[currentScene];

    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full">
          {/* 場景背景 */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-amber-500/30 overflow-hidden">
            {/* 頂部裝飾 */}
            <div className="h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500" />

            <div className="p-8">
              {/* 說話者 */}
              {scene.speaker && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-amber-400 font-medium">{scene.speaker}</span>
                </motion.div>
              )}

              {/* 劇情文字 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-8"
              >
                {scene.text.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-lg text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              {/* 選擇題 */}
              {scene.choices && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {scene.choices.map((choice, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-amber-500/50 text-left"
                    >
                      <span className="text-white">{choice.text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* 下一頁 */}
              {scene.type !== 'choice' && currentScene < selectedChapter.content.length - 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentScene(prev => prev + 1)}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold"
                >
                  繼續
                  <ChevronRight className="w-5 h-5 inline ml-2" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {!selectedHero && renderHeroSelection()}
        {selectedHero && !selectedChapter && renderChapterSelection()}
      </div>

      <AnimatePresence>{selectedChapter && renderStoryScene()}</AnimatePresence>
    </div>
  );
};

export default StoryCampaign;
