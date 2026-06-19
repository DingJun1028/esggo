import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle, Zap, Shield, Star } from 'lucide-react';

export interface OmniCardProps {
  id: string;
  type: 'event' | 'problem' | 'solution' | 'resource' | 'unit' | 'artifact' | 'enchantment' | 'legendary';
  title: string;
  description: string;
  esgCategory?: 'E' | 'S' | 'G';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  cost?: number;
  status?: 'active' | 'resolved' | 'pending';
  effects?: string[];
  aiInsight?: string;
  onActivate?: (cardId: string) => void;
  onResolve?: (cardId: string) => void;
  onHover?: (cardId: string) => void;
}

export const OmniCard: React.FC<OmniCardProps> = ({
  id,
  type,
  title,
  description,
  esgCategory,
  severity = 'medium',
  cost = 0,
  status = 'active',
  effects = [],
  aiInsight,
  onActivate,
  onResolve,
  onHover
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getCardTypeIcon = () => {
    switch (type) {
      case 'event': return <Zap className="w-4 h-4" />;
      case 'problem': return <AlertTriangle className="w-4 h-4" />;
      case 'solution': return <CheckCircle className="w-4 h-4" />;
      case 'resource': return <Star className="w-4 h-4" />;
      case 'unit': return <Shield className="w-4 h-4" />;
      case 'artifact': return <Sparkles className="w-4 h-4" />;
      case 'enchantment': return <Star className="w-4 h-4" />;
      case 'legendary': return <Sparkles className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCardColors = () => {
    switch (type) {
      case 'event': return 'from-blue-500 to-cyan-500 border-blue-400';
      case 'problem': return 'from-red-500 to-orange-500 border-red-400';
      case 'solution': return 'from-green-500 to-emerald-500 border-green-400';
      case 'resource': return 'from-yellow-500 to-amber-500 border-yellow-400';
      case 'unit': return 'from-purple-500 to-violet-500 border-purple-400';
      case 'artifact': return 'from-pink-500 to-rose-500 border-pink-400';
      case 'enchantment': return 'from-indigo-500 to-blue-500 border-indigo-400';
      case 'legendary': return 'from-amber-500 to-yellow-500 border-amber-400';
      default: return 'from-gray-500 to-gray-600 border-gray-400';
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getESGColor = () => {
    switch (esgCategory) {
      case 'E': return 'bg-green-500';
      case 'S': return 'bg-blue-500';
      case 'G': return 'bg-gold-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      className={`relative w-64 h-96 rounded-xl border-2 bg-gradient-to-br ${getCardColors()} shadow-lg cursor-pointer overflow-hidden`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.(id);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 卡牌背景效果 */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* ESG分類標記 */}
      {esgCategory && (
        <div className={`absolute top-2 left-2 w-6 h-6 rounded-full ${getESGColor()} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
          {esgCategory}
        </div>
      )}

      {/* 卡牌類型圖標 */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg">
        {getCardTypeIcon()}
      </div>

      {/* 卡牌內容 */}
      <div className="relative p-4 h-full flex flex-col">
        {/* 標題和類型 */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-white/70 uppercase tracking-wider">{type}</span>
            {severity !== 'medium' && (
              <span className={`text-xs font-bold ${getSeverityColor()}`}>
                {severity.toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
        </div>

        {/* 描述 */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-white/80 leading-relaxed">{description}</p>
        </div>

        {/* 效果列表 */}
        {effects.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs text-white/90 font-semibold mb-2">效果:</h4>
            <ul className="space-y-1">
              {effects.map((effect, index) => (
                <li key={index} className="text-xs text-white/70 flex items-start gap-1">
                  <span className="text-white/50">•</span>
                  {effect}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 成本和狀態 */}
        <div className="flex items-center justify-between">
          {cost > 0 && (
            <div className="flex items-center gap-1 text-white/90">
              <Star className="w-3 h-3" />
              <span className="text-sm font-bold">{cost}</span>
            </div>
          )}
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
            status === 'resolved' ? 'bg-green-500/20 text-green-300' :
            status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-blue-500/20 text-blue-300'
          }`}>
            {status === 'resolved' ? '已解決' :
             status === 'pending' ? '待處理' :
             '活躍'}
          </div>
        </div>

        {/* AI洞察提示 */}
        {isHovered && aiInsight && (
          <motion.div
            className="absolute -top-16 left-0 right-0 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs text-white/90">{aiInsight}</p>
          </motion.div>
        )}

        {/* 詳細資訊浮層 */}
        {showDetails && (
          <motion.div
            className="absolute inset-2 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">詳細分析</h4>
              {aiInsight && (
                <div className="text-xs text-white/80">
                  <strong>AI洞察:</strong> {aiInsight}
                </div>
              )}
              {type === 'problem' && onResolve && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolve(id);
                  }}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  啟動解決方案
                </button>
              )}
              {onActivate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActivate(id);
                  }}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  激活卡牌
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* 懸浮光效 */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
        />
      )}
    </motion.div>
  );
};

export default OmniCard;