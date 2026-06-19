import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { UserProfile, Furniture } from '../../shared/types';

export const MyCabin: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shopItems, setShopItems] = useState<Furniture[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userProfile = await socialEconomyService.getUserProfile('partner_1');
    setProfile(userProfile);
    setNewName(userProfile.nickname);

    const shop = await socialEconomyService.getShopFurniture();
    setShopItems(shop);
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    await socialEconomyService.updateNickname('partner_1', newName);
    setProfile(prev => (prev ? { ...prev, nickname: newName } : null));
    setIsEditingName(false);
  };

  const handleBuyItem = (item: Furniture) => {
    alert(`購買 ${item.name} 需要 ${item.price} GSC (模擬成功)`);
  };

  if (!profile) return <div className="text-white p-8">Loading Cabin...</div>;

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Header / Profile Section */}
      <div className="p-6 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
              <span className="text-4xl">🧑‍🚀</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="bg-slate-700 border border-slate-500 rounded px-2 py-1 text-white outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{profile.nickname}</h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    ✎
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              {profile.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-700 rounded text-xs text-yellow-500 border border-yellow-500/30"
                >
                  🏅 {badge.replace('badge_', '').replace('_', ' ')}
                </span>
              ))}
              <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400 border border-slate-600">
                + Add Badge
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">訪客數</div>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {profile.homeData.visitors}
            </div>
          </div>
          <button
            onClick={() => setShowShop(!showShop)}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform"
          >
            {showShop ? '回到小屋' : '精品商店'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto">
        {showShop ? (
          // Shop View
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {shopItems.map(item => (
              <div
                key={item.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-purple-500 transition-all group"
              >
                <div className="aspect-square bg-slate-900 rounded-lg mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                  {item.type === 'FURNITURE' ? '🪑' : item.type === 'DECORATION' ? '🪴' : '🛋️'}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <span
                      className={`text-xs ${
                        item.rarity === 'LEGENDARY'
                          ? 'text-orange-400'
                          : item.rarity === 'EPIC'
                            ? 'text-purple-400'
                            : item.rarity === 'RARE'
                              ? 'text-blue-400'
                              : 'text-slate-400'
                      }`}
                    >
                      {item.rarity}
                    </span>
                  </div>
                  <div className="text-yellow-400 font-bold">{item.price} G</div>
                </div>
                <button
                  onClick={() => handleBuyItem(item)}
                  className="w-full py-2 mt-2 bg-slate-700 hover:bg-purple-600 rounded-lg transition-colors font-bold"
                >
                  購買
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Cabin View
          <div className="h-full w-full p-8 flex items-center justify-center relative">
            {/* Room Background */}
            <div className="relative w-full max-w-4xl aspect-video bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden">
              {/* Window */}
              <div className="absolute top-10 left-10 w-32 h-48 bg-cyan-900/30 border-4 border-slate-600 rounded-t-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>
                <div className="w-full h-full flex items-center justify-center opacity-20 text-4xl">
                  🌙
                </div>
              </div>

              {/* Furniture Placeholders */}
              <div className="absolute bottom-0 left-20 w-48 h-32 bg-slate-700 rounded-t-xl flex items-center justify-center text-slate-500 border-t border-x border-slate-600">
                辦公桌 (Empty)
              </div>
              <div className="absolute bottom-0 right-32 w-24 h-40 bg-slate-700 rounded-t-xl flex items-center justify-center text-slate-500 border-t border-x border-slate-600">
                書櫃 (Empty)
              </div>

              {/* Character */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-48 bg-transparent flex flex-col items-center justify-end animate-bounce-slow">
                <div className="text-6xl">🧑‍🚀</div>
                <div className="w-16 h-4 bg-black/30 rounded-full blur-sm mt-2"></div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 text-slate-500 text-sm">
              點擊 "編輯模式" 來佈置您的家具
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
