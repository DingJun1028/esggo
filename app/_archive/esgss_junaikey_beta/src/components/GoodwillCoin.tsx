import React, { useState } from 'react';
import { Language } from '@/types';
import { Coins, TrendingUp, Gift, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const GoodwillCoin: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [selectedTab, setSelectedTab] = useState('overview');

  const transactions = [
    {
      type: 'earn',
      amount: 500,
      reason: isZh ? '完成月度 ESG 報告' : 'Completed monthly ESG report',
      time: '2 小時前',
    },
    {
      type: 'earn',
      amount: 250,
      reason: isZh ? '參與永續發展研討會' : 'Attended sustainability workshop',
      time: '1 天前',
    },
    {
      type: 'spend',
      amount: -100,
      reason: isZh ? '兌換 ESG 課程' : 'Redeemed ESG course',
      time: '2 天前',
    },
    {
      type: 'earn',
      amount: 1000,
      reason: isZh ? '碳減排目標達成' : 'Carbon reduction goal achieved',
      time: '3 天前',
    },
    {
      type: 'spend',
      amount: -200,
      reason: isZh ? '購買數位徽章' : 'Purchased digital badge',
      time: '5 天前',
    },
  ];

  const rewards = [
    {
      id: 1,
      name: isZh ? 'ESG 專業認證課程' : 'ESG Professional Certification',
      cost: 500,
      category: '學習',
    },
    {
      id: 2,
      name: isZh ? '限量版 NFT 徽章' : 'Limited Edition NFT Badge',
      cost: 800,
      category: '收藏品',
    },
    {
      id: 3,
      name: isZh ? '永續發展顧問諮詢' : 'Sustainability Consulting',
      cost: 1500,
      category: '服務',
    },
    {
      id: 4,
      name: isZh ? '企業 ESG 工具包' : 'Corporate ESG Toolkit',
      cost: 300,
      category: '工具',
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Coins className="text-amber-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            {isZh ? '善向幣錢包' : 'Goodwill Coin Wallet'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh
              ? '透過永續行動賺取獎勵，兌換專屬權益'
              : 'Earn rewards through sustainable actions'}
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-amber-600/90 to-orange-700/90 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-amber-100 text-sm font-semibold mb-2">
                {isZh ? '可用餘額' : 'Available Balance'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">85,000</span>
                <span className="text-amber-100 text-xl">GWC</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-bold">+12.5%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-amber-100 text-xs mb-1">
                {isZh ? '本月賺取' : 'Earned This Month'}
              </p>
              <p className="text-white text-lg font-bold">+2,450</p>
            </div>
            <div>
              <p className="text-amber-100 text-xs mb-1">
                {isZh ? '本月花費' : 'Spent This Month'}
              </p>
              <p className="text-white text-lg font-bold">-300</p>
            </div>
            <div>
              <p className="text-amber-100 text-xs mb-1">{isZh ? '等級排名' : 'Rank'}</p>
              <p className="text-white text-lg font-bold">#127</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cyan-500/10">
        {[
          { id: 'overview', label: isZh ? '總覽' : 'Overview' },
          { id: 'earn', label: isZh ? '賺取' : 'Earn' },
          { id: 'rewards', label: isZh ? '兌換' : 'Rewards' },
          { id: 'history', label: isZh ? '歷史' : 'History' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-2 font-semibold transition-all ${
              selectedTab === tab.id
                ? 'text-amber-400 border-b-2 border-amber-400 shadow-[0_4px_10px_-4px_rgba(245,158,11,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              {isZh ? '快速賺取' : 'Quick Earn'}
            </h3>
            <div className="space-y-3">
              {[
                { task: isZh ? '完成每日簽到' : 'Daily Check-in', reward: '+10 GWC' },
                { task: isZh ? '分享 ESG 成果' : 'Share ESG Achievement', reward: '+50 GWC' },
                { task: isZh ? '邀請新用戶' : 'Invite New User', reward: '+200 GWC' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="text-white text-sm">{item.task}</span>
                  <span className="text-emerald-400 font-bold text-sm">{item.reward}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              {isZh ? '熱門兌換' : 'Popular Rewards'}
            </h3>
            <div className="space-y-3">
              {rewards.slice(0, 3).map(reward => (
                <div
                  key={reward.id}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{reward.name}</p>
                    <p className="text-xs text-slate-400">{reward.category}</p>
                  </div>
                  <span className="text-amber-400 font-bold text-sm">{reward.cost} GWC</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map(reward => (
            <div
              key={reward.id}
              className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-5 hover:border-amber-500/50 transition-all group hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold mb-1 group-hover:text-amber-400 transition-colors">
                    {reward.name}
                  </h3>
                  <span className="text-xs text-slate-500 uppercase">{reward.category}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-amber-400">{reward.cost} GWC</span>
                <button className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                  {isZh ? '兌換' : 'Redeem'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'history' && (
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-white font-bold mb-4">{isZh ? '交易記錄' : 'Transaction History'}</h3>
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800/80 transition-colors border border-transparent hover:border-cyan-500/10"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'earn' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                    }`}
                  >
                    {tx.type === 'earn' ? (
                      <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{tx.reason}</p>
                    <p className="text-xs text-slate-500">{tx.time}</p>
                  </div>
                </div>
                <span
                  className={`text-lg font-bold ${tx.type === 'earn' ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {tx.amount > 0 ? '+' : ''}
                  {tx.amount} GWC
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
