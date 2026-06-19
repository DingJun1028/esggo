/**
 * 🎴 ESG 知識卡牌展示 - Card Display Component
 * 
 * 功能：
 * - 卡牌視覺化渲染
 * - 稀有度光效
 * - 互動翻牌動畫
 * - 收集狀態追蹤
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Star,
  Lock,
  CheckCircle,
  Info,
  X
} from 'lucide-react';

import type { ESGCard } from '@/types/game';

interface CardDisplayProps {
  card: ESGCard;
  collected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const RARITY_CONFIG = {
  legendary: {
    gradient: 'from-amber-500 via-yellow-500 to-amber-600',
    border: 'border-amber-500',
    glow: 'shadow-amber-500/50',
    particles: ['✨', '⭐', '🌟']
  },
  epic: {
    gradient: 'from-purple-500 via-violet-500 to-purple-600',
    border: 'border-purple-500',
    glow: 'shadow-purple-500/50',
    particles: ['✦', '✧', '⬡']
  },
  rare: {
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    border: 'border-blue-500',
    glow: 'shadow-blue-500/50',
    particles: ['◆', '◇', '○']
  },
  uncommon: {
    gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
    border: 'border-emerald-500',
    glow: 'shadow-emerald-500/50',
    particles: ['●', '○', '◎']
  },
  common: {
    gradient: 'from-slate-500 via-gray-500 to-slate-600',
    border: 'border-slate-500',
    glow: 'shadow-slate-500/50',
    particles: ['·', '·', '·']
  }
};

const CATEGORY_ICONS = {
  environment: '🌲',
  social: '⚖️',
  governance: '🏢',
  climate: '🔥',
  strategy: '🎯',
  event: '⚡'
};

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  collected = true,
  onClick,
  size = 'md',
  showDetails = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const rarity = RARITY_CONFIG[card.rarity] || RARITY_CONFIG.common;
  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-40 h-56',
    lg: 'w-56 h-80'
  };

  const handleClick = () => {
    if (showDetails) {
      setShowModal(true);
    } else if (onClick) {
      onClick();
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`relative ${sizeClasses[size]} cursor-pointer perspective-1000`}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full relative preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 正面 - 卡牌封面 */}
          <div
            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${rarity.gradient} p-1 shadow-xl ${rarity.glow}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* 內層背景 */}
            <div className="w-full h-full rounded-lg bg-slate-900/90 flex flex-col overflow-hidden">
              {/* 頂部裝飾 */}
              <div className={`h-1/3 bg-gradient-to-b ${rarity.gradient} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">{CATEGORY_ICONS[card.category]}</span>
                </div>
                {/* 稀有度標記 */}
                <div className="absolute top-2 right-2">
                  {card.rarity === 'legendary' && <Sparkles className="w-4 h-4 text-amber-300" />}
                  {card.rarity === 'epic' && <Star className="w-4 h-4 text-purple-300" />}
                </div>
              </div>

              {/* 中間區域 */}
              <div className="flex-1 p-3 flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-white text-center leading-tight mb-2">
                  {card.name}
                </h3>
                <div className="text-xs text-slate-400 text-center line-clamp-2">
                  {card.effect}
                </div>
              </div>

              {/* 底部資訊 */}
              <div className="p-2 border-t border-white/10 flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  card.category === 'environment' ? 'bg-emerald-500/20 text-emerald-400' :
                  card.category === 'social' ? 'bg-pink-500/20 text-pink-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {card.category}
                </span>
                <span className="text-xs text-amber-400">⚔️ {card.power}</span>
              </div>
            </div>
          </div>

          {/* 背面 - 卡牌詳情 */}
          <div
            className={`absolute inset-0 rounded-xl bg-slate-800 p-4 border-2 ${rarity.border} shadow-xl`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="h-full flex flex-col">
              <div className="text-center mb-3">
                <span className="text-2xl">{CATEGORY_ICONS[card.category]}</span>
              </div>
              
              <h3 className="text-lg font-bold text-white text-center mb-2">
                {card.name}
              </h3>
              
              <p className="text-xs text-slate-400 text-center mb-3 flex-1">
                {card.description}
              </p>

              {/* 數值 */}
              <div className="flex justify-center gap-4 mb-3">
                <div className="text-center">
                  <div className="text-sm font-bold text-red-400">{card.power}</div>
                  <div className="text-xs text-slate-500">攻擊力</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-amber-400">{card.cost}</div>
                  <div className="text-xs text-slate-500">消耗</div>
                </div>
              </div>

              {/* ISO 標準 */}
              <div className="text-center text-xs text-blue-400 mb-2">
                📋 {card.isoReference}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 未收集遮罩 */}
        {!collected && (
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <span className="text-xs text-slate-400">未解鎖</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* 卡牌詳情彈窗 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <CardDisplay 
                card={card} 
                collected={collected} 
                size="lg"
              />
              
              {/* 詳細資訊 */}
              <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2">{card.name}</h4>
                <p className="text-sm text-slate-400 mb-3">{card.description}</p>
                
                {/* 企業案例 */}
                {card.caseStudy && (
                  <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="text-xs text-emerald-400 mb-1">🏢 企業案例</div>
                    <div className="text-sm text-white">{card.caseStudy}</div>
                  </div>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full mt-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  關閉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 卡牌收集網格
interface CardGridProps {
  cards: ESGCard[];
  collectedIds: string[];
  onCardClick?: (card: ESGCard) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  collectedIds,
  onCardClick
}) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
      {cards.map(card => (
        <CardDisplay
          key={card.id}
          card={card}
          collected={collectedIds.includes(card.id)}
          onClick={() => onCardClick?.(card)}
          size="sm"
          showDetails
        />
      ))}
    </div>
  );
};

export default CardDisplay;
