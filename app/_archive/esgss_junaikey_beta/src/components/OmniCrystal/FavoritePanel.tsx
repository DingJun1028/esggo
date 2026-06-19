/**
 * ⭐ Favorite Panel Component
 * --------------------------------------------------
 * [核心] 收藏面板
 * [功能] 顯示和管理收藏項目
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Tag, Trash2, Search } from 'lucide-react';
import { favoriteManager, Favorite, FavoriteType } from '@/services/favoriteManager';

interface FavoritePanelProps {
  onClose: () => void;
  language?: 'zh-TW' | 'en';
}

const typeIcons: Record<FavoriteType, string> = {
  conversation: '💬',
  response: '🤖',
  chart: '📊',
  note: '📝',
  insight: '💡',
};

const typeNames = {
  'zh-TW': {
    conversation: '對話',
    response: '回應',
    chart: '圖表',
    note: '筆記',
    insight: '洞察',
  },
  en: {
    conversation: 'Conversation',
    response: 'Response',
    chart: 'Chart',
    note: 'Note',
    insight: 'Insight',
  },
};

export const FavoritePanel: React.FC<FavoritePanelProps> = ({ onClose, language = 'zh-TW' }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [selectedType, setSelectedType] = useState<FavoriteType | 'all'>('all');
  const [searchText, setSearchText] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
    setAllTags(favoriteManager.getAllTags());
  }, [selectedType, searchText]);

  const loadFavorites = () => {
    const filter = {
      type: selectedType === 'all' ? undefined : selectedType,
      searchText: searchText || undefined,
    };
    setFavorites(favoriteManager.getFavorites(filter));
  };

  const handleDelete = async (id: string) => {
    await favoriteManager.removeFavorite(id);
    loadFavorites();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-slate-900/95 backdrop-blur-xl border-l border-purple-500/20 shadow-2xl z-[10001] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star size={20} className="text-yellow-400" />
            <h2 className="text-lg font-bold text-white">
              {language === 'zh-TW' ? '我的收藏' : 'My Favorites'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder={language === 'zh-TW' ? '搜尋收藏...' : 'Search favorites...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {language === 'zh-TW' ? '全部' : 'All'}
          </button>
          {Object.keys(typeIcons).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type as FavoriteType)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedType === type
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {typeIcons[type as FavoriteType]} {typeNames[language][type as FavoriteType]}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {favorites.length === 0 ? (
            <div className="text-center text-slate-500 mt-8">
              {language === 'zh-TW' ? '暫無收藏' : 'No favorites yet'}
            </div>
          ) : (
            favorites.map((fav, index) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeIcons[fav.type]}</span>
                    <h3 className="text-sm font-semibold text-white">{fav.metadata.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(fav.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>

                {fav.metadata.description && (
                  <p className="text-xs text-slate-400 mb-2">{fav.metadata.description}</p>
                )}

                {fav.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {fav.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-500 mt-2">
                  {new Date(fav.timestamp).toLocaleString(language === 'zh-TW' ? 'zh-TW' : 'en-US')}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
