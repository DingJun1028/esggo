/**
 * 📜 善向永續村 AI RPG 卡牌遊戲 - 任務布告欄組件
 * ============================================================================
 * [來源備註] 源自 DingJun (洪鼎竣) 的善向永續村設計
 * [零幻覺驗證] 透過 Hash Lock 確保 Vibe Coding 過程數據不位移
 * 
 * 液態玻璃效果 UI 組件
 * 遵循 IComponentCore 規範
 * ============================================================================
 */

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scroll, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  MapPin,
  Award,
  Star,
  RefreshCw,
  Play
} from 'lucide-react';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import { IVillageQuest } from '@/types/npc';
import { createVillageQuestManager } from '@/services/game/ImpactNexusGame';
import '../../styles/liquid-glass.css';

/**
 * 任務布告欄 props
 */
export interface QuestBoardProps {
  /** 是否展開 */
  isExpanded?: boolean;
  /** 當前語言 */
  language?: 'zh-TW' | 'en-US';
  /** 任務點擊處理 */
  onQuestSelect?: (quest: IVillageQuest) => void;
  /** 任務完成處理 */
  onQuestComplete?: (questId: string) => void;
  /** 類別名稱 */
  className?: string;
}

/**
 * 任務布告欄組件
 */
export const QuestBoard: React.FC<QuestBoardProps> = memo(({
  isExpanded = false,
  language = 'zh-TW',
  onQuestSelect,
  onQuestComplete,
  className = '',
}) => {
  const isZh = language === 'zh-TW';
  const [expanded, setExpanded] = useState(isExpanded);
  const [questManager] = useState(() => createVillageQuestManager());
  const [availableQuests, setAvailableQuests] = useState<IVillageQuest[]>([]);
  const [inProgressQuests, setInProgressQuests] = useState<IVillageQuest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<IVillageQuest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<IVillageQuest | null>(null);

  // IComponentCore 元數據
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'components/village/QuestBoard.tsx',
      '1.0.0',
      ['Quest', 'Village', 'Mission', 'LiquidGlass']
    )
  );

  // 載入任務
  useEffect(() => {
    setAvailableQuests(questManager.getAvailableQuests());
    setInProgressQuests(questManager.getInProgressQuests());
    setCompletedQuests(questManager.getCompletedQuests());
  }, [questManager]);

  // 翻譯
  const translations = {
    boardTitle: isZh ? '任務布告欄' : 'Quest Board',
    boardSubtitle: isZh ? '探索永續村的挑戰' : 'Explore the challenges of the Sustainable Village',
    availableQuests: isZh ? '可用任務' : 'Available Quests',
    inProgress: isZh ? '進行中' : 'In Progress',
    completed: isZh ? '已完成' : 'Completed',
    requiredRS: isZh ? '所需 RS' : 'Required RS',
    rewardRS: isZh ? '獎勵 RS' : 'Reward RS',
    startQuest: isZh ? '開始任務' : 'Start Quest',
    completeQuest: isZh ? '完成任務' : 'Complete Quest',
    selectQuest: isZh ? '選擇任務' : 'Select Quest',
    close: isZh ? '關閉' : 'Close',
  };

  // 任務狀態樣式
  const getQuestStatusStyle = (status: IVillageQuest['status']) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'in_progress':
        return 'bg-amber-500/20 text-amber-400';
      case 'completed':
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  // 任務狀態圖標
  const getQuestStatusIcon = (status: IVillageQuest['status']) => {
    switch (status) {
      case 'available':
        return <Play size={10} />;
      case 'in_progress':
        return <Clock size={10} />;
      case 'completed':
        return <CheckCircle size={10} />;
    }
  };

  const handleQuestClick = (quest: IVillageQuest) => {
    setSelectedQuest(quest);
    onQuestSelect?.(quest);
  };

  const handleStartQuest = (questId: string) => {
    questManager.startQuest(questId);
    setAvailableQuests(questManager.getAvailableQuests());
    setInProgressQuests(questManager.getInProgressQuests());
  };

  const handleCompleteQuest = (questId: string) => {
    const reward = questManager.completeQuest(questId);
    if (reward) {
      setInProgressQuests(questManager.getInProgressQuests());
      setCompletedQuests(questManager.getCompletedQuests());
      onQuestComplete?.(questId);
    }
  };

  const totalCompleted = completedQuests.length;
  const totalQuests = availableQuests.length + inProgressQuests.length + completedQuests.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      {/* 液態玻璃背景 */}
      <div className="liquid-glass-panel absolute inset-0" />

      {/* 內容容器 */}
      <div className="relative z-10 p-5">
        {/* 標題區 */}
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl">
              <Scroll size={20} className="text-amber-400" />
            </div>
            <div>
              <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-100">
                {translations.boardTitle}
              </h4>
              <p className="text-[10px] text-slate-400 uppercase">
                {translations.boardSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 完成進度 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-lg">
              <Award size={12} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-400">
                {totalCompleted}/{totalQuests}
              </span>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={20} className="text-slate-400" />
            </motion.div>
          </div>
        </div>

        {/* 展開內容 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* 任務列表 */}
              <div className="space-y-3 mb-4">
                {/* 可用任務 */}
                {availableQuests.length > 0 && (
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase mb-2 flex items-center gap-1">
                      <Star size={10} className="text-emerald-400" />
                      {translations.availableQuests}
                    </p>
                    <div className="space-y-2">
                      {availableQuests.map((quest) => (
                        <QuestCard
                          key={quest.id}
                          quest={quest}
                          status={quest.status}
                          isZh={isZh}
                          translations={translations}
                          onClick={() => handleQuestClick(quest)}
                          onAction={() => handleStartQuest(quest.id)}
                          actionLabel={translations.startQuest}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 進行中任務 */}
                {inProgressQuests.length > 0 && (
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase mb-2 flex items-center gap-1">
                      <Clock size={10} className="text-amber-400" />
                      {translations.inProgress}
                    </p>
                    <div className="space-y-2">
                      {inProgressQuests.map((quest) => (
                        <QuestCard
                          key={quest.id}
                          quest={quest}
                          status={quest.status}
                          isZh={isZh}
                          translations={translations}
                          onClick={() => handleQuestClick(quest)}
                          onAction={() => handleCompleteQuest(quest.id)}
                          actionLabel={translations.completeQuest}
                          isActionPrimary
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 已完成任務 */}
                {completedQuests.length > 0 && (
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase mb-2 flex items-center gap-1">
                      <CheckCircle size={10} className="text-slate-400" />
                      {translations.completed}
                    </p>
                    <div className="space-y-2">
                      {completedQuests.slice(0, 3).map((quest) => (
                        <QuestCard
                          key={quest.id}
                          quest={quest}
                          status={quest.status}
                          isZh={isZh}
                          translations={translations}
                          onClick={() => handleQuestClick(quest)}
                          isReadOnly
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 無可用任務 */}
                {availableQuests.length === 0 && inProgressQuests.length === 0 && (
                  <div className="text-center py-4">
                    <RefreshCw size={24} className="text-slate-500 mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400">
                      {isZh ? '暫無可用任務，敬請期待' : 'No available quests, stay tuned'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 已選任務詳情 */}
        <AnimatePresence>
          {selectedQuest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-3 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 rounded-xl border border-amber-500/20"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="text-xs font-bold text-amber-400">
                    {selectedQuest.title}
                  </h5>
                  <p className="text-[9px] text-slate-400 mt-1">
                    {selectedQuest.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedQuest(null)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <ChevronRight size={12} className="text-slate-400 rotate-45" />
                </button>
              </div>

              {/* 任務要求與獎勵 */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-[9px]">
                  <MapPin size={10} className="text-slate-400" />
                  <span className="text-slate-500">{translations.requiredRS}:</span>
                  <span className="text-amber-400">{selectedQuest.requiredRS}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px]">
                  <Award size={10} className="text-slate-400" />
                  <span className="text-slate-500">{translations.rewardRS}:</span>
                  <span className="text-emerald-400">+{selectedQuest.rewardRS}</span>
                </div>
              </div>

              {/* 建議 NPC */}
              {selectedQuest.suggestedNPC && (
                <div className="flex items-center gap-1 mt-2 text-[9px]">
                  <span className="text-slate-500">{isZh ? '建議 NPC:' : 'Suggested NPC:'}</span>
                  <span className="text-slate-300">{selectedQuest.suggestedNPC}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

QuestBoard.displayName = 'QuestBoard';

/**
 * 任務卡片子組件
 */
interface QuestCardProps {
  quest: IVillageQuest;
  status: IVillageQuest['status'];
  isZh: boolean;
  translations: Record<string, string>;
  onClick: () => void;
  onAction?: () => void;
  actionLabel?: string;
  isActionPrimary?: boolean;
  isReadOnly?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = memo(({
  quest,
  status,
  isZh,
  translations,
  onClick,
  onAction,
  actionLabel,
  isActionPrimary = false,
  isReadOnly = false,
}) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'in_progress':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <motion.div
      whileHover={!isReadOnly ? { scale: 1.01 } : {}}
      whileTap={!isReadOnly ? { scale: 0.99 } : {}}
      onClick={onClick}
      className={`relative p-3 rounded-xl cursor-pointer transition-all duration-300 ${
        isReadOnly 
          ? 'bg-white/5 border border-white/10 opacity-75' 
          : 'bg-white/5 hover:bg-white/10 border border-white/10'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase flex items-center gap-1 ${getStatusStyle()}`}>
              {status === 'available' && <Play size={8} />}
              {status === 'in_progress' && <Clock size={8} />}
              {status === 'completed' && <CheckCircle size={8} />}
              {status === 'available' ? translations.availableQuests :
               status === 'in_progress' ? translations.inProgress :
               translations.completed}
            </span>
          </div>
          <h5 className="text-xs font-bold text-slate-200 truncate">
            {quest.title}
          </h5>
          <p className="text-[9px] text-slate-400 truncate mt-0.5">
            {quest.description}
          </p>
        </div>

        {/* 獎勵顯示 */}
        {onAction && !isReadOnly && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className={`ml-2 px-2 py-1 text-[8px] font-bold rounded-lg transition-colors ${
              isActionPrimary
                ? 'bg-amber-500/30 text-amber-400 hover:bg-amber-500/50'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* RS 要求與獎勵 */}
      <div className="flex items-center gap-3 mt-2 text-[9px]">
        <span className="text-slate-500">{translations.requiredRS}: {quest.requiredRS}</span>
        <span className="text-emerald-400">+{quest.rewardRS} RS</span>
      </div>
    </motion.div>
  );
});

QuestCard.displayName = 'QuestCard';
