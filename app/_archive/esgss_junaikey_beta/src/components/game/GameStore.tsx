/**
 * 🎮 善向永續村遊戲商店
 * Sustainability Village Game Store
 * 
 * 功能：
 * - 卡牌包購買
 * - 消耗品商店
 * - 貨幣管理
 * - 每日/每週特惠
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Coins, 
  Gift, 
  Package,
  X,
  Check,
  Sparkles
} from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'card_pack' | 'consumable' | 'cosmetic';
  price: number;
  rarity?: string;
  effect?: string;
  limited?: boolean;
  limitedCount?: number;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'pack-basic',
    name: '基礎卡包',
    description: '隨機 3 張普通/罕見卡牌',
    type: 'card_pack',
    price: 100,
    rarity: 'common-rare'
  },
  {
    id: 'pack-advanced',
    name: '進階卡包',
    description: '隨機 3 張罕見/史詩卡牌',
    type: 'card_pack',
    price: 300,
    rarity: 'rare-epic'
  },
  {
    id: 'pack-legendary',
    name: '傳說卡包',
    description: '保證 1 張傳說卡牌 + 2 張史詩卡牌',
    type: 'card_pack',
    price: 1000,
    rarity: 'legendary',
    limited: true,
    limitedCount: 5
  },
  {
    id: 'energy-potion',
    name: '能量藥水',
    description: '恢復 50 點能量',
    type: 'consumable',
    price: 50,
    effect: '+50 energy'
  },
  {
    id: 'xp-potion',
    name: '經驗藥水',
    description: '立即獲得 500 經驗值',
    type: 'consumable',
    price: 150,
    effect: '+500 xp'
  },
  {
    id: 'entropy-potion',
    name: '淨化藥水',
    description: '降低村莊熵值 30%',
    type: 'consumable',
    price: 200,
    effect: '-30% entropy'
  }
];

// 特惠商品
const SPECIAL_OFFERS = [
  {
    id: 'weekly-bundle',
    name: '每週超值包',
    description: '10 張隨機卡牌 + 1000 經驗值',
    originalPrice: 800,
    salePrice: 500,
    expiresIn: '2天'
  }
];

interface GameStoreProps {
  userId: string;
  currency: number;
  onPurchase: (itemId: string, price: number) => void;
  onClose: () => void;
}

export const GameStore: React.FC<GameStoreProps> = ({
  userId,
  currency,
  onPurchase,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'packs' | 'consumables' | 'special'>('packs');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const handlePurchase = async (item: ShopItem) => {
    if (currency < item.price) {
      alert('貨幣不足！');
      return;
    }

    setSelectedItem(item);
    setShowPurchaseConfirm(true);
  };

  const confirmPurchase = () => {
    if (selectedItem) {
      setPurchasingId(selectedItem.id);
      setTimeout(() => {
        onPurchase(selectedItem.id, selectedItem.price);
        setPurchasingId(null);
        setShowPurchaseConfirm(false);
        setSelectedItem(null);
      }, 1000);
    }
  };

  const filteredItems = SHOP_ITEMS.filter(item => {
    if (activeTab === 'packs') return item.type === 'card_pack';
    if (activeTab === 'consumables') return item.type === 'consumable';
    return false;
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl overflow-hidden"
      >
        {/* 頂部標題 */}
        <div className="relative p-6 bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <ShoppingCart className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">遊戲商店</h2>
              <div className="flex items-center gap-2 text-amber-400">
                <Coins className="w-4 h-4" />
                <span className="font-mono">{currency} 金幣</span>
              </div>
            </div>
          </div>
        </div>

        {/* 特惠 banner */}
        {SPECIAL_OFFERS.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-y border-red-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-red-400" />
                <div>
                  <div className="font-bold text-white">{SPECIAL_OFFERS[0].name}</div>
                  <div className="text-xs text-red-400">限時特惠 • 剩餘 {SPECIAL_OFFERS[0].expiresIn}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 line-through">{SPECIAL_OFFERS[0].originalPrice}</span>
                <span className="text-xl font-bold text-amber-400">{SPECIAL_OFFERS[0].salePrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* 標籤導航 */}
        <div className="flex gap-2 p-4 border-b border-white/10">
          {[
            { id: 'packs', label: '卡牌包', icon: <Package className="w-4 h-4" /> },
            { id: 'consumables', label: '消耗品', icon: <Gift className="w-4 h-4" /> },
            { id: 'special', label: '特惠', icon: <Sparkles className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 商品列表 */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border transition-all ${
                  currency < item.price
                    ? 'bg-slate-800/30 border-white/5 opacity-60'
                    : 'bg-slate-800/50 border-white/10 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-lg">{item.type === 'card_pack' ? '🎴' : '🧪'}</span>
                  {item.limited && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                      限量 {item.limitedCount}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{item.description}</p>

                {item.effect && (
                  <div className="text-xs text-emerald-400 mb-3">
                    {item.effect}
                  </div>
                )}

                <button
                  onClick={() => handlePurchase(item)}
                  disabled={currency < item.price || purchasingId === item.id}
                  className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                    currency < item.price
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : purchasingId === item.id
                        ? 'bg-amber-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                  }`}
                >
                  {purchasingId === item.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      購買中...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <Coins className="w-4 h-4" />
                      {item.price}
                    </span>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 購買確認彈窗 */}
      <AnimatePresence>
        {showPurchaseConfirm && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowPurchaseConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-sm w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Gift className="w-16 h-16 text-amber-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">確認購買</h3>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400">商品</span>
                  <span className="text-white">{selectedItem.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400">價格</span>
                  <span className="text-amber-400">{selectedItem.price} 金幣</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-slate-400">餘額</span>
                  <span className={currency - selectedItem.price >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {currency - selectedItem.price} 金幣
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseConfirm(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmPurchase}
                  disabled={currency < selectedItem.price}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  確認購買
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameStore;
