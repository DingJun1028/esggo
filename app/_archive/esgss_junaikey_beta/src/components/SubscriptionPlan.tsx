import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { type UserSubscription, SubscriptionTier } from '@/types/social';

export const SubscriptionPlan: React.FC = () => {
  const [currentSub, setCurrentSub] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    // Mock User ID
    const sub = await socialEconomyService.getUserSubscription('partner_1');
    setCurrentSub(sub);
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    await socialEconomyService.upgradeSubscription('partner_1', tier);
    await loadSubscription();
    setLoading(false);
  };

  const tiers = [
    {
      id: SubscriptionTier.FREE,
      name: '初覺級 (Initial Awakening)',
      price: '免費',
      features: ['🌱 單一夥伴槽位', '📦 基礎倉庫 (50格)', '⚡ 每日體力 5 點', '📚 基礎 ESG 知識庫'],
      color: 'from-slate-500 to-slate-400',
      buttonColor: 'bg-slate-600',
      icon: '🌱',
    },
    {
      id: SubscriptionTier.SUBSCRIBER,
      name: '覺他級 (Path of Enlightenment)',
      price: 'NT$ 150 / 月',
      features: [
        '🌿 解鎖第 2 夥伴槽位',
        '📦 雙倍倉庫 (200格)',
        '⚡ 每日體力 20 點',
        '🎁 每週稀有裝備空投',
        '📉 交易手續費 -10%',
      ],
      color: 'from-emerald-500 to-teal-400',
      buttonColor: 'bg-emerald-600',
      icon: '🌿',
    },
    {
      id: SubscriptionTier.SOVEREIGN,
      name: '自立利他級 (Sovereign Integration)',
      price: 'NT$ 300 / 月',
      features: [
        '🌳 解鎖第 3 夥伴槽位',
        '📦 無限倉庫容量',
        '⚡ 無限體力 (Infinity)',
        '👑 創建「永續學會」資格',
        '✨ 專屬 VIP 稱號與光環',
        '🚀 RAG 優先運算通道',
      ],
      color: 'from-amber-400 to-orange-500',
      buttonColor: 'bg-amber-600',
      icon: '👑',
    },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            VIP 訂閱計畫
          </h1>
          <p className="text-slate-400 text-lg">升級您的永續影響力，解鎖更多特權與資源</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map(tier => {
            const isCurrent = currentSub?.tier === tier.id;
            return (
              <div
                key={tier.id}
                className={`
                                    relative p-1 rounded-2xl transition-all duration-300 hover:-translate-y-2
                                    bg-gradient-to-b ${tier.color}
                                    ${isCurrent ? 'ring-4 ring-white/20 shadow-2xl scale-105 z-10' : 'opacity-90 hover:opacity-100'}
                                `}
              >
                <div className="bg-slate-900 rounded-xl p-6 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">{tier.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="text-3xl font-bold text-white mb-2">{tier.price}</div>
                  </div>

                  <div className="flex-grow space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-slate-300">
                        <span className="mr-3 text-emerald-400">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => !isCurrent && handleUpgrade(tier.id)}
                    disabled={isCurrent || loading}
                    className={`
                                            w-full py-3 rounded-lg font-bold text-white transition-all
                                            ${
                                              isCurrent
                                                ? 'bg-slate-700 cursor-default'
                                                : `${tier.buttonColor} hover:brightness-110 shadow-lg`
                                            }
                                        `}
                  >
                    {loading ? '處理中...' : isCurrent ? '當前方案' : '立即升級'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-slate-800/50 rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>❓</span> 常見問題
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300">
            <div>
              <h3 className="font-bold text-white mb-2">訂閱費用如何計算？</h3>
              <p className="text-sm">費用按月計算，隨時可以取消。取消後權益將保留至當期結束。</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">升級後體力會重置嗎？</h3>
              <p className="text-sm">是的，升級到更高級別時，您的每日體力將立即補滿至新上限。</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">什麼是 RAG 優先運算？</h3>
              <p className="text-sm">
                Pro 用戶的知識檢索請求將進入優先佇列，在伺服器繁忙時仍能保持光速回應。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">多開夥伴有什麼好處？</h3>
              <p className="text-sm">
                您可以同時培養專精於 E (環境)、S (社會)、G (治理) 的不同夥伴，組建全能團隊。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
