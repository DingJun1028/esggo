/**
 * ⚡ Quick Action Buttons Component
 * --------------------------------------------------
 * [核心] 快速操作浮動按鈕
 * [功能] 收藏、收錄、建議等快速操作
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star, FileText, Lightbulb, Globe } from 'lucide-react';

interface QuickActionButtonsProps {
  onFavorite: () => void;
  onCapture: () => void;
  onSuggest: () => void;
  onScrape?: () => void;
  language?: 'zh-TW' | 'en';
}

const actions = [
  { id: 'favorite', icon: Star, labelZh: '收藏', labelEn: 'Favorite', color: 'text-yellow-400' },
  { id: 'capture', icon: FileText, labelZh: '收錄', labelEn: 'Capture', color: 'text-blue-400' },
  { id: 'suggest', icon: Lightbulb, labelZh: '建議', labelEn: 'Suggest', color: 'text-purple-400' },
  { id: 'scrape', icon: Globe, labelZh: '爬蟲', labelEn: 'Scrape', color: 'text-cyan-400' },
];

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onFavorite,
  onCapture,
  onSuggest,
  onScrape,
  language = 'zh-TW',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'favorite':
        onFavorite();
        break;
      case 'capture':
        onCapture();
        break;
      case 'suggest':
        onSuggest();
        break;
      case 'scrape':
        onScrape?.();
        break;
    }
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9998]">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 space-y-2"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAction(action.id)}
                className="flex items-center gap-3 px-4 py-3 bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl hover:border-purple-500/50 transition-all shadow-lg group w-full"
              >
                <action.icon
                  size={18}
                  className={`${action.color} group-hover:scale-110 transition-transform`}
                />
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  {language === 'zh-TW' ? action.labelZh : action.labelEn}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Zap size={24} className="text-white" />
        </motion.div>
      </motion.button>
    </div>
  );
};
