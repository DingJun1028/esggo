import React, { useState } from 'react';
import { EsgCard, getEsgCards, Language } from '@/types';
import { Sparkles, Trophy, Target } from '../icons';

interface CardArenaProps {
  onCardAction?: (cardId: string, action: string) => void;
}

const CardArena: React.FC<CardArenaProps> = ({ onCardAction }) => {
  const [selectedCard, setSelectedCard] = useState<EsgCard | null>(null);
  const [language] = useState<Language>('zh-TW');
  const cards = getEsgCards(language);

  const rarityColors: Record<string, string> = {
    Basic: 'from-slate-500 to-slate-700', // 基礎
    Common: 'from-slate-500 to-slate-700', // 奧秘 (Fallback)
    Rare: 'from-blue-500 to-blue-700', // 稀有
    Epic: 'from-purple-500 to-purple-700', // 史詩
    Legendary: 'from-amber-400 to-orange-600', // 傳說
    Zenith: 'from-rose-500 to-red-800', // 巔峰
    Emergent: 'from-indigo-400 to-cyan-500', // 湧現
  };

  const rarityLabels: Record<string, string> = {
    Basic: '基礎 (Basic)',
    Common: '奧秘 (Common)',
    Rare: '稀有 (Rare)',
    Epic: '史詩 (Epic)',
    Legendary: '傳說 (Legendary)',
    Zenith: '巔峰 (Zenith)',
    Emergent: '湧現 (Emergent)',
  };

  const attributeIcons = {
    Vision: '👁️',
    Governance: '⚖️',
    Knowledge: '📚',
    Impact: '💥',
    Virtue: '💖',
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-[#FFD700] w-8 h-8" />
            Impact Nexus : 卡牌競技場
            <span className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30 text-[10px] uppercase font-mono px-2 py-0.5 rounded">
              v8.4.0_10_Point_Scale
            </span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            收集、學習、競技 - 奧秘永續卡牌系統 (5T 零幻覺驗證)
          </p>
        </div>
        <div className="bg-[#FFD700]/10 border border-[#FFD700]/20 px-4 py-2 rounded-full flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFD700]" />
          <span className="text-[#FFD700] text-xs font-bold">{cards.length} 張卡片</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '收藏進度', value: '18/50', color: 'emerald' },
          { label: '稀有度積分', value: '1,240', color: 'amber' },
          { label: '10分制戰力', value: '8.4', color: 'blue' },
          { label: '信譽等級', value: '10/10', color: 'purple' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 premium-panel-glow"
          >
            <div className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">
              {stat.label}
            </div>
            <div className={`text-2xl font-black text-${stat.color}-400`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Card Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          你的卡牌收藏 (SSOT 契約封印)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className={`relative bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 border-2 transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
                selectedCard?.id === card.id
                  ? 'border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.2)]'
                  : 'border-white/5 hover:border-white/20 shadow-xl'
              }`}
            >
              {/* Rarity Gradient Header */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${rarityColors[card.rarity] || rarityColors.Basic} rounded-t-3xl`}
              />

              {/* Card Content */}
              <div className="mt-2">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">
                      {attributeIcons[card.attribute] || '🌟'}
                    </div>
                    <div>
                      <h3 className="text-gray-100 font-black text-lg group-hover:text-[#FFD700] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">
                        {card.term}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-gradient-to-r ${rarityColors[card.rarity] || rarityColors.BASIC} text-white border-0 shadow-lg`}
                  >
                    {rarityLabels[card.rarity] || card.rarity}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-6 line-clamp-2 leading-relaxed h-10">
                  {card.definition}
                </p>

                {/* 10-Point Combat Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/[0.03] rounded-2xl p-3 border border-white/5 flex flex-col items-center group-hover:bg-white/[0.05] transition-colors">
                    <div className="text-[8px] text-red-500/80 font-black uppercase tracking-[0.2em] mb-1">
                      ⚔️ ATK
                    </div>
                    <div className="text-xl font-black text-red-400">
                      {(card.stats?.offense || 0) / 10}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] rounded-2xl p-3 border border-white/5 flex flex-col items-center group-hover:bg-white/[0.05] transition-colors">
                    <div className="text-[8px] text-blue-500/80 font-black uppercase tracking-[0.2em] mb-1">
                      🛡️ DEF
                    </div>
                    <div className="text-xl font-black text-blue-400">
                      {(card.stats?.defense || 0) / 10}
                    </div>
                  </div>
                </div>

                {/* Collection Set */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase">
                    系列: {card.collectionSet}
                  </span>
                  <span className="text-[10px] text-slate-500">{card.cardType}</span>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Selected Card Detail Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div
              className={`h-2 bg-gradient-to-r ${rarityColors[selectedCard.rarity]} rounded-full mb-4`}
            />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{attributeIcons[selectedCard.attribute]}</span>
              <div>
                <h2 className="text-2xl font-black text-white">{selectedCard.title}</h2>
                <p className="text-sm text-slate-400">{selectedCard.term}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">定義</h3>
                <p className="text-white">{selectedCard.definition}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">說明</h3>
                <p className="text-slate-300">{selectedCard.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-500 uppercase mb-1">攻擊力</div>
                  <div className="text-3xl font-black text-red-400">
                    {selectedCard.stats?.offense || 0}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-500 uppercase mb-1">防禦力</div>
                  <div className="text-3xl font-black text-blue-400">
                    {selectedCard.stats?.defense || 0}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardArena;
