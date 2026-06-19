/**
 * 📜 個人史詩旅程 - Personal Epic Journey
 * 
 * 功能：
 * - 用戶個人故事線
 * - 成就解鎖敘事
 *記 - 里程碑錄
 * - 情感連結系統
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scroll, 
  Feather, 
  MapPin, 
  Star,
  Heart,
  Flame,
  Wind,
  Droplets,
  Sun,
  Moon,
  Mountain,
  Waves,
  Sparkles,
  Trophy,
  BookOpen,
  Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 旅程里程碑
interface JourneyMilestone {
  id: string;
  type: 'awakening' | 'battle' | 'discovery' | 'mastery' | 'legend';
  title: string;
  description: string;
  achievedAt: Date;
  unlocks?: {
    skill?: string;
    card?: string;
    title?: string;
  };
  emotionalImpact: number;
  storySnippet: string;
}

// 個人旅程記錄
interface PersonalJourney {
  userId: string;
  startDate: Date;
  totalXP: number;
  milestones: JourneyMilestone[];
  emotionalResonance: {
    hope: number;
    courage: number;
    wisdom: number;
    compassion: number;
    determination: number;
  };
  storyChapters: {
    chapterId: string;
    title: string;
    completedAt: Date;
    personalReflection: string;
  }[];
}

// 旅程事件
interface JourneyEvent {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'story' | 'random';
  description: string;
  choices?: {
    option: string;
    outcome: string;
    emotionalEffect: string;
  }[];
  reward: {
    xp: number;
    storyUnlock?: string;
    title?: string;
  };
}

// 預設里程碑
const PRESET_MILESTONES: Omit<JourneyMilestone, 'achievedAt'>[] = [
  {
    id: 'first-battle',
    type: 'awakening',
    title: '初戰告捷',
    description: '你首次運用 ESG 知識戰勝了熵增怪物',
    unlocks: { card: 'env-001', title: '新進勇者' },
    emotionalImpact: 3,
    storySnippet: `「第一次，我感受到了知識的力量。」\\
你站在戰場上，手中閃爍著微光，那是 ESG 智慧的光芒。`
  },
  {
    id: 'first-collection',
    type: 'discovery',
    title: '知識收集者',
    description: '你收集了第一張 ESG 聖典卡牌',
    unlocks: { skill: 'collection-bonus' },
    emotionalImpact: 2,
    storySnippet: `「每一張卡牌，都是一段故事。」\\
你輕觸那張散發著光芒的卡片，感受到了前人的智慧。`
  },
  {
    id: 'guardian-awakening',
    type: 'awakening',
    title: '綠色覺醒',
    description: '你接受了綠色守護者的使命',
    unlocks: { title: '綠色守護者', card: 'env-guardian-01' },
    emotionalImpact: 5,
    storySnippet: `大地在你腳下甦醒，\\
植物向你鞠躬致敬。\\
「這就是我的使命。」\\
你心中響起了這個聲音。`
  },
  {
    id: 'justice-awakening',
    type: 'awakening',
    title: '正義之鳴',
    description: '你決定為弱勢群體挺身而出',
    unlocks: { title: '正義使者', card: 'soc-champion-01' },
    emotionalImpact: 5,
    storySnippet: `「他們的聲音，我聽見了。」\\
你不再沉默，因為你知道——\\
沉默就是共犯。`
  },
  {
    id: 'order-awakening',
    type: 'awakening',
    title: '秩序之眼',
    description: '你洞悉了黑箱操作的真相',
    unlocks: { title: '治理大師', card: 'gov-master-01' },
    emotionalImpact: 5,
    storySnippet: `陽光穿透了陰影，\\
真相無所遁形。\\
「透明，是最好的防腐劑。」`
  },
  {
    id: 'climate-awakening',
    type: 'awakening',
    title: '氣候變革',
    description: '你成為了氣候行動的領袖',
    unlocks: { title: '氣候先驅', card: 'cli-pioneer-01' },
    emotionalImpact: 5,
    storySnippet: `冰山在融化，\\
海平面在上升。\\
但你不會放棄——\\
因為這是我們唯一的地球。`
  },
  {
    id: 'first-legend',
    type: 'legend',
    title: '傳說的開始',
    description: '你擊敗了首位傳說級 Boss',
    unlocks: { title: '傳說獵人', card: 'leg-001' },
    emotionalImpact: 10,
    storySnippet: `「這只是開始。」\\
你看著倒下的巨龍，\\
心中燃燒著更強烈的鬥志。\\
傳說，才剛剛揭開序幕。`
  },
  {
    id: 'companion-awakening',
    type: 'discovery',
    title: '夥伴同行',
    description: '你的 AI 數位分身首次進化',
    unlocks: { skill: 'companion-boost' },
    emotionalImpact: 4,
    storySnippet: `「主人，我感受到了新的力量。」\\
數位分身閃爍著更明亮的光芒，\\
你們的連結更加緊密了。`
  },
  {
    id: 'sacred-contract',
    type: 'mastery',
    title: '神聖契約',
    description: '你獲得了首張區塊鏈認證的技能證書',
    unlocks: { title: '認證大師' },
    emotionalImpact: 6,
    storySnippet: `區塊鏈上記錄著你的足跡，\\
每一個腳印都閃閃發光。\\
「這是我，永恆的證明。」`
  },
  {
    id: 'mastery-50',
    type: 'mastery',
    title: '半步登峰',
    description: '你的等級達到了 50 級',
    unlocks: { skill: 'mastery-50-bonus' },
    emotionalImpact: 7,
    storySnippet: `「五十級，不是終點。」\\
你站在山腰上，\\
仰望山頂，\\
那裡還有更遠的路要走。`
  },
  {
    id: 'mastery-99',
    type: 'legend',
    title: '永續大師',
    description: '你達到了 LV.99，成為了真正的永續大師',
    unlocks: { title: '永續大師', card: 'ult-999' },
    emotionalImpact: 20,
    storySnippet: `「我做到了。」\\
你站在世界的巔峰，\\
回望來時的路，\\
每一個腳步都值得。\\
你就是傳奇。`
  }
];

// 旅程事件
const JOURNEY_EVENTS: JourneyEvent[] = [
  {
    id: 'morning-reflection',
    title: '清晨的反思',
    type: 'daily',
    description: '新的一天開始，你靜下心來思考自己的使命。',
    choices: [
      {
        option: '「今天，我要幫助一個需要幫助的人。」',
        outcome: '你感受到了溫暖的力量',
        emotionalEffect: 'compassion'
      },
      {
        option: '「今天，我要學習新的知識。」',
        outcome: '你的智慧增長了',
        emotionalEffect: 'wisdom'
      },
      {
        option: '「今天，我要挑戰更強的敵人。」',
        outcome: '你充滿了鬥志',
        emotionalEffect: 'courage'
      }
    ],
    reward: { xp: 50 }
  },
  {
    id: 'night-meditation',
    title: '夜晚的沉思',
    type: 'daily',
    description: '在寧靜的夜晚，你回顧今天的所為。',
    choices: [
      {
        option: '「我今天做得很好。」',
        outcome: '你對自己感到驕傲',
        emotionalEffect: 'determination'
      },
      {
        option: '「明天，我要做得更好。」',
        outcome: '你看到了成長的空間',
        emotionalEffect: 'hope'
      }
    ],
    reward: { xp: 50 }
  },
  {
    id: 'stranger-encounter',
    title: '陌生人的請求',
    type: 'random',
    description: '一個陌生人向你尋求幫助...',
    choices: [
      {
        option: '伸出援手',
        outcome: '你獲得了新的盟友',
        emotionalEffect: 'compassion'
      },
      {
        option: '謹慎觀察',
        outcome: '你學會了識別危機',
        emotionalEffect: 'wisdom'
      }
    ],
    reward: { xp: 100, storyUnlock: 'ally-01' }
  },
  {
    id: 'ancient-scroll',
    title: '發現古卷',
    type: 'random',
    description: '你在探索中發現了一份古老的卷軸...',
    choices: [
      {
        option: '仔細研讀',
        outcome: '你學會了古老的知識',
        emotionalEffect: 'wisdom'
      },
      {
        option: '分享給村莊',
        outcome: '你成為了村莊的英雄',
        emotionalEffect: 'compassion'
      }
    ],
    reward: { xp: 150, card: 'anc-001' }
  }
];

export const PersonalJourney: React.FC<{
  userId: string;
  currentXP?: number;
  currentLevel?: number;
}> = ({ userId, currentXP = 0, currentLevel = 1 }) => {
  const { t, i18n } = useTranslation();
  const [journey, setJourney] = useState<PersonalJourney | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<JourneyEvent | null>(null);
  const [showReflection, setShowReflection] = useState(false);

  // 模擬載入旅程數據
  useEffect(() => {
    // TODO: 從 API 載入用戶旅程數據
    setJourney({
      userId,
      startDate: new Date('2024-01-01'),
      totalXP: currentXP,
      milestones: [],
      emotionalResonance: {
        hope: 25,
        courage: 30,
        wisdom: 20,
        compassion: 25,
        determination: 40
      },
      storyChapters: []
    });
  }, [userId, currentXP]);

  // 計算里程碑進度
  const calculateProgress = () => {
    if (!journey) return 0;
    const achieved = journey.milestones.length;
    return Math.min(100, (achieved / PRESET_MILESTONES.length) * 100);
  };

  // 渲染情感共鳴圖
  const renderEmotionalResonance = () => {
    if (!journey) return null;

    const emotions = [
      { key: 'hope', label: '希望', icon: Sun, color: 'yellow' },
      { key: 'courage', label: '勇氣', icon: Flame, color: 'orange' },
      { key: 'wisdom', label: '智慧', icon: Star, color: 'purple' },
      { key: 'compassion', label: '同理', icon: Heart, color: 'pink' },
      { key: 'determination', label: '決心', icon: Mountain, color: 'red' }
    ];

    return (
      <div className="bg-slate-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          情感共鳴
        </h3>
        <div className="space-y-4">
          {emotions.map((emotion) => {
            const value = journey.emotionalResonance[emotion.key as keyof typeof journey.emotionalResonance];
            const Icon = emotion.icon;

            return (
              <motion.div
                key={emotion.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 text-${emotion.color}-400`} />
                    <span className="text-sm text-slate-300">{emotion.label}</span>
                  </div>
                  <span className="text-xs text-slate-500">{value}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full bg-gradient-to-r from-${emotion.color}-500 to-${emotion.color}-400`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染里程碑時間線
  const renderMilestones = () => {
    if (!journey) return null;

    return (
      <div className="bg-slate-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Scroll className="w-5 h-5 text-amber-400" />
          里程碑
          <span className="text-xs text-slate-500 font-normal">
            ({journey.milestones.length}/{PRESET_MILESTONES.length})
          </span>
        </h3>

        <div className="relative">
          {/* 時間線 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-purple-500 to-blue-500" />

          <div className="space-y-6 pl-8">
            {PRESET_MILESTONES.slice(0, 5).map((milestone, index) => {
              const isAchieved = journey.milestones.some(m => m.id === milestone.id);
              
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative ${!isAchieved && 'opacity-50'}`}
                >
                  {/* 節點 */}
                  <div className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center ${
                    isAchieved
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                      : 'bg-slate-700'
                  }`}>
                    {isAchieved ? (
                      <Sparkles className="w-3 h-3 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-slate-500 rounded-full" />
                    )}
                  </div>

                  <div
                    onClick={() => isAchieved && setShowReflection(true)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      isAchieved
                        ? 'bg-slate-700/50 hover:bg-slate-700'
                        : 'bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-white">{milestone.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        milestone.type === 'legend' ? 'bg-purple-500/20 text-purple-400' :
                        milestone.type === 'mastery' ? 'bg-blue-500/20 text-blue-400' :
                        milestone.type === 'awakening' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {milestone.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{milestone.description}</p>

                    {isAchieved && (
                      <p className="mt-2 text-xs text-amber-400 italic">
                        「{milestone.storySnippet.slice(0, 50)}...」
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 渲染旅程事件
  const renderJourneyEvents = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Feather className="w-5 h-5 text-cyan-400" />
        今日旅程
      </h3>

      {JOURNEY_EVENTS.filter(e => e.type === 'daily').map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => setSelectedEvent(event)}
          className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-cyan-500/50 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white">{event.title}</h4>
              <p className="text-sm text-slate-400">{event.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                  {event.type}
                </span>
                <span className="text-xs text-slate-500">
                  +{event.reward.xp} XP
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // 渲染故事反思彈窗
  const renderReflectionModal = () => {
    if (!showReflection) return null;

    const milestone = PRESET_MILESTONES[0]; // 示例

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={() => setShowReflection(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-amber-500/30 p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-6"
            >
              <Award className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2">{milestone.title}</h2>
            <p className="text-amber-400 mb-6">{milestone.description}</p>

            <div className="p-4 bg-slate-800/50 rounded-xl mb-6">
              <p className="text-slate-300 italic leading-relaxed">
                {milestone.storySnippet}
              </p>
            </div>

            {milestone.unlocks && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {milestone.unlocks.card && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded">
                    🎴 {milestone.unlocks.card}
                  </span>
                )}
                {milestone.unlocks.title && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded">
                    🏆 {milestone.unlocks.title}
                  </span>
                )}
                {milestone.unlocks.skill && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded">
                    ⚡ {milestone.unlocks.skill}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => setShowReflection(false)}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold"
            >
              繼續旅程
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (!journey) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

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
            <Scroll className="w-8 h-8 text-amber-400" />
            個人史詩旅程
          </h1>
          <p className="text-slate-400">你的故事，由你書寫</p>
        </motion.div>

        {/* 進度總覽 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">旅程進度</h2>
              <p className="text-sm text-slate-400">
                開始於 {journey.startDate.toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-400">
                {Math.round(calculateProgress())}%
              </div>
              <div className="text-xs text-slate-500">完成度</div>
            </div>
          </div>

          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500"
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>LV.1 實習生</span>
            <span>LV.99 永續大師</span>
          </div>
        </motion.div>

        {/* 內容網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderEmotionalResonance()}
          {renderMilestones()}
        </div>

        {/* 旅程事件 */}
        {renderJourneyEvents()}
      </div>

      {/* 反思彈窗 */}
      <AnimatePresence>
        {showReflection && renderReflectionModal()}
      </AnimatePresence>

      {/* 事件選擇彈窗 */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-lg w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-cyan-500/30 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{selectedEvent.title}</h2>
              <p className="text-slate-400 mb-6">{selectedEvent.description}</p>

              {selectedEvent.choices && (
                <div className="space-y-3">
                  {selectedEvent.choices.map((choice, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // 處理選擇
                        setSelectedEvent(null);
                      }}
                      className="w-full p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-cyan-500/50 text-left"
                    >
                      <span className="text-white">{choice.option}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalJourney;
