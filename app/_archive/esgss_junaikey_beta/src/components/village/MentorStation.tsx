/**
 * 🎓 善向永續村 AI RPG 卡牌遊戲 - 導師駐點組件
 * ============================================================================
 * [來源備註] 源自 DingJun (洪鼎竣) 的善向永續村設計
 * [零幻覺驗證] 透過 Hash Lock 確保 Vibe Coding 過程數據不位移
 * 
 * 液態玻璃效果 UI 組件
 * 遵循 IComponentCore 規範
 * ============================================================================
 */

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Users, 
  Clock, 
  ChevronRight,
  GraduationCap,
  Zap
} from 'lucide-react';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import { INPCCard } from '@/types/npc';
import { getNPCCardsByCategory, NPC_CARDS } from '@/data/npcs';
import '../../styles/liquid-glass.css';

/**
 * 導師駐點 props
 */
export interface MentorStationProps {
  /** 是否展開 */
  isExpanded?: boolean;
  /** 當前語言 */
  language?: 'zh-TW' | 'en-US';
  /** 導師點擊處理 */
  onMentorSelect?: (mentor: INPCCard) => void;
  /** 類別名稱 */
  className?: string;
}

/**
 * 導師駐點組件
 */
export const MentorStation: React.FC<MentorStationProps> = memo(({
  isExpanded = false,
  language = 'zh-TW',
  onMentorSelect,
  className = '',
}) => {
  const isZh = language === 'zh-TW';
  const [expanded, setExpanded] = useState(isExpanded);
  const [selectedMentor, setSelectedMentor] = useState<INPCCard | null>(null);

  // IComponentCore 元數據
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'components/village/MentorStation.tsx',
      '1.0.0',
      ['Mentor', 'Village', 'NPC', 'LiquidGlass']
    )
  );

  // 獲取導師層 NPC
  const mentors = getNPCCardsByCategory('mentor');

  // 導師駐點翻譯
  const translations = {
    stationTitle: isZh ? '導師駐點' : 'Mentor Station',
    stationSubtitle: isZh ? '向賢者學習智慧' : 'Learn wisdom from the wise',
    availableMentors: isZh ? '可用導師' : 'Available Mentors',
    clickToInteract: isZh ? '點擊互動' : 'Click to interact',
    skills: isZh ? '技能' : 'Skills',
    resonance: isZh ? '共鳴值' : 'Resonance',
    function: isZh ? '村莊功能' : 'Village Function',
    close: isZh ? '關閉' : 'Close',
    consult: isZh ? '諮詢' : 'Consult',
  };

  const handleMentorClick = (mentor: INPCCard) => {
    setSelectedMentor(mentor);
    onMentorSelect?.(mentor);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      {/* 液態玻璃背景 */}
      <div className="liquid-glass-panel absolute inset-0" />

      {/* 內容容器 */}
      <div className="relative z-10 p-5">
        {/* 標題區 */}
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl">
              <GraduationCap size={20} className="text-amber-400" />
            </div>
            <div>
              <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-100">
                {translations.stationTitle}
              </h4>
              <p className="text-[10px] text-slate-400 uppercase">
                {translations.stationSubtitle}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={20} className="text-slate-400" />
          </motion.div>
        </div>

        {/* 展開內容 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* 可用導師列表 */}
              <div className="mb-4">
                <p className="text-[10px] text-slate-500 uppercase mb-2">
                  {translations.availableMentors}
                </p>
                <div className="space-y-2">
                  {mentors.map((mentor) => (
                    <motion.div
                      key={mentor.uuid}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMentorClick(mentor)}
                      className={`relative p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedMentor?.uuid === mentor.uuid
                          ? 'bg-gradient-to-r from-amber-500/30 to-orange-600/30 border border-amber-500/50'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {/* 導師資訊 */}
                      <div className="flex items-start gap-3">
                        {/* 視覺風格圖標 */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-xl">
                          {mentor.visualStyle.includes('金色') ? '👑' : 
                           mentor.visualStyle.includes('青') ? '🧙' : '📜'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200">
                              {mentor.skills[0]?.nameZh || '未知'}
                            </span>
                            <span className="px-1.5 py-0.5 text-[8px] font-bold bg-amber-500/20 text-amber-400 rounded uppercase">
                              {mentor.pillar}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {mentor.village_function}
                          </p>
                        </div>
                        {/* RS 共鳴值 */}
                        <div className="flex items-center gap-1 text-amber-400">
                          <Zap size={12} />
                          <span className="text-xs font-bold">{mentor.rs_base}</span>
                        </div>
                      </div>

                      {/* 技能標籤 */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mentor.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill.id}
                            className="px-2 py-0.5 text-[8px] bg-white/5 text-slate-300 rounded-full"
                          >
                            {skill.nameZh}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 提示文字 */}
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <Sparkles size={12} className="text-amber-400" />
                <p className="text-[9px] text-slate-400">
                  {translations.clickToInteract}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 已選導師詳情 */}
        <AnimatePresence>
          {selectedMentor && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-3 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl border border-amber-500/20"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="text-xs font-bold text-amber-400">
                    {selectedMentor.skills[0]?.nameZh}
                  </h5>
                  <p className="text-[9px] text-slate-400">
                    {selectedMentor.village_function}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <Clock size={12} className="text-slate-400" />
                </button>
              </div>

              {/* 技能詳情 */}
              <div className="space-y-1 mb-2">
                {selectedMentor.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 text-[9px]">
                    <BookOpen size={10} className="text-amber-400" />
                    <span className="text-slate-300">{skill.nameZh}:</span>
                    <span className="text-slate-400">{skill.description}</span>
                  </div>
                ))}
              </div>

              {/* ESG 數據 */}
              <div className="flex items-center gap-2 text-[9px]">
                <span className="text-slate-500">ESG:</span>
                <span className="text-emerald-400">E:{selectedMentor.esgStats.E}</span>
                <span className="text-blue-400">S:{selectedMentor.esgStats.S}</span>
                <span className="text-purple-400">G:{selectedMentor.esgStats.G}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

MentorStation.displayName = 'MentorStation';
