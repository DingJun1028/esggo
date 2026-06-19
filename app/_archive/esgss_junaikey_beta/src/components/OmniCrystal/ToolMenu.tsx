/**
 * 🔧 Tool Menu Component
 * --------------------------------------------------
 * [核心] 環形工具選單
 * [功能] 6個奧秘圓通的視覺化展示與選擇
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BarChart, Target, Lightbulb, FileText, Settings } from 'lucide-react';
import { OmniTool } from './types';

interface ToolMenuProps {
  onSelect: (skillId: string) => void;
  onClose: () => void;
  language?: 'zh-TW' | 'en';
}

const tools: OmniTool[] = [
  {
    id: 'search',
    name: '深度搜尋',
    nameEn: 'Deep Search',
    icon: 'Search',
    skillId: 's_deep_search',
    description: '搜尋系統中的任何資訊',
    descriptionEn: 'Search any information in the system',
  },
  {
    id: 'analysis',
    name: '數據分析',
    nameEn: 'Data Analysis',
    icon: 'BarChart',
    skillId: 's_data_analysis',
    description: '分析數據趨勢與洞察',
    descriptionEn: 'Analyze data trends and insights',
  },
  {
    id: 'tracking',
    name: '目標追蹤',
    nameEn: 'Goal Tracking',
    icon: 'Target',
    skillId: 's_goal_tracking',
    description: '追蹤目標達成進度',
    descriptionEn: 'Track goal achievement progress',
  },
  {
    id: 'advisor',
    name: '智能建議',
    nameEn: 'AI Advisor',
    icon: 'Lightbulb',
    skillId: 's_seraphim_advisor',
    description: '獲取智能建議與指導',
    descriptionEn: 'Get intelligent advice and guidance',
  },
  {
    id: 'note',
    name: '快速筆記',
    nameEn: 'Quick Note',
    icon: 'FileText',
    skillId: 's_quick_note',
    description: '快速記錄想法與備註',
    descriptionEn: 'Quickly record ideas and notes',
  },
  {
    id: 'settings',
    name: '系統設定',
    nameEn: 'Settings',
    icon: 'Settings',
    skillId: 'settings',
    description: '調整系統設定',
    descriptionEn: 'Adjust system settings',
  },
];

const iconMap = {
  Search,
  BarChart,
  Target,
  Lightbulb,
  FileText,
  Settings,
};

export const ToolMenu: React.FC<ToolMenuProps> = ({ onSelect, onClose, language = 'zh-TW' }) => {
  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <motion.div
        className="absolute inset-0 bg-black/60"
        initial={{ backdropFilter: 'blur(0px)' }}
        animate={{ backdropFilter: 'blur(8px)' }}
        exit={{ backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}
      />

      {/* Tool Menu Container */}
      <motion.div
        className="relative"
        style={{ width: '300px', height: '300px' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          opacity: { duration: 0.2 },
        }}
      >
        {/* Center Crystal */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 shadow-[0_0_40px_rgba(168,85,247,0.4)] cursor-pointer"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
            {language === 'zh-TW' ? '關閉' : 'Close'}
          </div>
        </motion.div>

        {/* Tool Buttons */}
        {tools.map((tool, index) => {
          const angle = (360 / tools.length) * index - 90;
          const radian = (angle * Math.PI) / 180;
          const x = centerX + radius * Math.cos(radian);
          const y = centerY + radius * Math.sin(radian);
          const Icon = iconMap[tool.icon as keyof typeof iconMap];

          return (
            <motion.button
              key={tool.id}
              initial={{ scale: 0, opacity: 0, x: centerX, y: centerY }}
              animate={{ scale: 1, opacity: 1, x, y }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-400/40 hover:border-cyan-400/60 hover:from-purple-400/30 hover:to-blue-400/30 transition-all duration-300 shadow-lg flex flex-col items-center justify-center group"
              onClick={e => {
                e.stopPropagation();
                onSelect(tool.skillId);
                onClose();
              }}
              title={language === 'zh-TW' ? tool.description : tool.descriptionEn}
            >
              <Icon
                size={22}
                className="text-purple-300 group-hover:text-cyan-300 transition-colors"
              />
              <span className="text-[11px] text-slate-200 mt-1 group-hover:text-white font-medium transition-colors">
                {language === 'zh-TW' ? tool.name : tool.nameEn}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
