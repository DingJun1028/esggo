import React, { useState, useMemo, useCallback } from 'react';
import { Search, X, Command } from 'lucide-react';
import { View } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarSearchProps {
  items: Array<{ id: View; label: string; keywords?: string[] }>;
  onSelect: (id: View) => void;
  onClose: () => void;
}

/**
 * 側邊欄搜索組件 (Upgraded to Omni Search Projection)
 * 從奧秘晶體 (右下角) 投影展開
 */
export const SidebarSearch: React.FC<SidebarSearchProps> = ({ items, onSelect, onClose }) => {
  const [query, setQuery] = useState('');

  // 模糊搜索算法
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(lowerQuery);
      const keywordMatch = item.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery));
      return labelMatch || keywordMatch;
    });
  }, [query, items]);

  // 處理項目選擇
  const handleSelect = useCallback(
    (id: View) => {
      onSelect(id);
      onClose();
    },
    [onSelect, onClose]
  );

  // 處理鍵盤事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && filteredItems.length > 0 && filteredItems[0]) {
        handleSelect(filteredItems[0].id);
      }
    },
    [filteredItems, handleSelect, onClose]
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.1,
          x: '40vw', // Start from roughly bottom right
          y: '40vh',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.1,
          x: '40vw',
          y: '40vh',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl mx-4 bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden relative pointer-events-auto"
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

        {/* 搜索輸入 */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 relative z-10">
          <Search className="w-5 h-5 text-cyan-400 animate-pulse" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="OMNI SEARCH... (Type to retrieve knowledge)"
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-lg font-mono tracking-wide"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* 搜索結果 */}
        <div className="max-h-[60vh] overflow-y-auto relative z-10 custom-scrollbar">
          {filteredItems.length > 0 ? (
            <div className="py-2">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-cyan-500/10 transition-colors text-left group border-l-2 border-transparent hover:border-cyan-400"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400/30 group-hover:bg-cyan-400 transition-colors" />
                  <span className="text-base text-slate-300 group-hover:text-cyan-100 font-medium transition-colors">
                    {item.label}
                  </span>
                  <Command className="ml-auto w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <Search className="w-8 h-8 text-slate-700" />
              <p className="text-slate-500 text-sm font-mono">NO DATA FOUND IN OMNIVERSE</p>
            </div>
          )}
        </div>

        {/* 提示 */}
        <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono relative z-10 bg-black/20">
          <span className="flex items-center gap-1">PROJECTION FROM OMNI CRYSTAL</span>
          <div className="flex gap-3">
            <span>⏎ SELECT</span>
            <span>ESC CLOSE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
