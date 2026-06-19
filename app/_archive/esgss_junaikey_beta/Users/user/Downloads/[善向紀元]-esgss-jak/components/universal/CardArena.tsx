import React, { useState } from 'react';
import { EsgCard, getEsgCards } from '../../types';

interface CardArenaProps {
  onCardAction: (cardId: string, action: string) => void;
}

const CardArena: React.FC<CardArenaProps> = ({ onCardAction }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const cards = getEsgCards('zh-TW');

  const handleCardClick = (card: EsgCard) => {
    setSelectedCard(card.id);
  };

  const handleAction = (action: string) => {
    if (selectedCard) {
      onCardAction(selectedCard, action);
      setSelectedCard(null);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
          ESG 萬能卡牌競技場
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedCard === card.id
                  ? 'ring-4 ring-emerald-400 shadow-2xl'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className={`bg-white rounded-xl p-6 shadow-md border-l-4 ${
                card.rarity === 'Legendary' ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100' :
                card.rarity === 'Epic' ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100' :
                card.rarity === 'Rare' ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100' :
                'border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{card.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    card.rarity === 'Legendary' ? 'bg-yellow-200 text-yellow-800' :
                    card.rarity === 'Epic' ? 'bg-purple-200 text-purple-800' :
                    card.rarity === 'Rare' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {card.rarity}
                  </span>
                </div>

                <p className="text-slate-600 mb-4 line-clamp-3">{card.description}</p>

                <div className="flex justify-between items-center text-sm">
                  <div className="text-slate-500">
                    <div>攻擊: {card.stats.offense}</div>
                    <div>防禦: {card.stats.defense}</div>
                  </div>
                  <div className="text-slate-500 capitalize">
                    {card.attribute}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
                選擇行動
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => handleAction('equip')}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  裝備卡牌
                </button>

                <button
                  onClick={() => handleAction('synthesize')}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  合成卡牌
                </button>

                <button
                  onClick={() => handleAction('decompose')}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  分解卡牌
                </button>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardArena;