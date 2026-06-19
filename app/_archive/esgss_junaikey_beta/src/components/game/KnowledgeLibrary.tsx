/**
 * 📚 聖典圖書館 - Sacred Library Knowledge System
 * 
 * 功能：
 * - ESG 知識卡牌收藏
 * - ISO 標準對照
 * - 企業真實案例
 * - 知識即力量收集
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter,
  Star,
  Lock,
  Unlock,
  ChevronRight,
  Leaf,
  Heart,
  Shield,
  Flame,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ESGCard } from '@/types/game';

interface KnowledgeLibraryProps {
  onSelect?: (domain: string) => void;
  onClose?: () => void;
}

// 卡牌收藏
const CARD_COLLECTION: Record<string, ESGCard[]> = {
  environment: [
    {
      id: 'env-001',
      name: '演算法造林',
      type: 'strategy',
      category: 'environment',
      power: 30,
      cost: 4,
      effect: '碳吸收增加',
      description: '結合 AI 優化植栽計劃，提升碳匯效率。台積電已在園區實踐此方案。',
      rarity: 'epic',
      isoReference: 'ISO-14064-1',
      caseStudy: '台積電「AI 造林計劃」減少園區碳足跡 15%'
    },
    {
      id: 'env-002',
      name: '循環水系統',
      type: 'strategy',
      category: 'environment',
      power: 25,
      cost: 3,
      effect: '水資源循環',
      description: '建立封閉式水循環系統，減少 80% 取水量。',
      rarity: 'rare',
      isoReference: 'ISO-14046',
      caseStudy: '友達光電水資源管理系統榮獲 2023 國家品質獎'
    },
    {
      id: 'env-003',
      name: '太陽能農場',
      type: 'strategy',
      category: 'environment',
      power: 28,
      cost: 4,
      effect: '再生能源',
      description: '架設大面積太陽能板，實現能源自主。',
      rarity: 'rare',
      isoReference: 'ISO-50001',
      caseStudy: '友達光電「AI 造林計劃」減少園區碳足跡 15%'
    },
    {
      id: 'env-004',
      name: '碳捕捉協議',
      type: 'strategy',
      category: 'environment',
      power: 35,
      cost: 5,
      effect: '直接減碳',
      description: '與工業夥伴實施碳捕集與封存技術。',
      rarity: 'legendary',
      isoReference: 'ISO-14067',
      caseStudy: '殼牌石油 CCS 計劃每年捕獲 100 萬噸 CO2'
    }
  ],
  social: [
    {
      id: 'soc-001',
      name: '公平貿易',
      type: 'strategy',
      category: 'social',
      power: 28,
      cost: 3,
      effect: '供應商合規',
      description: '確保供應鏈符合國際勞工標準，保障基本人權。',
      rarity: 'rare',
      isoReference: 'SA8000',
      caseStudy: 'Nespresso 公平貿易咖啡認證覆蓋 80% 供應商'
    },
    {
      id: 'soc-002',
      name: '多元共融',
      type: 'strategy',
      category: 'social',
      power: 25,
      cost: 3,
      effect: '員工福利',
      description: '建立多元化與包容性工作環境。',
      rarity: 'uncommon',
      isoReference: 'GRI-405',
      caseStudy: 'Microsoft 多元與包容策略提升員工滿意度 25%'
    },
    {
      id: 'soc-003',
      name: '社區投資',
      type: 'strategy',
      category: 'social',
      power: 22,
      cost: 2,
      effect: '社會回饋',
      description: '透過教育與社區計劃創造社會價值。',
      rarity: 'uncommon',
      isoReference: 'GRI-413',
      caseStudy: '台積電「惜食計劃」減少食物浪費 30%'
    }
  ],
  governance: [
    {
      id: 'gov-001',
      name: '透明供應鏈',
      type: 'strategy',
      category: 'governance',
      power: 22,
      cost: 2,
      effect: '可追溯性',
      description: '建立區塊鏈溯源系統，確保資訊透明。',
      rarity: 'uncommon',
      isoReference: 'ISO-20400',
      caseStudy: 'Walmart 區塊鏈追蹤系統減少食品召回時間 60%'
    },
    {
      id: 'gov-002',
      name: '零幻覺驗算',
      type: 'strategy',
      category: 'governance',
      power: 30,
      cost: 4,
      effect: '數據真實性',
      description: '第三方獨立碳排放審計，確保數據準確。',
      rarity: 'epic',
      isoReference: 'ISO-14064-3',
      caseStudy: '四大會計師事務所 ESG 查證業務增長 40%'
    },
    {
      id: 'gov-003',
      name: '風險管理',
      type: 'strategy',
      category: 'governance',
      power: 26,
      cost: 3,
      effect: '合規保障',
      description: '建立全面風險評估與應對機制。',
      rarity: 'rare',
      isoReference: 'COSO-ERM',
      caseStudy: '金控業 ESG 風險管理規範全面上路'
    }
  ],
  climate: [
    {
      id: 'cli-001',
      name: 'TCFD 揭露',
      type: 'strategy',
      category: 'climate',
      power: 32,
      cost: 4,
      effect: '風險揭露',
      description: '依據 TCFD 框架進行氣候風險揭露。',
      rarity: 'epic',
      isoReference: 'TCFD',
      caseStudy: '全球超過 2,800 家企業響應 TCFD 建議'
    },
    {
      id: 'cli-002',
      name: '科學基礎目標',
      type: 'strategy',
      category: 'climate',
      power: 35,
      cost: 5,
      effect: '減碳路徑',
      description: '設定符合巴黎協定的科學基礎減碳目標。',
      rarity: 'legendary',
      isoReference: 'SBTi',
      caseStudy: '全球超過 4,000 家企業通過 SBTi 驗證'
    }
  ]
};

const DOMAIN_CONFIG = {
  environment: { name: '環境', icon: <Leaf className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  social: { name: '社會', icon: <Heart className="w-5 h-5" />, color: 'text-pink-400', bg: 'bg-pink-500/20' },
  governance: { name: '治理', icon: <Shield className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  climate: { name: '氣候', icon: <Flame className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/20' }
};

export const KnowledgeLibrary: React.FC<KnowledgeLibraryProps> = ({
  onSelect,
  onClose
}) => {
  const { t } = useTranslation();
  
  const [selectedDomain, setSelectedDomain] = useState<string>('environment');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<ESGCard | null>(null);

  // 篩選卡牌
  const filteredCards = CARD_COLLECTION[selectedDomain]?.filter(card => {
    const matchesSearch = card.name.includes(searchQuery) || 
                         card.description.includes(searchQuery) ||
                         card.caseStudy?.includes(searchQuery);
    const matchesRarity = !filterRarity || card.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  }) || [];

  // 計算領域統計
  const getDomainStats = (domain: string) => {
    const cards = CARD_COLLECTION[domain] || [];
    return {
      total: cards.length,
      mastered: Math.floor(cards.length * 0.4)
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* 標題 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-bold text-white">聖典圖書館</h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* 搜尋 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="搜尋卡牌、ISO 標準或企業案例..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* 稀有度篩選 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['all', 'legendary', 'epic', 'rare', 'uncommon'].map(rarity => (
          <button
            key={rarity}
            onClick={() => setFilterRarity(rarity === 'all' ? null : rarity)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              (!filterRarity && rarity === 'all') || filterRarity === rarity
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/10'
            }`}
          >
            {rarity === 'all' ? '全部' : rarity}
          </button>
        ))}
      </div>

      {/* 領域選擇 */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {Object.entries(DOMAIN_CONFIG).map(([key, config]) => {
          const stats = getDomainStats(key);
          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDomain(key)}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedDomain === key
                  ? `${config.bg} border-2 border-${config.color.split('-')[1]}-500`
                  : 'bg-slate-800/50 border border-white/10'
              }`}
            >
              <div className={`${config.color} flex justify-center mb-2`}>{config.icon}</div>
              <div className="text-xs text-white font-medium">{config.name}</div>
              <div className="text-xs text-slate-400">{stats.mastered}/{stats.total}</div>
            </motion.button>
          );
        })}
      </div>

      {/* 卡牌列表 */}
      <div className="space-y-3">
        {filteredCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedCard(card)}
            whileHover={{ scale: 1.01 }}
            className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-amber-500/30 cursor-pointer transition-all"
          >
            <div className="flex items-start gap-4">
              {/* 卡牌稀有度指示 */}
              <div className={`w-1 h-16 rounded-full ${
                card.rarity === 'legendary' ? 'bg-amber-500' :
                card.rarity === 'epic' ? 'bg-purple-500' :
                card.rarity === 'rare' ? 'bg-blue-500' :
                'bg-slate-500'
              }`} />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{card.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      card.category === 'environment' ? 'bg-emerald-500/20 text-emerald-400' :
                      card.category === 'social' ? 'bg-pink-500/20 text-pink-400' :
                      card.category === 'governance' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {card.category}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    card.rarity === 'legendary' ? 'bg-amber-500/30 text-amber-300' :
                    card.rarity === 'epic' ? 'bg-purple-500/30 text-purple-300' :
                    card.rarity === 'rare' ? 'bg-blue-500/30 text-blue-300' :
                    'bg-slate-500/30 text-slate-300'
                  }`}>
                    {card.rarity}
                  </span>
                </div>

                <p className="text-sm text-slate-400 mb-3">{card.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>⚔️ {card.power}</span>
                    <span>⚡ {card.cost}</span>
                    <span>📋 {card.isoReference}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 知識即力量提示 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-xl border border-amber-500/20">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">💡 知識即力量</h4>
            <p className="text-xs text-slate-400 mt-1">
              收集更多卡牌並學習其背後的 ISO 標準與企業案例，
              讓你的 AI 數位分身變得更強大！
            </p>
          </div>
        </div>
      </div>

      {/* 卡牌詳情彈窗 */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-lg w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* 卡牌封面 */}
              <div className={`p-6 text-center relative overflow-hidden ${
                selectedCard.category === 'environment' ? 'bg-gradient-to-br from-emerald-900/50 to-slate-900' :
                selectedCard.category === 'social' ? 'bg-gradient-to-br from-pink-900/50 to-slate-900' :
                selectedCard.category === 'governance' ? 'bg-gradient-to-br from-blue-900/50 to-slate-900' :
                'bg-gradient-to-br from-orange-900/50 to-slate-900'
              }`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 right-4 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl" />
                </div>
                
                <div className="relative">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs mb-3 ${
                    selectedCard.rarity === 'legendary' ? 'bg-amber-500/30 text-amber-300' :
                    selectedCard.rarity === 'epic' ? 'bg-purple-500/30 text-purple-300' :
                    'bg-blue-500/30 text-blue-300'
                  }`}>
                    {selectedCard.rarity.toUpperCase()}
                  </span>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedCard.name}</h2>
                  <p className="text-sm text-slate-400">{selectedCard.effect}</p>
                </div>
              </div>

              {/* 卡牌內容 */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-300">{selectedCard.description}</p>

                {/* 數值 */}
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{selectedCard.power}</div>
                    <div className="text-xs text-slate-500">攻擊力</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">{selectedCard.cost}</div>
                    <div className="text-xs text-slate-500">能量消耗</div>
                  </div>
                </div>

                {/* ISO 標準 */}
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-xs text-blue-400 mb-1">📋 對應 ISO 標準</div>
                  <div className="font-mono text-sm text-white">{selectedCard.isoReference}</div>
                </div>

                {/* 企業案例 */}
                {selectedCard.caseStudy && (
                  <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="text-xs text-emerald-400 mb-1">🏢 真實企業案例</div>
                    <div className="text-sm text-white">{selectedCard.caseStudy}</div>
                  </div>
                )}

                {/* 選擇按鈕 */}
                <button
                  onClick={() => onSelect?.(selectedDomain)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  學習並收集此卡牌
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KnowledgeLibrary;
