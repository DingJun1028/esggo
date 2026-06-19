/**
 * 🌍 善向永續村 - 客戶旅程完整體驗系統
 * Sustainability Village - Customer Journey & Service-as-Learning System
 * 
 * 世界觀整合：
 * - 知識即飼料 (Knowledge as Fuel)
 * - 鏡像戰鬥 (Mirror Combat)
 * - AI 數位分身 (Digital Twin Evolution)
 * - 服務即教學 (Service as Teaching)
 * - 知識集資產 (Knowledge-to-Asset)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Target, 
  Zap, 
  Trophy, 
  Users,
  Shield,
  Flame,
  Leaf,
  Heart,
  Star,
  ArrowRight,
  Card,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

import { useGameStore } from '@/stores/gameStore';
import { useOmniContext } from '@/hooks/useOmniContext';
import { CardDisplay } from './CardDisplay';
import { BattleArena } from './BattleArena';
import { DigitalTwin } from './DigitalTwin';
import { KnowledgeLibrary } from './KnowledgeLibrary';
import { EntropyTimer } from './EntropyTimer';
import { SacredContract } from './SacredContract';

import type { ESGCard, BattleState, PlayerState } from '@/types/game';

interface SustainabilityVillageProps {
  userId: string;
  mode?: 'journey' | 'battle' | 'library' | 'profile';
}

type JourneyStage = 'welcome' | 'tutorial' | 'collection' | 'battle' | 'evolution' | 'certification';

// 旅程節點
interface JourneyNode {
  id: string;
  stage: JourneyStage;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  unlocked: boolean;
  reward?: {
    type: 'card' | 'xp' | 'badge';
    value: string | number;
  };
}

// ESG 知識領域
interface KnowledgeDomain {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ReactNode;
  color: string;
  cards: number;
  mastered: number;
  masteryProgress: number;
}

export const SustainabilityVillage: React.FC<SustainabilityVillageProps> = ({
  userId,
  mode = 'journey'
}) => {
  const { t, i18n } = useTranslation();
  
  // 遊戲狀態
  const [currentStage, setCurrentStage] = useState<JourneyStage>('welcome');
  const [villageEntropy, setVillageEntropy] = useState(30); // 熵值 0-100
  const [villageLevel, setVillageLevel] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [battleActive, setBattleActive] = useState(false);

  // 旅程節點
  const journeyNodes: JourneyNode[] = [
    {
      id: 'welcome',
      stage: 'welcome',
      title: '歡迎來到善向永續村',
      description: '成為被選中的村長，帶領 AI 夥伴拯救世界',
      icon: <Sparkles className="w-6 h-6" />,
      completed: currentStage !== 'welcome',
      unlocked: true,
      reward: { type: 'badge', value: '新手村長' }
    },
    {
      id: 'tutorial',
      stage: 'tutorial',
      title: 'ESG 基礎訓練',
      description: '學習環境、社會、治理的基本概念',
      icon: <BookOpen className="w-6 h-6" />,
      completed: currentStage === 'tutorial',
      unlocked: currentStage !== 'welcome',
      reward: { type: 'card', value: 'earth-001' }
    },
    {
      id: 'collection',
      stage: 'collection',
      title: '知識收集',
      description: '收集 ESG 對策卡牌，建立你的知識庫',
      icon: <Card className="w-6 h-6" />,
      completed: currentStage === 'collection',
      unlocked: currentStage === 'tutorial' || currentStage === 'collection',
      reward: { type: 'xp', value: 500 }
    },
    {
      id: 'battle',
      stage: 'battle',
      title: '熵增對抗',
      description: '使用策略卡牌淨化村莊，戰勝高碳排魔王',
      icon: <Target className="w-6 h-6" />,
      completed: currentStage === 'battle',
      unlocked: currentStage === 'collection' || currentStage === 'battle',
      reward: { type: 'card', value: 'legendary' }
    },
    {
      id: 'evolution',
      stage: 'evolution',
      title: 'AI 進化',
      description: '你的 AI 數位分身將記錄並學習你的策略',
      icon: <Zap className="w-6 h-6" />,
      completed: currentStage === 'evolution',
      unlocked: currentStage === 'battle' || currentStage === 'evolution',
      reward: { type: 'xp', value: 1000 }
    },
    {
      id: 'certification',
      stage: 'certification',
      title: '神聖認證',
      description: '生成不可篡改的技能護照',
      icon: <Shield className="w-6 h-6" />,
      completed: currentStage === 'certification',
      unlocked: currentStage === 'evolution',
      reward: { type: 'badge', value: '永續大師' }
    }
  ];

  // 知識領域
  const knowledgeDomains: KnowledgeDomain[] = [
    {
      id: 'environment',
      name: '環境',
      nameEn: 'Environment',
      icon: <Leaf className="w-5 h-5" />,
      color: 'text-emerald-400',
      cards: 24,
      mastered: 8,
      masteryProgress: 33
    },
    {
      id: 'social',
      name: '社會',
      nameEn: 'Social',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-pink-400',
      cards: 18,
      mastered: 5,
      masteryProgress: 28
    },
    {
      id: 'governance',
      name: '治理',
      nameEn: 'Governance',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-blue-400',
      cards: 15,
      mastered: 6,
      masteryProgress: 40
    },
    {
      id: 'climate',
      name: '氣候',
      nameEn: 'Climate Action',
      icon: <Flame className="w-5 h-5" />,
      color: 'text-orange-400',
      cards: 20,
      mastered: 4,
      masteryProgress: 20
    }
  ];

  // 旅程節點完成處理
  const completeStage = (stage: JourneyStage) => {
    const stageOrder: JourneyStage[] = ['welcome', 'tutorial', 'collection', 'battle', 'evolution', 'certification'];
    const currentIndex = stageOrder.indexOf(stage);
    if (currentIndex < stageOrder.length - 1) {
      setCurrentStage(stageOrder[currentIndex + 1]);
    }
  };

  // 渲染當前視圖
  const renderCurrentView = () => {
    switch (mode) {
      case 'journey':
        return renderJourneyView();
      case 'battle':
        return <BattleArena onComplete={() => completeStage('battle')} />;
      case 'library':
        return <KnowledgeLibrary onSelect={(domain) => setSelectedDomain(domain)} />;
      case 'profile':
        return <DigitalTwin userId={userId} />;
      default:
        return renderJourneyView();
    }
  };

  // 旅程視圖
  const renderJourneyView = () => (
    <div className="space-y-6">
      {/* 熵增計時器 */}
      <EntropyTimer 
        entropy={villageEntropy} 
        onEntropyChange={setVillageEntropy}
        level={villageLevel}
      />

      {/* 村莊狀態 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">村莊等級</div>
              <div className="text-3xl font-bold text-emerald-400">{villageLevel}</div>
            </div>
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">已收集卡牌</div>
              <div className="text-3xl font-bold text-purple-400">77</div>
            </div>
            <Card className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">AI 親密度</div>
              <div className="text-3xl font-bold text-blue-400">85%</div>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* 知識領域選擇 */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          選擇知識領域
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {knowledgeDomains.map(domain => (
            <motion.button
              key={domain.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDomain(domain.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedDomain === domain.id
                  ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                  : 'bg-slate-800/50 border border-white/5 hover:border-white/20'
              }`}
            >
              <div className={`${domain.color} mb-2`}>{domain.icon}</div>
              <div className="font-medium text-white">{domain.name}</div>
              <div className="text-xs text-slate-400">{domain.nameEn}</div>
              <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${domain.masteryProgress}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {domain.mastered}/{domain.cards} 已掌握
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 旅程進度 */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          冒險旅程
        </h3>
        <div className="space-y-2">
          {journeyNodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: node.unlocked ? 1 : 0.5, x: 0 }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                node.completed
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : node.unlocked
                    ? 'bg-slate-800/50 border border-white/10'
                    : 'bg-slate-900/50 border border-white/5 opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                node.completed
                  ? 'bg-emerald-500 text-white'
                  : node.unlocked
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-slate-800 text-slate-600'
              }`}>
                {node.completed ? <Star className="w-5 h-5" /> : node.icon}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-white">{node.title}</div>
                <div className="text-xs text-slate-400">{node.description}</div>
              </div>

              {node.reward && (
                <div className="text-xs text-amber-400">
                  {node.reward.type === 'card' ? '🎴' : node.reward.type === 'xp' ? '⭐' : '🏆'}
                  {' '}{node.reward.value}
                </div>
              )}

              {node.unlocked && !node.completed && (
                <button
                  onClick={() => completeStage(node.stage)}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
                >
                  前往
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 服務即教學區塊 */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-white">💡 本期推薦學習</h4>
            <p className="text-sm text-slate-400 mt-1">
              「循環經濟」正在改變世界！學習如何將廢棄物轉化為資源，
              讓你的 AI 夥伴掌握最新的商業模式創新。
            </p>
            <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors">
              開始學習
            </button>
          </div>
        </div>
      </div>

      {/* 進入戰鬥 */}
      {selectedDomain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/10 border border-amber-500/30 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">
            遭遇「高碳排魔王」！
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            在 {knowledgeDomains.find(d => d.id === selectedDomain)?.name} 領域發現危機，
            使用正確的策略卡牌淨化它！
          </p>
          <button
            onClick={() => setBattleActive(true)}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-red-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-red-600 transition-all shadow-lg shadow-amber-500/20"
          >
            ⚔️ 進入戰鬥
          </button>
        </motion.div>
      )}
    </div>
  );

  // 教學模式
  if (showTutorial && currentStage === 'welcome') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-6"
        >
          <div className="text-center mb-6">
            <Sparkles className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">🌍 歡迎來到善向永續村</h2>
            <p className="text-slate-400 mt-2">
              你被選中成為村長，帶領 AI 夥伴拯救世界！
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <h3 className="font-bold text-emerald-400 mb-2">🎮 遊戲目標</h3>
              <p className="text-sm text-slate-300">
                收集 ESG 知識卡牌，使用策略淨化村莊，
                讓你的 AI 數位分身從 LV.1 進化到 LV.99！
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl">
              <h3 className="font-bold text-blue-400 mb-2">🃏 核心玩法</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• 收集「循環水系統」等對策卡牌</li>
                <li>• 對抗「高碳排魔王」等敵人</li>
                <li>• 每一個正確決策都讓 AI 變得更聰明</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowTutorial(false)}
            className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            開始冒險！
            <ArrowRight className="w-5 h-5 inline ml-2" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* 頂部導航 */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-white">善向永續村</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              🏆 LV.{villageLevel} 村長
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500" />
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {renderCurrentView()}
      </div>

      {/* 底部導航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-around">
          {[
            { id: 'journey', icon: <Target />, label: '旅程' },
            { id: 'battle', icon: <Zap />, label: '戰鬥' },
            { id: 'library', icon: <BookOpen />, label: '圖書館' },
            { id: 'profile', icon: <Users />, label: '檔案' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {/* 切換視圖 */}}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                mode === item.id
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 戰鬥模式彈窗 */}
      <AnimatePresence>
        {battleActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50"
          >
            <BattleArena
              enemyType={selectedDomain || 'carbon'}
              onComplete={() => {
                setBattleActive(false);
                completeStage('battle');
              }}
              onClose={() => setBattleActive(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SustainabilityVillage;
